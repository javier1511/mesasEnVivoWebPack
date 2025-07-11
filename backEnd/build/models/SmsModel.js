"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _mongoose = require("mongoose");
var smsSchema = new _mongoose.Schema({
  numbers: {
    type: [String],
    // ✅ Un array de strings
    required: true
  },
  message: {
    type: String,
    // ✅ Un string
    required: true
  }
});
var _default = exports["default"] = (0, _mongoose.model)("Sms", smsSchema);