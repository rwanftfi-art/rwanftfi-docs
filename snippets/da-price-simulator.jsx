import { useState, useMemo, useRef, useEffect } from 'react';

export const DaPriceSimulator = () => {
  if (typeof window === 'undefined') { return null; }

  var [minted, setMinted] = useState(1000000);
  var [liquidity, setLiquidity] = useState(1000000);
  var [burned, setBurned] = useState(0);

  // Debounced values for chart rendering
  var [dbMinted, setDbMinted] = useState(1000000);
  var [dbLiquidity, setDbLiquidity] = useState(1000000);
  var [dbBurned, setDbBurned] = useState(0);
  var timerRef = useRef(null);

  useEffect(function() {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(function() {
      setDbMinted(minted);
      setDbLiquidity(liquidity);
      setDbBurned(burned);
    }, 150);
    return function() { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [minted, liquidity, burned]);

  var fmtUsd = function(n) {
    if (n >= 1000000) return '$' + (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return '$' + (n / 1000).toFixed(1) + 'K';
    if (n >= 100) return '$' + Math.round(n);
    if (n >= 10) return '$' + n.toFixed(1);
    return '$' + n.toFixed(2);
  };
  var fmtUsdFull = function(n) {
    var digits = Math.abs(n) >= 10000 ? 0 : 2;
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: digits }).format(n);
  };
  var fmtNum = function(n) { return new Intl.NumberFormat('en-US').format(Math.round(n)); };

  // Instant KPI values (raw state)
  var circulating = minted - burned;
  if (circulating < 1) circulating = 1;
  var price = liquidity / circulating;
  var basePrice = liquidity / minted;
  var priceChange = ((price - basePrice) / Math.max(basePrice, 0.0001)) * 100;

  var burnedMax = minted - 1;
  var actualBurned = burned > burnedMax ? burnedMax : burned;

  // Moon price: 95% burned
  var moonCirculating = Math.max(minted * 0.05, 1);
  var moonPrice = liquidity / moonCirculating;

  // Chart data using DEBOUNCED values — burn percentage 0% to 95%
  var chartData = useMemo(function() {
    var points = [];
    var steps = 200;
    for (var i = 0; i <= steps; i++) {
      var pct = (i / steps) * 95;
      var b = (pct / 100) * dbMinted;
      var s = dbMinted - b;
      if (s < 1) s = 1;
      var p = dbLiquidity / s;
      points.push({ pct: pct, burned: b, price: p });
    }
    return points;
  }, [dbMinted, dbLiquidity]);

  // Chart dimensions
  var W = 640, H = 280;
  var PAD = { top: 28, right: 56, bottom: 44, left: 64 };
  var cW = W - PAD.left - PAD.right;
  var cH = H - PAD.top - PAD.bottom;

  // Y-axis: square-root scale to make growth visible across entire chart
  var minP = chartData[0] ? chartData[0].price : 1;
  var maxP = chartData[chartData.length - 1] ? chartData[chartData.length - 1].price : minP * 2;
  // Cap at 50x base price so curve goes "off screen" for extreme values
  var capP = minP * 50;
  var displayMaxP = Math.min(maxP, capP);
  var yPad = (displayMaxP - minP) * 0.08 || 0.01;
  displayMaxP = displayMaxP + yPad;

  var sqrtScale = function(val) {
    var norm = (Math.min(val, displayMaxP) - minP) / (displayMaxP - minP || 0.01);
    if (norm < 0) norm = 0;
    return Math.sqrt(norm);
  };

  var getX = function(pct) { return PAD.left + (pct / 95) * cW; };
  var getY = function(p) { return PAD.top + cH - sqrtScale(p) * cH; };

  // Current burn percentage
  var currentPct = dbMinted > 0 ? (dbBurned / dbMinted) * 100 : 0;
  if (currentPct > 95) currentPct = 95;
  var currentChartPrice = dbLiquidity / Math.max(dbMinted - dbBurned, 1);

  // Build line path
  var pathParts = [];
  for (var k = 0; k < chartData.length; k++) {
    var d = chartData[k];
    var px = getX(d.pct).toFixed(1);
    var py = getY(d.price).toFixed(1);
    pathParts.push((k === 0 ? 'M' : 'L') + ' ' + px + ' ' + py);
  }
  var pathD = pathParts.join(' ');

  // Area fill path
  var lastPt = chartData[chartData.length - 1];
  var areaD = pathD + ' L ' + getX(lastPt.pct).toFixed(1) + ' ' + (PAD.top + cH) + ' L ' + getX(0).toFixed(1) + ' ' + (PAD.top + cH) + ' Z';

  // Current position dot
  var dotX = getX(currentPct);
  var dotY = getY(currentChartPrice);

  // Price milestone lines ($10, $100, $1K)
  var milestones = [10, 100, 1000, 10000];
  var visibleMilestones = milestones.filter(function(m) { return m > minP * 1.2 && m < displayMaxP * 0.95; });

  // X-axis labels as percentages
  var xPcts = [0, 20, 40, 60, 80];

  // Y-axis labels
  var yLabelFracs = [0, 0.25, 0.5, 0.75, 1];

  // High deflation zone starts at 50%
  var hdZoneX = getX(50);
  var hdZoneW = getX(95) - hdZoneX;

  var sliderStyle = {
    touchAction: 'manipulation',
    height: '6px',
    borderRadius: '3px',
    background: 'linear-gradient(to right, rgba(255,255,255,0.4), rgba(255,255,255,0.15))',
    outline: 'none',
    WebkitAppearance: 'none',
    appearance: 'none'
  };

  // Pulse animation style
  var pulseKeyframes = '@keyframes daPulse{0%,100%{opacity:0.6;r:12}50%{opacity:0.2;r:18}}';

  return (
    <div style={{ backgroundColor: '#000000', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.05)' }} className="p-6 rounded-xl not-prose">

      {/* Pulse animation */}
      <style>{pulseKeyframes}</style>

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
          <span style={{ color: '#FFFFFF', fontSize: '18px', fontWeight: 800, display: 'block', marginBottom: '8px' }}>{fmtUsdFull(liquidity)}</span>
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
        <div style={{ flexShrink: 0, display: 'flex', justifyContent: 'center' }} className="w-[160px] sm:w-[140px] mx-auto sm:mx-0">
          <video autoPlay muted loop playsInline style={{ borderRadius: '12px', objectFit: 'cover' }} className="w-[160px] h-[160px] sm:w-[140px] sm:h-[140px]">
            <source src="/DAalpha-Uncompressed8-bit422.webm" type="video/webm" />
          </video>
        </div>
        {/* KPI Cards — use RAW values for instant feedback */}
        <div style={{ flex: '1 1 0%', minWidth: '240px', display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          {/* DA Price */}
          <div style={{ backgroundColor: '#383838', border: '1px solid rgba(255,255,255,0.05)', flex: '1 1 160px' }} className="rounded-xl p-4">
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>DA Price</div>
            <div style={{ color: '#4ade80', fontSize: '28px', fontWeight: 900, lineHeight: 1.2 }}>{fmtUsdFull(price)}</div>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', fontWeight: 600, marginTop: '4px' }}>
              {priceChange >= 0 ? 'Up' : 'Down'} {Math.abs(priceChange).toFixed(2)}% from base
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
            <div style={{ color: '#FFFFFF', fontSize: '20px', fontWeight: 900 }}>{fmtUsdFull(liquidity)}</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginTop: '4px' }}>100% USDT backed</div>
          </div>
        </div>
      </div>

      {/* Price Chart */}
      <div style={{ backgroundColor: '#383838', border: '1px solid rgba(255,255,255,0.05)' }} className="rounded-xl p-4 overflow-x-auto">
        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', fontWeight: 600, marginBottom: '8px' }}>Price vs Burn Percentage</div>
        <svg viewBox={'0 0 ' + W + ' ' + H} className="w-full" style={{ minWidth: '400px' }}>
          <defs>
            <linearGradient id="daAreaGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#4ade80" stopOpacity="0.03" />
              <stop offset="100%" stopColor="#4ade80" stopOpacity="0.25" />
            </linearGradient>
          </defs>

          {/* High Deflation Zone background (50%+) */}
          <rect x={hdZoneX} y={PAD.top} width={hdZoneW} height={cH} fill="rgba(251,191,36,0.04)" />
          <text x={hdZoneX + 6} y={PAD.top + 12} fill="rgba(251,191,36,0.3)" style={{ fontSize: '8px', fontWeight: 500 }}>High Deflation Zone</text>

          {/* Horizontal grid lines */}
          {yLabelFracs.map(function(frac, idx) {
            var val = minP + (displayMaxP - minP) * frac;
            var y = getY(val);
            return (
              <line key={'yg-' + idx} x1={PAD.left} y1={y} x2={W - PAD.right} y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
            );
          })}

          {/* Price milestone lines */}
          {visibleMilestones.map(function(m) {
            var y = getY(m);
            return (
              <g key={'ms-' + m}>
                <line x1={PAD.left} y1={y} x2={W - PAD.right} y2={y} stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" strokeDasharray="4 4" />
                <text x={W - PAD.right + 4} y={y + 3} fill="rgba(255,255,255,0.35)" style={{ fontSize: '8px' }}>{fmtUsd(m)}</text>
              </g>
            );
          })}

          {/* Y axis labels */}
          {yLabelFracs.map(function(frac, idx) {
            var val = minP + (displayMaxP - minP) * frac;
            var y = getY(val);
            return (
              <text key={'yl-' + idx} x={PAD.left - 8} y={y} textAnchor="end" dominantBaseline="middle" fill="rgba(255,255,255,0.4)" style={{ fontSize: '9px' }}>
                {fmtUsd(val)}
              </text>
            );
          })}

          {/* Area fill */}
          <path d={areaD} fill="url(#daAreaGrad)" />

          {/* Price line */}
          <path d={pathD} fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Current position: vertical line */}
          <line x1={dotX} y1={PAD.top} x2={dotX} y2={PAD.top + cH} stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="4 3" />

          {/* Current position: pulsing glow */}
          <circle cx={dotX} cy={dotY} r="12" fill="none" stroke="#4ade80" strokeWidth="1.5" opacity="0.4" style={{ animation: 'daPulse 2s ease-in-out infinite' }} />

          {/* Current position: dot */}
          <circle cx={dotX} cy={dotY} r="6" fill="#4ade80" stroke="#000000" strokeWidth="2" />

          {/* Current position: price label */}
          <rect x={dotX + 10} y={dotY - 12} width={Math.max(fmtUsd(currentChartPrice).length * 7 + 12, 48)} height={20} rx="4" fill="rgba(0,0,0,0.7)" stroke="rgba(74,222,128,0.3)" strokeWidth="1" />
          <text x={dotX + 16} y={dotY + 2} fill="#4ade80" style={{ fontSize: '10px', fontWeight: 700 }}>{fmtUsd(currentChartPrice)}</text>

          {/* X axis labels */}
          {xPcts.map(function(pct) {
            return (
              <text key={'xl-' + pct} x={getX(pct)} y={H - PAD.bottom + 18} textAnchor="middle" fill="rgba(255,255,255,0.4)" style={{ fontSize: '9px' }}>
                {pct}%
              </text>
            );
          })}
          <text x={W / 2} y={H - 4} textAnchor="middle" fill="rgba(255,255,255,0.3)" style={{ fontSize: '8px' }}>Burn Percentage (% of Minted Supply)</text>
        </svg>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-2" style={{ paddingLeft: PAD.left + 'px' }}>
          <div className="flex items-center gap-1">
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4ade80' }} />
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px' }}>DA Price</span>
          </div>
          <div className="flex items-center gap-1">
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4ade80', boxShadow: '0 0 6px rgba(74,222,128,0.6)' }} />
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px' }}>Current Position</span>
          </div>
          <div className="flex items-center gap-1">
            <span style={{ display: 'inline-block', width: '12px', height: '6px', backgroundColor: 'rgba(251,191,36,0.15)', borderRadius: '2px' }} />
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px' }}>High Deflation Zone</span>
          </div>
        </div>

        {/* Footer stat: moon price */}
        <div style={{ marginTop: '10px', paddingLeft: PAD.left + 'px' }}>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>
            If 95% of supply is burned:{' '}
            <span style={{ color: '#FFFFFF', fontWeight: 700 }}>{fmtUsdFull(moonPrice)}</span>
            {' '}USDT per DA
          </span>
        </div>
      </div>

      {/* Footer */}
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', lineHeight: 1.6, marginTop: '16px', marginBottom: 0 }}>
        Direct formula calculator. DA Price = Liquidity Pool ÷ Circulating Supply. Supply starts at 0 and grows via farming — hard cap 21M. Every sale burns 100% of sold tokens. On every sale, 25% (manual) or 30% (auto) of USDT backing stays in the pool — this drives the price upward.
      </p>
    </div>
  );
};
