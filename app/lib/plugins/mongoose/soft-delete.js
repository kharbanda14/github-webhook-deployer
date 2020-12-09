module.exports.mongooseSoftDelete = function (schema, options) {
  schema.add({ deletedAt: { type: Date, default: null } });

  schema.method("softDelete", async function () {
    this.deletedAt = new Date();
    await this.save();
  });
  schema.method("restore", async function () {
    this.deletedAt = null;
    await this.save();
  });

  schema.query.onlyDeleted = function () {
    return this.where({ deletedAt: { $ne: null } });
  };

  schema.query.withDeleted = function () {
    return this.where({ deletedAt: "all" });
  };

  schema.pre(/^(find|count|distinct)/, function (next) {
    const { deletedAt, ...query } = this.getFilter();
    if (!deletedAt) {
      this.where({ deletedAt: null });
    }
    if (deletedAt == "all") {
      this.setQuery(query);
    }
    next();
  });
};
