module.exports.APP_STATUS = {
  ACTIVE: "active",
  DISABLED: "disabled",

  all() {
    return [this.ACTIVE, this.DISABLED];
  },
};

module.exports.APP_STATUS_LABEL = {
  [this.APP_STATUS.ACTIVE]: "Activated",
  [this.APP_STATUS.DISABLED]: "Disabled",
};
