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

// 顕在個性の結果表示（リスト形式で分割表示）
function displayManifestResult(result, manifestResultElement) {
    // 特殊ケース（11, 12, 0を含む）の処理
    const hasZeroMain = result.mainType === 0 || (typeof result.mainType === 'string' && result.mainType.endsWith('0'));
    const hasZeroSub = result.subType1 === 0 || result.subType2 === 0;
    const nonZeroSub = result.subType1 === 0 ? result.subType2 : result.subType1;

    // HTMLを構築（他のセクションのスタイルに合わせて修正）
    let html = `
        <div class="manifest-content mb-4">
            <!-- メインテーマ -->
            <div class="highlight">
    `;

    // メインテーマの情報
    if (result.mainType === 11) {
        // 11の場合: 1が2倍強まる
        const typeOne = manifestTypes[1];
        html += `メインテーマ：${typeOne.name} <span class="text-red-600 font-bold">×2倍の強さ</span>`;
    } else if (result.mainType === 12) {
        // 12の場合: 1と2の両方を持つ
        const typeOne = manifestTypes[1];
        const typeTwo = manifestTypes[2];
        html += `メインテーマ：${typeOne.name} と ${typeTwo.name} <span class="text-purple-700 font-bold">の両方</span>`;
    } else if (hasZeroMain) {
        // 0を含む場合: 霊感・異質な力が加わる
        const typeZero = manifestTypes[0];
        const baseType = parseInt(result.mainType.toString()[0]) || 0;
        const pairedType = manifestTypes[baseType] || manifestTypes[0];

        html += `メインテーマ：${pairedType.name} <span class="text-indigo-600 font-bold">＋霊感・増幅</span>`;
    } else {
        // 通常のケース
        const mainType = manifestTypes[result.mainType] || manifestTypes[9];
        html += `メインテーマ：${mainType.name}`;
    }

    html += `
            </div>
            <p class="text-gray-700 mt-2">
    `;

    // メインテーマの特徴文
    if (result.mainType === 11) {
        // 11の場合: 1が2倍強まる
        const typeOne = manifestTypes[1];
        html += typeOne.features.slice(0, 3).map(f => f).join('。') + '。';
        html += ` <span class="text-purple-600">この特性が通常より2倍強く現れます。</span>`;
    } else if (result.mainType === 12) {
        // 12の場合: 1と2の両方を持つ
        const typeOne = manifestTypes[1];
        const typeTwo = manifestTypes[2];
        html += typeOne.features.slice(0, 2).map(f => f).join('。') + '。';
        html += typeTwo.features.slice(0, 2).map(f => f).join('。') + '。';
        html += ` <span class="text-purple-600">創造性と協調性の両方を持つ稀なタイプです。</span>`;
    } else if (hasZeroMain) {
        // 0を含む場合: 霊感・異質な力が加わる
        const typeZero = manifestTypes[0];
        const baseType = parseInt(result.mainType.toString()[0]) || 0;
        const pairedType = manifestTypes[baseType] || manifestTypes[0];

        if (baseType !== 0) {
            html += pairedType.features.slice(0, 2).map(f => f).join('。') + '。';
        }
        html += typeZero.features.slice(0, 2).map(f => f).join('。') + '。';
        html += ` <span class="text-purple-600">霊的な感性が他の特性を増幅させます。</span>`;
    } else {
        // 通常のケース
        const mainType = manifestTypes[result.mainType] || manifestTypes[9];
        html += mainType.features.slice(0, 3).map(f => f).join('。') + '。';
    }

    html += `</p>`;

    // サブテーマの表示
    if (!hasZeroSub) {
        // サブテーマ1と2を表示（通常のケース）
        if (result.subType1 !== 0) {
            const subType1 = manifestTypes[result.subType1];
            html += `
                <div class="highlight mt-3">サブテーマ1：${subType1.name}</div>
                <p class="text-gray-700 mt-2">${subType1.features.slice(0, 3).map(f => f).join('。')}。</p>
            `;
        }

        if (result.subType2 !== 0) {
            const subType2 = manifestTypes[result.subType2];
            html += `
                <div class="highlight mt-3">サブテーマ2：${subType2.name}</div>
                <p class="text-gray-700 mt-2">${subType2.features.slice(0, 3).map(f => f).join('。')}。 <span class="text-purple-600">これがメインテーマを動かす小さな歯車となります。</span></p>
            `;
        }
    } else {
        // 0を含むサブテーマの表示（特殊ケース）
        const nonZeroTypeData = manifestTypes[nonZeroSub];
        const typeZero = manifestTypes[0];

        html += `
            <div class="highlight mt-3">サブテーマ：${nonZeroTypeData.name} <span class="text-indigo-600 font-bold">＋霊感・増幅</span></div>
            <p class="text-gray-700 mt-2">${nonZeroTypeData.features.slice(0, 2).map(f => f).join('。')}。${typeZero.features.slice(0, 1).map(f => f).join('。')}。 <span class="text-purple-600">霊的な感性がこの特性を増幅させます。</span></p>
        `;
    }

    // 課題・注意点セクション
    html += `
        </div>
        
        <div class="manifest-elements">
            <div class="manifest-element">
                <div class="manifest-title">課題・注意点</div>
                <p class="text-gray-700">
    `;

    // 課題のテキスト
    if (hasZeroSub) {
        // 0を含むサブテーマの課題（特殊ケース）
        const nonZeroTypeData = manifestTypes[nonZeroSub];
        const typeZero = manifestTypes[0];

        html += nonZeroTypeData.challenges.slice(0, 2).map(c => c).join('。') + '。';
        html += typeZero.challenges.slice(0, 1).map(c => c).join('。') + '。';
        html += ` <span class="text-purple-600">まずはこの課題から取り組みましょう。</span>`;
    } else if (result.subType2 !== 0) {
        // サブテーマ2の課題（通常のケース）
        const subType2 = manifestTypes[result.subType2];
        html += subType2.challenges.slice(0, 3).map(c => c).join('。') + '。';
        html += ` <span class="text-purple-600">この小さな歯車から取り組むと効率的です。</span>`;
    } else if (result.subType1 !== 0) {
        // サブテーマ1の課題（サブテーマ2がない場合）
        const subType1 = manifestTypes[result.subType1];
        html += subType1.challenges.slice(0, 3).map(c => c).join('。') + '。';
    }

    html += `
                </p>
            </div>
    `;

    // 特殊パターンの注釈
    if (hasZeroMain || hasZeroSub) {
        html += `
            <div class="manifest-element">
                <div class="manifest-title">特別な注意点</div>
                <p class="text-sm text-purple-600">
                    「霊感・異質な力」(0)が含まれる特殊なパターンです。これは霊的資質や潜在能力を表し、
                    組み合わさる数字の個性をより洗練された感性や直感力などで増幅させる効果があります。
                </p>
            </div>
        `;
    }

    // ポイント
    html += `
            <div class="manifest-element">
                <div class="manifest-title">ポイント</div>
                <p class="text-sm text-purple-600">
                    勘違いを知ると、それだけで外れるのが特徴です。あなたが苦手なことはやらなくて大丈夫です。
                    ${!hasZeroSub ? 'サブテーマ2（小さな歯車）から取り組むのが効果的です。' : ''}
                </p>
            </div>
        </div>
    `;

    // 結果を表示
    manifestResultElement.innerHTML = html;
}

// エクスポート設定（window.ManifestTypeCalculatorの一部として定義）
window.ManifestTypeCalculator = {
    calculateManifestType,
    displayManifestResult
};