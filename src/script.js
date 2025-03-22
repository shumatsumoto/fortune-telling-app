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
    const summaryText = document.getElementById('summaryText');
    
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

        // 計算結果を隠しフィールドに保存
        document.getElementById('mainTypeHidden').value = manifestType.mainType;
        document.getElementById('subType1Hidden').value = manifestType.subType1;
        document.getElementById('subType2Hidden').value = manifestType.subType2;

        // 結果の表示 - 分離したファイルの関数を使用
        window.PotentialTypeCalculator.displayPotentialResult(potentialType, potentialResult);
        window.ManifestTypeCalculator.displayManifestResult(manifestType, manifestResult);
        window.MisunderstandingTypeCalculator.displayMisunderstandingResult(misunderstandingType, misunderstandingResult);
        
        // 結果のまとめを生成して表示
        generateSummary(misunderstandingType, potentialType, manifestType, moonSignResult.moonSign);
        
        // 結果エリアの表示
        form.closest('.bg-white').classList.add('hidden');
        resultArea.classList.remove('hidden');
        resultArea.classList.add('result-appear');
        
        // 歯車の可視化を追加
        addGearVisualization();
        
        // ページトップにスクロール
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    // 歯車の可視化を追加する関数
    function addGearVisualization() {
        // manifestTypes object definition (needed for display)
        const manifestTypes = {
            1: '創造（自信）',
            2: '人間関係（バランス）',
            3: '感情、感性（表現）',
            4: '安心安定（過程）',
            5: '自由（学び）',
            6: '理想、満足',
            7: '信頼・委任',
            8: '豊かさ・受容',
            9: '高尚・叡智',
            0: '霊感・異質な力'
        };

        // Get calculated manifest type values (from hidden fields)
        const mainTypeEl = document.getElementById('mainTypeHidden');
        const subType1El = document.getElementById('subType1Hidden');
        const subType2El = document.getElementById('subType2Hidden');

        // Default values if not found
        const mainType = mainTypeEl ? mainTypeEl.value : '?';
        const subType1 = subType1El ? subType1El.value : '?';
        const subType2 = subType2El ? subType2El.value : '?';

        // Check if any subtype is zero
        const hasZero = subType1 === '0' || subType2 === '0';

        // Determine if main type contains zero
        const mainHasZero = mainType === '0' || mainType === '10' || mainType === '20' ||
          mainType === '30' || mainType === '40' || mainType === '50' ||
          mainType === '60' || mainType === '70' || mainType === '80' ||
          mainType === '90';

        // Determine which non-zero subtype to display when one is zero
        const nonZeroSub = subType1 === '0' ? subType2 : subType1;

        // Create gear visualization container
        const gearContainer = document.createElement('div');
        gearContainer.className = 'gear-visualization-container bg-white rounded-lg shadow-lg p-4 mb-6 max-w-4xl mx-auto';

        // SVG content - with adjustments for zero cases
        if (hasZero) {
            // Only one subtheme gear when there's a zero
            gearContainer.innerHTML = `
            <h3 class="text-xl font-semibold text-purple-700 mb-4 flex items-center">
                <span class="text-2xl mr-2">⚙️</span>
                顕在個性の歯車構造
                ${hasZero ? '<span class="ml-2 text-sm font-normal text-purple-500">(特殊パターン)</span>' : ''}
            </h3>
            <div class="gear-svg-container">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 220">
                    <!-- Single Subtheme gear (with zero amplification) -->
                    <g transform="translate(300, 110)" class="sub-gear">
                        <!-- Gear outline with special styling for zero enhancement -->
                        <circle cx="0" cy="0" r="60" fill="url(#zero-gradient)" fill-opacity="0.2" stroke="#7c3aed" stroke-width="1.5"/>
                        <circle cx="0" cy="0" r="25" fill="#f9fafb" stroke="#7c3aed" stroke-width="1"/>
                        
                        <!-- Magical aura to represent zero's amplification -->
                        <circle cx="0" cy="0" r="70" fill="none" stroke="#7c3aed" stroke-width="0.5" stroke-dasharray="2,3" opacity="0.7">
                            <animate attributeName="r" values="65;75;65" dur="3s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0.7;0.3;0.7" dur="3s" repeatCount="indefinite" />
                        </circle>
                        
                        <!-- Text background for better readability -->
                        <rect x="-55" y="-20" width="110" height="40" rx="4" fill="#f9fafb" fill-opacity="0.9"/>
                        
                        <!-- Text content -->
                        <text x="0" y="-5" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif" font-size="14" font-weight="bold" fill="#6d28d9">サブテーマ</text>
                        <text x="0" y="15" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif" font-size="16" font-weight="bold" fill="#6d28d9">${manifestTypes[nonZeroSub]}</text>
                        <text x="0" y="35" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif" font-size="12" fill="#9061f9">＋霊感・増幅</text>
                        
                        <!-- Teeth for sub gear with special styling -->
                        <g opacity="0.7">
                            <path d="M 10,-70 L 12,-80 L -12,-80 L -10,-70 Z" fill="#7c3aed" transform="rotate(0)"/>
                            <path d="M 10,-70 L 12,-80 L -12,-80 L -10,-70 Z" fill="#7c3aed" transform="rotate(36)"/>
                            <path d="M 10,-70 L 12,-80 L -12,-80 L -10,-70 Z" fill="#7c3aed" transform="rotate(72)"/>
                            <path d="M 10,-70 L 12,-80 L -12,-80 L -10,-70 Z" fill="#7c3aed" transform="rotate(108)"/>
                            <path d="M 10,-70 L 12,-80 L -12,-80 L -10,-70 Z" fill="#7c3aed" transform="rotate(144)"/>
                            <path d="M 10,-70 L 12,-80 L -12,-80 L -10,-70 Z" fill="#7c3aed" transform="rotate(180)"/>
                            <path d="M 10,-70 L 12,-80 L -12,-80 L -10,-70 Z" fill="#7c3aed" transform="rotate(216)"/>
                            <path d="M 10,-70 L 12,-80 L -12,-80 L -10,-70 Z" fill="#7c3aed" transform="rotate(252)"/>
                            <path d="M 10,-70 L 12,-80 L -12,-80 L -10,-70 Z" fill="#7c3aed" transform="rotate(288)"/>
                            <path d="M 10,-70 L 12,-80 L -12,-80 L -10,-70 Z" fill="#7c3aed" transform="rotate(324)"/>
                        </g>
                    </g>

                    <!-- Main gear (largest) -->
                    <g transform="translate(600, 110)" class="main-gear">
                        <!-- Gear outline with special styling if main has zero -->
                        <circle cx="0" cy="0" r="80" fill="${mainHasZero ? 'url(#zero-gradient)' : '#8a5cf6'}" fill-opacity="${mainHasZero ? '0.2' : '0.05'}" stroke="#6b46c1" stroke-width="2"/>
                        <circle cx="0" cy="0" r="30" fill="#f9fafb" stroke="#6b46c1" stroke-width="1.5"/>
                        
                        ${mainHasZero ? `
                        <!-- Magical aura for zero in main type -->
                        <circle cx="0" cy="0" r="95" fill="none" stroke="#6b46c1" stroke-width="0.5" stroke-dasharray="3,4" opacity="0.6">
                            <animate attributeName="r" values="90;100;90" dur="4s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0.6;0.2;0.6" dur="4s" repeatCount="indefinite" />
                        </circle>
                        ` : ''}
                        
                        <!-- Text background for better readability -->
                        <rect x="-75" y="-25" width="150" height="${mainHasZero ? '55' : '40'}" rx="4" fill="#f9fafb" fill-opacity="0.9"/>
                        
                        <!-- Text content -->
                        <text x="0" y="-5" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif" font-size="14" font-weight="bold" fill="#6d28d9">メインテーマ</text>
                        <text x="0" y="15" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif" font-size="16" font-weight="bold" fill="#6d28d9">
                            ${mainType === '0' ? manifestTypes[0] :
              mainType === '10' || mainType === '20' || mainType === '30' || mainType === '40' ||
              mainType === '50' || mainType === '60' || mainType === '70' || mainType === '80' ||
              mainType === '90' ?
                manifestTypes[mainType.charAt(0)] : manifestTypes[mainType] || manifestTypes[9]}
                        </text>
                        ${mainHasZero ? `
                        <text x="0" y="35" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif" font-size="12" fill="#9061f9">＋霊感・増幅</text>
                        ` : ''}
                        
                        <!-- Teeth for main gear -->
                        <g opacity="0.6">
                            <path d="M 15,-95 L 17,-110 L -17,-110 L -15,-95 Z" fill="#6b46c1" transform="rotate(0)"/>
                            <path d="M 15,-95 L 17,-110 L -17,-110 L -15,-95 Z" fill="#6b46c1" transform="rotate(30)"/>
                            <path d="M 15,-95 L 17,-110 L -17,-110 L -15,-95 Z" fill="#6b46c1" transform="rotate(60)"/>
                            <path d="M 15,-95 L 17,-110 L -17,-110 L -15,-95 Z" fill="#6b46c1" transform="rotate(90)"/>
                            <path d="M 15,-95 L 17,-110 L -17,-110 L -15,-95 Z" fill="#6b46c1" transform="rotate(120)"/>
                            <path d="M 15,-95 L 17,-110 L -17,-110 L -15,-95 Z" fill="#6b46c1" transform="rotate(150)"/>
                            <path d="M 15,-95 L 17,-110 L -17,-110 L -15,-95 Z" fill="#6b46c1" transform="rotate(180)"/>
                            <path d="M 15,-95 L 17,-110 L -17,-110 L -15,-95 Z" fill="#6b46c1" transform="rotate(210)"/>
                            <path d="M 15,-95 L 17,-110 L -17,-110 L -15,-95 Z" fill="#6b46c1" transform="rotate(240)"/>
                            <path d="M 15,-95 L 17,-110 L -17,-110 L -15,-95 Z" fill="#6b46c1" transform="rotate(270)"/>
                            <path d="M 15,-95 L 17,-110 L -17,-110 L -15,-95 Z" fill="#6b46c1" transform="rotate(300)"/>
                            <path d="M 15,-95 L 17,-110 L -17,-110 L -15,-95 Z" fill="#6b46c1" transform="rotate(330)"/>
                        </g>
                    </g>

                    <!-- Connecting line between gears (with special styling) -->
                    <line x1="350" y1="110" x2="520" y2="110" stroke="#8b5cf6" stroke-width="2" stroke-dasharray="5,5" opacity="0.6"/>
                    
                    <!-- Gradient definitions -->
                    <defs>
                        <radialGradient id="zero-gradient" cx="50%" cy="50%" r="75%" fx="50%" fy="50%">
                            <stop offset="0%" style="stop-color:#c4b5fd;stop-opacity:1" />
                            <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:0.1" />
                        </radialGradient>
                    </defs>
                </svg>
            </div>
            <p class="text-sm text-purple-600 mt-2 text-center">
                このケースでは、「霊感・異質な力」(0)によってサブテーマが増幅されています。<br>
                このサブテーマを意識することでメインテーマを効果的に動かせます。
            </p>
        `;
        } else {
            // Original three-gear visualization for non-zero cases
            gearContainer.innerHTML = `
            <h3 class="text-xl font-semibold text-purple-700 mb-4 flex items-center">
                <span class="text-2xl mr-2">⚙️</span>
                顕在個性の歯車構造
            </h3>
            <div class="gear-svg-container">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 220">
                    <!-- Sub-theme 2 gear (smallest) - now on left -->
                    <g transform="translate(200, 110)" class="sub-gear-2">
                        <!-- Gear outline with lighter fill -->
                        <circle cx="0" cy="0" r="40" fill="#c4b5fd" fill-opacity="0.05" stroke="#8b5cf6" stroke-width="1.5"/>
                        <circle cx="0" cy="0" r="18" fill="#f9fafb" stroke="#8b5cf6" stroke-width="1"/>
                        
                        <!-- Text background for better readability -->
                        <rect x="-55" y="-20" width="110" height="40" rx="4" fill="#f9fafb" fill-opacity="0.9"/>
                        
                        <!-- Text content -->
                        <text x="0" y="-5" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif" font-size="14" font-weight="bold" fill="#6d28d9">サブテーマ2</text>
                        <text x="0" y="20" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif" font-size="16" font-weight="bold" fill="#6d28d9">${manifestTypes[subType2]}</text>
                        
                        <!-- Teeth for sub gear 2 (lighter color) -->
                        <g opacity="0.6">
                            <path d="M 8,-47 L 10,-55 L -10,-55 L -8,-47 Z" fill="#8b5cf6" transform="rotate(0)"/>
                            <path d="M 8,-47 L 10,-55 L -10,-55 L -8,-47 Z" fill="#8b5cf6" transform="rotate(45)"/>
                            <path d="M 8,-47 L 10,-55 L -10,-55 L -8,-47 Z" fill="#8b5cf6" transform="rotate(90)"/>
                            <path d="M 8,-47 L 10,-55 L -10,-55 L -8,-47 Z" fill="#8b5cf6" transform="rotate(135)"/>
                            <path d="M 8,-47 L 10,-55 L -10,-55 L -8,-47 Z" fill="#8b5cf6" transform="rotate(180)"/>
                            <path d="M 8,-47 L 10,-55 L -10,-55 L -8,-47 Z" fill="#8b5cf6" transform="rotate(225)"/>
                            <path d="M 8,-47 L 10,-55 L -10,-55 L -8,-47 Z" fill="#8b5cf6" transform="rotate(270)"/>
                            <path d="M 8,-47 L 10,-55 L -10,-55 L -8,-47 Z" fill="#8b5cf6" transform="rotate(315)"/>
                        </g>
                    </g>

                    <!-- Sub-theme 1 gear (medium) - now in middle -->
                    <g transform="translate(375, 110)" class="sub-gear-1">
                        <!-- Gear outline with lighter fill -->
                        <circle cx="0" cy="0" r="60" fill="#a78bfa" fill-opacity="0.05" stroke="#7c3aed" stroke-width="1.5"/>
                        <circle cx="0" cy="0" r="25" fill="#f9fafb" stroke="#7c3aed" stroke-width="1"/>
                        
                        <!-- Text background for better readability -->
                        <rect x="-55" y="-20" width="110" height="40" rx="4" fill="#f9fafb" fill-opacity="0.9"/>
                        
                        <!-- Text content -->
                        <text x="0" y="-5" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif" font-size="14" font-weight="bold" fill="#6d28d9">サブテーマ1</text>
                        <text x="0" y="20" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif" font-size="16" font-weight="bold" fill="#6d28d9">${manifestTypes[subType1]}</text>
                        
                        <!-- Teeth for sub gear 1 (lighter color) -->
                        <g opacity="0.6">
                            <path d="M 10,-70 L 12,-80 L -12,-80 L -10,-70 Z" fill="#7c3aed" transform="rotate(0)"/>
                            <path d="M 10,-70 L 12,-80 L -12,-80 L -10,-70 Z" fill="#7c3aed" transform="rotate(36)"/>
                            <path d="M 10,-70 L 12,-80 L -12,-80 L -10,-70 Z" fill="#7c3aed" transform="rotate(72)"/>
                            <path d="M 10,-70 L 12,-80 L -12,-80 L -10,-70 Z" fill="#7c3aed" transform="rotate(108)"/>
                            <path d="M 10,-70 L 12,-80 L -12,-80 L -10,-70 Z" fill="#7c3aed" transform="rotate(144)"/>
                            <path d="M 10,-70 L 12,-80 L -12,-80 L -10,-70 Z" fill="#7c3aed" transform="rotate(180)"/>
                            <path d="M 10,-70 L 12,-80 L -12,-80 L -10,-70 Z" fill="#7c3aed" transform="rotate(216)"/>
                            <path d="M 10,-70 L 12,-80 L -12,-80 L -10,-70 Z" fill="#7c3aed" transform="rotate(252)"/>
                            <path d="M 10,-70 L 12,-80 L -12,-80 L -10,-70 Z" fill="#7c3aed" transform="rotate(288)"/>
                            <path d="M 10,-70 L 12,-80 L -12,-80 L -10,-70 Z" fill="#7c3aed" transform="rotate(324)"/>
                        </g>
                    </g>

                    <!-- Main gear (largest) - now on right -->
                    <g transform="translate(600, 110)" class="main-gear">
                        <!-- Gear outline with lighter fill -->
                        <circle cx="0" cy="0" r="80" fill="${mainHasZero ? 'url(#zero-gradient)' : '#8a5cf6'}" fill-opacity="${mainHasZero ? '0.2' : '0.05'}" stroke="#6b46c1" stroke-width="2"/>
                        <circle cx="0" cy="0" r="30" fill="#f9fafb" stroke="#6b46c1" stroke-width="1.5"/>
                        
                        ${mainHasZero ? `
                        <!-- Magical aura for zero in main type -->
                        <circle cx="0" cy="0" r="95" fill="none" stroke="#6b46c1" stroke-width="0.5" stroke-dasharray="3,4" opacity="0.6">
                            <animate attributeName="r" values="90;100;90" dur="4s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0.6;0.2;0.6" dur="4s" repeatCount="indefinite" />
                        </circle>
                        ` : ''}
                        
                        <!-- Text background for better readability -->
                        <rect x="-75" y="-25" width="150" height="${mainHasZero ? '55' : '40'}" rx="4" fill="#f9fafb" fill-opacity="0.9"/>
                        
                        <!-- Text content -->
                        <text x="0" y="-5" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif" font-size="14" font-weight="bold" fill="#6d28d9">メインテーマ</text>
                        <text x="0" y="15" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif" font-size="16" font-weight="bold" fill="#6d28d9">
                            ${mainType === '0' ? manifestTypes[0] :
              mainType === '10' || mainType === '20' || mainType === '30' || mainType === '40' ||
              mainType === '50' || mainType === '60' || mainType === '70' || mainType === '80' ||
              mainType === '90' ?
                manifestTypes[mainType.charAt(0)] : manifestTypes[mainType] || manifestTypes[9]}
                        </text>
                        ${mainHasZero ? `
                        <text x="0" y="35" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif" font-size="12" fill="#9061f9">＋霊感・増幅</text>
                        ` : ''}
                        
                        <!-- Teeth for main gear -->
                        <g opacity="0.6">
                            <path d="M 15,-95 L 17,-110 L -17,-110 L -15,-95 Z" fill="#6b46c1" transform="rotate(0)"/>
                            <path d="M 15,-95 L 17,-110 L -17,-110 L -15,-95 Z" fill="#6b46c1" transform="rotate(30)"/>
                            <path d="M 15,-95 L 17,-110 L -17,-110 L -15,-95 Z" fill="#6b46c1" transform="rotate(60)"/>
                            <path d="M 15,-95 L 17,-110 L -17,-110 L -15,-95 Z" fill="#6b46c1" transform="rotate(90)"/>
                            <path d="M 15,-95 L 17,-110 L -17,-110 L -15,-95 Z" fill="#6b46c1" transform="rotate(120)"/>
                            <path d="M 15,-95 L 17,-110 L -17,-110 L -15,-95 Z" fill="#6b46c1" transform="rotate(150)"/>
                            <path d="M 15,-95 L 17,-110 L -17,-110 L -15,-95 Z" fill="#6b46c1" transform="rotate(180)"/>
                            <path d="M 15,-95 L 17,-110 L -17,-110 L -15,-95 Z" fill="#6b46c1" transform="rotate(210)"/>
                            <path d="M 15,-95 L 17,-110 L -17,-110 L -15,-95 Z" fill="#6b46c1" transform="rotate(240)"/>
                            <path d="M 15,-95 L 17,-110 L -17,-110 L -15,-95 Z" fill="#6b46c1" transform="rotate(270)"/>
                            <path d="M 15,-95 L 17,-110 L -17,-110 L -15,-95 Z" fill="#6b46c1" transform="rotate(300)"/>
                            <path d="M 15,-95 L 17,-110 L -17,-110 L -15,-95 Z" fill="#6b46c1" transform="rotate(330)"/>
                        </g>
                    </g>

                    <!-- Connecting lines between gears (lighter) -->
                    <line x1="240" y1="110" x2="340" y2="110" stroke="#8b5cf6" stroke-width="2" stroke-dasharray="5,5" opacity="0.6"/>
                    <line x1="400" y1="110" x2="520" y2="110" stroke="#8b5cf6" stroke-width="2" stroke-dasharray="5,5" opacity="0.6"/>

                    <!-- Gradient definitions -->
                    <defs>
                        <radialGradient id="zero-gradient" cx="50%" cy="50%" r="75%" fx="50%" fy="50%">
                            <stop offset="0%" style="stop-color:#c4b5fd;stop-opacity:1" />
                            <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:0.1" />
                        </radialGradient>
                    </defs>
                </svg>
            </div>
            <p class="text-sm text-purple-600 mt-2 text-center">メインテーマを動かすには、小さな歯車（サブテーマ2）を動かすことが大切です。<br>→大きな歯車よりも、小さな歯車の方が動かしやすい。</p>
        `;
        }

        // Insert after the summary section, before the three-card grid
        const resultArea = document.getElementById('resultArea');
        const summarySection = document.querySelector('#resultArea > div:nth-child(2)');
        resultArea.insertBefore(gearContainer, summarySection.nextSibling);
    }
    
    // 結果のまとめを生成する関数
    function generateSummary(misunderstandingType, potentialType, manifestType, moonSign) {
        const potentialTypes = {
            1: '宇宙（天）',
            2: '金（ゴールド）',
            3: '炎（火）',
            4: '樹木',
            5: '風',
            6: '水',
            7: '山',
            8: '土（地面）'
        };

        const manifestTypes = {
            1: '創造（自信）',
            2: '人間関係（バランス）',
            3: '感情、感性（表現）',
            4: '安心安定（過程）',
            5: '自由（学び）',
            6: '理想、満足',
            7: '信頼・委任',
            8: '豊かさ・受容',
            9: '高尚・叡智',
            0: '霊感・異質な力'
        };

        // 潜在個性の特徴説明を追加
        const potentialDescriptions = {
            1: '上昇志向が高く、本質的なことを知る能力があります。エネルギッシュで視野が広い特徴があります。',
            2: '言葉によるコミュニケーション能力に優れ、五感を生かして華やかさを持って人を引きつけます。',
            3: '情熱的で美しいものを扱うのが得意です。物事の表面を照らし、見えなかったことを表に出します。',
            4: '何かを広く伝え、多くの人に影響を与える力があります。冒険好きで、人の勇気を引き出します。',
            5: '自由を愛し、制限や束縛から出ていく力があります。独創的な視点で物事を見ることができます。',
            6: '物事を集中的に掘り下げ、極めていく能力があります。内側から湧いてくるパワーを活かせます。',
            7: 'どっしり構えて安定感があり、何かを長く続けて積み上げていく力があります。忍耐強い特徴があります。',
            8: '立場やアイデンティティを得ることで安定を手に入れます。柔軟に受け入れ、場を和ませる力があります。'
        };

        // 先祖からの応援内容の詳細説明
        const ancestorSupportDescriptions = {
            1: '先祖はあなたの高い志や理想を追求する姿を応援しています。真理や悟りを探求する際に、先祖の力が特に強く働きます。視野の広さや展望の高さを生かした行動をとると、背中を押してもらえるでしょう。',
            2: '先祖は、あなたが言葉や会話の力を通じて人々と交流することを応援しています。コミュニケーションや表現力を生かした活動をすると、先祖の力を強く感じられるでしょう。経済的な豊かさも応援されています。',
            3: '先祖は、あなたの情熱的な表現力や美的センスを応援しています。美しいものを扱ったり、心が踊ることをすると、先祖からの後押しを感じられるでしょう。芸術的な活動や感情表現が特に応援されています。',
            4: '先祖は、あなたが広く影響力を持ち、多くの人に何かを伝えることを応援しています。冒険や挑戦、他者への良い影響を与える活動をすると、先祖の力が強く働くでしょう。人の勇気を引き出す行動を応援しています。',
            5: '先祖は、あなたの自由を求める心や束縛からの解放を応援しています。独創的な視点や常識にとらわれない考え方を持つことで、先祖の力を感じられるでしょう。新しい発想や異なる視点からの挑戦が応援されています。',
            6: '先祖は、あなたが何かを深く掘り下げ、極めていく姿を応援しています。集中力を発揮して一つのことに取り組むと、先祖の力を強く感じられるでしょう。知的探求や内面的な成長も大きく応援されています。',
            7: '先祖は、あなたの忍耐強さと継続する力を応援しています。長期的な視点で物事を積み上げていく姿勢が、先祖からの大きな後押しを受けるでしょう。安定感のある行動やマイペースな生き方が応援されています。',
            8: '先祖は、あなたが安定した立場や役割を通じて生きることを応援しています。周囲と調和しながら、場を和ませる力を発揮すると、先祖の力を感じられるでしょう。アイデンティティの確立や受容性の高さが応援されています。'
        };

        // 今回の人生の環境設定の詳細説明
        const lifeEnvironmentDescriptions = {
            1: '今回の人生では、「宇宙（天）」の環境に置かれています。高いレベルの知識や真理に触れる機会が多く訪れ、上昇志向を発揮しやすい環境です。エネルギッシュに活動し、視野を広げることで、自分の潜在能力を最大限に発揮できるでしょう。',
            2: '今回の人生では、「金（ゴールド）」の環境に置かれています。言葉によるコミュニケーションや経済的な面での成長機会に恵まれています。五感を活用し、華やかさを持って人を引きつける力を発揮できる環境です。',
            3: '今回の人生では、「炎（火）」の環境に置かれています。情熱的に何かに取り組み、美しいものに触れる機会に恵まれています。物事の本質を照らし出し、見えなかったことを表に出す役割を担っているようです。',
            4: '今回の人生では、「樹木」の環境に置かれています。広く伝えることや多くの人に影響を与える機会に恵まれています。冒険心を持って行動し、人々の勇気を引き出す役割を担う環境です。行動力を発揮できる場面が多いでしょう。',
            5: '今回の人生では、「風」の環境に置かれています。自由に行動し、制限や束縛から解放される機会が多く訪れます。独創的な視点で物事を見て、常識にとらわれない発想を活かせる環境です。新しい風を吹き込む役割があるようです。',
            6: '今回の人生では、「水」の環境に置かれています。何かを集中的に掘り下げ、極めていく機会に恵まれています。内側から湧き出るパワーを活かし、深い洞察力を発揮できる環境です。知的探求が実を結びやすいでしょう。',
            7: '今回の人生では、「山」の環境に置かれています。安定感を持って物事に取り組み、長く続けて積み上げていく力を発揮できる環境です。忍耐強く自分のペースを守りながら進むことで、確実な結果を得られるでしょう。',
            8: '今回の人生では、「土（地面）」の環境に置かれています。確かな立場やアイデンティティを築き、安定を得る機会に恵まれています。柔軟に人や状況を受け入れ、場を和ませる役割を担う環境です。人と人をつなげる橋渡し役として活躍できるでしょう。'
        };

        // 勘違いタイプの対処法
        const misunderstandingAdvice = {
            'できるタイプ': '自分が「できる人」「カッコいい人」である必要はありません。自己像にとらわれず、ありのままの自分を受け入れましょう。',
            '自称HSPタイプ': '実は繊細さが強みではないことを受け入れると、本来の強みが見えてきます。空気を読まなくても大丈夫です。',
            '知的タイプ': '答えを出す必要はありません。知性を誇示するより、自分の本当の魅力を見つけましょう。',
            '優しいタイプ': '言葉にされていない感情を理解するのが苦手でも問題ありません。あなたなりの関わり方を大切にしましょう。',
            '人事エキスパートタイプ': '人を見る目がなくても大丈夫です。人間関係のコントロールよりも、あなた自身の個性を活かしましょう。',
            '開けっぱなし症候群': '複数のことを同時にするより、一つずつ確実に終わらせることを意識しましょう。クロージングの重要性を理解します。',
            '公平タイプ': '公平であろうとする必要はありません。あなたの好き嫌いを大切にして、正直な気持ちで判断しても良いのです。',
            '違和感センサータイプ': '疑いから入るより、素直に受け入れることで真実に近づけます。些細なことを重大に捉えすぎないよう意識しましょう。',
            '社会貢献タイプ': '社会的な善や正義を追求するより、自分が本当に好きなことや得意なことに集中しましょう。',
            '仕事人間タイプ': '仕事ができる必要はありません。むしろ、仕事以外の場面であなたの本当の強みを見つけましょう。',
            'ユニークタイプ': '独自性や変わった見方をする必要はありません。平凡であっても、あなたの存在そのものに価値があります。',
            'マザー・テレサタイプ': '全ての人に寄り添おうとする必要はありません。自分を大切にし、無理なく関われる範囲で人と接しましょう。'
        };

        // Check if we have zero in the manifest type
        const hasZeroMain = manifestType.mainType === 0 || manifestType.mainType === 10 ||
          manifestType.mainType === 20 || manifestType.mainType === 30 ||
          manifestType.mainType === 40 || manifestType.mainType === 50 ||
          manifestType.mainType === 60 || manifestType.mainType === 70 ||
          manifestType.mainType === 80 || manifestType.mainType === 90;

        const hasZeroSub = manifestType.subType1 === 0 || manifestType.subType2 === 0;
        const nonZeroSub = manifestType.subType1 === 0 ? manifestType.subType2 : manifestType.subType1;

        // まとめの文章を生成
        let summary = `
        <div class="summary-section">
            <h4 class="text-lg font-semibold text-purple-800 mb-3">🌼 あなたの勘違い</h4>
            <p class="mb-4">
                あなたは「<span class="super-highlight">${misunderstandingType.type}</span>」という勘違いタイプです。
                これは「<strong>${misunderstandingType.description}</strong>」と思い込んでいる状態です。
                <br><br>
                <span class="font-semibold text-purple-700">実際には：</span>「${misunderstandingType.reality}」
                <br>
                <span class="font-semibold text-purple-700">アドバイス：</span>${misunderstandingAdvice[misunderstandingType.type] || '勘違いを知ることで自然体の自分に戻ることができます。'}
            </p>
        </div>

        <div class="summary-section">
            <h4 class="text-lg font-semibold text-purple-800 mb-3">🌼 あなたの顕在個性</h4>
            <p class="mb-4">
                あなたの顕在個性のメインテーマは
                ${manifestType.mainType === 11 ?
          `<span class="super-highlight">創造（自信）<span class="text-red-600 font-bold">×2倍の強さ</span></span>` :
          manifestType.mainType === 12 ?
            `<span class="super-highlight">創造（自信） と 人間関係（バランス） の両方</span>` :
            hasZeroMain ?
              `<span class="super-highlight">${manifestTypes[parseInt(manifestType.mainType.toString()[0]) || 0]} <span class="text-indigo-600 font-bold">＋霊感・増幅</span></span>` :
              `<span class="super-highlight">${manifestTypes[manifestType.mainType] || '高尚・叡智'}</span>`
        }です。
                
                ${hasZeroSub ?
          `これを動かすサブテーマとして<span class="super-highlight">${manifestTypes[nonZeroSub]} <span class="text-indigo-600 font-bold">＋霊感・増幅</span></span>があります。
                    このサブテーマには霊的資質（0）が組み合わさっており、その特性が霊的に増幅されています。` :

          `これを動かすサブテーマとして<span class="super-highlight">${manifestTypes[manifestType.subType1] || ''}</span>（サブテーマ1）と
                    <span class="super-highlight">${manifestTypes[manifestType.subType2] || ''}</span>（サブテーマ2）があります。
                    <br><br>
                    特に<strong>サブテーマ2</strong>は、メインテーマを動かす小さな歯車として非常に重要です。サブテーマ2に意識を向けることで、
                    あなたの特性をより効果的に発揮することができるでしょう。`
        }

                ${hasZeroMain || hasZeroSub ?
          `<br><br>
                    <span class="bg-purple-50 p-2 rounded-md block mt-2 text-purple-800">
                        <strong>0（霊感・異質な力）</strong>が含まれる特殊パターンです。これは霊的資質や潜在能力を表し、
                        組み合わさる数字の個性をより洗練された感性や直感力などで増幅させる効果があります。
                        普通の数字よりも複雑で深い特性を持っているといえるでしょう。
                    </span>` : ''
        }
            </p>
        </div>

        <div class="summary-section">
            <h4 class="text-lg font-semibold text-purple-800 mb-3">🌼 あなたの潜在個性</h4>
            <p class="mb-3">
                <span class="font-semibold text-purple-700">生まれ変わっても変わらない望み：</span>
                <span class="super-highlight">${potentialTypes[potentialType.type1]}</span>
                <br>
                ${potentialDescriptions[potentialType.type1] || ''}
            </p>
            
            <p class="mb-3">
                <span class="font-semibold text-purple-700">先祖から応援されている特質：</span>
                <span class="super-highlight">${potentialTypes[potentialType.type2]}</span>
                <br>
                ${ancestorSupportDescriptions[potentialType.type2] || '先祖はこの特質があなたの中で発揮されることを応援しています。この性質を活かした行動をとると、先祖からの後押しを感じられるでしょう。'}
            </p>
            
            <p class="mb-3">
                <span class="font-semibold text-purple-700">今回の人生の環境設定：</span>
                <span class="super-highlight">${potentialTypes[potentialType.type3]}</span>
                <br>
                ${lifeEnvironmentDescriptions[potentialType.type3] || 'これは今回の人生であなたが置かれている環境の特性です。この環境の特質を理解し活用することで、人生をより豊かに生きることができるでしょう。'}
            </p>

            <p class="mb-3">
                <span class="font-semibold text-purple-700">まとめ・ポイント：</span>
                <span class="super-highlight">${potentialTypes[potentialType.totalPoint]}</span>
                <br>
                全体を通して、あなたの潜在個性は「${potentialTypes[potentialType.totalPoint]}」を中心に形成されています。この特性を意識して生きることで、より自然体であなたらしさを発揮できるでしょう。
            </p>

            <p class="text-sm bg-purple-50 p-2 rounded-md mt-2">
                これらの潜在個性を意識することで、より自分らしく自然体で生きることができます。特に先祖からの応援と今回の環境設定を活かすことで、本来の力を発揮しやすくなるでしょう。
            </p>
        </div>

        <div class="summary-section">
            <h4 class="text-lg font-semibold text-purple-800 mb-3">🌼 総合的な評価</h4>
            <p>
                これらの特性を知り、勘違いから解放されることで、あなた本来の自然体な姿を取り戻すことができます。
                自分の強みを生かし、「やらなくていいこと」を知ることで、より幸せな人生を歩むヒントとなるでしょう。
                <br><br>
                <span class="font-semibold text-purple-700">重要なポイント：</span>
                勘違いを知ると、それだけでその呪縛から外れていきます。あなたが苦手なことはやらなくても大丈夫です。
                あなた本来の才能や特性を活かした生き方を選んでいきましょう。
            </p>
        </div>
    `;

        // HTMLに結果を表示
        summaryText.innerHTML = summary;
    }
    
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

    // デバッグ機能追加
    const diagnosisForm = document.getElementById('diagnosisForm');
    diagnosisForm.addEventListener('submit', function(e) {
        // 入力値の取得
        const year = document.getElementById('birthYear').value;
        const month = document.getElementById('birthMonth').value;
        const day = document.getElementById('birthDay').value;
        const hour = document.getElementById('birthHour').value || '12';
        const minute = document.getElementById('birthMinute').value || '0';

        // フォームの通常処理は続行させる

        // 少し遅延させてコンソールにログを出力（計算完了後に実行するため）
        setTimeout(() => {
            // 計算された値を取得
            const moonSign = document.getElementById('calculatedMoonSign').value;
            const mainType = document.getElementById('mainTypeHidden').value;
            const subType1 = document.getElementById('subType1Hidden').value;
            const subType2 = document.getElementById('subType2Hidden').value;

            if (moonSign && mainType) {
                // タイプ名称の定義
                const manifestTypes = {
                    1: '創造（自信）',
                    2: '人間関係（バランス）',
                    3: '感情、感性（表現）',
                    4: '安心安定（過程）',
                    5: '自由（学び）',
                    6: '理想、満足',
                    7: '信頼・委任',
                    8: '豊かさ・受容',
                    9: '高尚・叡智',
                    0: '霊感・異質な力',
                    11: '創造（自信）×2倍',
                    12: '創造（自信）と人間関係（バランス）'
                };

                const potentialTypes = {
                    1: '宇宙（天）',
                    2: '金（ゴールド）',
                    3: '炎（火）',
                    4: '樹木',
                    5: '風',
                    6: '水',
                    7: '山',
                    8: '土（地面）'
                };

                const misunderstandingTypes = {
                    '牡羊座': 'できるタイプ',
                    '牡牛座': '自称HSPタイプ',
                    '双子座': '知的タイプ',
                    '蟹座': '優しいタイプ',
                    '獅子座': '人事エキスパートタイプ',
                    '乙女座': '開けっぱなし症候群',
                    '天秤座': '公平タイプ',
                    '蠍座': '違和感センサータイプ',
                    '射手座': '社会貢献タイプ',
                    '山羊座': '仕事人間タイプ',
                    '水瓶座': 'ユニークタイプ',
                    '魚座': 'マザー・テレサタイプ'
                };

                // 特殊マニフェストタイプの処理
                let mainTypeName = manifestTypes[mainType] || '';
                if (!mainTypeName && typeof mainType === 'string' && mainType.endsWith('0')) {
                    const firstDigit = mainType.toString()[0];
                    const baseName = manifestTypes[parseInt(firstDigit)] || '不明';
                    mainTypeName = `${baseName} ＋霊感・増幅`;
                }

                // 潜在個性の計算
                const potentialType = window.PotentialTypeCalculator.calculatePotentialType(
                  parseInt(year), parseInt(month), parseInt(day)
                );

                // 勘違いタイプの取得
                const misunderstandingType = window.MisunderstandingTypeCalculator.getMisunderstandingType(moonSign);

                // コンソール出力
                console.log('============= 勘違い鑑定結果 =============');
                console.log(`入力情報: ${year}年${month}月${day}日 ${hour}時${minute}分`);
                console.log('----------------------------------------');

                // 月星座と勘違い
                console.log(`【月星座】${moonSign}`);
                console.log(`【勘違い】${moonSign}: ${misunderstandingTypes[moonSign] || misunderstandingType.type}`);
                console.log(`  説明: ${misunderstandingType.description}`);
                console.log(`  実際: ${misunderstandingType.reality}`);
                console.log('----------------------------------------');

                // 顕在個性の詳細出力
                console.log('【顕在個性】');
                console.log(`  メインタイプ: ${mainType} ${mainTypeName}`);

                // 特殊なメインタイプの追加説明
                if (mainType === 11) {
                    console.log('  特殊パターン: 1が2倍強まったタイプ');
                } else if (mainType === 12) {
                    console.log('  特殊パターン: 1と2の両方を持つタイプ');
                } else if (mainType === 0 || (typeof mainType === 'string' && mainType.endsWith('0'))) {
                    console.log(`  特殊パターン: 霊感・増幅 (0) を含むパターン`);
                }

                console.log(`  サブタイプ1: ${subType1} ${manifestTypes[subType1] || ''}`);
                console.log(`  サブタイプ2: ${subType2} ${manifestTypes[subType2] || ''}`);

                // 0が含まれるかチェック
                const hasZero = subType1 == 0 || subType2 == 0;
                if (hasZero) {
                    console.log('  特殊サブタイプ: 霊感・増幅 (0) を含むサブパターン');
                }

                console.log('----------------------------------------');

                // 潜在個性の詳細出力
                console.log('【潜在個性】');
                console.log(`  生まれ変わっても変わらない望み: ${potentialType.type1} ${potentialTypes[potentialType.type1] || ''}`);
                console.log(`  先祖が応援してくれること: ${potentialType.type2} ${potentialTypes[potentialType.type2] || ''}`);
                console.log(`  今回の人生の環境設定: ${potentialType.type3} ${potentialTypes[potentialType.type3] || ''}`);
                console.log(`  総合ポイント: ${potentialType.totalPoint} ${potentialTypes[potentialType.totalPoint] || ''}`);

                console.log('=========================================');
            }
        }, 500); // 0.5秒遅延
    });
});