const service = require('../service/split-payment.service');

module.exports = {

  'service': service ,

  'compute': function (req, res, next) {
    let results = module.exports.service.processTransaction(req.body);
    res.status(200).send(results);
  }
}
