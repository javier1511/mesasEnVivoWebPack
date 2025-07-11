"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = require("express");
var _smsController = require("../controllers/sms.controller.js");
var _middlewares = require("../middlewares");
// ✅ Importación correcta

var router = (0, _express.Router)();
router.post('/', [_middlewares.authJwt.verifyToken, _middlewares.authJwt.isAdmin], _smsController.sendSMS); // ✅ Llamada a la función correctamente
var _default = exports["default"] = router;