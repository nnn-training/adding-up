//「2010 年から 2015 年にかけて 15〜19 歳の人が増えた割合の都道府県ランキング」

'use strict';

//モジュールの呼び出し（ファイルシステム）
const fs = require('fs');
const readline = require('readline');

//あらかじめイベントが発生したときに実行される関数を設定
const rs = fs.createReadStream('./popu-pref.csv');
const rl = readline.createInterface({ input: rs, output: {} });

// key: 都道府県 value: 集計データのオブジェクト　ここで作る
const prefectureDataMap = new Map();

//rl オブジェクトで line というイベントが発生したら この無名関数を呼ぶ
rl.on('line', lineString => {
    //引数 lineString で与えられた文字列をカンマ , で分割して、それを columns という名前の配列にしている
    const columns = lineString.split(',');

    //parseInt:文字列を整数値に変換する関数 配列を変数に入れる
    const year = parseInt(columns[0]);
    const prefecture = columns[1];
    const popu = parseInt(columns[3]);


    if (year === 2010 || year === 2015) {

        //prefectureDataMapオブジェクトから都道府県を取り出し
        let value = prefectureDataMap.get(prefecture);
        //value の値が Falsy の場合に、value に初期値となるオブジェクトを代入
        if (!value) {
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
        prefectureDataMap.set(prefecture, value);
    }
});

//全ての行を読み込み終わった際に呼び出される
rl.on('close', () => {
    //prefectureDataMapの配列の数分だけ回す
    for (const [key, value] of prefectureDataMap) {
        //変化率の計算
        value.change = value.popu15 / value.popu10;
    }
    const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) => {
        return pair2[1].change - pair1[1].change;
        
    });

    //map関数　配列の値全部に適用させる綺麗に出力するため
    const rankingStrings = rankingArray.map(([key, value]) => {
        return (
            key +
            ': ' +
            value.popu10 +
            '=>' +
            value.popu15 +
            ' 変化率:' +
            value.change
        );
    });
    console.log(rankingStrings);

});