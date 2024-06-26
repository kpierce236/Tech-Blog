const path = require('path');
const express = require('express');
const session = require('express-session');
const routes = require('./controllers');
const exphbs = require('express-handlebars');
const moment = require('moment');

const sequelize = require('./config/connection'); // Import Sequelize connection

// SequelizeStore allows Express to store session information in Sequelize
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const app = express();
const PORT = process.env.PORT || 3001;

// Session configuration
const sess = {
  secret: process.env.SESSION_SECRET, // Secret used to sign the session ID cookie
  cookie: {}, // Configuration for session cookies (optional)
  resave: false, // Whether to save the session store on each request regardless of changes
  saveUninitialized: true, // Whether to save uninitialized sessions (new sessions with no data)
  store: new SequelizeStore({ // Sequelize session store
    db: sequelize // Sequelize connection
  })
};
// Register moment helper with Handlebars
const hbs = exphbs.create({
  helpers: {
      moment: function(date, options) {
        const format = options.hash.format || "YYYY-MM-DD HH:mm:ss";
        return moment(date).format(format);
      }
  }
});

// Set up session middleware with the defined session configuration
app.use(session(sess));

// Set up handlebars as the view engine
app.engine('handlebars', hbs.engine);

app.set('view engine', 'handlebars');

// Parse incoming request bodies in JSON format
app.use(express.json());
// Parse incoming request bodies in URL-encoded format
app.use(express.urlencoded({ extended: true }));
// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to set common variables for all routes
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.logged_in || false;
  next();
});

// Set up application routes
app.use(routes);

// Sync the Sequelize models with the database and start the server
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});
