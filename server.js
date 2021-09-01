//app.use('*/images', express.static('public/images'));
const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const { Console } = require('console');
app.set('view engine', 'ejs');
app.use(require('cookie-parser')());
var cors = require('cors')
app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
var NodeGeocoder = require('node-geocoder');
const http = require('http').createServer();
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 4001 });
wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(data) {
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
        console.log('data', data);
      }
    });
  });
});
const url = "mongodb+srv://TAL:TAL@cluster0.kysrf.mongodb.net/project?retryWrites=true&w=majority";
var MongoClient = require('mongodb').MongoClient;
const User = require('./model/workers')
var mongoose = require('mongoose');
const uri = "mongodb+srv://TAL:TAL@cluster0.kysrf.mongodb.net/project?retryWrites=true&w=majority";
var cb = function (err) {
  if (!err) { console.log("Connection Opened"); }
  else { console.log("Connection Opened Failed"); }
};
mongoose.connect(uri, cb);
var con = mongoose.connection;
const passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
passport.use(User.createStrategy());
// passport.use(new LocalStrategy(
//   function(username, password, done) {
//     User.findOne({ username: username }, function(err, user) {
//       if (err) { return done(err); }
//       if (!user) {
//         return done(null, false, { message: 'Incorrect username.' });
//       }
//       console.log(user.password)
//       if (password!=user.password) {
//         return done(null, false, { message: 'Incorrect password.' });
//       }
//       return done(null, user);
//     });
//   }
// ));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(passport.initialize());
app.use(passport.session());

// App setup
const PORT = 3001;
const server = app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});
const nodemailer = require("nodemailer");

// Static files
app.use(express.static("public"));

/*
TODO:fix package ckeckboxes
*/

var myLogger = function (req, res, next) {
  console.log('LOGGED')
  //TODO: check if onnected
  next()
}
app.use(myLogger)

var geocoder = NodeGeocoder({
  provider: 'opencage',
  apiKey: '5336d37fcf554960bc2cf7928297799e'
});
const kmeans = require('node-kmeans');
var haversine = require('haversine')

app.post('/login/:username', function (req, res) {
  console.log("body parsing", req.body);
  passport.authenticate('local', function (err, user, info) {
    console.log(user);
    if (err) { console.log('err = ', err); }
    if (!user) {
      res.status(401).send('username and/or password is incorrect');
      return;
    }
    req.logIn(user, function (err) {
      if (err) { console.log('err = ', err); }
      value = user.firstname + '-' + user.id + '-' + (user.admin != undefined && user.admin == true ? "manager" : "worker")
      res.status(200).append('Set-Cookie', 'user_name='+ value).send(value)
    });
  })
    (req, res);
});

app.get('*/catalog', function (req, res) {
  const url = "mongodb+srv://TAL:TAL@cluster0.kysrf.mongodb.net/project?retryWrites=true&w=majority";
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("project");
    dbo.collection("flowers").find({}).toArray(function (err, result) {
      if (err) throw err;
      console.log(result[0]);
      res.send({ flowers: result });
      db.close();
    });
  });
});

app.get('*/users', function (req, res) {
  const url = "mongodb+srv://TAL:TAL@cluster0.kysrf.mongodb.net/project?retryWrites=true&w=majority";
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("project");
    dbo.collection("users").find({}).toArray(function (err, result) {
      if (err) throw err;
      res.send({ users: result });
      db.close();
    });
  });
});

app.post('*/users/save/:user', function (req, res) {
  console.log('arrived')
  let user = JSON.parse(req.params.user)
  console.log(user)
  geocoder.geocode(user.location, function (err, result) {
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db("project");
      dbo.collection("users").updateOne({ "id": user.original_id }, {
        $set: {
          lat: result[0].latitude,
          long: result[0].longitude
        }
      }, function (err, obj) {
        if (err) { throw err; }
        if (obj == null) {
          console.log('not found');
          res.SendStatus(403);
        }
        else {
          console.log("1 document updated");
          res.sendStatus(200);
        }
      })
    });
  })
});

app.get('*/getcoordinates/:location', function (req, res) {
  console.log('arrived')
  var location = req.params.location;
  console.log(location)
  geocoder.geocode(location, function (err, result) {
    console.log(result[0].latitude);
    res.send({ coordinate: result[0] })
  });
})

app.get('*/workers', function (req, res) {
  const url = "mongodb+srv://TAL:TAL@cluster0.kysrf.mongodb.net/project?retryWrites=true&w=majority";
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("project");
    dbo.collection("workers").find({}).toArray(function (err, result) {
      if (err) throw err;
      res.send({ workers: result });
      db.close();
    });
  });
});

app.post('*/workers/save/:worker', function (req, res) {
  console.log('arrived')
  let worker = JSON.parse(req.params.worker)
  console.log(worker)
  geocoder.geocode(worker.location, function (err, result) {
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db("project");
      dbo.collection("workers").updateOne({ "id": worker.original_id }, {
        $set: {
          location: worker.location,
          id: worker.id,
          firstname: worker.firstname,
          lastname: worker.lastname,
          mail: worker.mail,
          gender: worker.gender,
          lat: result[0].latitude,
          long: result[0].longitude
        }
      }, function (err, obj) {
        if (err) { throw err; }
        if (obj == null) {
          console.log('not found');
          res.SendStatus(403);
        }
        else {
          console.log("1 document updated");
          res.sendStatus(200);
        }
      })
    });
  })
});

app.post('*/workers/delete/:worker_id', function (req, res) {
  console.log('arrived here')
  let worker_id = JSON.parse(req.params.worker_id)
  var query = { "id": worker_id.id };
  console.log(query)
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("project");
    dbo.collection("workers").deleteOne(query, function (err, obj) {
      if (err) { throw err; }
      if (obj == null) {
        console.log('not found');
        res.SendStatus(403);
      }
      else {
        console.log(obj)
        console.log("1 document deleted");
        res.sendStatus(200);
      }
    })
  });
});

app.post('*/workers/add/:worker', function (req, res) {
  console.log('arrived')
  let worker = JSON.parse(req.params.worker)
  console.log(worker)
  geocoder.geocode(worker.location, function (err, result) {
    var new_worker = {
      username: worker.username,
      password: worker.password,
      location: worker.location,
      id: worker.id,
      //TODO: make sure id is available... cannot allow multiple ids
      firstname: worker.firstname,
      lastname: worker.lastname,
      mail: worker.mail,
      gender: worker.gender,
      lat: result[0].latitude,
      long: result[0].longitude,
      Sunday: worker.Sunday,
      Monday: worker.Monday,
      Tuesday: worker.Tuesday,
      Wednesday: worker.Wednesday,
      Thursday: worker.Thursday,
      Friday: worker.Friday,
    };
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db("project");
      dbo.collection("workers").insertOne(new_worker, function (err, obj) {
        if (err) { throw err; }
        if (obj == null) {
          console.log('not found');
          res.SendStatus(403);
        }
        else {
          console.log("1 document inserted");
          res.sendStatus(200);
          //TODO: send the worker an email with his credentials (username, pass);
        }
      })
    });
  })
});

app.post('*/message', function (req, res) {
  console.log('arrived')
  let message = req.body//JSON.parse(req.params.message)
  console.log(message)

  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("project");
    dbo.collection("messages").insertOne(message, function (err, obj) {
      if (err) { throw err; }
      if (obj == null) {
        console.log('not found');
        return res.SendStatus(403);
      }
      else {
        console.log("message sent");
        // io.emit('message',message);
        return res.sendStatus(200);
      }
    })
  });

});
app.post('*/post', function (req, res) {
  console.log('arrived')
  let message = req.body//JSON.parse(req.params.message)
  console.log(message)

  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("project");
    dbo.collection("posts").insertOne(message, function (err, obj) {
      if (err) { throw err; }
      if (obj == null) {
        console.log('not found');
        return res.SendStatus(403);
      }
      else {
        console.log("post uploaded");
        //io.emit('message',message);
        return res.sendStatus(200);
      }
    })
  });
});

app.post('/messages', (req, res) => {
  var ids = req.body
  console.log(ids)
  var query = {$or : [{"sender_id":ids.to,"to":ids.sender_id},{"sender_id" :ids.sender_id,"to":ids.to}]}
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("project");
    dbo.collection("messages").find(query).toArray(function (err, messages) {
      res.send(messages);
    })
  })
})

app.post('/email', (req, res) => {
  var email = req.body
  console.log(email)
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
    from: 'Tali\'s Flowers Inc. <itmich111@gmail.com>', // sender address
    to: 'bashan.girls2@gmail.com', // list of receivers
    subject: "Tali's Flowers - "+email.subject , // Subject line
    text: "Hi Tal, you have received the following message from " + email.name + ": \n\n " + email.message+" \n\nYou can reach out to them with the following contact information:<br/>"+email.email+"\n\nyours always,\nTali's Flowers Inc.", // plain text body
    html:  "<div dir='ltr'>Hi Tal, you have received the following message from " + email.name + ":  <br/><br/>" + email.message+" <br/><br/>You can reach out to them with the following contact information:<br/>"+email.email+"<br/><br/>yours always,<br/>Tali's Flowers Inc.</div>", // plain text body
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
})

app.get('/blog/:id', (req, res) => {
  var query = {}
  if (req.params.id != "all")
    query = { id: req.params.id }
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("project");
    dbo.collection("posts").find(query).toArray(function (err, messages) {
      res.send(messages);
    })
  })
})

app.get('/packages/update/:query', function (req, res) {
  var q = JSON.parse(req.params.query)
  console.log(q)
  const url = "mongodb+srv://TAL:TAL@cluster0.kysrf.mongodb.net/project?retryWrites=true&w=majority";
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("project");
    dbo.collection("packages").updateOne({ "user_id": q.user_id, "worker_id": q.worker_id, "date": q.date }, { $set: { "happened": q.happened } }, function (err, result) {
      if (err) throw err;
      else {
        console.log(result)
        return res.sendStatus(200);
      }
    })
  })
})

app.get('/packages/:date/:worker_id', function (req, res) {
  console.log(req.params.date)
  console.log(req.params.worker_id)
  const url = "mongodb+srv://TAL:TAL@cluster0.kysrf.mongodb.net/project?retryWrites=true&w=majority";
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("project");
    dbo.collection("packages").aggregate([
      { $match: { worker_id: req.params.worker_id, date: req.params.date } }, {
        $lookup: {
          from: 'users',
          localField: 'user_id',
          foreignField: 'id',
          as: 'user'
        }
      }, { $unwind: "$user" }
      , {
        $project: {
          happened: 1,
          date: 1,
          location: "$user.location",
          firstname: "$user.firstname",
          lastname: "$user.lastname",
          user_id: 1
        }
      }
    ]).toArray(function (err, packages) {
      if (err) throw err;
      else {
        console.log(packages)
        return res.send({ packages: packages });
      }
    })
  })
})

app.get('/packages', function (req, res) {
  //TODO: get specific range of dates using { date: { $gt: new Date('1940-01-01'), $lt: new Date('1960-01-01') } }
  const url = "mongodb+srv://TAL:TAL@cluster0.kysrf.mongodb.net/project?retryWrites=true&w=majority";
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("project");
    dbo.collection("packages").aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'user_id',
          foreignField: 'id',
          as: 'user'
        }
      }, { $unwind: "$user" }
      , {
        $project: {
          happened: 1,
          date: 1,
          city: "$user.city"
        }
      }
    ]).toArray(function (err, packages) {
      if (err) throw err;
      else {
        return res.send({ packages: packages });
      }
    })
  })
})

app.get('/distribute/:date', function (req, res) {
  const url = "mongodb+srv://TAL:TAL@cluster0.kysrf.mongodb.net/project?retryWrites=true&w=majority";
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("project");
    dbo.collection("packages").aggregate([
      { "$match": { date: req.params.date } }, {
        $lookup:
        {
          from: 'workers',
          localField: 'worker_id',
          foreignField: 'id',
          as: 'worker'
        }
      }
    ]).toArray(function (err, packages) {
      if (err) throw err;
      console.log(packages)
      if (packages.length < 1)
        return getPackages(req.params.date, req, res)
      else {
        console.log(packages.map(x => x.worker))
        return res.send({ packages: packages });
      }
    })
  })
})
function getPackages(given_date, req, res) {
  //var given_date = req.params.date
  var parts = given_date.split('-')
  var time = new Date(parts[0], parts[1] - 1, parts[2]);
  var day = time.getDay();
  var count = 1;
  if (day == 6) {
    return res.status(403).send('forbidden on shabbat!');
  }
  else if (day == 5) {
    count++;
    if (time.getDate() <= 7)
      count++;
  }
  const url = "mongodb+srv://TAL:TAL@cluster0.kysrf.mongodb.net/project?retryWrites=true&w=majority";
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("project");
    dbo.collection("users").find({ frequency: { $lte: count } }).toArray(function (err, userim) {
      if (err) throw err; var weekday = new Array(7); weekday[0] = { Sunday: "1" }; weekday[1] = { Monday: "1" }; weekday[2] = { Tuesday: "1" }; weekday[3] = { Wednesday: "1" }; weekday[4] = { Thursday: "1" }; weekday[5] = { Friday: "1" }; weekday[6] = { Saturday: "1" };
      var query = weekday[day];
      dbo.collection("workers").find(query).toArray(function (err, workerim) {
        var vectors = userim.map(x => [x['lat'], x['long']])
        var l = workerim.length
        kmeans.clusterize(vectors, { k: l }, (err, result) => {
          if (err) console.error(err);
          else {
            console.log(result)
            var match_worker = new Array(l)
            for (let i = 0; i < l; i++) {
              var sum = 0; var wr = workerim[i]
              result.map(cl => {
                sum = sum + (haversine({ latitude: wr['lat'], longitude: wr['long'] },
                  { latitude: cl.centroid[0], longitude: cl.centroid[1] }))
              })
              match_worker[i] = sum / l;
            }
            console.log(match_worker)
            var occupied = match_worker.map(x => false);
            for (let i = 0; i < l; i++) {
              var far = findMax(match_worker)
              console.log(occupied)
              var closest = -1;
              for (let j = 0; j < l; j++) {
                if (!occupied[j])
                  closest = j;
              }
              for (let j = 1; j < l; j++) {
                if (haversine({ latitude: workerim[far]['lat'], longitude: workerim[far]['long'] },
                  { latitude: result[j].centroid[0], longitude: result[j].centroid[1] })
                  < haversine({ latitude: workerim[far]['lat'], longitude: workerim[far]['long'] },
                    { latitude: result[closest].centroid[0], longitude: result[closest].centroid[1] })
                  && !occupied[j])
                  closest = j;
              }
              console.log('worker ' + (far + 1) + ' will give to ' + (closest + 1))
              console.log({ latitude: workerim[far]['lat'], longitude: workerim[far]['long'] })
              console.log('to')
              console.log(result[closest].centroid)
              console.log(result[closest].clusterInd.map(x => userim[x]))
              addToDb(workerim[far], result[closest], result[closest].clusterInd.map(x => userim[x]), given_date);
              match_worker[far] = 0; occupied[closest] = true;
            }
          }
          const url = "mongodb+srv://TAL:TAL@cluster0.kysrf.mongodb.net/project?retryWrites=true&w=majority";
          MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("project");
            dbo.collection("packages").aggregate([
              { "$match": { date: given_date } }, {
                $lookup:
                {
                  from: 'workers',
                  localField: 'worker_id',
                  foreignField: 'id',
                  as: 'worker'
                }
              }
            ]).toArray(function (err, packages) {
              if (err) throw err;
              else
                res.send({ packages: packages })
              db.close();
            })
          })
        })
      })
    });
  });
}
function addToDb(worker, cluster, users, date) {
  console.log('will insert to db:')
  users.map(x => {
    var dist = {
      worker_id: worker.id,
      worker_geo: { lat: worker.lat, long: worker.long },
      user_geo: { lat: x.lat, long: x.long },
      user_id: x.id,
      date: date,
      happened: false
    }
    console.log(dist)
    const url = "mongodb+srv://TAL:TAL@cluster0.kysrf.mongodb.net/project?retryWrites=true&w=majority";
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db("project");
      dbo.collection("packages").insertOne(dist, function (err, obj) {
        if (err) { throw err; }
        if (obj == null) { console.log('not found'); }
        else { console.log("1 document inserted"); }
      })
    })
  })
}
function findMax(arr) {
  console.log(arr);
  var place = 0;
  for (var i = 1; i < arr.length; i++) {
    if (arr[i] > arr[place])
      place = i;
  }
  return place;
}
app.get('/ping', function (req, res) {
  res.send('pong')
})



