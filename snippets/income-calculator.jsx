import { useState } from 'react';

export const IncomeCalculator = () => {
  const [nftLevel, setNftLevel] = useState(5);
  const [avgPrice, setAvgPrice] = useState(550);
  const [salesPerLevel, setSalesPerLevel] = useState(3);

  const fmtUsd = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

  const LEVEL_PERCENTS = [0, 1, 2, 2, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 5, 2, 2, 1, 0.5, 0.5, 0.5, 0.5];
  const DEPTH_BY_NFT = [2, 3, 4, 6, 9, 11, 12, 13, 15, 19];
  const NFT_NAMES = ['GENESIS', 'ADVANCE', 'ASCEND', 'ECLIPSE', 'HYDRO', 'QUANTUM', 'PULSE', 'AURORA', 'FLAME', 'INFINITY'];
  const NFT_PRICES = [28, 55, 140, 275, 550, 1100, 2200, 5500, 11000, 24000];

  const maxDepth = DEPTH_BY_NFT[nftLevel - 1];

  const levelIncome = LEVEL_PERCENTS.map(function(pct, i) {
    const lvl = i + 1;
    const isPhase2Only = lvl >= 16;
    const isUnlocked = lvl <= maxDepth && !isPhase2Only;
    const gross = isUnlocked ? avgPrice * (pct / 100) * salesPerLevel : 0;
    return { level: lvl, pct: pct, gross: gross, isUnlocked: isUnlocked, isPhase2Only: isPhase2Only, isLocked: lvl > maxDepth };
  });

  const activeLevels = levelIncome.filter(function(l) { return l.isUnlocked && l.pct > 0; }).length;
  const totalIncome = levelIncome.reduce(function(s, l) { return s + l.gross; }, 0);
  const netIncome = totalIncome * 0.75;
  const accumulative = totalIncome * 0.20;
  const daTax = totalIncome * 0.05;

  return (
    <div style={{ backgroundColor: '#000000', color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.05)' }} className="p-6 rounded-xl not-prose border">
      {/* Header + Interactive badge */}
      <div className="flex items-center justify-between mb-6">
        <h3 style={{ color: '#FFFFFF' }} className="text-lg font-serif italic">Marketing Income Calculator</h3>
        <span style={{ color: 'rgba(255,255,255,0.6)', backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }} className="text-xs px-3 py-1 rounded-full font-medium">Interactive</span>
      </div>

      {/* NFT Selector */}
      <div style={{ backgroundColor: '#383838', borderColor: 'rgba(255,255,255,0.05)' }} className="rounded-xl border p-4 mb-4">
        <label style={{ color: 'rgba(255,255,255,0.5)' }} className="text-[10px] font-semibold uppercase tracking-wider mb-2 block">Your NFT Level</label>
        <select value={nftLevel} onChange={(e) => setNftLevel(Number(e.target.value))}
          style={{ backgroundColor: 'rgba(56,56,56,0.7)', color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.05)' }}
          className="w-full p-2.5 rounded-lg text-sm font-medium border">
          {NFT_NAMES.map((name, i) => (
            <option key={i} value={i + 1}>L{i + 1} — {name} ({fmtUsd(NFT_PRICES[i])}) — {DEPTH_BY_NFT[i]} lvls</option>
          ))}
        </select>
      </div>

      {/* Two sliders side by side */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div style={{ backgroundColor: '#383838', borderColor: 'rgba(255,255,255,0.05)' }} className="rounded-xl border p-4">
          <div className="flex justify-between items-center mb-2">
            <label style={{ color: 'rgba(255,255,255,0.5)' }} className="text-xs">Avg NFT Sale in Team</label>
            <span style={{ color: '#FFFFFF' }} className="text-sm font-bold">{fmtUsd(avgPrice)}</span>
          </div>
          <input type="range" min="28" max="24000" step="1" value={avgPrice}
            onChange={(e) => setAvgPrice(Number(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-white"
            style={{ touchAction: 'manipulation', backgroundColor: 'rgba(56,56,56,0.7)' }} />
          <div className="flex justify-between text-[10px] mt-1"><span style={{ color: 'rgba(255,255,255,0.5)' }}>$28</span><span style={{ color: 'rgba(255,255,255,0.5)' }}>$24,000</span></div>
        </div>

        <div style={{ backgroundColor: '#383838', borderColor: 'rgba(255,255,255,0.05)' }} className="rounded-xl border p-4">
          <div className="flex justify-between items-center mb-2">
            <label style={{ color: 'rgba(255,255,255,0.5)' }} className="text-xs">Sales per Level</label>
            <span style={{ color: '#FFFFFF' }} className="text-sm font-bold">{salesPerLevel}</span>
          </div>
          <input type="range" min="1" max="50" step="1" value={salesPerLevel}
            onChange={(e) => setSalesPerLevel(Number(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-white"
            style={{ touchAction: 'manipulation', backgroundColor: 'rgba(56,56,56,0.7)' }} />
          <div className="flex justify-between text-[10px] mt-1"><span style={{ color: 'rgba(255,255,255,0.5)' }}>1</span><span style={{ color: 'rgba(255,255,255,0.5)' }}>50</span></div>
        </div>
      </div>

      {/* HERO: Total Gross Income */}
      <div style={{ backgroundColor: '#383838', border: '1px solid rgba(255,255,255,0.1)' }} className="rounded-xl p-6 text-center mb-4">
        <div style={{ color: 'rgba(255,255,255,0.6)' }} className="text-xs uppercase tracking-wider mb-1">Total Gross Income</div>
        <div style={{ color: '#FFFFFF', fontSize: '40px' }} className="font-black transition-all duration-300">{fmtUsd(totalIncome)}</div>
        <div style={{ color: 'rgba(255,255,255,0.5)' }} className="text-xs mt-1">{activeLevels} active levels x {salesPerLevel} sales</div>
      </div>

      {/* Three monochrome cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div style={{ backgroundColor: '#383838', border: '1px solid rgba(255,255,255,0.05)' }} className="rounded-xl p-4">
          <div style={{ color: 'rgba(255,255,255,0.4)' }} className="text-[10px] uppercase tracking-wider font-semibold mb-1">75% Net Income</div>
          <div style={{ color: '#FFFFFF' }} className="text-xl font-black transition-all duration-300">{fmtUsd(netIncome)}</div>
          <div style={{ color: 'rgba(255,255,255,0.4)' }} className="text-[11px] mt-1">Regular Balance — withdraw anytime</div>
        </div>
        <div style={{ backgroundColor: '#383838', border: '1px solid rgba(255,255,255,0.05)' }} className="rounded-xl p-4">
          <div style={{ color: 'rgba(255,255,255,0.4)' }} className="text-[10px] uppercase tracking-wider font-semibold mb-1">20% Accumulative</div>
          <div style={{ color: '#FFFFFF' }} className="text-xl font-black transition-all duration-300">{fmtUsd(accumulative)}</div>
          <div style={{ color: 'rgba(255,255,255,0.4)' }} className="text-[11px] mt-1">120-day timer, 70% stays / 30% sponsor</div>
        </div>
        <div style={{ backgroundColor: '#383838', border: '1px solid rgba(255,255,255,0.05)' }} className="rounded-xl p-4">
          <div style={{ color: 'rgba(255,255,255,0.4)' }} className="text-[10px] uppercase tracking-wider font-semibold mb-1">5% DA Liquidity</div>
          <div style={{ color: '#FFFFFF' }} className="text-xl font-black transition-all duration-300">{fmtUsd(daTax)}</div>
          <div style={{ color: 'rgba(255,255,255,0.4)' }} className="text-[11px] mt-1">Feeds into DA pool, increases DA price</div>
        </div>
      </div>
    </div>
  );
};
