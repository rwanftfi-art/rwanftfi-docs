import { useState, useMemo } from 'react';

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
  const nftName = NFT_NAMES[nftLevel - 1];

  const levelIncome = useMemo(() => {
    return LEVEL_PERCENTS.map((pct, i) => {
      const lvl = i + 1;
      const isPhase2Only = lvl >= 16;
      const isUnlocked = lvl <= maxDepth && !isPhase2Only;
      const gross = isUnlocked ? avgPrice * (pct / 100) * salesPerLevel : 0;
      return { level: lvl, pct, gross, isUnlocked, isPhase2Only, isLocked: lvl > maxDepth };
    });
  }, [nftLevel, avgPrice, salesPerLevel, maxDepth]);

  const totalIncome = useMemo(() => levelIncome.reduce((s, l) => s + l.gross, 0), [levelIncome]);
  const netIncome = totalIncome * 0.75;
  const accumulative = totalIncome * 0.20;
  const daTax = totalIncome * 0.05;

  // SVG Bar Chart
  const W = 620, H = 220;
  const PAD = { top: 10, right: 10, bottom: 40, left: 50 };
  const cW = W - PAD.left - PAD.right, cH = H - PAD.top - PAD.bottom;
  const barW = (cW - 21 * 2) / 22;
  const maxBar = Math.max(...levelIncome.map(l => l.gross), 1);
  const getBarH = (v) => (v / maxBar) * cH;
  const getBarX = (i) => PAD.left + i * (barW + 2);

  return (
    <div style={{ backgroundColor: '#000000', color: '#FFFFFF' }} className="p-6 rounded-xl not-prose border border-white/5">
      <div className="flex items-center justify-between mb-6">
        <h3 style={{ color: '#FFFFFF' }} className="text-lg font-serif italic">Marketing Income Calculator</h3>
        <span style={{ color: 'rgba(255,255,255,0.6)', backgroundColor: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.2)' }} className="text-xs px-3 py-1 rounded-full font-medium border">Interactive</span>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Controls */}
        <div className="md:w-72 flex-shrink-0 space-y-4">
          <div style={{ backgroundColor: '#383838' }} className="rounded-xl border border-white/5 p-4">
            <label style={{ color: 'rgba(255,255,255,0.5)' }} className="text-[10px] font-semibold uppercase tracking-wider mb-2 block">Your NFT Level</label>
            <select value={nftLevel} onChange={(e) => setNftLevel(Number(e.target.value))}
              style={{ backgroundColor: 'rgba(56,56,56,0.7)', color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.05)' }}
              className="w-full p-2.5 rounded-lg text-sm font-medium border">
              {NFT_NAMES.map((name, i) => (
                <option key={i} value={i + 1}>L{i + 1} — {name} ({fmtUsd(NFT_PRICES[i])}) — {DEPTH_BY_NFT[i]} lvls</option>
              ))}
            </select>
          </div>

          <div style={{ backgroundColor: '#383838' }} className="rounded-xl border border-white/5 p-4">
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

          <div style={{ backgroundColor: '#383838' }} className="rounded-xl border border-white/5 p-4">
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

          <div style={{ backgroundColor: '#383838' }} className="rounded-xl p-5 text-center">
            <div style={{ color: 'rgba(255,255,255,0.6)' }} className="text-xs uppercase tracking-wider mb-1">Total Gross Income</div>
            <div style={{ color: '#FFFFFF' }} className="text-2xl md:text-3xl font-black transition-all duration-300">{fmtUsd(totalIncome)}</div>
            <div style={{ color: 'rgba(255,255,255,0.5)' }} className="text-xs mt-1">{maxDepth} active levels × {salesPerLevel} sales</div>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 min-w-0 space-y-4">
          <div style={{ backgroundColor: '#383838' }} className="rounded-xl border border-white/5 p-4 overflow-x-auto">
            <div style={{ color: 'rgba(255,255,255,0.6)' }} className="text-xs font-semibold mb-2">Income by Marketing Level (22 levels)</div>
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ minWidth: '500px', color: '#FFFFFF' }}>
              <defs>
                <linearGradient id="incBarGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#FFFFFF" /><stop offset="100%" stopColor="rgba(255,255,255,0.4)" /></linearGradient>
              </defs>
              {[0.25, 0.5, 0.75, 1].map(frac => (
                <g key={frac}>
                  <line x1={PAD.left} y1={PAD.top + cH - cH * frac} x2={W - PAD.right} y2={PAD.top + cH - cH * frac} stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
                  <text x={PAD.left - 6} y={PAD.top + cH - cH * frac} textAnchor="end" dominantBaseline="middle" fill="rgba(255,255,255,0.5)" style={{ fontSize: '8px' }}>{fmtUsd(maxBar * frac)}</text>
                </g>
              ))}
              {levelIncome.map((l, i) => {
                const bh = l.gross > 0 ? getBarH(l.gross) : 0;
                const bx = getBarX(i);
                const by = PAD.top + cH - bh;
                let fill = 'url(#incBarGrad)';
                let fillOpacity = 1;
                if (l.isPhase2Only) { fill = 'rgba(255,255,255,0.05)'; fillOpacity = 1; }
                else if (!l.isUnlocked) { fill = 'rgba(255,255,255,0.08)'; fillOpacity = 1; }
                return (
                  <g key={i}>
                    <rect x={bx} y={l.gross > 0 ? by : PAD.top + cH - 1} width={barW} height={Math.max(bh, 1)} fill={fill} fillOpacity={fillOpacity} rx="1" className="transition-all duration-300" />
                    <text x={bx + barW / 2} y={PAD.top + cH + 12} textAnchor="middle" fill="rgba(255,255,255,0.5)" style={{ fontSize: '7px' }}>{l.level}</text>
                    <text x={bx + barW / 2} y={PAD.top + cH + 22} textAnchor="middle" fill="rgba(255,255,255,0.35)" style={{ fontSize: '6px' }}>{l.pct}%</text>
                    {!l.isUnlocked && !l.isPhase2Only && <text x={bx + barW / 2} y={PAD.top + cH - 6} textAnchor="middle" style={{ fontSize: '7px' }}>🔒</text>}
                    {l.isPhase2Only && <text x={bx + barW / 2} y={PAD.top + cH - 6} textAnchor="middle" fill="rgba(255,255,255,0.35)" style={{ fontSize: '5.5px', fontWeight: 'bold' }}>P2</text>}
                    <title>{l.isPhase2Only ? `L${l.level}: ${l.pct}% — Phase 2 only` : !l.isUnlocked ? `L${l.level}: ${l.pct}% — Upgrade required` : `L${l.level}: ${l.pct}% — ${fmtUsd(l.gross)}`}</title>
                  </g>
                );
              })}
              <line x1={PAD.left} y1={PAD.top + cH} x2={W - PAD.right} y2={PAD.top + cH} stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
              <text x={W / 2} y={H - 2} textAnchor="middle" fill="rgba(255,255,255,0.5)" style={{ fontSize: '8px' }}>Marketing Level →</text>
            </svg>
            <div className="flex gap-4 mt-2 justify-center flex-wrap">
              <span className="flex items-center gap-1.5 text-[10px]"><span style={{ backgroundColor: '#FFFFFF' }} className="w-2.5 h-2.5 rounded-sm inline-block" /> <span style={{ color: 'rgba(255,255,255,0.5)' }}>Active</span></span>
              <span className="flex items-center gap-1.5 text-[10px]"><span style={{ backgroundColor: 'rgba(255,255,255,0.1)' }} className="w-2.5 h-2.5 rounded-sm inline-block" /> <span style={{ color: 'rgba(255,255,255,0.5)' }}>🔒 Locked</span></span>
              <span className="flex items-center gap-1.5 text-[10px]"><span style={{ backgroundColor: 'rgba(255,255,255,0.05)' }} className="w-2.5 h-2.5 rounded-sm inline-block" /> <span style={{ color: 'rgba(255,255,255,0.5)' }}>Phase 2</span></span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.2)' }} className="rounded-xl border p-4">
              <div style={{ color: 'rgba(255,255,255,0.6)' }} className="text-[10px] uppercase tracking-wider font-semibold mb-1">75% → Net Income</div>
              <div style={{ color: '#FFFFFF' }} className="text-xl font-black transition-all duration-300">{fmtUsd(netIncome)}</div>
              <div style={{ color: 'rgba(255,255,255,0.4)' }} className="text-[11px] mt-1">Regular Balance — withdraw anytime</div>
            </div>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.2)' }} className="rounded-xl border p-4">
              <div style={{ color: 'rgba(255,255,255,0.6)' }} className="text-[10px] uppercase tracking-wider font-semibold mb-1">20% → Accumulative</div>
              <div style={{ color: '#FFFFFF' }} className="text-xl font-black transition-all duration-300">{fmtUsd(accumulative)}</div>
              <div style={{ color: 'rgba(255,255,255,0.4)' }} className="text-[11px] mt-1">120-day timer • 70% stays / 30% → sponsor</div>
            </div>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.2)' }} className="rounded-xl border p-4">
              <div style={{ color: 'rgba(255,255,255,0.6)' }} className="text-[10px] uppercase tracking-wider font-semibold mb-1">5% → DA Liquidity</div>
              <div style={{ color: '#FFFFFF' }} className="text-xl font-black transition-all duration-300">{fmtUsd(daTax)}</div>
              <div style={{ color: 'rgba(255,255,255,0.4)' }} className="text-[11px] mt-1">Feeds into DA pool → increases DA price</div>
            </div>
          </div>

          {maxDepth < 22 && (
            <div style={{ backgroundColor: 'rgba(56,56,56,0.7)', borderColor: 'rgba(255,255,255,0.05)' }} className="px-4 py-3 rounded-lg border">
              <div style={{ color: 'rgba(255,255,255,0.5)' }} className="text-xs">
                <span className="font-semibold">🔒 {22 - Math.min(maxDepth, 15)} levels locked.</span>{' '}
                Your {nftName} NFT earns from levels 1–{maxDepth}.
                {maxDepth < 15 ? ' Upgrade to unlock deeper levels.' : ''} Levels 16–22 unlock in Phase 2.
              </div>
            </div>
          )}
        </div>
      </div>

      <p style={{ color: 'rgba(255,255,255,0.5)' }} className="text-xs leading-relaxed mt-4">
        This calculator shows tree distribution income only. Tree distribution percentages are identical
        in Phase 1 and Phase 2. The Phase difference (30% vs 20% personal sale bonus) applies only to
        the direct Sponsor Bonus from personal sales, which is not included in this calculator.
        Matching Bonus (5% + 5% + 5%) from direct partner income is also calculated separately
        and requires: NFT ≥ ECLIPSE (L4), personal sales ≥ 1,000 USDT (Level 2), and ≥ 3,000 USDT (Level 3).
      </p>
    </div>
  );
};
