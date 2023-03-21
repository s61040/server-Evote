const express = require("express");
require('dotenv').config()
const app = express();
const mysql = require("mysql");
const mysql2 = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");
// const saltRounds = 10;
var saltRounds = bcrypt.genSaltSync(10);
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const path = require("path");
const jwt = require("jsonwebtoken");
const gentoken = "token-Login";
const nodemailer = require("nodemailer");
const multer = require("multer");
const e = require("express");
const db = require('./db')

app.use(cors());
app.use(express.json());

// const db = mysql2.createConnection(process.env.DATABASE_URL)
// const db = mysql.createConnection({
//   user: "root",
//   host: "localhost",
//   password: "DBEV61040626362",
//   database: "elec_vote",
// });
 
app.post("/checklogin", (req, res) => {
  const idss = req.body.idss;
  const buff = Buffer.from(idss, "utf-8");
  const base64 = buff.toString("base64");
  db.query(
    "select * from participant where Email = ? ",
    [idss],
    (err, user) => {
      console.log("us = ", user)
      if (user.length == 0) {
        res.send({ massage: "Failusername", Login: user.length });
      } else {
        res.send({ massage: "Login", Login: user.length, pass: base64 });
      }
    }
  );
});

// แก้ไขข้อมูล แอดมิน =======================================================

app.post("/C_admin", (req, res) => {
  const name = req.body.name;
  const password = req.body.password;
  const email = req.body.email;
  db.query(
    "UPDATE participant set Password = ? WHERE User_id = 0 And Name = ?",
    [password , name], 
    (err, result) => {
      if(err){
        console.log("Error Update admin = " , err)
      } else {
        res.send({ Massage: "Can" });
      } 
    }
  );
});

// Add List Name ----------------------------------------------------
app.post("/checknamelist", (req, res) => {
  const name = req.body.name;
  const surname = req.body.surname;
  const email = req.body.email;
  db.query(
    "select * from user_info where Name = ? AND Surname = ?",
    [name, surname],
    (err, result) => {
      if (result.length == 0) {
        db.query(
          "select * from user_info where Email = ?",
          [email],
          (err, result) => {
            if (result.length == 0) {
              res.send({ Massage: "Can" });
            } else {
              res.send({ Massage: "CheckEmail" });
            }
          }
        );
      } else {
        res.send({ Massage: "CheckName/Surname" });
      }
    }
  );
});

app.get("/iduser", (req, res) => {
  //test commit
  db.query("select * from user_info", (err, result) => {
    if (err) {
      // console.log(err, "err");
    } else {
      if(result.length <= 0){
        return res.status(404)({
          massage: 'not-found-data', 
        });
      }
      res.send({
        massage: result[result.length - 1].User_id, 
      });
    }
  });
})

app.get("/idpar", (req, res) => {
  db.query("select * from participant", (err, result) => {
    if (err) {
      // console.log(err, "err");
    } else {
      res.send({
        massage: result[result.length - 1].Par_id, 
      });
    }
  });
})

app.post("/addnamelistss", (req, res) => {
  const name = req.body.name;
  const count = req.body.count;
  const surname = req.body.surname;
  const email = req.body.email;
  var idu = 999999; 
  
  console.log(" Name0 = " , name)
  console.log(" count0 = " , count)
  db.query("select * from user_info where Email = ?",
  [email],
  (err,user0) => {
    if(err){
      console.log("errres = ",err);
      res.send({massage:err})
    } else if(user0.length > 0){
      console.log("mail dup = ",err);
      res.send({massage:err})
    } else {
      db.query("select * from user_info",
      (err,user1) => {
        if(err){
          console.log("erruser1 = ",err);
          res.send({massage : err})
        } else if(count != user1[user1.length-1].User_id ){
          idu = user1[user1.length-1].User_id+1;
          // console.log(" Name = " , name)
          // console.log(" count = " , count)
          db.query("INSERT INTO user_info (User_id ,Name , Surname , Email ,Status_user) VALUEs(?,?,?,?,0)",
          [count, name, surname, email],
          (err, user3) => {
            if (err) {
              console.log("err user3 = ", err);
              res.send(err);
            } else {
              // console.log("result", user);
              res.send({ Massage: "canadd", result: user3 });
            }
          })
        }
      })
    }
  })
})
   
app.post("/addnamelist", (req, res) => {
  const name = req.body.name;
  const surname = req.body.surname;
  const email = req.body.email;
  var id1 = 0;
  db.query("select * from user_info", (err, result) => {
    // // console.log(" res = ", result.length);
    id1 = result.length;
    if (id1 != result[result.length - 1].User_id) {
      id1 = result[result.length - 1].User_id + 1;
      db.query(
        "INSERT INTO user_info (User_id ,Name , Surname , Email ,Status_user) VALUEs(?,?,?,?,0)",
        [id1, name, surname, email],
        (err, user) => {
          if (err) {
            // console.log("err", err);
            res.send(err);
          } else {
            // console.log("result", user);
            res.send({ Massage: "canadd", result: user });
          }
        }
      );
    } else {
      res.send({ Massage: "" });
    }
  });
  // db.query(
  //   "INSERT INTO user_info(Name,Surname,Email) VALUEs(?,?,?)"
  //   [name,surname,email],
  //   (err , result) => {
  //     if(err){
  //       // console.log("err",err);
  //       res.send(err);
  //     } else {
  //       // console.log("result",result);
  //       res.send({ Massage : "canadd" , result : result});
  //     }
  //   }
  // );
});


app.get("/showadmin", (req, res) => {
  db.query("select * from user_info where User_id = 0", (err, result) => {
    if (err) {
      // console.log(err, "err");
    } else {
      res.send({
        total: result.length,
        result: result,
      });
    }
  });
});

app.get("/showtotaluser", (req, res) => {
  db.query("select * from user_info ", (err, result) => {
    if (err) {
      // console.log(err, "err");
    } else {
      res.send({
        total: result.length,
        result: result,
      });
    }
  });
});

app.post("/changname", (req, res) => {
  const Name = req.body.n_h;
  const surname = req.body.sn_h;
  const Id = req.body.id_c;
  db.query(
    "Update user_info set Name = ? , Surname = ? Where User_id =?",
    [Name, surname, Id],
    (err, user) => {
      if (user.length == 0) {
        res.send({ massage: "Failusername", Login: user.length });
      }
      if (err) {
        console.log(err);
      } else {
        res.send({ massage: "Updatename" });
      }
    }
  );
});

// Login ------------------------------------------------------------

app.post("/login", (req, res) => {
  const idss = req.body.idss;
  const passwordl = req.body.passwordl;
  const buff = Buffer.from(passwordl.trim(), "utf-8");
  const base64 = buff.toString("base64");
  db.query(
    "select * from participant where Email = ? And Password = ? ",
    [idss, base64],
    (err, user) => {
      if (user.length == 0) {
        console.log("1");
        res.send({ message: "FailUsername", Login: user.length });
      }
      if (err) {
        // console.log({ err: err });
      }
      // console.log("Password = ", user[0].Password);
      for (var i = 0; i < user.length; i++) {
        if (base64 == user[i].Password) {
          // console.log("password2 = ", user[i].Password);
          // console.log("level2 = ", user[i].Authen);
          // Store hash in your password DB.
          if (user[i].ElecStatus != 0 && user[i].ElecStatus != 1) {
            console.log("2 == ", user[i].ElecStatus);
            res.send({
              message: user[i].ElecStatus,
              user: idss,
            });
            break;
          }

          if (user[i].Authen == "admin") {
            console.log("2");
            res.send({
              message: "admin",
              user: idss,
              token: user[i].Token,
              Authen: user[i].Authen,
            });
          } else if (user[i].Authen == "staff") {
            console.log("3");
            res.send({
              message: "staff",
              user: idss,
              id: user[i].Par_id,
              id_e: user[i].Id_event,
              token: user[i].Token,
              Authen: user[i].Authen,
            });
            break;
          } else {
            console.log("user[i].Id_event, == ", user[i].Id_event);

            var id = user[i].Id_event;
            var tk = user[i].Token;
            var au = user[i].Authen;

            db.query(
              "UPDATE participant SET ElecStatus = 1 where token = " +
                "'" +
                user[i].Token +
                "'",
              (err, check) => {
                if (err) {
                  console.log("login err == ", err);
                } else {
                  db.query("select * from event_info where Id_event = " + id ,
                  (err, user01) => { 
                    console.log("check.ElecStatus == ", id);
                    res.send({
                      message: "participant",
                      message2: user,
                      user: idss,
                      timeout: user01[0].timeout,
                      event: id,
                      token: tk,
                      Authen: au,
                    });
                  }) 
                }
              }
            );
          }
        } else {
          // console.log(user[i], "else");
        }
      }
    }
  );
});

app.get("/authen", (req, res) => {
  var token = req.headers.authorization.split(" ")[1];
  if (token == null) {
    // console.log("error");
  } else if (token == token) {
    res.send({ message: "Login" });
    console.log(" == ");
  } else {
    res.send({ message: "ree", asdasdas: "A1234" });
  }
});

app.post("/authen", (req, res) => {
  const tokenC = req.body.tokenC;
  var decoded = jwt.verify(tokenC, gentoken);
  db.query(
    "select * from participant where Token = ?",
    [tokenC],
    (err, user) => {
      // try {
      console.log(" == ", user[0].Authen);
      res.send({
        message: user[0].Authen,
        auth: decoded,
        tokenC: tokenC,
      });
      // } catch (err) {
      //   res.send({ message2: "err", message3: err.message, decoded });
      //   console.log( message2, " = err =", message3, err , decoded );
      // }
    }
  );
});

app.get("/admin", (req, res) => {
  db.query("select * from admin where level = 1", (err, result) => {
    if (err) {
      // console.log(err, "err");
    } else {
      res.send({ result: result });
    }
  });
});

// create admin  ---------------------------------------------------------

app.post("/createadmin", (req, res) => {
  const username = req.body.mailuser;
  const password = req.body.passworduser;
  const name = req.body.nameuser;
  const lastname = req.body.lastnameuser;
  const Authen = "admin";
  var idu = 0;
  const gento = jwt.sign({ userinfo: username, authen: Authen }, gentoken);
  const buff = Buffer.from(password, "utf-8");
  const base64 = buff.toString("base64").trim();
  db.query(
    "select * from user_info where Name = ? And Surname = ? ",
    [name, lastname],
    (err, user) => {
      // console.log(user[0].User_id);
      idu = user[0].User_id;
    }
  );
  db.query(
    "select * from participant where Email = ?  And  Authen = 'admin'",
    [username],
    (err, user1) => {
      try {
        if (user1.length == 0) {
          db.query(
            "INSERT INTO participant (User_id,Id_event,Email,Password,Token,Authen) VALUEs(?,0,?,?,?,'admin')",
            [idu, username, base64, gento.trim()]
          ),
            (err, result) => {
              if (err) {
                // console.log("Values insert");
              } else {
                res.send({ massage: "Values_insert" });
              }
            };
        } else {
          res.send({ massage: "Duplicate Username", Login: user1 });
        }
      } catch (err) {
        // console.log("catch == ", err);
        // console.log("usercreate == ", user1);
        res.send({ message: "err", err: err });
      }
    }
  );
});

app.post("/createstaff", (req, res) => {
  const username = req.body.mailuser;
  const password = req.body.passworduser;
  const name = req.body.nameuser;
  const lastname = req.body.lastnameuser;
  const checkevent = req.body.checkevent;
  const Authen = "staff";
  var idu = 0;
  var ide = 0;
  const gento = jwt.sign({ userinfo: username, authen: Authen }, gentoken);
  const buff = Buffer.from(password, "utf-8");
  const base64 = buff.toString("base64").trim();
  db.query(
    "select * from user_info where Name = ? And Surname = ? ",
    [name, lastname],
    (err, user) => {
      // console.log(user[0].User_id);
      idu = user[0].User_id;
    }
  );

  db.query(
    "select * from event_info where Event_name = ? ",
    [checkevent],
    (err, user) => {
      // console.log(user[0].Id_event);
      ide = user[0].Id_event;
    }
  );

  db.query(
    "select * from participant where Email = ?  ",
    [username],
    (err, user1) => {
      try {
        if (err) {
          res.send({ massage: "Duplicate Username", Login: user1 });
          // console.log({ massage: "Duplicate Username", Login: user1 });
        }
        if (user1.length == 0) {
          db.query(
            "INSERT INTO participant (User_id,Id_event,Email,Password,Token,Authen) VALUEs(?,?,?,?,?,'staff')",
            [idu, ide, username, base64, gento.trim()]
          ),
            (err, result) => {
              if (err) {
                // console.log("Values insert");
              } else {
                res.send({ massage: "Values_insert" });
              }
            };
        } else {
          res.send({ massage: "Duplicate Username", Login: user1 });
          // console.log({ massage: "Duplicate Username", Login: user1 });
        }
      } catch (err) {
        // console.log("catch == ", err);
        // console.log("usercreate == ", user1);
        res.send({ message: "err", err: err });
      }
    }
  );
});

// event ------------------------------------------------------------------------------
app.post("/createevnet", (req, res) => {
  const nameevent = req.body.nameevent;
  const detaile = req.body.detaile;
  const timeout = req.body.timeout;
  const starte = req.body.starte;
  const starttime = req.body.starttime;
  const endtime = req.body.endtime;
  const checka = req.body.checka;
  const id_s = req.body.id_s;
  var id1 = -1;
  db.query(
    "select * from event_info where Event_name = ? ",
    [nameevent],
    (err, user1) => {
      if (user1.length != 0) {
        // console.log("err1", user1);
        res.send({ massage: "FailEventname", user1 });
      } else {
        db.query("select * from event_info", (err, user2) => {
          // console.log("user", user2[user2.length - 1].Id_event);
          // console.log("usernummmm", user2.length);
          if (user2.length == 0) {
            db.query(
              "INSERT INTO event_info (Id_event ,User_id ,Event_name, Event_detail	,Date_vote , Time_start, Time_end ,timeout , Results,  status_event) VALUEs(0,?,?,?,?,?,?,?,?,0)",
              [
                id_s,
                nameevent,
                detaile, 
                starte,
                starttime + ":00",
                endtime + ":00",
                timeout,
                checka,
              ],
              (err, user3) => {
                if (err) {
                  // console.log(err);
                  res.send({ massage: "fail" });
                } else {
                  db.query(
                    "INSERT INTO candidate_info (Id_can ,Id_event ,Detail, Img) VALUEs(0 , 0 , 'No vote' , 'no_vote.png')",
                    (err, user4) => {
                      if (err) {
                        console.log("err insert candidate no vote = ", err);
                      } else {
                        res.send("Values insert");
                      }
                    }
                  );
                }
              }
            );
          }
          if (user2.length != 0) {
            if (
              id1 != user2[user2.length - 1].Id_event ||
              user2[user2.length].Id_event == null
            ) {
              id1 = user2[user2.length - 1].Id_event + 1;
              db.query(
                "INSERT INTO event_info (Id_event,User_id,Event_name, Event_detail	,Date_vote , Time_start, Time_end,timeout , Results,  status_event) VALUEs(?,?,?,?,?,?,?,?,?,0)",
                [
                  id1,
                  id_s,
                  nameevent,
                  detaile,
                  starte,
                  starttime + ":00",
                  endtime + ":00",
                  timeout,
                  checka,
                ],
                (err, user2) => {
                  if (err) {
                    // console.log(err);
                    res.send({ massage: "fail" });
                  } else {
                    db.query(
                      "INSERT INTO candidate_info (Id_can ,Id_event ,Detail, Img) VALUEs(0 , ? , 'No vote' , 'no_vote.png')",
                      [id1],
                      (err, user4) => {
                        if (err) {
                          console.log("err insert candidate no vote = ", err);
                        } else {
                          res.send("Values insert");
                        }
                      }
                    );
                  }
                }
              );
            } else if (err) {
              // console.log("err = ", err);
            }
          }
        });
      }
    }
  );
});

// getname_event  ------------------------------------------------------------------------------

app.get("/eventname", (req, res) => {
  db.query("select * from prepare_data_event", (err, result) => {
    if (err) {
      // console.log("err");
    } else {
      res.send({
        length: result,
      });
    }
  });
});

// prepare_candidate  ------------------------------------------------------------------------------

app.get("/lengthcandidate", (req, res) => {
  db.query("select * from prepare_data_candidate", (err, result) => {
    if (err) {
      // console.log("err");
    } else {
      res.send({
        lengthdata: result.length,
        massage: result[result.length - 1],
      });
    }
  });
});

// const storage = multer.diskStorage({
//   destination:("../ux-project/src/", "images"),
//   filename: function (req, file, cb) {

//     cb(null, Date.no/showStaff() + "-" + file.originalname);
//     // console.log("asdasd", file);
//   },
// });

const storage = multer.diskStorage({
  destination: path.join("../ux-project/src/", "images"),
  filename: function (req, file, cb) {
    // null as first argument means no error
    const name123 = file.originalname;
    cb(null, name123);
    // console.log("asdasd", file, name123);
  },
});

app.post("/image", (req, res) => {
  let upload = multer({ storage: storage }).single("avatar");
  upload(req, res, function (err) {
    // req.file contains information of uploaded file
    // req.body contains information of text fields
    if (!req.file) {
      // console.log("res1");
      return res.send("Please select an image to upload");
    } else if (err instanceof multer.MulterError) {
      // console.log("res2");
      return res.send(err);
    } else if (err) {
      // console.log("res3");
      return res.send(err);
    } else {
      res.send({ massage: 1 });
      classifiedsadd = req.file.originalname;
      // console.log(req.file.originalname);
      // console.log(req.get.name123);
      // db.query("INSERT INTO prepare_data_candidate (p_image_c) VALUEs(?)",[classifiedsadd], (err, results) => {  if (err) throw err;
      // res.send({ success: 1 })
      // });

      app.post("/createcandidate", (req, res) => {
        const totalcandidate = req.body.totalcandidate;
        const getname = req.body.getname;
        const detailc = req.body.detailc;
        const name_can = req.body.name_can;
        const surname_can = req.body.surname_can;

        var id_candidate = 99999999;
        var id_user = 0;
        var Id_event = 0;
        db.query(
          "select * from event_info where Event_name = ?",
          [getname],
          (err, user0) => {
            if (err) {
              // console.log("createcandidate  00000 ", err);
            } else {
              Id_event = user0[0].Id_event;
            }
          }
        );
        db.query(
          "select * from user_info where Name = ? and Surname = ?",
          [name_can, surname_can],
          (err, user1) => {
            if (err) {
              // console.log("err");
            }
            if (user1.length == 0) {
              // console.log("Un Name / Surname");
            } else {
              id_user = user1[0].User_id;
              db.query(
                "select * from candidate_info where Id_event = ? and User_id =?",
                [Id_event, id_user],
                (err, user) => {
                  if (user.length != 0) {
                    // console.log("FailCandidatename createcandidate 1");
                    res.send({ massage: "FailCandidate", user });
                  } else {
                    // console.log("Check Duplicatedata === ", user);
                    db.query("select * from candidate_info", (err, user2) => {
                      if (err) {
                        // console.log( "FailCandidatename  createcandidate 2", err );
                        res.send({ massage: "FailCandidate", user });
                      }
                      if (user2.length == 0) {
                        db.query(
                          "INSERT INTO candidate_info (Id_can,Id_event,User_id,Detail,Img) VALUEs(0,?,?,?,?)",
                          [Id_event, id_user, detailc, classifiedsadd], //classifiedsadd = image
                          (err, user) => {
                            if (err) {
                              console.log("err add Candidate == ", err);
                              res.send({ massage: "fail", err, user: user });
                            } else {
                              db.query(
                                "select * from candidate_info where Id_event = " +
                                  Id_event,
                                (err, result) => {
                                  if (err) {
                                    // console.log("err");
                                    res.send(err);
                                  } else {
                                    res.send({
                                      result,
                                      lengthdata: result.length,
                                      massage: "insertsubmit",
                                    });
                                  }
                                }
                              );
                            }
                          }
                        );
                      }
                      if (user2.length != 0) {
                        // console.log( "test === ", user2[user2.length - 1].Id_can );
                        if (
                          id_candidate != user2[user2.length - 1].Id_can ||
                          user2[user2.length].Id_can == null
                        ) {
                          id_candidate = user2[user2.length - 1].Id_can + 1;
                          // console.log("test123456 === ", id_candidate);
                          db.query(
                            "INSERT INTO candidate_info (Id_can,Id_event, User_id,Detail,Img) VALUEs(?,?,?,?,?)",
                            [
                              id_candidate,
                              Id_event,
                              id_user,
                              detailc,
                              classifiedsadd,
                            ], //classifiedsadd = image
                            (err, user) => {
                              if (err) {
                                console.log("err add Candidate == ", err);

                                res.send({ massage: "fail", err, user: user });
                              } else {
                                db.query(
                                  "select * from candidate_info where Id_event = " +
                                    Id_event,
                                  (err, result) => {
                                    if (err) {
                                      // console.log("err");
                                      res.send(err);
                                    } else {
                                      res.send({
                                        result,
                                        lengthdata: result.length,
                                        massage: "insertsubmit",
                                      });
                                    }
                                  }
                                );
                              }
                            }
                          );
                        }
                      }
                    });
                  }
                }
              );
            }
          }
        );
      });
    }
  });
});

app.post("/uplaod", async (req, res) => {
  try {
    let upload = multer({ storage: storage }).single("avatar");

    upload(req, res, function (err) {
      // req.file contains information of uploaded file
      // req.body contains information of text fields

      if (!req.file) {
        // console.log("res1");
        return res.send("Please select an image to upload");
      } else if (err instanceof multer.MulterError) {
        // console.log("res2");
        return res.send(err);
      } else if (err) {
        // console.log("res3");
        return res.send(err);
      }
      const classifiedsadd = req.file.path;
      // console.log(req.file.path);
      // db.query("INSERT INTO prepare_data_candidate (p_image_c) VALUEs(?)",[classifiedsadd], (err, results) => {  if (err) throw err;
      // res.send({ success: 1 })
      // });
    });
  } catch (err) {
    // console.log(err);
  }
});

// prepare_user ------------------------------------------------------------------------------

app.post("/addparticipant", (req, res) => {
  const key = req.body.key;
  const Email = req.body.Email;
  const password = req.body.password;
  const event_now = req.body.event_now;
  const Authen = req.body.Authen;
  const gento = jwt.sign({ userinfo: Email, authen: Authen }, gentoken);
  var idE = 99999;
  var idp = 9999999;
  const buff = Buffer.from(password, "utf-8");
  const base64 = buff.toString("base64");
  db.query(
    "select * from event_info where Event_name = ?",
    [event_now],
    (err, user1) => {
      if (err) {
        // console.log("err1", err);
      } else {
        if (user1[0].Event_name == event_now) {
          // console.log("testdata = ", user1);
          idE = user1[0].Id_event;
          db.query(
            "SELECT * FROM participant WHERE User_id = ? AND Id_event = ?",
            [key, idE],
            (err, user2) => {
              if (err) {
                // console.log("err2", err);
              }
              if (user2.length != 0) {
                console.log("datadup");
                res.send({ massage: "datadup" });
              } else {
                db.query("SELECT * FROM participant", (err, user3) => {
                  if (err) {
                    // console.log("err2", err);
                  }
                  if (
                    idp != user3[user3.length - 1].Par_id ||
                    user3[user3.length].Par_id == null
                  ) {
                    idp = user3[user3.length - 1].Par_id + 1;
                    db.query(
                      "INSERT INTO participant (Par_id,User_id,Id_event,Email,Password,Token,Authen) VALUEs(?,?,?,?,?,?,?)",
                      [idp, key, idE, Email, base64, gento, Authen],
                      (err, user) => {
                        if (err) {
                          // console.log("err3 = ", err);
                          res.send({ massage: "fail", err });
                        } else {
                          // console.log("test = = ", user);
                          res.send({
                            user,
                            lengthdata: user.length,
                            massage: "insertsubmit",
                          });
                        }
                      }
                    );
                  }
                });
              }
            }
          );
        }
      }
    }
  );
});

app.post("/addstaff", (req, res) => {
  const key = req.body.key;
  const Email = req.body.Email;
  const password = req.body.password;
  const event_now = req.body.event_now;
  const Authen = req.body.Authen;
  const gento = jwt.sign({ userinfo: Email, authen: Authen }, gentoken);
  var idE = 99999;
  var idp = 9999999;
  const buff = Buffer.from(password, "utf-8");
  const base64 = buff.toString("base64");

  console.log("password == " , password)
  db.query(
    "select * from event_info where Event_name = ?",
    [event_now],
    (err, user1) => {
      if (err) {
        // console.log("err1", err);
      } else {
        if (user1[0].Event_name == event_now) {
          // console.log("testdata = ", user1);
          idE = user1[0].Id_event;
          db.query(
            "SELECT * FROM participant WHERE User_id = ? AND Id_event = ?",
            [key, idE],
            (err, user2) => {
              if (err) {
                console.log("err2", err);
              }
              if (user2.length != 0) {
                // console.log("datadup");
                res.send({ massage1: "datadup" });
              } else {
                db.query(
                  "SELECT * FROM candidate_info  WHERE User_id = ? AND Id_event = ?",
                  [key, idE],
                  (err, user5) => {
                    if (err) {
                      // console.log("err2", err);
                    }
                    if (user5.length != 0) {
                      res.send({ massage2: "datadup" });
                    } else if (user5.length == 0) {
                      db.query("SELECT * FROM participant", (err, user3) => {
                        if (err) {
                          // console.log("err2", err);
                        } else {
                          db.query(
                            "SELECT * FROM participant Where User_id = ? AND Authen = 'staff'",
                            [key],
                            (err, user4) => {
                              if (err) {
                                // console.log("err2", err);
                              }
                              // if(user4.length != 0){
                              //   res.send({ massage3: "datadup" });
                              // }
                              if (user4.length == 0) {
                                if (
                                  idp != user3[user3.length - 1].Par_id ||
                                  user3[user3.length].Par_id == null
                                ) {
                                  idp = user3[user3.length - 1].Par_id + 1;
                                  db.query(
                                    "INSERT INTO participant (Par_id,User_id,Id_event,Email,Password,Token,Authen) VALUEs(?,?,?,?,?,?,?)",
                                    [
                                      idp,
                                      key,
                                      idE,
                                      Email,
                                      base64,
                                      gento,
                                      Authen,
                                    ],
                                    (err, user) => {
                                      if (err) {
                                        // console.log("err3 = ", err);
                                        res.send({ massage: "fail", err });
                                      } else {
                                        // console.log("test = = ", user);
                                        res.send({
                                          user,
                                          lengthdata: user.length,
                                          massage: "insertsubmit",
                                        });
                                      }
                                    }
                                  );
                                }
                              } else {
                                if (
                                  idp != user3[user3.length - 1].Par_id ||
                                  user3[user3.length].Par_id == null
                                ) {
                                  idp = user3[user3.length - 1].Par_id + 1;
                                  db.query(
                                    "INSERT INTO participant (Par_id,User_id,Id_event,Email,Password,Token,Authen) VALUEs(?,?,?,?,?,?,?)",
                                    [
                                      idp,
                                      key,
                                      idE,
                                      Email,
                                      // user4[0].Password,
                                      base64,
                                      gento,
                                      Authen,
                                    ],
                                    (err, user) => {
                                      if (err) {
                                        // console.log("err3 = ", err);
                                        res.send({ massage: "fail", err });
                                      } else {
                                        // console.log("test = = ", user);
                                        // console.log(user4);
                                        res.send({
                                          user,
                                          lengthdata: user.length,
                                          massage: "insertsubmit",
                                        });
                                      }
                                    }
                                  );
                                }
                              }
                            }
                          );
                        }
                      });
                    }
                  }
                );
              }
            }
          );
        }
      }
    }
  );
});

// app.post("/createuser", (req, res) => {
//   const key = req.body.key;
//   const Email = req.body.Email;
//   const password = req.body.password;
//   const event_now = req.body.getname;

//   const buff = Buffer.from(password, "utf-8");
//   const base64 = buff.toString("base64");

//   db.query(
//     "select * from prepare_data_event where p_name_event = ?",
//     [event_now],
//     (err, result) => {
//       if (err) {
//         // console.log("err");
//       } else {
//         db.query(
//           "select * from prepare_mailuser where mail_kmutnb = ? and name_event = ?",
//           [Email, event_now],
//           (err, user) => {
//             if (user.length != 0) {
//               // console.log("FailUser");
//               res.send({ massage: "FailUser", user });
//             } else {
//               db.query(
//                 "INSERT INTO prepare_mailuser (no_user,mail_kmutnb,password,name_event) VALUEs(?,?,?,?)",
//                 [totaluser + 1, Email, base64, event_now],
//                 (err, user) => {
//                   if (err) {
//                     res.send({ massage: "fail", err });
//                   } else {
//                     db.query(
//                       "select * from prepare_mailuser where name_event = " +
//                         "'" +
//                         getname +
//                         "'",
//                       (err, result) => {
//                         if (err) {
//                           // console.log("err");
//                           res.send(err);
//                         } else {
//                           res.send({
//                             result,
//                             lengthdata: result.length,
//                             massage: "insertsubmit",
//                           });
//                         }
//                       }
//                     );
//                   }
//                 }
//               );
//             }
//           }
//         );
//       }
//     }
//   );
// });

// --------------- Result_user -------------------

app.post("/Resulcan", (req, res) => {
  const getname = req.body.getname;
  db.query(
    "select * from prepare_data_candidate where p_name_e = " +
      "'" +
      getname +
      "'",
    (err, user) => {
      if (err) {
        // console.log("err");
        res.send({ err, massage: "que" });
      } else {
        // console.log(user);
        res.send({
          user,
          lengthdata: getname,
          massage: user,
          candidatelength: user.length,
        });
      }
    }
  );
});

app.post("/Resuluser", (req, res) => {
  const getname = req.body.getname;
  db.query(
    "select * from prepare_mailuser where name_event = " + "'" + getname + "'",
    (err, user) => {
      if (err) {
        // console.log("err");
        res.send({ err, massage: "que" });
      } else {
        res.send({
          user,
          lengthdata: getname,
          massage: user,
          userlength: user.length,
        });
      }
    }
  );
});

// Result_event ------------------------------------------------------------------------=>

app.post("/mailuser", (req, res) => {
  const usermail = req.body.usermail;
  const passwordmail = req.body.passwordmail;
  const eventnow = req.body.eventnow;
  var id = 0;
  var token = [];
  for (id; id < usermail.length; id++) {
    const gento = jwt.sign({ userinfo: userinfo[id] }, gentoken);
    token[id] = gento;
    // console.log(token);
    db.query(
      "INSERT INTO user_info (no_user,email,password,token,name_event,level) VALUEs(?,?,?,?,?,3)",
      [id, userinfo[id], password[id], token[id], getname],
      (err, user) => {
        if (err) {
          res.send({
            result: "fail",
            massage: userinfo,
            userlength: userinfo.length,
            getnamelength: getname,
            err: err,
          });
        }
        if (id > userinfo.length) {
          res.send({ massage: "insert data info_user", err: err });
          // console.log("insertqweqwe");
        }
      }
    );
  }
  if (id >= userinfo.length) {
    res.send({
      massage: "insert data info_user",
      idss: id,
      userinsert: userinfo,
      length: userinfo.length,
    });
    // console.log("insert");
  }
});

app.post("/checkno" ,(req,res) => {
  const eventnow = req.body.eventnow;
  db.query(
    "SELECT COUNT(Id_can) as Id_can , event_info.Id_event FROM `event_info` "+
    " LEFT JOIN candidate_info "+
    " ON event_info.Id_event = candidate_info.Id_event"+
    " WHERE event_info.Event_name = ?",
    [eventnow], 
    (err, user) => {
      if(user[0].Id_can == 1) {
        res.send({
          massage: 'More' 
        })
      } else {
        db.query(
          "SELECT COUNT(participant.Par_id) as Par_id , event_info.Id_event FROM `event_info`  "+
          " JOIN participant "+
          " ON event_info.Id_event = participant.Id_event"+
          "  WHERE event_info.Event_name = ?",
          [eventnow], 
          (err, user1) => {
            if(user1[0].Par_id == 1) {
              res.send({
                massage: 'More' 
              })
            } else {
              res.send({
                massage: 'sure' 
              })
            } 
          })
      } 
    })
})

app.post("/sendmail", (req, res) => {
  const usermail = req.body.usermail;
  const passwordmail = req.body.passwordmail;
  const eventnow = req.body.eventnow;
  const authen = req.body.authen_E;
  const date_m = req.body.date_m;
  const event_start = req.body.event_start;
  const event_end = req.body.event_end;
  // const buff = [];
  const str = []; 
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "Evotingcase2022@gmail.com", // your email
      pass: "coxnlmsuvobgczlz", // your email password
    },
  });
  for (var id = 0; id < usermail.length; id++) {
    const buff = Buffer.from(passwordmail[id], "base64");
    str[id] = buff.toString("utf-8");

    const mailOptions = {
      from: "Evotingcase2022@gmail.com", // sender
      to: usermail[id], // list of receivers
      subject: " ขอเชิญเข้าร่วมการเลือกตั้งออนไลน์ ", // Mail subject
      html:
        "<div><b>" +
        "การเลือกตั้งในหัวข้อ : "+ eventnow+
        "</b> <br></br> <b> "+
        "สถานะ"+ authen[id] +
        "</b> <br></br> <b> "+
        "Username : "+usermail[id] +
        "</b>  <br></br>  <b>" +
        "Password : "+str[id] +
        "</b> <br></br> <b>"+
        " โดยจะเริ่มในวันที่ :"+date_m+
        "</b> <br></br> <b>"+
        "เริ่มเวลา : "+event_start +"น."+
        "และสิ้นสุดเวลา :"+event_end+
         "</b> "+
         "<b> <a href='http://localhost:3000/'> เชิญเข้ารับการเลือกตั้ง </a> </b> </div>", // HTML body
    };
    transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        // console.log(err);
        res.send(err);
      } else {
        // console.log(info);
        res.send({ massage: "Sand mail", decode: str });
      }
    });
  }
});


app.post("/sendmail_Edit", (req, res) => {
  const Email = req.body.Email;
  const password = req.body.password;
  const eventnow = req.body.eventnow;
  const authen = req.body.Authen;
  const date_m = req.body.date_m;
  const event_start = req.body.event_start;
  const event_end = req.body.event_end;
  // const buff = [];

  // console.log("Email = " , Email)
  // console.log("password = ",password)
  // console.log("eventnow = ",eventnow)
  // console.log("authen = ",authen)
  const str = [];
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "Evotingcase2022@gmail.com", // your email
      pass: "coxnlmsuvobgczlz", // your email password
    },
  });
  // for (var id = 0; id < usermail.length; id++) {
    // const buff = Buffer.from(passwordmail[id], "base64");
    // str[id] = buff.toString("utf-8");

    const mailOptions = {
      from: "Evotingcase2022@gmail.com", // sender
      to: Email, // list of receivers
      subject: " ขอเชิญเข้าร่วมการเลือกตั้งออนไลน์ ", // Mail subject
      html:
        "<div><b>" +
        "การเลือกตั้งในหัวข้อ : "+ eventnow+
        "</b> <br></br> <b> "+
        "Username : "+Email +
        "</b>  <br></br>  <b>" +
        "Password : "+password +
        "</b> <br></br> <b>"+
        " โดยจะเริ่มในวันที่ :"+date_m+
        "</b> <br></br> <b>"+
        "เริ่มเวลา : "+event_start +"น."+
        "และสิ้นสุดเวลา :"+event_end+"</b> "+
        "<b> <a href='http://localhost:3000/'> เชิญเข้ารับการเลือกตั้ง </a> </b> </div>", // HTML body
    };
    transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        // console.log(err);
        res.send(err);
      } else {
        console.log(info);
        res.send({ massage: "Sand mail", decode: str });
      }
    });
  // }
});

// app.post("/totaluser", (req, res) => {
//   const getname = req.body.getname;
//   const totaluser = req.body.totaluser;
//   const totalcandidate = req.body.totalcandidate;
//   db.query(
//     " UPDATE prepare_data_event SET total_candidate =" +
//       totalcandidate +
//       "," +
//       "total_user = " +
//       totaluser +
//       " WHERE p_name_event = " +
//       "'" +
//       getname +
//       "'",
//     (err, user) => {
//       if (err) {
//         // console.log("No Update");
//         res.send({ massage: "No Update", err });
//       } else {
//         // console.log("Update");
//         res.send({ massage: "Can Update", user });
//       }
//     }
//   );
// });

// app.post("/Deleteuser", (req, res) => {
//   const id = req.body.id;
//   db.query("DELETE  FROM user_info where User_id = " + id, (err, result) => {
//     if (err) {
//       // console.log("err");
//       res.send({ err, massage: "no delete", id: id });
//     } else {
//       db.query(
//         "DELETE  FROM participant where User_id = " + id,
//         (err, result2) => {
//           if (err) {
//             // console.log("err");
//             res.send({ err, massage: "no delete", id: id });
//           } else {
//             db.query(
//               "DELETE  FROM candidate_info where User_id = " + id,
//               (err, result3) => {
//                 if (err) {
//                   // console.log("err");
//                   res.send({ err, massage: "no delete", id: id });
//                 } else {
//                   res.send({
//                     result,
//                     result2,
//                     result3,
//                   });
//                 }
//               }
//             );
//           }
//         }
//       );
//     }
//   });
// });

app.post("/Deleteuser", (req, res) => {
  const id = req.body.id;
  db.query("select * from user_info where User_id = " +id , 
  (err,user0) => {
    if(user0[0].Status_user == 0){
      db.query("update user_info set Status_user = 1 where User_id = " + id, (err, result) => {
        if (err) {
          // console.log("err");
          res.send({ err, massage: "no delete", id: id });
        } else {
          db.query(
            "DELETE  FROM participant where User_id = " + id,
            (err, result2) => {
              if (err) {
                // console.log("err");
                res.send({ err, massage: "no delete", id: id });
              } else {
                db.query(
                  "DELETE  FROM candidate_info where User_id = " + id,
                  (err, result3) => {
                    if (err) {
                      // console.log("err");
                      res.send({ err, massage: "no delete", id: id });
                    } else {
                      res.send({
                        result,
                        result2,
                        result3,
                      });
                    }
                  }
                );
              }
            }
          );
        }
      });
    } else {
      db.query("update user_info set Status_user = 0 where User_id = " + id, (err, result) => {
        if (err) {
          // console.log("err");
          res.send({ err, massage: "no delete", id: id });
        } else {
          res.send({massage:'Open'})
        }
      })
    }
  })
   
});


// User Election ------------------------------------------------

app.get("/showuserinfo", (req, res) => {
  db.query("select * from user_info", (err, user) => {
    if (err) {
      // console.log("err1", err);
      res.send({ err, massage: "dont show" });
    } else {
      res.send({
        user,
        massage: user,
        userlength: user.length,
      });
    }
  });
});

app.post("/showadrole", (req, res) => {
  const eventnow = req.body.eventnow;
  db.query(
    "SELECT user_info.User_id , user_info.Name , user_info.Surname , user_info.Email " +
      "FROM user_info ",
    (err, user) => {
      if (err) {
        // console.log("errs", err);
        res.send({ err, massage: "dont show" });
      } else {
        // console.log( "showadrole", "user = ", user, "event == ",  eventnow + "sdasd"  );
        res.send({
          user,
          massage: user,
          userlength: user.length,
        });
      }
    }
  );
});

app.post("/showaddstaff", (req, res) => {
  db.query(
    "SELECT user_info.User_id , user_info.Name , user_info.Surname , user_info.Email " +
      "FROM user_info " +
      "Where not user_info.User_id = 0",
    (err, user) => {
      if (err) {
        // console.log("errs", err);
        res.send({ err, massage: "dont show" });
      } else {
        // console.log( "showadrole", "user = ", user, "event == ",  eventnow + "sdasd"  );
        res.send({
          user,
          massage: user,
          userlength: user.length,
        });
      }
    }
  );
});

app.post("/showadd_candidate", (req, res) => {
  const eventnow = req.body.eventnow;
  var id_e = 0;
  db.query(
    "select * from event_info Where Event_name = " + "'" + eventnow + "'",
    (err, user2) => {
      if (err) {
        console.log("err show role = ", err);
      } else {
        id_e = user2[0].Id_event;
        console.log("ID_E = ", id_e);
        db.query(
          " SELECT user_info.User_id , user_info.Name , user_info.Surname , user_info.Email , " +
            "CASE " +
            "WHEN participant.Authen = 'admin' THEN 'not' " +
            "WHEN participant.Authen = 'staff' THEN 'not' " +
            "ELSE 'Show' " +
            "END AS Authem_admin " +
            "FROM `user_info` " +
            "LEFT JOIN participant " +
            "ON user_info.User_id = participant.User_id " +
            "And participant.Id_event =  "+user2[0].Id_event+
            " WHERE NOT user_info.User_id = 0  And user_info.Status_user = 0"+
            "  GROUP BY user_info.User_id ASC; ",
          (err, user) => {
            if (err) {
              // console.log("errs", err);

              res.send({ err, massage: "dont show" });
            } else {
              db.query(
                "Select  * " +
                  "From candidate_info  " +
                  "LEFT JOIN user_info " +
                  "ON user_info.User_id = candidate_info.User_id " +
                  " Where Id_event = ?",
                [id_e],
                (err, user3) => {
                  if (err) {
                    console.log("err = ", err);
                  } else
                    [
                      res.send({
                        user,
                        massage: user,
                        massage2: user3,
                        userlength: user.length,
                      }),
                    ];
                }
              );
            }
          }
        );
      }
    }
  );
});

app.post("/showadrole2", (req, res) => {
  const eventnow = req.body.eventnow;
  var id_e = 0;
  db.query(
    "select * from event_info Where Event_name = " + "'" + eventnow + "'",
    (err, user2) => {
      if (err) {
        console.log("err show role = ", err);
      } else {
        id_e = user2[0].Id_event;
        console.log("ID_E = ", id_e);
        db.query(
          " SELECT user_info.User_id , user_info.Name , user_info.Surname , user_info.Email , " +
            "CASE " +
            "WHEN participant.Authen = 'admin' THEN 'not' " +
            "WHEN participant.Id_event  = 0 THEN 'not' " +
            "WHEN participant.Authen = 'staff' THEN 'not' " +
            "ELSE 'Show' " +
            "END AS Authem_admin, " +
            "CASE " +
            "WHEN participant.Id_event = " +
            id_e +
            " THEN 'dupplicate' " +
            "ELSE 'Show' " +
            "END AS 'Event' " +
            "FROM `user_info` " +
            "LEFT JOIN participant " +
            "ON user_info.User_id = participant.User_id " +
            " And participant.Id_event = " +
            id_e +
            " Where not user_info.User_id = 0 And  not user_info.Status_user = 1"+
            " GROUP BY user_info.User_id ASC; ",
          (err, user) => {
            if (err) {
              // console.log("errs", err);
              res.send({ err, massage: "dont show" });
            } else {
              console.log("showadrole = ", user2[0].Id_event);
              res.send({
                user,
                massage: user,
                userlength: user.length,
              });
            }
          }
        );
      }
    }
  );
});

app.post("/userevent", (req, res) => {
  const i_event = req.body.i_event;
  const tokenC = req.body.tokenC;
  db.query(
    "select * from event_info Where Id_event = " + i_event,
    (err, result) => {
      if (err) {
        // console.log("err userevent2", err, i_event);
      } else {
        db.query(
          "select * " +
            "from candidate_info " +
            "LEFT JOIN user_info  " +
            " ON user_info.User_id = candidate_info.User_id " +
            "where Id_event =  " +
            i_event +
            " And not Id_can = 0",
          (err, user) => {
            if (err) {
              // console.log("err userevent1");
            } else {
              db.query(
                "select * from participant where Token = ?",
                [tokenC],
                (err, user2) => {
                  if (err) {
                    // console.log("err Vote ==", err);
                  } else {
                    // console.log("ID == ", result),
                    res.send({
                      user,
                      user2,
                      result : result[0].timeout,
                      massage: user,
                      par: user2[0],
                      event: result[0],
                    });
                  }
                }
              );
            }
          }
        );
      }
    }
  );
});

// Summarry =====================================================

app.post("/showsum2", (req, res) => {
  const eventnow = req.body.eventnow;
  var id_event = 0;
  db.query(
    "SELECT * FROM `event_info` where  Event_name  = ? ",
    [eventnow],
    (err, user) => {
      if (err) {
        // console.log("errs", err);
        // console.log("user == ", user);
        res.send({ err, massage: "dont show" });
      } else {
        if (user.length != 0) {
          id_event = user[0].Id_event;
          db.query(
            "SELECT participant.User_id , user_info.Name , user_info.Surname , participant.Email ,participant.Password ,  " +
              " Case When participant.Authen = 'staff' then 'staff'" +
              " When participant.Authen = 'participant' then 'participant' " +
              "End as Authen " +
              " FROM participant LEFT JOIN user_info " +
              " ON participant.User_id = user_info.User_id" +
              " WHERE participant.Id_event = " +
              id_event +
              // " AND NOT participant.Authen = 'staff'"+
              " ORDER BY participant.Par_id;",
            (err, user3) => {
              if (err) {
                // console.log("errs", err);
                res.send({ err, massage: "dont show" });
              } else {
                db.query(
                  "Select  * " +
                    "From candidate_info  " +
                    "LEFT JOIN user_info " +
                    "ON user_info.User_id = candidate_info.User_id " +
                    " Where Id_event = ? and not Id_can = 0",
                  [id_event],
                  (err, user2) => {
                    if (err) {
                      // console.log("errs", err);
                      res.send({ err, massage: "dont show" });
                    } else {
                      // console.log("ters ==");
                      res.send({
                        candidate: user2,
                        event: user,
                        massage: user3,
                        length: user3.length,
                      });
                    }
                  }
                );
              }
            }
          );
        }
      }
    }
  );
});

app.post("/showsum", (req, res) => {
  const eventnow = req.body.eventnow;
  var id_event = 0;
  db.query(
    "SELECT * FROM `event_info` where  Event_name  = ? ",
    [eventnow],
    (err, user) => {
      if (err) {
        // console.log("errs", err);
        // console.log("user == ", user);
        res.send({ err, massage: "dont show" });
      } else {
        if (user.length != 0) {
          id_event = user[0].Id_event;
          db.query(
            "SELECT * " +
              "FROM participant LEFT JOIN user_info " +
              " ON participant.User_id = user_info.User_id" +
              " WHERE participant.Id_event = " +
              id_event +
              " ORDER BY participant.Par_id;",
            (err, user3) => {
              if (err) {
                // console.log("errs", err);
                res.send({ err, massage: "dont show" });
              } else {
                db.query(
                  "Select  * " +
                    "From candidate_info  " +
                    "LEFT JOIN user_info " +
                    "ON user_info.User_id = candidate_info.User_id " +
                    " Where Id_event = ?",
                  [id_event],
                  (err, user2) => {
                    if (err) {
                      // console.log("errs", err);
                      res.send({ err, massage: "dont show" });
                    } else {
                      // console.log("ters ==");
                      res.send({
                        candidate: user2,
                        event: user,
                        massage: user3,
                        length: user3.length,
                      });
                    }
                  }
                );
              }
            }
          );
        }
      }
    }
  );
});

app.post("/showstaff", (req, res) => {
  const eventnow = req.body.eventnow;
  db.query(
    " SELECT user_info.Name AS name , user_info.Surname as surname  FROM `event_info` " +
      "LEFT JOIN user_info " +
      "ON event_info.User_id = user_info.User_id " +
      "where  Event_name  = ? ",
    [eventnow],
    (err, user) => {
      if (err) {
        res.send({ err, massage: "dont show" });
      } else {
        res.send({
          massage: user,
        });
      }
    }
  );
});

app.post("/showcandidate", (req, res) => {
  const eventnow = req.body.eventnow;
  var id_event = 0;
  db.query(
    "SELECT * FROM `event_info` where  Event_name  = ? ",
    [eventnow],
    (err, user) => {
      if (err) {
        // console.log("errs", err);
        // console.log("user == ", user);
        res.send({ err, massage: "dont show" });
      } else {
        if (user.length != 0) {
          id_event = user[0].Id_event;
        }
      }
    }
  );
});

app.post("/delete_par", (req, res) => {
  const id_par = req.body.id_par;
  const id_e = req.body.id_e;
  db.query(
    "DELETE  FROM participant where User_id = ? And Id_event = ?",
    [id_par, id_e],
    (err, result) => {
      if (err) {
        // console.log("err");
        res.send({ err, massage: "no delete" });
      } else {
        console.log("delete Parti");
        res.send({ massage: "delete" });
      }
    }
  );
});

app.post("/delete_can", (req, res) => {
  const id = req.body.id;
  db.query(
    "DELETE  FROM candidate_info where Id_can = ?  ",
    [id],
    (err, result) => {
      if (err) {
        // console.log("err");
        res.send({ err, massage: "no delete" });
      } else {
        console.log("delete candidate");
        res.send({ massage: "delete" });
      }
    }
  );
});

// Edit --------------------------------------------------------

app.get("/showevent", (req, res) => {
  db.query("select * from event_info where not Id_event = 0 ", (err, user) => {
    if (err) {
      // console.log("err");
      res.send({ err, massage: "dont show" });
    } else {
      res.send({
        user,
        massage: user,
        userlength: user.length,
      });
    }
  });
});

app.get("/showeventmanage", (req, res) => {
  db.query(
    "select * from event_info where not Id_event = 0 And status_event = 0 or status_event = 4",
    (err, user) => {
      if (err) {
        // console.log("err");
        res.send({ err, massage: "dont show" });
      } else {
        db.query(
          "SELECT COUNT(Par_id) As Par_id, event_info.Id_event  FROM `participant`"+
          " LEFT JOIN event_info"+
          " ON participant.Id_event = event_info.Id_event"+
          "  Where "+
          // " not participant.Authen = 'staff'"+
          " not event_info.Id_event = 0 AND event_info.status_event = 0 or event_info.status_event = 4"+
          " GROUP BY event_info.Id_event ASC;",
          (err, user2) => {
            if (err) {
              console.log("err show event manage = ", err);
            } else {
              db.query(
                "SELECT COUNT(Id_can) As Id_can , event_info.Id_event FROM `candidate_info` "+
                " LEFT JOIN event_info"+
                " ON candidate_info.Id_event = event_info.Id_event"+
                " WHERE event_info.status_event = 0 or event_info.status_event = 4 And not event_info.Id_event = 0 "+
                " GROUP BY event_info.Id_event  ASC;",
                (err, user3) => {
                  if (err) {
                    console.log("err show event manage = ", err);
                  } else {
                    res.send({
                      massage: user,
                      massage2: user2,
                      massage3: user3,
                      userlength: user.length,
                    });
                  }
                }
              );
            }
          }
        );
      }
    }
  );
});

app.post("/Delete_e", (req, res) => {
  const name_event = req.body.name_event;
  var idE = "";
  try {
    db.query(
      "select * from event_info where Id_event = " + "'" + name_event + "'",
      (err, user) => {
        if (err) {
          // console.log("err Delete_e = ", err);
        } else {
          idE = user[0].Event_name;
          db.query(
            "DELETE from candidate_info where Id_event = " +
              "'" +
              name_event +
              "'",
            (err, result1) => {
              if (err) {
                // console.log("err1 ==", err);
              } else {
                // console.log("Delete 1 == ", name_event, result1);
              }
            }
          );
        }
      }
    );
    db.query(
      "DELETE FROM participant where Id_event = " + name_event,
      (err, user1) => {
        if (err) {
          // console.log("err2 == ", err);
        } else {
          // console.log("Delete 2");
        }
      }
    );
    db.query(
      "DELETE FROM event_info where Id_event = " + name_event,
      (err, user2) => {
        if (err) {
          // console.log("err3 == ", err);
        } else {
          // console.log("Delete 3");
          res.send({ massage: "Delete Sugsess", user2: user2 });
        }
      }
    );
  } catch (err) {
    // console.log("catch  = ", err);
  }
});

app.post("/edit_evemt", (req, res) => {
  const id_e = req.body.id_e;
  const event_name = req.body.event_name;
  const event_start = req.body.event_start;
  const event_detail = req.body.event_detail;
  const event_end = req.body.event_end;
  const date_e = req.body.date_e;
   
  db.query(
    "Update  event_info  set Event_name = ? , Event_detail = ? , Time_start = ? , Time_end = ? ,Date_vote = ? " +
      " where Id_event = ?  ",
    [event_name, event_detail, event_start, event_end,date_e, id_e],
    (err, user) => {
      if (err) {
        // console.log("err");
        res.send({ err, massage: "dont show" });
      } else {
        res.send({
          user,
          massage: "ok",
          userlength: user.length,
        });
      }
    }
  );
});


app.post("/addparticipant_Edit", (req, res) => { 
  const Email = req.body.Email;
  const count = req.body.count;
  const password = req.body.password;
  const idE = req.body.id_e;
  var key = 0;
  const Authen = req.body.Authen;
  const gento = jwt.sign({ userinfo: Email, authen: Authen }, gentoken); 
  var idp = 9999999;
  const buff = Buffer.from(password, "utf-8");
  const base64 = buff.toString("base64");


  console.log("Email == ", Email );
  console.log("count == ", count );
  console.log("password == ", password );

  db.query(
    "select * from user_info where Email = ?",
    [Email],
    (err, user1) => {
      if (err) {
        // console.log("err1", err);
      } else { 
          key = user1[0].User_id;
          db.query(
            "SELECT * FROM participant WHERE User_id = ? AND Id_event = ?",
            [key, idE],
            (err, user2) => {
              if (err) {
                // console.log("err2", err);
              }
              if (user2.length != 0) {
                console.log("datadup");
                res.send({ massage: "datadup" });
              } else {
                db.query("SELECT * FROM participant", 
                (err, user3) => {
                  if (err) {
                    // console.log("err2", err);
                  }
                  if (
                    count != user3[user3.length - 1].Par_id ||
                    user3[user3.length].Par_id == null
                  ) {
                    idp = user3[user3.length - 1].Par_id + 1;
                    db.query(
                      "INSERT INTO participant (Par_id,User_id,Id_event,Email,Password,Token,Authen) VALUEs(?,?,?,?,?,?,?)",
                      [count, key, idE, Email, base64, gento, Authen],
                      (err, user) => {
                        if (err) {
                          console.log("err3 = ", err);
                          res.send({ massage: "fail", err });
                        } else {
                          // console.log("test = = ", user);
                          res.send({
                            user,
                            lengthdata: user.length,
                            massage: "insertsubmit",
                          });
                        }
                      }
                    );
                  }
                });
              }
            }
          ); 
      }
    }
  );
});


// app.post("/Delete_e", (req, res) => {
//   const name_event = req.body.name_event;
//   var idE = "";
//   db.query(
//     "select * from event_info where Id_event = " + "'" + name_event + "'",
//     (err, user) => {
//       if (err) {
//         // console.log("err Delete_e = ", err);
//       } else {
//         idE = user[0].Event_name;
//         db.query(
//           "DELETE participant , candidate_info ,event_info" +
//           " FROM participant" +
//           " LEFT JOIN candidate_info "+
//           " ON participant.Id_event = candidate_info.Id_event "+
//           " LEFT JOIN event_info ON participant.Id_event = event_info.Id_event" +
//           " WHERE event_info.Id_event = "+name_event+"or candidate_info.Id_event = "+name_event,
//           (err, result1) => {
//             if (err) {
//               // console.log("err1", err);
//               res.send({ err, massage: "no delete", err: err });
//             } else {
//               // console.log("Delete 1 == " , name_event ,result1);
//               res.send({ massage: "Delete Sugsess", result1: result1 });
//             }
//           }
//         );
//       }
//     }
//   );
// });

// app.post("/Delete_e", (req, res) => {
//   const name_event = req.body.name_event;
//   var idE = "";
//   db.query(
//     "select * from event_info where Id_event = " + "'" + name_event + "'",
//     (err, user) => {
//       if (err) {
//         // console.log("err Delete_e = ", err);
//       } else {
//         idE = user[0].Event_name;
//         db.query(
//           "DELETE FROM participant where Id_event = " + name_event,
//           (err, result1) => {
//             if (err) {
//               // console.log("err1", err);
//               res.send({ err, massage: "no delete", err: err });
//             } else {
//               // console.log("Delete 1");
//               res.send({ massage: "Delete Sugsess", result1: result1 });
//               db.query(
//                 "DELETE FROM candidate_info where Id_event = " +
//                   "'" +
//                   name_event +
//                   "'",
//                 (err, result2) => {
//                   if (err) {
//                     // console.log("err1", err);
//                     res.send({ err, massage: "no delete", err: err });
//                   } else {
//                     // console.log("Delete 2");
//                     res.send({ massage: "Delete Sugsess", result2: result2 });
//                     db.query(
//                       "DELETE FROM event_info where Id_event = " +
//                         "'" +
//                         name_event +
//                         "'",
//                       (err, result3) => {
//                         if (err) {
//                           // console.log("err1", err);
//                           res.send({ err, massage: "no delete", err: err });
//                         } else {
//                           // console.log("Delete 3");
//                           res.send({ massage: "Delete Sugsess", result3: result3 });
//                         }
//                       }
//                     );
//                   }
//                 }
//               );
//             }
//           }
//         );
//       }
//     }
//   );
// });

// Create Staff ------------------------------------------------

app.post("/Createstaff", (req, res) => {
  const userinfo = req.body.userinfo;
  const password = req.body.password;
  const getname = req.body.getname;
  var id = 0;
  var token = [];
  for (id; id < userinfo.length; id++) {
    const gento = jwt.sign({ userinfo: userinfo[id] }, gentoken);
    token[id] = gento;
    // console.log(token);
    db.query(
      "INSERT INTO user_info (email,password,token,name_event,level) VALUEs(?,?,?,?,?,3)",
      [id, userinfo[id], password[id], token[id], getname],
      (err, user) => {
        if (err) {
          res.send({
            result: "fail",
            massage: userinfo,
            userlength: userinfo.length,
            getnamelength: getname,
            err: err,
          });
        }
        if (id > userinfo.length) {
          res.send({ massage: "insert data info_user", err: err });
          // console.log("insertqweqwe");
        }
      }
    );
  }
  if (id >= userinfo.length) {
    res.send({
      massage: "insert data info_user",
      idss: id,
      userinsert: userinfo,
      length: userinfo.length,
    });
    // console.log("insert");
  }
});

app.post("/createadmin", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const authen = req.body.authen;
  const level = req.body.level;
  const gento = jwt.sign({ userinfo: username, authen: authen }, gentoken);

  const buff = Buffer.from(password, "utf-8");
  const base64 = buff.toString("base64");

  db.query(
    "INSERT INTO user_info (email , password , token , name_event , level) VALUEs(?,?,?,?,?)",
    [username, base64, gento, authen, level],
    (err, user) => {
      if (err) {
        res.send({ massage: "fail", err });
      } else {
        res.send({
          user,
          massage: "insertsubmit",
        });
      }
    }
  );
});

// Edit_Event --------------------------------------------------

app.post("/Showdetailevent", (req, res) => {
  const namm_edit = req.body.namm_edit;
  db.query(
    "select * from prepare_data_event where p_name_event = " +
      "'" +
      namm_edit +
      "'",
    (err, user) => {
      if (err) {
        res.send({ massage: "fail", err });
      } else {
        res.send({
          naem_e: user[0].p_name_event,
          detail: user[0].p_detail_e,
          start: user[0].p_start_e,
          end: user[0].p_end_e,
          anonimus: user[0].p_check_anonimus,
          massage: user,
        });
      }
    }
  );
});

// app.post("/Update_event", (req, res) => {
//   const namm_edit = req.body.namm_edit;
//   const name_e = req.body.name_e;
//   const detail = req.body.detail;
//   const start = req.body.start;
//   const end = req.body.end;
//   const anon = req.body.anon;
//   db.query(
//     "UPDATE prepare_data_event SET p_name_event =" +
//       "'" +
//       name_e +
//       "'" +
//       "," +
//       "p_detail_e = " +
//       "'" +
//       detail +
//       "'" +
//       ",p_start_e = " +
//       "'" +
//       start +
//       "'" +
//       ",p_end_e = " +
//       "'" +
//       end +
//       "'" +
//       ",p_check_anonimus = " +
//       anon +
//       " WHERE p_name_event = " +
//       "'" +
//       namm_edit +
//       "'",
//     (err, user) => {
//       if (err) {
//         // console.log("No Update 1");
//         res.send({ massage: "No Update 1", err });
//       } else {
//         // console.log("Update1");
//         db.query(
//           "UPDATE prepare_data_candidate SET p_name_e =" +
//             "'" +
//             name_e +
//             "'" +
//             "  WHERE p_name_e = " +
//             "'" +
//             namm_edit +
//             "'",
//           (err, user) => {
//             if (err) {
//               // console.log("No Update 2");
//               res.send({ massage: "No Update 2 ", err });
//             } else {
//               // console.log("Update2");
//               db.query(
//                 "UPDATE prepare_mailuser SET name_event =" +
//                   "'" +
//                   name_e +
//                   "'" +
//                   "  WHERE name_event = " +
//                   "'" +
//                   namm_edit +
//                   "'",
//                 (err, user) => {
//                   if (err) {
//                     // console.log("No Update 3");
//                     res.send({ massage: "No Update 3", err });
//                   } else {
//                     // console.log("Update 3");
//                     res.send({ massage: "Can Update 3", user });
//                   }
//                 }
//               );
//             }
//           }
//         );
//       }
//     }
//   );
// });

// app.post("/Delete_event" , (req,res ) =>{
//   db.query( "DELETE FROM prepare_mailuser where id_user = " + id,
//     (err, result) => {
//       if (err) {
//         // console.log("err");
//         res.send({ err, massage: "no delete", id: id });
//       } else {
//         res.send({
//           result,
//         });
//       }
//     }
//   );
// });
// Staff/Admin  ------------------------------------------------

app.get("/showStaff", (req, res) => {
  db.query(
    " select participant.Par_id as id, user_info.Name as Name, user_info.Surname as Surname , user_info.Email as Email, participant.Authen as Authen " +
      " from participant LEFT JOIN user_info " +
      " ON participant.User_id = user_info.User_id" +
      " WHERE participant.Authen = 'admin' or participant.Authen = 'staff'" +
      " GROUP BY participant.User_id " +
      " ORDER BY participant.Par_id;",
    (err, user) => {
      if (err) {
        // console.log("err", err);
        res.send({ err, massage: "dont show" });
      } else {
        // console.log(user);
        res.send({
          user,
          massage: user,
          userlength: user.length,
        });
      }
    }
  );
});

//--------  Election   Vote------------------------------------------------------

app.post("/Vote", (req, res) => {
  const id_par = req.body.id_par;
  const vote = req.body.id_candidate; 
  const date = req.body.date;
  const clockState = req.body.clockState;
  const id_e = req.body.id_e;
  var phash = "";
  var count = 0;
  var time = [];
  var timecount = "";
  var timehash = 0;
  var a = 0;
  var b = 0;
  var c = 0; 

  const buff = Buffer.from(vote.toString(), "utf-8");
  const base64 = buff.toString("base64");
 

  db.query(
    "select * from participant where Id_event = " + id_e,
    (err, data0) => {
      if (err) {
        console.log("fail1", err);
      } else {
        for (var i = 0; i < data0.length; i++) {
          // // console.log("hash = = ", i , " = = ",data[i].hash_vote);
          if (data0[i].hash_vote != null) {
            timehash = +1;
            if (timehash == 1) {
              c = i;
            }
          }
        }
        if (timehash == 0) {
          // console.log("Nodata");
        } else if (timehash == 1) {
          phash = data0[c].hash_vote;
          // console.log("P_hash = ", data0[c].hash_vote);
        } else {
          for (var i = 0; i < data0.length; i++) {
            time[i] = data0[i].Time_vote;
            // console.log("time = = ", i, "==", time[5], " = = ", time[1]);
            if (time[i] != null) {
              time[a] = time[i];
              // console.log("TIME A == ", a, "== ", time[a]);
              a++;
            }
            if (time[b] < time[b + i]) {
              timecount = time[b + i];
              // // console.log("TIME Count 1== ", b, "== ", timecount);
              b++;
            } else if (time[b] > time[b + i]) {
              timecount = time[b];
              // // console.log("TIME Count 2 == ", b, "== ", timecount);
            }
          }
          db.query(
            "select * from participant where Time_vote = " +
              "'" +
              timecount +
              "'",
            (err, data1) => {
              if (err) {
                // console.log("fail1", err);
              } else {
                // // console.log("data = ", timecount, data1);
                phash = data1[0].hash_vote;
              }
            }
          );
        }
      }
    }
  );

  // -----------------------------------------------------------------------

  db.query(
    "select * from participant where Id_event = " + id_e,
    (err, data) => {
      if (err) {
        // console.log("fail1", err);
      } else {
        for (var i = 0; i < data.length; i++) {
          // // console.log("hash = = ", i , " = = ",data[i].hash_vote);
          if (data[i].hash_vote != null) {
            count = +1;
          }
        }
        if (data.length >= 0) {
          if (count > 0 && phash != null) {
            bcrypt.hash(
              id_par + vote + phash + date + clockState,
              saltRounds,
              function (err, hash1) {
                // Set hash Mailuser
                db.query(
                  "UPDATE  participant SET  Vote = ? , hash_vote  = ? , P_hash = ? , ElecStatus = '2' , " +
                    " Date_vote = ?  , Time_vote = ? " +
                    " WHERE  Par_id = " +
                    id_par,
                  [base64, hash1, phash, date, clockState],
                  (err, user1) => {
                    if (err) {
                      console.log("err Vote 2 == ", err);
                    } else {
                      // console.log("CanVote Old");
                      console.log("CanVote = ", vote);
                      console.log("hash1  = ", hash1);
                      console.log("phash = ", phash);
                      console.log("date = ", date);
                      console.log("clockState = ", clockState);
                      res.send({
                        user1,
                        Massage: "insert1",
                      });
                    }
                  }
                );
              }
            );
          } else {
            bcrypt.hash(
              id_par + vote + 0 + date + clockState,
              saltRounds,
              function (err, hash1) {
                // Set hash Mailuser
                db.query(
                  "UPDATE  participant SET  Vote = ? , hash_vote  = ? , P_hash = '0' , ElecStatus = '2', " +
                    " Date_vote = ?  , Time_vote = ?  " +
                    " WHERE  Par_id = " +
                    id_par,
                  [base64, hash1, date, clockState],
                  (err, user2) => {
                    if (err) {
                      console.log("err Vote 3 == ", err);
                    } else {
                      // console.log("CanVote New");
                      // console.log("idpar  New", id_par);
                      // console.log("vote New", vote);
                      // console.log("hash1 New", hash1);
                      // console.log("date New", date);
                      res.send({
                        user2,
                        Massage: "insert2",
                      });
                    }
                  }
                );
              }
            );
          }
        }
      }
    }
  );
});
 // ============================================================================
// app.post("/Vote", (req, res) => {
//   const getname = req.body.getname;
//   const getuser = req.body.getuser;
//   const id = req.body.id;
//   var no_u = 0;
//   db.query(
//     "select * from results_vote where event = " + "'" + getname + "'",
//     (err, data) => {
//       if (err) {
//         // console.log("fail1", err);
//         data.send({ massage: "fail1", err });
//       } else {
//         if (data.length >= 0) {
//           no_u = data.length + 1;
//           if (data.length > 0) {
//             bcrypt.hash(
//               getuser + getname + id,
//               saltRounds,
//               function (err, hash1) {
//                 // Set hash Mailuser
//                 bcrypt.hash(getuser, saltRounds, function (err, hash2) {
//                   db.query(
//                     "insert into results_vote(no_user,user,vote,event,hash,p_hash) Values(?,?,?,?,?,?)",
//                     [
//                       no_u,
//                       hash2,
//                       id,
//                       getname,
//                       hash1,
//                       data[data.length - 1].hash,
//                     ],
//                     (err, Result) => {
//                       if (err) {
//                         // console.log("fail2", err);
//                         res.send({ massage: "fail2", err });
//                       } else {
//                         // console.log("Insert Sugcess");
//                         db.query(
//                           "DELETE FROM user_info where email = ?",
//                           [getuser],
//                           (err, res2) => {
//                             if (err) {
//                               res.send({ Massage: "No insert", resError: err });
//                             } else {
//                               res.send({ Massage: "insert", res: res2 });
//                             }
//                           }
//                         );
//                       }
//                     }
//                   );
//                 });
//               }
//             );
//           } else {
//             bcrypt.hash(
//               getuser + getname + id,
//               saltRounds,
//               function (err, hash1) {
//                 // Set hash Mailuser
//                 bcrypt.hash(getuser, saltRounds, function (err, hash2) {
//                   db.query(
//                     "insert into results_vote(no_user,user,vote,event,hash,p_hash) Values(?,?,?,?,?,?)",
//                     [no_u, hash2, id, getname, hash1, 0],
//                     (err, Result) => {
//                       if (err) {
//                         // console.log("fail2", err);
//                         res.send({ massage: "fail2", err });
//                       } else {
//                         // console.log("Insert Sugcess 0");
//                         db.query(
//                           "DELETE FROM user_info where email = ?",
//                           [getuser],
//                           (err, res2) => {
//                             if (err) {
//                               res.send({ Massage: "No insert", resError: err });
//                             } else {
//                               res.send({ Massage: "insert No.0", res: res2 });
//                             }
//                           }
//                         );
//                       }
//                     }
//                   );
//                 });
//               }
//             );
//           }
//         }
//       }
//     }
//   );
// });

// Check Event Stutus ------------------------------------------

app.post("/Checkevent", (req, res) => {
  const date_now = req.body.date;
  const time_now = req.body.clockState;
  var name_event = [];
  var nac = [];
  const date_time_now = date_now + " " + time_now;
  var date_event = "";
  var eventdate_end = "";
  var end_event = ""; 

  const timecheck = "2022-12-7 03:20:00";

  db.query("SELECT * FROM `event_info` where status_event = 0 or status_event = 4;", (err, user) => {
    if (user == null){
      res.send({ massage: "Don't Update" });
    }
    if (err) {
      // console.log("Err Check Evenr = ", err);
    }
    else if (user.length != 0) { 
      for (var i = 0; i < user.length; i++) {
        date_event = user[i].Date_vote + " " + user[i].Time_end;
        end_event = user[i].Time_end;
        eventdate_end = user[i].Date_vote;
  

        const date1 = new Date(date_time_now); 
        const date2 = new Date(date_event);  

        if (date1 > date2) { 
          nac[i] = user[i].Event_name; 
          db.query(
            " UPDATE  event_info   SET  status_event = '1'  WHERE Id_event = " +
              user[i].Id_event,
            (err, user2) => {
              if (err) {
                console.log("err update status event = ", err);
              } else {
                var a = 0;
                name_event = nac;
                console.log("Update Status"); 
                a++;
              }
            }
          );
        } 
        else if(date1.getFullYear() == date2.getFullYear() && date1.getMonth() == date2.getMonth() && date1.getDate() == date2.getDate()){ 
              db.query(
                " UPDATE  event_info   SET  status_event = '4'  WHERE Id_event = " +
                  user[i].Id_event,
                (err, user2) => {
                  if (err) {
                    console.log("err update status event = ", err);
                  } else {
                    var a = 0;
                    name_event = nac;
                    console.log("Update Status"); 
                    a++;
                  }
                }
              ); 
        }
          else { 
        }
      }
      db.query(
        " UPDATE participant " +
          " INNER JOIN event_info " +
          " ON participant.Id_event = event_info.Id_event  " +
          " SET participant.Date_vote = "+"'"+eventdate_end+"'"+
          " ,participant.Time_vote = " +"'"+end_event+"'"+
          " WHERE  event_info.status_event = 1" +
          " And participant.Authen = 'participant' " +
          " And participant.ElecStatus = " +
          "'0'", 
        (err, user3) => {
          if (err) {
            // console.log("Err UPDATE participant เกินเวลา  ", err);
          } else {
            db.query(
              " UPDATE participant " +
                " INNER JOIN event_info " +
                " ON participant.Id_event = event_info.Id_event  " +
                " SET  participant.Date_vote = "+"'"+eventdate_end+"'"+
                " ,participant.Time_vote = " +"'"+end_event+"'"+
                " WHERE  event_info.status_event = 1"+
                " And participant.ElecStatus = " +
                "'1'", 
              (err, user4) => {
                if (err) {
                  // console.log("Err UPDATE participant เกินเวลา  ", err);
                } else {
                  console.log("end_event  eventdate_end");

                  // console.log(end_event , " 1=1 " , eventdate_end);
                }
              }
            );
          }
        }
      );
      console.log(name_event);
      res.send({ 
        massage: "Update" ,
        File_name : name_event
       });
    } else {
      // console.log("No Event");
      res.send({ massage: "Don't Update" });
    }

    //เขียน For เช็คหา Event ที่มีวันที่ เจอแล้วเอาวันที่มาเช็คกับเวลาปัจจุบันถ้ามากกว่า ให้ Event เลี่ยนสเตตัส

    // // console.log("Date  now == ", date1+ "  == "+date2);
    // // console.log("Time  now == ", time_now);
    // if(date1 > date2){
    //   // console.log(" 1 ");
    // } else {
    //   // console.log(" 2 ");
    // }

    //  for(var i = 0 ; i<user.length ;i++){

    //  }
  });
});

app.post("/chekdisible2", (req, res) => {
  const i_event = req.body.i_event;

  const date_check = req.body.date_check;
  const time_check = req.body.time_check;

  const date_time_now = date_check + " " + time_check;
  var date_event = "";

  db.query(
    "select * from event_info where Id_event = " + i_event,
    (err, user) => {
      try{
        date_event = user[0].Date_vote + " " + user[0].Time_start;
        const date1 = new Date(date_time_now);
        const date2 = new Date(date_event);
      if (err) {
        console.log("User Vote chekdisible", err);
      }
      if (date2 > date1) {
        console.log(date1, " 1==1 ", date2);
        res.send({ massage: "true"  });
      }
      if (user[0].status_event != 0  && user[0].status_event != 4 ) {
        console.log(user[0].status_event, " =  user[0].status_event 0  ");

        res.send({ massage: "End" });
      }  else {
        res.send({ timeout : user[0].timeout});

      }
      } catch(err){
        console.log("Err == " , err)
      }
      
    }
  );
});

app.post("/chekdisible", (req, res) => {
  const i_event = req.body.i_event;

  db.query(
    "select * from event_info where Id_event = " + i_event,
    (err, user) => {
      if (err) {
        // console.log("User Vote chekdisible", err);
      }
      if (user[0].status_event == 1) {
        res.send({ massage: "true" });
      } else {
        res.send({ massage: "false" });
      }
    }
  );
});

// Show Event Stat -------------------------------------------------------------------

app.post("/showeventstat", (req, res) => {
  db.query(
    "select * from event_info where not Id_event = 0 And not status_event = 0 ",
    (err, user) => {
      if (err) {
        // console.log("err");
        res.send({ err, massage: "dont show" });
      } else {
        db.query(
          "SELECT COUNT(Par_id) as nopar  , event_info.Id_event FROM `participant` " +
            " LEFT JOIN event_info " +
            "  ON participant.Id_event = event_info.Id_event  " +
            " Where not Authen = 'staff'  and not event_info.Id_event = 0  AND NOT event_info.status_event = 0 " +
            " GROUP BY Id_event ASC; ",
          (err, user2) => {
            if (err) {
              // console.log("err show event manage = ", err);
            } else {
              db.query(
                "SELECT COUNT(Id_can) as nocan , event_info.Id_event FROM `candidate_info` " +
                  " LEFT JOIN event_info " +
                  " ON candidate_info.Id_event = event_info.Id_event " +
                  " Where not event_info.Id_event = 0   AND NOT event_info.status_event = 0 " +
                  " GROUP BY Id_event  ASC; ",
                (err, user3) => {
                  if (err) {
                    // console.log("err show event manage = ", err);
                  } else {
                    res.send({
                      massage: user,
                      massage2: user2,
                      massage3: user3,
                      userlength: user.length,
                    });
                  }
                }
              );
            }
          }
        );
      }
    }
  );
});

// Show Staff Event -----------------------------------------------------------------

app.post("/showeventStaff", (req, res) => {
  db.query(
    "select * from event_info where not Id_event = 0 And not status_event = 0",
    (err, user) => {
      if (err) {
        // console.log("err");
        res.send({ err, massage: "dont show" });
      } else {
        db.query(
          "SELECT COUNT(Par_id) as nopar  , Id_event FROM `participant` Where not Authen = 'staff'  and not Id_event = 0 GROUP BY Id_event ASC ",
          (err, user2) => {
            if (err) {
              // console.log("err show event manage = ", err);
            } else {
              db.query(
                "SELECT COUNT(Id_can) as nocan , Id_event FROM `candidate_info` Where not Id_event = 0 GROUP BY Id_event  ASC ",
                (err, user3) => {
                  if (err) {
                    // console.log("err show event manage = ", err);
                  } else {
                    res.send({
                      massage: user,
                      massage2: user2,
                      massage3: user3,
                      userlength: user.length,
                    });
                  }
                }
              );
            }
          }
        );
      }
    }
  );
});

// Show Result Event -------------------------------------------

app.post("/showrevent_result", (req, res) => { 
      const ID_user = req.body.ID_user;
      const Id_event = req.body.Id_event;
      let password = "";
      let name = "";

      console.log("ID_user = ", ID_user);
      console.log("Id_event = ", Id_event);
  db.query(
    "select * from participant where Id_event = ? And User_id = ?",
    [Id_event,ID_user],
    (err, user) => {
      if(user[0].Vote == null){
        res.send({Name: "คุณไม่ได้ทำการเลือกตั้ง"})
      } else{
        const buff = Buffer.from(user[0].Vote, "base64");
        password = buff.toString("utf-8");
        if (err) {
          console.log("User Vote chekdisible", err);
        } else {
          console.log("User ID = " , user[0].User_id );
          db.query("select * from candidate_info where Id_can = ? And Id_event = ?",
          [password , Id_event],
          (err ,user0) => {
            if(err){
              console.log("Error Name = "+err)
            }else{ 
              db.query("select * from user_info where User_id = ?" ,
              [user0[0].User_id],
              (err , user1) => {
                if(err){
                  console.log("รายชื่อ เออเร่อ  = "+err)
                }else {
                  name = user1[0].Name + " "+ user1[0].Surname;
                  console.log("Name  =" +name );
      
                  res.send({ 
                  massage: user[0] ,
                  password: password,
                  Name:name
                });
                }
              }) 
            }
          })
        }
      } 
    }
  );
});

app.post("/showrevent", (req, res) => {
  const Id_event = req.body.Id_event;
  db.query(
    "select * from event_info where Id_event = " + Id_event,
    (err, user) => {
      if (err) {
        console.log("User Vote chekdisible", err);
      } else {
        res.send({ massage: user[0] });
      }
    }
  );
});

app.post("/votestat", (req, res) => {
  const Id_event = req.body.Id_event;
  db.query(
    "SELECT  COUNT(Par_id)  AS par FROM `participant`  WHERE Id_event = ? AND NOT Authen = 'staff' AND ElecStatus = 0 GROUP BY ElecStatus;",
    [Id_event],
    (err, user) => {
      if (err) {
        console.log("User Vote votestat", err);
      } else {
        db.query(
          "SELECT COUNT(Par_id) AS novote FROM `participant`  WHERE Id_event = ? AND NOT Authen = 'staff' AND ElecStatus = 2 And Vote = 0",
          [Id_event],
          (err, user2) => {
            if (err) {
              console.log("User Vote votestat", err);
            } else {
              db.query(
                "SELECT COUNT(Par_id) AS Vote FROM `participant`  WHERE Id_event = ? AND NOT Authen = 'staff' AND ElecStatus = 2;",
                [Id_event],
                (err, user3) => {
                  if (err) {
                    console.log("User Vote votestat", err);
                  } else {
                    // console.log("User1 == ", user);
                    // console.log("User2 == ", user2);
                    // console.log(user);
                    // console.log(user2);
                    res.send({
                      massage: user,
                      massage2: user2,
                      massage3: user3,
                    });
                  }
                }
              );
            }
          }
        );
      }
    }
  );
});

app.post('/Show_Vote' , (req,res) => { 
  const id_event = req.body.id_event;
  var j = 0;
  var k = 0;
  var Img_s ="";
  var check = 0 ;
  var s = "" ;

  var str = []; 

  db.query("select * from participant where Authen = 'participant' And Id_event = "+id_event +" and not Vote is null" , 
  (err , user0) => {
    if(err){
      console.log(err);
    } else {
      for(var i = 0 ; i<user0.length ;i++){ 
        // if(user0[i].Vote != null){
          s = user0[i].Vote;
          const buff = Buffer.from(user0[i].Vote, "base64");
          str[j] = buff.toString("utf-8");
          // console.log(user0[i]," =  sdasd =",str[j]);
          
          db.query(" Update participant SET Vote = ?"+
          " WHERE Vote = ?",
          [str[j],user0[i].Vote],
          (err,user1) => {
            if(err){
              console.log(err)
            } else {
              check++
            }
          })
          j++; 
        // } 
      }  
      db.query(
        "SELECT user_info.Name , user_info.Surname ,COUNT(Vote) AS COUNT , candidate_info.Detail , candidate_info.Img as Img" +
          "  FROM participant  " +
          "  LEFT JOIN  candidate_info  " +
          " ON participant.Id_event = candidate_info.Id_event  " +
          " AND participant.Vote = candidate_info.Id_can  " +
          " LEFT JOIN user_info " +
          " ON candidate_info.User_id = user_info.User_id  " +
          " where candidate_info.Id_event = ? AND NOT candidate_info.Id_can = 0  GROUP BY Vote order by COUNT DESC;",
        [id_event],
        (err, user) => {
          if (err) {
            console.log("User Vote chekdisible", err);
          }  else {
            // console.log("Usersd " +user) 
            console.log('ok = ',user.length);
            if(user.length == 0){
              res.send({
              massage : 'ok',
              check : s, 
              Img:"no_vote.png"
             }) 
            }else {
              res.send({
                massage : 'ok',
                check : s,
                Img: user[0].Img
               }) 
            }
            
          }
        }
      ) 
    }
  })
})

app.post("/showresult", (req, res) => {
  const Id_event = req.body.Id_event;
  const V = req.body.V;
  var j = 0;
  var k = 0;
  var check = 99 ;
 
  db.query(
    "SELECT user_info.Name , user_info.Surname ,COUNT(Vote) AS COUNT , candidate_info.Detail , candidate_info.Img" +
      "  FROM participant  " +
      "  LEFT JOIN  candidate_info  " +
      " ON participant.Id_event = candidate_info.Id_event  " +
      " AND participant.Vote = candidate_info.Id_can  " +
      " LEFT JOIN user_info " +
      " ON candidate_info.User_id = user_info.User_id  " +
      " where candidate_info.Id_event = ? AND NOT candidate_info.Id_can = 0  GROUP BY Vote order by COUNT DESC;",
    [Id_event],
    (err, user) => {
      if (err) {
        console.log("User Vote chekdisible", err);
      } else {  
        db.query("select * from participant where Authen = 'participant' And Id_event = "+Id_event  , 
        (err , user3) => {
          if(err){
            console.log(err);
          } else {   
            for(var i = 0 ; i <user3.length ;i++){
              // console.log(i);
              if(V == user3[i].Vote){
                check = 0;
                // console.log("V = " , V , " = ",user3[i].Vote)
              }  
            }
            if(check != 0){
                for(var i = 0 ; i<user3.length ;i++){  
                if(user3[i].Vote != null){  
                  const buff = Buffer.from(user3[i].Vote.toString(), "utf-8");
                  const base64 = buff.toString("base64"); 
                  var stt = []; 
                  stt[k] = buff.toString("base64");
                  console.log(user3[i].Vote," =  Buff =",stt[k]); 
                  db.query(" Update participant SET Vote = ?"+
                  " WHERE Vote = ?",
                  [stt[k],user3[i].Vote],
                  (err,user1) => {
                    if(err){
                      console.log(err)
                    } else {
                      // console.log(stt[k] , " = ")
                    }
                  })
                  k++; 
                } 
              }  
            } else {
              
            }
          }
        }) 
        // console.log(user , check);
        res.send({ 
          massage: user,
          massage2:user[0]
         }); 
      }
    }
  ); 
});

app.post('/hind_Vote' , (req,res) => {
  const Id_event = req.body.Id_event; 
  var k = 0;  
  db.query("select * from participant where Authen = 'participant' And Id_event = "+Id_event  , 
  (err , user3) => {
    if(err){
      console.log(err);
    } else {
      for(var i = 0 ; i<user3.length ;i++){ 
        if(user3[i].Vote != null){  
          const buff = Buffer.from(user3[i].Vote.toString(), "utf-8");
          const base64 = buff.toString("base64"); 
          var stt = [];

          stt[k] = buff.toString("base64");
          // console.log(user3[i].Vote," =  sdasd =",stt[k]);
          
          db.query(" Update participant SET Vote = ?"+
          " WHERE Vote = ?",
          [stt[k],user3[i].Vote],
          (err,user1) => {
            if(err){
              console.log(err)
            } else {
              // console.log(stt[k] , " = ")
            }
          })
          k++; 
        } 
      }  
    }
  })
})

app.post("/showuserevent", (req, res) => {
  const name = req.body.name;
  const surname = req.body.surname;
  var id_user = 0;
  var id_E = [];
  var i = 0;
 
  db.query(
    "select * from user_info Where Name = ? And Surname = ? ",
    [name, surname],
    (err, idu) => {
      if (err) {
        console.log("err ShowEvent User =", err);
        console.log("err ShowEvent User =", name);
        console.log("err ShowEvent User =", surname);
      } else { 
        db.query(
          "select event_info.Id_event , participant.User_id , event_info.Event_name , event_info.Date_vote , event_info.Time_start , event_info.Time_end , event_info.status_event" +
            " from participant  " +
            " LEFT JOIN event_info" +
            " ON participant.Id_event = event_info.Id_event" +
            " Where User_id = ? And Authen = 'staff'",
          [idu[0].User_id],
          (err, idp) => {
            if (err) {
              console.log("err ShowEvent IDP =", err);
            } else {
              // db.query("select * from event_info where ")
              // console.log("ID Event = " , idp)
              res.send({
                massage: idp,
              });
            }
          }
        );
      }
    }
  );
});

app.get("/showallevent", (req, res) => {
  db.query(
    "select * from event_info where not Id_event = 0 And status_event = 0",
    (err, user) => {
      if (err) {
        console.log("err all event = ", err);
        res.send({ err, massage: "dont show" });
      } else {
        console.log("all event = ", user);

        res.send({ massage: user });
      }
    }
  );
});

// Update Status Event ============================================

app.post("/update_event", (req, res) => {
  const Id_event = req.body.Id_event;
  var check = 0;
  const data3  = req.body.data3;
  var hash_check = []; 
  
  console.log(data3);
  db.query(
    "Update event_info set status_event = 2 Where Id_event = " + Id_event,
    (err, user) => {
      if (err) {
        console.log("err all event = ", err);
        res.send({ err, massage: "dont show" });
      } else {
        res.send({ massage: true });
      }
    }
  ); 
});

app.post("/user_count", (req, res) => {
  const Id_event = req.body.Id_event;  
  db.query(
    "select Email from participant  Where Authen = 'participant'And Id_event = " + Id_event,
    (err, user) => {
      if (err) {
        console.log("err all event = ", err);
        res.send({ err, massage: "dont show" });
      } else {
        res.send({ massage: user });
      }
    }
  ); 
});



const storage2 = multer.diskStorage({
  destination: path.join("../ux-project/src/", "File"),
  filename: function (req, file, cb) {
    // null as first argument means no error
    const name123 = file.originalname;
    console.log("Name 123 = " , name123);
    cb(null, name123);
    // console.log("asdasd", file, name123);
  },
});

app.post("/file", (req, res) => {
  let upload = multer({ storage: storage2 }).single("file");
  upload(req, res, function (err) {
    // req.file contains information of uploaded file
    // req.body contains information of text fields
    if (!req.file) {
      // console.log("res1");
      return res.send("Please select an image to upload");
    } else if (err instanceof multer.MulterError) {
      // console.log("res2");
      return res.send(err);
    } else if (err) {
      // console.log("res3");
      return res.send(err);
    } else {
      classifiedsadd = req.file.originalname;
      console.log("classifiedsadd = " , classifiedsadd)
      res.send({ massage: classifiedsadd });
       
      // console.log(req.file.originalname);
      // console.log(req.get.name123);
      // db.query("INSERT INTO prepare_data_candidate (p_image_c) VALUEs(?)",[classifiedsadd], (err, results) => {  if (err) throw err;
      // res.send({ success: 1 })
      // });

    }
  })
})

app.post("/sendmail_End2", (req, res) => {
  const event_name = req.body.event_name;  
  const Email = req.body.Email;  
  let massage = ('');  
  
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "Evotingcase2022@gmail.com", // your email
      pass: "coxnlmsuvobgczlz", // your email password
    },
  }); 

  const mailOptions = {
    from: "Evotingcase2022@gmail.com", // sender
    to: Email, // list of receivers
    subject: " สรุปผลการเลือกตั้ง หัวข้อ "+ event_name , // Mail subject 
    html:
      "<div><b>" +
      "การเลือกตั้งเกิดความผิดพลาด"+
      "</b> <br></br>", 
  }; 

  transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log(err);
      res.send({ massage : err});
    } else {
      console.log(info);
      res.send({ massage: "Sand_mail" });
    }
  }); 
});


app.post("/sendmail_End", (req, res) => {
  const event_name = req.body.event_name;  
  const Email = req.body.Email; 
  const data3 = req.body.data3;
  const file = req.body.file;
  let massage = ('');
 
  // console.log(stringMessage);
 

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "Evotingcase2022@gmail.com", // your email
      pass: "coxnlmsuvobgczlz", // your email password
    },
  }); 

  const mailOptions = {
    from: "Evotingcase2022@gmail.com", // sender
    to: Email, // list of receivers
    subject: " สรุปผลการเลือกตั้ง หัวข้อ "+ event_name , // Mail subject 
    html:
      "<div><b>" +
      "ผู้ชนะการเลือกตั้งทั้งหมด : " +
      "</b> <br></br>",
      attachments: [
        { 
            filename: file,
            path: '../ux-project/src/file/'+file
        }
    ],
  }; 

  transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log(err);
      res.send({ massage : err});
    } else {
      console.log(info);
      res.send({ massage: "Sand_mail" });
    }
  }); 
});


app.post("/count_check", (req, res) => {
  const Id_event = req.body.Id_event; 

  db.query("Select Par_id as id , Vote , hash_vote , P_hash , Date_vote ,Time_vote from participant Where"+
  " Authen = 'participant' And Id_event = " + Id_event+" "+ 
  " ORDER BY Time_vote ASC",
    (err,user) => {
      if(err){
        console
      } else {   
        console.log("length = ",user.length); 
        res.send({
          massage :user,
          length : user.length
          })
      }
    })
});

app.post("/Check_hash", (req, res) => {
  const id = req.body.id; 
  const vote = req.body.vote; 
  const hash = req.body.hash;  
  const p_hash = req.body.p_hash; 
  const date = req.body.date; 
  const time = req.body.time; 

  // console.log("ID == ",id);
  // console.log("hash == ",hash);
  // console.log("vote == ",vote);
  var c = 0; 
  var check = true;

  const buff = Buffer.from(vote, "base64");
  var b = parseInt(buff);  

  if(hash != null){ 
    if(check == true){
          if(p_hash == 0 ){
          bcrypt.compare( 
            // user[4].Par_id+user[4].Vote+user[4].P_hash+user[4].Date_vote+user[4].Time_vote,
            // id+4+'$2b$10$tw1RwfcYPSxcrnDUWy4FZOPqK5qIRCMXV5tKduzIOP8uuMPzgeHl6'+'2023-1-5'+'22:21:17',
            id+b+0+date+time,
            hash,
            function (err, hash1) {   
              if (err) {
                // console.log(err);
              } else {
                console.log(" = ",hash1) 
                if(hash1 == false){
                  c++; 
                  console.log("c 11 " , c)
                  check = false; 
                } 
                bcrypt.hash(
                  id+b+0+date+time,
                  saltRounds,
                  function (err, hash2) {
                    check_status(check,hash2);
                  }) 
              } 
            }
          );

        } else {
          bcrypt.compare( 
            // user[4].Par_id+user[4].Vote+user[4].P_hash+user[4].Date_vote+user[4].Time_vote,
            // id+4+'$2b$10$tw1RwfcYPSxcrnDUWy4FZOPqK5qIRCMXV5tKduzIOP8uuMPzgeHl6'+'2023-1-5'+'22:21:17',
            id+b+p_hash+date+time,
            hash,
            function (err, hash1) {   
              if (err) {
                // console.log(err);
              } else {
                console.log(" = ",hash1)   
                if(hash1 == false){
                  c++;  
                  check = false;
                  console.log("c 11 " , c)   
                }  
                bcrypt.hash(
                  id+b+p_hash+date+time,
                  saltRounds,
                  function (err, hash2) {
                    check_status(check,hash2);
                  })  
              } 
            } 
          );
        } 
      
    }  
  } else {
    console.log("id wrong ==== " , id)
    res.send({id:id})
  }
   
  const check_status = (c,hash) =>{
    // console.log("check_status = ", c)
    if(c == false){
    // console.log("check_status 2 = ", c , hash) 
      // console.log("no = " , id)
      db.query(
        "Update participant set c_hash = ? Where Par_id = ? ",
        [hash , id],
        (err, user) => {
          if (err) {
            // console.log("err all event = ", err);
            res.send({ err, massage: "dont show" });
          } else {
            res.send({ massage: "no" });
          }
        }
      );
    } else{
      res.send({massage : "ok" , id : id});
    }
  }
});

app.post("/Event_wrong" , (req,res) => {
  const Id = req.body.Id_event;
  db.query("Update event_info set status_event = 3 where Id_event = "+Id ,
  (err,user1) => {
    if(err) {
      console.log("err wrong = " , err)
    } else {
      db.query(
        "Update participant set c_hash = 'ไม่มีการโหวต' Where not Vote is null And hash_vote is null ", 
        (err, user0) => {
          if (err) {
            // console.log("err all event = ", err);
            res.send({ err, massage: "dont show" });
          } else { 
            db.query(
              "select * From participant where not c_hash is null And Id_event = "+Id ,  
              (err, user) => {
                if (err) { 
                  res.send({err:err, massage: "dont show" });
                } else {
                  console.log(user);
                  res.send({massage: "no" });
                }
              }
            );
          }
        }
      );  
    }
  })
})

app.post("/Csv_data_check", (req, res) => {
  const Id_event = req.body.Id_event; 
  db.query(
    "select Par_id , User_id , Id_event ,Email,Password, Token,Authen ,Vote ,hash_vote, P_hash , c_hash ,"+ 
    " CASE "+
    " WHEN ElecStatus = '0' THEN 'ไม่มาใช้สิทธิ' "+
    " WHEN ElecStatus = '2' THEN 'มาใช้สิทธิ' "+
    "  End as ElecStatus, " +
    "  Date_vote , Time_vote"+
    "  From participant where  not c_hash is null And Id_event = "+Id_event ,  
    (err, user2) => {
      if (err) { 
        res.send({err:err, massage: "dont show" });
      } else {
        console.log("dont show == " , user2);
        res.send({
          massage: user2,
          length :user2.length
        })
      }
    }
  );
});

// Staff Event=======================================================

app.post("/staff_showeventmanage", (req, res) => {
  const ID_staff = req.body.ID_staff;
  console.log('ID_staff = ' ,ID_staff);
  db.query(
    "SELECT event_info.Event_name ,event_info.Id_event as Id_event ,event_info.status_event FROM `participant` " +
      " INNER JOIN event_info" +
      " ON participant.Id_event = event_info.Id_event  " +
      " WHERE participant.Par_id = ? And participant.Authen = 'staff';",
    [ID_staff],
    (err, user) => {
      if (err) {
        // console.log("err");
        res.send({ err, massage: "dont show" });
      } if(user.length != 0){
        db.query(
          "SELECT COUNT(Par_id) as Par_id, Id_event FROM `participant` Where not Authen = 'staff' and not Id_event = 0 "+
          " AND Id_event = " + user[0].Id_event +" GROUP BY Id_event ASC;",
          (err, user2) => {
            if (err) {
              // console.log("err show event manage = ", err);
            } else {
              db.query(
                "SELECT COUNT(Id_can) as Id_can , Id_event FROM `candidate_info` Where Id_event = "+ user[0].Id_event+
                " And not Id_can = 0 GROUP BY Id_event  ASC ",
                (err, user3) => {
                  if (err) {
                    // console.log("err show event manage = ", err);
                  } else { 
                    console.log(user);
                    res.send({
                      massage: user,
                      massage2: user2,
                      massage3: user3,
                      userlength: user.length,
                    });
                  }
                }
              );
            }
          }
        );
      }else {
        console.log("NO data")
      }
    }
  );
});

// Staff Event History=======================================================

app.post("/Staff_showeventstat", (req, res) => {
  const ID_staff = req.body.ID_staff;
  const id_e = req.body.id_e;
  db.query(
    "SELECT event_info.Id_event  AS  Id_event, event_info.Event_name as Event_name , event_info.status_event " +
      " FROM `participant` " +
      " INNER JOIN event_info" +
      " ON participant.Id_event = event_info.Id_event  " +
      " WHERE participant.Par_id = ? AND participant.Authen = 'staff' And NOT event_info.status_event = 0 And NOT event_info.status_event = 4 ",
    [ID_staff],
    (err, user) => {
      if (err) {
        // console.log("err");
        res.send({ err, massage: "dont show" });
      } else {
        db.query(
          "SELECT COUNT(Par_id) as nopar , event_info.Id_event FROM `participant` " +
            " LEFT JOIN event_info " +
            " ON participant.Id_event = event_info.Id_event" +
            " Where  event_info.Id_event = ?  AND NOT participant.Authen = 'staff'  " +
            " GROUP BY event_info.Id_event ASC;",
          [id_e],
          (err, user2) => {
            if (err) {
              // console.log("err show event manage = ", err);
            } else {
              db.query(
                "SELECT COUNT(Id_can) as nocan , candidate_info.Id_event " +
                  " FROM `candidate_info` " +
                  "  LEFT JOIN event_info  " +
                  " on candidate_info.Id_can = event_info.Id_event  " +
                  " WHERE candidate_info.Id_event = ? AND not candidate_info.Id_can = 0;",
                [id_e],
                (err, user3) => {
                  if (err) {
                    // console.log("err show event manage = ", err);
                  } else {
                    res.send({
                      massage: user,
                      massage2: user2,
                      massage3: user3,
                      userlength: user.length,
                    });
                  }
                }
              );
            }
          }
        );
      }
    }
  );
});


app.post("/Csv_data", (req, res) => {
  const key = req.body.key; 
  db.query(
    "select Email ,Date_vote ,Time_vote, "+ 
    " CASE"+
    " WHEN ElecStatus = 0 THEN 'ไม่มาใช้สิทธิเลือกตั้ง'"+
    " WHEN ElecStatus = 2 THEN 'มาใช้สิทธิเลือกตั้ง'"+
    " END AS ElecStatus"+
    " from participant Where not Authen = 'staff' And Id_event = "+ key ,
    (err, user2) => {
      if (err) {
        console.log("err show role = ", err);
      } else {
        console.log(user2);
        res.send({
          massage: user2,
          length :user2.length
        })
      }
    }
  );
});


// Check Result Vote -------------------------------------------

app.post("/loginVoted", (req, res) => {
  const idss = req.body.idss;
  var authen = "";
  var iduser = 0;
  // console.log("idss = ", idss);
  db.query(
    "select * from participant where Email = ? and Authen = 'participant'",
    [idss],
    (err, user) => {
      if (err) {
        // console.log({ err: err });
      }
      if (user.length > 0) {
        res.send({
          massage: "true",
          id: user[0].User_id,
          authen: user[0].Authen,
        });
      } else {
        res.send({
          massage: "fales",
          id: idss,
          authen: idss,
        });
      }
      // if (authen != '2' || authen != '4') {
      //   for (var i = 0; i < user.length; i++) {
      //     if (user[i].ElecStatus != "2" || user[i].ElecStatus != "2") {
      //       // console.log("User Authen == ", user[i].Authen);
      //     } else {
      //       console.log("AAAAAAA Authen == ", user[i].User_id);
      //       authen = user[i].ElecStatus;
      //       iduser = user[i].User_id;
      //       break;
      //     }
      //     if (authen != '2' || authen != '4') {
      //       console.log("User Authen == ", user[i].User_id );
      //       res.send({
      //         massage: "false",
      //         id: iduser,
      //         authen,
      //       });
      //     }
      //   }
      // }

      // if (authen == '2' || authen == '4') {
      //   db.query(
      //     "select * from participant where Authen = ?",
      //     [authen],
      //     (err, user2) => {
      //       if (err) {
      //         console.log("err Check Vote = ", err);
      //       } else {
      //         // console.log("check Vote = " , user2)
      //         res.send({
      //           massage: "true",
      //           id: iduser,
      //           authen: authen,
      //         });
      //       }
      //     }
      //   );
      // }
    }
  );
});

app.post("/showVoted", (req, res) => {
  const authen = req.body.authen;
  const Id_user = req.body.Id_user;

  db.query(
    "SELECT * FROM event_info  " +
      "	LEFT JOIN participant " +
      "     	ON event_info.Id_event = participant.Id_event " +
      " WHERE participant.User_id = ?  " +
      " ORDER BY event_info.Id_event ASC;",
    [Id_user],
    (err, user) => {
      if (err) {
        // console.log("err");
        res.send({ err, massage: "dont show" });
      } else {
        db.query(
          "SELECT COUNT(Par_id) as nopar  , event_info.Id_event FROM `participant` " +
            " LEFT JOIN event_info " +
            " ON participant.Id_event = event_info.Id_event  " +
            " Where not Authen = 'staff'  and not participant.Id_event = 0   " +
            " GROUP BY Id_event ASC;",
          (err, user2) => {
            if (err) {
              // console.log("err show event manage = ", err);
            } else {
              db.query(
                "SELECT COUNT(Id_can) as nocan , candidate_info.Id_event FROM `candidate_info` " +
                  " LEFT JOIN participant " +
                  "	ON candidate_info.Id_event = participant.Id_event  " +
                  " Where not candidate_info.Id_event = 0  AND participant.User_id = " +
                  Id_user +
                  " AND NOT candidate_info.Id_can = 0  " +
                  " GROUP BY Id_event  ASC;",
                (err, user3) => {
                  if (err) {
                    // console.log("err show event manage = ", err);
                  } else { 
                    // console.log("sdasd == ",str);
                    res.send({
                      massage: user,
                      massage2: user2,
                      massage3: user3,
                      userlength: user.length,
                    });
                  }
                }
              );
            }
          }
        );
      }
    }
  );

  // db.query(
  //   "SELECT * FROM `event_info`  " +
  //     " INNER JOIN participant  " +
  //     " ON event_info.Id_event = participant.Id_event " +
  //     " AND participant.ElecStatus = '2' or participant.ElecStatus = '4' "+
  //     " WHERE participant.User_id = ?  AND NOT event_info.status_event = 0" +
  //     "  AND NOT event_info.Id_event = 0  " +
  //     " ORDER BY event_info.Id_event ASC;",
  //   [Id_user],
  //   (err, user) => {
  //     if (err) {
  //       // console.log("err");
  //       res.send({ err, massage: "dont show" });
  //     } else {
  //       db.query(
  //         "SELECT COUNT(Par_id) as nopar  , Id_event FROM `participant` Where not Authen = 'staff'  and not Id_event = 0 GROUP BY Id_event ASC ",
  //         (err, user2) => {
  //           if (err) {
  //             // console.log("err show event manage = ", err);
  //           } else {
  //             db.query(
  //               "SELECT COUNT(Id_can) as nocan , candidate_info.Id_event FROM `candidate_info`  "+
  //               "LEFT JOIN participant "+
  //               "	ON candidate_info.Id_event = participant.Id_event "+
  //               " AND participant.ElecStatus = '2' or participant.ElecStatus = '4' "+
  //               " Where not candidate_info.Id_event = 0  AND participant.User_id =  "+Id_user+
  //               " GROUP BY Id_event  ASC;",
  //               (err, user3) => {
  //                 if (err) {
  //                   // console.log("err show event manage = ", err);
  //                 } else {
  //                   res.send({
  //                     massage: user,
  //                     massage2: user2,
  //                     massage3: user3,
  //                     userlength: user.length,
  //                   });
  //                 }
  //               }
  //             );
  //           }
  //         }
  //       );
  //     }
  //   }
  // );
});

//--------------------------------------------------------------

// app.get('/', (req,res) => {
//   db.query('select * from user_info',
//   function(err , user , fields){ 
//       console.log(user);
//       res.send(user);ss
//   })
// })

app.listen("3001", jsonParser, () => { 
  console.log("Server Runing 3001");
});
