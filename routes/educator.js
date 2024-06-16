



const express = require('express');
const multer = require('multer');
const bcrypt = require('bcrypt');
const Resource = require('../models/Resource');
const Educator = require('../models/Educator');
const router = express.Router();

// Middleware for authenticating educator
async function authenticateEducator(req, res, next) {
  if (!req.session.user || req.session.user.role !== 'educator') {
    return res.status(401).send('Access denied');
  }
  try {
    const educator = await Educator.findById(req.session.user.id);
    if (!educator) {
      return res.status(404).send('Educator not found');
    }
    req.user = {
      id: educator._id,
      username: educator.username,
      email: educator.email,
      collegeName: educator.collegeName,
      experience: educator.experience,
      role: 'educator'
    };
    next();
  } catch (error) {
    console.error('Authentication Error:', error);
    res.status(401).send('Invalid session');
  }
}


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

router.get('/profile', authenticateEducator, (req, res) => {
  // Fetch and send educator's profile
  res.render('educator_profile', { educator: req.user });
});

router.post('/upload', [authenticateEducator, upload.single('resource')], (req, res) => {
  const resource = new Resource({
    subject: req.body.subject, // Change from title to subject
    description: req.body.description, // Assuming description remains the same
    // ...req.body,
    semester: req.body.semester, // Adding semester
    branch: req.body.branch, // Adding branch
    fileUrl: req.file.path,
    educator: req.user.id,
    uploader: req.user.id
  });
  resource.save()
    .then(() => res.redirect('/educator/resources'))
    .catch(error => res.status(400).send(error.message));
});

router.get('/resources', authenticateEducator, (req, res) => {
  Resource.find({ educator: req.user.id })
    .then(resources => res.render('educator_resources', { resources }))
    .catch(error => res.status(400).send(error.message));
});

router.put('/resources/:id', authenticateEducator, (req, res) => {
  Resource.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then(resource => res.send(resource))
    .catch(error => res.status(400).send(error.message));
});

// router.delete('/resources/:id', authenticateEducator, (req, res) => {
//   Resource.findByIdAndDelete(req.params.id)
//     .then(() => res.send('Resource deleted'))
//     .catch(error => res.status(400).send(error.message));
// });


// Delete resource route
router.delete('/resources/:id', authenticateEducator, async (req, res) => {
  try {
    const { id } = req.params;
    await Resource.findByIdAndDelete(id);
    res.redirect('/educator/resources');
  } catch (error) {
    console.error('Error deleting resource:', error);
    res.status(500).send('Internal Server Error');
  }
});


router.get('/profile/edit', authenticateEducator, (req, res) => {
  // Fetch and send educator's profile for editing
  res.render('edit_educator_profile', { educator: req.user });
});

router.post('/profile/update', authenticateEducator, async (req, res) => {
  try {
    const { username, email, collegeName, experience, password } = req.body;
    const educator = await Educator.findById(req.user.id);
    if (!educator) {
      return res.status(404).send('Educator not found');
    }
    educator.username = username;
    educator.email = email;
    educator.collegeName = collegeName;
    educator.experience = experience;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      educator.password = hashedPassword;
    }
    await educator.save();
    res.redirect('/educator/profile');
  } catch (error) {
    console.error('Error updating educator profile:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;









