// src/utils/moonCalculator.js
// 月星座計算機

// 星座の境界（月の黄道座標系、単位: 度）
const ZODIAC_BOUNDARIES = [
  { sign: "牡羊座", startDegree: 0 },
  { sign: "牡牛座", startDegree: 30 },
  { sign: "双子座", startDegree: 60 },
  { sign: "蟹座", startDegree: 90 },
  { sign: "獅子座", startDegree: 120 },
  { sign: "乙女座", startDegree: 150 },
  { sign: "天秤座", startDegree: 180 },
  { sign: "蠍座", startDegree: 210 },
  { sign: "射手座", startDegree: 240 },
  { sign: "山羊座", startDegree: 270 },
  { sign: "水瓶座", startDegree: 300 },
  { sign: "魚座", startDegree: 330 }
];

// 角度をラジアンに変換する関数
function toRadians(degrees) {
  return degrees * Math.PI / 180;
}

// 黄経から星座を決定する関数（境界チェックを改善）
function getZodiacSign(longitude) {
  // 黄経の正規化（0〜360度の範囲に収める）
  longitude = longitude % 360;
  if (longitude < 0) longitude += 360;

  // 降順でチェックして最初に条件を満たす星座を返す
  for (let i = ZODIAC_BOUNDARIES.length - 1; i >= 0; i--) {
    if (longitude >= ZODIAC_BOUNDARIES[i].startDegree) {
      return ZODIAC_BOUNDARIES[i].sign;
    }
  }
  // 0度未満の場合（通常はないが念のため）
  return ZODIAC_BOUNDARIES[0].sign;
}

// 日付をJulian Dayに変換する関数（改良版）
function getJulianDay(year, month, day, hour, minute) {
  if (month <= 2) {
    year -= 1;
    month += 12;
  }

  const a = Math.floor(year / 100);
  const b = 2 - a + Math.floor(a / 4);

  // 協定世界時（UTC）への変換
  const utcHour = hour - 9; // 日本時間（UTC+9）からUTCへの変換

  const jd = Math.floor(365.25 * (year + 4716)) +
    Math.floor(30.6001 * (month + 1)) +
    day + b - 1524.5 +
    (utcHour + minute / 60) / 24.0;

  return jd;
}

// 月の位置を計算する関数（改良版）
function calculateMoonPosition(year, month, day, hour, minute, latitude, longitude) {
  // 日付をJulian Dayに変換
  const jd = getJulianDay(year, month, day, hour, minute);

  // 月の平均軌道要素を計算
  const T = (jd - 2451545.0) / 36525; // J2000からの世紀数

  // 月の平均軌道要素（単位: 度）- より精度の高い係数
  const L0 = 218.3164477 + 481267.88123421 * T - 0.0015786 * T * T + 0.0000163 * T * T * T; // 平均黄経
  const M = 134.9634114 + 477198.8676313 * T + 0.0089970 * T * T + 0.0000145 * T * T * T;   // 平均近点角
  const F = 93.2720993 + 483202.0175273 * T - 0.0034029 * T * T - 0.00000189 * T * T * T;   // 平均黄緯引数
  const D = 297.8501921 + 445267.1114034 * T - 0.0018819 * T * T + 0.00000189 * T * T * T;  // 平均月離角
  const Om = 125.0445479 - 1934.1362891 * T + 0.0020754 * T * T + 0.00000215 * T * T * T;   // 平均昇交点黄経

  // 主要な摂動項の改良版（より多くの項を含む）
  let dL = 6.288774 * Math.sin(toRadians(M));
  dL += 1.274027 * Math.sin(toRadians(2 * D - M));
  dL += 0.658314 * Math.sin(toRadians(2 * D));
  dL += 0.213618 * Math.sin(toRadians(2 * M));
  dL -= 0.185116 * Math.sin(toRadians(Om));
  dL -= 0.114332 * Math.sin(toRadians(2 * F));
  dL += 0.058793 * Math.sin(toRadians(2 * D - 2 * M));
  dL += 0.057066 * Math.sin(toRadians(2 * D - Om - M));
  dL += 0.053322 * Math.sin(toRadians(2 * D + M));
  dL += 0.045758 * Math.sin(toRadians(2 * D - Om));
  dL -= 0.040923 * Math.sin(toRadians(M - Om));
  dL -= 0.034720 * Math.sin(toRadians(D));
  dL -= 0.030383 * Math.sin(toRadians(M + Om));
  dL += 0.015327 * Math.sin(toRadians(2 * D - 2 * F));
  dL -= 0.012528 * Math.sin(toRadians(2 * F + M));
  dL += 0.010980 * Math.sin(toRadians(2 * F - M));
  dL += 0.010675 * Math.sin(toRadians(4 * D - M));
  dL += 0.010034 * Math.sin(toRadians(3 * M));
  dL += 0.008548 * Math.sin(toRadians(4 * D - 2 * M));
  dL -= 0.007910 * Math.sin(toRadians(M - Om + 2 * D));
  dL -= 0.006783 * Math.sin(toRadians(2 * D + Om));
  dL += 0.005162 * Math.sin(toRadians(M - D));

  // 月の視黄経（度）
  let moonLongitude = (L0 + dL) % 360;
  if (moonLongitude < 0) moonLongitude += 360;

  // 時差補正（改良版）
  const timeZoneOffset = 9; // 日本標準時（UTC+9）
  // JST → UT変換のための補正
  const localTimeCorrection = (longitude / 15) - timeZoneOffset;
  // 1時間あたりの月の平均移動量は約0.55度
  const hourlyMotion = 0.55;

  // 地理的位置による補正
  moonLongitude += localTimeCorrection * hourlyMotion;

  // 黄経の正規化
  moonLongitude = moonLongitude % 360;
  if (moonLongitude < 0) moonLongitude += 360;

  return moonLongitude;
}

// パフォーマンスチューニングのためのキャッシュ機能
const moonPositionCache = new Map();

function getCachedOrCalculateMoonPosition(year, month, day, hour, minute, latitude, longitude) {
  // キャッシュキーを生成
  const cacheKey = `${year}-${month}-${day}-${hour}-${minute}-${latitude}-${longitude}`;

  // キャッシュをチェック
  if (moonPositionCache.has(cacheKey)) {
    return moonPositionCache.get(cacheKey);
  }

  // 計算を実行
  const result = calculateMoonPosition(year, month, day, hour, minute, latitude, longitude);

  // 結果をキャッシュ
  moonPositionCache.set(cacheKey, result);

  return result;
}

// 月からのフォールバック月星座（おおよその値）
function getDefaultMoonSign(month) {
  // 月に基づいた簡易的な星座判定（正確ではないが緊急時のフォールバック）
  const fallbackSigns = [
    "山羊座", // 1月
    "水瓶座", // 2月
    "魚座",   // 3月
    "牡羊座", // 4月
    "牡牛座", // 5月
    "双子座", // 6月
    "蟹座",   // 7月
    "獅子座", // 8月
    "乙女座", // 9月
    "天秤座", // 10月
    "蠍座",   // 11月
    "射手座"  // 12月
  ];

  return fallbackSigns[((parseInt(month) - 1) % 12)];
}

// 月星座を計算する関数（メイン関数）- 改良版
function calculateMoonZodiacSign(birthData) {
  const { year, month, day, hour, minute, latitude, longitude } = birthData;

  // 入力値の検証と前処理
  if (!year || !month || !day) {
    return { success: false, message: "生年月日を入力してください" };
  }

  // 数値に変換
  const numYear = parseInt(year);
  const numMonth = parseInt(month);
  const numDay = parseInt(day);
  const numHour = parseInt(hour || 12);
  const numMinute = parseInt(minute || 0);
  const numLatitude = parseFloat(latitude || 35.6895);
  const numLongitude = parseFloat(longitude || 139.6917);

  try {
    // 月の黄経を計算
    const moonLongitude = calculateMoonPosition(
      numYear, numMonth, numDay, numHour, numMinute, numLatitude, numLongitude
    );

    // 黄経から星座を決定
    const moonSign = getZodiacSign(moonLongitude);

    // デバッグ情報も含めて結果を返す
    return {
      success: true,
      moonSign: moonSign,
      longitude: moonLongitude,
      details: {
        year: numYear,
        month: numMonth,
        day: numDay,
        hour: numHour,
        minute: numMinute,
        latitude: numLatitude,
        longitude: numLongitude,
        julianDay: getJulianDay(numYear, numMonth, numDay, numHour, numMinute)
      }
    };
  } catch (error) {
    console.error("月星座計算エラー:", error);
    return {
      success: false,
      message: "計算中にエラーが発生しました",
      error: error.toString()
    };
  }
}

// エラー処理を強化した月星座計算関数
function calculateMoonZodiacSignSafe(birthData) {
  try {
    return calculateMoonZodiacSign(birthData);
  } catch (error) {
    console.error("月星座計算に致命的なエラーが発生しました:", error);
    // フォールバック処理: 平均的な値を使用
    return {
      success: true,
      moonSign: getDefaultMoonSign(birthData.month),
      longitude: null,
      details: {
        error: "詳細計算エラー - フォールバック値を使用",
        errorMessage: error.toString()
      },
      isApproximate: true
    };
  }
}

// グローバルスコープにエクスポート
window.MoonCalculator = {
  calculateMoonZodiacSign: calculateMoonZodiacSignSafe,
  getCachedOrCalculateMoonPosition,
  // 都道府県データは別ファイルに分離したものを参照
  get PREFECTURES() {
    return window.PrefecturesData;
  },
  DEBUG: {
    calculateMoonPosition,
    getJulianDay,
    getZodiacSign
  }
};