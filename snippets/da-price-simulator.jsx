import { useState, useMemo } from 'react';

export const DaPriceSimulator = () => {
  const INITIAL_SUPPLY = 21_000_000;
  const INITIAL_LIQUIDITY = 21_000_000;

  const [burnAmount, setBurnAmount] = useState(0);
  const [liquidityInflow, setLiquidityInflow] = useState(0);

  const fmtUsd = (n) => {
    if (Math.abs(n) >= 10000) {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
    }
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(n);
  };
  const fmtNum = (n) => new Intl.NumberFormat('en-US').format(Math.round(n));

  const calcPrice = (liquidity, supply) => {
    if (supply <= 0) return Infinity;
    return liquidity / supply;
  };

  const finalSupply = useMemo(() => Math.max(INITIAL_SUPPLY - burnAmount, 1), [burnAmount]);
  const finalLiquidity = useMemo(() => INITIAL_LIQUIDITY + liquidityInflow, [liquidityInflow]);
  const finalPrice = useMemo(() => calcPrice(finalLiquidity, finalSupply), [finalLiquidity, finalSupply]);
  const priceChange = useMemo(() => ((finalPrice - 1) / 1) * 100, [finalPrice]);

  const curveData = useMemo(() => {
    const pts = [];
    const N = 50;
    for (let i = 0; i <= N; i++) {
      const frac = i / N;
      const burned = burnAmount * frac;
      const supply = Math.max(INITIAL_SUPPLY - burned, 1);
      const liq = INITIAL_LIQUIDITY + liquidityInflow * frac;
      const price = calcPrice(liq, supply);
      pts.push({ i, burned, supply, liquidity: liq, price });
    }
    return pts;
  }, [burnAmount, liquidityInflow]);

  const W = 600, H = 240;
  const PAD = { top: 20, right: 20, bottom: 30, left: 60 };
  const cW = W - PAD.left - PAD.right, cH = H - PAD.top - PAD.bottom;

  const prices = curveData.map(d => d.price);
  const maxP = Math.max(...prices, 1.01);
  const minP = Math.min(...prices, 0.99);
  const rangeP = maxP - minP || 0.01;

  const getX = (i) => PAD.left + (i / 50) * cW;
  const getY = (p) => PAD.top + cH - ((p - minP) / rangeP) * cH;

  const pathD = curveData.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(d.i).toFixed(1)} ${getY(d.price).toFixed(1)}`).join(' ');
  const areaD = pathD + ` L ${getX(50).toFixed(1)} ${PAD.top + cH} L ${PAD.left} ${PAD.top + cH} Z`;

  const yTicks = 5;
  const yVals = Array.from({ length: yTicks }, (_, i) => minP + (rangeP * i) / (yTicks - 1));
  const lastPt = curveData[curveData.length - 1];

  return (
    <div style={{ backgroundColor: '#000000', color: '#FFFFFF' }} className="p-6 rounded-xl not-prose border border-white/5">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 style={{ color: '#FFFFFF' }} className="text-lg font-serif italic">DA Price Simulator</h3>
        <span style={{ color: 'rgba(255,255,255,0.6)', backgroundColor: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.2)' }} className="text-xs px-3 py-1 rounded-full font-medium border">Interactive</span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <div style={{ backgroundColor: '#383838' }} className="rounded-xl border border-white/5 p-4">
          <div style={{ color: 'rgba(255,255,255,0.5)' }} className="text-[10px] uppercase tracking-wider mb-1">Current DA Price</div>
          <div style={{ color: '#FFFFFF' }} className="text-lg md:text-xl font-black transition-all duration-300">{fmtUsd(finalPrice)}</div>
          <div style={{ color: 'rgba(255,255,255,0.7)' }} className="text-xs font-semibold mt-1">
            {priceChange >= 0 ? '↑' : '↓'} {Math.abs(priceChange).toFixed(2)}% from $1.00
          </div>
        </div>
        <div style={{ backgroundColor: '#383838' }} className="rounded-xl border border-white/5 p-4">
          <div style={{ color: 'rgba(255,255,255,0.5)' }} className="text-[10px] uppercase tracking-wider mb-1">Circulating Supply</div>
          <div style={{ color: '#FFFFFF' }} className="text-lg md:text-xl font-black transition-all duration-300">{fmtNum(finalSupply)}</div>
          <div style={{ color: 'rgba(255,255,255,0.4)' }} className="text-xs mt-1">Burned: {fmtNum(burnAmount)} ({burnAmount > 0 ? ((burnAmount / INITIAL_SUPPLY) * 100).toFixed(1) : '0.0'}%)</div>
        </div>
        <div style={{ backgroundColor: '#383838' }} className="rounded-xl border border-white/5 p-4">
          <div style={{ color: 'rgba(255,255,255,0.5)' }} className="text-[10px] uppercase tracking-wider mb-1">Liquidity Pool</div>
          <div style={{ color: '#FFFFFF' }} className="text-lg md:text-xl font-black transition-all duration-300">{fmtUsd(finalLiquidity)}</div>
          <div style={{ color: 'rgba(255,255,255,0.4)' }} className="text-xs mt-1">100% USDT backed</div>
        </div>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div style={{ backgroundColor: '#383838' }} className="rounded-xl border border-white/5 p-4">
          <div className="flex justify-between items-center mb-2">
            <label style={{ color: 'rgba(255,255,255,0.5)' }} className="text-sm font-medium">Tokens Burned</label>
            <span style={{ color: '#FFFFFF' }} className="text-sm font-bold">{fmtNum(burnAmount)} DA</span>
          </div>
          <input type="range" min="0" max="20000000" step="100000" value={burnAmount}
            onChange={(e) => setBurnAmount(Number(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-white"
            style={{ touchAction: 'manipulation', backgroundColor: 'rgba(56,56,56,0.7)' }} />
          <div className="flex justify-between text-[10px] mt-1"><span style={{ color: 'rgba(255,255,255,0.5)' }}>0</span><span style={{ color: 'rgba(255,255,255,0.5)' }}>20M DA</span></div>
        </div>
        <div style={{ backgroundColor: '#383838' }} className="rounded-xl border border-white/5 p-4">
          <div className="flex justify-between items-center mb-2">
            <label style={{ color: 'rgba(255,255,255,0.5)' }} className="text-sm font-medium">Liquidity Inflow</label>
            <span style={{ color: '#FFFFFF' }} className="text-sm font-bold">{fmtUsd(liquidityInflow)}</span>
          </div>
          <input type="range" min="0" max="50000000" step="500000" value={liquidityInflow}
            onChange={(e) => setLiquidityInflow(Number(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-white"
            style={{ touchAction: 'manipulation', backgroundColor: 'rgba(56,56,56,0.7)' }} />
          <div className="flex justify-between text-[10px] mt-1"><span style={{ color: 'rgba(255,255,255,0.5)' }}>$0</span><span style={{ color: 'rgba(255,255,255,0.5)' }}>$50M</span></div>
        </div>
      </div>

      {/* SVG Chart */}
      <div style={{ backgroundColor: '#383838' }} className="rounded-xl border border-white/5 p-4 overflow-x-auto">
        <div style={{ color: 'rgba(255,255,255,0.6)' }} className="text-xs font-semibold mb-2">Price Curve</div>
        {burnAmount === 0 && liquidityInflow === 0 && (
          <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }} className="flex items-center gap-3 px-4 py-3 mb-3 rounded-lg border">
            <span className="text-lg">👆</span>
            <span style={{ color: 'rgba(255,255,255,0.7)' }} className="text-xs font-medium">
              Move the sliders above to simulate how burning DA tokens and adding liquidity increases the DA price.
            </span>
          </div>
        )}
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ minWidth: '400px' }}>
          <defs>
            <linearGradient id="daPriceGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          {yVals.map((val, i) => (
            <g key={i}>
              <line x1={PAD.left} y1={getY(val)} x2={W - PAD.right} y2={getY(val)} stroke="white" strokeOpacity="0.04" strokeWidth="0.5" />
              <text x={PAD.left - 8} y={getY(val)} textAnchor="end" dominantBaseline="middle" fill="rgba(255,255,255,0.5)" style={{ fontSize: '9px' }}>${val.toFixed(2)}</text>
            </g>
          ))}
          <path d={areaD} fill="url(#daPriceGrad)" />
          <path d={pathD} fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          {burnAmount > 0 && (
            <g>
              <line x1={getX(50)} y1={PAD.top} x2={getX(50)} y2={PAD.top + cH} stroke="#FFFFFF" strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.5" />
              <circle cx={getX(50)} cy={getY(lastPt.price)} r="5" fill="#FFFFFF" stroke="#000000" strokeWidth="2" />
              <text x={getX(50)} y={getY(lastPt.price) - 12} textAnchor="middle" fill="#FFFFFF" style={{ fontSize: '10px', fontWeight: 'bold' }}>{fmtUsd(lastPt.price)}</text>
            </g>
          )}
          <text x={W / 2} y={H - 4} textAnchor="middle" fill="rgba(255,255,255,0.5)" style={{ fontSize: '9px' }}>Tokens Burned →</text>
        </svg>
      </div>

      {/* Disclaimer */}
      <p style={{ color: 'rgba(255,255,255,0.4)' }} className="text-xs leading-relaxed mt-4">
        Simplified model — actual values depend on ecosystem activity.
        Price = Liquidity Pool ÷ Circulating Supply.
        When DA is sold, tokens are permanently burned (25% on manual sale, 30% on auto-sell).
        Liquidity grows from 5% marketing commission, Lending fees, RWA income, and FinPro revenue.
      </p>
    </div>
  );
};
