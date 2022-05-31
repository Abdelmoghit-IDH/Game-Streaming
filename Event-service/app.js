const express = require('express');
const app = express();
const events = require('./routes/events')
const connectDB = require('./db/connect');
require('dotenv').config();


// middleware

app.use(express.json())

//routes
app.get('/hello', (req, res)=> {
    res.send('event Manager')
})

app.use('/api/v1/events', events)

// app.get('/api1/v1/events')           -get all event
// app.post('/api1/v1/events')          -create new event
// app.get('/api1/v1/events')           -get a single event
// app.patch('/api1/v1/events/:id')     -update event
// app.patch('/api1/v1/events/:id')     -delete event

const port = 3000

const start = async () => {
    try {
      await connectDB(process.env.MONGO_URI);
      app.listen(port, () =>
        console.log(`Server is listening on port ${port}...`)
      );
    } catch (error) {
      console.log(error);
    }
  };
  
  start();




