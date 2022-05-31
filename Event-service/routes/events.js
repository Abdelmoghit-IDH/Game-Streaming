const express = require('express')
const router = express.Router()

const {
  getAllEvents,
  getEventByName,
  testJWT,
  createEvent,
  getEvent,
  updateEvent,
  deleteEvent,
  getAllParticipant,
  newParticipant,
} = require('../controllers/events')

router.route('/').get(getAllEvents).post(createEvent).checkout(getEventByName).head(testJWT)
router.route('/:id').get(getEvent).patch(updateEvent).delete(deleteEvent).put(newParticipant).copy(getAllParticipant)

module.exports = router
