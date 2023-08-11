const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = process.env.PORT || 5000;
const bcrypt = require("bcrypt");
require("dotenv").config();
const dbConnection = require("./connection/databaseConn");

const BLOG_SCHEMA = require("./models/NewBlog");
const WRITER_SCHEMA = require("./models/Writer");
const USER_SCHEMA = require("./models/RegisteredUser");

const jwt = require("jsonwebtoken");

const path = require("path");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post("/api/newWriter", async (req, res) => {
  try {
    const { name, about } = req.body;
    const newWriter = new WRITER_SCHEMA({
      name: name,
      about: about,
    });
    await newWriter.save();
    return res.json({ success: true });
  } catch (error) {
    return res.json({ success: false, error: error.message });
  }
});

app.post("/api/newblog", async (req, res) => {
  try {
    const { title, content } = req.body;
    const newBlog = new BLOG_SCHEMA({
      title: title,
      content: content,
    });
    await newBlog.save();
    return res.json({ success: true });
  } catch (error) {
    return res.json({ success: false, error: error.message });
  }
});

app.post("/api/newuser", async (req, res) => {
  try {
    const { uname, email, password, dob } = req.body;
    const newUser = new USER_SCHEMA({
      uname: uname,
      email: email,
      password: password,
      dob: dob,
    });
    await newUser.save();
    return res.json({ success: true });
  } catch (error) {
    return res.json({ success: false, error: error.message });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    let token;
    const password = req.body.password;
    const email = req.body.email;
    console.log(`${email} is your email and ${password} is your password`);

    const useremail = await USER_SCHEMA.findOne({ email: email });
    // console.log(useremail);

    // comparison of hashed password and user typed password
    if (useremail) {
      const isMatch = await bcrypt.compare(password, useremail.password);

      // // generating token for authentication
      // token = await useremail.generateAuthToken();
      // console.log(token);

      // // storing tokens in cookie
      // res.cookie('jwtoken', token, {
      //   expires: new Date(Date.now() + 2589200000),
      //   httpOnly:true
      // })

      if (isMatch) {
        // generating token for authentication
        token = await useremail.generateAuthToken();
        console.log(token);

        // storing tokens in cookie
        res.cookie("jwtoken", token, {
          expires: new Date(Date.now() + 2589200000),
          httpOnly: true,
        });

        console.log("done");
        return res.json({ success: true });
      } else {
        console.log("password do not matchne");
        return res.json({ success: false, message: "password do not match" });
      }
    } else {
      return res.json({ success: false, message: "email doesn't exist" });
    }
  } catch (error) {
    console.log(error);
    return res.json({ success: false, error: error.message });
  }
});

app.get("/api/getblogs", async (req, res) => {
  try {
    const blogs = await BLOG_SCHEMA.find();
    console.log(blogs);
    return res.json({ success: true, data: blogs });
  } catch (error) {
    return res.json({ success: false, error: error.message });
  }
});

app.get("/api/logout", (req, res) => {
  try {
    console.log("logout function");
    res.clearCookie("jwtoken", { path: "/" });
    return res.json({ success: true });
  } catch (error) {
    return res.json({ success: false, error: error.message });
  }
});

// const createToken = async () => {
//   const token = await jwt.sign(
//     { _id: "64b2cabe14890cddaff331d1" },
//     "iamvanshikaguptarenugupta"
//   );
//   console.log(token);

//   const userVerification = jwt.verify(token, "iamvanshikaguptarenugupta");
//   console.log(userVerification);
// };

// createToken();

// for deployment
app.use(express.static("client/build"));
app.get("*", (req, res) => {
  res.sendFile(
    path.resolve(__dirname + "/client/build/index.html"),
    function (err) {
      if (err) {
        console.log(err);
      }
    }
  );
});

dbConnection();

app.listen(port, () => {
  console.log(`server started at port ${port}`);
});
