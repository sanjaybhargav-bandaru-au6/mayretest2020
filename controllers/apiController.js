const User = require('../models/user');
const Detail = require('../models/Info');
const Event = require('../models/event');
// var Employee = require('../../models/employee');
// var Company = require('../../models/Company');
// const bcrypt = require('bcrypt');

module.exports = {
  registerUser: async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const user = await new User({
        name: name,
        email: email,
        password: password,
      });
      await user.save();
      req.session.userId = user._id;
      res.redirect('/home');
    } catch {
      // console.log(err.message);
      res.redirect('/register');
    }
  },
  loginUser: async function (req, res) {
    try {
      var email = req.body.email;
      var password = req.body.password;
      if (!email || !password) throw new Error('Incorrect credentials');
      const user = await User.findByEmailAndPassword(email, password);
      req.session.userId = user._id;
      res.redirect('/home');
    } catch (err) {
      console.log(err.message);
      res.redirect('/login');
    }
  },

  logOutUser: function (req, res) {
    req.session.destroy();
    return res.redirect('/');
  },
  createComp: async function (req, res) {
    try {
      const id = req.session.userId;
      const name = req.body.name;
      const user = await User.findById(id);
      const event = await new Event({ name: name });
      const detail = await new Detail({
        company: event._id,
        employee: id,
        name: user.name,
        role: 'ceo',
      });
      event.employees.push(detail._id);
      await event.save();
      // console.log(employee);
      user.company_worked.push(detail._id);
      user.booking = true;
      user.cur_company = detail._id;
      await user.save();
      await detail.save();
      res.redirect('/home');
    } catch (err) {
      console.log(err);
      res.redirect('/newcompany');
    }
  },
  history: async function (req, res) {
    try {
      const id = req.session.userId;
      const details = await Detail.find({ employee: id }).populate('company');
      res.render('history', {
        data: details,
        userId: req.session.userId,
      });
    } catch (err) {
      console.log(err.message);
      res.redirect('/home');
    }
  },
  resign: async function (req, res) {
    try {
      const id = req.session.userId;
      const CompId = req.params.id;
      const user = await User.findById(id);
      const event = await Event.findById(CompId);
      const detail = await Detail.findOne({ company: CompId });
      if (user && event && detail) {
        detail.current_status = 'ex';
        detail.resignationdate = Date();
        user.cur_event = null;
        user.booking = false;
        await detail.save();
        await user.save();
        console.log(user);
      }
      res.redirect('/home');
    } catch (err) {
      console.log(err.message);
      res.redirect('/home');
    }
  },
  companies: async function (req, res) {
    try {
      const event = await Event.find();
      console.log(event);
      res.render('company', {
        data: event,
        userId: req.session.userId,
      });
    } catch (err) {
      console.log(err.message);
      res.redirect('/home');
    }
  },

  compdash: async function (req, res) {
    try {
      const compid = req.params.id;
      const details = await Event.findById(compid).populate('employees');
      var current = [];
      var ex = [];
      for (i = 0; i < details.employees.length; i++) {
        if (details.employees[i].current_status == 'booking') {
          current.push(details.employees[i]);
          continue;
        } else if (details.employees[i].current_status == 'ex') {
          ex.push(details.employees[i]);
          continue;
        }
      }
      const user = await User.findById(req.session.userId);
      res.render('compdash', {
        name: details.name,
        current: current,
        ex: ex,
        id: details._id,
        userId: req.session.userId,
        booking: user.booking,
      });
    } catch (err) {
      console.log(err);
      res.redirect('/home');
    }
  },
  joincomp: async function (req, res) {
    try {
      const id = req.session.userId;
      const compid = req.params.id;
      const user = await User.findById(id);
      if (user.booking == true) {
        throw new Error('Already booking');
      }
      const event = await Event.findById(compid);
      const role = req.body.name;
      const detail = await new Detail({
        company: event._id,
        employee: id,
        name: user.name,
        role: role,
      });
      event.employees.push(detail._id);
      await event.save();
      console.log('yes');
      // console.log(employee);
      user.company_worked.push(detail._id);
      user.booking = true;
      user.cur_company = detail._id;
      await user.save();
      await detail.save();
      res.redirect('/home');
    } catch (err) {
      console.log(err);
      res.redirect('/home');
    }
  },
};

// module.exports = {
//   registerUser: function (req, res) {
//     var user1 = req.body;
//     bcrypt
//       .hash(user1.password, 10)
//       .then(function (hashedPassword) {
//         var createObj = {
//           name: user1.name,
//           email: user1.email,
//           password: hashedPassword,
//         };
//         var result = new User({ ...createObj });
//         result.save().then(function (document) {
//           req.session.userId = document._id;
//           res.redirect('/login');
//         });
//       })
//       .catch(function (err) {
//         console.log(err.message);
//         return res.status(500).send('Server error');
//       });
//   },

//   loginUser: function (req, res) {
//     var email = req.body.email;
//     var password = req.body.password;
//     if (!email || !password)
//       return res.status(400).send('Incorrect credentials');
//     User.findByEmailAndPassword(email, password)
//       .then(function (document) {
//         req.session.userId = document._id;
//         res.redirect('dashboard');
//       })
//       .catch(function (err) {
//         console.log(err.message);
//         res.redirect('/login');
//       });
//   },

//   start: function (req, res) {
//     var company = req.body;

//     var createObj = {
//       name: company.name,
//       city: company.email,
//       website: company.website,
//       employees: company.employees,
//     };
//     var result = new Company({ ...createObj });
//     result
//       .save()
//       .then(function (document) {
//         res.redirect('/company');
//       })

//       .catch(function (err) {
//         console.log(err.message);
//         return res.status(500).send('Server error');
//       });
//   },

//   logOutUser: function(req, res) {
//     req.session.destroy();
//     return res.redirect("/login");
//   }
// };
