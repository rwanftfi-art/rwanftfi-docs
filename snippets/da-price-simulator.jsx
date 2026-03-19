import { useState } from 'react';

export const DaPriceSimulator = () => {
  var [daMinted, setDaMinted] = useState(1000000);
  var [liquidityPool, setLiquidityPool] = useState(1000000);
  var [tokensBurned, setTokensBurned] = useState(0);

  var fmtUsd = function(n) {
    var digits = Math.abs(n) >= 10000 ? 0 : 2;
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: digits }).format(n);
  };
  var fmtNum = function(n) { return new Intl.NumberFormat('en-US').format(Math.round(n)); };

  var circulatingSupply = Math.max(daMinted - tokensBurned, 1);
  var price = liquidityPool / circulatingSupply;
  var priceChange = ((price - 1) / 1) * 100;

  var maxBurn = Math.max(daMinted - 1, 0);

  // Chart data: X = tokens burned (0 to current tokensBurned), Y = price at that burn level
  var curveData = [];
  var N = 50;
  for (var i = 0; i <= N; i++) {
    var frac = i / N;
    var burned = tokensBurned * frac;
    var supply = Math.max(daMinted - burned, 1);
    curveData.push({ i: i, burned: burned, price: liquidityPool / supply });
  }

  var W = 600, H = 240;
  var PAD = { top: 20, right: 20, bottom: 30, left: 60 };
  var cW = W - PAD.left - PAD.right, cH = H - PAD.top - PAD.bottom;

  var maxP = 1.01;
  var minP = 0.99;
  for (var j = 0; j < curveData.length; j++) {
    if (curveData[j].price > maxP) maxP = curveData[j].price;
    if (curveData[j].price < minP) minP = curveData[j].price;
  }
  var rangeP = maxP - minP || 0.01;

  var getX = function(idx) { return PAD.left + (idx / N) * cW; };
  var getY = function(p) { return PAD.top + cH - ((p - minP) / rangeP) * cH; };

  var pathD = curveData.map(function(d, idx) {
    return (idx === 0 ? 'M' : 'L') + ' ' + getX(d.i).toFixed(1) + ' ' + getY(d.price).toFixed(1);
  }).join(' ');
  var areaD = pathD + ' L ' + getX(N).toFixed(1) + ' ' + (PAD.top + cH) + ' L ' + PAD.left + ' ' + (PAD.top + cH) + ' Z';

  var yTicks = 5;
  var yVals = [];
  for (var k = 0; k < yTicks; k++) {
    yVals.push(minP + (rangeP * k) / (yTicks - 1));
  }
  var lastPt = curveData[curveData.length - 1];

  return (
    <>
    <style>{`
  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #FFFFFF;
    cursor: pointer;
    border: 2px solid rgba(255,255,255,0.3);
    box-shadow: 0 0 6px rgba(255,255,255,0.2);
  }
  input[type="range"]::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #FFFFFF;
    cursor: pointer;
    border: 2px solid rgba(255,255,255,0.3);
    box-shadow: 0 0 6px rgba(255,255,255,0.2);
  }
  input[type="range"]::-webkit-slider-runnable-track {
    height: 6px;
    border-radius: 3px;
  }
  input[type="range"]::-moz-range-track {
    height: 6px;
    border-radius: 3px;
    background: rgba(255,255,255,0.15);
  }
`}</style>
    <div style={{ backgroundColor: '#000000', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.05)' }} className="p-6 rounded-xl not-prose">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 style={{ color: '#FFFFFF', margin: 0 }} className="text-lg font-serif italic">DA Price Simulator</h3>
        <span style={{ color: 'rgba(255,255,255,0.6)', backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', fontSize: '11px', padding: '4px 12px', borderRadius: '9999px', fontWeight: 500 }}>Interactive</span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <div style={{ backgroundColor: '#383838', border: '1px solid rgba(255,255,255,0.05)' }} className="rounded-xl p-4">
          <div style={{ color: 'rgba(255,255,255,0.5)' }} className="text-[10px] uppercase tracking-wider mb-1">DA Price</div>
          <div style={{ color: '#FFFFFF', fontSize: '28px', fontWeight: 900, lineHeight: 1.2 }} className="transition-all duration-300">{fmtUsd(price)}</div>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', fontWeight: 600, marginTop: '4px' }}>
            {priceChange >= 0 ? 'Up' : 'Down'} {Math.abs(priceChange).toFixed(2)}% from $1.00
          </div>
        </div>
        <div style={{ backgroundColor: '#383838', border: '1px solid rgba(255,255,255,0.05)' }} className="rounded-xl p-4">
          <div style={{ color: 'rgba(255,255,255,0.5)' }} className="text-[10px] uppercase tracking-wider mb-1">Circulating Supply</div>
          <div style={{ color: '#FFFFFF' }} className="text-lg md:text-xl font-black transition-all duration-300">{fmtNum(circulatingSupply)}</div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginTop: '4px' }}>Minted: {fmtNum(daMinted)} · Burned: {fmtNum(tokensBurned)}</div>
        </div>
        <div style={{ backgroundColor: '#383838', border: '1px solid rgba(255,255,255,0.05)' }} className="rounded-xl p-4">
          <div style={{ color: 'rgba(255,255,255,0.5)' }} className="text-[10px] uppercase tracking-wider mb-1">Liquidity Pool</div>
          <div style={{ color: '#FFFFFF' }} className="text-lg md:text-xl font-black transition-all duration-300">{fmtUsd(liquidityPool)}</div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginTop: '4px' }}>100% USDT backed</div>
        </div>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div style={{ backgroundColor: '#383838', border: '1px solid rgba(255,255,255,0.05)' }} className="rounded-xl p-4">
          <div className="mb-2">
            <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>DA in Circulation</label>
            <span style={{ color: '#FFFFFF', fontSize: '18px', fontWeight: 800, display: 'block' }}>{fmtNum(daMinted)} DA</span>
          </div>
          <input type="range" min="100000" max="21000000" step="100000" value={daMinted}
            onChange={function(e) {
              var val = Number(e.target.value);
              setDaMinted(val);
              if (tokensBurned >= val) setTokensBurned(Math.max(val - 1, 0));
            }}
            className="w-full cursor-pointer"
            style={{
              touchAction: 'manipulation',
              height: '6px',
              borderRadius: '3px',
              background: 'linear-gradient(to right, rgba(255,255,255,0.4), rgba(255,255,255,0.15))',
              outline: 'none',
              WebkitAppearance: 'none',
              appearance: 'none',
              direction: 'rtl',
            }} />
          <div className="flex justify-between text-[10px] mt-1"><span style={{ color: 'rgba(255,255,255,0.5)' }}>21M DA</span><span style={{ color: 'rgba(255,255,255,0.5)' }}>100K</span></div>
        </div>
        <div style={{ backgroundColor: '#383838', border: '1px solid rgba(255,255,255,0.05)' }} className="rounded-xl p-4">
          <div className="mb-2">
            <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>USDT Liquidity Pool</label>
            <span style={{ color: '#FFFFFF', fontSize: '18px', fontWeight: 800, display: 'block' }}>{fmtUsd(liquidityPool)}</span>
          </div>
          <input type="range" min="100000" max="50000000" step="100000" value={liquidityPool}
            onChange={function(e) { setLiquidityPool(Number(e.target.value)); }}
            className="w-full cursor-pointer"
            style={{
              touchAction: 'manipulation',
              height: '6px',
              borderRadius: '3px',
              background: 'linear-gradient(to right, rgba(255,255,255,0.4), rgba(255,255,255,0.15))',
              outline: 'none',
              WebkitAppearance: 'none',
              appearance: 'none',
            }} />
          <div className="flex justify-between text-[10px] mt-1"><span style={{ color: 'rgba(255,255,255,0.5)' }}>$100K</span><span style={{ color: 'rgba(255,255,255,0.5)' }}>$50M</span></div>
        </div>
        <div style={{ backgroundColor: '#383838', border: '1px solid rgba(255,255,255,0.05)' }} className="rounded-xl p-4">
          <div className="mb-2">
            <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>DA Burned (from sales)</label>
            <span style={{ color: '#FFFFFF', fontSize: '18px', fontWeight: 800, display: 'block' }}>{fmtNum(tokensBurned)} DA</span>
          </div>
          <input type="range" min="0" max={maxBurn} step="10000" value={Math.min(tokensBurned, maxBurn)}
            onChange={function(e) { setTokensBurned(Number(e.target.value)); }}
            className="w-full cursor-pointer"
            style={{
              touchAction: 'manipulation',
              height: '6px',
              borderRadius: '3px',
              background: 'linear-gradient(to right, rgba(255,255,255,0.4), rgba(255,255,255,0.15))',
              outline: 'none',
              WebkitAppearance: 'none',
              appearance: 'none',
            }} />
          <div className="flex justify-between text-[10px] mt-1"><span style={{ color: 'rgba(255,255,255,0.5)' }}>0</span><span style={{ color: 'rgba(255,255,255,0.5)' }}>{fmtNum(maxBurn)} DA</span></div>
        </div>
      </div>

      {/* SVG Chart */}
      <div style={{ backgroundColor: '#383838', border: '1px solid rgba(255,255,255,0.05)' }} className="rounded-xl p-4 overflow-x-auto">
        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', fontWeight: 600, marginBottom: '8px' }}>Price Curve</div>
        {tokensBurned === 0 && (
          <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }} className="flex items-center gap-3 px-4 py-3 mb-3 rounded-lg">
            <span style={{ fontSize: '18px' }}>Hint</span>
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', fontWeight: 500 }}>
              Move the sliders above to simulate how burning DA tokens increases the price at a given liquidity level.
            </span>
          </div>
        )}
        <svg viewBox={'0 0 ' + W + ' ' + H} className="w-full" style={{ minWidth: '400px' }}>
          <defs>
            <linearGradient id="daPriceGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          {yVals.map(function(val, idx) {
            return (
              <g key={idx}>
                <line x1={PAD.left} y1={getY(val)} x2={W - PAD.right} y2={getY(val)} stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
                <text x={PAD.left - 8} y={getY(val)} textAnchor="end" dominantBaseline="middle" fill="rgba(255,255,255,0.5)" style={{ fontSize: '9px' }}>${val.toFixed(2)}</text>
              </g>
            );
          })}
          <path d={areaD} fill="url(#daPriceGrad)" />
          <path d={pathD} fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          {tokensBurned > 0 && (
            <g>
              <line x1={getX(N)} y1={PAD.top} x2={getX(N)} y2={PAD.top + cH} stroke="#FFFFFF" strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.5" />
              <circle cx={getX(N)} cy={getY(lastPt.price)} r="5" fill="#FFFFFF" stroke="#000000" strokeWidth="2" />
              <text x={getX(N)} y={getY(lastPt.price) - 12} textAnchor="middle" fill="#FFFFFF" style={{ fontSize: '10px', fontWeight: 'bold' }}>{fmtUsd(lastPt.price)}</text>
            </g>
          )}
          <text x={W / 2} y={H - 4} textAnchor="middle" fill="rgba(255,255,255,0.5)" style={{ fontSize: '9px' }}>Tokens Burned</text>
        </svg>
      </div>

      {/* Disclaimer */}
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', lineHeight: 1.6, marginTop: '16px', marginBottom: 0 }}>
        Simplified model. Price = Liquidity Pool ÷ Circulating Supply.
        DA tokens are minted through farming and burned when sold
        (25% manual, 30% auto-sell). Liquidity grows from 5% marketing
        commission, lending fees, RWA and FinPro revenue.
        Maximum supply: 21,000,000 DA.
      </p>
    </div>
    </>
  );
};
