import './tailwind.min.css'
import './style.css'
import './potentialType.js'
import './manifestType.js'
import './misunderstandingType.js'
import './moonCalculator.js'
import './script.js'

document.querySelector('#app').innerHTML = `
<div class="container mx-auto px-4 py-8">
  <header class="text-center mb-10">
    <div class="text-5xl flex justify-center mb-2">🔮</div>
    <h1 class="text-3xl font-bold text-purple-800 mb-2">勘違い鑑定</h1>
    <p class="text-lg text-gray-600">勘違いに気づいて、自然体な自分を発見する</p>
  </header>
  <div class="bg-white rounded-lg shadow-lg p-6 mb-8 max-w-2xl mx-auto">
    <h2 class="text-xl font-semibold text-purple-700 mb-4">あなたの情報を入力してください</h2>
    <form id="diagnosisForm" class="space-y-4">
      <!-- 生年月日 -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label for="birthYear" class="block text-gray-700 mb-1 font-bold">生年</label>
          <select id="birthYear" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600">
            <option value="">選択してください</option>
            <!-- JSで西暦の選択肢を生成 -->
          </select>
        </div>
        <div>
          <label for="birthMonth" class="block text-gray-700 mb-1 font-bold">生月</label>
          <select id="birthMonth" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600">
            <option value="">選択してください</option>
            <!-- JSで月の選択肢を生成 -->
          </select>
        </div>
        <div>
          <label for="birthDay" class="block text-gray-700 mb-1 font-bold">生日</label>
          <select id="birthDay" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600">
            <option value="">選択してください</option>
            <!-- JSで日の選択肢を生成 -->
          </select>
        </div>
      </div>
      
      <!-- 出生時間 -->
      <div>
        <label for="birthTime" class="block text-gray-700 mb-1 font-bold">出生時間（できるだけ正確な時間）</label>
        <div class="grid grid-cols-2 gap-4">
          <select id="birthHour" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600">
            <option value="">時</option>
            <!-- JSで時間の選択肢を生成 -->
          </select>
          <select id="birthMinute" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600">
            <option value="">分</option>
            <!-- JSで分の選択肢を生成 -->
          </select>
        </div>
        <p class="text-xs text-gray-500 mt-1">※時間がわからない場合は「12時00分」と入力してください</p>
      </div>
      
      <!-- 出生地 -->
      <div>
        <label for="birthPlace" class="block text-gray-700 mb-1 font-bold">出生地</label>
        <div class="grid grid-cols-1 gap-4">
          <select id="birthCountry" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600">
            <option value="JP" selected>日本</option>
            <option value="OTHER">その他の国</option>
          </select>
          <div id="japanPrefectureContainer">
            <select id="birthPrefecture" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600">
              <option value="">都道府県を選択</option>
              <!-- JSで都道府県の選択肢を生成 -->
            </select>
          </div>
          <div id="otherCountryContainer" class="hidden">
            <input type="text" id="otherCountryInput" placeholder="国名を入力" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600">
            <div class="grid grid-cols-2 gap-4 mt-2">
              <input type="text" id="latitudeInput" placeholder="緯度（例: 35.6895）" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600">
              <input type="text" id="longitudeInput" placeholder="経度（例: 139.6917）" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600">
            </div>
            <p class="text-xs text-gray-500 mt-1">※緯度・経度は<a href="https://www.google.com/maps" target="_blank" class="text-purple-600 hover:underline">Google Maps</a>などで調べられます</p>
          </div>
        </div>
      </div>
      
      <!-- 計算された月星座を保持する非表示フィールド -->
      <input type="hidden" id="calculatedMoonSign" value="">

      <!-- 顕在個性の計算結果を保持する非表示フィールド -->
      <input type="hidden" id="mainTypeHidden" value="">
      <input type="hidden" id="subType1Hidden" value="">
      <input type="hidden" id="subType2Hidden" value="">

      <button type="submit" class="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition duration-300 font-semibold">診断する</button>
    </form>
  </div>
  <!-- 結果表示エリア -->
  <div id="resultArea" class="hidden">
    <div class="mb-6 text-center">
      <h2 class="text-2xl font-bold text-purple-800 mb-2">あなたの鑑定結果</h2>
      <p class="text-gray-600">自然体で、自分を発揮して生きる一助となるものです</p>
    </div>
    
    <!-- 結果のまとめ（最初に表示） -->
    <div class="bg-white rounded-lg shadow-lg p-6 mb-8 max-w-4xl mx-auto">
      <h3 class="text-xl font-semibold text-purple-700 mb-2 flex items-center">
        <span class="text-2xl mr-2">😇</span>
        鑑定結果のまとめ
      </h3>
      <div id="resultSummary" class="prose prose-purple max-w-none">
        <p class="font-medium text-purple-800">あなたの本質と特徴を総合的に分析しました：</p>
        <div id="summaryText" class="text-gray-700 leading-relaxed mt-4">
          <!-- JSで結果のまとめを表示 -->
        </div>
      </div>
      <div class="mt-4 p-3 bg-purple-50 rounded-lg border-l-4 border-purple-500">
        <p class="text-sm text-purple-700 font-medium">この鑑定結果を活かすためのポイント：</p>
        <ul class="text-sm text-gray-700 mt-2 list-disc list-inside">
          <li>勘違いを知ることで自然体の自分に戻れます。</li>
          <li>潜在個性は先祖からの贈り物です。</li>
          <li>顕在個性はあなたの特徴を表します。</li>
          <li>自分の強みを生かし、苦手なことはやる必要はありません。</li>
        </ul>
      </div>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- 勘違い -->
      <div class="bg-white rounded-lg shadow-lg overflow-hidden">
        <div class="bg-blue-500 py-3 px-4">
          <h3 class="text-lg font-semibold text-white">🌼 勘違い</h3>
        </div>
        <div class="p-4">
          <div id="misunderstandingResult" class="space-y-3">
            <!-- JSで結果を表示 -->
          </div>
        </div>
      </div>
      <!-- 潜在個性 -->
      <div class="bg-white rounded-lg shadow-lg overflow-hidden">
        <div class="bg-yellow-400 py-3 px-4">
          <h3 class="text-lg font-semibold text-white">🌼 潜在個性</h3>
        </div>
        <div class="p-4">
          <div id="potentialResult" class="space-y-3">
            <!-- JSで結果を表示 -->
          </div>
        </div>
      </div>
      <!-- 顕在個性 -->
      <div class="bg-white rounded-lg shadow-lg overflow-hidden">
        <div class="bg-green-500 py-3 px-4">
          <h3 class="text-lg font-semibold text-white">🌼 顕在個性</h3>
        </div>
        <div class="p-4">
          <div id="manifestResult" class="space-y-3">
            <!-- JSで結果を表示 -->
          </div>
        </div>
      </div>
    </div>
    
    <div class="mt-8 text-center">
      <button id="resetButton" class="bg-gray-200 text-gray-700 py-2 px-6 rounded-md hover:bg-gray-300 transition duration-300 font-medium">もう一度診断する</button>
    </div>
  </div>
  <footer class="mt-12 text-center text-gray-500 text-sm">
    <p>© 2025 勘違い鑑定. All rights reserved.</p>
  </footer>
</div>
`