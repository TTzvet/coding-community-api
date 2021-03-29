const express = require('express');
const { memberById, getAllMembers, getAMember, updateMember, deleteMember, memberImage } = require('../controllers/member');
const { isLoggedin } = require('../controllers/member');
const { register, login, logout } = require('../controllers/member');
const {regValidation} = require('../controllers/member');

const router = express.Router();

// routes for member registration, login and logout
router.post('/register', regValidation, register);
router.post('/login', login);
router.get('/logout', logout);

// route for get all members
router.get('/members', getAllMembers);

// route for get a single member
router.get('/member/:memberId', isLoggedin, getAMember);

// route for update member
router.put('/member/:memberId', isLoggedin, updateMember);

// route for delete member
router.delete('/member/:memberId', isLoggedin, deleteMember);

// route for get member image 
router.get("/member/image/:memberId", memberImage);

router.param("memberId", memberById);

module.exports = router;