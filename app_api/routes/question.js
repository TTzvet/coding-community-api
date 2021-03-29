const express = require('express');
const {getAllQuestions, 
  createQuestion, 
  questionByMember, 
  questionById, 
  isAuthor, 
  updateQuestion, 
  deleteQuestion,
  question,
  interest,
  nointerest,
  answer,
  searchText
} = require('../controllers/question');
const { isLoggedin } = require('../controllers/member');
const { memberById } = require('../controllers/member');

const router = express.Router();

// route for get all questions
router.get('/question/all', getAllQuestions);

// routes for interested and not interested
router.put('/question/interest', isLoggedin, interest);
router.put('/question/nointerest', isLoggedin, nointerest);

// routes for answer
router.put('/question/answer', isLoggedin, answer);

// route for search text
router.post('/question/search', searchText);

// route for create question
router.post('/question/new/:memberId', isLoggedin, createQuestion);

// router for get questions by user
router.get('/question/by/:memberId', questionByMember);

// route for get a single post
router.get('/question/:questionId', question);

// router for update question
router.put('/question/:questionId', isLoggedin, isAuthor, updateQuestion)

//router for delete question
router.delete('/question/:questionId', isLoggedin, isAuthor, deleteQuestion)

router.param("memberId", memberById);
router.param("questionId", questionById)


module.exports = router;