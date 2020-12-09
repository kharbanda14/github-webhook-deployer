const { model, Schema } = require("mongoose");

const activitySchema = new Schema(
  {
    title: String,
    description: String,
    user: {
      name: String,
      avatar: String,
    },
    action: String,
  },
  { timestamps: true }
);

module.exports = model("activity", activitySchema);
