"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _mongoose = require("mongoose");
var salesPokerSchema = new _mongoose.Schema({
  player: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: 'Player'
  },
  cash: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    minLength: 1,
    maxLength: 30
  },
  credit: {
    type: Number,
    required: true
  },
  dollars: {
    type: Number,
    required: true
  },
  rake: {
    type: Number,
    required: true
  },
  payment: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  }
});
var _default = exports["default"] = (0, _mongoose.model)('SalePoker', salesPokerSchema);