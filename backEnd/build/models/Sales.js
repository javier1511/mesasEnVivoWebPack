"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _mongoose = require("mongoose");
var saleSchema = new _mongoose.Schema({
  player: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: 'Player'
  },
  cashIn: {
    type: Number
  },
  cash: {
    type: Number
  },
  name: {
    type: String,
    minLength: 1,
    maxLength: 30
  },
  credit: {
    type: Number
  },
  dollars: {
    type: Number
  },
  payment: {
    type: Number
  },
  date: {
    type: Date
  },
  time: {
    type: String
  }
});
var _default = exports["default"] = (0, _mongoose.model)("Sale", saleSchema);