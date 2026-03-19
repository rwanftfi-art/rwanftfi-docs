import { useState } from 'react';

export const IncomeCalculator = () => {
  const LEVEL_PERCENTS = [0, 1, 2, 2, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 5, 2, 2, 1, 0.5, 0.5, 0.5, 0.5];
  const DEPTH_BY_NFT = [2, 3, 4, 6, 9, 11, 12, 13, 15, 19];
  const NFT_NAMES = ['GENESIS', 'ADVANCE', 'ASCEND', 'ECLIPSE', 'HYDRO', 'QUANTUM', 'PULSE', 'AURORA', 'FLAME', 'INFINITY'];
  const NFT_PRICES = [28, 55, 140, 275, 550, 1100, 2200, 5500, 11000, 24000];
  const MAX_PARTICIPANTS = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768, 65536, 131072, 262144, 524288, 1048576, 2097152, 4194304];

  const fmtUsd = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(n);

  const [nftLevel, setNftLevel] = useState(5);
  const [levels, setLevels] = useState(
    Array.from({ length: 22 }, (_, i) => ({
      level: i + 1,
      sales: 0,
      avgPrice: 550,
    }))
  );

  const maxDepth = DEPTH_BY_NFT[nftLevel - 1];

  const calculated = levels.map((l) => {
    const isPhase2 = l.level >= 16;
    const isUnlocked = l.level <= maxDepth && !isPhase2;
    const pct = LEVEL_PERCENTS[l.level - 1];
    const income = isUnlocked ? l.sales * l.avgPrice * (pct / 100) : 0;
    return { ...l, pct, income, isUnlocked, isPhase2, maxPos: MAX_PARTICIPANTS[l.level - 1] };
  });

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

  const inputStyle = {
    backgroundColor: 'rgba(56,56,56,0.7)',
    color: '#FFFFFF',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '6px',
    padding: '4px 8px',
    fontSize: '13px',
    width: '70px',
    textAlign: 'center',
  };

  const selectStyle = {
    backgroundColor: 'rgba(56,56,56,0.7)',
    color: '#FFFFFF',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '6px',
    padding: '4px 6px',
    fontSize: '12px',
  };

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
        <div style={{ color: '#FFFFFF', fontSize: '40px' }} className="font-black transition-all duration-300">{fmtUsd(totalIncome)}</div>
        <div style={{ color: 'rgba(255,255,255,0.5)' }} className="text-xs mt-1">Based on your custom level inputs below</div>
      </div>

      {/* Three monochrome cards */}
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

      {/* Quick Fill Presets */}
      <div className="flex gap-2 mb-3 flex-wrap">
        <button
          onClick={() => setLevels(presets.small())}
          style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '6px 14px', fontSize: '12px', cursor: 'pointer' }}
        >
          Small Team
        </button>
        <button
          onClick={() => setLevels(presets.growing())}
          style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '6px 14px', fontSize: '12px', cursor: 'pointer' }}
        >
          Growing Network
        </button>
        <button
          onClick={() => setLevels(presets.clear())}
          style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '6px 14px', fontSize: '12px', cursor: 'pointer' }}
        >
          Clear All
        </button>
      </div>

      {/* Scrollable Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ minWidth: '600px', width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
              <th style={{ padding: '8px 10px', textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Level</th>
              <th style={{ padding: '8px 10px', textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Max Pos.</th>
              <th style={{ padding: '8px 10px', textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>%</th>
              <th style={{ padding: '8px 10px', textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>NFT Price</th>
              <th style={{ padding: '8px 10px', textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sales</th>
              <th style={{ padding: '8px 10px', textAlign: 'right', color: 'rgba(255,255,255,0.5)', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Income</th>
            </tr>
          </thead>
          <tbody>
            {calculated.map((row, i) => {
              const isLocked = !row.isUnlocked && !row.isPhase2;
              const isDisabled = row.isPhase2 || isLocked;
              const rowBg = i % 2 === 0 ? 'rgba(255,255,255,0.03)' : 'transparent';
              const rowOpacity = isDisabled ? 0.3 : 1;

              return (
                <tr key={row.level} style={{ backgroundColor: rowBg, opacity: rowOpacity }}>
                  <td style={{ padding: '6px 10px', textAlign: 'center', fontWeight: 600 }}>{row.level}</td>
                  <td style={{ padding: '6px 10px', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>{row.maxPos.toLocaleString()}</td>
                  <td style={{ padding: '6px 10px', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>{row.pct}%</td>
                  <td style={{ padding: '6px 10px', textAlign: 'center' }}>
                    {row.isPhase2 ? (
                      <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>Phase 2</span>
                    ) : isLocked ? (
                      <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>Upgrade NFT</span>
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
                  <td style={{ padding: '6px 10px', textAlign: 'center' }}>
                    {row.isPhase2 || isLocked ? (
                      <span style={{ color: 'rgba(255,255,255,0.3)' }}>—</span>
                    ) : (
                      <input
                        type="number"
                        min={0}
                        max={row.maxPos}
                        value={row.sales}
                        onChange={(e) => {
                          const val = Math.max(0, Math.min(row.maxPos, Number(e.target.value) || 0));
                          updateLevel(i, 'sales', val);
                        }}
                        style={inputStyle}
                      />
                    )}
                  </td>
                  <td style={{ padding: '6px 10px', textAlign: 'right', color: '#FFFFFF', fontWeight: 700 }}>
                    {row.isUnlocked ? fmtUsd(row.income) : '—'}
                  </td>
                </tr>
              );
            })}
            {/* TOTAL row */}
            <tr style={{ backgroundColor: 'rgba(255,255,255,0.08)', fontWeight: 800, fontSize: '16px' }}>
              <td colSpan={5} style={{ padding: '10px', textAlign: 'right' }}>TOTAL</td>
              <td style={{ padding: '10px', textAlign: 'right', color: '#FFFFFF' }}>{fmtUsd(totalIncome)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
