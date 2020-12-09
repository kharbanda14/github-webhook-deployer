const crypto = require("crypto");

module.exports = {
  async verify(app, body, headers) {
    if (body.ref == app.targetBranch) {
      const sig =
        "sha1=" +
        crypto
          .createHmac("sha1", app.webhookSecret)
          .update(JSON.stringify(body))
          .digest("hex");

      if (sig == headers["x-hub-signature"]) {
        return true;
      }

      const err = new Error("Invalid Signature");
      err.statusCode = 400;
      throw err;
    }

    return false;
  },

  toDeployment(body, headers) {
    return {
      ref: body.ref,
      sender: body.sender,
      body,
      hookId: headers["x-github-hook-id"],
      head_commit: body.head_commit,
    };
  },
};
