// src/components/formHandlers.js
// フォームの生成と処理を担当するファイル

// フォーム用選択肢生成関数
const FormInitializers = {
  // 年の選択肢を生成
  populateYearOptions() {
    const yearSelect = document.getElementById('birthYear');
    const currentYear = new Date().getFullYear();

    for (let i = currentYear; i >= currentYear - 100; i--) {
      const option = document.createElement('option');
      option.value = i;
      option.textContent = i + '年';
      yearSelect.appendChild(option);
    }
  },

  // 月の選択肢を生成（改良版：すでにオプションがある場合はクリアしてから追加）
  populateMonthOptions() {
    const monthSelect = document.getElementById('birthMonth');

    // すでにオプションが存在する場合はクリア（デフォルトのオプションは保持）
    while (monthSelect.options.length > 1) {
      monthSelect.remove(1);
    }

    for (let i = 1; i <= 12; i++) {
      const option = document.createElement('option');
      option.value = i;
      option.textContent = i + '月';
      monthSelect.appendChild(option);
    }
  },

  // 日の選択肢を生成（初期は31日分）
  populateDayOptions() {
    const daySelect = document.getElementById('birthDay');

    for (let i = 1; i <= 31; i++) {
      const option = document.createElement('option');
      option.value = i;
      option.textContent = i + '日';
      daySelect.appendChild(option);
    }
  },

  // 時間の選択肢を生成
  populateHourOptions() {
    const hourSelect = document.getElementById('birthHour');

    for (let i = 0; i <= 23; i++) {
      const option = document.createElement('option');
      option.value = i;
      option.textContent = i + '時';
      hourSelect.appendChild(option);
    }
  },

  // 分の選択肢を生成（5分間隔）
  populateMinuteOptions() {
    const minuteSelect = document.getElementById('birthMinute');

    for (let i = 0; i <= 55; i += 5) {
      const option = document.createElement('option');
      option.value = i;
      option.textContent = i.toString().padStart(2, '0') + '分';
      minuteSelect.appendChild(option);
    }
  },

  // 都道府県の選択肢を生成
  populatePrefectureOptions() {
    if (!window.MoonCalculator || !window.MoonCalculator.PREFECTURES) {
      console.error('MoonCalculator not found or PREFECTURES not defined');
      return;
    }

    const prefectureSelect = document.getElementById('birthPrefecture');

    window.MoonCalculator.PREFECTURES.forEach((prefecture, index) => {
      const option = document.createElement('option');
      option.value = index;
      option.textContent = prefecture.name;
      prefectureSelect.appendChild(option);
    });
  },

  // 月と年に基づいて日の選択肢を調整（閏年対応）
  adjustDaysInMonth() {
    const year = parseInt(document.getElementById('birthYear').value) || new Date().getFullYear();
    const month = parseInt(document.getElementById('birthMonth').value);
    const daySelect = document.getElementById('birthDay');
    const currentDay = parseInt(daySelect.value) || 0;

    if (!month) return;

    // 選択された月の日数を取得
    const daysInMonth = new Date(year, month, 0).getDate();

    // 現在の選択肢をクリア
    daySelect.innerHTML = '';

    // デフォルト選択肢を追加
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = '選択してください';
    daySelect.appendChild(defaultOption);

    // 日付の選択肢を追加
    for (let i = 1; i <= daysInMonth; i++) {
      const option = document.createElement('option');
      option.value = i;
      option.textContent = i + '日';
      daySelect.appendChild(option);
    }

    // 前に選択していた日が範囲内なら復元
    if (currentDay > 0 && currentDay <= daysInMonth) {
      daySelect.value = currentDay;
    }
  },

  // すべてのフォーム初期化を実行
  initializeAllFormFields() {
    this.populateYearOptions();
    this.populateMonthOptions();
    this.populateDayOptions();
    this.populateHourOptions();
    this.populateMinuteOptions();
    this.populatePrefectureOptions();
  }
};

// フォームイベントハンドラ
const FormEventHandlers = {
  // 月選択変更時の処理
  handleMonthChange() {
    FormInitializers.adjustDaysInMonth();
  },

  // 年選択変更時の処理
  handleYearChange() {
    FormInitializers.adjustDaysInMonth();
  },

  // 国選択変更時の処理
  handleCountryChange(event) {
    const japanPrefectureContainer = document.getElementById('japanPrefectureContainer');
    const otherCountryContainer = document.getElementById('otherCountryContainer');

    if (event.target.value === 'JP') {
      japanPrefectureContainer.classList.remove('hidden');
      otherCountryContainer.classList.add('hidden');
    } else {
      japanPrefectureContainer.classList.add('hidden');
      otherCountryContainer.classList.remove('hidden');
    }
  },

  // フォーム送信（診断実行）の処理
  handleFormSubmit(event) {
    event.preventDefault();

    // 入力値の取得
    const year = document.getElementById('birthYear').value;
    const month = document.getElementById('birthMonth').value;
    const day = document.getElementById('birthDay').value;
    const hour = document.getElementById('birthHour').value || '12';
    const minute = document.getElementById('birthMinute').value || '0';

    // 入力の検証
    if (!year || !month || !day) {
      alert('生年月日を入力してください');
      return;
    }

    // 緯度と経度の取得
    let latitude, longitude;

    if (document.getElementById('birthCountry').value === 'JP') {
      // 日本の場合は都道府県から座標を取得
      const prefectureSelect = document.getElementById('birthPrefecture');
      const prefectureIndex = prefectureSelect.value;

      if (prefectureIndex && prefectureIndex !== '') {
        const prefecture = window.MoonCalculator.PREFECTURES[parseInt(prefectureIndex)];
        latitude = prefecture.latitude;
        longitude = prefecture.longitude;
      } else {
        alert('都道府県を選択してください');
        return;
      }
    } else {
      // 他の国の場合は直接入力された座標を使用
      latitude = document.getElementById('latitudeInput').value;
      longitude = document.getElementById('longitudeInput').value;

      if (!latitude || !longitude) {
        alert('緯度・経度を入力してください');
        return;
      }
    }

    // 月星座の計算
    const birthData = {
      year, month, day, hour, minute, latitude, longitude
    };

    const moonSignResult = window.MoonCalculator.calculateMoonZodiacSign(birthData);

    if (!moonSignResult.success) {
      alert(moonSignResult.message || '月星座の計算に失敗しました。入力内容を確認してください。');
      return;
    }

    // 計算された月星座を隠しフィールドに保存
    document.getElementById('calculatedMoonSign').value = moonSignResult.moonSign;

    // 数値に変換
    const numYear = parseInt(year);
    const numMonth = parseInt(month);
    const numDay = parseInt(day);

    // 各診断結果の計算
    const potentialType = window.PotentialTypeCalculator.calculatePotentialType(numYear, numMonth, numDay);
    const manifestType = window.ManifestTypeCalculator.calculateManifestType(numYear, numMonth, numDay);
    const misunderstandingType = window.MisunderstandingTypeCalculator.getMisunderstandingType(moonSignResult.moonSign);

    // 結果を隠しフィールドに保存
    document.getElementById('mainTypeHidden').value = manifestType.mainType;
    document.getElementById('subType1Hidden').value = manifestType.subType1;
    document.getElementById('subType2Hidden').value = manifestType.subType2;

    // 結果の表示
    window.PotentialTypeCalculator.displayPotentialResult(potentialType, document.getElementById('potentialResult'));
    window.ManifestTypeCalculator.displayManifestResult(manifestType, document.getElementById('manifestResult'));
    window.MisunderstandingTypeCalculator.displayMisunderstandingResult(misunderstandingType, document.getElementById('misunderstandingResult'));

    // まとめの生成と表示
    window.ResultDisplayers.generateSummary(misunderstandingType, potentialType, manifestType, moonSignResult.moonSign);

    // 結果エリアの表示
    event.target.closest('.bg-white').classList.add('hidden');
    document.getElementById('resultArea').classList.remove('hidden');
    document.getElementById('resultArea').classList.add('result-appear');

    // まとめの生成と表示
    window.ResultDisplayers.generateSummary(misunderstandingType, potentialType, manifestType, moonSignResult.moonSign);

    // ページ上部へスクロール
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  // リセットボタンの処理
  handleResetButtonClick() {
    document.getElementById('diagnosisForm').reset();
    document.getElementById('diagnosisForm').closest('.bg-white').classList.remove('hidden');
    document.getElementById('resultArea').classList.add('hidden');
    document.getElementById('calculatedMoonSign').value = '';

    // 歯車可視化フラグをリセット
    window.gearVisualizationAdded = false;

    // ページ上部へスクロール
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  // すべてのイベントリスナーを設定
  setupAllEventListeners() {
    // フォーム送信
    const form = document.getElementById('diagnosisForm');
    if (form) {
      form.addEventListener('submit', this.handleFormSubmit);
    }

    // リセットボタン
    const resetButton = document.getElementById('resetButton');
    if (resetButton) {
      resetButton.addEventListener('click', this.handleResetButtonClick);
    }

    // 月選択変更
    const monthSelect = document.getElementById('birthMonth');
    if (monthSelect) {
      monthSelect.addEventListener('change', this.handleMonthChange);
    }

    // 年選択変更
    const yearSelect = document.getElementById('birthYear');
    if (yearSelect) {
      yearSelect.addEventListener('change', this.handleYearChange);
    }

    // 国選択変更
    const countrySelect = document.getElementById('birthCountry');
    if (countrySelect) {
      countrySelect.addEventListener('change', this.handleCountryChange);
    }
  }
};

// グローバルスコープにエクスポート
window.FormHandlers = {
  initializers: FormInitializers,
  eventHandlers: FormEventHandlers
};