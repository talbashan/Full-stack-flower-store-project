const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');
const { Console } = require('console');
let app = express();
app.set('view engine', 'ejs');
app.use(require('cookie-parser')());

var urlencodedParser = bodyParser.urlencoded({ extended: false })
//app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

var session = require("express-session");
app.use(session({ secret: "giveitAtry" }));

app.use('*/images', express.static('public/images'));
app.use(function(req,res,next){setTimeout(next,1000)});
const branchesModel = require('./model/branches')
const flowersModel = require('./model/flowers')
const User = require('./model/users')
const Token = require('./model/token')

const nodemailer = require("nodemailer");

var mongoose = require('mongoose');
const uri = "mongodb+srv://TAL:TAL@cluster0.kysrf.mongodb.net/targil4?retryWrites=true&w=majority";
var cb = function(err){
  if(!err) { console.log("Connection Opened"); }
  else { console.log("Connection Opened Failed"); }
};
mongoose.connect(uri,cb);
var con = mongoose.connection;
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
 app.use(passport.initialize());
 app.use(passport.session());
 const crypto = require("crypto");
// passport.use(new LocalStrategy(
//   function(username, password, done) {
//     User.findOne({ username: username }, function (err, user) {
//       if (err) { return done(err); }
//       if (!user) {
//         return done(null, false, { message: 'Incorrect username.' });
//       }
//       console.log(user.username," extsit. pass: ", user.password)
//       if (password!=user.password) {
//         return done(null, false, { message: 'Incorrect password.' });
//       }
//       return done(null, user);
//     });
//   }
// ));
// passport.serializeUser(function(user, done) {
//   done(null, user);
// });

// passport.deserializeUser(function(user, done) {
//   done(null, user);
// });
app.get('/', function (req, res) {
	res.render('index');
});
app.get('/rsa', function (req, res) {
	res.render(NodeRSA);
});
app.get('/about', function (req, res) {
	res.render('partials/pages/about');
});

app.get('/contact', function (req, res) {
	res.render('partials/pages/contact');
});

app.get('/users', function (req, res) {
	console.log(req.query.type)
  var MongoClient = require('mongodb').MongoClient;
  const url = "mongodb+srv://TAL:TAL@cluster0.kysrf.mongodb.net/targil4?retryWrites=true&w=majority";
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("targil4");
    dbo.collection("users").find({}).toArray(function(err, result) {
      if (err) throw err;
      res.render('partials/pages/users', {users : result, type: req.query.type});
      db.close();
      return;
    });
  });  
});

app.get('*/catalog', function (req, res) {
  var MongoClient = require('mongodb').MongoClient;
  const url = "mongodb+srv://TAL:TAL@cluster0.kysrf.mongodb.net/targil4?retryWrites=true&w=majority";
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("targil4");
    dbo.collection("flowers").find({}).toArray(function(err, result) {
      if (err) throw err;
      res.render('partials/pages/catalog', {flowers : result});
      db.close();
      return;
    });
  });
});

app.get('*/branches', function (req, res) {
  var MongoClient = require('mongodb').MongoClient;
  const url = "mongodb+srv://TAL:TAL@cluster0.kysrf.mongodb.net/targil4?retryWrites=true&w=majority";
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("targil4");
    dbo.collection("branches").find({}).toArray(function(err, result) {
      if (err) throw err;
      res.render('partials/pages/branches', {branches : result});
      db.close();
      return;
    });
  });
});

app.get('*/background_img', function (req, res) {
	res.render('../public/images/Flower-Background.jpg');
});

app.post('/login/:username',urlencodedParser, function (req, res) {
  console.log("body parsing", req.body);
  passport.authenticate('local', function(err, user, info) {
    console.log(user);
    if (err) { console.log('err = ',err); }
    if (!user) { res.sendStatus(401);
      return; }
    req.logIn(user, function(err) {
      if (err) { console.log('err = ',err); }
                value = user.firstname + '-' + user.username + '-' + user.type 
          res.cookie('user_name', value,{maxAge: 1000*60*15, path: "/"})
          res.sendStatus(200);
    });
  })
  (req, res);
  /*var MongoClient = require('mongodb').MongoClient;
  const url = "mongodb+srv://TAL:TAL@cluster0.kysrf.mongodb.net/targil4?retryWrites=true&w=majority";
  MongoClient.connect(url, function(err, db) {
    var dbo = db.db("targil4");
    User.findOne(
      { "username": req.body.name, "password":req.body.pass},
     function(err,result) { 
       if (result) {
          value = result.firstname + '-' + result.username + '-' + result.type 
          res.cookie('user_name', value,{maxAge: 1000*60*15, path: "/"})
          res.sendStatus(200);
          return;
       }
       else{
          res.sendStatus(401);
          return;
       }
      });
  });*/
});

app.post('/mail/:username', urlencodedParser, function (req, res) {
  var username = req.body.username;
  var key = "username"; //example
  var filter = {};
  filter[key] = username;
  const user = User.findOne(
    filter, function (e, user1) {
      if (e) {
        return (res.sendStatus(500))
      } else {
        console.log("user:", user1.id)
        if (!user1) {
          console.log("User does not exist");
          return (res.sendStatus(401))
        }
        if (user1.mail != req.body.email) {
          console.log("wrong credentials! first: " + user1.mail + " second:" + req.body.email);
          return (res.sendStatus(401))
        }
       var key1 = "userId"; //example
       var filter1 = {};
        filter1[key1] = user1.id;
        console.log("filter: "+filter1)
        var token1 = Token.findOne(
          filter1, function (e, token) {
            if (e) {
              return (res.sendStatus(500))
            } else {
              console.log("existing token: "+token)
              if (token) {
                token.deleteOne()
              }
            }
          });

        let resetToken = crypto.randomBytes(8).toString("hex");
        const encrypted = null;//NodeRSA.encrypt(resetToken);
        token1 = new Token(
          { userId: user1.id, token: encrypted }
        );
        token1.save(function (err, item) {
          if (err) return console.error(err);
          console.log(item + " saved to token collection.");
        });
        var transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {

            user: 'itmich111@gmail.com',
            pass: '0538284218' // generated ethereal password
          },
        });
        var mailOptions = {
          from: 'itmich111@gmail.com', // sender address
          to: req.body.email, // list of receivers
          subject: "Tali's Flowers - password reset for " + user1.username, // Subject line
          text: "Hi " + user1.firstname + " " + user1.lastname + ". you have asked for your password to our website to be reset. your reset code is: " + resetToken, // plain text body
          html: "Hi " + user1.firstname + " " + user1.lastname + ". you have asked for your password to our website to be reset. your reset code is: " + resetToken, // html body
        }
        // send mail with defined transport object
        transporter.sendMail(mailOptions, function (err, inf) {
          if (err) {
            console.log(err)
          }
          else {
            console.log('email sent:' + inf.response)
          }
        });

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        // Preview URL: 
        res.sendStatus(200);

      }
    });

});

  app.post('/findtoken',urlencodedParser, function(req,res){
    var username = req.body.username;
    var key = "username"; //example
  var filter = {};
  filter[key] = username;
    const user = User.findOne(
      filter, function(e, user1){
        if(e){
           return (res.sendStatus(500))
        }else{
          console.log("user:",user1)
          if (!user1) {
              console.log("User does not exist");
              return (res.sendStatus(401))
          }
           var key1 = "userId"; //example
       var filter1 = {};
        filter1[key1] = user1.id;
        console.log("filter: "+filter1)
        var token1 = Token.findOne(
          filter1, function (e, token) {
            if (e) {
              return (res.sendStatus(500))
            } else {
              if (token) {
                var dec_key = req.body.token;
                try{
                    var dec_token  =NodeRSA.decrypt(token.token)
                    if(dec_key==dec_token)
                    {
                        console.log('new pass here we go!')
                        token.deleteOne()
                        user1.setPassword(req.body.pass, function(err) {
                          if (err){throw err;}
                      
                            //handle error
                                else {  
                                  user1.save();
                                  console.log("updated password successfully!");
                                res.sendStatus(200);
                                }//handle success
                            });
                      }
                    else{
                          console.log('eeeeek!')
                    }
                }
                catch{
                      console.log('malformed token')
                      return (res.sendStatus(401))

                }
     
              }
            }
          });
    };
    
  
        
     });
  
    });
  
app.get('/users/:username',urlencodedParser, function (req, res) {
	res.render('index');
});

app.get('/remove/:user_id',urlencodedParser, function (req, res) {
  console.log('arrived')
    var myquery = { "id": req.params.user_id };
    User.deleteOne(myquery, function(err, obj) {
      if (err) throw err;
      console.log("1 document deleted");
      res.sendStatus(200);
       });
    return;

});
app.get('/userDetails',urlencodedParser, function (req, res) {
  var cookie1 = req.cookies.user_name;
  console.log(cookie1)
  if(!cookie1)
  {
    console.log('cookie doesnt exist')
    return res.sendStatus(401)
  }
  else
  {
    var username = cookie1.split('-')[1];
  var key = "username"; //example
var filter = {};
filter[key] = username;
  const user = User.findOne(
    filter, function(err, user1){
      if(err){
        console.log('oops!')
         return (res.sendStatus(500))
      }else{
        console.log("user:",user1)
        if (!user1) {
            console.log("User does not exist");
            return (res.sendStatus(401))
        }
return res.render('partials/pages/userDetails', {user : user1});

  }

  })}});
app.get('/save/:user',urlencodedParser, function (req, res) {
  console.log('arrived')
  let user = JSON.parse(req.params.user)
  console.log(user)
  User.updateOne({"id": user.original_id}, { $set: {
    location: user.location,
    id: user.id,
    firstname: user.firstname,
    lastname: user.lastname,
    username: user.username,
    mail: user.mail,
    type: user.type,
    snifId: user.snifId
  }}, function(err, obj) {
    User.findOne(
      {"id": user.original_id},function(err,result) {
        if(user.password!=null&&user.password!="") 
   result.setPassword(user.password, function(err) {
      if (err){throw err;}
      if (obj==null)
      {console.log('not found');} //handle error
        //handle error
            else {  console.log("1 document updated");
            }//handle success
        });
        res.sendStatus(200);
    }); 
});
  /*var MongoClient = require('mongodb').MongoClient;
  const url = "mongodb+srv://TAL:TAL@cluster0.kysrf.mongodb.net/targil4?retryWrites=true&w=majority";
  MongoClient.connect(url, function(err, db) {
    var dbo = db.db("targil4");
    var myquery = { "id": user.id };
    var newvalues = { $set: {
      location: user.location,
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      username: user.username,
      mail: user.mail,
      password: user.password,
      type: user.type,
    }};
    console.log(user.location)
    dbo.collection("users").updateOne(myquery, newvalues, function(err, obj) {
      if (err) throw err;
      console.log("1 document updated");
      db.close();
      res.sendStatus(200);
      return;
    });
  });*/
});

app.get('/addUser/:user',urlencodedParser, function (req, res) {
	console.log('arrived')
	let user = JSON.parse(req.params.user)
  User.register(new User({ username: user.username,location: user.location,
    id: user.id,
    firstname: user.firstname,
    lastname: user.lastname,
    username: user.username,
    mail: user.mail,
    gender: user.gender,
    type: user.type,
    active: user.active }),user.password,
   function(err, account) {
    if (err) {
       console.log(err);
        //return res.render('register', { account : account });
    }
    else
    passport.authenticate('local')(req, res, function () {
      
    });
    res.sendStatus(200);
});
  /*var new_user =new User({
    location: user.location,
    id: user.id,
    firstname: user.firstname,
    lastname: user.lastname,
    username: user.username,
    mail: user.mail,
    password: user.password,
    gender: user.gender,
    type: user.type,
    active: user.active
  });
  new_user.save(function(err,new_user){
    if(err){ console.log(err);}
    else{ console.log("Document Save Done")}
  });
	res.sendStatus(200);
  */
});

function waitASec(res)
{

}

app.get('/views/about.html', function (req, res) {
	res.render('/views/about.html');
});

app.listen(8080, function () {
});


