# How to use
```bash
# Start the app
    pm2 start ecosystem.config.js --env production

# View logs
    pm2 logs

# Monitor
    pm2 monit

# Save & startup
    pm2 save
    pm2 startup
```

### `exec_mode: "fork"` — What does it do?
In PM2, the `exec_mode` setting controls how your application is run. There are two main modes:

1. `fork mode` — (Single process)

2. `cluster mode` — (Multi-process, load-balanced)

### `fork` Mode (what you're using)
```js
exec_mode: "fork"
```

This tells PM2 to run your app as a single Node.js process, similar to running:

```bash
node src/index.js
```

### Use fork mode when:
- Your app doesn’t need to scale across multiple CPU cores.
- You’re in development or running a lightweight app.
- You want simpler logs and debugging.

### When to use `cluster` mode?
```js
exec_mode: "cluster",
instances: 4
```
This runs multiple instances of your app (equal to instances or number of CPU cores) and load balances incoming requests across them.

### Useful for:
- Scaling performance in production
- Handling high traffic
- Full CPU utilization

## Summary
|  mode      |          Description           |         Use Case             |
| :----------|:------------------------------:|:-----------------------------|
| `fork`     |  Single process (default)      | Simpler, dev or low load     |
| `cluster`  |  Multi-process, load balanced  | Production, high performance |


