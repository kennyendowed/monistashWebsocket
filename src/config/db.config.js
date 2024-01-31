
const dotenv=require('dotenv');
dotenv.config();
// Determine the environment
const isStaging = process.env.NODE_ENV;
// Define the appropriate environment prefix
const envPrefix = (isStaging === "staging" || isStaging === "development") ? 'STAGING_' : 'PRODUCTION_';

const mp ="#DHP-U4YMp~X";

module.exports = {
  NODE_ENV:isStaging,
  HOST: process.env[`${envPrefix}DB_HOST`],
  PORT:parseInt(process.env[`${envPrefix}DB_PORT`]),
  USER:    process.env[`${envPrefix}DB_USERNAME`],
  DB_PASSWORD:    process.env[`${envPrefix}DB_PASSWORD`],
  DB:    process.env[`${envPrefix}DB_DATABASE`],
  dialect:  process.env[`${envPrefix}dialect`],
  instantName:  process.env[`${envPrefix}DB_CONNECTION`],
  operatorsAliases:process.env.OPERATOR_ALIASES,
    dialectOptions: {
      ssl: false,
      native:false
    },
    pool: {
      max:5,
      min: 0,
      acquire: 60000,
      idle:  10000
    },
    MailHost: process.env.MAIL_HOST,
    MServiceWorker: process.env.MAIL_DRIVER,
    MailPort:process.env.MAIL_PORT,
    Uname:process.env.MAIL_USERNAME,
    Mpass: mp,
    MIP_ADDRESS:process.env.IP_ADDRESS,
    MPOT_ADDRESS:process.env.PORT,
    PAYSTACK_SK : process.env[`${envPrefix}Paystack_Secret_Key`],
    PAYSTACK_PUBK : process.env[`${envPrefix}Paystack_Public_Key`],
    PAYSTACK_BASEURL : process.env[`${envPrefix}Paystack_BaseUrl`],
  };

  