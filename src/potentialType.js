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
        ],
        elements: {
            places: '高い山、高い塔、タワー、神社、仏閣、教会、アシュラム、西北',
            foods: '果物全般、おまんじゅう、お米、豆類、カツオブシ、干物、貝類',
            body: '首、頭、左の肺、赤い血、骨',
            colors: '丸いもの、金（ゴールド）、白、高価なもの、鏡',
            deities: '宇宙根源の神、天之御中主神',
            aromas: 'シダーウッド、ジュニパー'
        },
        description: '宇宙（天）タイプは、高いレベルの精神性と本質を追求する資質を持ちます。真理や悟りに触れる能力があり、上昇志向とエネルギーに満ち溢れています。視野が広く、独創的なアイデアを生み出す力に優れています。高い場所や神聖な場所との親和性が強く、創造的で独立した精神を持ちます。'
    },
    2: {
        name: '金（ゴールド）',
        keywords: '言葉によるコミュニケーション、経済力、華やかさ',
        features: [
            '会話や言葉が巧み',
            '五感を生かす',
            '華やかさを持って引きつける',
            '笑いによって人の心を明るくする'
        ],
        elements: {
            places: 'ゆったりした浜辺、神社、テーマパーク、クラブ、キャバクラ、西',
            foods: '豚肉、おしるこ、コーヒー、紅茶、牛乳、スープ、ビール、お酒、子供向けのお菓子',
            body: '呼吸器全般',
            colors: '丸いもの、アーチ型、キラキラするもの、水玉模様、白、金、プラチナ',
            deities: '女神全般、マリア',
            aromas: 'ゼラニウム、ジャスミン'
        },
        description: '金（ゴールド）タイプは、言葉によるコミュニケーション能力と経済感覚に優れます。五感を生かして華やかな存在感を発揮し、会話や言葉の使い方が巧みです。笑いや楽しさで人の心を明るくする才能があり、美しいものや価値あるものに惹かれます。人を引きつける魅力と、経済的な豊かさを生み出す能力を持っています。'
    },
    3: {
        name: '炎（火）',
        keywords: '情熱的、美しいものを扱う、心が踊ることをする',
        features: [
            '物事の表面を照らす',
            '見えなかったことを現す',
            '二面性が強い',
            '変わり者が多い'
        ],
        elements: {
            places: '美術館、博物館、海、ヘッドスパ、南',
            foods: '（具体的な記載なし）',
            body: '心臓、目、顔、顔面',
            colors: '透明感、ギザギザ模様、ボーダー、星型、赤、紫',
            deities: '花咲か爺、恵比寿様',
            aromas: 'イランイラン、ローズマリー'
        },
        description: '炎（火）タイプは、情熱的で美しいものに対する感性が鋭いのが特徴です。物事の表面を照らし出し、見えなかったことを現す能力があります。二面性が強く、時に変わり者と見られることもありますが、それは多面的な魅力の表れです。芸術的な才能や美的センスが高く、感情の起伏が豊かで表現力に優れています。'
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
        ],
        elements: {
            places: '森林、東',
            foods: 'お寿司、砂物、柑橘類全般、パン、梅干し、酸っぱいもの、お野菜、海藻、タケノコ',
            body: '肝臓',
            colors: 'ストライプ（縦縞）、葉っぱ柄、お花柄、緑、オレンジ',
            deities: '竹三日月の神、ゼウス、バアル',
            aromas: 'ペパーミント、グレープフルーツ、ネロリ'
        },
        description: '樹木タイプは、何かを広く伝え、多くの人に影響を与える力を持っています。冒険心旺盛で、人の勇気を引き出す才能があります。行動力と実行力に優れ、周囲に希望を与えるポジティブな影響力があります。成長と拡がりを象徴し、人間関係を発展させるのが得意です。新しいことへのチャレンジ精神が旺盛で、前進する力に満ちています。'
    },
    5: {
        name: '風',
        keywords: '自由、制限や束縛から出ていく、風のように気ままに生きる',
        features: [
            '独創的に人のことを見る',
            '個性を大事に尊重する',
            '伝統や常識に縛られない',
            '異端であることを好む'
        ],
        elements: {
            places: '空港、港、見通しの良い道路、風通しの良いところ、東南',
            foods: '麺類、食物繊維が豊富な食べ物、お野菜全般',
            body: '肝臓、呼吸器、腸全般、感染症に注意',
            colors: '流線型、細長い形、青',
            deities: 'スサノオの御子、ケツァルコアトル',
            aromas: 'ベルガモット、ネロリ'
        },
        description: '風タイプは、自由を愛し、制限や束縛から抜け出す力を持っています。独創的な視点で人や物事を見ることができ、個性を大切にします。伝統や常識に縛られず、自分らしい生き方を追求します。風のように自由に動き、新しい風を吹き込む役割があります。変化を恐れず、むしろ変化を起こす側に回ることができる人です。'
    },
    6: {
        name: '水',
        keywords: '何かを集中的に掘り下げていく、極めていく、内側から湧いてくるパワーを生かす',
        features: [
            '集中力が高い',
            '知的',
            '他を圧倒するほどのレベルまで物事を極められる',
            '深い心理に到達する'
        ],
        elements: {
            places: 'お風呂、水辺（海、川辺、湖）、プール、温泉、北',
            foods: 'お酒、塩、醤油、漬物、梅干し、豆腐、生魚、牛乳、海藻、お芋、芋類',
            body: '腎臓',
            colors: '波模様、波線模様のストライプ、水色、緑、黒',
            deities: '瀬織津姫、弁天様（弁財天）、大国様',
            aromas: 'ローズウッド、グレープフルーツ'
        },
        description: '水タイプは、物事を深く掘り下げて極める能力に長けています。集中力が高く、知的な探求を好みます。表面的なことよりも、深層にある本質や心理を理解する力があります。内側から湧き出るパワーを活かし、他者を圧倒するレベルにまで物事を極めることができます。感情の深さと静かな強さを持ち、流れるような柔軟性も備えています。'
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
        ],
        elements: {
            places: '山、山林、東北',
            foods: '山菜、牛肉、たらこ、山芋、さつまあげ、長く保存できる食べ物、つぶつぶしたもの（数の子、筋子、イクラ）',
            body: '関節、骨、手、手指、男性器',
            colors: '茶色、緑',
            deities: '牛頭天王（国常立神）',
            aromas: 'マジョラム、ティートリー、オレンジ'
        },
        description: '山タイプは、どっしりとした安定感と継続力が特徴です。何かを長く続けて積み上げていく忍耐強さがあり、確実に結果を出せます。自分のペースを大切にし、周囲に流されず我が道を行く強さを持っています。地に足をつけた現実的な判断力と、揺るがない精神力があります。長期的な視点で物事を捉え、堅実に物事を進める能力に優れています。'
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
        ],
        elements: {
            places: '西南',
            foods: 'ワイン、チーズ、発酵食品、お茶',
            body: '胃腸全般、脾臓、皮膚',
            colors: '横縞（ボーダー）、チェック柄、黄色、茶色',
            deities: '大国主命、豊雲野神',
            aromas: 'ローズ、ローズウッド、ゼラニウム、パルマローザ'
        },
        description: '土（地面）タイプは、確かな立場やアイデンティティを通じて安定を得る特性があります。柔軟性と受容力に優れ、様々な状況や人を受け入れることができます。穏やかで平和を好み、場の雰囲気を和ませる力があります。人と人との橋渡し役となり、関係性をつなげるのが得意です。土台となって物事を支え、豊かさを育む資質を持っています。'
    }
};

// 干支の定義
const chineseZodiac = [
    { name: '子（ね）', animal: '鼠', element: '水', number: 1 },
    { name: '丑（うし）', animal: '牛', element: '土', number: 2 },
    { name: '寅（とら）', animal: '虎', element: '木', number: 3 },
    { name: '卯（う）', animal: '兎', element: '木', number: 4 },
    { name: '辰（たつ）', animal: '竜', element: '土', number: 5 },
    { name: '巳（み）', animal: '蛇', element: '火', number: 6 },
    { name: '午（うま）', animal: '馬', element: '火', number: 7 },
    { name: '未（ひつじ）', animal: '羊', element: '土', number: 8 },
    { name: '申（さる）', animal: '猿', element: '金', number: 9 },
    { name: '酉（とり）', animal: '鶏', element: '金', number: 10 },
    { name: '戌（いぬ）', animal: '犬', element: '土', number: 11 },
    { name: '亥（い）', animal: '猪', element: '水', number: 12 }
];

// 干支から潜在個性タイプを計算する関数（改良版）
function calculatePotentialType(year, month, day) {
    // 干支に基づく番号の計算（1から12）
    const zodiacNumber = (year - 4) % 12 + 1;

    // 干支情報の取得
    const zodiacInfo = chineseZodiac[zodiacNumber - 1];

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
        totalPoint: totalPoint,
        zodiacInfo: zodiacInfo, // 干支情報も含める
        calculation: {
            zodiacNumber,
            formula: `(${zodiacNumber} + ${month} + ${day}) % 8 = ${totalPoint === 8 ? '0→8' : totalPoint}`
        }
    };
}

// 潜在個性の結果表示を行う関数（改良版）
function displayPotentialResult(result, potentialResultElement) {
    // 結果表示用のHTML
    let html = '';

    // 潜在個性のまとめ・ポイント（ベースとなる3つの要素が分かるように設計）
    const totalType = potentialTypes[result.totalPoint];
    html += `
        <div class="potential-hierarchy">
            <!-- メインとなる「まとめ・ポイント」 -->
            <div class="potential-main">
                <h4 class="result-title mb-2">まとめ・ポイント</h4>
                <div class="highlight">${totalType.name}</div>
                <p class="text-gray-700">${totalType.keywords}</p>
                <p class="text-sm text-purple-600 mt-2">あなたの潜在個性のベースとなる、総合的な特性です</p>
            </div>
            
            <!-- 3つの構成要素 -->
            <div class="potential-elements">
                <!-- 生まれ変わっても変わらない望み -->
                <div class="potential-element">
                    <div class="element-title">生まれ変わっても変わらない望み</div>
                    <div class="highlight">${potentialTypes[result.type1].name}</div>
                    <p class="text-gray-700">${potentialTypes[result.type1].keywords}</p>
                    <div class="mt-2 mb-1 text-sm text-purple-700 font-medium">主な特徴:</div>
                    <ul class="feature-list mt-1">
                        ${potentialTypes[result.type1].features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                    <p class="text-xs text-gray-500 mt-2">干支: ${result.zodiacInfo.name}（${result.zodiacInfo.animal}）- ${result.zodiacInfo.element}</p>
                </div>
                
                <!-- 先祖が応援してくれること -->
                <div class="potential-element">
                    <div class="element-title">先祖が応援してくれること</div>
                    <div class="highlight">${potentialTypes[result.type2].name}</div>
                    <p class="text-gray-700">${potentialTypes[result.type2].keywords}</p>
                    <div class="mt-2 text-sm">
                        <span class="text-purple-700 font-medium">親和性のある場所:</span> 
                        <span class="text-gray-700">${potentialTypes[result.type2].elements.places}</span>
                    </div>
                    <div class="mt-1 text-sm">
                        <span class="text-purple-700 font-medium">相性の良い食べ物:</span> 
                        <span class="text-gray-700">${potentialTypes[result.type2].elements.foods}</span>
                    </div>
                </div>
                
                <!-- 今回の人生の環境設定 -->
                <div class="potential-element">
                    <div class="element-title">今回の人生の環境設定</div>
                    <div class="highlight">${potentialTypes[result.type3].name}</div>
                    <p class="text-gray-700">${potentialTypes[result.type3].keywords}</p>
                    <p class="text-sm text-purple-600 mt-2">この環境で能力を発揮することで、より自然な流れで人生を進められます</p>
                </div>
            </div>
            
            <!-- 潜在個性の詳細説明 -->
            <div class="mt-4 bg-yellow-50 p-3 rounded-lg border-l-4 border-yellow-500">
                <h5 class="text-sm font-semibold text-yellow-800 mb-1">潜在個性の組み合わせ解説</h5>
                <p class="text-sm text-gray-700">
                    あなたは「${potentialTypes[result.type1].name}」の資質を持ち、先祖から「${potentialTypes[result.type2].name}」の特性を応援されています。
                    そして現在の人生では「${potentialTypes[result.type3].name}」の環境に置かれており、全体として「${potentialTypes[result.totalPoint].name}」の特性が強く現れています。
                    この組み合わせは、${generatePotentialCombinationDescription(result.type1, result.type2, result.type3, result.totalPoint)}
                </p>
            </div>
        </div>
    `;

    potentialResultElement.innerHTML = html;
}

// 潜在個性の組み合わせ解説を生成する関数
function generatePotentialCombinationDescription(type1, type2, type3, totalPoint) {
    // 組み合わせパターンによって異なる解説を返す
    if (type1 === type2 && type2 === type3) {
        // すべて同じタイプの場合
        return `非常に珍しい組み合わせで、「${potentialTypes[type1].name}」の特性が強く一貫して現れます。この一貫性により、潜在能力が集中して発揮されやすい特徴があります。`;
    } else if (type1 === totalPoint) {
        return `生まれながらの資質と総合的な特性が一致しており、自分の本質的な望みを実現しやすい環境にあります。「${potentialTypes[type1].name}」の特性を特に意識して生きると良いでしょう。`;
    } else if (type2 === totalPoint) {
        return `先祖からの応援と総合的な特性が一致しており、先祖の力を通じて自分の能力を発揮しやすい状態です。「${potentialTypes[type2].name}」の特性を意識して行動すると、周囲からのサポートを得やすくなります。`;
    } else if (type3 === totalPoint) {
        return `現在の環境設定と総合的な特性が一致しており、今の環境で自然と力を発揮できる状態です。「${potentialTypes[type3].name}」の特性を意識して生きると、現在の状況をより活かせるでしょう。`;
    } else {
        // バランスの取れた組み合わせ
        return `バランスの取れた組み合わせで、多角的な視点と特性を活かせる可能性を持っています。それぞれの特性を状況に応じて使い分けることで、より柔軟に人生を進めることができるでしょう。`;
    }
}

// エクスポート
window.PotentialTypeCalculator = {
    calculatePotentialType,
    displayPotentialResult,
    potentialTypes,
    chineseZodiac
};