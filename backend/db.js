let mysql = require('mysql2');
require('dotenv').config({path: './.env'});

let db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DATABASE
});


db.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");

});

module.exports = db;