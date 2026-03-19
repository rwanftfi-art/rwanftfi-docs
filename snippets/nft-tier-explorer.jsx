import { useState, useRef, useEffect } from 'react';
import { useLang, t } from '/snippets/i18n.js';

const LazyNftVideo = ({ src, style = {} }) => {
  const videoRef = useRef(null);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!hasLoadedRef.current) {
            video.src = src;
            video.load();
            hasLoadedRef.current = true;
          }
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { rootMargin: '150px', threshold: 0.01 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [src]);

  return (
    <video
      ref={videoRef}
      muted
      loop
      playsInline
      preload="none"
      style={{
        backgroundColor: '#1a1a2e',
        ...style,
      }}
    />
  );
};

export const NftTierExplorer = () => {
  const lang = useLang();
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
    Basic:   { border: '1px solid rgba(255,255,255,0.25)', textColor: '#FFFFFF',  badgeBg: 'rgba(255,255,255,0.15)', badgeBorder: 'rgba(255,255,255,0.25)' },
    Premium: { border: '1px solid rgba(255,255,255,0.35)', textColor: '#FFFFFF',  badgeBg: 'rgba(255,255,255,0.15)', badgeBorder: 'rgba(255,255,255,0.35)' },
    Elite:   { border: '1px solid rgba(251,191,36,0.5)',   textColor: '#fbbf24',  badgeBg: 'rgba(251,191,36,0.2)',   badgeBorder: 'rgba(251,191,36,0.4)' },
  };

  const RADAR_AXES = ['Afford', 'Income', 'Depth', 'Mining', 'ROI'];

  const normalize = (nft) => {
    const roi = nft.limit / nft.price;
    return [
      ((24000 - nft.price) / 24000) * 100,
      (nft.limit / 70000) * 100,
      (nft.depth / 22) * 100,
      nft.mining ? 20 + ((45 - nft.mining) / (45 - 40)) * 80 : 0,
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
          <polygon key={lv} points={Array.from({ length: axes }, (_, i) => pt(i, lv)).map(p => `${p.x},${p.y}`).join(' ')} fill="none" stroke="white" strokeOpacity="0.08" strokeWidth="0.5" />
        ))}
        {Array.from({ length: axes }, (_, i) => (
          <line key={i} x1={cx} y1={cy} x2={pt(i, 100).x} y2={pt(i, 100).y} stroke="white" strokeOpacity="0.08" strokeWidth="0.5" />
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
          return <text key={i} x={lp.x} y={lp.y} textAnchor="middle" dominantBaseline="middle" fill="rgba(255,255,255,0.5)" style={{ fontSize: '7.5px' }}>{RADAR_AXES[i]}</text>;
        })}
      </svg>
    );
  };

  const FeaturePill = ({ on, label }) => (
    <span style={on
      ? { color: '#4ade80', backgroundColor: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }
      : { color: 'rgba(255,255,255,0.4)', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.05)' }}
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium">
      {on ? '✓' : '✗'} {label}
    </span>
  );

  const filterLabels = { All: t(lang, 'all'), Basic: t(lang, 'basic'), Premium: t(lang, 'premium'), Elite: t(lang, 'elite') };

  return (
    <div style={{ backgroundColor: '#000000', color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.05)' }} className="p-6 rounded-xl not-prose border">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 style={{ color: '#FFFFFF' }} className="text-lg font-serif italic">{t(lang, 'nftTierExplorer')}</h3>
        <span style={{ color: 'rgba(255,255,255,0.6)', backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }} className="text-xs px-3 py-1 rounded-full font-medium">{t(lang, 'interactive')}</span>
      </div>

      {/* Tier Filter */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {['All', 'Basic', 'Premium', 'Elite'].map(f => (
          <button key={f} onClick={() => { setFilter(f); setSelected(null); }}
            style={filter === f ? { backgroundColor: '#FFFFFF', color: '#000000' } : { backgroundColor: 'rgba(56,56,56,0.7)', color: 'rgba(255,255,255,0.7)' }}
            className="px-4 py-1.5 rounded-full text-xs font-medium transition-all">
            {filterLabels[f]}
          </button>
        ))}
      </div>

      {/* Card Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
        {filtered.map(nft => {
          const isSel = selected?.level === nft.level;
          const isCmp = compare.find(c => c.level === nft.level);
          const tc = TIER_COLORS[nft.tier];
          return (
            <button key={nft.level} onClick={() => setSelected(isSel ? null : nft)}
              style={{
                backgroundColor: '#383838',
                borderColor: isSel ? 'rgba(255,255,255,0.6)' : isCmp ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.05)',
                textAlign: 'left',
                boxShadow: isSel ? '0 0 15px rgba(255,255,255,0.15)' : 'none',
                padding: 0,
                overflow: 'hidden',
              }}
              className="relative rounded-xl transition-all duration-300 border">
              {/* Video */}
              <div style={{ backgroundColor: '#1a1a2e', overflow: 'hidden', aspectRatio: '1 / 1' }}>
                <LazyNftVideo
                  src={`/videos/${String(nft.level).padStart(2, '0')}_1.mp4`}
                  style={{
                    width: '100%',
                    aspectRatio: '1 / 1',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              </div>
              {/* Card Info */}
              <div style={{ padding: '12px' }}>
                <div className="flex items-center justify-between mb-2">
                  <span style={{ color: tc.textColor, backgroundColor: tc.badgeBg, border: tc.border }} className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full">{nft.tier}</span>
                  <span style={{ color: 'rgba(255,255,255,0.4)' }} className="text-[10px]">L{nft.level}</span>
                </div>
                <div style={{ color: '#FFFFFF' }} className="text-sm font-bold mb-1">{nft.name}</div>
                <div style={{ color: '#FFFFFF' }} className="text-xl font-black">{fmtUsd(nft.price)}</div>
                <div style={{ color: 'rgba(255,255,255,0.4)' }} className="text-[11px] mt-1">{t(lang, 'incomeLimit')}: {fmtUsd(nft.limit)}</div>
                <div style={{ color: 'rgba(255,255,255,0.4)' }} className="text-[11px]">{t(lang, 'mktDepth')}: {nft.depth} {t(lang, 'levels')}</div>
              </div>
              {isCmp && (
                <div style={{ backgroundColor: '#FFFFFF', boxShadow: '0 0 8px rgba(255,255,255,0.3)' }} className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center">
                  <span style={{ color: '#000000' }} className="text-[10px] font-bold">{compare.indexOf(isCmp) + 1}</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Detail Panel */}
      {selected && (() => {
        const tc = TIER_COLORS[selected.tier];
        return (
          <div style={{ backgroundColor: '#383838', borderColor: 'rgba(255,255,255,0.05)' }} className="p-5 rounded-xl border mb-6">
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span style={{ color: tc.textColor, backgroundColor: tc.badgeBg, border: tc.border }} className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full">{selected.tier}</span>
                  <h4 style={{ color: '#FFFFFF' }} className="text-base font-bold">{t(lang, 'level')} {selected.level} — {selected.name}</h4>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                  {[[t(lang, 'price'), fmtUsd(selected.price)], [t(lang, 'incomeLimit'), fmtUsd(selected.limit)], [t(lang, 'mktDepth'), `${selected.depth} ${t(lang, 'levels')}`], [t(lang, 'miningCycle'), selected.mining ? `${selected.mining} ${t(lang, 'days')}` : t(lang, 'l5Only')], [t(lang, 'autobuy'), selected.autobuy], [t(lang, 'roiRatio'), `${(selected.limit / selected.price).toFixed(2)}x`]].map(([label, val]) => (
                    <div key={label} style={{ backgroundColor: 'rgba(56,56,56,0.7)' }} className="rounded-lg p-3">
                      <div style={{ color: 'rgba(255,255,255,0.4)' }} className="text-[10px] uppercase tracking-wide">{label}</div>
                      <div style={{ color: '#FFFFFF' }} className="text-lg font-bold">{val}</div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <FeaturePill on={true} label={t(lang, 'rwaAccess')} />
                  <FeaturePill on={true} label={t(lang, 'finpro')} />
                  <FeaturePill on={selected.matchingBonus} label={t(lang, 'matchingBonus')} />
                  <FeaturePill on={selected.lending} label={t(lang, 'lending')} />
                  <FeaturePill on={selected.daMining} label={t(lang, 'daMining')} />
                </div>
              </div>
              <div className="w-full md:w-auto flex flex-col items-center">
                <div style={{ backgroundColor: '#1a1a2e', borderRadius: '8px', overflow: 'hidden', aspectRatio: '1 / 1', width: '100%', maxWidth: '260px', marginBottom: '12px' }}>
                  <LazyNftVideo
                    src={`/videos/${String(selected.level).padStart(2, '0')}_1.mp4`}
                    style={{
                      width: '100%',
                      aspectRatio: '1 / 1',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                </div>
                <RadarChart items={[selected]} size={200} />
                <button onClick={() => toggleCompare(selected)}
                  style={compare.find(c => c.level === selected.level)
                    ? { backgroundColor: '#FFFFFF', color: '#000000', boxShadow: '0 0 12px rgba(255,255,255,0.2)' }
                    : { color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.1)' }}
                  className="mt-3 px-5 py-2 rounded-full text-xs font-semibold transition-all">
                  {compare.find(c => c.level === selected.level) ? t(lang, 'inComparison') : t(lang, 'addToCompare')}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Compare Panel */}
      {compare.length === 2 && (
        <div style={{ backgroundColor: '#383838', borderColor: 'rgba(255,255,255,0.05)' }} className="p-5 rounded-xl border mb-4">
          <h4 style={{ color: '#FFFFFF' }} className="text-base font-bold mb-5 text-center">
            {compare[0].name} <span style={{ color: 'rgba(255,255,255,0.4)' }} className="mx-2">{t(lang, 'vs')}</span> {compare[1].name}
          </h4>
          <div className="flex flex-col items-center gap-6">
            <div className="flex justify-center gap-4 w-full">
              {compare.map((item) => (
                <div key={item.level} style={{ backgroundColor: '#1a1a2e', borderRadius: '8px', overflow: 'hidden', aspectRatio: '1 / 1', width: '100%', maxWidth: '180px' }}>
                  <LazyNftVideo
                    src={`/videos/${String(item.level).padStart(2, '0')}_1.mp4`}
                    style={{
                      width: '100%',
                      aspectRatio: '1 / 1',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="w-full max-w-[280px]">
              <RadarChart items={compare} size={260} />
              <div className="flex justify-center gap-6 mt-2">
                {compare.map((item, idx) => (
                  <div key={item.level} className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: idx === 0 ? '#FFFFFF' : '#F59E0B' }} />
                    <span style={{ color: 'rgba(255,255,255,0.5)' }} className="text-xs font-semibold">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <th style={{ color: 'rgba(255,255,255,0.4)' }} className="text-left py-2 font-medium">{t(lang, 'metric')}</th>
                  <th style={{ color: '#FFFFFF' }} className="text-right py-2 font-semibold">{compare[0].name}</th>
                  <th style={{ color: '#F59E0B' }} className="text-right py-2 font-semibold">{compare[1].name}</th>
                </tr></thead>
                <tbody style={{ color: '#FFFFFF' }}>
                  {[
                    [t(lang, 'price'), fmtUsd(compare[0].price), fmtUsd(compare[1].price)],
                    [t(lang, 'incomeLimit'), fmtUsd(compare[0].limit), fmtUsd(compare[1].limit)],
                    ['ROI', `${(compare[0].limit / compare[0].price).toFixed(2)}x`, `${(compare[1].limit / compare[1].price).toFixed(2)}x`],
                    [t(lang, 'mktDepth'), `${compare[0].depth} ${t(lang, 'lvls')}`, `${compare[1].depth} ${t(lang, 'lvls')}`],
                    [t(lang, 'mining'), compare[0].mining ? `${compare[0].mining}d` : '—', compare[1].mining ? `${compare[1].mining}d` : '—'],
                    [t(lang, 'matchingBonus'), compare[0].matchingBonus ? '✓' : '✗', compare[1].matchingBonus ? '✓' : '✗'],
                    [t(lang, 'lending'), compare[0].lending ? '✓' : '✗', compare[1].lending ? '✓' : '✗'],
                    [t(lang, 'daMining'), compare[0].daMining ? '✓' : '✗', compare[1].daMining ? '✓' : '✗'],
                  ].map(([label, v1, v2], i) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ color: 'rgba(255,255,255,0.4)' }} className="py-2">{label}</td>
                      <td className="py-2 text-right font-semibold">{v1}</td>
                      <td className="py-2 text-right font-semibold">{v2}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <button onClick={() => setCompare([])} style={{ color: 'rgba(255,255,255,0.4)' }} className="mt-4 text-xs transition-colors">{t(lang, 'clearComparison')}</button>
        </div>
      )}

      <p style={{ color: 'rgba(255,255,255,0.4)' }} className="text-xs mt-4">{t(lang, 'clickToExpand')}</p>
    </div>
  );
};
