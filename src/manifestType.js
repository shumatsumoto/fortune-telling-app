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
        ],
        challenges: [
            '他者評価を求めすぎないこと',
            '自己満足の自信を大切にすること',
            'エネルギーの発散方法を見つけること'
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
        ],
        challenges: [
            '過干渉や過剰な貢献を避けること',
            '具体的な線引きをすること',
            '自分の気持ちと義務感を区別すること'
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
        ],
        challenges: [
            '感情を押し殺さないこと',
            '過去の否定的な経験にとらわれすぎないこと',
            '小さなことから気持ちを表現する練習をすること'
        ]
    },
    4: {
        name: '安心安定（過程）',
        keywords: '安定、安全、基礎、基盤、土台、家族、柔軟性、意欲',
        features: [
            'コツコツ型',
            'プロセス重視',
            '両極端な傾向がある',
            '過程やプロセスを大事にする',
            '2つの異なる傾向を持ち合わせている'
        ],
        challenges: [
            '小さなことで立ち止まりやすい',
            '極端に無責任になったり過度に干渉したりする',
            '家族関係（特に父親）の問題',
            '柔軟性に欠ける傾向がある',
            'なりゆきまかせになりやすい'
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
        ],
        challenges: [
            '自由を求めるあまり、自分勝手やわがままになる可能性',
            '学びを始めても途中で投げ出しやすい',
            '器用貧乏になりやすい',
            '人に依存しがちになる可能性',
            '自分に甘くなりがち'
        ]
    },
    6: {
        name: '理想、満足',
        keywords: '完璧、理想、現実、満足',
        features: [
            '高い理想を持つ',
            '完璧主義傾向',
            '地に足がついた理想家',
            '理想と現実の接点を見つける',
            '理想を通じて世の中を導くために生まれた人たち'
        ],
        challenges: [
            '理想と現実のギャップに苦しむ',
            '完璧主義による自己否定',
            '「〜すべき」という思考に縛られやすい',
            'ジャッジ傾向がある'
        ]
    },
    7: {
        name: '信頼・委任',
        keywords: '大いなる存在、内面の美しさ、深い世界',
        features: [
            '自分と他者、自分と人生を信頼し、内面の美しさを世の中に分け与える',
            '精神の深い世界で洞察力と知恵を持つ',
            '周囲に分け与える',
            '敵とされるものにも知恵や美しさがあると知っている'
        ],
        challenges: [
            '理論や学問的知識に頼りすぎる',
            '占いやセミナーにハマりやすい',
            '自信たっぷりに見えるが、実は自己防衛反応の表れ'
        ]
    },
    8: {
        name: '豊かさ・受容',
        keywords: '受け入れる、分け与える、力',
        features: [
            '豊かさや力を手に入れて世の中に役立てる',
            '博愛主義の傾向がある',
            '自然に集まる富や名声を世のために役立てる',
            '寛大さを持ち、人に分け与えることを意識する'
        ],
        challenges: [
            '豊かさへの恐れや自己否定',
            '受け取ることが苦手',
            '権力的になったり、弱者を装ったりする'
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
        ],
        challenges: [
            '世間一般の常識と合わない',
            '自分のレベルの高さを受け入れられず、村人と同じように振る舞おうとする'
        ]
    },
    0: {
        name: '霊感・異質な力',
        keywords: '特殊能力、見える、聞こえる、感じる',
        features: [
            '一般的な人とは異なる潜在的な力を持つ',
            '見える、聞こえる、わかる、感じるなどの能力がある',
            '表現力も高い',
            '他の数字と組み合わさるとその個性を霊的に増幅させる'
        ],
        challenges: [
            '自覚しないと変に影響を受けやすい',
            'HSP的になりやすい'
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

    // 特殊ケース11と12の場合はそのまま、それ以外の2桁の場合はさらに足す
    let finalSum = digits;
    if (finalSum >= 10 && finalSum !== 11 && finalSum !== 12) {
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
    // メインテーマを処理
    let mainTypeHTML = '';

    if (result.mainType === 11) {
        // 11の場合: 1が2倍強まる
        const typeOne = manifestTypes[1];
        mainTypeHTML = `
            <div class="highlight">${typeOne.name} <span class="text-red-600 font-bold">×2倍の強さ</span></div>
            <p class="text-gray-700">${typeOne.keywords}</p>
            <p class="text-purple-700 font-semibold mt-2">※1をダブルで持っているため、その特性が2倍強く現れます</p>
            <ul class="feature-list mt-2">
                ${typeOne.features.map(feature => `<li>${feature}</li>`).slice(0, 3).join('')}
            </ul>
        `;
    } else if (result.mainType === 12) {
        // 12の場合: 1と2の両方を持つ
        const typeOne = manifestTypes[1];
        const typeTwo = manifestTypes[2];
        mainTypeHTML = `
            <div class="highlight">
                ${typeOne.name} と ${typeTwo.name} <span class="text-purple-700 font-bold">の両方</span>
            </div>
            <p class="text-gray-700">${typeOne.keywords} および ${typeTwo.keywords}</p>
            <p class="text-purple-700 font-semibold mt-2">※1と2の両方の特性を併せ持っています</p>
            <ul class="feature-list mt-2">
                ${typeOne.features.map(feature => `<li>${feature}</li>`).slice(0, 2).join('')}
                ${typeTwo.features.map(feature => `<li>${feature}</li>`).slice(0, 2).join('')}
            </ul>
        `;
    } else if (result.mainType === 0 || (typeof result.mainType === 'string' && result.mainType.endsWith('0'))) {
        // 0の場合: 霊感・異質な力が加わる
        const typeZero = manifestTypes[0];
        const pairedType = manifestTypes[parseInt(result.mainType.toString()[0]) || 0];

        mainTypeHTML = `
            <div class="highlight">
                ${pairedType ? pairedType.name : ''}
                <span class="text-indigo-600 font-bold"> ＋ 霊感・増幅</span>
            </div>
            <p class="text-gray-700">${pairedType ? pairedType.keywords : ''} および ${typeZero.keywords}</p>
            <p class="text-purple-700 font-semibold mt-2">※霊的資質・潜在能力が加わり、他の特性が増幅されます</p>
            <ul class="feature-list mt-2">
                ${pairedType ? pairedType.features.map(feature => `<li>${feature}</li>`).slice(0, 2).join('') : ''}
                ${typeZero.features.map(feature => `<li>${feature}</li>`).slice(0, 2).join('')}
            </ul>
        `;
    } else {
        // 通常ケース
        const mainType = manifestTypes[result.mainType] || manifestTypes[9]; // 他の特殊な数字の場合は9として処理
        mainTypeHTML = `
            <div class="highlight">${mainType.name}</div>
            <p class="text-gray-700">${mainType.keywords}</p>
            <ul class="feature-list mt-2">
                ${mainType.features.map(feature => `<li>${feature}</li>`).slice(0, 3).join('')}
            </ul>
        `;
    }

    // サブテーマの処理
    let subThemesHTML = '';

    // ゼロが含まれるかチェック
    const hasZero = result.subType1 === 0 || result.subType2 === 0;

    if (hasZero) {
        // ゼロが含まれる場合は1つのサブテーマとして表示
        const nonZeroType = result.subType1 === 0 ? result.subType2 : result.subType1;
        const nonZeroTypeData = manifestTypes[nonZeroType];
        const zeroTypeData = manifestTypes[0];

        if (nonZeroTypeData) {
            subThemesHTML = `
                <div class="manifest-sub">
                    <div class="sub-title">サブテーマ</div>
                    <div class="highlight">
                        ${nonZeroTypeData.name}
                        <span class="text-indigo-600 font-bold"> ＋ 霊感・増幅</span>
                    </div>
                    <p class="text-gray-700">${nonZeroTypeData.keywords} および ${zeroTypeData.keywords}</p>
                    <p class="text-sm text-purple-600 mt-2">※霊的資質（0）により、このサブテーマの性質が増幅されています</p>
                    <p class="text-sm text-purple-600 mt-1">※メインテーマを動かすには、このサブテーマを意識することが大切です</p>
                </div>
            `;
        }
    } else {
        // 通常のサブテーマ表示（ゼロなし）
        // サブテーマ1
        const subTypeOne = manifestTypes[result.subType1];
        const subTypeOneHTML = result.subType1 !== 0 ? `
            <div class="manifest-sub">
                <div class="sub-title">サブテーマ1</div>
                <div class="highlight">${subTypeOne.name}</div>
                <p class="text-gray-700">${subTypeOne.keywords}</p>
            </div>
        ` : '';

        // サブテーマ2
        const subTypeTwo = manifestTypes[result.subType2];
        const subTypeTwoHTML = result.subType2 !== 0 ? `
            <div class="manifest-sub">
                <div class="sub-title">サブテーマ2</div>
                <div class="highlight">${subTypeTwo.name}</div>
                <p class="text-gray-700">${subTypeTwo.keywords}</p>
                <p class="text-sm text-purple-600 mt-2">※メインテーマを動かすには、小さな歯車（サブテーマ2）を動かすことが大切です</p>
            </div>
        ` : '';

        subThemesHTML = subTypeOneHTML + subTypeTwoHTML;
    }

    // 最終的なHTML構築
    let html = `
        <div class="manifest-hierarchy">
            <div class="manifest-main">
                <h4 class="result-title mb-2">メインテーマ</h4>
                ${mainTypeHTML}
            </div>
            
            <div class="manifest-subs">
                ${subThemesHTML}
            </div>
        </div>
    `;

    manifestResultElement.innerHTML = html;
}

// エクスポート
window.ManifestTypeCalculator = {
    calculateManifestType,
    displayManifestResult
};