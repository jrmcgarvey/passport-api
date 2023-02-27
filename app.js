require("dotenv").config();
const express = require("express");
require("express-async-errors");
const app = express();
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/User");
const MongoDBStore = require("connect-mongodb-session")(session);

const store = new MongoDBStore({
  // may throw an error, which won't be caught
  uri: process.env.MONGO_URI,
  collection: "mySessions",
});
store.on("error", function (error) {
  console.log(error);
});

const session_parms = {
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  store: store,
  cookie: { secure: false, sameSite: "strict" },
};

if (app.get("env") === "production") {
  //SECURITY
  app.set("trust proxy", 1); // trust first proxy
  session_parms.cookie.secure = true; // serve secure cookies
}
app.use(session(session_parms));

const localOpts = {
  usernameField: "email",
};
const localStrategy = new LocalStrategy(
  localOpts,
  async (email, password, done) => {
    try {
      const user = await User.findOne({
        email,
      });
      if (!user) {
        throw new CustomError(401, "Authentication failed.");
        //return done(null, false);
      } else if (!user.comparePassword(password)) {
        throw new CustomError(401, "Authentication failed.");
      }
      return done(null, user);
    } catch (e) {
      return done(e, false);
    }
  }
);
passport.serializeUser(async function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findById(id);
    if (!user) {
      return done(new Error("user not found"));
    }
    return done(null, user);
  } catch (e) {
    done(e);
  }
});
passport.use(localStrategy);
app.use(passport.initialize());
app.use(passport.session());

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
const authMiddleware = require("./middleware/auth");
const CustomError = require("./errors/errors");

app.use(express.json());
app.use(express.static("public"));
// extra packages

// routes

app.post("/signup", async (req, res) => {
  await User.create(req.body);
  res.status(201).json({ message: "user created" });
});
const authLocal = passport.authenticate("local", {
  session: true,
});
app.post("/logout", function (req, res) {
  req.logout(function (err) {
    if (err) {
      throw err;
    }
    res.json({ message: "You are logged out." });
  });
});
const clearLogon = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      throw err;
    }
  });
  next();
};
app.post("/logon", clearLogon, authLocal, (req, res) => {
  res.json({ user: req.user });
});

app.get("/test", authMiddleware, (req, res) => {
  res.json({ message: "You're logged in!", user: req.user });
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    mongoose.connect(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
