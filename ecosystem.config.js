export default {
  apps: [
    {
      name: "bun-jobs",
      script: "node_modules/.bin/bun",
      args: "run jobs:start",
      exec_mode: "fork",
      max_memory_restart: "1G",
      restart_delay: 3000,
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};
