const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "testInsight",
  password: "JOJOnium05+",
});

module.exports = pool.promise();
