"use strict";

var _app = _interopRequireDefault(require("./app"));
require("./database");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var PORT = parseInt(process.env.PORT, 10) || 4000;
_app["default"].listen(PORT, function () {
  console.log('Server listening on port', PORT);
});