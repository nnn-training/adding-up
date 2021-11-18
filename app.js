'use strict';
const fs = require('fs');
const readline = require('readline');

const rs = fs.createReadStream('./popu-pref.csv');
const rl = readline.createInterface({ input: rs, output: {}});
const prefDataMap = new Map(); // key: 都道府県 value: 集計データのオブジェクト
rl.on('line', lineString => {
    const cols = lineString.split(',');

    const year = parseInt(cols[0]);
    const pref = cols[1];
    const lowteen = cols[2];
    const highteen = parseInt(cols[3]);
    
    if (year <= 2015 || year >= 2010) {
        let val = prefDataMap.get(pref);
        if (!val) {
            val = {
                pop10: 0,
                pop15: 0,
                change: null
            };
        }
        if (year == 2010) {
            val.pop10 = highteen;
        }
        if (year == 2015) {
            val.pop15 = highteen;
        }
        prefDataMap.set(pref, val);
    }
});

rl.on('close', () => {
    for (const [key, val] of prefDataMap) {
            val.change = val.pop15 / val.pop10;
    }
    const changeOrderArray = Array.from(prefDataMap).sort((pref1, pref2) => {
        return pref2[1].change - pref1[1].change;
    });
    const rankingStrings = changeOrderArray.map(([key, value]) => {
        return (
            key +
            ': ' +
            value.pop10 +
            '=>' +
            value.pop15 +
            ' 変化率:' +
            value.change
        );
    });
    console.log(rankingStrings);
})