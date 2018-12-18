const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");

const app = express();

// Connect to mongoose
mongoose
  .connect(
    "mongodb://localhost/seatup",
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Load Book model
require("./models/Book");
const Book = mongoose.model("book");

// Handlebars Middleware
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Index Route
app.get("/", (req, res) => {
  res.render("index");
});

// About Route
app.get("/about", (req, res) => {
  res.render("about");
});

// Idea/FeedbackSubmit Index Page
app.get("/feedbacksubmit", (req, res) => {
  Book.find({})
    .sort({ date: "desc" })
    .then(ideas => {
      res.render("feedbacksubmit/index", { ideas: ideas });
    });
});

// Book List
app.get("/booking", (req, res) => {
  res.render("book/booking");
});

// Devil pics
app.get("/devil", (req, res) => {
  res.render("devil");
});

// Reserve Route
app.get("/reserve", (req, res) => {
  res.render("reserve");
});

// Feedback Route
app.get("/feedback", (req, res) => {
  res.render("feedback");
});

// Post Feedback Form
app.post("/feedbacksubmit", (req, res) => {
  let errors = [];

  if (!req.body.title || req.body.title.length < 5) {
    errors.push({ text: "Please key in more then 5 alphabet for your Title" });
  }
  if (!req.body.details || req.body.details.length < 5) {
    errors.push({ text: "Please add more details" });
  }
  if (errors.length > 0) {
    res.render("feedback", {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
  } else {
    const newUser = {
      title: req.body.title,
      details: req.body.details
    };
    new Book(newUser).save().then(idea => {
      res.redirect("/feedbacksubmit");
    });
  }
});

const port = 4000;

app.listen(port, () => {
  console.log(`Server started on ${port}`);
});
