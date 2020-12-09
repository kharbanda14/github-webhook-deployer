const { nanoid } = require("nanoid");
const { APPS_CATEGORY } = require("../../enums/app-category.enum");
const Apps = require("../../models/Apps");
const Deployments = require("../../models/Deployments");
const { ObjectID } = require("mongodb");
const {
  DEPLOYMENT_STATUS_CLASS,
  DEPLOYMENT_STATUS,
} = require("../../enums/deployment-status.enum");
const { saveActivity } = require("../../lib/activity");
const { APP_STATUS, APP_STATUS_LABEL } = require("../../enums/app-status.enum");

module.exports.appController = {
  async index(req, res, next) {
    const query = {};

    if (req.params.category) {
      query.category = req.params.category;
    }

    if (req.query.q) {
      query.name = new RegExp(req.query.q, "i");
    }

    const apps = await Apps.paginate(query, {
      sort: { "deployments.recentDeployment": -1 },
      limit: 10,
      page: req.query.page || 1,
    });

    res.render("dashboard/apps/index", {
      apps: apps,
      appCategories: await Apps.distinct("category"),
      params: req.params,
      query: req.query,
    });
  },

  create(req, res, next) {
    res.render("dashboard/apps/create", {
      category: APPS_CATEGORY.all(),
      randomSecret: nanoid(30),
      app: {},
    });
  },

  async edit(req, res, next) {
    const app = await Apps.findById(req.params.id);

    if (!app) {
      return next(new Error("Application not found"));
    }

    res.render("dashboard/apps/create", {
      category: APPS_CATEGORY.all(),
      randomSecret: app.webhookSecret,
      app,
    });
  },

  async listAppDeployments(req, res, next) {
    const app = await Apps.findById(req.params.id);

    const $where = {
      appId: ObjectID(req.params.id),
    };

    if (req.query.status) {
      $where["status"] = req.query.status;
    }

    const deployments = await Deployments.paginate($where, {
      sort: { _id: -1 },
      select: { body: 0 },
      limit: 10,
      page: req.query.page || 1,
    });
    if (!deployments || !app) {
      return next(new Error("Application not found"));
    }

    const deploymentStatusClass = DEPLOYMENT_STATUS_CLASS;
    const deploymentStatus = DEPLOYMENT_STATUS.all();

    res.render("dashboard/apps/deployments", {
      app,
      deployments,
      deploymentStatusClass,
      deploymentStatus,
      query: req.query,
      appStatus: APP_STATUS,
    });
  },

  async viewDeployment(req, res, next) {
    const app = await Apps.findById(req.params.id);

    const deployment = await Deployments.findById(req.params.deployment);

    if (!deployment || !app) {
      return next(new Error("Application not found"));
    }

    const deploymentStatusClass = DEPLOYMENT_STATUS_CLASS;

    deployment.body = JSON.stringify(deployment.body, null, "\t");

    res.render("dashboard/apps/view-deployment", {
      app,
      deployment: deployment,
      deploymentStatusClass,
      deploymentStatus: DEPLOYMENT_STATUS,
    });
  },

  async updateApp(req, res, next) {
    try {
      await Apps.findByIdAndUpdate(req.params.id, req.body);

      req.flash("success", "App Updated");

      return res.redirect("/dashboard/apps");
    } catch (error) {
      return next(error);
    }
  },

  async createApp(req, res, next) {
    try {
      req.body.user = req.user._id;
      req.body.status = APP_STATUS.ACTIVE;
      const app = new Apps(req.body);

      await app.save();

      saveActivity("app.created", req.user, app);

      req.flash("success", "App Created");

      return res.redirect("/dashboard/apps/deployments/" + app._id);
    } catch (error) {
      return next(error);
    }
  },

  async deleteApp(req, res, next) {
    const app = await Apps.findById(req.params.id);

    if (!app) {
      return next(new Error("Application not found"));
    }

    await app.softDelete();

    req.flash("success", `${app.name} was deleted`);
    return res.json({ message: "App deleted" });
  },

  async toggleAppState(req, res, next) {
    const app = await Apps.findById(req.params.id);

    if (!app) {
      return next(new Error("Application not found"));
    }

    await app.toggleState();

    await saveActivity("app.status.changed", req.user, app);

    req.flash("success", `${app.name} was ${APP_STATUS_LABEL[app.status]}`);
    return res.json({ message: "App is now " + app.status });
  },
};
