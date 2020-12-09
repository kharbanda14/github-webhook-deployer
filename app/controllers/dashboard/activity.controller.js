const Activity = require("../../models/Activity");

module.exports = {
  async index(req, res, next) {},

  async recentActivity(req, res, next) {
    const records = await Activity.find({}).sort({ _id: -1 }).limit(5);

    return res.json(records);
  },
};
