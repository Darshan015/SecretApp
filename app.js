//jshint esversion:6
const express = require("express");
const app = express();
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encryption = require("mongoose-encryption");

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/userDB");
const userSchema = new mongoose.Schema({
  email:"String",
  password:"String"
});
var secret = "Confidentialfiles";
userSchema.plugin(encryption,{secret:secret,encryptedFields:["password"]});
const User = mongoose.model("User",userSchema);
app.get('/',function(req,res){
  res.render("home");
});
app.get('/login',function(req,res){
  res.render("login");
});
app.get('/register',function(req,res){
  res.render("register");
});
app.post('/register',function(req,res){
  const user = new User({
    email:req.body.username,
    password:req.body.password
  });
  user.save(function(err){
    if(err){
      console.log(err);
    }else{
      res.render("secrets");
    }
  });
});
app.post('/login',function(req,res){
  const username = req.body.username;
  const password = req.body.password;
  User.findOne({email:username},function(err,foundUser){
    if(err){
      console.log(err);
    }else{
      if(foundUser){
        if(foundUser.password==password){
          res.render("secrets");
        }else{
          res.send("Wrong passwoord");
        }
      }
    }
  });
});
app.listen(3000,function(req,res){
  console.log("Server is up and running");
})
