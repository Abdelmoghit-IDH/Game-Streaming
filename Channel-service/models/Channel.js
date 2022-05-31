const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// const UserSchema = new Schema({
//   id: {
//     type: String,
//     required: true,
//   },
//   name: {
//     type: String,
//     required: true,
//   },
//   email: {
//     type: String,
//     required: true,
//   },
// });

const ChannelSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  profilePictureURL: {
    type: String,
    required: true,
  },
  dateOfCreation: {
    type: Date,
    default: Date.now,
  },
  owner: {
    type: Map,
    required: true,
  },
  subscribersList: {
    type: [Map],
    required: true,
  },
  //to add 
  ingestEndpoint: {
    type: String,
    required: true,
  },
  streamKey: {
    type: String,
    required: true,
  },
  playbackUrl: {
    type: String,
    required: true,
  },
  //
  videoList: {
    type: [String],
    required: true,
  },
});



module.exports = {
  Channel : mongoose.model("item", ChannelSchema),
  // UserSchema: UserSchema,
}
// Channel = mongoose.model("item", ChannelSchema);
// module.exports = UserSchema = mongoose.model("user", UserSchema);
// module.exports = UserSchema;
