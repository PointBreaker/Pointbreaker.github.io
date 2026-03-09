<template>
  <div class="crypto-market">
    <header class="header">
      <h1>₿ Crypto Market</h1>
      <p class="update-time">{{ updateTime }}</p>
    </header>

    <!-- Summary Cards -->
    <div class="summary">
      <div class="card">
        <span class="label">总市值</span>
        <span class="value">{{ formatMCap(totalMarketCap) }}</span>
        <span :class="['change', mcapChange >= 0 ? 'positive' : 'negative']">
          {{ formatPct(mcapChange) }}
        </span>
      </div>
      <div class="card">
        <span class="label">BTC 占比</span>
        <span class="value">{{ btcDominance.toFixed(1) }}%</span>
      </div>
      <div class="card">
        <span class="label">市场情绪</span>
        <span class="value sentiment">{{ sentiment }}</span>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading">
      <span class="spinner"></span>
      加载中...
    </div>

    <!-- Error -->
    <div v-else-if="error" class="error">
      {{ error }}
      <button @click="fetchData">重试</button>
    </div>

    <!-- Main Content -->
    <template v-else>
      <!-- Analysis -->
      <section class="analysis">
        <h2>📊 今日分析</h2>
        <div class="analysis-content">
          <p v-for="(item, i) in analysis" :key="i" v-html="item"></p>
        </div>
      </section>

      <!-- Crypto List -->
      <section class="crypto-list">
        <h2>主流币种</h2>
        <div class="list-header">
          <span class="col-name">币种</span>
          <span class="col-price">价格</span>
          <span class="col-change">24h</span>
          <span class="col-chart">7d</span>
        </div>
        <div v-for="coin in coins" :key="coin.id" class="coin-row">
          <div class="col-name">
            <img :src="coin.image" :alt="coin.name" class="coin-icon">
            <div class="coin-info">
              <span class="coin-name">{{ coin.name }}</span>
              <span class="coin-symbol">{{ coin.symbol.toUpperCase() }}</span>
            </div>
          </div>
          <div class="col-price">${{ formatPrice(coin.current_price) }}</div>
          <div :class="['col-change', coin.price_change_percentage_24h >= 0 ? 'positive' : 'negative']">
            {{ formatPct(coin.price_change_percentage_24h) }}
          </div>
          <div class="col-chart">
            <svg :viewBox="`0 0 ${sparklineWidth} ${sparklineHeight}`" class="sparkline">
              <polyline
                :points="getSparklinePoints(coin.sparkline_in_7d?.price)"
                :class="coin.price_change_percentage_24h >= 0 ? 'up' : 'down'"
              />
            </svg>
          </div>
        </div>
      </section>

      <!-- Top Movers -->
      <div class="movers-grid">
        <section class="gainers">
          <h2>🚀 涨幅榜</h2>
          <div v-for="coin in gainers" :key="coin.id" class="mover-row">
            <span class="mover-name">{{ coin.symbol.toUpperCase() }}</span>
            <span class="mover-price">${{ formatPrice(coin.current_price) }}</span>
            <span class="positive">{{ formatPct(coin.price_change_percentage_24h) }}</span>
          </div>
        </section>
        <section class="losers">
          <h2>📉 跌幅榜</h2>
          <div v-for="coin in losers" :key="coin.id" class="mover-row">
            <span class="mover-name">{{ coin.symbol.toUpperCase() }}</span>
            <span class="mover-price">${{ formatPrice(coin.current_price) }}</span>
            <span class="negative">{{ formatPct(coin.price_change_percentage_24h) }}</span>
          </div>
        </section>
      </div>
    </template>

    <footer class="footer">
      <button @click="refreshData" :disabled="loading" class="refresh-btn">
        🔄 刷新数据
      </button>
      <p>Data from CoinGecko • by Davis</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

// State
const coins = ref([])
const globalData = ref(null)
const loading = ref(true)
const error = ref(null)
const updateTime = ref('')

// Sparkline config
const sparklineWidth = 80
const sparklineHeight = 30

// Computed
const totalMarketCap = computed(() => globalData.value?.total_market_cap?.usd || 0)
const mcapChange = computed(() => globalData.value?.market_cap_change_percentage_24h_usd || 0)
const btcDominance = computed(() => globalData.value?.market_cap_percentage?.btc || 0)
const ethDominance = computed(() => globalData.value?.market_cap_percentage?.eth || 0)

const sentiment = computed(() => {
  const change = mcapChange.value
  if (change > 3) return '🚀 非常乐观'
  if (change > 1) return '📈 乐观'
  if (change < -3) return '📉 恐慌'
  if (change < -1) return '⚠️ 谨慎'
  return '😐 中性'
})

const analysis = computed(() => {
  if (!coins.value.length || !globalData.value) return []
  
  const btc = coins.value.find(c => c.id === 'bitcoin')
  const eth = coins.value.find(c => c.id === 'ethereum')
  const result = []
  
  // Market overview
  const change = mcapChange.value
  if (change > 2) {
    result.push(`✅ <strong>整体市场强势</strong>：总市值24h上涨 ${change.toFixed(2)}%，市场情绪乐观。`)
  } else if (change < -2) {
    result.push(`⚠️ <strong>市场回调</strong>：总市值24h下跌 ${Math.abs(change).toFixed(2)}%，注意风险。`)
  } else {
    result.push(`📊 <strong>市场横盘</strong>：总市值变化不大（${change.toFixed(2)}%），观望为主。`)
  }
  
  // BTC
  if (btc) {
    const btcChange = btc.price_change_percentage_24h
    if (btcChange > 3) {
      result.push(`🟠 <strong>比特币强势</strong>：BTC +${btcChange.toFixed(2)}%，价格 $${formatPrice(btc.current_price)}，多头强劲。`)
    } else if (btcChange < -3) {
      result.push(`🟠 <strong>比特币承压</strong>：BTC ${btcChange.toFixed(2)}%，测试支撑位。`)
    }
  }
  
  // ETH vs BTC
  if (btc && eth) {
    if (eth.price_change_percentage_24h > btc.price_change_percentage_24h) {
      result.push(`🔷 <strong>以太坊相对强势</strong>：ETH 跑赢 BTC，山寨可能有机会。`)
    }
  }
  
  // Dominance
  result.push(`👑 <strong>市值占比</strong>：BTC ${btcDominance.value.toFixed(1)}% / ETH ${ethDominance.value.toFixed(1)}%`)
  
  return result
})

const gainers = computed(() => {
  return [...coins.value]
    .filter(c => c.price_change_percentage_24h > 0)
    .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
    .slice(0, 5)
})

const losers = computed(() => {
  return [...coins.value]
    .filter(c => c.price_change_percentage_24h < 0)
    .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h)
    .slice(0, 5)
})

// Methods
const formatPrice = (price) => {
  if (price >= 1) return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  return price.toFixed(6)
}

const formatPct = (pct) => {
  if (pct === null || pct === undefined) return '-'
  return (pct >= 0 ? '+' : '') + pct.toFixed(2) + '%'
}

const formatMCap = (mcap) => {
  if (mcap >= 1e12) return '$' + (mcap / 1e12).toFixed(2) + 'T'
  if (mcap >= 1e9) return '$' + (mcap / 1e9).toFixed(2) + 'B'
  return '$' + (mcap / 1e6).toFixed(2) + 'M'
}

const getSparklinePoints = (prices) => {
  if (!prices || prices.length === 0) return ''
  
  const min = Math.min(...prices)
  const max = Math.max(...prices)
  const range = max - min || 1
  
  return prices.map((p, i) => {
    const x = (i / (prices.length - 1)) * sparklineWidth
    const y = sparklineHeight - ((p - min) / range) * (sparklineHeight - 4) - 2
    return `${x},${y}`
  }).join(' ')
}

const updateTimeStr = () => {
  updateTime.value = new Date().toLocaleString('zh-CN', {
    timeZone: 'Asia/Shanghai',
    dateStyle: 'full',
    timeStyle: 'short'
  })
}

const fetchData = async () => {
  loading.value = true
  error.value = null
  
  try {
    const [coinsRes, globalRes] = await Promise.all([
      fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=true&price_change_percentage=24h'),
      fetch('https://api.coingecko.com/api/v3/global')
    ])
    
    if (!coinsRes.ok || !globalRes.ok) throw new Error('API 请求失败')
    
    coins.value = await coinsRes.json()
    globalData.value = (await globalRes.json()).data
    updateTimeStr()
  } catch (e) {
    error.value = '加载数据失败: ' + e.message
  } finally {
    loading.value = false
  }
}

const refreshData = () => {
  fetchData()
}

// Lifecycle
let timer = null
onMounted(() => {
  fetchData()
  timer = setInterval(fetchData, 5 * 60 * 1000) // 5分钟刷新
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
.crypto-market {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Inter', -apple-system, sans-serif;
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}

.header h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.update-time {
  color: #888;
  font-size: 0.875rem;
}

/* Summary Cards */
.summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.card {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1rem;
  text-align: center;
}

.card .label {
  display: block;
  font-size: 0.75rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.card .value {
  display: block;
  font-size: 1.25rem;
  font-weight: 600;
}

.card .change {
  display: block;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.positive { color: #10b981; }
.negative { color: #ef4444; }

/* Analysis */
.analysis {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  color: white;
}

.analysis h2 {
  margin-bottom: 1rem;
  font-size: 1.125rem;
}

.analysis-content p {
  margin-bottom: 0.75rem;
  line-height: 1.6;
}

.analysis-content p:last-child {
  margin-bottom: 0;
}

/* Crypto List */
.crypto-list {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  overflow: hidden;
  margin-bottom: 2rem;
}

.crypto-list h2 {
  padding: 1rem 1.25rem;
  margin: 0;
  border-bottom: 1px solid #eee;
  font-size: 1rem;
}

.list-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 80px;
  padding: 0.75rem 1.25rem;
  background: #f8f9fa;
  font-size: 0.75rem;
  color: #666;
  font-weight: 500;
}

.coin-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 80px;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #f0f0f0;
  align-items: center;
}

.coin-row:last-child {
  border-bottom: none;
}

.coin-row:hover {
  background: #fafafa;
}

.col-name {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.coin-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.coin-info {
  display: flex;
  flex-direction: column;
}

.coin-name {
  font-weight: 500;
}

.coin-symbol {
  font-size: 0.75rem;
  color: #888;
  text-transform: uppercase;
}

.col-price {
  font-weight: 500;
}

.col-change {
  font-weight: 500;
}

/* Sparkline */
.sparkline {
  width: 100%;
  height: 30px;
}

.sparkline polyline {
  fill: none;
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.sparkline polyline.up { stroke: #10b981; }
.sparkline polyline.down { stroke: #ef4444; }

/* Movers Grid */
.movers-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 2rem;
}

.gainers, .losers {
  background: white;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.gainers h2, .losers h2 {
  margin: 0 0 1rem 0;
  font-size: 1rem;
}

.mover-row {
  display: flex;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.mover-row:last-child {
  border-bottom: none;
}

.mover-name {
  width: 60px;
  font-weight: 500;
}

.mover-price {
  flex: 1;
  color: #666;
  font-size: 0.875rem;
}

/* Loading & Error */
.loading {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.spinner {
  display: inline-block;
  width: 24px;
  height: 24px;
  border: 3px solid #ddd;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 0.5rem;
  vertical-align: middle;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error {
  text-align: center;
  padding: 2rem;
  color: #ef4444;
}

.error button {
  display: block;
  margin: 1rem auto 0;
  padding: 0.5rem 1rem;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

/* Footer */
.footer {
  text-align: center;
  color: #888;
  font-size: 0.75rem;
}

.refresh-btn {
  padding: 0.5rem 1rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-bottom: 0.5rem;
}

.refresh-btn:hover {
  background: #5a6fd6;
}

.refresh-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 768px) {
  .crypto-market {
    padding: 1rem;
  }
  
  .summary {
    grid-template-columns: 1fr;
  }
  
  .list-header, .coin-row {
    grid-template-columns: 2fr 1fr 1fr;
  }
  
  .col-chart {
    display: none;
  }
  
  .movers-grid {
    grid-template-columns: 1fr;
  }
}
</style>
