  function getWholeNumberOrFloat(wholeNum) {
    return (wholeNum % 1) != 0 ? Number.parseFloat(wholeNum.toFixed(2)) : wholeNum;
  }

module.exports = {

  'processTransaction' : function(splitPayment) {
    let trackers = [];
    let splitBreakdown = [];
    let ratio = 0;
    let ratioTracker = true;
    let ratioBalance = 0;
    let lTracker = 0;

    for (let i = 0, infos = splitPayment.SplitInfo; i < infos.length; i++) {
        let entity = {
           "SplitEntityId" : infos[i].SplitEntityId,
           "Amount" : infos[i].SplitValue
        };

        let splitValue = infos[i].SplitValue;
        let splitType = infos[i].SplitType;
        let actualVal = 0;

        if (splitType === 'FLAT' && lTracker === 0) {
            actualVal = splitValue;
            entity.Amount = actualVal;
            splitBreakdown.push(entity);
            splitPayment.Amount -= actualVal;
        }
        else if (splitType === 'PERCENTAGE' && lTracker === 1) {
            actualVal = (splitValue / 100) * splitPayment.Amount;
            entity.Amount = actualVal;
            splitBreakdown.push(entity);
            splitPayment.Amount -= actualVal;
        }
        else if (splitType === 'RATIO') {
            if (ratioTracker) { ratio += splitValue; }
            else if (lTracker === 2) {
                if (ratioBalance === 0) { ratioBalance = splitPayment.Amount; }
                actualVal = (splitValue / ratio) * ratioBalance;
                entity.Amount = actualVal;
                splitBreakdown.push(entity);
                splitPayment.Amount -= actualVal;
             }
        }

        if ((i + 1) === infos.length) {
            if (ratioTracker) { ratioTracker = false; }
            ++lTracker;
            if (lTracker < 3) { i = 0; }
        }

      }

      if (splitPayment.Amount < 0) splitPayment.Amount = 0;

      return { 
        "ID" : splitPayment.ID,
        "Balance": splitPayment.Amount,
        "SplitBreakdown": splitBreakdown
      };
  }
}