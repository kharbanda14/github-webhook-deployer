const mongoose = require("mongoose");
const mongoosePaginateV2 = require("mongoose-paginate-v2");
const logger = require("./lib/logger");
const { mongooseSoftDelete } = require("./lib/plugins/mongoose/soft-delete");

mongoose.plugin(mongoosePaginateV2);
mongoose.plugin(mongooseSoftDelete);

if (process.env.LOG_LEVEL == "debug") {
  mongoose.set("debug", true);
}
mongoose
  .connect(process.env.DATABASE, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
  })
  .then(() => logger.info("Database Connected"))
  .catch(() => logger.error("Error in connecting to database"));

module.exports = mongoose;
