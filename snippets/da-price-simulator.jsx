import { useState, useMemo } from 'react';

export const DaPriceSimulator = () => {
  if (typeof window === 'undefined') { return null; }

  var [minted, setMinted] = useState(1000000);
  var [liquidity, setLiquidity] = useState(1000000);
  var [burned, setBurned] = useState(0);

  var fmtUsd = function(n) {
    var digits = Math.abs(n) >= 10000 ? 0 : 2;
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: digits }).format(n);
  };
  var fmtNum = function(n) { return new Intl.NumberFormat('en-US').format(Math.round(n)); };

  var circulating = minted - burned;
  if (circulating < 1) circulating = 1;
  var price = liquidity / circulating;
  var priceChange = ((price - 1.00) / 1.00) * 100;

  var burnedMax = minted - 1;
  var actualBurned = burned > burnedMax ? burnedMax : burned;

  // Chart: price curve as function of burn from 0 to ~minted
  var chartData = useMemo(function() {
    var points = [];
    var steps = 200;
    var maxBurn = minted - 1;
    for (var i = 0; i <= steps; i++) {
      var b = (i / steps) * maxBurn;
      var s = minted - b;
      if (s < 1) s = 1;
      var p = liquidity / s;
      points.push({ burned: b, price: p });
    }
    return points;
  }, [minted, liquidity]);

  // Chart dimensions
  var W = 640, H = 260;
  var PAD = { top: 24, right: 24, bottom: 36, left: 64 };
  var cW = W - PAD.left - PAD.right;
  var cH = H - PAD.top - PAD.bottom;

  var maxBurnChart = minted - 1;
  var minP = chartData[0] ? chartData[0].price : 1;
  var maxP = minP;
  for (var j = 0; j < chartData.length; j++) {
    if (chartData[j].price > maxP) maxP = chartData[j].price;
  }
  // Cap display at a reasonable max to keep chart useful
  var displayMaxP = Math.min(maxP, minP * 100);
  var yPad = (displayMaxP - minP) * 0.1 || 0.01;
  displayMaxP = displayMaxP + yPad;
  var rangeP = displayMaxP - minP || 0.01;

  var getX = function(b) { return PAD.left + (b / Math.max(maxBurnChart, 1)) * cW; };
  var getY = function(p) {
    var clamped = Math.min(p, displayMaxP);
    return PAD.top + cH - ((clamped - minP) / rangeP) * cH;
  };

  // Build path, stopping when price exceeds display range
  var pathParts = [];
  for (var k = 0; k < chartData.length; k++) {
    var d = chartData[k];
    var px = getX(d.burned).toFixed(1);
    var py = getY(d.price).toFixed(1);
    pathParts.push((k === 0 ? 'M' : 'L') + ' ' + px + ' ' + py);
  }
  var pathD = pathParts.join(' ');

  // Area fill path
  var areaD = pathD + ' L ' + getX(chartData[chartData.length - 1].burned).toFixed(1) + ' ' + (PAD.top + cH) + ' L ' + getX(0).toFixed(1) + ' ' + (PAD.top + cH) + ' Z';

  // Current position dot
  var dotX = getX(actualBurned);
  var dotY = getY(price);

  // Y grid
  var yGridVals = [0.25, 0.5, 0.75].map(function(frac) { return minP + rangeP * frac; });

  // X axis labels
  var xLabelCount = 5;
  var xLabels = [];
  for (var xi = 0; xi <= xLabelCount; xi++) {
    xLabels.push(Math.round((xi / xLabelCount) * maxBurnChart));
  }

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
        <h3 style={{ color: '#FFFFFF', margin: 0 }} className="text-lg font-serif italic">DA Price Simulator</h3>
        <span style={{ color: 'rgba(255,255,255,0.6)', backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', fontSize: '11px', padding: '4px 12px', borderRadius: '9999px', fontWeight: 500 }}>Interactive</span>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {/* DA Minted */}
        <div style={{ backgroundColor: '#383838', border: '1px solid rgba(255,255,255,0.05)' }} className="rounded-xl p-4">
          <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontWeight: 500, display: 'block', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>DA Minted</label>
          <span style={{ color: '#FFFFFF', fontSize: '18px', fontWeight: 800, display: 'block', marginBottom: '8px' }}>{fmtNum(minted)} DA</span>
          <input type="range" min="10000" max="21000000" step="10000" value={minted}
            onChange={function(e) {
              var val = Number(e.target.value);
              setMinted(val);
              if (burned >= val) setBurned(val - 1);
            }}
            className="w-full cursor-pointer" style={sliderStyle} />
          <div className="flex justify-between text-[10px] mt-1">
            <span style={{ color: 'rgba(255,255,255,0.5)' }}>10,000</span>
            <span style={{ color: 'rgba(255,255,255,0.5)' }}>21,000,000</span>
          </div>
        </div>
        {/* USDT Liquidity Pool */}
        <div style={{ backgroundColor: '#383838', border: '1px solid rgba(255,255,255,0.05)' }} className="rounded-xl p-4">
          <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontWeight: 500, display: 'block', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>USDT Liquidity Pool</label>
          <span style={{ color: '#FFFFFF', fontSize: '18px', fontWeight: 800, display: 'block', marginBottom: '8px' }}>{fmtUsd(liquidity)}</span>
          <input type="range" min="10000" max="100000000" step="10000" value={liquidity}
            onChange={function(e) { setLiquidity(Number(e.target.value)); }}
            className="w-full cursor-pointer" style={sliderStyle} />
          <div className="flex justify-between text-[10px] mt-1">
            <span style={{ color: 'rgba(255,255,255,0.5)' }}>$10,000</span>
            <span style={{ color: 'rgba(255,255,255,0.5)' }}>$100,000,000</span>
          </div>
        </div>
        {/* DA Burned */}
        <div style={{ backgroundColor: '#383838', border: '1px solid rgba(255,255,255,0.05)' }} className="rounded-xl p-4">
          <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontWeight: 500, display: 'block', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>DA Burned</label>
          <span style={{ color: '#FFFFFF', fontSize: '18px', fontWeight: 800, display: 'block', marginBottom: '8px' }}>{fmtNum(actualBurned)} DA</span>
          <input type="range" min="0" max={burnedMax} step="10000" value={actualBurned}
            onChange={function(e) { setBurned(Number(e.target.value)); }}
            className="w-full cursor-pointer" style={sliderStyle} />
          <div className="flex justify-between text-[10px] mt-1">
            <span style={{ color: 'rgba(255,255,255,0.5)' }}>0</span>
            <span style={{ color: 'rgba(255,255,255,0.5)' }}>{fmtNum(burnedMax)}</span>
          </div>
        </div>
      </div>

      {/* KPI Section: Video + Cards */}
      <div className="mb-6" style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
        {/* Video */}
        <div style={{ flexShrink: 0, width: '120px', display: 'flex', justifyContent: 'center' }} className="mx-auto sm:mx-0">
          <video autoPlay muted loop playsInline style={{ width: '120px', height: '120px', borderRadius: '12px', objectFit: 'cover' }}>
            <source src="/DAalpha-Uncompressed8-bit422.webm" type="video/webm" />
          </video>
        </div>
        {/* KPI Cards */}
        <div style={{ flex: '1 1 0%', minWidth: '240px', display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          {/* DA Price */}
          <div style={{ backgroundColor: '#383838', border: '1px solid rgba(255,255,255,0.05)', flex: '1 1 160px' }} className="rounded-xl p-4">
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>DA Price</div>
            <div style={{ color: '#4ade80', fontSize: '28px', fontWeight: 900, lineHeight: 1.2 }}>{fmtUsd(price)}</div>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', fontWeight: 600, marginTop: '4px' }}>
              {priceChange >= 0 ? 'Up' : 'Down'} {Math.abs(priceChange).toFixed(2)}% from $1.00
            </div>
          </div>
          {/* Circulating Supply */}
          <div style={{ backgroundColor: '#383838', border: '1px solid rgba(255,255,255,0.05)', flex: '1 1 160px' }} className="rounded-xl p-4">
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Circulating Supply</div>
            <div style={{ color: '#FFFFFF', fontSize: '20px', fontWeight: 900 }}>{fmtNum(circulating)} DA</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginTop: '4px' }}>of 21M hard cap</div>
          </div>
          {/* Liquidity Pool */}
          <div style={{ backgroundColor: '#383838', border: '1px solid rgba(255,255,255,0.05)', flex: '1 1 160px' }} className="rounded-xl p-4">
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Liquidity Pool</div>
            <div style={{ color: '#FFFFFF', fontSize: '20px', fontWeight: 900 }}>{fmtUsd(liquidity)}</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginTop: '4px' }}>100% USDT backed</div>
          </div>
        </div>
      </div>

      {/* Price Chart */}
      <div style={{ backgroundColor: '#383838', border: '1px solid rgba(255,255,255,0.05)' }} className="rounded-xl p-4 overflow-x-auto">
        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', fontWeight: 600, marginBottom: '8px' }}>Price Curve</div>
        <svg viewBox={'0 0 ' + W + ' ' + H} className="w-full" style={{ minWidth: '400px' }}>
          <defs>
            <linearGradient id="daPriceGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4ade80" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#4ade80" stopOpacity="0.02" />
            </linearGradient>
          </defs>

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
                {fmtUsd(val)}
              </text>
            );
          })}

          {/* Area fill */}
          <path d={areaD} fill="url(#daPriceGrad)" />

          {/* Price line */}
          <path d={pathD} fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Current position marker */}
          <line x1={dotX} y1={PAD.top} x2={dotX} y2={PAD.top + cH} stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="4 3" />
          <circle cx={dotX} cy={dotY} r="5" fill="#4ade80" stroke="#000000" strokeWidth="2" />

          {/* X axis labels */}
          {xLabels.map(function(val) {
            return (
              <text key={'xl-' + val} x={getX(val)} y={H - 8} textAnchor="middle" fill="rgba(255,255,255,0.4)" style={{ fontSize: '9px' }}>
                {fmtNum(val)}
              </text>
            );
          })}
          <text x={W / 2} y={H - 0} textAnchor="middle" fill="rgba(255,255,255,0.3)" style={{ fontSize: '8px' }}>DA Burned</text>
        </svg>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-2" style={{ paddingLeft: PAD.left + 'px' }}>
          <div className="flex items-center gap-1">
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4ade80' }} />
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px' }}>DA Price</span>
          </div>
          <div className="flex items-center gap-1">
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#FFFFFF' }} />
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px' }}>Current Position</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', lineHeight: 1.6, marginTop: '16px', marginBottom: 0 }}>
        Direct formula calculator. DA Price = Liquidity Pool ÷ Circulating Supply. Supply starts at 0 and grows via farming — hard cap 21M. Every sale burns 100% of sold tokens. Commission (25% manual / 30% auto-sell) stays in the pool.
      </p>
    </div>
  );
};
