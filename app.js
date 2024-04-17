'use strict';
'use strict';
const fs = require('node:fs');
const readline = require('node:readline');
const rs = fs.createReadStream('./popu-pref.csv');
const rl = readline.createInterface({ input: rs });
const prefectureDataMap = new Map(); //key: 都道府県 value: 集計データオブジェクト
rl.on('line', lineString => {
  const columns = lineString.split(',');
  const year = parseInt(columns[0]);
  const prefecture = columns[1];
  const popu = parseInt(columns[3]);
  if (year === 2016 || year == 2021){
    let value = null;
    if (prefectureDataMap.has(prefecture)){
      value = prefectureDataMap.get(prefecture);
    } else {
      value = {
        before: 0,
        after: 0,
        change: null,
        rank: null
      }
    }
    if (year === 2016){
      value.before = popu;
    }
    if (year === 2021){
      value.after = popu;
    }
    prefectureDataMap.set(prefecture, value);
  }
})
rl.on('close', lineString => {
  for (const [key,value] of prefectureDataMap) {
    value.change = value.after / value.before;
  }
  const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) => {
    return pair1[1].change - pair2[1].change;
  });
  for (let i=0; i<rankingArray.length; i++) {
    if(i === 0){
      rankingArray[i][1].rank = 1;  //rankは1位から始める
    }else{
      if (rankingArray[i-1][1].change !== rankingArray[i][1].change){
        rankingArray[i][1].rank = i + 1;  //iは0から始まるため
      }else{
        rankingArray[i][1].rank = rankingArray[i-1][1].rank  //同率の場合は同順位
      }
    }
  }
  const rankingStrings = rankingArray.map(([key, value]) => {
    return `${value.rank}位   ${key}: ${value.before}=>${value.after}   変化率: ${value.change}`;
  })
  console.log(rankingStrings);
});