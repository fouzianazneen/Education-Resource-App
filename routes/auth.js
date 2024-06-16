

const express = require('express');
const bcrypt = require('bcrypt');
const Educator = require('../models/Educator');
const Student = require('../models/Student');
const router = express.Router();



// Middleware for checking if the user is logged in
function checkLoggedIn(req, res, next) {
  if (!req.session.user) {
    return res.status(401).send('You need to log in to access this resource');
  }
  next();
}


router.get('/register', (req, res) => {
  const { role } = req.query;
  res.render('register', { role });
});

router.get('/login', (req, res) => {
  const role = req.query.role;
  res.render('login', { role });
});

router.post('/register/educator', async (req, res) => {
  try {
    const { password, ...rest } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const educator = new Educator({ ...rest, password: hashedPassword });
    await educator.save();
    res.redirect('/auth/login?role=educator');
  } catch (error) {
    console.error('Error registering educator:', error);
    res.status(400).send(error.message);
  }
});

router.post('/register/student', async (req, res) => {
  try {
    const { password, ...rest } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const student = new Student({ ...rest, password: hashedPassword });
    await student.save();
    res.redirect('/auth/login?role=student');
  } catch (error) {
    console.error('Error registering student:', error);
    res.status(400).send(error.message);
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    let user;

    // Check if the user exists as an educator
    user = await Educator.findOne({ email });
    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        req.session.user = { id: user._id, role: 'educator' };
        return res.redirect('/educator/profile');
      } else {
        return res.status(400).send('Invalid email or password');
      }
    }

    // Check if the user exists as a student
    user = await Student.findOne({ email });
    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        req.session.user = { id: user._id, role: 'student' };
        return res.redirect('/student/profile');
      } else {
        return res.status(400).send('Invalid email or password');
      }
    }

    // If user is not found or password is incorrect
    return res.status(400).send('Invalid email or password');
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).send('Internal Server Error');
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      return res.status(500).send('Internal Server Error');
    }
    res.redirect('/');
  });
});

module.exports = router;






