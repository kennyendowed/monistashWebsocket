const express= require('express');
const compression = require("compression");
const crypto = require("crypto");
const hpp = require('hpp');
const cors = require("cors");
const dotenv=require('dotenv');
const fileUpload = require('express-fileupload');
const xss = require('xss');
const app=express();
const Socketservices = require("./service");
const { createServer } = require("http");
const server = createServer(app);
const { Server } = require("socket.io");


app.disable('x-powered-by');
const config = require("./config/db.config");
 const rund=require("../src/config/inistial");
 dotenv.config();

 app.use((req, res, next) => {  
  res.setHeader('X-Content-Type-Options', 'nosniff');
   res.setHeader('X-Frame-Options', 'DENY');
    next();
  });
  // app.use(hpp({ allowDots: true }));


  const corsOptions = {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    // credentials: true,
  };
  
// Sanitize request inputs
app.use((req, res, next) => {
  for (let key in req.body) {
    req.body[key] = xss(req.body[key]);
  }
  next();
});
  app.use(cors(corsOptions));
  app.use(compression({
    level:6,
    threshold:100 * 1000,
    filter: shouldCompress
  }));
  function shouldCompress (req, res) {
  if (req.headers['x-no-compression']) {
    // don't compress responses with this request header
    return false
  }
 
  // fallback to standard filter function
  return compression.filter(req, res)
}
const socketIo = new Server(server, {
  cors: corsOptions,
});


const notificationsNamespace = socketIo.of("/api/monistash/socket/notifications");

//const conversationsNamespace = io.of("/api/socket/conversations");

notificationsNamespace.on("connection", (socketInstance) => {
    // Access the headers in the connection event handler
  
  socketInstance.emit("welcome","Welcome to monistash notification service");
  Socketservices.notificationSocket({
    socket: socketInstance,
    namespace: notificationsNamespace
  });

  

});

// conversationsNamespace.on("connection", (socketInstance) => {
//   services.conversationsSocket({
//     socket: socketInstance,
//     namespace: conversationsNamespace,
//   });
// });
// Generate a secure random key
const secretKey = crypto.randomBytes(64).toString('hex');

//console.log('Generated Secret Key:', secretKey);


//Middlewares
app.use(express.json({limit:'1000mb'}));
app.use(express.urlencoded({ limit: '1000mb', extended: true }));
// enable files upload
app.use(fileUpload({
  createParentPath: true
}));
app.use('/assets',express.static('assets'));
app.use('/logs',express.static('logs'));
app.use('/assets/uploads',express.static('assets/uploads'));

app.set('trust proxy', false);

//=== 1 - CONFIGURE ROUTES
//Configure Route
require('./routes/index')(app);





//     // set port, listen for requests
let nodeServer = server.listen(process.env.PORT, function (err,data) {

  if (err) {
    console.log("Error in server setup"+err)
    return
   }
  var host = nodeServer.address().address;
  var port = nodeServer.address().port;
  console.log('App working  listening at http://%s:%s/api/monistash/websocket', host, port);
 
});


// Export the io instance
//  module.exports = { };