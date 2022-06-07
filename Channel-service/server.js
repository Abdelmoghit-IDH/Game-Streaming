const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const channels = require("./routes/api/channels");
// Initialiser "express" dans une variable nommée "app"
const app = express();

app.use(cors());
//// BodyParser Middleware
////app.use(bodyParser.json());
app.use(express.json());
app.use("/api/channels", channels);
// DB config
const db = require("./config/keys").mongoURI;
console.log(db);
// connect to mongoDB
mongoose
  .connect(db)
  .then(() => console.log("MongoDB Connected.."))
  .catch((err) => console.log(err));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server started on port ${port}`));
