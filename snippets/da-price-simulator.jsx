import { useState, useMemo } from 'react';

export const DaPriceSimulator = () => {
  const INITIAL_SUPPLY = 21_000_000;
  const INITIAL_LIQUIDITY = 21_000_000;

  const [burnAmount, setBurnAmount] = useState(0);
  const [liquidityInflow, setLiquidityInflow] = useState(0);

  const fmtUsd = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(n);
  const fmtNum = (n) => new Intl.NumberFormat('en-US').format(Math.round(n));

  const calcPrice = (liquidity, supply) => {
    if (supply <= 0) return Infinity;
    return liquidity / supply;
  };

  // KPI values
  const finalSupply = useMemo(() => Math.max(INITIAL_SUPPLY - burnAmount, 1), [burnAmount]);
  const finalLiquidity = useMemo(() => INITIAL_LIQUIDITY + liquidityInflow, [liquidityInflow]);
  const finalPrice = useMemo(() => calcPrice(finalLiquidity, finalSupply), [finalLiquidity, finalSupply]);
  const priceChange = useMemo(() => ((finalPrice - 1) / 1) * 100, [finalPrice]);

  // Generate 50-point price curve
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

  // SVG Chart
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
    <div className="p-6 rounded-xl not-prose bg-[#0A0A0A] border border-white/5 dark:bg-white dark:border-zinc-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-serif italic text-white dark:text-zinc-900">DA Price Simulator</h3>
        <span className="text-xs px-3 py-1 rounded-full font-medium bg-[#2563EB]/10 text-[#2563EB] border border-[#2563EB]/20">Interactive</span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <div className="rounded-xl bg-[#141420] border border-white/5 p-4 dark:bg-zinc-50 dark:border-zinc-200">
          <div className="text-[10px] uppercase tracking-wider text-[#A0A0A0] mb-1">Current DA Price</div>
          <div className="text-2xl md:text-3xl font-black text-white dark:text-zinc-900 transition-all duration-300">{fmtUsd(finalPrice)}</div>
          <div className={`text-xs font-semibold mt-1 ${priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {priceChange >= 0 ? '↑' : '↓'} {Math.abs(priceChange).toFixed(2)}% from $1.00
          </div>
        </div>
        <div className="rounded-xl bg-[#141420] border border-white/5 p-4 dark:bg-zinc-50 dark:border-zinc-200">
          <div className="text-[10px] uppercase tracking-wider text-[#A0A0A0] mb-1">Circulating Supply</div>
          <div className="text-2xl md:text-3xl font-black text-white dark:text-zinc-900 transition-all duration-300">{fmtNum(finalSupply)}</div>
          <div className="text-xs text-[#A0A0A0] mt-1">Burned: {fmtNum(burnAmount)} ({burnAmount > 0 ? ((burnAmount / INITIAL_SUPPLY) * 100).toFixed(1) : '0.0'}%)</div>
        </div>
        <div className="rounded-xl bg-[#141420] border border-white/5 p-4 dark:bg-zinc-50 dark:border-zinc-200">
          <div className="text-[10px] uppercase tracking-wider text-[#A0A0A0] mb-1">Liquidity Pool</div>
          <div className="text-2xl md:text-3xl font-black text-white dark:text-zinc-900 transition-all duration-300">{fmtUsd(finalLiquidity)}</div>
          <div className="text-xs text-[#A0A0A0] mt-1">100% USDT backed</div>
        </div>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="rounded-xl bg-[#141420] border border-white/5 p-4 dark:bg-zinc-50 dark:border-zinc-200">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-[#A0A0A0]">Tokens Burned</label>
            <span className="text-sm font-bold text-white dark:text-zinc-900">{fmtNum(burnAmount)} DA</span>
          </div>
          <input type="range" min="0" max="20000000" step="100000" value={burnAmount}
            onChange={(e) => setBurnAmount(Number(e.target.value))}
            className="w-full h-2 bg-[#1C1C2E] rounded-lg appearance-none cursor-pointer accent-[#2563EB] dark:bg-zinc-200"
            style={{ touchAction: 'manipulation' }} />
          <div className="flex justify-between text-[10px] text-[#A0A0A0] mt-1"><span>0</span><span>20M DA</span></div>
        </div>
        <div className="rounded-xl bg-[#141420] border border-white/5 p-4 dark:bg-zinc-50 dark:border-zinc-200">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-[#A0A0A0]">Liquidity Inflow</label>
            <span className="text-sm font-bold text-white dark:text-zinc-900">{fmtUsd(liquidityInflow)}</span>
          </div>
          <input type="range" min="0" max="50000000" step="500000" value={liquidityInflow}
            onChange={(e) => setLiquidityInflow(Number(e.target.value))}
            className="w-full h-2 bg-[#1C1C2E] rounded-lg appearance-none cursor-pointer accent-[#2563EB] dark:bg-zinc-200"
            style={{ touchAction: 'manipulation' }} />
          <div className="flex justify-between text-[10px] text-[#A0A0A0] mt-1"><span>$0</span><span>$50M</span></div>
        </div>
      </div>

      {/* SVG Chart */}
      <div className="rounded-xl bg-[#141420] border border-white/5 p-4 overflow-x-auto dark:bg-zinc-50 dark:border-zinc-200">
        <div className="text-xs font-semibold text-[#A0A0A0] mb-2">Price Curve</div>
        {/* FIX 3: Hint when sliders at default */}
        {burnAmount === 0 && liquidityInflow === 0 && (
          <div className="flex items-center gap-3 px-4 py-3 mb-3 rounded-lg bg-[#2563EB]/5 border border-[#2563EB]/10">
            <span className="text-lg">👆</span>
            <span className="text-xs text-[#2563EB] font-medium">
              Move the sliders above to simulate how burning DA tokens and adding liquidity increases the DA price.
            </span>
          </div>
        )}
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ minWidth: '400px' }}>
          <defs>
            <linearGradient id="daPriceGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563EB" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#4040FF" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          {/* Grid */}
          {yVals.map((val, i) => (
            <g key={i}>
              <line x1={PAD.left} y1={getY(val)} x2={W - PAD.right} y2={getY(val)} stroke="white" strokeOpacity="0.04" strokeWidth="0.5" />
              <text x={PAD.left - 8} y={getY(val)} textAnchor="end" dominantBaseline="middle" fill="#A0A0A0" style={{ fontSize: '9px' }}>${val.toFixed(2)}</text>
            </g>
          ))}
          {/* Area */}
          <path d={areaD} fill="url(#daPriceGrad)" />
          {/* Line */}
          <path d={pathD} fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          {/* Marker at end */}
          {burnAmount > 0 && (
            <g>
              <line x1={getX(50)} y1={PAD.top} x2={getX(50)} y2={PAD.top + cH} stroke="#2563EB" strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.5" />
              <circle cx={getX(50)} cy={getY(lastPt.price)} r="5" fill="#2563EB" stroke="#0A0A0A" strokeWidth="2" />
              <text x={getX(50)} y={getY(lastPt.price) - 12} textAnchor="middle" fill="#2563EB" style={{ fontSize: '10px', fontWeight: 'bold' }}>{fmtUsd(lastPt.price)}</text>
            </g>
          )}
          {/* X axis label */}
          <text x={W / 2} y={H - 4} textAnchor="middle" fill="#A0A0A0" style={{ fontSize: '9px' }}>Tokens Burned →</text>
        </svg>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-[#A0A0A0] leading-relaxed mt-4 dark:text-zinc-500">
        Simplified model — actual values depend on ecosystem activity.
        Price = Liquidity Pool ÷ Circulating Supply.
        When DA is sold, tokens are permanently burned (25% on manual sale, 30% on auto-sell).
        Liquidity grows from 5% marketing commission, Lending fees, RWA income, and FinPro revenue.
      </p>
    </div>
  );
};
