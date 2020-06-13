const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  logOutUser,
  createComp,
  history,
  resign,
  companies,
  compdash,
  joincomp,
} = require('../controllers/apiController');
const authenticate = require('../middleware/authenticate');
const User = require('../models/user');
const Detail = require('../models/Info');
const Event = require('../models/event');

router.get('/', (req, res) => {
  if (req.session.userId) {
    res.render('home', {
      userId: req.session.userId,
    });
  } else {
    res.render('home');
  }
});

router.get('/home', authenticate, async (req, res) => {
  const user = await User.findById(req.session.userId);
  // console.log(user)
  if (user.booking == false) {
    res.render('dashboard', {
      userId: req.session.userId,
      free: true,
    });
  } else {
    const details = await Detail.find({ _id: user.cur_company }).populate(
      'company'
    );
    // console.log(details)
    res.render('dashboard', {
      name: details[0].company.name,
      role: details[0].role,
      joiningdate: details[0].joiningdate,
      userId: req.session.userId,
      free: false,
      id: details[0].company._id,
    });
  }
});
router.get('/register', (req, res) => {
  res.render('register');
});
router.post('/register', registerUser);

router.get('/login', (req, res) => {
  res.render('login');
});
router.get('/newcompany', authenticate, async (req, res) => {
  const user = await User.findById(req.session.userId);
  if (user.booking == true) {
    res.redirect('/home');
  } else {
    res.render('create', {
      userId: req.session.userId,
    });
  }
});
router.get('/history', authenticate, history);
router.get('/allcomp', authenticate, companies);
router.get('/compdash/:id', authenticate, compdash);
router.post('/login', loginUser);
router.post('/newcomp', authenticate, createComp);
router.post('/join/:id', authenticate, joincomp);
router.delete('/logout', authenticate, logOutUser);
router.delete('/resign/:id', authenticate, resign);

// var express = require('express');
// var userApiController = require('../../controller/apiController/userApiController');
// var router = express.Router();
// var authenticate = require('../../Middleware/authentication');

// router.post('/register', userApiController.registerUser);
// router.post('/login', userApiController.loginUser);
// router.delete('/logout', authenticate, userApiController.logOutUser);

// router.post('/start', userApiController.start);

// router.get('/register', userNormalController.register);
// router.get('/login', userNormalController.login);
// router.get('/dashboard', userNormalController.dashboard);
// router.get('/start', userNormalController.start);
// // router.get('/home',userNormalController.home)

module.exports = router;
