const mysql = require('mysql2');

// create connection pool
const pool = mysql.createPool({
  host: '46.137.201.121',
  user: 'root28',
  password: 'Colaza999+',
  database: 'db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  multipleStatements: true // enable multiple statements
});

module.exports = pool;