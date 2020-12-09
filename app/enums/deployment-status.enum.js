module.exports.DEPLOYMENT_STATUS = {
  QUEUED: "Queued",
  PROCESSING: "Processing",
  ACTIVE: "Active",
  COMPLETED: "Completed",
  FAILED: "Failed",

  all() {
    return [
      this.QUEUED,
      this.PROCESSING,
      this.ACTIVE,
      this.COMPLETED,
      this.FAILED,
    ];
  },
};

module.exports.DEPLOYMENT_STATUS_CLASS = {
  [this.DEPLOYMENT_STATUS.COMPLETED]: "bg-green-200",
  [this.DEPLOYMENT_STATUS.QUEUED]: "bg-blue-200",
  [this.DEPLOYMENT_STATUS.FAILED]: "bg-red-200",
  [this.DEPLOYMENT_STATUS.ACTIVE]: "bg-pink-400",
};
