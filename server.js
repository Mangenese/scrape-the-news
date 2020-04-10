
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

var PORT = process.env.PORT || 3000;

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


