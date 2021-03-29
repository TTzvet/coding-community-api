const express = require('express');
const {getAllEvents, 
  createEvent, 
  eventByMember, 
  eventById, 
  isAuthor, 
  updateEvent, 
  deleteEvent,
  event,
  interest,
  nointerest
} = require('../controllers/event');
const { isLoggedin } = require('../controllers/member');
const { memberById } = require('../controllers/member');

const router = express.Router();

// route for get all events
router.get('/event/all', getAllEvents);

// routes for interested and not interested
router.put('/event/interest', isLoggedin, interest);
router.put('/event/nointerest', isLoggedin, nointerest);

// route for create new event
router.post('/event/new/:memberId', isLoggedin, createEvent);

// router for get questions by user
router.get('/event/by/:memberId', eventByMember);

// route for get a single post
router.get('/event/:eventId', event);

// router for update method
router.put('/event/:eventId', isLoggedin, isAuthor, updateEvent)

//router for delete question
router.delete('/event/:eventId', isLoggedin, isAuthor, deleteEvent)

router.param("memberId", memberById);
router.param("eventId", eventById)


module.exports = router;