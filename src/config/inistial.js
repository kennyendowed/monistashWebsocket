const db = require("../models");
const Role = db.role;
const appSettings = db.Basic_settings;
const Conditions = db.Conditions;

// **********NOTE***********
// initial() function helps us to create 3 rows in database.
// In development, you may need to drop existing tables and re-sync database. So you can use force: true as code above.

// For production, just insert these rows manually and use sync() without parameters to avoid dropping data:
// db.sequelize.sync().then((result) => {
//    console.log("Resync Db");
// //  console.log(result)
// }).catch(err => {
// console.log(err);
//   });



// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and Resync Db");
// // initial();
// }).catch(err => {

//  console.log(err);
// });

