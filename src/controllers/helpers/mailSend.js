const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');
const config = require('../../config/db.config.js'); // Import your configuration from a file
const logger = require('./logger'); // Assuming you have a logger module
const utils = require('../helpers/utils');


let attachments ="";

const createAttachments =async (attachmentConfigs) => {
  return attachmentConfigs.map((config) => {
    return {
      filename: config.filename,
      path: `./assets/${config.filename}`, // Assuming all files are in the 'assets' directory
      cid: `unique_cid_${config.filename.replace(/\./g, '_')}`,
    };
  });
};

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
    host: config.MailHost,
    service: config.MServiceWorker,
    port: config.MailPort,
    secure: true,
    auth: {
        user: config.Uname,
        pass: config.Mpass
    }
});
transporter.on('debug', console.log);
// Configure Handlebars for email templates
const handlebarOptions = {
    viewEngine: {
        partialsDir: path.resolve('./views/mails/'),
        defaultLayout: false
    },
    viewPath: path.resolve('./views/mails/')
};

// Use Handlebars template engine with Nodemailer
transporter.use('compile', hbs(handlebarOptions));

// Function to send an email
const sendMail = async (mailConfigs) => {
 
  

  console.log(attachments)
    try {
      const emailResults = [];
  
      for (const MailConfig of mailConfigs) {
        attachments = await createAttachments(MailConfig.attachment);
      //  console.log(attachments);
        // Define mail options for the current email
        const mailOptions = {
          from: MailConfig.from || process.env.MAIL_REPLY_TO,
          replyTo: process.env.MAIL_REPLY_TO,
          to: MailConfig.to,
          cc: MailConfig.cc || '',
          bcc: MailConfig.bcc || '',
          subject: MailConfig.subject,
          text: MailConfig.text,
          template: MailConfig.template,
          context: {
            name: MailConfig.name,
            message:MailConfig.text,
            Payload: MailConfig.DataPayload,
          },
          attachments: ['WelcomeMail','auth','auth2','forgotpass',"pss","notification"].includes(MailConfig.template) ? attachments : [],
        };
  
        // Send the email for the current configuration
        const info = await transporter.sendMail(mailOptions);
        emailResults.push(info);
      }
  
      // Log the successful email sends
      // logger.info('Emails sent:', emailResults);
  
      return emailResults;
    } catch (error) {
      console.log(error);
      // Handle any errors that occur during email sending
      // logger.error('Email send error:', error);
  
      // Log the error and return an error response if needed
      const logDate = new Date().toISOString();
      // await LogActivity('email_error', 500, error.message, [authorId], logDate);
      throw error;
    }
  };

  
  

module.exports = sendMail;
