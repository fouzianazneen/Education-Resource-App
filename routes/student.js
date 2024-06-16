



const express = require('express');
const bcrypt  =  require('bcrypt');
// const { verifyToken } = require('../utils/jwtUtils');
const Resource = require('../models/Resource');
const Student = require('../models/Student');
const router = express.Router();

// Middleware for authenticating student
async function authenticateStudent(req, res, next) {
  const user = req.session.user;
  if (!user || user.role !== 'student') {
    return res.status(401).send('Access denied');
  }
  req.user = user;
  next();
}

router.get('/profile', authenticateStudent, async (req, res) => {
  try {
    // Fetch student data from the database using the ID stored in the session
    const student = await Student.findById(req.user.id);
    if (!student) {
      return res.status(404).send('Student not found');
    }
  res.render('student_profile', { student });
} catch (error) {
  console.error(error);
  res.status(500).send('Internal Server Error');
}
});


// router.get('/resources', authenticateStudent,  (req, res) => {
//   Resource.find()
//     .then(resources => res.render('student_resources', { resources }))
//     .catch(error => res.status(400).send(error.message));
// });



// Route for fetching and rendering the resource browsing page
router.get('/resources', async (req, res) => {
  try {
      // Fetch resources from the database
      const resources = await Resource.find();

      // Render the resource browsing page and pass resources data to the template
      res.render('student_resources', { resources });
  } catch (error) {
      // Handle errors
      console.error('Error fetching resources:', error);
      res.status(500).send('Internal Server Error');
  }
});

// Route for filtering and searching resources
router.get('/resources/search', async (req, res) => {
  try {
      const { subject, branch, semester } = req.query;

      // Build the query object based on provided search criteria
      const query = {};
      if (subject) query.subject = subject;
      // if (branch) query.branch = branch;
      // if (semester) query.semester = semester;

      // Fetch resources from the database based on the query
      const resources = await Resource.find(query);

      // Render the resource browsing page with filtered resources
      res.render('student_resources', { resources });
  } catch (error) {
      // Handle errors
      console.error('Error searching resources:', error);
      res.status(500).send('Internal Server Error');
  }
});

router.get('/profile/edit', authenticateStudent, (req, res) => {
  // Fetch and send student's profile for editing
  res.render('edit_student_profile', { student: req.user });
});

router.post('/profile/update', authenticateStudent, async (req, res) => {
  try {
    const { username, email, branch, year, collegeName, password } = req.body;

    // Find the student by ID
    const student = await Student.findById(req.user.id);
    if (!student) {
      return res.status(404).send('Student not found');
    }

    // Update student fields
    student.username = username;
    student.email = email;
    student.branch = branch;
    student.year = year;
    student.collegeName = collegeName;

    // Check if a new password is provided
    if (password) {
      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      student.password = hashedPassword;
    }

    // Save the updated student
    await student.save();
    res.redirect('/student/profile');
    // res.status(200).send('Student profile updated successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
