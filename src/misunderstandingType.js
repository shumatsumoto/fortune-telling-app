// misunderstandingType.js - 勘違い診断の計算と表示を担当するファイル

// 月星座ごとの勘違いタイプ定義
const misunderstandingTypes = {
    '牡羊座': {
        type: 'できるタイプ',
        description: '自分がなんにつけてできる、カッコいいタイプだと思っている',
        reality: '自己像や自我像を持つ必要がない。できる/できないは関係ない。'
    },
    '牡牛座': {
        type: '自称HSPタイプ',
        description: '五感が敏感で、第六感のような能力も持っていると思っている',
        reality: '空気を読めない。複雑な味や風味の良さが分からない。'
    },
    '双子座': {
        type: '知的タイプ',
        description: '頭が良い、知的レベルが高いと思っている',
        reality: '知性が強みや魅力ではない。正解や答えを出す機能がない。'
    },
    '蟹座': {
        type: '優しいタイプ',
        description: '人の気持ちがよくわかる、優しいタイプだと思っている',
        reality: '実際は言葉で表現されていない感情を理解するのが苦手。'
    },
    '獅子座': {
        type: '人事エキスパートタイプ',
        description: '人の自我をうまくコントロールできる「人事エキスパート」だと思っている',
        reality: '人を見る目はない。人間関係を扱う能力はない。'
    },
    '乙女座': {
        type: '開けっぱなし症候群',
        description: '効率的に物事をこなし、マルチタスクができると思っている',
        reality: '最後が終わっていない。どこかしら開けっぱなし。クロージングが苦手。'
    },
    '天秤座': {
        type: '公平タイプ',
        description: '公平、平等、冷静に物事を判断できると思っている',
        reality: '実際は好き嫌いが激しい。ジャッジするのが好き。'
    },
    '蠍座': {
        type: '違和感センサータイプ',
        description: '疑いを持って物事を見ることで真実に近づけると思っている',
        reality: '疑いを基に出した答えは間違っていることが多い。些細なことを重大に捉えすぎる。'
    },
    '射手座': {
        type: '社会貢献タイプ',
        description: '自分の意識が大きく広がっていると感じている',
        reality: '社会的な善や正義は建前。実際は自分の好き嫌いや損得で判断している。'
    },
    '山羊座': {
        type: '仕事人間タイプ',
        description: '仕事ができる、仕事が好きだと思っている「仕事人間」タイプ',
        reality: '実際は仕事ができない。仕事が嫌い。むしろ物事を壊してしまう可能性がある。'
    },
    '水瓶座': {
        type: 'ユニークタイプ',
        description: '独自性やユニークさを持っていると思っている',
        reality: '独自性や変わった見方の機能はない。人並みの能力しかない。'
    },
    '魚座': {
        type: 'マザー・テレサタイプ',
        description: '世の中のすべての人に寄り添える、慈悲深い人間だと思っている',
        reality: '実際には簡単に人を切り捨てたりする。弱者や困っている人よりも、成功している人の方が好きな可能性がある。'
    }
};

// 月星座から勘違いタイプを取得
function getMisunderstandingType(moonSign) {
    return misunderstandingTypes[moonSign] || {
        type: '不明',
        description: '月星座を正確に入力してください',
        reality: '不明'
    };
}

// 勘違いタイプの結果表示（階層構造版）
function displayMisunderstandingResult(result, misunderstandingResultElement) {
    // 結果表示用のHTML
    let html = `
        <div class="misunderstanding-hierarchy">
            <!-- メインとなる「勘違いタイプ」 -->
            <div class="misunderstanding-main">
                <h4 class="result-title mb-2">あなたの勘違いタイプ</h4>
                <div class="highlight">${result.type}</div>
                <p class="text-gray-700 mb-2">${result.description}</p>
            </div>
            
            <!-- 関連する要素 -->
            <div class="misunderstanding-elements">
                <!-- 実際の状態 -->
                <div class="misunderstanding-element">
                    <div class="misunderstanding-title">実際の状態</div>
                    <p class="text-gray-700">${result.reality}</p>
                </div>
                
                <!-- アドバイス -->
                <div class="misunderstanding-element">
                    <div class="misunderstanding-title">ポイント</div>
                    <p class="text-sm text-purple-600">勘違いを知ると、それだけで外れるのが特徴です。あなたが苦手なことはやらなくて大丈夫です。</p>
                </div>
            </div>
        </div>
    `;

    misunderstandingResultElement.innerHTML = html;
}

// エクスポート
window.MisunderstandingTypeCalculator = {
    getMisunderstandingType,
    displayMisunderstandingResult
};