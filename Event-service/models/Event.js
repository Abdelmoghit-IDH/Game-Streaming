const mongoose = require('mongoose')

const EventSchema = new mongoose.Schema({
  name:{
    type: String,
    required: true,
    trim:true,
  },
  hidden:{ 
    type: Boolean,
    default: false,
  },
  eventDate:{
    type: Date,
    default:Date.now(),
    required: true,
  },
  participant: [{
    participantName: String,
    isParticipating: {
      type:Boolean,
      default: false,
    },
  }]

})

module.exports = mongoose.model('Event', EventSchema)
