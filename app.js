const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const debug = require('debug')('your-app-name');
const httpErrors = require('http-errors');
const morgan = require('morgan');

const app = express();

const uri = "mongodb+srv://jay111:AqhwQin3OCgIHfFV@jay111.ck6xvuz.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected correctly to MongoDB"))
    .catch(err => console.error("Could not connect to MongoDB", err));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// Set the view engine to use EJS
app.set('view engine', 'ejs');

// Use morgan for logging requests
app.use(morgan('dev'));


// Use the userRoutes for handling user-related routes
app.use(userRoutes);


// Example route
app.get('/', (req, res) => {
  res.render('index', { title: 'My EJS App' });
});

// Define other routes here if needed
// Example route
app.get('/', (req, res) => {
  res.render('index', { title: 'My EJS App' });
});
app.get('/Jregister', (req, res) => {
  res.render('Jregister', { title: 'My EJS App' });
});
app.get('/Eregister', (req, res) => {
  res.render('Eregister', { title: 'My EJS App' });
});

app.get('/Jlogin', (req, res) => {
    res.render('Jlogin', { title: 'My EJS App' });
  });
app.get('/Contact', (req, res) => {
    res.render('Contact', { title: 'My EJS App' });
  });
app.get('/Elogin', (req, res) => {
    res.render('Elogin', { title: 'My EJS App' });
  });
  app.get('/Site', (req, res) => {
    res.render('Site', { title: 'My EJS App' });
  });
  app.get('/Joboption', (req, res) => {
    res.render('Joboption', { title: 'My EJS App' });
  });
  app.get('/About', (req, res) => {
    res.render('About', { title: 'My EJS App' });
  });
  app.get('/Advertise', (req, res) => {
    res.render('Advertise', { title: 'My EJS App' });
  });
  app.get('/Area', (req, res) => {
    res.render('Area', { title: 'My EJS App' });
  });
  app.get('/Japp', (req, res) => {
    res.render('Japp', { title: 'My EJS App' });
  });
  app.get('/Edash', (req, res) => {
    res.render('Edash', { title: 'My EJS App' });
  });
  app.get('/Etobicoke', (req, res) => {
    res.render('Etobicoke', { title: 'My EJS App' });
  });
  app.get('/Category', (req, res) => {
    res.render('Category', { title: 'My EJS App' });
  });
  app.get('/Jedit', (req, res) => {
    res.render('Jedit', { title: 'My EJS App' });
  });
  app.get('/Newjob', (req, res) => {
    res.render('Newjob', { title: 'My EJS App' });
  });
  app.get('/Submit', (req, res) => {
    res.render('Submit', { title: 'My EJS App' });
  });
  app.get('/North', (req, res) => {
    res.render('North', { title: 'My EJS App' });
  });
  app.get('/Oldjob', (req, res) => {
    res.render('Oldjob', { title: 'My EJS App' });
  });
  app.get('/Scarborough', (req, res) => {
    res.render('Scarborough', { title: 'My EJS App' });
  });
  app.get('/TandE', (req, res) => {
    res.render('TandE', { title: 'My EJS App' });
  });
// Error handling middleware for 404 errors
app.use((req, res, next) => {
  next(httpErrors(404));
});

// Error handling middleware for other errors
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send('Error: ' + err.message);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  debug(`Server is running on port ${PORT}`);
});
