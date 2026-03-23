import { useState, useMemo } from 'react';

export const DaPriceSimulator = () => {
  var [totalParticipants, setTotalParticipants] = useState(5000);
  var [avgPrice, setAvgPrice] = useState(500);
  var [period, setPeriod] = useState(12);

  var fmtUsd = function(n) {
    var digits = Math.abs(n) >= 10000 ? 0 : 2;
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: digits }).format(n);
  };
  var fmtNum = function(n) { return new Intl.NumberFormat('en-US').format(Math.round(n)); };
  var fmtComma = function(n) { return new Intl.NumberFormat('en-US').format(n); };

  var sim = useMemo(function() {
    var pool = 0;
    var supply = 0;
    var accumulatedUsers = 0;
    var totalMinted = 0;
    var totalBurned = 0;
    var dataPoints = [];

    for (var month = 1; month <= period; month++) {
      var newUsers = totalParticipants / period;
      var nftRevenue = newUsers * avgPrice;
      var rebuyRevenue = accumulatedUsers * 0.025 * avgPrice;
      var totalRevenue = nftRevenue + rebuyRevenue;
      accumulatedUsers += newUsers;

      var poolInflow = totalRevenue * 0.25;
      var isDeflationaryCycle = (month % 6 === 0);

      var currentPrice = supply > 0 ? pool / supply : 1.00;
      if (!isDeflationaryCycle) {
        var daMinted = poolInflow / currentPrice;
        supply += daMinted;
        totalMinted += daMinted;
      }
      pool += poolInflow;

      var sellRate = isDeflationaryCycle ? 0.10 : 0.05;
      var daSold = supply * sellRate;
      var daBurned = daSold * 0.27;
      var payoutUSDT = daSold * currentPrice * 0.73;
      pool = Math.max(0, pool - payoutUSDT);
      supply = Math.max(0, supply - daSold);
      totalBurned += daBurned;

      var price = supply > 0 ? pool / supply : 1.00;
      dataPoints.push({ month: month, price: price, pool: pool, supply: supply, isDeflationaryCycle: isDeflationaryCycle });
    }

    var finalPrice = dataPoints.length > 0 ? dataPoints[dataPoints.length - 1].price : 1.00;
    var finalPool = dataPoints.length > 0 ? dataPoints[dataPoints.length - 1].pool : 0;
    var finalSupply = dataPoints.length > 0 ? dataPoints[dataPoints.length - 1].supply : 0;
    var priceChange = ((finalPrice - 1.00) / 1.00) * 100;

    return { dataPoints: dataPoints, finalPrice: finalPrice, finalPool: finalPool, finalSupply: finalSupply, totalMinted: totalMinted, totalBurned: totalBurned, priceChange: priceChange };
  }, [totalParticipants, avgPrice, period]);

  // Chart dimensions
  var W = 640, H = 260;
  var PAD = { top: 24, right: 24, bottom: 36, left: 64 };
  var cW = W - PAD.left - PAD.right;
  var cH = H - PAD.top - PAD.bottom;

  var minP = 1.00;
  var maxP = 1.01;
  for (var j = 0; j < sim.dataPoints.length; j++) {
    if (sim.dataPoints[j].price > maxP) maxP = sim.dataPoints[j].price;
    if (sim.dataPoints[j].price < minP) minP = sim.dataPoints[j].price;
  }
  var yPad = (maxP - minP) * 0.1 || 0.01;
  minP = Math.max(0, minP - yPad);
  maxP = maxP + yPad;
  var rangeP = maxP - minP || 0.01;

  var getX = function(month) { return PAD.left + ((month - 1) / Math.max(period - 1, 1)) * cW; };
  var getY = function(p) { return PAD.top + cH - ((p - minP) / rangeP) * cH; };

  var pathD = sim.dataPoints.map(function(d, idx) {
    return (idx === 0 ? 'M' : 'L') + ' ' + getX(d.month).toFixed(1) + ' ' + getY(d.price).toFixed(1);
  }).join(' ');

  // Y grid lines at 25%, 50%, 75%
  var yGridVals = [0.25, 0.5, 0.75].map(function(frac) { return minP + rangeP * frac; });

  // X axis labels
  var xLabels = [];
  var xStep = period <= 12 ? 1 : period <= 24 ? 3 : 6;
  for (var m = 1; m <= period; m += xStep) { xLabels.push(m); }
  if (xLabels[xLabels.length - 1] !== period) xLabels.push(period);

  var sliderStyle = {
    touchAction: 'manipulation',
    height: '6px',
    borderRadius: '3px',
    background: 'linear-gradient(to right, rgba(255,255,255,0.4), rgba(255,255,255,0.15))',
    outline: 'none',
    WebkitAppearance: 'none',
    appearance: 'none'
  };

  return (
    <div style={{ backgroundColor: '#000000', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.05)' }} className="p-6 rounded-xl not-prose">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 style={{ color: '#FFFFFF', margin: 0 }} className="text-lg font-serif italic">DA Economy Simulator</h3>
        <span style={{ color: 'rgba(255,255,255,0.6)', backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', fontSize: '11px', padding: '4px 12px', borderRadius: '9999px', fontWeight: 500 }}>Interactive</span>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {/* Total Participants */}
        <div style={{ backgroundColor: '#383838', border: '1px solid rgba(255,255,255,0.05)' }} className="rounded-xl p-4">
          <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Total Participants</label>
          <span style={{ color: '#FFFFFF', fontSize: '18px', fontWeight: 800, display: 'block', marginBottom: '8px' }}>{fmtComma(totalParticipants)}</span>
          <input type="range" min="100" max="100000" step="100" value={totalParticipants}
            onChange={function(e) { setTotalParticipants(Number(e.target.value)); }}
            className="w-full cursor-pointer" style={sliderStyle} />
          <div className="flex justify-between text-[10px] mt-1">
            <span style={{ color: 'rgba(255,255,255,0.5)' }}>100</span>
            <span style={{ color: 'rgba(255,255,255,0.5)' }}>100,000</span>
          </div>
        </div>
        {/* Avg NFT Price */}
        <div style={{ backgroundColor: '#383838', border: '1px solid rgba(255,255,255,0.05)' }} className="rounded-xl p-4">
          <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Avg. NFT Price</label>
          <span style={{ color: '#FFFFFF', fontSize: '18px', fontWeight: 800, display: 'block', marginBottom: '8px' }}>{fmtUsd(avgPrice)}</span>
          <input type="range" min="100" max="5000" step="50" value={avgPrice}
            onChange={function(e) { setAvgPrice(Number(e.target.value)); }}
            className="w-full cursor-pointer" style={sliderStyle} />
          <div className="flex justify-between text-[10px] mt-1">
            <span style={{ color: 'rgba(255,255,255,0.5)' }}>$100</span>
            <span style={{ color: 'rgba(255,255,255,0.5)' }}>$5,000</span>
          </div>
        </div>
        {/* Period */}
        <div style={{ backgroundColor: '#383838', border: '1px solid rgba(255,255,255,0.05)' }} className="rounded-xl p-4">
          <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Period</label>
          <span style={{ color: '#FFFFFF', fontSize: '18px', fontWeight: 800, display: 'block', marginBottom: '8px' }}>{period} months</span>
          <input type="range" min="6" max="36" step="6" value={period}
            onChange={function(e) { setPeriod(Number(e.target.value)); }}
            className="w-full cursor-pointer" style={sliderStyle} />
          <div className="flex justify-between text-[10px] mt-1">
            <span style={{ color: 'rgba(255,255,255,0.5)' }}>6</span>
            <span style={{ color: 'rgba(255,255,255,0.5)' }}>36 mo</span>
          </div>
        </div>
      </div>

      {/* KPI Section: Video + Cards */}
      <div className="mb-6" style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
        {/* Video */}
        <div style={{ flexShrink: 0, width: '120px', display: 'flex', justifyContent: 'center' }} className="mx-auto sm:mx-0">
          <video autoPlay muted loop playsInline style={{ width: '120px', height: '120px', borderRadius: '12px', objectFit: 'cover' }}>
            <source src="/DAalpha-trimmed.webm" type="video/webm" />
          </video>
        </div>
        {/* KPI Cards */}
        <div style={{ flex: '1 1 0%', minWidth: '240px', display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          {/* DA Price */}
          <div style={{ backgroundColor: '#383838', border: '1px solid rgba(255,255,255,0.05)', flex: '1 1 160px' }} className="rounded-xl p-4">
            <div style={{ color: 'rgba(255,255,255,0.5)' }} className="text-[10px] uppercase tracking-wider mb-1">DA Price</div>
            <div style={{ color: '#4ade80', fontSize: '28px', fontWeight: 900, lineHeight: 1.2 }}>{fmtUsd(sim.finalPrice)}</div>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', fontWeight: 600, marginTop: '4px' }}>
              {sim.priceChange >= 0 ? 'Up' : 'Down'} {Math.abs(sim.priceChange).toFixed(2)}% from $1.00
            </div>
          </div>
          {/* Liquidity Pool */}
          <div style={{ backgroundColor: '#383838', border: '1px solid rgba(255,255,255,0.05)', flex: '1 1 160px' }} className="rounded-xl p-4">
            <div style={{ color: 'rgba(255,255,255,0.5)' }} className="text-[10px] uppercase tracking-wider mb-1">Liquidity Pool</div>
            <div style={{ color: '#FFFFFF' }} className="text-lg md:text-xl font-black">{fmtUsd(sim.finalPool)}</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginTop: '4px' }}>100% USDT backed</div>
          </div>
          {/* Circulating Supply */}
          <div style={{ backgroundColor: '#383838', border: '1px solid rgba(255,255,255,0.05)', flex: '1 1 160px' }} className="rounded-xl p-4">
            <div style={{ color: 'rgba(255,255,255,0.5)' }} className="text-[10px] uppercase tracking-wider mb-1">Circulating Supply</div>
            <div style={{ color: '#FFFFFF' }} className="text-lg md:text-xl font-black">{fmtNum(sim.finalSupply)} DA</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginTop: '4px' }}>Minted: {fmtNum(sim.totalMinted)} · Burned: {fmtNum(sim.totalBurned)}</div>
          </div>
        </div>
      </div>

      {/* Price Chart */}
      <div style={{ backgroundColor: '#383838', border: '1px solid rgba(255,255,255,0.05)' }} className="rounded-xl p-4 overflow-x-auto">
        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', fontWeight: 600, marginBottom: '8px' }}>Price Growth</div>
        <svg viewBox={'0 0 ' + W + ' ' + H} className="w-full" style={{ minWidth: '400px' }}>
          <defs>
            <linearGradient id="daEconGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4ade80" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#4ade80" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Deflationary cycle bands */}
          {sim.dataPoints.map(function(d) {
            if (!d.isDeflationaryCycle) return null;
            var bandW = cW / Math.max(period - 1, 1);
            return (
              <rect key={'dc-' + d.month} x={getX(d.month) - bandW / 2} y={PAD.top} width={bandW} height={cH} fill="#fbbf24" fillOpacity="0.08" />
            );
          })}

          {/* Horizontal grid lines */}
          {yGridVals.map(function(val, idx) {
            return (
              <line key={'yg-' + idx} x1={PAD.left} y1={getY(val)} x2={W - PAD.right} y2={getY(val)} stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
            );
          })}

          {/* Y axis labels */}
          {[0, 0.25, 0.5, 0.75, 1].map(function(frac, idx) {
            var val = minP + rangeP * frac;
            return (
              <text key={'yl-' + idx} x={PAD.left - 8} y={getY(val)} textAnchor="end" dominantBaseline="middle" fill="rgba(255,255,255,0.4)" style={{ fontSize: '9px' }}>
                ${val.toFixed(2)}
              </text>
            );
          })}

          {/* Area fill */}
          {sim.dataPoints.length > 0 && (
            <path d={pathD + ' L ' + getX(sim.dataPoints[sim.dataPoints.length - 1].month).toFixed(1) + ' ' + (PAD.top + cH) + ' L ' + getX(1).toFixed(1) + ' ' + (PAD.top + cH) + ' Z'} fill="url(#daEconGrad)" />
          )}

          {/* Price line */}
          <path d={pathD} fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* X axis labels */}
          {xLabels.map(function(mo) {
            return (
              <text key={'xl-' + mo} x={getX(mo)} y={H - 8} textAnchor="middle" fill="rgba(255,255,255,0.4)" style={{ fontSize: '9px' }}>
                {mo}
              </text>
            );
          })}
          <text x={W / 2} y={H - 0} textAnchor="middle" fill="rgba(255,255,255,0.3)" style={{ fontSize: '8px' }}>Month</text>
        </svg>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-2" style={{ paddingLeft: PAD.left + 'px' }}>
          <div className="flex items-center gap-1">
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4ade80' }} />
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px' }}>DA Price</span>
          </div>
          <div className="flex items-center gap-1">
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#fbbf24' }} />
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px' }}>Deflationary Cycle</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', lineHeight: 1.6, marginTop: '16px', marginBottom: 0 }}>
        Simplified simulation model. Pool starts at $0 — DA is only minted when liquidity flows in from participants. Inflow rate: 25% of NFT turnover (purchases, rebuys, fees). Sell assumption: 5%/month of supply (10% during Deflationary Cycles). Average burn: 27%. Actual results depend on ecosystem activity and DAO governance.
      </p>
    </div>
  );
};
