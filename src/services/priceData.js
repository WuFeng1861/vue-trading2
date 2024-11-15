// Generate realistic-looking trading data
export function generateHistoricalData(days = 30) {
  const data = [];
  let basePrice = 1.79;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    const volatility = 0.02;
    const change = (Math.random() - 0.5) * volatility;
    const open = basePrice * (1 + change);
    const high = open * (1 + Math.random() * 0.01);
    const low = open * (1 - Math.random() * 0.01);
    const close = (high + low) / 2 + (Math.random() - 0.5) * 0.01;
    
    basePrice = close;
    
    data.push({
      time: date.toISOString().split('T')[0],
      open: parseFloat(open.toFixed(4)),
      high: parseFloat(high.toFixed(4)),
      low: parseFloat(low.toFixed(4)),
      close: parseFloat(close.toFixed(4)),
      volume: Math.floor(Math.random() * 100000 + 50000)
    });
  }
  
  return data;
}