<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { createChart } from 'lightweight-charts';
import { generateHistoricalData } from '../services/priceData';

const chartRef = ref(null);
const tooltipRef = ref(null);
const chart = ref(null);
const candleSeries = ref(null);
const volumeSeries = ref(null);
const isMobile = ref(false);

const currentPrice = ref(1.7942);
const selectedPeriod = ref('1D');
const historicalData = ref(generateHistoricalData(30));

const periods = [
  { label: '1S', value: '1S' },
  { label: '1m', value: '1m' },
  { label: '1H', value: '1H' },
  { label: '1D', value: '1D' },
  { label: '1M', value: '1M' },
  { label: '1Y', value: '1Y' },
];

const initChart = () => {
  if (!chartRef.value) return;

  const mediaQuery = window.matchMedia('(max-width: 768px)');
  isMobile.value = mediaQuery.matches;

  chart.value = createChart(chartRef.value, {
    layout: {
      background: { color: '#1E222D' },
      textColor: '#DDD',
    },
    grid: {
      vertLines: { color: '#2B2B43' },
      horzLines: { color: '#2B2B43' },
    },
    width: chartRef.value.clientWidth,
    height: isMobile.value ? 250 : 500,
  });

  // 创建K线图，设置为占据80%的高度
  candleSeries.value = chart.value.addCandlestickSeries({
    upColor: '#26a69a',
    downColor: '#ef5350',
    borderVisible: false,
    wickUpColor: '#26a69a',
    wickDownColor: '#ef5350',
    priceScaleId: 'price-scale',
    scaleMargins: {
      top: 0, // 10% from the top
      bottom: 0.2, // 20% from the bottom (leaving space for volume)
    },
  });

  // 只在桌面端显示成交量图表，设置为占据20%的高度
  if (!isMobile.value) {
    volumeSeries.value = chart.value.addHistogramSeries({
      color: '#26a69a',
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: 'volume-scale',
      scaleMargins: {
        top: 0.8, // Start at 80% from the top
        bottom: 0.0, // Extend to the bottom
      },
    });

    // 设置成交量数据
    volumeSeries.value.setData(
      historicalData.value.map(item => ({
        time: item.time,
        value: item.volume,
        color: item.close >= item.open ? '#26a69a' : '#ef5350'
      }))
    );

    // 配置成交量价格轴
    chart.value.priceScale('volume-scale').applyOptions({
      scaleMargins: {
        top: 0.8, // Start at 80% from the top
        bottom: 0.0, // Extend to the bottom
      },
    });
  }

  // 设置K线数据
  candleSeries.value.setData(historicalData.value);

  // 添加十字准线
  chart.value.subscribeCrosshairMove((param) => {
    const data = param.seriesData.get(candleSeries.value);
    if (data) {
      tooltipRef.value.style.display = 'block';
      tooltipRef.value.style.left = `${param.point.x}px`;
      tooltipRef.value.style.top = `${param.point.y}px`;
      tooltipRef.value.innerHTML = `
        <div class="text-xs">
          <div>开盘价：${data.open}</div>
          <div>最高价：${data.high}</div>
          <div>最低价：${data.low}</div>
          <div>收盘价：${data.close}</div>
          <div>成交量：${historicalData.value.find(d => d.time === param.time)?.volume || 0}</div>
        </div>
      `;
    }
  });
};

const handleResize = () => {
  if (!chartRef.value || !chart.value) return;

  const mediaQuery = window.matchMedia('(max-width: 768px)');
  const newIsMobile = mediaQuery.matches;

  // 如果移动端状态发生变化，需要重新初始化图表
  if (newIsMobile !== isMobile.value) {
    isMobile.value = newIsMobile;
    chart.value.remove();
    initChart();
    return;
  }

  chart.value.applyOptions({
    width: chartRef.value.clientWidth,
    height: isMobile.value ? 250 : 500,
  });
};

const changePeriod = (period) => {
  selectedPeriod.value = period;
  // 这里可以根据不同的时间周期请求相应的数据
  // 目前使用模拟数据
  historicalData.value = generateHistoricalData(
    period === '1Y' ? 365 : 
    period === '1W' ? 7 : 
    period === '1D' ? 24 : 30
  );
  if (candleSeries.value) {
    candleSeries.value.setData(historicalData.value);
    // 重新设置成交量数据pc
    if (volumeSeries.value && !isMobile.value) {
      volumeSeries.value.setData(
        historicalData.value.map(item => ({
          time: item.time,
          value: item.volume,
          color: item.close >= item.open ? '#26a69a' : '#ef5350'
        }))
      );
    }
  }
};

onMounted(() => {
  initChart();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  if (chart.value) {
    chart.value.remove();
  }
});
</script>

<template>
  <div class="bg-trading-dark rounded-lg p-6">
    <div class="mb-4 pb-4 border-b border-gray-700">
      <div class="flex justify-between items-center flex-wrap gap-4">
        <span class="text-2xl font-bold" :class="currentPrice > historicalData[historicalData.length - 1].open ? 'text-trading-green' : 'text-trading-red'">
          {{ currentPrice.toFixed(4) }} USDT
        </span>
        <div class="w-full lg:w-auto overflow-x-auto whitespace-nowrap pb-2 lg:pb-0">
          <div class="inline-flex space-x-2">
            <button
              v-for="period in periods"
              :key="period.value"
              @click="changePeriod(period.value)"
              class="px-3 py-1 rounded text-sm transition-colors"
              :class="[
                selectedPeriod === period.value
                  ? 'bg-trading-green text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              ]"
            >
              {{ period.label }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="relative">
      <div ref="chartRef" class="rounded-lg overflow-hidden"></div>
      <div 
        ref="tooltipRef" 
        class="absolute z-50 bg-trading-darker border border-gray-700 rounded p-2 pointer-events-none hidden"
        style="transform: translate(-50%, -100%);"
      ></div>
    </div>
  </div>
</template>

<style scoped>
/* 移动端滚动优化 */
.whitespace-nowrap {
  -webkit-overflow-scrolling: touch;
}

/* 隐藏滚动条但保持功能 */
.whitespace-nowrap::-webkit-scrollbar {
  display: none;
}
</style>