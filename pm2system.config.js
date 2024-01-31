module.exports = {
    apps: [{
      name: 'monistashWebsocket',
      script: 'src/server.js', // the path of the script you want to execute,
      // Options reference: https://pm2.keymetrics.io/docs/usage/application-declaration/
      instances: 1, //number of app instance to be launched
      exec_mode:"fork", //mode to start your app, can be “cluster” or “fork”, default fork
      autorestart: true, //true by default. if false, PM2 will not restart your app if it crashes or ends peacefully
      watch: false, //enable watch & restart feature, if a file change in the folder or subfolder, your app will get reloaded
      error_file: 'logs/pm2/err.log',
      out_file: 'logs/pm2/out.log',
      log_file: 'logs/pm2/combined.log',
      time: true,
      env: {
      },
    }],
  };