const service = require('../service/split-payment.service');

module.exports = {

  'service': service ,

  'compute': function (req, res, next) {
    var split = {
    "ID": 1308,
    "Amount": 12580,
    "Currency": "NGN",
    "CustomerEmail": "anon8@customers.io",
    "SplitInfo": [
        {
            "SplitType": "FLAT",
            "SplitValue": 45,
            "SplitEntityId": "LNPYACC0019"
        },
        {
            "SplitType": "RATIO",
            "SplitValue": 3,
            "SplitEntityId": "LNPYACC0011"
        },
        {
            "SplitType": "PERCENTAGE",
            "SplitValue": 3,
            "SplitEntityId": "LNPYACC0015"
        }
      ]
    };

    let results = module.exports.service.processTransaction(req.body);
    res.status(200).send(results);
  }
}
