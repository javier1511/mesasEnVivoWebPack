"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = _interopRequireDefault(require("express"));
var _morgan = _interopRequireDefault(require("morgan"));
var _initialSetup = require("./libs/initialSetup");
var _players = _interopRequireDefault(require("./routes/players.routes"));
var _sales = _interopRequireDefault(require("./routes/sales.routes"));
var _auth = _interopRequireDefault(require("./routes/auth.routes"));
var _sms = _interopRequireDefault(require("./routes/sms.routes"));
var _countPlayersByDate = _interopRequireDefault(require("./routes/countPlayersByDate.routes"));
var _dailyReportByDate = _interopRequireDefault(require("./routes/dailyReportByDate"));
var _dailyUserReportByDate = _interopRequireDefault(require("./routes/dailyUserReportByDate"));
var _poker = _interopRequireDefault(require("./routes/poker.routes"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var cors = require('cors');
var app = (0, _express["default"])();
(0, _initialSetup.createRoles)();
console.log("👉 Verificando importación de createRoles:");
console.log(_initialSetup.createRoles);
app.use((0, _morgan["default"])('dev'));
app.use(_express["default"].json());
app.use(cors());
app.get('/', function (req, res) {
  res.json("Diamante Mesas En Vivo");
});
app.use('/players', _players["default"]);
app.use('/sales', _sales["default"]);
app.use('/auth', _auth["default"]);
app.use('/sendsms', _sms["default"]);
app.use('/countplayers', _countPlayersByDate["default"]);
app.use('/dailyreport', _dailyReportByDate["default"]);
app.use('/dailyreportusers', _dailyUserReportByDate["default"]);
app.use('/poker', _poker["default"]);
var _default = exports["default"] = app;