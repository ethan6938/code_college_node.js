"use strict";

const express = require("express");
const app = express();
const errorController = require("./controllers/errorController");
const homeController = require("./controllers/homeController");
const layouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const Subscriber = require("./models/subscriber");
const subscriberController = require("./controllers/subscribersController");

// connecting to database
mongoose.connect("mongodb://localhost:3000/Composite", {
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.once("open", () => {
  console.log("Successfully connected to MongoDB using Mongoose!");
});

app.set("port", process.env.PORT || 3000);
app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(layouts);
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(express.json());

app.get("/", homeController.index); // index.ejs
app.get("/courses", homeController.showCourses); // courses.ejs
app.post("/contact", homeController.postedSignUpForm);

app.get(
  "/subscribers",
  subscriberController.getAllSubscribers,
  (req, res, next) => {
    res.render("subscribers", { subscribers: req.data });
  }
); // subscribers.ejs

app.get("/contact", subscriberController.getSubscriptionPage);
app.post("/subscribe", subscriberController.saveSubscriber);

app.use(errorController.respondNoResourceFound);
app.use(errorController.respondInternalError);

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
