<script setup>
import { ref, computed } from 'vue';

const price = ref('');
const amount = ref('');
const type = ref('buy');
const sliderValue = ref(0);

const totalValue = computed(() => {
  const numPrice = parseFloat(price.value) || 0;
  const numAmount = parseFloat(amount.value) || 0;
  return (numPrice * numAmount).toFixed(2);
});

const percentages = [25, 50, 75, 100];

const handlePercentageClick = (percentage) => {
  sliderValue.value = percentage;
  const maxAmount = 1000 / parseFloat(price.value);
  amount.value = ((maxAmount * percentage) / 100).toFixed(4);
};

const handleTrade = () => {
  if (!price.value || !amount.value) {
    alert('请输入价格和数量');
    return;
  }
  
  console.log(`${type.value} order: ${amount.value} MERC at ${price.value} USDT`);
  amount.value = '';
  sliderValue.value = 0;
};
</script>

<template>
  <div class="bg-trading-dark rounded-lg h-full">
    <div class="flex border-b border-gray-700">
      <button 
        v-for="orderType in ['buy', 'sell']" 
        :key="orderType"
        @click="type = orderType"
        class="flex-1 py-3 text-center transition-colors"
        :class="[
          type === orderType ? 
            orderType === 'buy' ? 'text-trading-green border-b-2 border-trading-green' : 'text-trading-red border-b-2 border-trading-red'
            : 'text-gray-400'
        ]"
      >
        {{ orderType === 'buy' ? '买入' : '卖出' }}
      </button>
    </div>

    <div class="p-4 space-y-4">
      <div>
        <label class="block text-sm text-gray-400 mb-2">价格 (USDT)</label>
        <input 
          type="number" 
          v-model="price" 
          class="w-full bg-gray-800 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-trading-green"
          placeholder="输入价格"
          step="0.0001"
          min="0"
        >
      </div>

      <div>
        <label class="block text-sm text-gray-400 mb-2">数量 (MERC)</label>
        <input 
          type="number" 
          v-model="amount" 
          class="w-full bg-gray-800 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-trading-green"
          placeholder="输入数量"
          step="0.0001"
          min="0"
        >
        <div class="flex gap-2 mt-2">
          <button 
            v-for="percentage in percentages" 
            :key="percentage"
            @click="handlePercentageClick(percentage)"
            class="flex-1 py-1 text-sm rounded transition-colors"
            :class="[
              sliderValue === percentage ? 'bg-trading-green text-white' : 'bg-gray-800 text-gray-400'
            ]"
          >
            {{ percentage }}%
          </button>
        </div>
      </div>

      <div class="bg-gray-800 rounded p-3 flex justify-between">
        <span class="text-gray-400">预计交易额</span>
        <span class="font-medium">{{ totalValue }} USDT</span>
      </div>

      <button 
        @click="handleTrade"
        class="w-full py-3 rounded font-medium transition-opacity hover:opacity-90"
        :class="type === 'buy' ? 'bg-trading-green' : 'bg-trading-red'"
      >
        {{ type === 'buy' ? '买入 MERC' : '卖出 MERC' }}
      </button>
    </div>
  </div>
</template>