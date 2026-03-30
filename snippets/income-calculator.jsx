import { useState } from 'react';

export const IncomeCalculator = () => {
  var LEVEL_PERCENTS = [0, 1, 2, 2, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 5, 2, 2, 1, 0.5, 0.5, 0.5, 0.5];
  var DEPTH_BY_NFT = [2, 3, 4, 6, 9, 11, 12, 13, 15, 19];
  var NFT_NAMES = ['GENESIS', 'ADVANCE', 'ASCEND', 'ECLIPSE', 'HYDRO', 'QUANTUM', 'PULSE', 'AURORA', 'FLAME', 'INFINITY'];
  var NFT_PRICES = [28, 55, 140, 275, 550, 1100, 2200, 5500, 11000, 24000];
  var MAX_PARTICIPANTS = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768, 65536, 131072, 262144, 524288, 1048576, 2097152, 4194304];

  var usdFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });
  var fmtUsd = function(n) {
    return usdFormatter.format(n);
  };

  var makeInitialLevels = function() {
    var arr = [];
    for (var i = 0; i < 22; i++) {
      arr.push({ level: i + 1, sales: 0, rawSales: '', avgPrice: 550 });
    }
    return arr;
  };

  var [nftLevel, setNftLevel] = useState(5);
  var [showAll, setShowAll] = useState(false);
  var [activePreset, setActivePreset] = useState(null);
  var [levels, setLevels] = useState(makeInitialLevels);

  var maxDepth = DEPTH_BY_NFT[nftLevel - 1];

  var calculated = [];
  for (var ci = 0; ci < levels.length; ci++) {
    var l = levels[ci];
    var isUnlocked = l.level <= maxDepth;
    var pct = LEVEL_PERCENTS[l.level - 1];
    var income = isUnlocked ? l.sales * l.avgPrice * (pct / 100) : 0;
    calculated.push({
      level: l.level,
      sales: l.sales,
      rawSales: l.rawSales,
      avgPrice: l.avgPrice,
      pct: pct,
      income: income,
      isUnlocked: isUnlocked,
      maxPos: MAX_PARTICIPANTS[l.level - 1]
    });
  }

  var visibleLevels;
  if (showAll) {
    visibleLevels = calculated;
  } else {
    visibleLevels = [];
    for (var vi = 0; vi < calculated.length; vi++) {
      if (calculated[vi].isUnlocked || calculated[vi].sales > 0) {
        visibleLevels.push(calculated[vi]);
      }
    }
  }

  var totalIncome = 0;
  for (var ti = 0; ti < calculated.length; ti++) {
    totalIncome = totalIncome + calculated[ti].income;
  }
  var netIncome = totalIncome * 0.75;

  var updateLevel = function(index, updates) {
    setLevels(function(prev) {
      var next = [];
      for (var ui = 0; ui < prev.length; ui++) {
        if (ui === index) {
          next.push({
            level: prev[ui].level,
            sales: updates.sales !== undefined ? updates.sales : prev[ui].sales,
            rawSales: updates.rawSales !== undefined ? updates.rawSales : prev[ui].rawSales,
            avgPrice: updates.avgPrice !== undefined ? updates.avgPrice : prev[ui].avgPrice
          });
        } else {
          next.push({
            level: prev[ui].level,
            sales: prev[ui].sales,
            rawSales: prev[ui].rawSales,
            avgPrice: prev[ui].avgPrice
          });
        }
      }
      return next;
    });
  };

  var applyPreset = function(name, newLevels) {
    setLevels(newLevels);
    setActivePreset(name);
  };

  var makeSmallPreset = function() {
    var arr = [];
    for (var si = 0; si < levels.length; si++) {
      arr.push({ level: levels[si].level, sales: 0, rawSales: '', avgPrice: 275 });
    }
    arr[1] = { level: arr[1].level, sales: 2, rawSales: '2', avgPrice: 275 };
    arr[2] = { level: arr[2].level, sales: 2, rawSales: '2', avgPrice: 275 };
    arr[3] = { level: arr[3].level, sales: 2, rawSales: '2', avgPrice: 275 };
    return arr;
  };

  var makeGrowingPreset = function() {
    var arr = [];
    for (var gi = 0; gi < levels.length; gi++) {
      arr.push({ level: levels[gi].level, sales: 0, rawSales: '', avgPrice: 550 });
    }
    for (var gi2 = 1; gi2 <= 8; gi2++) {
      var s = Math.min(3 + gi2, MAX_PARTICIPANTS[gi2]);
      arr[gi2] = { level: arr[gi2].level, sales: s, rawSales: String(s), avgPrice: 550 };
    }
    return arr;
  };

  var makeClearPreset = function() {
    var arr = [];
    for (var ki = 0; ki < levels.length; ki++) {
      arr.push({ level: levels[ki].level, sales: 0, rawSales: '', avgPrice: levels[ki].avgPrice });
    }
    return arr;
  };

  var presetBtnStyle = function(name) {
    return {
      backgroundColor: activePreset === name ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)',
      border: '1px solid ' + (activePreset === name ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.15)'),
      color: '#FFFFFF',
      padding: '6px 16px',
      borderRadius: '9999px',
      fontSize: '11px',
      fontWeight: 600,
      cursor: 'pointer',
    };
  };

  var selectStyle = {
    backgroundColor: 'rgba(56,56,56,0.7)',
    color: '#FFFFFF',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '6px',
    padding: '6px 4px',
    fontSize: '12px',
    width: '68px',
    outline: 'none',
    cursor: 'pointer',
    WebkitAppearance: 'none',
    appearance: 'none',
    backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'10\' height=\'6\'%3E%3Cpath d=\'M0 0l5 6 5-6z\' fill=\'%23666\'/%3E%3C/svg%3E")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 6px center',
    paddingRight: '18px',
  };

  var inputStyle = {
    backgroundColor: 'rgba(56,56,56,0.7)',
    color: '#FFFFFF',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '6px',
    padding: '6px 8px',
    fontSize: '13px',
    width: '48px',
    textAlign: 'center',
    outline: 'none',
  };

  var thStyle = function(width, align) {
    return {
      padding: '4px 4px',
      textAlign: align || 'center',
      color: 'rgba(255,255,255,0.5)',
      fontWeight: 600,
      fontSize: '11px',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      width: width,
    };
  };

  return (
    <div style={{ backgroundColor: '#000000', color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.05)' }} className="p-6 rounded-xl not-prose border">
      {/* Header + Interactive badge */}
      <div className="flex items-center justify-between mb-6">
        <h3 style={{ color: '#FFFFFF', margin: 0 }} className="text-lg font-serif italic">Marketing Income Calculator</h3>
        <span style={{ color: 'rgba(255,255,255,0.6)', backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }} className="text-xs px-3 py-1 rounded-full font-medium">Interactive</span>
      </div>

      {/* NFT Selector */}
      <div style={{ backgroundColor: '#383838', borderColor: 'rgba(255,255,255,0.05)' }} className="rounded-xl border p-4 mb-4">
        <label style={{ color: 'rgba(255,255,255,0.5)' }} className="text-[10px] font-semibold uppercase tracking-wider mb-2 block">Your NFT Level</label>
        <select value={nftLevel} onChange={function(e) { setNftLevel(Number(e.target.value)); }}
          style={{ backgroundColor: 'rgba(56,56,56,0.7)', color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.05)' }}
          className="w-full p-2.5 rounded-lg text-sm font-medium border">
          {NFT_NAMES.map(function(name, i) {
            return (
              <option key={i} value={i + 1}>{'L' + (i + 1) + ' — ' + name + ' (' + fmtUsd(NFT_PRICES[i]) + ') — ' + DEPTH_BY_NFT[i] + ' lvls'}</option>
            );
          })}
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
          <div style={{ color: '#FFFFFF', fontSize: '40px' }} className="font-black transition-all duration-300">{'≈ ' + fmtUsd(totalIncome)}</div>
        )}
        <div style={{ color: 'rgba(255,255,255,0.5)' }} className="text-xs mt-1">Based on your custom level inputs below</div>
        {totalIncome > 0 && (
          <div>
            <div style={{ height: '1px', width: '80px', backgroundColor: 'rgba(255,255,255,0.1)', margin: '14px auto' }} />
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.15)', borderRadius: '9999px', padding: '6px 16px' }}>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>75% net income</span>
              <span style={{ color: '#4ade80', fontSize: '14px', fontWeight: 800 }}>{fmtUsd(netIncome)}</span>
            </div>
            <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px', marginTop: '10px' }}>Regular Balance — withdraw anytime</div>
          </div>
        )}
      </div>

      {/* Quick Fill Presets */}
      <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', marginBottom: '8px' }}>
        Quick fill presets:
      </div>
      <div className="flex gap-2 mb-3 flex-wrap">
        <button onClick={function() { applyPreset('small', makeSmallPreset()); }} style={presetBtnStyle('small')}>
          Small Team
        </button>
        <button onClick={function() { applyPreset('growing', makeGrowingPreset()); }} style={presetBtnStyle('growing')}>
          Growing Network
        </button>
        <button onClick={function() { applyPreset('clear', makeClearPreset()); }} style={presetBtnStyle('clear')}>
          Clear All
        </button>
      </div>

      {/* Scrollable Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ minWidth: '400px', width: '100%', borderCollapse: 'collapse', fontSize: '12px', tableLayout: 'fixed' }}>
          <thead>
            <tr style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
              <th style={thStyle('32px', 'center')}>Level</th>
              <th style={thStyle('36px', 'center')}>%</th>
              <th style={thStyle('72px', 'center')}>NFT Price</th>
              <th style={thStyle('52px', 'center')}>Sales</th>
              <th style={thStyle('72px', 'right')}>Income</th>
            </tr>
          </thead>
          <tbody>
            {visibleLevels.map(function(row) {
              var idx = row.level - 1;
              var isLocked = !row.isUnlocked;
              var rowBg = row.sales > 0 ? 'rgba(255,255,255,0.04)' : (idx % 2 === 0 ? 'rgba(255,255,255,0.03)' : 'transparent');
              var rowOpacity = isLocked ? 0.3 : 1;

              return (
                <tr key={row.level} style={{ backgroundColor: rowBg, opacity: rowOpacity }}>
                  <td style={{ padding: '4px 4px', textAlign: 'center', fontWeight: 600 }}>
                    {row.level}
                    {row.level >= 16 && row.isUnlocked && (
                      <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '9px', marginLeft: '4px' }}>P2</span>
                    )}
                  </td>
                  <td style={{ padding: '4px 4px', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
                    {row.level === 1 ? (
                      <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>Direct Sale</span>
                    ) : (
                      <span>{row.pct + '%'}</span>
                    )}
                  </td>
                  <td style={{ padding: '4px 4px', textAlign: 'center' }}>
                    {isLocked ? (
                      <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px' }}>Upgrade NFT</span>
                    ) : (
                      <select
                        value={row.avgPrice}
                        onChange={function(e) { updateLevel(idx, { avgPrice: Number(e.target.value) }); }}
                        style={selectStyle}
                      >
                        {NFT_PRICES.map(function(p) {
                          return (
                            <option key={p} value={p}>{'$' + p.toLocaleString()}</option>
                          );
                        })}
                      </select>
                    )}
                  </td>
                  <td style={{ padding: '4px 4px', textAlign: 'center' }}>
                    {isLocked ? (
                      <span style={{ color: 'rgba(255,255,255,0.3)' }}>{'\u2014'}</span>
                    ) : (
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={row.rawSales}
                        placeholder="0"
                        onChange={function(e) {
                          var val = e.target.value.replace(/[^0-9]/g, '');
                          var num = val === '' ? 0 : parseInt(val, 10);
                          updateLevel(idx, { sales: num, rawSales: val });
                        }}
                        onFocus={function(e) { e.target.select(); }}
                        style={inputStyle}
                      />
                    )}
                  </td>
                  <td style={{ padding: '4px 4px', textAlign: 'right', fontWeight: 700 }}>
                    {row.isUnlocked ? (
                      row.sales > 0 ? (
                        <span style={{ color: '#4ade80' }}>{fmtUsd(row.income)}</span>
                      ) : (
                        <span style={{ color: 'rgba(255,255,255,0.3)' }}>{'\u2014'}</span>
                      )
                    ) : '\u2014'}
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
          <span style={{ color: '#4ade80' }}>{'≈ ' + fmtUsd(totalIncome)}</span>
        </div>
      </div>

      {/* Level 1 footnote */}
      <div style={{ color: '#9CA3AF', fontSize: '12px', marginTop: '8px' }}>
        Level 1 earnings come from the Sponsor Bonus (30% new sale / 20% rebuy), not from the tree distribution percentage.
      </div>

      {/* Show/hide locked levels toggle */}
      <button onClick={function() { setShowAll(!showAll); }}
        style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', marginTop: '8px', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
        {showAll ? 'Hide locked levels' : 'Show all 22 levels'}
      </button>
    </div>
  );
};
