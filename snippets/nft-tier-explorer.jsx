import { useState } from 'react';

export const NftTierExplorer = () => {
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const [compare, setCompare] = useState([]);

  const fmtUsd = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

  const NFT_DATA = [
    { name: "GENESIS",  tier: "Basic",   level: 1,  price: 28,    limit: 75,     depth: 2,  mining: null, matchingBonus: false, lending: false, daMining: false, autobuy: "3/3" },
    { name: "ADVANCE",  tier: "Basic",   level: 2,  price: 55,    limit: 160,    depth: 3,  mining: null, matchingBonus: false, lending: false, daMining: false, autobuy: "3/3" },
    { name: "ASCEND",   tier: "Basic",   level: 3,  price: 140,   limit: 375,    depth: 4,  mining: null, matchingBonus: false, lending: false, daMining: false, autobuy: "3/3" },
    { name: "ECLIPSE",  tier: "Basic",   level: 4,  price: 275,   limit: 650,    depth: 6,  mining: null, matchingBonus: true,  lending: false, daMining: false, autobuy: "3/3" },
    { name: "HYDRO",    tier: "Premium", level: 5,  price: 550,   limit: 1400,   depth: 9,  mining: 45,   matchingBonus: true,  lending: true,  daMining: true,  autobuy: "3/3" },
    { name: "QUANTUM",  tier: "Premium", level: 6,  price: 1100,  limit: 2700,   depth: 11, mining: 44,   matchingBonus: true,  lending: true,  daMining: true,  autobuy: "3/3" },
    { name: "PULSE",    tier: "Premium", level: 7,  price: 2200,  limit: 5800,   depth: 12, mining: 43,   matchingBonus: true,  lending: true,  daMining: true,  autobuy: "3/3" },
    { name: "AURORA",   tier: "Premium", level: 8,  price: 5500,  limit: 12800,  depth: 13, mining: 42,   matchingBonus: true,  lending: true,  daMining: true,  autobuy: "3/3" },
    { name: "FLAME",    tier: "Elite",   level: 9,  price: 11000, limit: 28000,  depth: 15, mining: 41,   matchingBonus: true,  lending: true,  daMining: true,  autobuy: "N/A" },
    { name: "INFINITY", tier: "Elite",   level: 10, price: 24000, limit: 70000,  depth: 19, mining: 40,   matchingBonus: true,  lending: true,  daMining: true,  autobuy: "N/A" },
  ];

  const TIER_COLORS = {
    Basic:   { border: 'border-white/25', text: 'text-white dark:text-black',  badge: 'bg-white/15 text-white dark:bg-black/15 dark:text-black border border-white/25 dark:border-black/25' },
    Premium: { border: 'border-white/35', text: 'text-white dark:text-black',  badge: 'bg-white/15 text-white dark:bg-black/15 dark:text-black border border-white/35 dark:border-black/35' },
    Elite:   { border: 'border-amber-400/50', text: 'text-amber-300 dark:text-amber-600',   badge: 'bg-amber-500/20 text-amber-300 dark:text-amber-600 border border-amber-400/40 dark:border-amber-600/40' },
  };

  const RADAR_AXES = ['Affordability', 'Income Limit', 'Mkt Depth', 'Mining Speed', 'ROI'];

  const normalize = (nft) => {
    const roi = nft.limit / nft.price;
    return [
      ((24000 - nft.price) / 24000) * 100,
      (nft.limit / 70000) * 100,
      (nft.depth / 22) * 100,
      nft.mining ? ((45 - nft.mining) / (45 - 40)) * 100 : 0,
      Math.min((roi / 3.0) * 100, 100),
    ];
  };

  const filtered = filter === "All" ? NFT_DATA : NFT_DATA.filter(n => n.tier === filter);

  const toggleCompare = (nft) => {
    setCompare(prev => {
      const exists = prev.find(c => c.level === nft.level);
      if (exists) return prev.filter(c => c.level !== nft.level);
      if (prev.length >= 2) return [prev[1], nft];
      return [...prev, nft];
    });
  };

  const RadarChart = ({ items, size = 240 }) => {
    const cx = size / 2, cy = size / 2, r = size * 0.36;
    const axes = 5, step = (2 * Math.PI) / axes, start = -Math.PI / 2;
    const pt = (ai, val) => ({ x: cx + r * (val / 100) * Math.cos(start + ai * step), y: cy + r * (val / 100) * Math.sin(start + ai * step) });
    const colors = ['#FFFFFF', '#F59E0B'];
    return (
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[260px] mx-auto">
        {[25, 50, 75, 100].map(lv => (
          <polygon key={lv} points={Array.from({ length: axes }, (_, i) => pt(i, lv)).map(p => `${p.x},${p.y}`).join(' ')} fill="none" stroke="white" strokeOpacity="0.06" strokeWidth="0.5" />
        ))}
        {Array.from({ length: axes }, (_, i) => (
          <line key={i} x1={cx} y1={cy} x2={pt(i, 100).x} y2={pt(i, 100).y} stroke="white" strokeOpacity="0.06" strokeWidth="0.5" />
        ))}
        {items.map((item, idx) => {
          const vals = normalize(item);
          const pts = vals.map((v, i) => pt(i, v));
          return (
            <g key={item.level}>
              <polygon points={pts.map(p => `${p.x},${p.y}`).join(' ')} fill={colors[idx]} fillOpacity="0.15" stroke={colors[idx]} strokeWidth="1.5" />
              {pts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="3" fill={colors[idx]} />)}
            </g>
          );
        })}
        {Array.from({ length: axes }, (_, i) => {
          const lp = pt(i, 120);
          return <text key={i} x={lp.x} y={lp.y} textAnchor="middle" dominantBaseline="middle" fill="rgba(255,255,255,0.4)" style={{ fontSize: '7.5px' }}>{RADAR_AXES[i]}</text>;
        })}
      </svg>
    );
  };

  const FeaturePill = ({ on, label }) => (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${on ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-white/5 text-white/40 border-white/5 dark:bg-zinc-100 dark:text-zinc-400 dark:border-zinc-200'}`}>
      {on ? '✓' : '✗'} {label}
    </span>
  );

  return (
    <div className="p-6 rounded-xl not-prose bg-[#000000] border border-white/5 dark:bg-white dark:border-zinc-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-serif italic text-white">NFT Tier Explorer</h3>
        <span className="text-xs px-3 py-1 rounded-full font-medium bg-white/10 text-white/60 border border-white/20 dark:bg-black/10 dark:text-black/60 dark:border-black/20">Interactive</span>
      </div>

      {/* Tier Filter */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {['All', 'Basic', 'Premium', 'Elite'].map(t => (
          <button key={t} onClick={() => { setFilter(t); setSelected(null); }}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${filter === t ? 'bg-white dark:bg-black text-black dark:text-white shadow-[0_0_12px_rgba(255,255,255,0.2)]' : 'bg-[#383838]/70 text-white/70 hover:text-white dark:bg-zinc-100 dark:text-zinc-500 dark:hover:text-zinc-900'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
        {filtered.map(nft => {
          const tc = TIER_COLORS[nft.tier];
          const isSel = selected?.level === nft.level;
          const isCmp = compare.find(c => c.level === nft.level);
          return (
            <button key={nft.level} onClick={() => setSelected(isSel ? null : nft)}
              className={`relative text-left p-4 rounded-xl transition-all duration-300 bg-[#383838] border dark:bg-zinc-50 dark:border-zinc-200 ${isSel ? 'border-white/60 dark:border-black/60 shadow-[0_0_15px_rgba(255,255,255,0.15)] ring-1 ring-white/60 dark:ring-black/60' : isCmp ? `${tc.border} ring-1 ring-white/30 dark:ring-black/30` : 'border-white/5 hover:border-white/50 dark:hover:border-black/50 hover:shadow-[0_0_12px_rgba(255,255,255,0.15)]'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-bold uppercase tracking-wider ${tc.text}`}>{nft.tier}</span>
                <span className="text-[10px] text-white/40 dark:text-zinc-400">L{nft.level}</span>
              </div>
              <div className="text-sm font-bold text-white dark:text-zinc-900 mb-1">{nft.name}</div>
              <div className="text-xl font-black text-white dark:text-zinc-900">{fmtUsd(nft.price)}</div>
              <div className="text-[11px] text-white/40 dark:text-zinc-500 mt-1">Limit: {fmtUsd(nft.limit)}</div>
              <div className="text-[11px] text-white/40 dark:text-zinc-500">Depth: {nft.depth} levels</div>
              {isCmp && (
                <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-white dark:bg-black rounded-full flex items-center justify-center shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                  <span className="text-black dark:text-white text-[10px] font-bold">{compare.indexOf(isCmp) + 1}</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Detail Panel */}
      {selected && (
        <div className="p-5 rounded-xl bg-[#383838] border border-white/5 mb-6 dark:bg-zinc-50 dark:border-zinc-200">
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${TIER_COLORS[selected.tier].badge}`}>{selected.tier}</span>
                <h4 className="text-base font-bold text-white dark:text-zinc-900">Level {selected.level} — {selected.name}</h4>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                {[['Price', fmtUsd(selected.price)], ['Income Limit', fmtUsd(selected.limit)], ['Mkt Depth', `${selected.depth} levels`], ['Mining Cycle', selected.mining ? `${selected.mining} days` : '—'], ['Autobuy', selected.autobuy], ['ROI Ratio', `${(selected.limit / selected.price).toFixed(2)}x`]].map(([label, val]) => (
                  <div key={label} className="bg-[#383838]/70 dark:bg-zinc-100 rounded-lg p-3">
                    <div className="text-[10px] text-white/40 dark:text-zinc-500 uppercase tracking-wide">{label}</div>
                    <div className="text-lg font-bold text-white dark:text-zinc-900">{val}</div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-1.5">
                <FeaturePill on={selected.matchingBonus} label="Matching Bonus" />
                <FeaturePill on={selected.lending} label="Lending" />
                <FeaturePill on={selected.daMining} label="DA Mining" />
              </div>
            </div>
            <div className="w-full md:w-auto flex flex-col items-center">
              <RadarChart items={[selected]} size={200} />
              <button onClick={() => toggleCompare(selected)}
                className={`mt-3 px-5 py-2 rounded-full text-xs font-semibold transition-all ${compare.find(c => c.level === selected.level) ? 'bg-white dark:bg-black text-black dark:text-white shadow-[0_0_12px_rgba(255,255,255,0.2)]' : 'border border-white/10 text-white/40 hover:border-white/50 dark:hover:border-black/50 hover:text-white dark:border-zinc-300 dark:text-zinc-500'}`}>
                {compare.find(c => c.level === selected.level) ? '✓ In comparison' : '+ Add to compare'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Compare Panel */}
      {compare.length === 2 && (
        <div className="p-5 rounded-xl bg-[#383838] border border-white/5 mb-4 dark:bg-zinc-50 dark:border-zinc-200">
          <h4 className="text-base font-bold text-white dark:text-zinc-900 mb-5 text-center">
            {compare[0].name} <span className="text-white/40 mx-2">vs</span> {compare[1].name}
          </h4>
          {/* Radar chart on top, table below — stacked layout to prevent truncation */}
          <div className="flex flex-col items-center gap-6">
            <div className="w-full max-w-[280px]">
              <RadarChart items={compare} size={260} />
              <div className="flex justify-center gap-6 mt-2">
                {compare.map((item, idx) => (
                  <div key={item.level} className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: idx === 0 ? '#FFFFFF' : '#F59E0B' }} />
                    <span className="text-xs font-semibold text-white/40">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-white/5 dark:border-zinc-200">
                  <th className="text-left py-2 text-white/40 font-medium">Metric</th>
                  <th className="text-right py-2 font-semibold text-white dark:text-black">{compare[0].name}</th>
                  <th className="text-right py-2 font-semibold text-amber-400">{compare[1].name}</th>
                </tr></thead>
                <tbody className="text-white dark:text-zinc-700">
                  {[
                    ['Price', fmtUsd(compare[0].price), fmtUsd(compare[1].price)],
                    ['Income Limit', fmtUsd(compare[0].limit), fmtUsd(compare[1].limit)],
                    ['ROI', `${(compare[0].limit / compare[0].price).toFixed(2)}x`, `${(compare[1].limit / compare[1].price).toFixed(2)}x`],
                    ['Mkt Depth', `${compare[0].depth} lvls`, `${compare[1].depth} lvls`],
                    ['Mining', compare[0].mining ? `${compare[0].mining}d` : '—', compare[1].mining ? `${compare[1].mining}d` : '—'],
                    ['Matching', compare[0].matchingBonus ? '✓' : '✗', compare[1].matchingBonus ? '✓' : '✗'],
                    ['Lending', compare[0].lending ? '✓' : '✗', compare[1].lending ? '✓' : '✗'],
                    ['DA Mining', compare[0].daMining ? '✓' : '✗', compare[1].daMining ? '✓' : '✗'],
                  ].map(([label, v1, v2], i) => (
                    <tr key={i} className="border-b border-white/5 dark:border-zinc-100">
                      <td className="py-2 text-white/40">{label}</td>
                      <td className="py-2 text-right font-semibold">{v1}</td>
                      <td className="py-2 text-right font-semibold">{v2}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <button onClick={() => setCompare([])} className="mt-4 text-xs text-white/40 hover:text-white transition-colors dark:text-black/40 dark:hover:text-black">Clear comparison</button>
        </div>
      )}

      <p className="text-xs text-white/40 mt-4 dark:text-zinc-500">Click any card to expand details. Select two cards to compare side-by-side with radar chart.</p>
    </div>
  );
};
