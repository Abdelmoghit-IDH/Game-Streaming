"use strict";

var express = require("express");

var router = express.Router(); // Item model

var myModule = require("../../models/Channel");

var Channel = myModule.Channel;

var axios = require("axios");

var jwt = require("jsonwebtoken");

var decode = function decode(bearerToken) {
  try {
    tokenSecret = "your-256-bit-secret";

    var decodeAuthToken = function decodeAuthToken(token, tokenSecret) {
      return jwt.verify(token, tokenSecret);
    };

    var decoded = decodeAuthToken(bearerToken, tokenSecret);
    decoded["success"] = true;
    console.log("Wayeeeeeeeh");
    return decoded;
  } catch (e) {
    console.log("walaaaaaaaaa");
    return {
      success: false
    };
  }
}; // {
//   "id": 2,
//   "firstname": "abdelmoghit",
//   "lastname": "idhsaine",
//   "fullname": "abdelmoghit idhsaine",
//   "email": "abdelmoghit1@gmail.com",
//   "username": "abdelmoghit1",
//   "signupDate": "2022-05-19T21:01:41.000Z",
//   "isAdmin": false,
//   "iat": 1652994755,
//   "exp": 1653030755
// }


var tokenBody = function tokenBody(req) {
  var authorization = req.headers.authorization;
  var token = authorization == undefined ? "1" : authorization.split(" ")[1];
  var Body = decode(token);
  return Body;
}; //! test


router.get("/testToken", function (req, res) {
  var body = tokenBody(req);
  res.json(body);
}); //!@route GET api/channels = Get all channels (even by name)

router.get("/", function (req, res) {
  var body = tokenBody(req);

  if (body["success"]) {
    var name = req.body.name; //get all

    if (name == undefined || name == "") Channel.find().sort({
      date: -1
    }).then(function (channels) {
      return res.json(channels);
    }); //get all that start with the name in the body
    else Channel.find({
        name: {
          $regex: "^" + name
        }
      }).sort({
        date: -1
      }).then(function (channels) {
        return res.json(channels);
      })["catch"](function (error) {
        res.status(500).json("Internal Server Error");
      });
  } else {
    res.status(401).json("Unauthorized");
  }
}); //!@route GET api/channels = Get all MY channels by OWNER_ID

router.get("/mychannels/:id", function (req, res) {
  var body = tokenBody(req);

  if (body["success"]) {
    var id = req.params.id;
    Channel.find({
      "owner.id": id
    }).then(function (channel) {
      return res.json(channel);
    })["catch"](function (error) {
      res.status(500).json("Internal Server Error");
    });
  } else {
    res.status(401).json("Unauthorized");
  }
}); //!@route GET api/channels = Get The ONE channel by id

router.get("/:id", function (req, res) {
  var body = tokenBody(req);

  if (body["success"]) {
    var id = req.params.id;
    Channel.findOne({
      _id: id
    }).then(function (channel) {
      return res.json(channel);
    })["catch"](function (error) {
      res.status(500).json("Internal Server Error");
    });
  } else {
    res.status(401).json("Unauthorized");
  }
}); //!@route POST api/channels = Create a Post

router.post("/", function (req, res) {
  var body = tokenBody(req);

  if (body["success"]) {
    //send request to straming service
    //todo ........check if undefined
    axios.post("http://127.0.0.1:5000/createchannel/" + body["username"], req.headers).then(function (response) {
      // console.log(`statusCode: ${response.status}`);
      // console.log(response);
      // console.log(response);
      // console.log("yyyyyyyyyyyyy");
      if (response.statusText == "OK") {
        var newChannel = new Channel({
          //_id is set by default
          name: req.body.name,
          description: req.body.description,
          profilePictureURL: "test",
          //todo req.body.profilePictureURL,
          // owner: req.body.owner,
          owner: body,
          // {
          //   id: body["id"],
          //   fullname: body["fullname"],
          //   email: body["email"],
          //   username: body["username"],
          // },
          ingestEndpoint: response.data["ingestEndpoint"],
          playbackUrl: response.data["playbackUrl"],
          streamKey: response.data["streamKey"],
          subscribersList: [],
          //Empty when created, req.body.subscribersList,
          videoList: [] //Empty when created, req.body.videoList,
          //dateOfCreation is set by default in the model

        });
        newChannel.save().then(function (channel) {
          return res.json(channel);
        })["catch"](function (error) {
          res.status(500).json("Internal Server Error");
        });
      } else {
        res.status(500).json("Internal Server Error");
      }
    })["catch"](function (error) {
      res.status(500).json("Internal Server Error");
    });
  } else {
    res.status(401).json("Unauthorized");
  }
}); //!@route PUT api/channels/:id = Subscribe & Unsubscribe to a channel

router.put("/:id", function _callee(req, res) {
  var body, id, isSubscribing, doc;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          body = tokenBody(req);

          if (!body["success"]) {
            _context.next = 11;
            break;
          }

          //id of the channel
          id = req.params.id;
          isSubscribing = req.body.subscrib; // console.log(isSubscribing);
          // const user = {
          //   id: body.userId,
          //   username: body.username,
          //   name: body.userName,
          //   email: body.userEmail,
          // };

          _context.next = 6;
          return regeneratorRuntime.awrap(Channel.findOne({
            _id: id
          }));

        case 6:
          doc = _context.sent;

          if (isSubscribing) {
            // doc.subscribersList.push(user);
            doc.subscribersList.push(body);
          } else {
            doc.subscribersList = doc.subscribersList.filter(function (element) {
              return element.get("id") != body["id"];
            });
          }

          doc.save().then(function (channel) {
            return res.json(channel);
          })["catch"](function (error) {
            res.status(500).json("Internal Server Error");
          });
          _context.next = 12;
          break;

        case 11:
          res.status(401).json("Unauthorized");

        case 12:
        case "end":
          return _context.stop();
      }
    }
  });
}); //!@route DELETE api/channels/:id = Delete a channel

router["delete"]("/:id", function (req, res) {
  //delete in streaming channel first
  var body = tokenBody(req);

  if (body["success"]) {
    // const headers = {
    //   role: "user",
    //   username: "hatimmoydydtf",
    // };
    headers = req.headers;
    axios["delete"]("http://127.0.0.1:5000/deletechannel/" + req.body.owner.username, {
      headers: headers
    }).then(function (response) {
      // console.log(`statusCode: ${response.status}`);
      // console.log(response);
      // console.log(response);
      // console.log("yyyyyyyyyyyyy");
      if (response.statusText == "OK") {
        if (response.data["isDeleted"]) {
          Channel.findById(req.params.id).then(function (channel) {
            // console.log("###################");
            // console.log(body["username"]);
            // console.log(channel.owner["username"]);
            if (body["username"] == channel.owner.get("username")) {
              channel.remove().then(function () {
                return res.json({
                  success: true
                });
              })["catch"](function (error) {
                res.status(500).json("Internal Server Error");
              });
            } else {
              res.status(403).json("Forbidden");
            }
          })["catch"](function (err) {
            return res.status(404).json({
              success: false
            });
          });
        }
      } else {
        res.status(500).json("Internal Server Error");
      }
    })["catch"](function (error) {
      // console.error(error);
      res.status(500).json("Internal Server Error");
    });
  } else {
    res.status(401).json("Unauthorized");
  }
}); //!@route PUT api/channels/modify/:id

router.put("/modify/:id", function _callee2(req, res) {
  var body, id, doc;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          body = tokenBody(req);

          if (!body["success"]) {
            _context2.next = 9;
            break;
          }

          //id of the channel
          id = req.params.id;
          _context2.next = 5;
          return regeneratorRuntime.awrap(Channel.findOne({
            _id: id
          }));

        case 5:
          doc = _context2.sent;

          if (body["username"] == channel.owner.get("username")) {
            doc.name = req.body.name == undefined ? doc.name : req.body.name;
            doc.description = req.body.description == undefined ? doc.description : req.body.description;
            doc.save().then(function (channel) {
              return res.json(channel);
            })["catch"](function (error) {
              res.status(500).json("Internal Server Error");
            });
          } else {
            res.status(403).json("Forbidden");
          }

          _context2.next = 10;
          break;

        case 9:
          res.status(401).json("Unauthorized");

        case 10:
        case "end":
          return _context2.stop();
      }
    }
  });
});
module.exports = router;