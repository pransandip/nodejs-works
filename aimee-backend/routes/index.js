const express = require("express");

var indexRouter = require("../routes/index");
var users = require("../routes/users");
var enquiries = require("../routes/enquiries");

module.exports = function(app) {
  app.use(express.json());

  app.use("/", indexRouter);
  app.use("/users", users);
  app.use("/enquiries", enquiries);
};