var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
// Router Objects
var indexRouter = require("./routes/index");
var tasksRouter = require("./routes/tasks");
var tagsRouter = require("./routes/tags");
// var usersRouter = require('./routes/users');
// Import MongoDB and Configuration modules
var mongoose = require("mongoose");
var configs = require("./configs/globals");
// HBS Helper Methods
var hbs = require("hbs");
// Import passport and session modules
var passport = require("passport");
var session = require("express-session");
// Import user model
var User = require("./models/user");
// Import Google Strategy
var googleStrategy = require("passport-google-oauth20").Strategy;
// Express App Object
var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
// Express Configuration
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
// Configure passport module https://www.npmjs.com/package/express-session
app.use(
  session({
    secret: "s2021pr0j3ctTracker",
    resave: false,
    saveUninitialized: false,
  })
);
// Initialize passport
app.use(passport.initialize());
app.use(passport.session());
// Link passport to the user model
passport.use(User.createStrategy());
// configure Google strategy
passport.use(
  new googleStrategy(
    {
      clientID: configs.Authentication.Google.ClientId,
      clientSecret: configs.Authentication.Google.ClientSecret,
      callbackURL: configs.Authentication.Google.CallbackUrl,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user with this OAuth ID already exists
        let user = await User.findOne({ oauthId: profile.id });

        if (!user) {
          // Register a new user if one doesn't exist
          user = new User({
            username: profile.displayName || profile.emails[0].value,
            oauthId: profile.id,
            oauthProvider: "Google",
          });
          await user.save();
        }

        // Return user to be serialized into session
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Set passport to write/read user data to/from session object
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

// Routing Configuration
app.use("/", indexRouter);
app.use("/tasks", tasksRouter);
app.use("/tags", tagsRouter);
// app.use('/users', usersRouter);
// Connecting to the DB
mongoose
  .connect(configs.ConnectionStrings.MongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((message) => console.log("Connected Successfully!"))
  .catch((error) => console.log(`Error while connecting: ${error}`));
// Sub-Expressions https://handlebarsjs.com/guide/builtin-helpers.html#sub-expressions
// function name and helper function with parameters
// Your existing helpers
hbs.registerHelper("createOptionElement", (currentValue, selectedValue) => {
  console.log(currentValue + " " + selectedValue);
  var selectedProperty = "";
  if (currentValue == selectedValue.toString()) {
    selectedProperty = "selected";
  }
  return new hbs.SafeString(
    `<option ${selectedProperty}>${currentValue}</option>`
  );
});

hbs.registerHelper("toShortDate", (longDateValue) => {
  return new hbs.SafeString(longDateValue.toLocaleDateString("en-CA"));
});

// Add these new helpers
hbs.registerHelper("eq", function (a, b) {
  return a === b;
});

hbs.registerHelper("array", function (...args) {
  return args.slice(0, -1);
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
