  function getWholeNumberOrFloat(wholeNum) {
    return (wholeNum % 1) != 0 ? Number.parseFloat(wholeNum.toFixed(2)) : wholeNum;
  }

module.exports = {

  'processTransaction' : function(splitPayment) {
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

        if (splitType === 'FLAT' && lTracker === 0) {
            entity.Amount = splitValue;
            splitBreakdown.push(entity);
            splitPayment.Amount -= entity.Amount;
        }
        else if (splitType === 'PERCENTAGE' && lTracker === 1) {
            entity.Amount = (splitValue / 100) * splitPayment.Amount;
            splitBreakdown.push(entity);
            splitPayment.Amount -= entity.Amount;
        }
        else if (splitType === 'RATIO') {
            if (ratioTracker) { ratio += splitValue; }
            else if (lTracker === 2) {
                if (ratioBalance === 0) { ratioBalance = splitPayment.Amount; }
                entity.Amount = (splitValue / ratio) * ratioBalance;
                splitBreakdown.push(entity);
                splitPayment.Amount -= entity.Amount;
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