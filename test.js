const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const jwt = require("jsonwebtoken");
const gentoken = "token-Login";
const nodemailer = require("nodemailer");

app.use(cors());
app.use(express.json());
const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "DBEV61040626362",
  database: "evoting",
});

app.get("/admin", (req, res) => {
    db.query("select * from admin where level = 1", (err, result) => {
      if (err) {
        console.log(err, "err");
      } else {
        res.send({ result: result });
      }
    });
  });