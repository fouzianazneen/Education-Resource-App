


const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const authRoutes = require('./routes/auth');
const educatorRoutes = require('./routes/educator');
const studentRoutes = require('./routes/student');
const session = require('express-session');
const methodOverride = require('method-override');
const app = express();

mongoose.connect('mongodb://localhost:27017/education-resource-center', { useNewUrlParser: true, useUnifiedTopology: true });


app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  // cookie: { secure: true } // Adjust options based on your requirements
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/auth', authRoutes);
app.use('/educator', educatorRoutes);
app.use('/student', studentRoutes);

app.get('/', (req, res) => {
  res.render('index');
});

// app.use(session({
//   secret: 'your_secret_key',
//   resave: false,
//   saveUninitialized: false,
//   cookie: { secure: true } // Adjust options based on your requirements
// }));

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
