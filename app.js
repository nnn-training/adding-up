'use strict';
const fs = require('fs');
const readline = require('readline');
const rs = fs.createReadStream('./popu-pref.csv');
const rl = readline.createInterface({ input: rs, output: {} });
const prefectureDataMap = new Map(); // key: 都道府県 value: 集計データのオブジェクト
 //ファイルを行単位で処理する
rl.on('line', lineString => {
    //列別のデータに分別
  const columns = lineString.split(',');
  const year = parseInt(columns[0]); //年
  const prefecture = columns[1]; //都道府県
  const popu = parseInt(columns[3]);  //人口(15~19歳の人口)
  //2010年または2015年のデータのみ処理する
  if (year === 2010 || year === 2015) {
    let value = null;
    if (prefectureDataMap.has(prefecture)) {
      value = prefectureDataMap.get(prefecture);
    } else {
      value = {
        popu10: 0,
        popu15: 0,
        change: null
      };
    }
    if (year === 2010) {
      value.popu10 = popu;
    }
    if (year === 2015) {
      value.popu15 = popu;
    }
    //都道府県をキーにしてデータを登録
    prefectureDataMap.set(prefecture, value);
  }
});
  //ファイルの読み込み終了時に処理したいコードを書く
rl.on('close', () => {
    for (const [key, value] of prefectureDataMap) {
        value.change = value.popu15 / value.popu10;
    }
      //ランキング化(並べ替えられた)したデータ
    const  rankingArray = Array.from(prefectureDataMap)
    .sort((pair1, pair2) => {
        return pair1[1].change - pair2[1].change;
    }
    );
    //データを表示用に整形する
    const rankingStrings = rankingArray.map(([key, value], i) => {
      //一行ずつどのように整形するかルールを決める
        return (
          `${i + 1}位 ${key}: ${value.popu10}=>${value.popu15} 変化率: ${value.change}`
        );
      });
      console.log(rankingStrings);
    });