// DOM要素が読み込まれた後に実行
document.addEventListener('DOMContentLoaded', function() {
    // フォーム要素の取得
    const form = document.getElementById('diagnosisForm');
    const resultArea = document.getElementById('resultArea');
    const resetButton = document.getElementById('resetButton');
    const potentialResult = document.getElementById('potentialResult');
    const manifestResult = document.getElementById('manifestResult');
    const misunderstandingResult = document.getElementById('misunderstandingResult');
    
    // 生年月日のセレクトボックスに選択肢を追加
    populateYearOptions();
    populateMonthOptions();
    populateDayOptions();
    
    // フォームの送信イベント
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // 入力値の取得
        const year = parseInt(document.getElementById('birthYear').value);
        const month = parseInt(document.getElementById('birthMonth').value);
        const day = parseInt(document.getElementById('birthDay').value);
        const moonSign = document.getElementById('moonSign').value;
        
        // 入力値の検証
        if (!year || !month || !day || !moonSign) {
            alert('すべての項目を入力してください');
            return;
        }
        
        // 診断結果の計算
        const potentialType = calculatePotentialType(year, month, day);
        const manifestType = calculateManifestType(year, month, day);
        const misunderstandingType = getMisunderstandingType(moonSign);
        
        // 結果の表示
        displayPotentialResult(potentialType);
        displayManifestResult(manifestType);
        displayMisunderstandingResult(misunderstandingType);
        
        // 結果エリアの表示
        form.closest('.bg-white').classList.add('hidden');
        resultArea.classList.remove('hidden');
        resultArea.classList.add('result-appear');
        
        // ページトップにスクロール
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    // リセットボタンのクリックイベント
    resetButton.addEventListener('click', function() {
        form.reset();
        form.closest('.bg-white').classList.remove('hidden');
        resultArea.classList.add('hidden');
        
        // ページトップにスクロール
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    // 生年選択肢の生成（現在から100年前まで）
    function populateYearOptions() {
        const yearSelect = document.getElementById('birthYear');
        const currentYear = new Date().getFullYear();
        
        for (let i = currentYear; i >= currentYear - 100; i--) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i + '年';
            yearSelect.appendChild(option);
        }
    }
    
    // 月選択肢の生成
    function populateMonthOptions() {
        const monthSelect = document.getElementById('birthMonth');
        
        for (let i = 1; i <= 12; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i + '月';
            monthSelect.appendChild(option);
        }
    }
    
    // 日選択肢の生成（とりあえず31日分）
    function populateDayOptions() {
        const daySelect = document.getElementById('birthDay');
        
        for (let i = 1; i <= 31; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i + '日';
            daySelect.appendChild(option);
        }
    }
    
    // 干支から潜在個性タイプを計算
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
    
    // 月星座から勘違いタイプを取得
    function getMisunderstandingType(moonSign) {
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
        
        return misunderstandingTypes[moonSign] || {
            type: '不明',
            description: '月星座を正確に入力してください',
            reality: '不明'
        };
    }
    
    // 潜在個性の結果表示
    function displayPotentialResult(result) {
        // 潜在個性の名称とキーワード
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
        
        // 全体を通して言えること
        const totalType = potentialTypes[result.totalPoint];
        html += `
            <div>
                <h4 class="result-title mb-2">全体を通して言えること</h4>
                <div class="highlight">${totalType.name}</div>
                <p class="text-gray-700">${totalType.keywords}</p>
            </div>
        `;
        
        potentialResult.innerHTML = html;
    }
    
    // 顕在個性の結果表示
    function displayManifestResult(result) {
        // 顕在個性の名称とキーワード
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
        
        manifestResult.innerHTML = html;
    }
    
    // 勘違いタイプの結果表示
    function displayMisunderstandingResult(result) {
        // 結果表示用のHTML
        let html = `
            <div class="mb-4">
                <h4 class="result-title mb-2">あなたの勘違いタイプ</h4>
                <div class="highlight">${result.type}</div>
                <p class="text-gray-700 mb-4">${result.description}</p>
                <h4 class="font-semibold text-purple-700 mb-2">実際の状態</h4>
                <p class="text-gray-700">${result.reality}</p>
            </div>
            <div>
                <p class="text-sm text-purple-600">勘違いを知ると、それだけで外れるのが特徴です。あなたが苦手なことはやらなくて大丈夫です。</p>
            </div>
        `;
        
        misunderstandingResult.innerHTML = html;
    }
    
    // 月の選択が変わった時に日数を調整
    document.getElementById('birthMonth').addEventListener('change', function() {
        adjustDaysInMonth();
    });
    
    // 年の選択が変わった時に閏年を考慮して日数を調整
    document.getElementById('birthYear').addEventListener('change', function() {
        adjustDaysInMonth();
    });
    
    // 月と年に応じて日の選択肢を調整
    function adjustDaysInMonth() {
        const year = parseInt(document.getElementById('birthYear').value) || new Date().getFullYear();
        const month = parseInt(document.getElementById('birthMonth').value);
        const daySelect = document.getElementById('birthDay');
        const currentDay = parseInt(daySelect.value) || 0;
        
        if (!month) return;
        
        // 選択された月の日数を取得
        const daysInMonth = new Date(year, month, 0).getDate();
        
        // 現在の選択肢をクリア
        daySelect.innerHTML = '';
        
        // 「選択してください」オプション
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = '選択してください';
        daySelect.appendChild(defaultOption);
        
        // 日数分のオプションを追加
        for (let i = 1; i <= daysInMonth; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i + '日';
            daySelect.appendChild(option);
        }
        
        // 以前選択していた日が新しい月の範囲内なら再選択
        if (currentDay > 0 && currentDay <= daysInMonth) {
            daySelect.value = currentDay;
        }
    }
});
