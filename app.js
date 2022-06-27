'use strict';
const fs = require('fs');
const readline = require('readline');
const rs = fs.createReadStream('./popu-pref.csv');
const rl = readline.createInterface({ input: rs });
const prefDataMap = new Map();
rl.on('line', (lineString) => {
  const columns = lineString.split(',');
  const year = parseInt(columns[0]);
  const pref = columns[1];
  const popu = parseInt(columns[3]);
  if (year === 2010 || year === 2015) {
    let value = null;
    if (prefDataMap.has(pref)) {
      value = prefDataMap.get(pref);
    } else {
      value = {
        popu10: 0,
        popu15: 0,
        change: null,
      };
    }
    if (year === 2010) {
      value.popu10 = popu;
    }
    if (year === 2015) {
      value.popu15 = popu;
    }
    prefDataMap.set(pref, value);
  }
});

rl.on('close', () => {
  for (const [key, value] of prefDataMap) {
    value.change = value.popu15 / value.popu10;
  }
  //Array.from( )でMapを配列に変換
  const rankingArr = Array.from(prefDataMap).sort((pair1, pair2) => {
    //降順に並び変える
    return pair2[1].change - pair1[1].change;
  });
  const rankingStrings = rankingArr.map(([key, value]) => {
    return `${key}: ${value.popu10}=>${value.popu15}　変化率: ${value.change}`;
  });
  console.log(rankingStrings);
});
