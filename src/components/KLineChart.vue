<script setup>
import { ref, onMounted, onUnmounted, nextTick, markRaw } from 'vue';
import * as echarts from 'echarts';
import { generateHistoricalData } from '../services/priceData';

const chartRef = ref(null);
const chart = ref(null);
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

  if (chart.value) {
    chart.value.dispose();
  }

  chart.value = markRaw(echarts.init(chartRef.value));
  
  const data = historicalData.value.map(item => ({
    time: item.time,
    values: [item.open, item.close, item.low, item.high],
    volume: item.volume
  }));

  const option = {
    backgroundColor: '#1E222D',
    animation: false,
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      },
      backgroundColor: '#13151A',
      borderColor: '#2B2B43',
      borderWidth: 1,
      textStyle: {
        color: '#DDD',
      },
      formatter: function (params) {
        const candlestickData = params.find(param => param.seriesName === 'K线');
        const volumeData = params.find(param => param.seriesName === '成交量');
        
        if (!candlestickData) return '';
        
        const values = candlestickData.data.values;
        return `
          <div style="font-size: 12px">
            <div>时间：${candlestickData.data.time}</div>
            <div>开盘价：${values[0]}</div>
            <div>收盘价：${values[1]}</div>
            <div>最低价：${values[2]}</div>
            <div>最高价：${values[3]}</div>
            <div>成交量：${volumeData ? volumeData.data.volume : ''}</div>
          </div>
        `;
      }
    },
    axisPointer: {
      link: { xAxisIndex: 'all' },
      label: {
        backgroundColor: '#777'
      }
    },
    grid: [{
      left: '10%',
      right: '10%',
      height: '60%'
    }, {
      left: '10%',
      right: '10%',
      top: '75%',
      height: '15%'
    }],
    xAxis: [{
      type: 'category',
      data: data.map(item => item.time),
      scale: true,
      boundaryGap: false,
      axisLine: { lineStyle: { color: '#2B2B43' } },
      splitLine: { show: false },
      min: 'dataMin',
      max: 'dataMax',
      axisLabel: {
        color: '#DDD',
        formatter: (value) => value.substring(5)
      }
    }, {
      type: 'category',
      gridIndex: 1,
      data: data.map(item => item.time),
      scale: true,
      boundaryGap: false,
      axisLine: { lineStyle: { color: '#2B2B43' } },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: { show: false },
      min: 'dataMin',
      max: 'dataMax'
    }],
    yAxis: [{
      scale: true,
      splitNumber: 6,
      axisLine: { lineStyle: { color: '#2B2B43' } },
      splitLine: { lineStyle: { color: '#2B2B43' } },
      axisLabel: {
        color: '#DDD',
        formatter: (value) => value.toFixed(4)
      }
    }, {
      scale: true,
      gridIndex: 1,
      splitNumber: 2,
      axisLine: { lineStyle: { color: '#2B2B43' } },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: { show: false }
    }],
    dataZoom: [{
      type: 'inside',
      xAxisIndex: [0, 1],
      start: 0,
      end: 100
    }],
    series: [{
      name: 'K线',
      type: 'candlestick',
      data: data.map(item => ({
        time: item.time,
        values: item.values,
        value: item.values
      })),
      itemStyle: {
        color: '#ef5350',
        color0: '#26a69a',
        borderColor: '#ef5350',
        borderColor0: '#26a69a'
      }
    }, {
      name: '成交量',
      type: 'bar',
      xAxisIndex: 1,
      yAxisIndex: 1,
      data: data.map(item => ({
        time: item.time,
        volume: item.volume,
        value: item.volume,
        itemStyle: {
          color: item.values[1] >= item.values[0] ? '#26a69a' : '#ef5350'
        }
      }))
    }]
  };

  chart.value.setOption(option);
};

const handleResize = () => {
  if (!chartRef.value || !chart.value) return;

  const mediaQuery = window.matchMedia('(max-width: 768px)');
  const newIsMobile = mediaQuery.matches;

  if (newIsMobile !== isMobile.value) {
    isMobile.value = newIsMobile;
    nextTick(() => {
      initChart();
    });
    return;
  }

  chart.value.resize();
};

const changePeriod = (period) => {
  selectedPeriod.value = period;
  historicalData.value = generateHistoricalData(
    period === '1Y' ? 365 : 
    period === '1W' ? 7 : 
    period === '1D' ? 24 : 30
  );
  
  if (chart.value) {
    initChart();
  }
};

onMounted(() => {
  nextTick(() => {
    initChart();
    window.addEventListener('resize', handleResize);
  });
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  if (chart.value) {
    chart.value.dispose();
  }
});
</script>

<template>
  <div class="bg-trading-dark rounded-lg p-6">
    <div class="mb-4 pb-4 border-b border-gray-700">
      <div class="flex justify-between items-center flex-wrap gap-4">
        <span class="text-2xl font-bold" :class="currentPrice > historicalData[historicalData.length - 1]?.open ? 'text-trading-green' : 'text-trading-red'">
          {{ currentPrice.toFixed(4) }} USDT666
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
      <div 
        ref="chartRef" 
        class="rounded-lg overflow-hidden"
        :style="{ height: isMobile ? '250px' : '500px' }"
      ></div>
    </div>
  </div>
</template>

<style scoped>
.whitespace-nowrap {
  -webkit-overflow-scrolling: touch;
}

.whitespace-nowrap::-webkit-scrollbar {
  display: none;
}
</style>