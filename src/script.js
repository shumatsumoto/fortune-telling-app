// DOM要素が読み込まれた後に実行
document.addEventListener('DOMContentLoaded', function() {
    // フォーム要素の取得
    const form = document.getElementById('diagnosisForm');
    const resultArea = document.getElementById('resultArea');
    const resetButton = document.getElementById('resetButton');
    const potentialResult = document.getElementById('potentialResult');
    const manifestResult = document.getElementById('manifestResult');
    const misunderstandingResult = document.getElementById('misunderstandingResult');
    const calculatedMoonSign = document.getElementById('calculatedMoonSign');
    const birthCountrySelect = document.getElementById('birthCountry');
    const japanPrefectureContainer = document.getElementById('japanPrefectureContainer');
    const otherCountryContainer = document.getElementById('otherCountryContainer');
    
    // 生年月日と時間のセレクトボックスに選択肢を追加
    populateYearOptions();
    populateMonthOptions();
    populateDayOptions();
    populateHourOptions();
    populateMinuteOptions();
    populatePrefectureOptions();
    
    // 国選択の変更イベント
    birthCountrySelect.addEventListener('change', function() {
        if (this.value === 'JP') {
            japanPrefectureContainer.classList.remove('hidden');
            otherCountryContainer.classList.add('hidden');
        } else {
            japanPrefectureContainer.classList.add('hidden');
            otherCountryContainer.classList.remove('hidden');
        }
    });
    
    // フォームの送信イベント（診断実行）
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // 入力値の取得
        const year = document.getElementById('birthYear').value;
        const month = document.getElementById('birthMonth').value;
        const day = document.getElementById('birthDay').value;
        const hour = document.getElementById('birthHour').value || '12';
        const minute = document.getElementById('birthMinute').value || '0';
        
        // 入力値の検証
        if (!year || !month || !day) {
            alert('生年月日を入力してください');
            return;
        }
        
        // 緯度・経度の取得
        let latitude, longitude;
        
        if (birthCountrySelect.value === 'JP') {
            // 日本の場合は都道府県から緯度経度を取得
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
            // その他の国の場合は入力された緯度経度を使用
            latitude = document.getElementById('latitudeInput').value;
            longitude = document.getElementById('longitudeInput').value;
            
            if (!latitude || !longitude) {
                alert('緯度・経度を入力してください');
                return;
            }
        }
        
        // 月星座を計算
        const birthData = {
            year, month, day, hour, minute, latitude, longitude
        };
        
        const moonSignResult = window.MoonCalculator.calculateMoonZodiacSign(birthData);
        
        if (!moonSignResult.success) {
            alert(moonSignResult.message || '月星座の計算に失敗しました。入力内容を確認してください。');
            return;
        }
        
        // 計算された月星座をhiddenフィールドに保存
        calculatedMoonSign.value = moonSignResult.moonSign;
        
        // 数値型に変換
        const numYear = parseInt(year);
        const numMonth = parseInt(month);
        const numDay = parseInt(day);
        
        // 診断結果の計算 - 分離したファイルの関数を使用
        const potentialType = window.PotentialTypeCalculator.calculatePotentialType(numYear, numMonth, numDay);
        const manifestType = window.ManifestTypeCalculator.calculateManifestType(numYear, numMonth, numDay);
        const misunderstandingType = window.MisunderstandingTypeCalculator.getMisunderstandingType(moonSignResult.moonSign);
        
        // 結果の表示 - 分離したファイルの関数を使用
        window.PotentialTypeCalculator.displayPotentialResult(potentialType, potentialResult);
        window.ManifestTypeCalculator.displayManifestResult(manifestType, manifestResult);
        window.MisunderstandingTypeCalculator.displayMisunderstandingResult(misunderstandingType, misunderstandingResult);
        
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
        calculatedMoonSign.value = '';
        
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
    
    // 時間選択肢の生成（0-23時）
    function populateHourOptions() {
        const hourSelect = document.getElementById('birthHour');
        
        for (let i = 0; i <= 23; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i + '時';
            hourSelect.appendChild(option);
        }
    }
    
    // 分選択肢の生成（0-59分、5分間隔）
    function populateMinuteOptions() {
        const minuteSelect = document.getElementById('birthMinute');
        
        for (let i = 0; i <= 55; i += 5) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i.toString().padStart(2, '0') + '分';
            minuteSelect.appendChild(option);
        }
    }
    
    // 都道府県選択肢の生成
    function populatePrefectureOptions() {
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