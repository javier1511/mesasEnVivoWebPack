"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _mongoose = require("mongoose");
var summarySchema = new _mongoose.Schema({
  player: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: 'Player'
  },
  totalCash: {
    type: Number,
    "default": 0
  },
  totalCredit: {
    type: Number,
    "default": 0
  },
  totalDollars: {
    type: Number,
    "default": 0
  },
  totalPayment: {
    type: Number,
    "default": 0
  },
  netwin: {
    type: Number,
    "default": 0
  }
});
var _default = exports["default"] = (0, _mongoose.model)('Summary', summarySchema);