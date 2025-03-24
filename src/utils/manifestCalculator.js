// src/utils/manifestCalculator.js
// 顕在個性タイプの計算と表示を処理

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
  const subType1 = digits % 10; // 1の位
  const subType2 = Math.floor(digits / 10); // 10の位

  return {
    mainType: finalSum,
    subType1: subType1,
    subType2: subType2,
    originalSum: digits // デバッグや詳細表示のために元の合計値も返す
  };
}

// 顕在個性の結果表示（リスト形式で分割表示）- 改良版
function displayManifestResult(result, manifestResultElement) {
  // データオブジェクトへの参照を取得
  const manifestTypes = window.ManifestTypesData;

  // 特殊ケース（11, 12, 0を含む）の処理
  const hasZeroMain = result.mainType === 0 || (typeof result.mainType === 'string' && result.mainType.includes('0'));
  const hasZeroSub = result.subType1 === 0 || result.subType2 === 0;
  const nonZeroSub = result.subType1 === 0 ? result.subType2 : result.subType1;

  // 特殊パターンのクラス名を決定
  let specialClass = '';
  if (result.mainType === 11) {
    specialClass = 'type-11';
  } else if (result.mainType === 12) {
    specialClass = 'type-12';
  } else if (hasZeroMain || hasZeroSub) {
    specialClass = 'type-zero';
  }

  // HTMLを構築（他のセクションのスタイルに合わせて修正）
  let html = `
        <div class="manifest-content mb-4">
            <!-- メインテーマ -->
            <div class="highlight ${specialClass}">
    `;

  // メインテーマの情報
  if (result.mainType === 11) {
    // 11の場合: 1が2倍強まる
    html += `メインテーマ：${manifestTypes[11].name}`;
  } else if (result.mainType === 12) {
    // 12の場合: 1と2の両方を持つ
    html += `メインテーマ：${manifestTypes[12].name}`;
  } else if (hasZeroMain) {
    // 0を含む場合: 霊感・異質な力が加わる
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
    html += manifestTypes[11].features.slice(0, 4).map(f => f).join('。') + '。';
    html += ` <span class="text-purple-600">他にない強力な創造性とエネルギーを持っています。</span>`;
  } else if (result.mainType === 12) {
    // 12の場合: 1と2の両方を持つ
    html += manifestTypes[12].features.slice(0, 4).map(f => f).join('。') + '。';
    html += ` <span class="text-purple-600">両方の特性を調和させることで大きな力を発揮します。</span>`;
  } else if (hasZeroMain) {
    // 0を含む場合: 霊感・異質な力が加わる
    const baseType = parseInt(result.mainType.toString()[0]) || 0;
    const pairedType = manifestTypes[baseType] || manifestTypes[0];

    if (baseType !== 0) {
      html += pairedType.features.slice(0, 2).map(f => f).join('。') + '。';
    }
    html += manifestTypes[0].features.slice(0, 2).map(f => f).join('。') + '。';
    html += ` <span class="text-purple-600">霊的な感性や直感力が強く、他の特性を増幅させます。</span>`;
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
            <div class="highlight type-zero mt-3">サブテーマ：${nonZeroTypeData.name} <span class="text-indigo-600 font-bold">＋霊感・増幅</span></div>
            <p class="text-gray-700 mt-2">${nonZeroTypeData.features.slice(0, 2).map(f => f).join('。')}。${typeZero.features.slice(0, 1).map(f => f).join('。')}。 <span class="text-purple-600">霊的な感性がこの特性を増幅させ、より洗練された直感力を発揮します。</span></p>
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
  if (result.mainType === 11) {
    // 11の場合: 強化された1の課題
    html += manifestTypes[11].challenges.slice(0, 3).map(c => c).join('。') + '。';
    html += ` <span class="text-purple-600">通常より強いエネルギーをどう扱うかがポイントです。</span>`;
  } else if (result.mainType === 12) {
    // 12の場合: 1と2の融合パターンの課題
    html += manifestTypes[12].challenges.slice(0, 3).map(c => c).join('。') + '。';
    html += ` <span class="text-purple-600">二つの特性のバランスを取ることが大切です。</span>`;
  } else if (hasZeroSub) {
    // 0を含むサブテーマの課題（特殊ケース）
    const nonZeroTypeData = manifestTypes[nonZeroSub];
    const typeZero = manifestTypes[0];

    html += nonZeroTypeData.challenges.slice(0, 2).map(c => c).join('。') + '。';
    html += typeZero.challenges.slice(0, 1).map(c => c).join('。') + '。';
    html += ` <span class="text-purple-600">霊的な感性と現実とのバランスを取りましょう。</span>`;
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
  if (result.mainType === 11) {
    html += `
            <div class="manifest-element">
                <div class="manifest-title">特別な注意点</div>
                <p class="text-sm text-red-600">
                    <strong>「創造（自信）×2倍の強さ」</strong>は特殊な数秘パターンです。
                    このパターンでは、創造性とエネルギーが通常より2倍強く現れます。
                    その強さをうまくコントロールし、発散する方法を見つけることが重要です。
                    あなたの独創性と存在感は他の人に大きな影響を与えることでしょう。
                </p>
            </div>
        `;
  } else if (result.mainType === 12) {
    html += `
            <div class="manifest-element">
                <div class="manifest-title">特別な注意点</div>
                <p class="text-sm text-purple-600">
                    <strong>「創造（自信）と人間関係（バランス）の両方」</strong>は特殊な数秘パターンです。
                    このパターンでは、創造性と協調性の両方の特性を持っています。
                    時に相反するこの二つの特性をうまく調和させることができると、
                    独創的でありながら人との関わりも大切にするバランスの取れた個性を発揮できるでしょう。
                </p>
            </div>
        `;
  } else if (hasZeroMain || hasZeroSub) {
    html += `
            <div class="manifest-element">
                <div class="manifest-title">特別な注意点</div>
                <p class="text-sm text-indigo-600">
                    <strong>「霊感・異質な力」(0)</strong>が含まれる特殊なパターンです。これは霊的資質や潜在能力を表し、
                    組み合わさる数字の個性をより洗練された感性や直感力などで増幅させる効果があります。
                    繊細さを生かしつつも、霊的な影響に振り回されないよう、現実とのバランスを取ることが大切です。
                </p>
            </div>
        `;
  }

  // ポイント
  html += `
            <div class="manifest-element">
                <div class="manifest-title">ポイント</div>
                <p class="text-sm text-purple-600">
                    ${!hasZeroSub && result.subType2 !== 0 ? 'サブテーマ2（小さな歯車）から取り組むのが効果的です。' : ''}
                    ${result.mainType === 11 || result.mainType === 12 ? '特殊パターンの持ち主として、その独自性を活かすことがポイントです。' : ''}
                </p>
            </div>
        </div>
    `;

  // 結果を表示
  manifestResultElement.innerHTML = html;
}

// グローバルスコープにエクスポート
window.ManifestTypeCalculator = {
  calculateManifestType,
  displayManifestResult,
  // データリファレンスも含める（元のコードとの互換性のため）
  get manifestTypes() {
    return window.ManifestTypesData;
  }
};