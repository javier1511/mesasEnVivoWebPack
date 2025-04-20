"use strict";

var _app = _interopRequireDefault(require("./app"));
require("./database");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
console.log('Server listen on port', 4000);
_app["default"].listen(4000);