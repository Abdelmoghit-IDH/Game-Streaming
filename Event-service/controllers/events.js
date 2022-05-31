const Event = require('../models/Event')
const jwt = require('jsonwebtoken')

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

const tokenBody = (req) => {
  const authorization = req.headers.authorization;
  const token = authorization.split(" ")[1];
  const Body = decode(token);
  console.log(Body);
  return Body;
};

/*
  ////eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IjEyMzQ1Njc4OTAiLCJuYW1lIjoiSm9obiBEb2UiLCJpZCI6MTUxNjIzOTAyMiwiZW1haWwiOiJ0ZXN0QHRlc3QuY29tIn0.FKfd3faiHPqG0HHUeUWF16O8WPJsJo0X_7KwCLSaBUQ

*/

//event handling
//Create Event
const createEvent = async (req, res) => {
  const body = tokenBody(req);
  if (body["success"]) {
    const event = await Event.create(req.body);
    res.status(201).json({event})
  }
  else {
    res.status(401).json("Unauthorized");
  }
}
//delete event
const deleteEvent= async (req, res, next) => {
  const body = tokenBody(req);
  if (body["success"]) {
    const { id: eventID } = req.params
    const event = await Event.findOneAndDelete({ _id: eventID })
    if (!event) {
      return next(createCustomError(`No event with id : ${eventID}`, 404))
    }
    res.status(200).json({ event })
  }
  else {
    res.status(401).json("Unauthorized");
  }
}
const updateEvent = async (req, res, next) => {
  const body = tokenBody(req);
  if (body["success"]) {
    const { id: eventID } = req.params
    const event = await Event.findOneAndUpdate({ _id: eventID }, req.body, {
      new: true,
      runValidators: true,
    })
    if (!event) {
      return next(createCustomError(`No event with id : ${eventID}`, 404))
    }
    res.status(200).json({ event })
  }
  else {
    res.status(401).json("Unauthorized");
  }

}

//get event by name
const getAllEvents =async (req, res) => {
  const body = tokenBody(req);
  if (body["success"]) {
    const {hidden} = req.query
    const queryObject = {}
    if(hidden){
      queryObject.hidden= hidden==='true' ? true :false
    }
    const event = await Event.find(req.query)
    res.status(200).json({ event })
  }
  else {
    res.status(401).json("Unauthorized");
  }
}
const getEventByName =async (req, res) => {
  const body = tokenBody(req);
  if (body["success"]) {
    const {name} = req.query
    const queryObject = {}
    if(!name){
      queryObject.name= name
    }
    const event = await Event.find(req.query)
    res.status(200).json({ event })
  }
  else {
    res.status(401).json("Unauthorized");
  }
}
const getEvent = async (req, res, next) => {
  const body = tokenBody(req);
  if (body["success"]) {
    const { id: eventID } = req.params
    const event = await Event.findOne({ _id: eventID })
    if (!event) {
      return next(createCustomError(`No event with id : ${eventID}`, 404))
    }
    res.status(200).json({ event })
  }
  else {
    res.status(401).json("Unauthorized");
  }

  
}

//Participant handling

const newParticipant = async (req, res) => {
  const isParticipating=req.body.isParticipating;
  const id = req.params.id;
  const nParticipant = {
    id: req.body.id,
    participantName: req.body.participantName,
    isParticipating:req.body.isParticipating,
  };
  
  const doc = await Event.findOne({ _id: id });
  console.log(nParticipant)
  console.log(doc)
  if (isParticipating) {
    console.log("already participating")
  } else {
    doc.participant.push(nParticipant);
  
  }
  console.log(isParticipating)
  doc.save().then((event) => res.json(event));
}

const getAllParticipant = async (req, res) => {
  const {id: eventId} = req.params
  const event = await Event.findOne({ _id: eventId })
  if (!event) {
    return next(createCustomError(`No event with id : ${eventId}`, 404))
  }
  const participant = await Event.find(req.query)
  res.status(200).json({ participant })
}

const testJWT = async (req, res) => {
  const body = tokenBody(req);
      if (body["success"]) {
        return body;
      } else {
        res.status(401).json("Unauthorized");
      }
}

module.exports = {
  getAllEvents,
  getEventByName,
  createEvent,
  testJWT,
  getEvent,
  updateEvent,
  deleteEvent,
  newParticipant,
  getAllParticipant,
}
