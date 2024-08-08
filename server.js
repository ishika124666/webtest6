const express = require('express');
const session = require('express-session');
const helmet = require('helmet');
const path = require('path');
const app = express();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Session management
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set secure to true if using HTTPS
}));

// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
}

// EJS setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Route to display profile
app.get('/profile', isAuthenticated, (req, res) => {
  const { name, email, address, pincode } = req.session.user;
  res.render('profile', { name, email, address, pincode });
});

// Route to login (For demonstration purposes)
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.post('/login', (req, res) => {
  const { name, email, address, pincode } = req.body;
  req.session.user = { name, email, address, pincode };
  res.redirect('/profile');
});

// Route to logout
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
