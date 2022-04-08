// This directory contains general utilities that you can use as helper functions throughout other scripts
// Coin flip functions
module.exports = {
  coinFlip: () => {
    let flip = Math.random();
    let result = "";
    if (flip < 0.5) {
      result = "heads";
    } else {
      result = "tails";
    }
    return result;
  },

  coinFlips: (flips) => {
    var arr = [];
    for (let x = 0; x < flips; x++) {
      let coin = module.exports.coinFlip();
      arr.push(coin);
    }
    return arr;
  },

  countFlips: (array) => {
    let heads = 0;
    let tails = 0;
    let counter = { heads, tails };
    let counterHeads = { heads };
    let counterTails = { tails };
    for (let x = 0; x < array.length; x++) {
      if (array[x] == "heads") {
        heads++;
      } else {
        tails++;
      }
    }
    if (heads > 0 && tails > 0) {
      counter.heads = heads;
      counter.tails = tails;
      return counter;
    } else if (heads > 0 && tails == 0) {
      counterHeads.heads = heads;
      return counterHeads;
    } else {
      counterTails.tails = tails;
      return counterTails;
    }
  },

  flipACoin: (call) => {
    if (call == null || call == "") {
      throw "Error: no input";
    }
    if (call == "heads" || call == "tails") {
      let info = { call: call, flip: "", result: "" };
      let coinF = module.exports.coinFlip();
      let result = "";
      if (call == coinF) {
        result = "win";
      } else {
        result = "lose";
      }
      info.flip = coinF;
      info.result = result;
      return info;
    }
    throw "Usage: node guess-flip --call=[heads|tails]";
  },
};
