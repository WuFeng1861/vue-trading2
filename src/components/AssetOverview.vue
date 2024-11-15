<script setup>
const assets = [
  { 
    currency: 'USDT',
    icon: '💰',
    balance: '1000.00',
    available: '1000.00',
    locked: '0.00',
    value_usdt: '1000.00'
  },
  { 
    currency: 'MERC',
    icon: '🔷',
    balance: '550.00',
    available: '500.00',
    locked: '50.00',
    value_usdt: '989.45'
  },
  { 
    currency: 'BTC',
    icon: '₿',
    balance: '0.05',
    available: '0.05',
    locked: '0.00',
    value_usdt: '2345.67'
  },
  { 
    currency: 'ETH',
    icon: 'Ξ',
    balance: '1.5',
    available: '1.5',
    locked: '0.00',
    value_usdt: '3456.78'
  }
];

const handleDeposit = (currency) => {
  console.log(`Deposit ${currency}`);
};

const handleWithdraw = (currency) => {
  console.log(`Withdraw ${currency}`);
};
</script>

<template>
  <div class="overflow-x-auto">
    <table class="w-full">
      <thead>
        <tr class="text-gray-400 text-sm border-b border-gray-700">
          <th class="text-left py-4 px-4">资产</th>
          <th class="text-right py-4 px-4">总额</th>
          <th class="text-right py-4 px-4 hidden lg:table-cell">可用</th>
          <th class="text-right py-4 px-4 hidden lg:table-cell">冻结</th>
          <th class="text-right py-4 px-4 hidden lg:table-cell">估值 (USDT)</th>
          <th class="text-center py-4 px-4">操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="asset in assets" 
            :key="asset.currency" 
            class="border-b border-gray-700 hover:bg-gray-800/50 transition-colors">
          <td class="py-4 px-4">
            <div class="flex items-center space-x-2">
              <span class="text-lg">{{ asset.icon }}</span>
              <span class="font-medium">{{ asset.currency }}</span>
            </div>
          </td>
          <td class="text-right py-4 px-4">{{ asset.balance }}</td>
          <td class="text-right py-4 px-4 hidden lg:table-cell">{{ asset.available }}</td>
          <td class="text-right py-4 px-4 hidden lg:table-cell">{{ asset.locked }}</td>
          <td class="text-right py-4 px-4 hidden lg:table-cell">{{ asset.value_usdt }}</td>
          <td class="py-4 px-4">
            <div class="flex justify-center space-x-2">
              <button
                @click="handleDeposit(asset.currency)"
                class="px-3 py-1 text-sm bg-trading-green text-white rounded hover:bg-opacity-90 transition-colors"
              >
                充币
              </button>
              <button
                @click="handleWithdraw(asset.currency)"
                class="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-opacity-90 transition-colors"
                :disabled="parseFloat(asset.available) <= 0"
                :class="{ 'opacity-50 cursor-not-allowed': parseFloat(asset.available) <= 0 }"
              >
                提币
              </button>
            </div>
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr class="bg-trading-darker">
          <td class="py-4 px-4 font-medium">总资产估值</td>
          <td class="text-right py-4 px-4 font-medium lg:hidden">
            {{ assets.reduce((sum, asset) => sum + parseFloat(asset.value_usdt), 0).toFixed(2) }} USDT
          </td>
          <td class="hidden lg:table-cell"></td>
          <td class="hidden lg:table-cell"></td>
          <td class="text-right py-4 px-4 font-medium hidden lg:table-cell">
            {{ assets.reduce((sum, asset) => sum + parseFloat(asset.value_usdt), 0).toFixed(2) }} USDT
          </td>
          <td></td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<style scoped>
.overflow-x-auto {
  -webkit-overflow-scrolling: touch;
}

.overflow-x-auto::-webkit-scrollbar {
  height: 6px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #1E222D;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #4A4A4A;
  border-radius: 3px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>