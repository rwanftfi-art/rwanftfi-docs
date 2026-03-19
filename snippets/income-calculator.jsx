import { useState } from 'react';

export const IncomeCalculator = () => {
  const LEVEL_PERCENTS = [0, 1, 2, 2, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 5, 2, 2, 1, 0.5, 0.5, 0.5, 0.5];
  const DEPTH_BY_NFT = [2, 3, 4, 6, 9, 11, 12, 13, 15, 19];
  const NFT_NAMES = ['GENESIS', 'ADVANCE', 'ASCEND', 'ECLIPSE', 'HYDRO', 'QUANTUM', 'PULSE', 'AURORA', 'FLAME', 'INFINITY'];
  const NFT_PRICES = [28, 55, 140, 275, 550, 1100, 2200, 5500, 11000, 24000];
  const MAX_PARTICIPANTS = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768, 65536, 131072, 262144, 524288, 1048576, 2097152, 4194304];

  const fmtUsd = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(n);

  const [nftLevel, setNftLevel] = useState(5);
  const [showAll, setShowAll] = useState(false);
  const [activePreset, setActivePreset] = useState(null);
  const [levels, setLevels] = useState(
    Array.from({ length: 22 }, (_, i) => ({
      level: i + 1,
      sales: 0,
      avgPrice: 550,
    }))
  );

  const maxDepth = DEPTH_BY_NFT[nftLevel - 1];

  const calculated = levels.map((l) => {
    const isUnlocked = l.level <= maxDepth;
    const pct = LEVEL_PERCENTS[l.level - 1];
    const income = isUnlocked ? l.sales * l.avgPrice * (pct / 100) : 0;
    return { ...l, pct, income, isUnlocked, maxPos: MAX_PARTICIPANTS[l.level - 1] };
  });

  const visibleLevels = showAll
    ? calculated
    : calculated.filter(l => l.isUnlocked || l.sales > 0);

  const totalIncome = calculated.reduce((s, l) => s + l.income, 0);
  const netIncome = totalIncome * 0.75;
  const accumulative = totalIncome * 0.20;
  const daTax = totalIncome * 0.05;

  const updateLevel = (index, field, value) => {
    setLevels((prev) => prev.map((l, i) => i === index ? { ...l, [field]: value } : l));
  };

  const presets = {
    small: () => {
      const newLevels = levels.map((l) => ({ ...l, sales: 0, avgPrice: 275 }));
      newLevels[1].sales = 2;
      newLevels[2].sales = 2;
      newLevels[3].sales = 2;
      return newLevels;
    },
    growing: () => {
      const newLevels = levels.map((l) => ({ ...l, sales: 0, avgPrice: 550 }));
      for (let i = 1; i <= 8; i++) {
        newLevels[i].sales = Math.min(3 + i, MAX_PARTICIPANTS[i]);
      }
      return newLevels;
    },
    clear: () => levels.map((l) => ({ ...l, sales: 0 })),
  };

  const selectStyle = {
    backgroundColor: 'rgba(56,56,56,0.7)',
    color: '#FFFFFF',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '6px',
    padding: '6px 4px',
    fontSize: '12px',
    width: '72px',
    outline: 'none',
    cursor: 'pointer',
    WebkitAppearance: 'none',
    appearance: 'none',
    backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'10\' height=\'6\'%3E%3Cpath d=\'M0 0l5 6 5-6z\' fill=\'%23666\'/%3E%3C/svg%3E")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 6px center',
    paddingRight: '18px',
  };

  const presetBtnStyle = (name) => ({
    backgroundColor: activePreset === name ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)',
    border: `1px solid ${activePreset === name ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.15)'}`,
    color: '#FFFFFF',
    padding: '6px 16px',
    borderRadius: '9999px',
    fontSize: '11px',
    fontWeight: 600,
    cursor: 'pointer',
  });

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

      {/* HERO: Total Gross Income */}
      <div style={{ backgroundColor: '#383838', border: '1px solid rgba(255,255,255,0.1)' }} className="rounded-xl p-6 text-center mb-4">
        <div style={{ color: 'rgba(255,255,255,0.6)' }} className="text-xs uppercase tracking-wider mb-1">Total Gross Income</div>
        {totalIncome === 0 ? (
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>
            Enter sales data below or use a preset
          </div>
        ) : (
          <div style={{ color: '#FFFFFF', fontSize: '40px' }} className="font-black transition-all duration-300">{fmtUsd(totalIncome)}</div>
        )}
        <div style={{ color: 'rgba(255,255,255,0.5)' }} className="text-xs mt-1">Based on your custom level inputs below</div>
      </div>

      {/* Three monochrome cards — hidden when total = 0 */}
      {totalIncome > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
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
      )}

      {/* Quick Fill Presets */}
      <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', marginBottom: '8px' }}>
        Quick fill presets:
      </div>
      <div className="flex gap-2 mb-3 flex-wrap">
        <button onClick={() => { setLevels(presets.small()); setActivePreset('small'); }} style={presetBtnStyle('small')}>
          Small Team
        </button>
        <button onClick={() => { setLevels(presets.growing()); setActivePreset('growing'); }} style={presetBtnStyle('growing')}>
          Growing Network
        </button>
        <button onClick={() => { setLevels(presets.clear()); setActivePreset('clear'); }} style={presetBtnStyle('clear')}>
          Clear All
        </button>
      </div>

      {/* Scrollable Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ minWidth: '400px', width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
          <thead>
            <tr style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
              <th style={{ padding: '6px 6px', textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', width: '40px' }}>Level</th>
              <th style={{ padding: '6px 6px', textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', width: '40px' }}>%</th>
              <th style={{ padding: '6px 6px', textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', width: '80px' }}>NFT Price</th>
              <th style={{ padding: '6px 6px', textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', width: '60px' }}>Sales</th>
              <th style={{ padding: '6px 6px', textAlign: 'right', color: 'rgba(255,255,255,0.5)', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', width: '80px' }}>Income</th>
            </tr>
          </thead>
          <tbody>
            {visibleLevels.map((row) => {
              const i = row.level - 1;
              const isLocked = !row.isUnlocked;
              const rowBg = row.sales > 0 ? 'rgba(255,255,255,0.04)' : (i % 2 === 0 ? 'rgba(255,255,255,0.03)' : 'transparent');
              const rowOpacity = isLocked ? 0.3 : 1;

              return (
                <tr key={row.level} style={{ backgroundColor: rowBg, opacity: rowOpacity }}>
                  <td style={{ padding: '4px 6px', textAlign: 'center', fontWeight: 600 }}>
                    {row.level}
                    {row.level >= 16 && row.isUnlocked && (
                      <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '9px', marginLeft: '4px' }}>P2</span>
                    )}
                  </td>
                  <td style={{ padding: '4px 6px', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>{row.pct}%</td>
                  <td style={{ padding: '4px 6px', textAlign: 'center' }}>
                    {isLocked ? (
                      <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px' }}>Upgrade NFT</span>
                    ) : (
                      <select
                        value={row.avgPrice}
                        onChange={(e) => updateLevel(i, 'avgPrice', Number(e.target.value))}
                        style={selectStyle}
                      >
                        {NFT_PRICES.map((p) => (
                          <option key={p} value={p}>${p.toLocaleString()}</option>
                        ))}
                      </select>
                    )}
                  </td>
                  <td style={{ padding: '4px 6px', textAlign: 'center' }}>
                    {isLocked ? (
                      <span style={{ color: 'rgba(255,255,255,0.3)' }}>—</span>
                    ) : (
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={row.sales === 0 ? '' : row.sales}
                        placeholder="0"
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9]/g, '');
                          const num = val === '' ? 0 : Math.min(parseInt(val, 10), row.maxPos);
                          updateLevel(i, 'sales', num);
                        }}
                        onFocus={(e) => e.target.select()}
                        style={{
                          backgroundColor: 'rgba(56,56,56,0.7)',
                          color: '#FFFFFF',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '6px',
                          padding: '6px 8px',
                          fontSize: '13px',
                          width: '56px',
                          textAlign: 'center',
                          outline: 'none',
                        }}
                      />
                    )}
                  </td>
                  <td style={{ padding: '4px 6px', textAlign: 'right', fontWeight: 700 }}>
                    {row.isUnlocked ? (
                      row.sales > 0 ? (
                        <span style={{ color: '#4ade80' }}>{fmtUsd(row.income)}</span>
                      ) : (
                        <span style={{ color: 'rgba(255,255,255,0.3)' }}>—</span>
                      )
                    ) : '—'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {/* TOTAL row */}
        <div style={{
          backgroundColor: 'rgba(255,255,255,0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          padding: '12px 16px',
          borderRadius: '0 0 12px 12px',
          fontSize: '14px',
          fontWeight: 800,
        }}>
          <span style={{ color: 'rgba(255,255,255,0.6)' }}>TOTAL</span>
          <span style={{ color: '#4ade80' }}>{fmtUsd(totalIncome)}</span>
        </div>
      </div>

      {/* Show/hide locked levels toggle */}
      <button onClick={() => setShowAll(!showAll)}
        style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', marginTop: '8px', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
        {showAll ? 'Hide locked levels' : 'Show all 22 levels'}
      </button>
    </div>
  );
};
