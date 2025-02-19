module.exports = {
  apps: [
    {
      name: "hvac-quiz",
      script: "pnpm",
      args: "start",
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};