// src/utils/potentialCalculator.js
// 潜在個性タイプの計算と表示を処理

// 干支から潜在個性タイプを計算する関数（改良版）
function calculatePotentialType(year, month, day) {
  const { chineseZodiac } = window.PotentialTypesData;

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

// 潜在個性の組み合わせ解説を生成する関数
function generatePotentialCombinationDescription(type1, type2, type3, totalPoint) {
  // 組み合わせパターンによって異なる解説を返す
  if (type1 === type2 && type2 === type3) {
    // すべて同じタイプの場合
    return `非常に珍しい組み合わせで、「${window.PotentialTypesData.potentialTypes[type1].name}」の特性が強く一貫して現れます。この一貫性により、潜在能力が集中して発揮されやすい特徴があります。`;
  } else if (type1 === totalPoint) {
    return `生まれながらの資質と総合的な特性が一致しており、自分の本質的な望みを実現しやすい環境にあります。「${window.PotentialTypesData.potentialTypes[type1].name}」の特性を特に意識して生きると良いでしょう。`;
  } else if (type2 === totalPoint) {
    return `先祖からの応援と総合的な特性が一致しており、先祖の力を通じて自分の能力を発揮しやすい状態です。「${window.PotentialTypesData.potentialTypes[type2].name}」の特性を意識して行動すると、周囲からのサポートを得やすくなります。`;
  } else if (type3 === totalPoint) {
    return `現在の環境設定と総合的な特性が一致しており、今の環境で自然と力を発揮できる状態です。「${window.PotentialTypesData.potentialTypes[type3].name}」の特性を意識して生きると、現在の状況をより活かせるでしょう。`;
  } else {
    // バランスの取れた組み合わせ
    return `バランスの取れた組み合わせで、多角的な視点と特性を活かせる可能性を持っています。それぞれの特性を状況に応じて使い分けることで、より柔軟に人生を進めることができるでしょう。`;
  }
}

// 潜在個性の結果表示を行う関数（改良版）
function displayPotentialResult(result, potentialResultElement) {
  const { potentialTypes } = window.PotentialTypesData;

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

// グローバルスコープにエクスポート
window.PotentialTypeCalculator = {
  calculatePotentialType,
  displayPotentialResult,
  generatePotentialCombinationDescription,
  // データリファレンスも含める（元のコードとの互換性のため）
  get potentialTypes() {
    return window.PotentialTypesData.potentialTypes;
  },
  get chineseZodiac() {
    return window.PotentialTypesData.chineseZodiac;
  }
};