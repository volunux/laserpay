const express = require('express');
const router = express.Router();
const splitPaymentRouter = require('./split-payment.router');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('Welcome to Laser Pay Transaction payment splitting service (TPSS)');
});

module.exports = router;
