const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const debug = require('debug')('your-app-name');
const httpErrors = require('http-errors');
const morgan = require('morgan');

const app = express();

// Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Set the view engine to use EJS
app.set('view engine', 'ejs');

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Define your routes here

// Example route
app.get('/', (req, res) => {
  res.render('index', { title: 'My EJS App' });
});

app.get('/Jlogin', (req, res) => {
    res.render('Jlogin', { title: 'My EJS App' });
  });
app.get('/Elogin', (req, res) => {
    res.render('Elogin', { title: 'My EJS App' });
  });

  

// Error handling middleware
app.use((req, res, next) => {
  next(httpErrors(404));
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send('Error: ' + err.message);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  debug(`Server is running on port ${PORT}`);
});
