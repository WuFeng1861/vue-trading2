<script setup>
import { ref } from 'vue';

const asks = ref([
  { price: '1.8050', amount: '2345.23', total: '4232.89' },
  { price: '1.8040', amount: '1234.56', total: '2227.34' },
  { price: '1.8030', amount: '5678.90', total: '10239.46' },
  { price: '1.8020', amount: '3456.78', total: '6229.12' },
  { price: '1.8010', amount: '2345.67', total: '4225.55' },
]);

const bids = ref([
  { price: '1.7990', amount: '1234.56', total: '2220.87' },
  { price: '1.7980', amount: '5678.90', total: '10210.47' },
  { price: '1.7970', amount: '3456.78', total: '6212.34' },
  { price: '1.7960', amount: '2345.67', total: '4212.82' },
  { price: '1.7950', amount: '4567.89', total: '8199.36' },
]);

const maxTotal = Math.max(
  ...asks.value.map(a => parseFloat(a.total)),
  ...bids.value.map(b => parseFloat(b.total))
);
</script>

<template>
  <div class="flex-1 flex flex-col h-full">
    <div class="text-xs flex-1 overflow-hidden">
      <div class="grid lg:grid-cols-3 grid-cols-2 px-3 py-2 text-gray-400 border-b border-gray-700">
        <div>价格</div>
        <div class="text-right">数量</div>
        <div class="text-right hidden lg:block">累计</div>
      </div>
      
      <div class="flex-1 overflow-y-auto">
        <!-- Asks -->
        <div class="space-y-px">
          <div v-for="(ask, index) in asks" :key="'ask'+index" class="relative">
            <div class="absolute inset-0 bg-trading-red opacity-10" 
                 :style="{ width: (parseFloat(ask.total) / maxTotal * 100) + '%' }">
            </div>
            <div class="grid lg:grid-cols-3 grid-cols-2 px-3 py-1 relative">
              <div class="text-trading-red">{{ ask.price }}</div>
              <div class="text-right">{{ ask.amount }}</div>
              <div class="text-right hidden lg:block">{{ ask.total }}</div>
            </div>
          </div>
        </div>
        
        <!-- Current Price -->
        <div class="px-3 py-2 border-y border-gray-700 flex justify-between items-center">
          <span class="text-lg font-bold text-trading-green">1.7995</span>
          <span class="text-xs text-gray-400">≈ $1.80</span>
        </div>
        
        <!-- Bids -->
        <div class="space-y-px">
          <div v-for="(bid, index) in bids" :key="'bid'+index" class="relative">
            <div class="absolute inset-0 bg-trading-green opacity-10" 
                 :style="{ width: (parseFloat(bid.total) / maxTotal * 100) + '%' }">
            </div>
            <div class="grid lg:grid-cols-3 grid-cols-2 px-3 py-1 relative">
              <div class="text-trading-green">{{ bid.price }}</div>
              <div class="text-right">{{ bid.amount }}</div>
              <div class="text-right hidden lg:block">{{ bid.total }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>