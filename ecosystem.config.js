module.exports = {
  apps: [
    {
      name: "node-approfondissement",
      script: "www/app.js",
      exec_mode: "cluster",
      instances: 3,
      max_memory_restart: "200M",

      // Logs
      error_file: "./logs/err.log",
      out_file: "./logs/out.log",

      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
