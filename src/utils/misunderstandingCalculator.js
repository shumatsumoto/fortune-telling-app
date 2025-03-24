// src/utils/misunderstandingCalculator.js
// 勘違い診断の計算と表示を担当するファイル

// 月星座から勘違いタイプを取得
function getMisunderstandingType(moonSign) {
  const misunderstandingTypes = window.MisunderstandingTypesData;
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

// グローバルスコープにエクスポート
window.MisunderstandingTypeCalculator = {
  getMisunderstandingType,
  displayMisunderstandingResult
};