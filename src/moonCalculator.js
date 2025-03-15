// 月星座計算ライブラリ
// 簡略化した月星座計算ロジックを実装

// 日本の都道府県データ（名前、緯度、経度）
const PREFECTURES = [
  { name: '北海道', latitude: 43.064301, longitude: 141.346874 },
  { name: '青森県', latitude: 40.824623, longitude: 140.740593 },
  { name: '岩手県', latitude: 39.703531, longitude: 141.152667 },
  { name: '宮城県', latitude: 38.268839, longitude: 140.872103 },
  { name: '秋田県', latitude: 39.718600, longitude: 140.102334 },
  { name: '山形県', latitude: 38.240437, longitude: 140.363634 },
  { name: '福島県', latitude: 37.750301, longitude: 140.467522 },
  { name: '茨城県', latitude: 36.341811, longitude: 140.446793 },
  { name: '栃木県', latitude: 36.565725, longitude: 139.883565 },
  { name: '群馬県', latitude: 36.390668, longitude: 139.060406 },
  { name: '埼玉県', latitude: 35.857428, longitude: 139.648933 },
  { name: '千葉県', latitude: 35.605058, longitude: 140.123308 },
  { name: '東京都', latitude: 35.689487, longitude: 139.691711 },
  { name: '神奈川県', latitude: 35.447753, longitude: 139.642514 },
  { name: '新潟県', latitude: 37.902418, longitude: 139.023221 },
  { name: '富山県', latitude: 36.695290, longitude: 137.211338 },
  { name: '石川県', latitude: 36.594682, longitude: 136.625573 },
  { name: '福井県', latitude: 36.065219, longitude: 136.221642 },
  { name: '山梨県', latitude: 35.664158, longitude: 138.568449 },
  { name: '長野県', latitude: 36.651289, longitude: 138.181224 },
  { name: '岐阜県', latitude: 35.391227, longitude: 136.722291 },
  { name: '静岡県', latitude: 34.977117, longitude: 138.383084 },
  { name: '愛知県', latitude: 35.180188, longitude: 136.906565 },
  { name: '三重県', latitude: 34.730283, longitude: 136.508588 },
  { name: '滋賀県', latitude: 35.004531, longitude: 135.868590 },
  { name: '京都府', latitude: 35.021247, longitude: 135.755597 },
  { name: '大阪府', latitude: 34.686316, longitude: 135.519711 },
  { name: '兵庫県', latitude: 34.691269, longitude: 135.183071 },
  { name: '奈良県', latitude: 34.685334, longitude: 135.832742 },
  { name: '和歌山県', latitude: 34.226034, longitude: 135.167506 },
  { name: '鳥取県', latitude: 35.503891, longitude: 134.237736 },
  { name: '島根県', latitude: 35.472297, longitude: 133.050499 },
  { name: '岡山県', latitude: 34.661772, longitude: 133.934675 },
  { name: '広島県', latitude: 34.396560, longitude: 132.459622 },
  { name: '山口県', latitude: 34.185956, longitude: 131.470649 },
  { name: '徳島県', latitude: 34.065770, longitude: 134.559303 },
  { name: '香川県', latitude: 34.340149, longitude: 134.043444 },
  { name: '愛媛県', latitude: 33.841624, longitude: 132.765681 },
  { name: '高知県', latitude: 33.559705, longitude: 133.531080 },
  { name: '福岡県', latitude: 33.606785, longitude: 130.418314 },
  { name: '佐賀県', latitude: 33.249442, longitude: 130.299794 },
  { name: '長崎県', latitude: 32.744839, longitude: 129.873756 },
  { name: '熊本県', latitude: 32.789827, longitude: 130.741667 },
  { name: '大分県', latitude: 33.238194, longitude: 131.612591 },
  { name: '宮崎県', latitude: 31.911090, longitude: 131.423855 },
  { name: '鹿児島県', latitude: 31.560146, longitude: 130.557978 },
  { name: '沖縄県', latitude: 26.212401, longitude: 127.680932 }
];

// 星座の境界日（月の星座用）
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

// 月の位置を計算する関数（簡略版）
function calculateMoonPosition(year, month, day, hour, minute, latitude, longitude) {
  // 日付をJulian Dayに変換
  const jd = getJulianDay(year, month, day, hour, minute);
  
  // 月の平均黄経を計算（簡略版）
  const T = (jd - 2451545.0) / 36525; // J2000からの世紀数
  
  // 月の平均軌道要素（単位: 度）
  const L0 = 218.3164477 + 481267.88123421 * T - 0.0015786 * T * T; // 平均黄経
  const M = 134.9634114 + 477198.8676313 * T + 0.0089970 * T * T;   // 平均近点角
  const F = 93.2720993 + 483202.0175273 * T - 0.0034029 * T * T;    // 平均黄緯引数
  
  // 主要な摂動項（簡略化）
  let dL = 6.289 * Math.sin(M * Math.PI / 180);
  dL += 1.274 * Math.sin((2 * F - M) * Math.PI / 180);
  dL += 0.658 * Math.sin(2 * F * Math.PI / 180);
  dL += 0.214 * Math.sin(2 * M * Math.PI / 180);
  
  // 月の視黄経（度）
  let moonLongitude = (L0 + dL) % 360;
  if (moonLongitude < 0) moonLongitude += 360;
  
  // 時差補正（簡易版）
  const timeZoneOffset = 9; // 日本標準時（UTC+9）
  const localTimeCorrection = longitude / 15 - timeZoneOffset;
  
  // 補正値を加味（実際の計算はもっと複雑だが、簡略化）
  moonLongitude += localTimeCorrection * 0.5;
  
  return moonLongitude;
}

// 黄経から星座を決定する関数
function getZodiacSign(longitude) {
  for (let i = ZODIAC_BOUNDARIES.length - 1; i >= 0; i--) {
    if (longitude >= ZODIAC_BOUNDARIES[i].startDegree) {
      return ZODIAC_BOUNDARIES[i].sign;
    }
  }
  return ZODIAC_BOUNDARIES[0].sign; // 0度未満の場合（通常はないが）
}

// 日付をJulian Dayに変換する関数
function getJulianDay(year, month, day, hour, minute) {
  if (month <= 2) {
    year -= 1;
    month += 12;
  }
  
  const a = Math.floor(year / 100);
  const b = 2 - a + Math.floor(a / 4);
  
  const jd = Math.floor(365.25 * (year + 4716)) + 
             Math.floor(30.6001 * (month + 1)) + 
             day + b - 1524.5 +
             (hour + minute / 60) / 24.0;
  
  return jd;
}

// 月星座を計算する関数（メイン関数）
function calculateMoonZodiacSign(birthData) {
  const { year, month, day, hour, minute, latitude, longitude } = birthData;
  
  // 入力値の検証
  if (!year || !month || !day) {
    return { success: false, message: "生年月日を入力してください" };
  }
  
  try {
    // 月の黄経を計算
    const moonLongitude = calculateMoonPosition(
      parseInt(year), 
      parseInt(month), 
      parseInt(day), 
      parseInt(hour || 12), 
      parseInt(minute || 0), 
      parseFloat(latitude || 35.6895), 
      parseFloat(longitude || 139.6917)
    );
    
    // 黄経から星座を決定
    const moonSign = getZodiacSign(moonLongitude);
    
    return {
      success: true,
      moonSign: moonSign,
      longitude: moonLongitude
    };
  } catch (error) {
    console.error("月星座計算エラー:", error);
    return { success: false, message: "計算中にエラーが発生しました" };
  }
}

// グローバルにエクスポート
window.MoonCalculator = {
  calculateMoonZodiacSign,
  PREFECTURES
};
