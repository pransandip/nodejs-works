module.exports = {
  apps: [
    {
      name: "prisma-auth",
      cwd: "Users\\Sandip\\Documents\\GitHub\\nodejs-works\\004-node-mongodb-prisma",
      script: "src\\index.js",
      watch: true,
      ignore_watch: ["node_modules"],
      exec_mode: "fork",
      instances: 1,                // Use 0 for cluster mode with max CPUs
      autorestart: true,           // Restart app on crash
      max_memory_restart: "1G",    // Optional memory limit
      env: {
        NODE_ENV: "development",
        PORT: 3000
      },
      output: "./logs/out.log", 
      error: "./logs/error.log"
    }
  ]
};
