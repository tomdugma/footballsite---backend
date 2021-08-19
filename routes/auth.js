var express = require("express");
var router = express.Router();
const DButils = require("../routes/utils/DButils");
const bcrypt = require("bcryptjs");
const country = require("../routes/utils/auth_utils");



router.post("/Register", async (req, res, next) => {
  try {
    // parameters exists
    // valid parameters
    // username exists
    // https://restcountries.eu/rest/v2/all
    const users = await DButils.execQuery(
      "SELECT username FROM dbo.users"
    );
    // const countries = await country.getCountryList();
    // console.log(countries)
    if (req.body.username === undefined || req.body.firstname === undefined || req.body.lastname === undefined )
      throw { status: 409, message: "one or more values missing" };

    if (users.find((x) => x.username === req.body.username))
      throw { status: 409, message: "Username taken" };

    // if (req.body.confirmationpassword != req.body.password)
    //   throw { status: 409, message: "Passwords is not identical." };
    //hash the password
    let hash_password = bcrypt.hashSync(
      req.body.password,
      parseInt(process.env.bcrypt_saltRounds)
    );
    let username= req.body.username;
    let firstName= req.body.firstname;
    let lastName= req.body.lastname;
    let country= req.body.country;
    let email= req.body.email;
    let image= req.body.image;
    let is_admin = req.body.is_admin;
    req.body.password = hash_password;

    // add the new username
    await DButils.execQuery(
      `INSERT INTO dbo.users (username, password,firstname,lastname,email,image,country,is_admin) VALUES ('${req.body.username}', '${hash_password}', '${firstName}', '${lastName}', '${email}','${image}','${country}',${is_admin})`
      );
    res.status(201).send("user created");
  } catch (error) {
    console.log(error);
    if(error.status){
    res.status(error.status).send(error.message);
    }else{
      res.status(500).send(error);
    }
  }
});

router.post("/Login", async (req, res, next) => {
  try {
    const user = (
      await DButils.execQuery(
        `SELECT * FROM dbo.users WHERE username = '${req.body.username}'`
      )
    )[0];
    // user = user[0];
    console.log(user);

    // check that username exists & the password is correct
    if (!user || !bcrypt.compareSync(req.body.password, user.password)) {
      throw { status: 401, message: "Username or Password incorrect" };
    }

    // Set cookie
    req.session.user_id = user.username;

    // return cookie
    res.status(200).send("login succeeded");
  } catch (error) {
    next(error);
  }
});

router.post("/Logout", function (req, res) {
  try{
    if(req.session.user_id){
      req.session.reset(); 
      res.send({ success: true, message: "logout succeeded" });
    }else{
      throw { status: 400, message: "no user associated with session" };
    }
    }catch (err){
      if(err.status){
        res.status(err.status).send(err.message);
        }else{
          res.status(500).send(err);
        }
    }
});

module.exports = router;
