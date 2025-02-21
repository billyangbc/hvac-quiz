// for pm2
// Install pm2: npm install pm2 -g
// Build app: pnpm build
// Run app: pm2 start
// Check app: pm2 list
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