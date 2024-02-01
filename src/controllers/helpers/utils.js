
const crypto = require("crypto");
const axios = require("axios");
const sendMail = require("./mailSend");
const querystring = require("querystring");
const fs = require("fs");
const path = require("path");
const Decimal = require('decimal.js');
const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, printf, json } = format;
const config = require("../../config/db.config.js");

const algorithm = process.env.ALGORITHM;
2;
let logDate = new Date().toDateString();
// const Securitykey = process.env.SECURITYKEY;
// const initVector = process.env.INITVECTOR;

const AddMinutesToDate = async (date, minutes) => {
  return new Date(date.getTime() + minutes * 60000);
};
const CustomWistonlogger =(type,values,actionRequest) => {


  // define the custom settings for each transport (file, console)
  const options = {
    file: {
      level: type,
      filename: "logs/"+type+"_logs/"+type+"_" + logDate + ".log",
      handleExceptions: true,
      // maxsize: 5242880, // 5MB
      // maxFiles: 5,
      format:format.combine(
        format.colorize(),
       format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
       format.label({ label: actionRequest }),
       format.printf(
          (info) =>
            `${info.level}: ${[info.timestamp]}: ${JSON.stringify(info.message)}`
        )
      ),
    },
    console: {
      level: "debug",
      handleExceptions: true,
      format:format.combine(
       format.colorize(),
       format.simple(),
       format.label({ label: actionRequest }),
       format.printf(
        (info) =>
          `${info.level}: ${[info.timestamp]}: ${JSON.stringify(info.message)}`
      )
      ),
    },
  };
  const logLevels = {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4,
    trace: 5,
  };
  
  // instantiate a new Winston Logger with the settings defined above
  const loggerW =createLogger({
    defaultMeta: {
      service: "MbokConnect-service",
    },
    levels: logLevels,
    transports: [
      new transports.File(options.file),
      new transports.Console(options.console),
    ],
    exitOnError: false, // do not exit on handled exceptions
  });
  
  if(type =='info')loggerW.info({type:actionRequest,values})
  if(type =='error')loggerW.error({type:actionRequest,values})
  if(type =='warn')loggerW.warn({type:actionRequest,values})
  if(type =='debug')loggerW.debug({type:actionRequest,values})
  
  
  }

const createHttpError = (message, statusCode) => {
  // console.log({message,statusCode})
  const error = new Error(message);
  error.status = statusCode;
  return error;
};

async function SendRequest(method, url, data, headers) {
  let statusCode = 503;

  try {
    const response = await axios({
      method,
      url,
      data,
      headers,
    });
    // Handle the response here (e.g., return response.data or process it further)
    return response;
  } catch (error) {
    // Handle errors here (e.g., log the error or throw a custom error)
    // console.error('Request failed:', error);
    let netStatus;

    if (error.status) {
      netStatus = error.status;
    } else if (error.response && error.response.status) {
      netStatus = error.response.status;
    } else {
      // Handle specific error statuses and set respective error status code
      if (error.code === "EHOSTUNREACH") {
        netStatus = 501; // Gateway Error
      } else if (error.code === "ECONNREFUSED") {
        netStatus = 503; // Service Unavailable
      } else if (error.code === "ETIMEDOUT") {
        netStatus = 504; // Gateway Timeout
      } else if (error.code === "ECONNRESET") {
        netStatus = 500; // Internal Server Error
      } else if (error.code === "ENETUNREACH") {
        netStatus = 502; // Bad Gateway
      } else {
        netStatus = statusCode; // Default status code
      }
    }

    let errorMessage = error.message;
    if (error.response && error.response.data) {
      netStatus = statusCode;
      // Extract properties from the error response data
      //   const errorCode = error.response.data.responseCode;
      //   const errorDescription = error.response.data.responseMessage;
      //  const errorMMMessage = error.response.data.message;
      return {
        status: error.response?.status || netStatus,
        data: error.response.data,
      };

      //  errorMessage += `\nError Code: ${errorCode}\nErrorMessage: ${errorMMMessage}\nDescription: ${errorDescription}`;
    }
    throw createHttpError(errorMessage, netStatus);
    //throw new Error('Failed to send request: ' + error.message);
  }
}

const getBankName = async (bankCode) => {
  let statusCode = 503;
  const apiUrl = `${config.PAYSTACK_BASEURL}/bank`;

  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.PAYSTACK_SK}`,
      // 'x-consumer-unique-id': "02" + process.env.xConsumerUniqueId,
      // 'x-consumer-custom-id': CLIENT_ID
    },
    body: JSON.stringify({}), // Add payload here if needed
  };
  try {
    const UserWalletInfo = await SendRequest(
      options.method,
      apiUrl,
      options.body,
      options.headers
    );

    if (UserWalletInfo.status == 200) {
      // The update was successful
      console.log("Record retrived successfully");
      return UserWalletInfo.data.data.find((item) => item.code === bankCode)
        .name;
    } else {
      Errormessage = `❌Failed! Bank info retrived unsuccessfully ❌ ${UserWalletInfo}`;
      throw utils.createHttpError(Errormessage, 404);
    }
  } catch (error) {
    let errorMessage = error.message;
    let netStatus = error.status ? error.status : statusCode;
    error.status = netStatus;
    console.log({errorMessage, netStatus})
    throw createHttpError(errorMessage, netStatus);
  }
};

function workDays() {
  var d = new Date();
  var weekday = new Array(7);
  weekday[0] = "Sunday";
  weekday[1] = "Monday";
  weekday[2] = "Tuesday";
  weekday[3] = "Wednesday";
  weekday[4] = "Thursday";
  weekday[5] = "Friday";
  weekday[6] = "Saturday";

  var n = weekday[d.getDay()];
  return n;
}

// function comparePasswords(password,dbpassword, callback)
// {
// console.log('hello iam herer');
// bcrypt.compare(password, dbpassword, function(error, isMatch) {
//     if(error) {
//       return callback(error);
//     }

//     return callback(null, isMatch);
// });
// }

async function encrypt(Securitykey, initVector, req) {
  // generate 16 bytes of random data
  // const initVector = crypto.randomBytes(16);
  // console.log(req.body)
  // console.log(JSON.stringify(req.body))
  // protected data
  const stringData = req.body ? req.body : req;
  const message = JSON.stringify(stringData); // '{ firstname="akin", lastname="ade", mobile="08034743719", DOB=DateTime.Now, Gender="M", CURRENCYCODE="NGN",  ChannelID=1, ProductID=2 }';

  console.log(message);
  // secret key generate 32 bytes of random data
  // const Securitykey = crypto.randomBytes(32);

  // the cipher function
  const cipher = crypto.createCipheriv(algorithm, Securitykey, initVector);

  let encryptedData = cipher.update(message, "utf-8", "hex");

  encryptedData += cipher.final("hex");

  console.log("Encrypted message: " + encryptedData);

  return encryptedData;
}

async function dencrypt(Securitykey, initVector, req) {
  // console.log(req.body.data);
  let encryptedData = req;
  // the decipher function
  const decipher = crypto.createDecipheriv(algorithm, Securitykey, initVector);

  let decryptedData = decipher.update(encryptedData, "hex", "utf-8");

  decryptedData += decipher.final("utf8");

  console.log("Decrypted message: " + decryptedData);
  return decryptedData;
}

function differhuman(date) {
  let diffTime = Math.abs(new Date().valueOf() - new Date(date).valueOf());
  let days = diffTime / (24 * 60 * 60 * 1000);
  let hours = (days % 1) * 24;
  let minutes = (hours % 1) * 60;
  let secs = (minutes % 1) * 60;
  [days, hours, minutes, secs] = [
    Math.floor(days),
    Math.floor(hours),
    Math.floor(minutes),
    Math.floor(secs),
  ];

  // console.log(days+'d', hours+'h', minutes+'m', secs+'s');

  // // Make a fuzzy time
  // var delta = Math.round((+new Date - date) / 1000);

  // var minute = 60,
  // hour = minute * 60,
  // day = hour * 24,
  // week = day * 7;

  var fuzzy;
  if (days != 0 && hours != 0 && minutes != 0 && secs != 0) {
    fuzzy = [days + "d", hours + "h", minutes + "m", secs + "s"];
  } else if (minutes > 0) {
    fuzzy = [minutes + " minute"];
  } else if (secs > 0) {
    fuzzy = [secs + " seconds"];
  }

  // console.log(date)
  // console.log(delta)
  // if (delta < 30) {
  // fuzzy = 'just then.';
  // } else if (delta < minute) {
  // fuzzy = delta + ' seconds ago.';
  // } else if (delta < 2 * minute) {
  // fuzzy = 'a minute ago.'
  // } else if (delta < hour) {
  // fuzzy = Math.floor(delta / minute) + ' minutes ago.';
  // } else if (Math.floor(delta / hour) == 1) {
  // fuzzy = '1 hour ago.'
  // } else if (delta < day) {
  // fuzzy = Math.floor(delta / hour) + ' hours ago.';
  // } else if (delta < day * 2) {
  // fuzzy = 'yesterday';
  // }
  return fuzzy;
}

function getcurrentDate() {
  var currentDate = new Date();
  var day = ("0" + currentDate.getDate()).slice(-2);
  var month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
  var year = currentDate.getFullYear();

  var currentDateTime = year + "-" + month + "-" + day;
  return currentDateTime;
}

async function addMinutes(minutesToAdd = 20) {
  var currentDate = new Date();

  var futureDate = new Date(currentDate.getTime() + minutesToAdd * 60000);

  return futureDate;
}

function getPool(type) {
  var pool;
  switch (type) {
    case "pasgenerate":
      pool =
        "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      break;
    case "alnum":
      pool = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
      break;
    case "alpha":
      pool = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
      break;
    case "Calpha":
      pool = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      break;
    case "hexdec":
      pool = "0123456789abcdef";
      break;
    case "numeric":
      pool = "0123456789";
      break;
    case "nozero":
      pool = "123456789";
      break;
    case "distinct":
      pool = "2345679ACDEFHJKLMNPRSTUVWXYZ";
      break;
    default:
      pool = type;
      break;
  }

  return pool;
}

function secureCrypt(min, max) {
  var a = Math.floor(100000 + Math.random() * 900000);
  a = String(a);
  return (a = a.substring(0, max));
}

function token(length, type) {
  var token = "";
  var result = "";
  var max = getPool(type).length;
  for (var i = 0; i < length; i++) {
    result += crypto.randomBytes(length).toString("hex");
    // getPool(type).charAt(Math.floor(Math.random() * max));
  }

  for (var i = 0; i < length; i++) {
    token += result + [secureCrypt(0, max)];
    // token +=crypto.randomBytes(length).toString('hex');
  }

  return token;
}

function formatTime(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour "0" should be "12"
  minutes = minutes < 10 ? "0" + minutes : minutes;
  var strTime = hours + ":" + minutes + " " + ampm;
  return strTime;
}

function formatDate(date) {
  // return date.getDate() + "/" + new Intl.DateTimeFormat('en', { month: 'short' }).format(date) + "/" + date.getFullYear() + " " + strTime;
  return (
    date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()
  );
}

async function randomPin(length) {
  return Math.floor(
    Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1)
  );
}

async function randomChar(length, type) {
  var result = "";
  var characters = getPool(type);
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const TransReff = async () => {
  const randomChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; // Random characters
  let randomNumber = "";

  for (let i = 0; i < 11; i++) {
    const randomDigit = Math.floor(Math.random() * 10);
    randomNumber += randomDigit;
  }

  let randomCharsPart = "";

  for (let i = 0; i < 2; i++) {
    const randomCharIndex = Math.floor(Math.random() * randomChars.length);
    randomCharsPart += randomChars.charAt(randomCharIndex);
  }

  let initrandomCharsPart = "";

  for (let i = 0; i < 3; i++) {
    const randomCharIndex = Math.floor(Math.random() * randomChars.length);
    initrandomCharsPart += randomChars.charAt(randomCharIndex);
  }

  const betSlip = `${initrandomCharsPart}${randomNumber}${randomCharsPart}`;

  console.log({ betSlip });
  return betSlip;
};

function sendsEMail(email, uname, title, message) {
  try {
    let template = "index";
    let subject = title;
    let url = process.env.APP_URL;
    let name = uname;
    let to = email;
    let from = process.env.MAIL_FROM_ADDRESS;
    sendMail(template, name, to, from, subject, message);
    // res.status(200).send({
    // status: "TRUE",

    // });
  } catch (err) {
    console.log(err);
    return false;
    // return JSON.parse({
    // status: "FALSE",
    // data: [
    //     {
    //       code: 500,
    //       message:
    //         err.message ||
    //         "Technical Issue!, Please click on resend for verify your Email.",
    //     },
    // ],
    // });
  }
}

function DDMMYYYY(date) {
  var currentDate = new Date();
  var dd = ("0" + currentDate.getDate()).slice(-2);
  var MM = ("0" + (currentDate.getMonth() + 1)).slice(-2);
  var yyyy = currentDate.getFullYear();

  // var yyyy = date.getFullYear().toString();
  // var MM = getMonth(pad(date.getMonth() + 1, 2));
  // var dd = pad(date.getDate(), 2);

  return dd + "-" + MM + "-" + yyyy;
}

const sendsSMS = async (mobiles, message, title) => {
  try {
    const requestData = {
      username: process.env.SMS_USERNAME,
      password: process.env.SMS_PASSWORD,
      message: message,
      sender: title,
      mobiles: mobiles,
      response: "json",
    };
    
    const url = `https://portal.nigeriabulksms.com/api/?username=${requestData.username}&password=${requestData.password}&message=${requestData.message}&sender=Monistash&mobiles=${requestData.mobiles}`;
    const options = {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      data: "", // Send data as JSON
      url: url,
    };

    const response = await axios(options);
    console.log("K_____ res :- ", response);
    console.log("K_____ res status:- ", response.status);
    if(response.data.errno)
    {
      return {
        status: "FALSE",
        code: 422,
        data: response.data,
      };
    }
    else{
      return {
        status: "TRUE",
        code: response.status,
        data: response.data,
      };
    }
   

} catch (error) {
  const errorMessage = `❌Failed! SMS service unsuccessful ❌ ${error.message}`;
  let netStatus;

  if (error.status) {
    netStatus = error.status;
  } else if (error.response && error.response.status) {
    netStatus = error.response.status;
  } else {
    // Handle specific error statuses and set respective error status code
    if (error.code === "EHOSTUNREACH") {
      netStatus = 501; // Gateway Error
    } else if (error.code === "ECONNREFUSED") {
      netStatus = 503; // Service Unavailable
    } else if (error.code === "ETIMEDOUT") {
      netStatus = 504; // Gateway Timeout
    } else if (error.code === "ECONNRESET") {
      netStatus = 500; // Internal Server Error
    } else if (error.code === "ENETUNREACH") {
      netStatus = 502; // Bad Gateway
    } else {
      netStatus = statusCode; // Default status code
    }
  }


  if (error.response && error.response.data) {
    netStatus = statusCode;
    // Extract properties from the error response data
    //   const errorCode = error.response.data.responseCode;
    //   const errorDescription = error.response.data.responseMessage;
    //  const errorMMMessage = error.response.data.message;
    return {
      status: error.response?.status || netStatus,
      data: error.response.data,
    };

    //  errorMessage += `\nError Code: ${errorCode}\nErrorMessage: ${errorMMMessage}\nDescription: ${errorDescription}`;
  }
  throw createHttpError(errorMessage, netStatus);
  //throw new Error('Failed to send request: ' + error.message);
}
};


YYYYMMDDHHMMSS = function (date) {
  let yyyy = date.getFullYear().toString().substring(2);
  let MM = pad(date.getMonth() + 1, 2);
  let dd = pad(date.getDate(), 2);
  let hh = pad(date.getHours(), 2);
  let mm = pad(date.getMinutes(), 2);
  let ss = pad(date.getSeconds(), 2);

  return yyyy + MM + dd + hh + mm + ss;
};

function pad(number, length) {
  let str = "" + number;
  while (str.length < length) {
    str = "0" + str;
  }

  return str;
}

const transactionId = async (clientID) => {
  d = new Date();
  let raaa = await randomChar(12, "numeric");
  requestID = clientID + YYYYMMDDHHMMSS(d) + raaa;
  return requestID;
};

const DateToSQLDate = async (date, time) => {
  let yyyy = date.getFullYear().toString();
  let MM = pad(date.getMonth() + 1, 2);
  let dd = pad(date.getDate(), 2);
  let hh = pad(date.getHours(), 2);
  let mm = pad(date.getMinutes(), 2);
  let ss = pad(date.getSeconds(), 2);
  return yyyy + "-" + MM + "-" + dd + time; //hh +":"+ mm +":"+ ss;
  // return formatDate(date, "yyyy-MM-dd HH:mm:ss");
};


 
const doDecimalSafeMath = async (a, operation, b, precision) =>{
  function decimalLength(numStr) {
    const pieces = numStr.toString().split('.');
    return pieces[1] ? pieces[1].length : 0;
  }

  // Set precision using Decimal
  //precision = new Decimal(precision || Math.pow(10, Math.max(decimalLength(a), decimalLength(b))));

  // // Multiply operands by precision using Decimal
  // const decimalA = new Decimal(a).times(precision);
  // const decimalB = new Decimal(b).times(precision);
  const decimalA = new Decimal(a);
  const decimalB = new Decimal(b);
  // Figure out which operation to perform.
  let result;
  switch (operation.toLowerCase()) {
    case '-':
      result = decimalA.minus(decimalB);
      break;
    case '+':
      result = decimalA.plus(decimalB);
      break;
    case '*':
    case 'x':
      result = decimalA.times(decimalB);
      break;
    case '÷':
    case '/':
      result = decimalA.dividedBy(decimalB);
      break;
    // Let us pass in a function to perform other operations.
    default:
      result = operation(decimalA, decimalB);
  }

  // Return the result as a Decimal instance
  // return parseFloat(result).toFixed(2);  
  return parseFloat(result);  
}

// function doDecimalSafeMath(a, operation, b, precision) {
//   function decimalLength(numStr) {
//       var pieces = numStr.toString().split(".");
//       if(!pieces[1]) return 0;
//       return pieces[1].length;
//   }

//   // Figure out what we need to multiply by to make everything a whole number
//   precision = precision || Math.pow(10, Math.max(decimalLength(a), decimalLength(b)));

//   a = a*precision;
//   b = b*precision;

//   // Figure out which operation to perform.
//   var operator;
//   switch(operation.toLowerCase()) {
//       case '-':
//           operator = function(a,b) { return a - b; }
//       break;
//       case '+':
//           operator = function(a,b) { return a + b; }
//       break;
//       case '*':
//       case 'x':
//           precision = precision*precision;
//           operator = function(a,b) { return a * b; }
//       break;
//       case '÷':
//       case '/':
//           precision = 1;
//           operator = function(a,b) { return a / b; }
//       break;

//       // Let us pass in a function to perform other operations.
//       default:
//           operator = operation;
//   }

//   var result = operator(a,b);

//   // Remove our multiplier to put the decimal back.
//   return result/precision;
// }

module.exports = {
  getcurrentDate,
  DateToSQLDate,doDecimalSafeMath,
  transactionId,
  CustomWistonlogger,
  getBankName,
  encrypt,
  dencrypt,
  DDMMYYYY,
  SendRequest,
  workDays,
  sendsSMS,
  sendsEMail,
  formatDate,
  randomChar,
  formatTime,
  TransReff,
  token,
  randomPin,
  createHttpError,
  differhuman,
  AddMinutesToDate,
  addMinutes,
};
