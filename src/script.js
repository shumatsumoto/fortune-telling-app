document.addEventListener('DOMContentLoaded', function() {

    // グローバル変数でイベントリスナー登録済みかどうかを確認
    if (window.formHandlersInitialized) return;

    // フォーム要素の初期化と設定
    window.FormHandlers.initializers.initializeAllFormFields();
    window.FormHandlers.eventHandlers.setupAllEventListeners();

    // 初期化済みフラグをセット
    window.formHandlersInitialized = true;

    // Country selection change event
    birthCountrySelect.addEventListener('change', function() {
        if (this.value === 'JP') {
            japanPrefectureContainer.classList.remove('hidden');
            otherCountryContainer.classList.add('hidden');
        } else {
            japanPrefectureContainer.classList.add('hidden');
            otherCountryContainer.classList.remove('hidden');
        }
    });

    // Form submission event (run diagnosis)
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get input values
        const year = document.getElementById('birthYear').value;
        const month = document.getElementById('birthMonth').value;
        const day = document.getElementById('birthDay').value;
        const hour = document.getElementById('birthHour').value || '12';
        const minute = document.getElementById('birthMinute').value || '0';

        // Validate inputs
        if (!year || !month || !day) {
            alert('生年月日を入力してください');
            return;
        }

        // Get latitude and longitude
        let latitude, longitude;

        if (birthCountrySelect.value === 'JP') {
            // For Japan, get coordinates from prefecture
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
            // For other countries, use input coordinates
            latitude = document.getElementById('latitudeInput').value;
            longitude = document.getElementById('longitudeInput').value;

            if (!latitude || !longitude) {
                alert('緯度・経度を入力してください');
                return;
            }
        }

        // Calculate moon sign
        const birthData = {
            year, month, day, hour, minute, latitude, longitude
        };

        const moonSignResult = window.MoonCalculator.calculateMoonZodiacSign(birthData);

        if (!moonSignResult.success) {
            alert(moonSignResult.message || '月星座の計算に失敗しました。入力内容を確認してください。');
            return;
        }

        // Save calculated moon sign to hidden field
        calculatedMoonSign.value = moonSignResult.moonSign;

        // Convert to numeric
        const numYear = parseInt(year);
        const numMonth = parseInt(month);
        const numDay = parseInt(day);

        // Calculate diagnosis results using functions from imported files
        const potentialType = window.PotentialTypeCalculator.calculatePotentialType(numYear, numMonth, numDay);
        const manifestType = window.ManifestTypeCalculator.calculateManifestType(numYear, numMonth, numDay);
        const misunderstandingType = window.MisunderstandingTypeCalculator.getMisunderstandingType(moonSignResult.moonSign);

        // Save results to hidden fields
        document.getElementById('mainTypeHidden').value = manifestType.mainType;
        document.getElementById('subType1Hidden').value = manifestType.subType1;
        document.getElementById('subType2Hidden').value = manifestType.subType2;

        // Display results using functions from imported files
        window.PotentialTypeCalculator.displayPotentialResult(potentialType, potentialResult);
        window.ManifestTypeCalculator.displayManifestResult(manifestType, manifestResult);
        window.MisunderstandingTypeCalculator.displayMisunderstandingResult(misunderstandingType, misunderstandingResult);

        // Generate and display summary
        generateSummary(misunderstandingType, potentialType, manifestType, moonSignResult.moonSign);

        // Show results area
        form.closest('.bg-white').classList.add('hidden');
        resultArea.classList.remove('hidden');
        resultArea.classList.add('result-appear');

        // Add gear visualization
        addGearVisualization();

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Enhanced gear visualization function with better special pattern handling
    function addGearVisualization() {
        // manifestTypes object definition for display
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

        // Get calculated manifest type values from hidden fields
        const mainTypeEl = document.getElementById('mainTypeHidden');
        const subType1El = document.getElementById('subType1Hidden');
        const subType2El = document.getElementById('subType2Hidden');

        // Default values if not found
        const mainType = mainTypeEl ? mainTypeEl.value : '?';
        const subType1 = subType1El ? subType1El.value : '?';
        const subType2 = subType2El ? subType2El.value : '?';

        // Check for special patterns
        const hasZeroSub = subType1 === '0' || subType2 === '0';
        const nonZeroSub = subType1 === '0' ? subType2 : subType1;

        // Determine if main type contains zero or is a special pattern
        const mainHasZero = mainType === '0' || (typeof mainType === 'string' && mainType.includes('0'));
        const isSpecialCase11 = mainType === '11';
        const isSpecialCase12 = mainType === '12';
        const needsExtraHeight = mainHasZero || isSpecialCase11 || isSpecialCase12;

        // Create gear visualization container
        const gearContainer = document.createElement('div');
        gearContainer.className = 'gear-visualization-container bg-white rounded-lg shadow-lg p-4 mb-6 max-w-4xl mx-auto';

        // SVG content with enhanced styling and accessibility
        if (hasZeroSub) {
            // One subtheme gear when there's a zero (special pattern)
            gearContainer.innerHTML = `
            <h3 class="text-xl font-semibold text-purple-700 mb-4 flex items-center">
                <span class="text-2xl mr-2">⚙️</span>
                顕在個性の歯車構造
                <span class="ml-2 text-sm font-normal text-purple-500">(特殊パターン: 霊感・増幅)</span>
            </h3>
            <div class="gear-svg-container" role="img" aria-label="霊感・増幅の特殊パターンの歯車構造図">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 240">
                    <!-- Single Subtheme gear (with zero amplification) -->
                    <g transform="translate(300, 120)" class="sub-gear">
                        <!-- Gear outline with special styling for zero enhancement -->
                        <circle cx="0" cy="0" r="60" fill="url(#zero-gradient)" fill-opacity="0.2" stroke="#7c3aed" stroke-width="1.5"/>
                        <circle cx="0" cy="0" r="25" fill="#f9fafb" stroke="#7c3aed" stroke-width="1"/>
                        
                        <!-- Magical aura to represent zero's amplification -->
                        <circle cx="0" cy="0" r="70" fill="none" stroke="#7c3aed" stroke-width="0.5" stroke-dasharray="2,3" opacity="0.7">
                            <animate attributeName="r" values="65;75;65" dur="3s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0.7;0.3;0.7" dur="3s" repeatCount="indefinite" />
                        </circle>
                        
                        <!-- Text background for better readability -->
                        <rect x="-65" y="-20" width="130" height="60" rx="4" fill="#ECFDF5" fill-opacity="0.9"/>
                        
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
                    <g transform="translate(600, 120)" class="main-gear">
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
                        <rect x="-85" y="-25" width="170" height="${needsExtraHeight ? '60' : '40'}" rx="4" fill="#f9fafb" fill-opacity="0.9"/>
                        
                        <!-- Text content -->
                        <text x="0" y="-5" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif" font-size="14" font-weight="bold" fill="#6d28d9">メインテーマ</text>
                        <text x="0" y="15" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif" font-size="16" font-weight="bold" fill="#6d28d9">
                            ${isSpecialCase11 ? `${manifestTypes[1]} ×2倍の強さ` :
              isSpecialCase12 ? `${manifestTypes[1]} と ${manifestTypes[2]}` :
                mainType === '0' ? manifestTypes[0] :
                  mainType === '10' || mainType === '20' || mainType === '30' || mainType === '40' ||
                  mainType === '50' || mainType === '60' || mainType === '70' || mainType === '80' ||
                  mainType === '90' ?
                    `${manifestTypes[mainType.charAt(0)]}` : manifestTypes[mainType] || manifestTypes[9]}
                        </text>
                        ${isSpecialCase11 ? `
                        <text x="0" y="35" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif" font-size="12" fill="#e11d48">特殊パターン：1が2倍強まる</text>
                        ` : ''}
                        ${isSpecialCase12 ? `
                        <text x="0" y="35" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif" font-size="12" fill="#9061f9">特殊パターン：両方の特性</text>
                        ` : ''}
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
                    <line x1="350" y1="120" x2="520" y2="120" stroke="#8b5cf6" stroke-width="2" stroke-dasharray="5,5" opacity="0.6"/>
                    
                    <!-- Gradient definitions -->
                    <defs>
                        <radialGradient id="zero-gradient" cx="50%" cy="50%" r="75%" fx="50%" fy="50%">
                            <stop offset="0%" style="stop-color:#c4b5fd;stop-opacity:1" />
                            <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:0.1" />
                        </radialGradient>
                    </defs>
                </svg>
            </div>
            <p class="text-sm text-purple-700 mt-2 text-center">
                このケースでは、「霊感・異質な力」(0)によってサブテーマが増幅されています。<br>
                サブテーマ「${manifestTypes[nonZeroSub]}」の特性が、霊的な感性により強められ、繊細さや直感力がより発揮されます。<br>
                このサブテーマを意識することでメインテーマを効果的に動かせます。
            </p>
        `;
        } else {
            // Normal three-gear visualization for non-zero cases
            gearContainer.innerHTML = `
            <h3 class="text-xl font-semibold text-purple-700 mb-4 flex items-center">
                <span class="text-2xl mr-2">⚙️</span>
                顕在個性の歯車構造
                ${isSpecialCase11 ? '<span class="ml-2 text-sm font-normal text-red-500">(特殊パターン: 2倍の強さ)</span>' :
              isSpecialCase12 ? '<span class="ml-2 text-sm font-normal text-purple-500">(特殊パターン: 両方の特性)</span>' :
                mainHasZero ? '<span class="ml-2 text-sm font-normal text-purple-500">(特殊パターン: 霊感・増幅)</span>' : ''}
            </h3>
            <div class="gear-svg-container" role="img" aria-label="顕在個性の歯車構造の図">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 240">
                    <!-- Sub-theme 2 gear (smallest) - now on left -->
                    <g transform="translate(200, 120)" class="sub-gear-2">
                        <!-- Gear outline with lighter fill -->
                        <circle cx="0" cy="0" r="40" fill="#c4b5fd" fill-opacity="0.05" stroke="#8b5cf6" stroke-width="1.5"/>
                        <circle cx="0" cy="0" r="18" fill="#f9fafb" stroke="#8b5cf6" stroke-width="1"/>
                        
                        <!-- Text background for better readability -->
                        <rect x="-55" y="-20" width="110" height="60" rx="4" fill="#ECFDF5" fill-opacity="0.9"/>
                        
                        <!-- Text content -->
                        <text x="0" y="-5" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif" font-size="14" font-weight="bold" fill="#6d28d9">サブテーマ2</text>
                        <text x="0" y="18" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif" font-size="16" font-weight="bold" fill="#6d28d9">${manifestTypes[subType2]}</text>
                        
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
                    <g transform="translate(375, 120)" class="sub-gear-1">
                        <!-- Gear outline with lighter fill -->
                        <circle cx="0" cy="0" r="60" fill="#a78bfa" fill-opacity="0.05" stroke="#7c3aed" stroke-width="1.5"/>
                        <circle cx="0" cy="0" r="25" fill="#f9fafb" stroke="#7c3aed" stroke-width="1"/>
                        
                        <!-- Text background for better readability -->
                        <rect x="-55" y="-20" width="110" height="60" rx="4" fill="#ECFDF5" fill-opacity="0.9"/>
                        
                        <!-- Text content -->
                        <text x="0" y="-5" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif" font-size="14" font-weight="bold" fill="#6d28d9">サブテーマ1</text>
                        <text x="0" y="18" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif" font-size="16" font-weight="bold" fill="#6d28d9">${manifestTypes[subType1]}</text>
                        
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
                    <g transform="translate(600, 120)" class="main-gear">
                        <!-- Gear outline with style based on special patterns -->
                        <circle cx="0" cy="0" r="80" fill="${
              isSpecialCase11 ? '#fee2e2' :
                isSpecialCase12 ? '#f3e8ff' :
                  mainHasZero ? 'url(#zero-gradient)' : '#8a5cf6'}" 
                            fill-opacity="${
              isSpecialCase11 || isSpecialCase12 ? '0.2' :
                mainHasZero ? '0.2' : '0.05'}" 
                            stroke="${
              isSpecialCase11 ? '#ef4444' :
                isSpecialCase12 ? '#8b5cf6' : '#6b46c1'}" 
                            stroke-width="2"/>
                        <circle cx="0" cy="0" r="30" fill="#f9fafb" stroke="#6b46c1" stroke-width="1.5"/>
                        
                        ${isSpecialCase11 ? `
                        <!-- Special aura for case 11 -->
                        <circle cx="0" cy="0" r="95" fill="none" stroke="#ef4444" stroke-width="0.5" stroke-dasharray="3,4" opacity="0.5">
                            <animate attributeName="r" values="90;100;90" dur="3s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0.5;0.2;0.5" dur="3s" repeatCount="indefinite" />
                        </circle>
                        ` : ''}
                        
                        ${isSpecialCase12 ? `
                        <!-- Special aura for case 12 - dual nature -->
                        <circle cx="0" cy="0" r="90" fill="none" stroke="#8b5cf6" stroke-width="0.5" stroke-dasharray="5,5" opacity="0.5">
                            <animate attributeName="r" values="85;95;85" dur="4s" repeatCount="indefinite" />
                        </circle>
                        <circle cx="0" cy="0" r="100" fill="none" stroke="#8b5cf6" stroke-width="0.5" stroke-dasharray="5,5" opacity="0.3">
                            <animate attributeName="r" values="100;110;100" dur="5s" repeatCount="indefinite" />
                        </circle>
                        ` : ''}
                        
                        ${mainHasZero ? `
                        <!-- Magical aura for zero in main type -->
                        <circle cx="0" cy="0" r="95" fill="none" stroke="#6b46c1" stroke-width="0.5" stroke-dasharray="3,4" opacity="0.6">
                            <animate attributeName="r" values="90;100;90" dur="4s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0.6;0.2;0.6" dur="4s" repeatCount="indefinite" />
                        </circle>
                        ` : ''}
                        
                        <!-- Text background for better readability -->
                        <rect x="-85" y="-25" width="170" height="60" rx="4" fill="#ECFDF5" fill-opacity="0.9"/>
                        
                        <!-- Text content - improved readability for special patterns -->
                        <text x="0" y="-5" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif" font-size="14" font-weight="bold" fill="#6d28d9">メインテーマ</text>
                        <text x="0" y="15" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif" font-size="16" font-weight="bold" fill="${isSpecialCase11 ? '#ef4444' : '#6d28d9'}">
                            ${isSpecialCase11 ? `${manifestTypes[1]} ×2倍の強さ` :
              isSpecialCase12 ? `${manifestTypes[1]} と ${manifestTypes[2]}` :
                mainType === '0' ? manifestTypes[0] :
                  mainType === '10' || mainType === '20' || mainType === '30' || mainType === '40' ||
                  mainType === '50' || mainType === '60' || mainType === '70' || mainType === '80' ||
                  mainType === '90' ?
                    `${manifestTypes[mainType.charAt(0)]}` : manifestTypes[mainType] || manifestTypes[9]}
                        </text>
                        ${isSpecialCase11 ? `
                        <text x="0" y="35" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif" font-size="12" fill="#e11d48">特殊パターン：1が2倍強まる</text>
                        ` : ''}
                        ${isSpecialCase12 ? `
                        <text x="0" y="35" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif" font-size="12" fill="#9061f9">特殊パターン：両方の特性</text>
                        ` : ''}
                        ${mainHasZero ? `
                        <text x="0" y="35" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif" font-size="12" fill="#9061f9">＋霊感・増幅</text>
                        ` : ''}
                        
                        <!-- Teeth for main gear with color based on type -->
                        <g opacity="0.6">
                            <path d="M 15,-95 L 17,-110 L -17,-110 L -15,-95 Z" fill="${isSpecialCase11 ? '#ef4444' : isSpecialCase12 ? '#8b5cf6' : '#6b46c1'}" transform="rotate(0)"/>
                            <path d="M 15,-95 L 17,-110 L -17,-110 L -15,-95 Z" fill="${isSpecialCase11 ? '#ef4444' : isSpecialCase12 ? '#8b5cf6' : '#6b46c1'}" transform="rotate(30)"/>
                            <path d="M 15,-95 L 17,-110 L -17,-110 L -15,-95 Z" fill="${isSpecialCase11 ? '#ef4444' : isSpecialCase12 ? '#8b5cf6' : '#6b46c1'}" transform="rotate(60)"/>
                            <path d="M 15,-95 L 17,-110 L -17,-110 L -15,-95 Z" fill="${isSpecialCase11 ? '#ef4444' : isSpecialCase12 ? '#8b5cf6' : '#6b46c1'}" transform="rotate(90)"/>
                            <path d="M 15,-95 L 17,-110 L -17,-110 L -15,-95 Z" fill="${isSpecialCase11 ? '#ef4444' : isSpecialCase12 ? '#8b5cf6' : '#6b46c1'}" transform="rotate(120)"/>
                            <path d="M 15,-95 L 17,-110 L -17,-110 L -15,-95 Z" fill="${isSpecialCase11 ? '#ef4444' : isSpecialCase12 ? '#8b5cf6' : '#6b46c1'}" transform="rotate(150)"/>
                            <path d="M 15,-95 L 17,-110 L -17,-110 L -15,-95 Z" fill="${isSpecialCase11 ? '#ef4444' : isSpecialCase12 ? '#8b5cf6' : '#6b46c1'}" transform="rotate(180)"/>
                            <path d="M 15,-95 L 17,-110 L -17,-110 L -15,-95 Z" fill="${isSpecialCase11 ? '#ef4444' : isSpecialCase12 ? '#8b5cf6' : '#6b46c1'}" transform="rotate(210)"/>
                            <path d="M 15,-95 L 17,-110 L -17,-110 L -15,-95 Z" fill="${isSpecialCase11 ? '#ef4444' : isSpecialCase12 ? '#8b5cf6' : '#6b46c1'}" transform="rotate(240)"/>
                            <path d="M 15,-95 L 17,-110 L -17,-110 L -15,-95 Z" fill="${isSpecialCase11 ? '#ef4444' : isSpecialCase12 ? '#8b5cf6' : '#6b46c1'}" transform="rotate(270)"/>
                            <path d="M 15,-95 L 17,-110 L -17,-110 L -15,-95 Z" fill="${isSpecialCase11 ? '#ef4444' : isSpecialCase12 ? '#8b5cf6' : '#6b46c1'}" transform="rotate(300)"/>
                            <path d="M 15,-95 L 17,-110 L -17,-110 L -15,-95 Z" fill="${isSpecialCase11 ? '#ef4444' : isSpecialCase12 ? '#8b5cf6' : '#6b46c1'}" transform="rotate(330)"/>
                        </g>
                    </g>

                    <!-- Connecting lines between gears with animated pulse -->
                    <line x1="240" y1="120" x2="340" y2="120" stroke="#8b5cf6" stroke-width="2" stroke-dasharray="5,5" opacity="0.6">
                        <animate attributeName="opacity" values="0.6;0.2;0.6" dur="3s" repeatCount="indefinite" />
                    </line>
                    <line x1="410" y1="120" x2="520" y2="120" stroke="#8b5cf6" stroke-width="2" stroke-dasharray="5,5" opacity="0.6">
                        <animate attributeName="opacity" values="0.6;0.2;0.6" dur="3s" repeatCount="indefinite" />
                    </line>

                    <!-- Gradient definitions -->
                    <defs>
                        <radialGradient id="zero-gradient" cx="50%" cy="50%" r="75%" fx="50%" fy="50%">
                            <stop offset="0%" style="stop-color:#c4b5fd;stop-opacity:1" />
                            <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:0.1" />
                        </radialGradient>
                    </defs>
                </svg>
            </div>
            <p class="text-sm text-purple-700 mt-2 text-center">
                ${isSpecialCase11 ?
              'このケースでは、「創造（自信）」の特性が2倍に強まる特殊パターンです。<br>独自のエネルギーと創造性が特に強く現れ、存在感のある表現力を発揮します。' :
              isSpecialCase12 ?
                'このケースでは、「創造（自信）」と「人間関係（バランス）」の両方を持つ特殊パターンです。<br>創造力と協調性のバランスが取れ、独創的でありながら人との関わりも大切にします。' :
                mainHasZero ?
                  'このケースでは、メインテーマに「霊感・増幅」(0)が組み合わさった特殊パターンです。<br>直感力や感性が強まり、メインテーマの特性がより洗練されて発揮されます。' :
                  'メインテーマを動かすには、小さな歯車（サブテーマ2）を動かすことが大切です。<br>→大きな歯車よりも、小さな歯車の方が動かしやすいため、サブテーマ2の課題から取り組むのが効果的です。'}
            </p>
        `;
        }

        // Insert after the summary section, before the three-card grid
        const resultArea = document.getElementById('resultArea');
        const summarySection = document.querySelector('#resultArea > div:nth-child(2)');
        resultArea.insertBefore(gearContainer, summarySection.nextSibling);
    }

    // Reset button click event
    resetButton.addEventListener('click', function() {
        form.reset();
        form.closest('.bg-white').classList.remove('hidden');
        resultArea.classList.add('hidden');
        calculatedMoonSign.value = '';

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Form elements
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

    // Enhanced summary generation with better special pattern explanations
    function generateSummary(misunderstandingType, potentialType, manifestType, moonSign) {
        // Type name mappings
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

        // Misunderstanding type advice
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

        // Manifest type features
        const manifestFeatures = {
            1: ['何かを生み出す能力が高い', 'エネルギーが強く、存在感がある', '独創的で常識にとらわれない', '自己満足の自信が重要'],
            2: ['人との関わりを通じて自分の良さを発揮する', '協力や貢献の意識が高い', '他者との境界があいまいで、距離感がつかみにくい', 'サポート役が向いている'],
            3: ['感情や感性が豊か', '気持ちが言葉や行動に乗りやすい', '芸術的な活動に向いている', '素直な感情表現が重要'],
            4: ['コツコツ型', 'プロセス重視', '両極端な傾向がある', '過程やプロセスを大事にする'],
            5: ['探究者、冒険者', '学習能力が高い', '頭の回転が早い', '感覚的な鋭敏さがある'],
            6: ['高い理想を持つ', '完璧主義傾向', '地に足がついた理想家', '理想と現実の接点を見つける'],
            7: ['自分と他者、自分と人生を信頼し、内面の美しさを世の中に分け与える', '精神の深い世界で洞察力と知恵を持つ', '周囲に分け与える'],
            8: ['豊かさや力を手に入れて世の中に役立てる', '博愛主義の傾向がある', '自然に集まる富や名声を世のために役立てる'],
            9: ['溢れ出る知恵に従い、豪傑な人生を送る', '他の人を導く', '理屈や勉強を超えた知恵を使って生きる'],
            0: ['一般的な人とは異なる潜在的な力を持つ', '見える、聞こえる、わかる、感じるなどの能力がある', '表現力も高い', '他の特性と組み合わさると増幅効果がある'],
            // 特殊パターン用にデータを追加
            11: ['何かを生み出す能力が非常に高い', 'エネルギーが特に強く、存在感が際立つ', '独創的で常識に全くとらわれない', '自己満足の自信が極めて重要', '創造力が2倍に増幅されている特殊パターン'],
            12: ['創造力と協調性の両方を持ち合わせている', '独創的でありながら人との関わりも大切にする', 'エネルギッシュかつサポーティブ', '自分の創造性と人との関わりのバランスを取れる', '両方の特性を持つ稀有なタイプ']
        };

        // manifestChallenges
        const manifestChallenges = {
            1: ['他者評価を求めすぎないこと', '自己満足の自信を大切にすること', 'エネルギーの発散方法を見つけること'],
            2: ['過干渉や過剰な貢献を避けること', '具体的な線引きをすること', '自分の気持ちと義務感を区別すること'],
            3: ['感情を押し殺さないこと', '過去の否定的な経験にとらわれすぎないこと', '小さなことから気持ちを表現する練習をすること'],
            4: ['小さなことで立ち止まりやすい', '極端に無責任になったり過度に干渉したりする', '家族関係（特に父親）の問題'],
            5: ['自由を求めるあまり、自分勝手やわがままになる可能性', '学びを始めても途中で投げ出しやすい', '器用貧乏になりやすい'],
            6: ['理想と現実のギャップに苦しむ', '完璧主義による自己否定', '「〜すべき」という思考に縛られやすい'],
            7: ['理論や学問的知識に頼りすぎる', '占いやセミナーにハマりやすい', '自信たっぷりに見えるが、実は自己防衛反応の表れ'],
            8: ['豊かさへの恐れや自己否定', '受け取ることが苦手', '権力的になったり、弱者を装ったりする'],
            9: ['世間一般の常識と合わない', '自分のレベルの高さを受け入れられず、村人と同じように振る舞おうとする'],
            0: ['自覚しないと変に影響を受けやすい', 'HSP的になりやすい', '特殊な感性に頼りすぎないようバランスを取ること'],
            // 特殊パターン用にデータを追加
            11: ['他者評価を求めすぎないこと', '自己満足の自信を確立すること', 'エネルギーの効果的な発散方法を見つけること', '強すぎるエネルギーをコントロールすること'],
            12: ['創造性と協調性のバランスを取ること', '時に相反する二つの特性を調和させること', '自己表現と他者貢献の間で揺れ動く可能性', '両方の特性を活かす場を見つけること']
        };

        // Potential type descriptions
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

        // Ancestor support descriptions
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

        // Life environment descriptions
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

        // 以下の行で、manifestType.mainTypeをチェックして、有効な値を確保する
        const mainTypeStr = String(manifestType.mainType);
        // 数値か文字列かにかかわらず、manifestFeaturesに存在するキーに変換
        const validMainType = manifestFeatures.hasOwnProperty(mainTypeStr) ?
          mainTypeStr :
          (mainTypeStr === '10' || mainTypeStr === '20' || mainTypeStr === '30' || mainTypeStr === '40' ||
            mainTypeStr === '50' || mainTypeStr === '60' || mainTypeStr === '70' || mainTypeStr === '80' ||
            mainTypeStr === '90') ? mainTypeStr.charAt(0) : '9';

        // Check for special patterns
        const hasZeroMain = manifestType.mainType === 0 ||
          (typeof manifestType.mainType === 'string' && mainTypeStr.includes('0'));

        const hasZeroSub = manifestType.subType1 === 0 || manifestType.subType2 === 0;
        const nonZeroSub = manifestType.subType1 === 0 ? manifestType.subType2 : manifestType.subType1;

        // Get main type name with appropriate formatting for special patterns
        let mainTypeName = '';
        if (mainTypeStr === '11') {
            mainTypeName = `${manifestTypes[1]} <span class="text-red-600 font-bold">×2倍の強さ</span>`;
        } else if (mainTypeStr === '12') {
            mainTypeName = `${manifestTypes[1]} と ${manifestTypes[2]} <span class="text-purple-700 font-bold">の両方</span>`;
        } else if (hasZeroMain) {
            const baseType = parseInt(mainTypeStr.toString()[0]) || 0;
            mainTypeName = `${manifestTypes[baseType]} <span class="text-indigo-600 font-bold">＋霊感・増幅</span>`;
        } else {
            mainTypeName = manifestTypes[validMainType] || '高尚・叡智';
        }

        // Get subtype names with appropriate formatting
        let subType1Name = hasZeroSub && manifestType.subType1 === 0 ?
          `${manifestTypes[nonZeroSub]} <span class="text-indigo-600 font-bold">＋霊感・増幅</span>` :
          manifestTypes[manifestType.subType1] || '';

        let subType2Name = hasZeroSub && manifestType.subType2 === 0 ?
          `${manifestTypes[nonZeroSub]} <span class="text-indigo-600 font-bold">＋霊感・増幅</span>` :
          manifestTypes[manifestType.subType2] || '';

        // Generate text for manifest features and challenges
        let manifestFeaturesText = '';
        let manifestChallengesText = '';

        // Main type features
        if (mainTypeStr === '11') {
            // Type 11: Double strength of type 1
            manifestFeaturesText += `<p class="mb-2"><strong>メインテーマ「<span class="super-highlight">${mainTypeName}</span>」</strong>: `;
            manifestFeaturesText += manifestFeatures[11].slice(0, 3).map(f => f).join('。') + '。';
            manifestFeaturesText += ' この特性が通常よりも2倍強く現れ、想像力とエネルギーの源泉となっています。創造性がより高いレベルで発揮されます。</p>';
        } else if (mainTypeStr === '12') {
            // Type 12: Combination of types 1 and 2
            manifestFeaturesText += `<p class="mb-2"><strong>メインテーマ「<span class="super-highlight">${mainTypeName}</span>」</strong>: `;
            manifestFeaturesText += manifestFeatures[12].slice(0, 3).map(f => f).join('。') + '。';
            manifestFeaturesText += ' 創造性と協調性の両方を持ち合わせた稀有なタイプで、独創的でありながら人との関わりも大切にします。</p>';
        } else if (hasZeroMain) {
            // Types with zero: Spiritual amplification
            const baseType = parseInt(mainTypeStr.toString()[0]) || 0;
            manifestFeaturesText += `<p class="mb-2"><strong>メインテーマ「<span class="super-highlight">${mainTypeName}</span>」</strong>: `;
            if (baseType !== 0 && manifestFeatures[baseType]) {
                manifestFeaturesText += manifestFeatures[baseType].slice(0, 2).map(f => f).join('。') + '。';
            }
            manifestFeaturesText += manifestFeatures[0].slice(0, 2).map(f => f).join('。') + '。';
            manifestFeaturesText += ' 霊的な感性が他の特性を増幅させる特殊なタイプで、直感力や繊細さが強まっています。</p>';
        } else {
            // Normal types
            manifestFeaturesText += `<p class="mb-2"><strong>メインテーマ「<span class="super-highlight">${mainTypeName}</span>」</strong>: `;
            if (manifestFeatures[validMainType]) {
                manifestFeaturesText += manifestFeatures[validMainType].slice(0, 3).map(f => f).join('。') + '。';
            } else {
                manifestFeaturesText += '個性を発揮する力があります。'; // フォールバックテキスト
            }
            manifestFeaturesText += ' これがあなたの中心的な個性です。</p>';
        }

        // Subtype 1 features
        if (!hasZeroSub || manifestType.subType2 === 0) {
            manifestFeaturesText += `<p class="mb-2"><strong>サブテーマ1「<span class="super-highlight">${subType1Name}</span>」</strong>: `;
            if (manifestType.subType1 === 0) {
                if (manifestFeatures[nonZeroSub]) {
                    manifestFeaturesText += manifestFeatures[nonZeroSub].slice(0, 2).map(f => f).join('。') + '。';
                }
                manifestFeaturesText += manifestFeatures[0].slice(0, 1).map(f => f).join('。') + '。';
                manifestFeaturesText += ' 霊的な感性がこの特性を増幅させ、より洗練された直感力を発揮します。</p>';
            } else if (manifestFeatures[manifestType.subType1]) {
                manifestFeaturesText += manifestFeatures[manifestType.subType1].slice(0, 3).map(f => f).join('。') + '。';
                manifestFeaturesText += ' この特性がメインテーマをサポートします。</p>';
            } else {
                manifestFeaturesText += 'メインテーマをサポートする特性です。</p>'; // フォールバックテキスト
            }
        }

        // Subtype 2 features
        if (!hasZeroSub && manifestType.subType1 !== 0) {
            manifestFeaturesText += `<p class="mb-2"><strong>サブテーマ2「<span class="super-highlight">${subType2Name}</span>」</strong>: `;
            if (manifestType.subType2 === 0) {
                if (manifestFeatures[nonZeroSub]) {
                    manifestFeaturesText += manifestFeatures[nonZeroSub].slice(0, 2).map(f => f).join('。') + '。';
                }
                manifestFeaturesText += manifestFeatures[0].slice(0, 1).map(f => f).join('。') + '。';
                manifestFeaturesText += ' 霊的な感性がこの特性を増幅させています。この小さな歯車が特に重要です。</p>';
            } else if (manifestFeatures[manifestType.subType2]) {
                manifestFeaturesText += manifestFeatures[manifestType.subType2].slice(0, 3).map(f => f).join('。') + '。';
                manifestFeaturesText += ' これがメインテーマを動かす小さな歯車となります。まずはここから意識すると効果的です。</p>';
            } else {
                manifestFeaturesText += 'メインテーマを動かす小さな歯車となる特性です。まずはここから意識すると効果的です。</p>'; // フォールバックテキスト
            }
        }

        // Challenges for subtype 2 (start with smallest gear)
        if (!hasZeroSub && manifestType.subType1 !== 0) {
            manifestChallengesText += `<p class="mb-2"><strong>サブテーマ2「<span class="super-highlight">${subType2Name}</span>」の課題</strong>: `;
            if (manifestType.subType2 === 0) {
                if (manifestChallenges[nonZeroSub]) {
                    manifestChallengesText += manifestChallenges[nonZeroSub].slice(0, 2).map(c => c).join('。') + '。';
                }
                manifestChallengesText += manifestChallenges[0].slice(0, 1).map(c => c).join('。') + '。';
                manifestChallengesText += ' 霊的な感性の扱いに注意しながら、この小さな歯車の課題に取り組みましょう。</p>';
            } else if (manifestChallenges[manifestType.subType2]) {
                manifestChallengesText += manifestChallenges[manifestType.subType2].slice(0, 3).map(c => c).join('。') + '。';
                manifestChallengesText += ' この小さな歯車の課題に取り組むことで、全体の歯車構造が効率よく動き出します。</p>';
            } else {
                manifestChallengesText += '小さな歯車の課題に取り組むことで、全体の歯車構造が効率よく動き出します。</p>'; // フォールバックテキスト
            }
        }

        // Challenges for subtype 1
        if (!hasZeroSub || manifestType.subType2 === 0) {
            manifestChallengesText += `<p class="mb-2"><strong>サブテーマ1「<span class="super-highlight">${subType1Name}</span>」の課題</strong>: `;
            if (manifestType.subType1 === 0) {
                if (manifestChallenges[nonZeroSub]) {
                    manifestChallengesText += manifestChallenges[nonZeroSub].slice(0, 2).map(c => c).join('。') + '。';
                }
                manifestChallengesText += manifestChallenges[0].slice(0, 1).map(c => c).join('。') + '。';
                manifestChallengesText += ' 霊的な感性の扱いに注意しながら、バランスを取ることが大切です。</p>';
            } else if (manifestChallenges[manifestType.subType1]) {
                manifestChallengesText += manifestChallenges[manifestType.subType1].slice(0, 3).map(c => c).join('。') + '。';
                manifestChallengesText += ' これらの課題に対処することで、サブテーマの力がより発揮されます。</p>';
            } else {
                manifestChallengesText += 'これらの課題に対処することで、サブテーマの力がより発揮されます。</p>'; // フォールバックテキスト
            }
        }

        // Challenges for main type
        manifestChallengesText += `<p class="mb-2"><strong>メインテーマ「<span class="super-highlight">${mainTypeName}</span>」の課題</strong>: `;
        if (mainTypeStr === '11') {
            manifestChallengesText += manifestChallenges[11].slice(0, 3).map(c => c).join('。') + '。';
            manifestChallengesText += ' これらの課題は通常よりも意識が必要で、エネルギーの効果的な発散方法を見つけることが特に重要です。</p>';
        } else if (mainTypeStr === '12') {
            manifestChallengesText += manifestChallenges[12].slice(0, 3).map(c => c).join('。') + '。';
            manifestChallengesText += ' 創造性と協調性の両方のバランスを取ることが重要です。時に相反する特性を上手く調和させましょう。</p>';
        } else if (hasZeroMain) {
            const baseType = parseInt(mainTypeStr.toString()[0]) || 0;
            if (baseType !== 0 && manifestChallenges[baseType]) {
                manifestChallengesText += manifestChallenges[baseType].slice(0, 2).map(c => c).join('。') + '。';
            }
            manifestChallengesText += manifestChallenges[0].slice(0, 2).map(c => c).join('。') + '。';
            manifestChallengesText += ' 霊的な感性と直感力を活かしつつ、現実的なバランスを取ることが大切です。</p>';
        } else if (manifestChallenges[validMainType]) {
            manifestChallengesText += manifestChallenges[validMainType].slice(0, 3).map(c => c).join('。') + '。';
            manifestChallengesText += ' これらの課題に向き合うことで、あなたの個性がより輝きます。</p>';
        } else {
            manifestChallengesText += '課題に向き合うことで、あなたの個性がより輝きます。</p>'; // フォールバックテキスト
        }

        // Special note for types with zero
        let specialNoteText = '';
        if (hasZeroMain || hasZeroSub) {
            specialNoteText = `
            <div class="bg-purple-50 p-3 rounded-md mt-3 mb-3">
                <p class="text-sm text-purple-800 font-medium">
                    <strong>※特別な注意点：「霊感・異質な力」(0)について</strong><br>
                    これは霊的資質や潜在能力を表し、組み合わさる数字の個性をより洗練された感性や直感力などで増幅させる効果があります。
                    繊細さや直感を活かすことができますが、過度に頼りすぎると現実感覚を失いやすくなります。
                    この特性を意識しつつ、日常的な判断でもバランスを取ることを心がけましょう。
                </p>
            </div>
        `;
        }

        // Special note for types 11 and 12
        if (manifestType.mainType === 11 || manifestType.mainType === 12) {
            const specialType = manifestType.mainType === 11 ?
              '「創造（自信）」の特性が2倍に強まる特殊パターン' :
              '「創造（自信）」と「人間関係（バランス）」の両方を持つ特殊パターン';

            const specialAdvice = manifestType.mainType === 11 ?
              'このパターンでは、創造性とエネルギーが特に強く現れます。その強さをうまくコントロールし、発散する方法を見つけることが重要です。' :
              'このパターンでは、創造性と協調性のバランスを取ることが重要です。時に相反する二つの特性をうまく活かせると、より大きな力を発揮できます。';

            specialNoteText += `
            <div class="bg-indigo-50 p-3 rounded-md mt-3 mb-3">
                <p class="text-sm text-indigo-800 font-medium">
                    <strong>※特別な注意点：特殊パターン ${manifestType.mainType} について</strong><br>
                    あなたは${specialType}です。これは非常に稀なタイプで、特別な才能と課題を併せ持っています。
                    ${specialAdvice}
                </p>
            </div>
        `;
        }

        // Manifest personality section
        const manifestSection = `
        <div class="summary-section">
            <h4 class="text-lg font-semibold text-purple-800 mb-3">🌼 あなたの顕在個性</h4>
            <div class="mb-4">
                <h5 class="font-medium text-purple-700 mb-2">▼ 強み・特徴：</h5>
                <div class="text-gray-700 leading-relaxed">
                    ${manifestFeaturesText}
                </div>
                
                <h5 class="font-medium text-purple-700 mt-4 mb-2">▼ 課題・注意点：</h5>
                <div class="text-gray-700 leading-relaxed">
                    ${manifestChallengesText}
                </div>
                
                ${specialNoteText}
                
                <div class="text-sm bg-green-50 p-3 rounded-md mt-3">
                    <p class="text-green-800 font-medium">
                        <strong>💡 歯車のポイント：</strong>
                        顕在個性は連動する歯車のような仕組みです。小さな歯車（サブテーマ2）から動かすと、
                        中くらいの歯車（サブテーマ1）を経て、大きな歯車（メインテーマ）が効率よく動き出します。
                        まずはサブテーマ2の課題に取り組むことをおすすめします。
                    </p>
                </div>
            </div>
        </div>
    `;

        // Misunderstanding section
        const misunderstandingSection = `
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
            <div class="text-sm bg-blue-50 p-3 rounded-md mt-3">
                <p class="text-blue-800 font-medium">
                    <strong>💡 勘違いについて：</strong>
                    勘違いを知るだけで、その呪縛から解放されていきます。勘違いから解放されると、あなた本来の自然体な姿が現れてきます。
                    ${misunderstandingType.type}という勘違いを意識して、自分の本当の強みに目を向けていきましょう。
                </p>
            </div>
        </div>
    `;

        // Potential personality section
        const potentialSection = `
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

            <div class="text-sm bg-yellow-50 p-3 rounded-md mt-3">
                <p class="text-yellow-800 font-medium">
                    <strong>💡 潜在個性について：</strong>
                    これらの潜在個性を意識することで、より自分らしく自然体で生きることができます。特に先祖からの応援と今回の環境設定を活かすことで、本来の力を発揮しやすくなるでしょう。
                    潜在個性は「天分」とも言え、あなたの中に眠る可能性です。
                </p>
            </div>
        </div>
    `;

        // Overall summary section
        const summarySection = `
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

            <div class="bg-purple-100 p-4 rounded-lg mt-4">
                <h5 class="font-semibold text-purple-800 mb-2">あなたの特性の相互作用</h5>
                <p class="text-gray-700">
                    ${hasZeroMain || hasZeroSub ?
          '特に「霊感・異質な力」(0)の特性により、あなたの感性や直感力は通常よりも鋭く、繊細です。この特性を活かしつつ、現実的なバランスも大切にしましょう。' :
          manifestType.mainType === 11 ?
            '「創造（自信）」の特性が2倍強まる特性を持ち、独創的なエネルギーに満ちています。この強力なエネルギーを上手く発散し、創造的な活動に活かしましょう。' :
            manifestType.mainType === 12 ?
              '「創造（自信）」と「人間関係（バランス）」の両方の特性を持つ稀なタイプです。創造性と協調性のバランスを取ることで、独自の価値を生み出せるでしょう。' :
              '顕在個性のメインテーマとサブテーマが互いに影響し合い、あなたの個性を形作っています。潜在個性の特性も加わり、より自然体で生きることができるでしょう。'
        }
                    <br><br>
                    勘違いの「${misunderstandingType.type}」を知ることで、本来のあなたらしさがより発揮されます。
                    潜在個性の「${potentialTypes[potentialType.totalPoint]}」の特性を意識し、顕在個性の「${manifestTypes[manifestType.mainType]}」の強みを活かすことで、より充実した人生を歩めるでしょう。
                </p>
            </div>
        </div>
    `;

        // Final summary text
        let summary = `
        ${misunderstandingSection}
        ${manifestSection}
        ${potentialSection}
        ${summarySection}
    `;

        // Display result in HTML
        summaryText.innerHTML = summary;
    }

    // Adjust days based on month and year (accounts for leap years)
    function adjustDaysInMonth() {
        const year = parseInt(document.getElementById('birthYear').value) || new Date().getFullYear();
        const month = parseInt(document.getElementById('birthMonth').value);
        const daySelect = document.getElementById('birthDay');
        const currentDay = parseInt(daySelect.value) || 0;

        if (!month) return;

        // Get number of days in selected month
        const daysInMonth = new Date(year, month, 0).getDate();

        // Clear current options
        daySelect.innerHTML = '';

        // Add default option
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = '選択してください';
        daySelect.appendChild(defaultOption);

        // Add day options
        for (let i = 1; i <= daysInMonth; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i + '日';
            daySelect.appendChild(option);
        }

        // Restore previously selected day if in range
        if (currentDay > 0 && currentDay <= daysInMonth) {
            daySelect.value = currentDay;
        }
    }
});