const mysql = require('mysql2/promise');
require("dotenv").config();
const connection = mysql.createPool({
  host: process.env.mysql_dbhost,
  port:process.env.mysql_port,
  user:"root",
  password:process.env.mysql_dbpassword,
  database:process.env.mysql_database,
  connectionLimit:10
});

module.exports = connection