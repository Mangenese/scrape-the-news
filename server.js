
// Require our dependecies 
var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");

//Scraping tools
var axios = require("axios");
var cheerio = require("cheerio");

//Declare our models folder
var db = require("./models");

var PORT = process.env.PORT || 4000;

var app = express();


app.use(logger("dev"));

//Request as a JSON format
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

app.engine("handlebars", exphbs({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");


//Routes

app.get("/scrape", function (req, res) {

    axios.get("http://www.bioethics.net/news").then(function (response) {

        var $ = cheerio.load(response.data);

        $("h5").each(function (i, element) {

            var result = {};

            result.title = $(this)
                .children("a")
                .text();
            result.link = $(this)
                .children("a")
                .attr("href");

            db.Article.create(result)
                .then(function (dbArticle) {

                    console.log(dbArticle);
                })
                .catch(function (err) {
                    console.log(err);
                });
        });
        res.send("Scrape Complete!");
    });
});

app.get("/articles", function(req, res) {

    db.Article.find()

    .then(function(dbPopulate) {

        res.json(dbPopulate);
    })
    .catch(function(err) {
        res.json(err);
      });
});

app.get("/articles/:id", function(req, res) {
    db.Article.findById(req.params.id)
    .populate("note")
    .then(function(dbPopulate) {
        es.json(dbPopulate);
  })
  .catch(function(err) {
    res.json(err);
});
});

app.get("/note", function(req, res) {

    db.Note.find()

    .then(function(dbPopulate) {

        res.json(dbPopulate);
    })
    .catch(function(err) {
        res.json(err);
      });
});

app.post("/articles/:id", function(req, res) {

    db.Note.create(req.body)
    .then(function(dbPopulate) {
      
      return db.Article.findOneAndUpdate({_id: req.params.id}, { $push: { note: dbPopulate._id } }, { new: true });
    })
    .then(function(dbPopulate) {
        res.json(dbPopulate);
    })
    .catch(function(err) {
        res.json(err);
    });
});

mongoose.connect(process.env.MONGODB_URI ||"mongodb://Mangenese:Maki1996!@ds125479.mlab.com:25479/heroku_fvrhmhr1" );

app.listen(PORT, function() {
    console.log("App running on port " + PORT );
  });
  // testing