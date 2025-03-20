// potentialType.js - 潜在個性の計算と表示を担当するファイル

// 潜在個性の名称とキーワード定義
const potentialTypes = {
    1: {
        name: '宇宙（天）',
        keywords: 'レベルが高い、本質的なことを知る、真理や悟りに触れる',
        features: [
            '上昇志向が高い',
            'エネルギーが旺盛',
            '視野や展望の高さ',
            '創造性を刺激する',
            '独立心が旺盛'
        ]
    },
    2: {
        name: '金（ゴールド）',
        keywords: '言葉によるコミュニケーション、経済力、華やかさ',
        features: [
            '会話や言葉が巧み',
            '五感を生かす',
            '華やかさを持って引きつける',
            '笑いによって人の心を明るくする'
        ]
    },
    3: {
        name: '炎（火）',
        keywords: '情熱的、美しいものを扱う、心が踊ることをする',
        features: [
            '物事の表面を照らす',
            '見えなかったことを現す',
            '二面性が強い',
            '変わり者が多い'
        ]
    },
    4: {
        name: '樹木',
        keywords: '何かを広く伝える、人間関係を発展させる、多くの人に影響を与える',
        features: [
            '冒険好き',
            '人の勇気を引き出す',
            '影響力がある',
            '希望の光を灯す',
            'チャレンジャー',
            '行動的'
        ]
    },
    5: {
        name: '風',
        keywords: '自由、制限や束縛から出ていく、風のように気ままに生きる',
        features: [
            '独創的に人のことを見る',
            '個性を大事に尊重する',
            '伝統や常識に縛られない',
            '異端であることを好む'
        ]
    },
    6: {
        name: '水',
        keywords: '何かを集中的に掘り下げていく、極めていく、内側から湧いてくるパワーを生かす',
        features: [
            '集中力が高い',
            '知的',
            '他を圧倒するほどのレベルまで物事を極められる',
            '深い心理に到達する'
        ]
    },
    7: {
        name: '山',
        keywords: 'どっしり構えている、安定感がある、何かを長く続けて積み上げていく',
        features: [
            '継続する力がある',
            '忍耐力がある',
            '結果を出せる',
            'マイペース',
            '我が道を行く'
        ]
    },
    8: {
        name: '土（地面）',
        keywords: '立場、アイデンティティ、役割、安定を得る',
        features: [
            '流動性がある',
            '柔軟に受け入れる',
            '穏やか',
            '平和的',
            '場を和ませる',
            '人と人をつなげる'
        ]
    }
};

// 干支から潜在個性タイプを計算する関数
function calculatePotentialType(year, month, day) {
    // 干支に基づく番号の計算（1から12）
    const zodiacNumber = (year - 4) % 12 + 1;
    
    // 8以下はそのまま、9以上は8を引く
    let type1 = zodiacNumber <= 8 ? zodiacNumber : zodiacNumber - 8;
    
    // 誕生月を8で割った余りを計算
    let type2 = month % 8;
    if (type2 === 0) type2 = 8;
    
    // 誕生日を8で割った余りを計算
    let type3 = day % 8;
    if (type3 === 0) type3 = 8;
    
    // 全体のポイント計算
    let totalPoint = (zodiacNumber + month + day) % 8;
    if (totalPoint === 0) totalPoint = 8;
    
    return {
        type1: type1,
        type2: type2,
        type3: type3,
        totalPoint: totalPoint
    };
}

// 潜在個性の結果表示を行う関数
function displayPotentialResult(result, potentialResultElement) {
    // 結果表示用のHTML
    let html = '';
    
    // 生まれ変わっても変わらない望み
    const type1 = potentialTypes[result.type1];
    html += `
        <div class="mb-4">
            <h4 class="result-title mb-2">生まれ変わっても変わらない望み</h4>
            <div class="highlight">${type1.name}</div>
            <p class="text-gray-700">${type1.keywords}</p>
            <ul class="feature-list mt-2">
                ${type1.features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
        </div>
    `;
    
    // 先祖が応援してくれること
    const type2 = potentialTypes[result.type2];
    html += `
        <div class="mb-4">
            <h4 class="result-title mb-2">先祖が応援してくれること</h4>
            <div class="highlight">${type2.name}</div>
            <p class="text-gray-700">${type2.keywords}</p>
        </div>
    `;
    
    // 今回の人生の環境設定
    const type3 = potentialTypes[result.type3];
    html += `
        <div class="mb-4">
            <h4 class="result-title mb-2">今回の人生の環境設定</h4>
            <div class="highlight">${type3.name}</div>
            <p class="text-gray-700">${type3.keywords}</p>
        </div>
    `;
    
    // まとめ・ポイント
    const totalType = potentialTypes[result.totalPoint];
    html += `
        <div>
            <h4 class="result-title mb-2">まとめ・ポイント</h4>
            <div class="highlight">${totalType.name}</div>
            <p class="text-gray-700">${totalType.keywords}</p>
        </div>
    `;
    
    potentialResultElement.innerHTML = html;
}

// エクスポート
window.PotentialTypeCalculator = {
    calculatePotentialType,
    displayPotentialResult
};
