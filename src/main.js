import './tailwind.min.css'
import './style.css'
import './script.js'

document.querySelector('#app').innerHTML = `
<div class="container mx-auto px-4 py-8">
  <header class="text-center mb-10">
    <div class="text-5xl flex justify-center mb-2">🔮</div>
    <h1 class="text-3xl font-bold text-purple-800 mb-2">勘違い鑑定</h1>
    <p class="text-lg text-gray-600">自然体な自分を発見する</p>
  </header>
  <div class="bg-white rounded-lg shadow-lg p-6 mb-8 max-w-2xl mx-auto">
    <h2 class="text-xl font-semibold text-purple-700 mb-4">あなたの情報を入力してください</h2>
    <form id="diagnosisForm" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label for="birthYear" class="block text-gray-700 mb-1">生年</label>
          <select id="birthYear" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600">
            <option value="">選択してください</option>
            <!-- JSで西暦の選択肢を生成 -->
          </select>
        </div>
        <div>
          <label for="birthMonth" class="block text-gray-700 mb-1">生月</label>
          <select id="birthMonth" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600">
            <option value="">選択してください</option>
            <!-- JSで月の選択肢を生成 -->
          </select>
        </div>
        <div>
          <label for="birthDay" class="block text-gray-700 mb-1">生日</label>
          <select id="birthDay" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600">
            <option value="">選択してください</option>
            <!-- JSで日の選択肢を生成 -->
          </select>
        </div>
      </div>
      <div>
        <label for="moonSign" class="block text-gray-700 mb-1">月星座</label>
        <select id="moonSign" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600">
          <option value="">選択してください</option>
          <option value="牡羊座">牡羊座</option>
          <option value="牡牛座">牡牛座</option>
          <option value="双子座">双子座</option>
          <option value="蟹座">蟹座</option>
          <option value="獅子座">獅子座</option>
          <option value="乙女座">乙女座</option>
          <option value="天秤座">天秤座</option>
          <option value="蠍座">蠍座</option>
          <option value="射手座">射手座</option>
          <option value="山羊座">山羊座</option>
          <option value="水瓶座">水瓶座</option>
          <option value="魚座">魚座</option>
        </select>
        <p class="text-xs text-gray-500 mt-1">※月星座がわからない場合は<a href="https://www.moonwithyou.com/" target="_blank" class="text-purple-600 hover:underline">こちら</a>で調べられます</p>
      </div>
      <button type="submit" class="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition duration-300 font-semibold">診断する</button>
    </form>
  </div>
  <!-- 結果表示エリア -->
  <div id="resultArea" class="hidden">
    <div class="mb-10 text-center">
      <h2 class="text-2xl font-bold text-purple-800 mb-4">あなたの鑑定結果</h2>
      <p class="text-gray-600">自然体で、自分を発揮して生きる一助となるものです</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
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