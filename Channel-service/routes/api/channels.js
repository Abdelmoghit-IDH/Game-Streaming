const express = require("express");
const router = express.Router();
// Item model
const myModule = require("../../models/Channel");
const Channel = myModule.Channel;
const axios = require("axios");
const jwt = require("jsonwebtoken");

const decode = (bearerToken) => {
  try {
    tokenSecret = "your-256-bit-secret";
    const decodeAuthToken = (token, tokenSecret) =>
      jwt.verify(token, tokenSecret);
    const decoded = decodeAuthToken(bearerToken, tokenSecret);
    decoded["success"] = true;
    console.log("Wayeeeeeeeh");
    return decoded;
  } catch (e) {
    console.log("walaaaaaaaaa");
    return { success: false };
  }
};

// {
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

const tokenBody = (req) => {
  const authorization = req.headers.authorization;
  const token = authorization == undefined ? "1" : authorization.split(" ")[1];
  const Body = decode(token);
  return Body;
};

//! test
router.get("/testToken", (req, res) => {
  const body = tokenBody(req);
  res.json(body);
});

//!@route GET api/channels = Get all channels (even by name)
router.get("/", (req, res) => {
  const body = tokenBody(req);
  if (body["success"]) {
    const name = req.body.name;
    //get all
    if (name == undefined || name == "")
      Channel.find()
        .sort({ date: -1 })
        .then((channels) => res.json(channels));
    //get all that start with the name in the body
    else
      Channel.find({
        name: { $regex: "^" + name },
      })
        .sort({ date: -1 })
        .then((channels) => res.json(channels))
        .catch((error) => {
          res.status(500).json("Internal Server Error");
        });
  } else {
    res.status(401).json("Unauthorized");
  }
});

//!@route GET api/channels = Get all MY channels by OWNER_ID
router.get("/mychannels/:id", (req, res) => {
  const body = tokenBody(req);
  if (body["success"]) {
    const id = req.params.id;
    Channel.find({
      "owner.id": id,
    })
      .then((channel) => res.json(channel))
      .catch((error) => {
        res.status(500).json("Internal Server Error");
      });
  } else {
    res.status(401).json("Unauthorized");
  }
});

//!@route GET api/channels = Get The ONE channel by id
router.get("/:id", (req, res) => {
  const body = tokenBody(req);
  if (body["success"]) {
    const id = req.params.id;
    Channel.findOne({
      _id: id,
    })
      .then((channel) => res.json(channel))
      .catch((error) => {
        res.status(500).json("Internal Server Error");
      });
  } else {
    res.status(401).json("Unauthorized");
  }
});

//!@route POST api/channels = Create a Post
router.post("/", (req, res) => {
  const body = tokenBody(req);
  if (body["success"]) {
    //send request to straming service
    //todo ........check if undefined
    axios
      .post("http://127.0.0.1:5000/createchannel/" + body["username"],req.headers)
      .then((response) => {
        // console.log(`statusCode: ${response.status}`);
        // console.log(response);

        // console.log(response);
        // console.log("yyyyyyyyyyyyy");
        if (response.statusText == "OK") {
          const newChannel = new Channel({
            //_id is set by default
            name: req.body.name,
            description: req.body.description,
            profilePictureURL: "test", //todo req.body.profilePictureURL,
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
            subscribersList: [], //Empty when created, req.body.subscribersList,
            videoList: [], //Empty when created, req.body.videoList,
            //dateOfCreation is set by default in the model
          });
          newChannel
            .save()
            .then((channel) => res.json(channel))
            .catch((error) => {
              res.status(500).json("Internal Server Error");
            });
        } else {
          res.status(500).json("Internal Server Error");
        }
      })
      .catch((error) => {
        res.status(500).json("Internal Server Error");
      });
  } else {
    res.status(401).json("Unauthorized");
  }
});

//!@route PUT api/channels/:id = Subscribe & Unsubscribe to a channel
router.put("/:id", async (req, res) => {
  const body = tokenBody(req);
  if (body["success"]) {
    //id of the channel
    const id = req.params.id;
    const isSubscribing = req.body.subscrib;
    // console.log(isSubscribing);
    // const user = {
    //   id: body.userId,
    //   username: body.username,
    //   name: body.userName,
    //   email: body.userEmail,
    // };
    const doc = await Channel.findOne({ _id: id });
    if (isSubscribing) {
      // doc.subscribersList.push(user);
      doc.subscribersList.push(body);
    } else {
      doc.subscribersList = doc.subscribersList.filter(
        (element) => element.get("id") != body["id"]
      );
    }
    doc
      .save()
      .then((channel) => res.json(channel))
      .catch((error) => {
        res.status(500).json("Internal Server Error");
      });
  } else {
    res.status(401).json("Unauthorized");
  }
});

//!@route DELETE api/channels/:id = Delete a channel
router.delete("/:id", (req, res) => {
  //delete in streaming channel first

  const body = tokenBody(req);
  if (body["success"]) {
    // const headers = {
    //   role: "user",
    //   username: "hatimmoydydtf",
    // };
    headers=req.headers
    axios
      .delete(
        "http://127.0.0.1:5000/deletechannel/" + req.body.owner.username,
        {
          headers,
        }
      )
      .then((response) => {
        // console.log(`statusCode: ${response.status}`);
        // console.log(response);

        // console.log(response);
        // console.log("yyyyyyyyyyyyy");
        if (response.statusText == "OK") {
          if (response.data["isDeleted"]) {
            Channel.findById(req.params.id)
              .then((channel) => {
                // console.log("###################");
                // console.log(body["username"]);
                // console.log(channel.owner["username"]);
                if (body["username"] == channel.owner.get("username")) {
                  channel
                    .remove()
                    .then(() => res.json({ success: true }))
                    .catch((error) => {
                      res.status(500).json("Internal Server Error");
                    });
                } else {
                  res.status(403).json("Forbidden");
                }
              })
              .catch((err) => res.status(404).json({ success: false }));
          }
        } else {
          res.status(500).json("Internal Server Error");
        }
      })
      .catch((error) => {
        // console.error(error);
        res.status(500).json("Internal Server Error");
      });
  } else {
    res.status(401).json("Unauthorized");
  }
});

//!@route PUT api/channels/modify/:id
router.put("/modify/:id", async (req, res) => {
  const body = tokenBody(req);
  if (body["success"]) {
    //id of the channel
    const id = req.params.id;

    const doc = await Channel.findOne({ _id: id });

    if (body["username"] == channel.owner.get("username")) {
      doc.name = req.body.name == undefined ? doc.name : req.body.name;
      doc.description =
        req.body.description == undefined
          ? doc.description
          : req.body.description;
      doc
        .save()
        .then((channel) => res.json(channel))
        .catch((error) => {
          res.status(500).json("Internal Server Error");
        });
    } else {
      res.status(403).json("Forbidden");
    }
  } else {
    res.status(401).json("Unauthorized");
  }
});

module.exports = router;
