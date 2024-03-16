// utils/withAuth.js
const withAuth = (req, res, next) => {
    // If the user isn't logged in, redirect them to the login route
    if (!req.session.logged_in) {
      res.redirect('/login');
    } else {
      next();
    }
  };
  
  const setSession = (req, userId) => {
    // Set session variables upon login
    req.session.logged_in = true;
    req.session.user_id = userId;
  };
  
  const destroySession = (req) => {
    // Destroy session variables upon logout
    if (req.session.logged_in) {
      req.session.destroy((err) => {
        if (err) {
          console.error('Error destroying session:', err);
        }
      });
    }
  };
  
  module.exports = { withAuth, setSession, destroySession };
  