"use strict";

var _mongoose = _interopRequireDefault(require("mongoose"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
_mongoose["default"].connect("mongodb+srv://admin1:diamante1@cluster0.pb3n1pj.mongodb.net/mesasenvivo").then(function () {
  return console.log("Database is connected");
})["catch"](function (error) {
  return console.error("Connection error:", error);
});