module.exports = {
  apps: [
    {
      script: "./bin/www",
      name: "Git Webhook Deployer",
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
