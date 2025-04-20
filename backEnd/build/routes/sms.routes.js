"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = require("express");
var _smsController = require("../controllers/sms.controller.js");
// ✅ Importación correcta

var router = (0, _express.Router)();
router.post('/', _smsController.sendSMS); // ✅ Llamada a la función correctamente
var _default = exports["default"] = router;