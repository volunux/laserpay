const express = require('express');
const router = express.Router();
const ctrl = require('../controller/split-payment.controller');

router.get('/compute' , ctrl.compute);

module.exports = router;
