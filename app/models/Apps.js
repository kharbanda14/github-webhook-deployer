const { model, Schema } = require("mongoose");
const slugify = require("slugify");
const { APPS_CATEGORY } = require("../enums/app-category.enum");
const { APP_STATUS } = require("../enums/app-status.enum");
const Deployments = require("./Deployments");

const appSchema = new Schema(
  {
    name: String,
    slug: String,
    status: {
      type: String,
      enum: APP_STATUS.all(),
      default: APP_STATUS.ACTIVE,
    },
    description: String,
    webhookSecret: String,
    category: { type: String, enum: APPS_CATEGORY.all() },
    applicationDirectory: String,
    executeCommand: String,
    targetBranch: String,
    user: { type: Schema.Types.ObjectId, ref: "user" },
    deployments: {
      success: { type: Number, default: 0 },
      failure: { type: Number, default: 0 },
      recentDeployment: { type: Date, default: null },
    },
  },
  { timestamps: true }
);

appSchema.pre("save", function (next) {
  this.slug = slugify(this.name);
  next();
});

appSchema.methods.addDeployment = async function (data) {
  data.appId = this._id;
  const appDeployment = new Deployments(data);
  return await appDeployment.save();
};

appSchema.methods.toggleState = async function () {
  if (this.status == APP_STATUS.ACTIVE) {
    this.status = APP_STATUS.DISABLED;
  } else {
    this.status = APP_STATUS.ACTIVE;
  }
  await this.save();
};

module.exports = model("app", appSchema);
