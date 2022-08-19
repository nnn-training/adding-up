'use strict';
const fs = require('fs');
const readline = require('readline');
const rs = fs.createReadStream('./popu-pref.csv');
const rl = readline.createInterface({ input: rs });
const prefectureDataMap = new Map(); //key:都道府県 value:集計データのオブジェクト

rl.on('line' , lineString => {
    const columns = lineString.split(',');
    const year = parseInt(columns[0]);
    const prefecture = columns[1];
    const popu = parseInt(columns[3]);
    if (year === 2010 || year === 2015){
        let value = null;
        //既に都道府県の集計データオブジェクトが存在する場合、それを取得する
        if (prefectureDataMap.has(prefecture)){
            value = prefectureDataMap.get(prefecture);
        }else{ //存在しない場合、初期値を代入する
            value = {
                popu10: 0, //2010年の人口
                popu15: 0, //2015年の人口
                change: null //人口の変化率
            };
        }
        if (year === 2010){
            value.popu10 = popu;
        }
        if (year === 2015){
            value.popu15 = popu;
        }
        prefectureDataMap.set(prefecture, value);
    }
});
// 全ての行を読み込み終わった際に呼び出される
rl.on('close', () => {　
    for (const [key, value] of prefectureDataMap){
        value.change = value.popu15 /value.popu10; //人口変化率の計算
    }
    const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) =>{ //Array.from()メソッド：配列に似た型のものを普通の配列に変換する
        return pair2[1].change - pair1[1].change; //pair1,2：0番目に都道府県名、1番目に集計データオブジェクトが入った配列
    });
    const rankingStrings = rankingArray.map(([key,value]) => {
        return `${key}: ${value.popu10}=>${value.popu15} 変化率： ${value.change}`;
    });
    console.log(rankingStrings);
});