// manifestType.js - 顕在個性の計算と表示を担当するファイル

// 顕在個性の名称とキーワード定義
const manifestTypes = {
    1: {
        name: '創造（自信）',
        keywords: '想像力、エネルギー、存在感',
        features: [
            '何かを生み出す能力が高い',
            'エネルギーが強く、存在感がある',
            '独創的で常識にとらわれない',
            '自己満足の自信が重要'
        ]
    },
    2: {
        name: '人間関係（バランス）',
        keywords: '協力、貢献、奉仕',
        features: [
            '人との関わりを通じて自分の良さを発揮する',
            '協力や貢献の意識が高い',
            '他者との境界があいまいで、距離感がつかみにくい',
            'サポート役が向いている',
            'パートナーや仲間と共に活動するのが得意'
        ]
    },
    3: {
        name: '感情、感性（表現）',
        keywords: '豊かな感性、表現力',
        features: [
            '感情や感性が豊か',
            '気持ちが言葉や行動に乗りやすい',
            '芸術的な活動に向いている',
            '素直な感情表現が重要',
            '相手の感情を揺さぶる能力がある'
        ]
    },
    4: {
        name: '安心安定と家庭',
        keywords: '安定、安全、基礎、基盤、土台、家族、柔軟性、意欲',
        features: [
            'コツコツ型',
            'プロセス重視',
            '両極端な傾向がある',
            '家庭やプロセスを大事にする',
            '2つの異なる傾向を持ち合わせている'
        ]
    },
    5: {
        name: '自由（学び）',
        keywords: '探究、冒険、学習、経験、内面の自由',
        features: [
            '探究者、冒険者',
            '学習能力が高い',
            '頭の回転が早い',
            '感覚的な鋭敏さがある',
            '自由を探究し、追い求め、謳歌しながら生きる'
        ]
    },
    6: {
        name: '理想、格好、満足',
        keywords: '完璧、理想、現実、満足',
        features: [
            '高い理想を持つ',
            '完璧主義傾向',
            '地に足がついた理想家',
            '理想と現実の接点を見つける',
            '理想を通じて世の中を導くために生まれた人たち'
        ]
    },
    7: {
        name: '信頼・委任',
        keywords: '大いなる存在、内面の美しさ、深い世界',
        features: [
            '自分と他者、自分と人生を信頼し、内面の美しさを世の中に分け与える',
            '精神の深い世界で動殺力と知恵を持つ',
            '周囲に分け与える',
            '敵とされるものにも知恵や美しさがあると知っている'
        ]
    },
    8: {
        name: '豊かさ・需要',
        keywords: '受け入れる、分け与える、力',
        features: [
            '豊かさや力を手に入れて世の中に役立てる',
            '博愛主義の傾向がある',
            '自然に集まる富や名声を世のために役立てる',
            '寛大さを持ち、人に分け与えることを意識する'
        ]
    },
    9: {
        name: '高尚・叡智',
        keywords: '知恵、高いレベル、非人間的',
        features: [
            '溢れ出る知恵に従い、豪傑な人生を送る',
            '他の人を導く',
            '理屈や勉強を超えた知恵を使って生きる',
            '生き方そのものが人を導く'
        ]
    },
    0: {
        name: '霊感・異質な力',
        keywords: '特殊能力、見える、聞こえる',
        features: [
            '一般的な人とは異なる潜在的な力を持つ',
            '見える、聞こえる、わかる、感じるなどの能力がある',
            '表現力も高い'
        ]
    }
};

// 生年月日から顕在個性タイプを計算
function calculateManifestType(year, month, day) {
    // 生年月日の各桁を足す
    const digits = (year.toString() + month.toString().padStart(2, '0') + day.toString().padStart(2, '0'))
        .split('')
        .map(Number)
        .reduce((sum, digit) => sum + digit, 0);
    
    // 2桁の場合はさらに足す
    let finalSum = digits;
    if (finalSum >= 10) {
        finalSum = Math.floor(finalSum / 10) + (finalSum % 10);
    }
    
    // サブテーマの計算
    const subTheme1 = digits % 10; // 1の位
    const subTheme2 = Math.floor(digits / 10); // 10の位
    
    return {
        mainType: finalSum,
        subType1: subTheme1,
        subType2: subTheme2
    };
}

// 顕在個性の結果表示
function displayManifestResult(result, manifestResultElement) {
    // 結果表示用のHTML
    let html = '';
    
    // メインテーマ
    const mainType = manifestTypes[result.mainType] || manifestTypes[9]; // 11や12の場合は9として処理
    html += `
        <div class="mb-4">
            <h4 class="result-title mb-2">メインテーマ</h4>
            <div class="highlight">${mainType.name}</div>
            <p class="text-gray-700">${mainType.keywords}</p>
            <ul class="feature-list mt-2">
                ${mainType.features.map(feature => `<li>${feature}</li>`).slice(0, 3).join('')}
            </ul>
        </div>
    `;
    
    // サブテーマ1
    if (result.subType1 !== 0) {
        const subType1 = manifestTypes[result.subType1];
        html += `
            <div class="mb-4">
                <h4 class="result-title mb-2">サブテーマ1</h4>
                <div class="highlight">${subType1.name}</div>
                <p class="text-gray-700">${subType1.keywords}</p>
            </div>
        `;
    }
    
    // サブテーマ2
    if (result.subType2 !== 0) {
        const subType2 = manifestTypes[result.subType2];
        html += `
            <div>
                <h4 class="result-title mb-2">サブテーマ2</h4>
                <div class="highlight">${subType2.name}</div>
                <p class="text-gray-700">${subType2.keywords}</p>
                <p class="text-sm text-purple-600 mt-2">※メインテーマを動かすには、小さな歯車（サブテーマ2）を動かすことが大切です</p>
            </div>
        `;
    }
    
    manifestResultElement.innerHTML = html;
}

// エクスポート
window.ManifestTypeCalculator = {
    calculateManifestType,
    displayManifestResult
};
