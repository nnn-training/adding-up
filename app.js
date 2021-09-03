'use strict';
const fs = require('fs');
const csv = require('csv-parser')
const prefectureDataMap = {}; // key: 都道府県 value: 集計データのオブジェクト
fs.createReadStream('./popu-pref.csv')
.pipe(csv())
.on('data', (data) => {
    // 都道府県のオブジェクトが用意されてなかったら空のオブジェクトを用意
    if (prefectureDataMap[data['都道府県名']] === undefined) {
        prefectureDataMap[data['都道府県名']] = {}
    }
    prefectureDataMap[data['都道府県名']][data['集計年']] = data['15〜19歳の人口'];
})
.on('end', () => {
    for (const prefecture in prefectureDataMap) {
        prefectureDataMap[prefecture].change = prefectureDataMap[prefecture]["2015"] / prefectureDataMap[prefecture]["2010"];
    }
    const rankingArray = Object.entries(prefectureDataMap).sort((pair1, pair2) => {
        return pair2[1].change - pair1[1].change;
    });
    const rankingStrings = rankingArray.map(([key, value]) => {
        return (
            key +
            ': ' +
            value["2010"] +
            '=>' +
            value["2015"] +
            ' 変化率:' +
            value.change
        );
    });
    console.log(rankingStrings);
});