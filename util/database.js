const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "testinsight",
  password: "K1r0n_p3rr0",
});

module.exports = pool.promise();
