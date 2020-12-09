const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const { nanoid } = require("nanoid");

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    token: String,
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  this.password = bcryptjs.hashSync(this.password, bcryptjs.genSaltSync(10));
  this.token = nanoid();
  next();
});

module.exports = mongoose.model("user", userSchema);
