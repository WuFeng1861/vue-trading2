<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  showType: {
    type: String,
    required: true,
    validator: (value) => ['current', 'history'].includes(value)
  }
});

const isMobile = ref(false);
let mediaQuery;
let handleResize; // Declare handleResize at the top level

onMounted(() => {
  mediaQuery = window.matchMedia('(max-width: 768px)');
  isMobile.value = mediaQuery.matches;
  
  // Define handleResize function
  handleResize = (e) => {
    isMobile.value = e.matches;
  };
  
  // Modern browsers
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', handleResize);
  }
  // Older browsers
  else if (mediaQuery.addListener) {
    mediaQuery.addListener(handleResize);
  }
});

onUnmounted(() => {
  if (mediaQuery && handleResize) {
    // Modern browsers
    if (mediaQuery.removeEventListener) {
      mediaQuery.removeEventListener('change', handleResize);
    }
    // Older browsers
    else if (mediaQuery.removeListener) {
      mediaQuery.removeListener(handleResize);
    }
  }
});

const orders = {
  current: [
    { 
      id: '0x1234...5678',
      pair: 'MERC-USDT',
      direction: 'buy',
      price: '1.7942',
      amount: '100.00',
      filled: '0.00',
      fee: '0.00',
      status: 'pending',
      time: '2024-02-20 10:30:15'
    },
    { 
      id: '0x2345...6789',
      pair: 'MERC-USDT',
      direction: 'sell',
      price: '1.8000',
      amount: '50.00',
      filled: '25.00',
      fee: '0.0225',
      status: 'partial',
      time: '2024-02-20 10:29:30'
    },
  ],
  history: [
    { 
      id: '0x3456...7890',
      pair: 'MERC-USDT',
      direction: 'buy',
      price: '1.7850',
      amount: '200.00',
      filled: '200.00',
      fee: '0.1800',
      time: '2024-02-20 10:15:00'
    },
    { 
      id: '0x4567...8901',
      pair: 'MERC-USDT',
      direction: 'sell',
      price: '1.7900',
      amount: '150.00',
      filled: '150.00',
      fee: '0.1350',
      time: '2024-02-20 10:00:00'
    },
  ],
};

const cancelOrder = (orderId) => {
  console.log('Canceling order:', orderId);
};

const viewDetails = (orderId) => {
  console.log('Viewing details for order:', orderId);
};

const getStatusText = (status) => {
  return {
    'pending': '待成交',
    'partial': '部分成交',
    'completed': '已完成',
    'canceled': '已取消'
  }[status];
};

const getStatusClass = (status) => {
  return {
    'pending': 'text-yellow-500',
    'partial': 'text-blue-500',
    'completed': 'text-green-500',
    'canceled': 'text-gray-500'
  }[status];
};
</script>

<template>
  <div class="overflow-x-auto">
    <table class="w-full text-sm">
      <thead>
        <tr class="text-gray-400">
          <template v-if="!isMobile">
            <th class="text-left py-3 px-4 font-medium">时间</th>
            <th class="text-left py-3 px-4 font-medium">交易对</th>
            <th class="text-left py-3 px-4 font-medium">方向</th>
            <th class="text-right py-3 px-4 font-medium">价格</th>
            <th class="text-right py-3 px-4 font-medium">数量</th>
            <th class="text-right py-3 px-4 font-medium">已成交</th>
            <th class="text-right py-3 px-4 font-medium">手续费</th>
            <th v-if="showType === 'current'" class="text-center py-3 px-4 font-medium">状态</th>
            <th class="text-left py-3 px-4 font-medium">订单编号</th>
            <th class="text-right py-3 px-4 font-medium">操作</th>
          </template>
          <template v-else>
            <th class="text-left py-3 px-4 font-medium">交易对</th>
            <th class="text-right py-3 px-4 font-medium">价格</th>
            <th class="text-right py-3 px-4 font-medium">数量</th>
            <th v-if="showType === 'current'" class="text-center py-3 px-4 font-medium">状态</th>
          </template>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders[showType]" 
            :key="order.id" 
            class="border-t border-gray-700 hover:bg-gray-800/50 transition-colors">
          <template v-if="!isMobile">
            <td class="py-3 px-4">{{ order.time }}</td>
            <td class="py-3 px-4">{{ order.pair }}</td>
            <td class="py-3 px-4" 
                :class="order.direction === 'buy' ? 'text-trading-green' : 'text-trading-red'">
              {{ order.direction === 'buy' ? '买入' : '卖出' }}
            </td>
            <td class="text-right py-3 px-4">{{ order.price }}</td>
            <td class="text-right py-3 px-4">{{ order.amount }}</td>
            <td class="text-right py-3 px-4">{{ order.filled }}</td>
            <td class="text-right py-3 px-4">{{ order.fee }}</td>
            <td v-if="showType === 'current'" class="text-center py-3 px-4">
              <span :class="getStatusClass(order.status)" class="px-2 py-1 rounded-full text-xs">
                {{ getStatusText(order.status) }}
              </span>
            </td>
            <td class="py-3 px-4 font-mono text-xs">{{ order.id }}</td>
            <td class="text-right py-3 px-4">
              <template v-if="showType === 'current'">
                <button 
                  v-if="order.status !== 'completed'"
                  @click="cancelOrder(order.id)"
                  class="px-3 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors"
                >
                  撤销
                </button>
              </template>
              <template v-else>
                <button 
                  @click="viewDetails(order.id)"
                  class="px-3 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors"
                >
                  详情
                </button>
              </template>
            </td>
          </template>
          <template v-else>
            <td class="py-3 px-4">{{ order.pair }}</td>
            <td class="text-right py-3 px-4">{{ order.price }}</td>
            <td class="text-right py-3 px-4">{{ order.amount }}</td>
            <td v-if="showType === 'current'" class="text-center py-3 px-4">
              <span :class="getStatusClass(order.status)" class="px-2 py-1 rounded-full text-xs">
                {{ getStatusText(order.status) }}
              </span>
            </td>
          </template>
        </tr>
        <tr v-if="orders[showType].length === 0" class="border-t border-gray-700">
          <td :colspan="isMobile ? (showType === 'current' ? 4 : 3) : (showType === 'current' ? 10 : 9)" class="text-center py-8 text-gray-400">
            暂无{{ showType === 'current' ? '当前委托' : '历史委托' }}记录
          </td>
        </tr>
      </tbody>
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