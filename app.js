'use strict';
// ファイルを扱うためのモジュール
const fs = require('fs');

// ファイルを一行ずつ読み込むためのモジュール
const readline = require('readline');

// ファイルの読み込みを行うためのモジュール
const rs = fs.createReadStream('./popu-pref.csv');

// readlineオブジェクトのinputを行うオブジェクト
const rl = readline.createInterface({input: rs, output: {}});

// key: 都道府県 value: 集計データの連想配列
const prefectureDataMap = new Map();

// rlオブジェクトでlineイベントが発生したときに実行される無名関数
rl.on('line', lineString => {
    // 文字列をカンマで分割して、配列にする
    const columns = lineString.split(',');

    // 集計年、都道府県、15歳～19歳の人口をそれぞれ変数に代入
    const year = parseInt(columns[0]); // 文字列を整数値に変換
    const prefecture = columns[1]; 
    const popu = parseInt(columns[3]); // 文字列を整数値に変換

    // 2010年、または2015年のデータのみ集計
    if (year === 2010 || year === 2015) {
        // データを取得
        let value = prefectureDataMap.get(prefecture);
        if (!value) {
            value = {
                popu10: 0, // 2010年の人口
                popu15: 0, // 2015年の人口
                change: null // 変化率
            };
        }

        // 人口のデータを保存
        if (year === 2010) { value.popu10 = popu; }
        if (year === 2015) { value.popu15 = popu; }

        prefectureDataMap.set(prefecture, value);
    }
});

// すべての処理が終了したときに呼び出される
rl.on('close', () => {
    // 変化率を計算する
    for (const [key, value] of prefectureDataMap) {
        value.change = value.popu15 / value.popu10;
    }

    // 変化率ごとに並べ替える
    const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) => {
        return pair2[1].change - pair1[1].change;
    });

    // 綺麗に整形する
    const rankingStrings = rankingArray.map(([key, value]) => {
        return (
            key + ': ' + value.popu10 + '=>' + value.popu15 + ' 変化率:' + value.change
        );
    })

    console.log(rankingStrings);
});