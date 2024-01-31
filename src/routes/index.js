// Import Routes
const WelcomeRoute=require('./welcomeRoute');
const rateLimit =require('express-rate-limit');
const CreatError =require('http-errors');
const config = require("../config/db.config.js");
const utils = require("../controllers/helpers/utils");
const sendMail =require('../controllers/helpers/mailSend');
module.exports = app => {
  // const limit = rateLimit({
  //   windowMs: 1 * 60 * 1000, // 1 minute window
  //   max: 5000, // Increase the limit to 5000 requests per `window` (here, per 1 minute)
  //   standardHeaders: true,
  //   legacyHeaders: false,
  //   message: 'Too many request created from this IP. Please try again after ${windowMs / (60 * 1000)} minutes.' // Error message
  // });

   

  //Route Middlewares
//app.use(limit)// Setting limit on specific route
  //Route Middlewares
app.use('/',WelcomeRoute);
app.use('/notificationService',WelcomeRoute);
app.use('/api/monistash/websocket',WelcomeRoute);

app.use((req,res,next) =>{
const error =new Error('Not found');
error.message ="Route Not found"
error.status= 404;
next(error);
});

app.use((error,req,res,next) => {

  //console.log(error);
  let ip = (req.headers["x-forwarded-for"] || "").split(",").pop().trim() ||
  req.connection.remoteAddress ||
  req.socket.remoteAddress ||
  req.connection.socket.remoteAddress;
  console.log("Middleware Error Handling");

   if (
    error.errno === 'ECONNREFUSED' ||
    error.code === 'ETIMEDOUT' ||
    error.code === 'EHOSTUNREACH' ||
    error.code === 'ENETUNREACH' ||
    error.code === 'ECONNRESET'
  ) {
    let statusCode;
    let errorMessage;
    if (error.errno === 'ECONNREFUSED') {
      statusCode = 503; // Service Unavailable
      errorMessage = '❌ Network error: Connection Refused ❌';
    } else if (error.code === 'ETIMEDOUT') {
      statusCode = 504; // Gateway Timeout
      errorMessage = '❌ Network error: Request Timed Out ❌';
    } else if (error.code === 'EHOSTUNREACH') {
      statusCode = 502; // Bad Gateway
      errorMessage = '❌ Network error: Host Unreachable ❌';
    } else if (error.code === 'ENETUNREACH') {
      statusCode = 502; // Bad Gateway
      errorMessage = '❌ Network error: Network Unreachable ❌';
    } else if (error.code === 'ECONNRESET') {
      statusCode = 503; // Service Unavailable
      errorMessage = '❌ Network error: Connection Reset ❌';
    }
   
    throw utils.createHttpError(errorMessage,statusCode);  
   
  }
  const errorData=error?.data ||error?.response?.data;
  const errStatus =error?.status || error?.statusCode || error?.response?.status || 500;
  const errMsg = error.message ||  '❌ Whoops,  Something went wrong ...... ❌';
  let values2 = {
    email: "kennygendowed@gmail.com",
    name: "kennyendowed",
   title : "monistash  Error Log Report REQUEST",
   ip:ip,errStatus,errMsg,
   error
  };
 //sendMail(req,values2);
let devStack ={
 stack: error.stack,
 details:(errStatus) ? errorData : {}
}
//console.log(devStack);
return res.status(errStatus).json({
  status: "FALSE",
  //success: false,
  data: [
    {
      code: errStatus,
      message: errMsg ,
      data: "",
      stack: config.NODE_ENV == 'staging' ? devStack : {}
    },
  ],
 
 });

});





};