import { useState } from 'react';

export const MiningPipeline = () => {
  const [selectedLevel, setSelectedLevel] = useState(5);

  const LEVELS = {
    5:  { name: 'HYDRO',    price: 550,   days: 45, c1: 0.10, c2: 0.10 },
    6:  { name: 'QUANTUM',  price: 1100,  days: 44, c1: 0.10, c2: 0.10 },
    7:  { name: 'PULSE',    price: 2200,  days: 43, c1: 0.10, c2: 0.10 },
    8:  { name: 'AURORA',   price: 5500,  days: 42, c1: 0.10, c2: 0.15 },
    9:  { name: 'FLAME',    price: 11000, days: 41, c1: 0.10, c2: 0.15 },
    10: { name: 'INFINITY', price: 24000, days: 40, c1: 0.10, c2: 0.15 },
  };

  const fmtUsd = function(n) {
    var digits = Math.abs(n) >= 10000 ? 0 : 2;
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: digits }).format(n);
  };
  var fmtNum = function(n) { return new Intl.NumberFormat('en-US').format(Math.round(n)); };

  var lvl = LEVELS[selectedLevel];
  var nftmCycle1 = lvl.price * lvl.c1;
  var nftmCycle2 = lvl.price * lvl.c2;
  var totalNftm = nftmCycle1 + nftmCycle2;
  var totalDays = lvl.days * 2;
  var daReceived = totalNftm;
  var sellPayout = daReceived * 0.75;
  var lendAmount = daReceived * 0.70;
  var holdValue = daReceived * 1.00;
  var sellRoi = (((sellPayout - lvl.price) / lvl.price) * 100).toFixed(0);
  var breakeven = lvl.price / (totalNftm * 0.75);

  var allNfts = Object.entries(LEVELS).map(function(entry) {
    var k = Number(entry[0]);
    var d = entry[1];
    var nftm = d.price * d.c1 + d.price * d.c2;
    var da = nftm;
    var sell = da * 0.75;
    var be = d.price / (nftm * 0.75);
    return { level: k, name: d.name, price: d.price, days: d.days * 2, nftm: nftm, da: da, sell: sell, breakeven: be };
  });

  return (
    <div style={{ backgroundColor: '#000000', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.05)' }} className="p-6 rounded-xl not-prose">

      {/* 1. Header + NFT Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 style={{ color: '#FFFFFF', margin: 0 }} className="text-lg font-serif italic">Mining Dashboard</h3>
          <p style={{ color: 'rgba(255,255,255,0.4)', margin: '4px 0 0 0' }} className="text-xs">Full pipeline overview — from NFT purchase to DA harvest</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedLevel}
            onChange={function(e) { setSelectedLevel(Number(e.target.value)); }}
            style={{ backgroundColor: '#383838', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '8px 12px', fontSize: '13px', cursor: 'pointer', outline: 'none' }}
          >
            {Object.entries(LEVELS).map(function(entry) {
              var k = entry[0];
              var d = entry[1];
              return <option key={k} value={k}>L{k} — {d.name} ({d.price} USDT) — {d.days} days</option>;
            })}
          </select>
          <span style={{ color: 'rgba(255,255,255,0.6)', backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', fontSize: '11px', padding: '4px 12px', borderRadius: '9999px', fontWeight: 500 }}>Interactive</span>
        </div>
      </div>

      {/* 2. Timeline Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span style={{ color: 'rgba(255,255,255,0.5)' }} className="text-xs font-medium">Total Pipeline</span>
          <span style={{ color: '#FFFFFF' }} className="text-sm font-bold">{totalDays} days</span>
        </div>

        <div className="flex items-center gap-0.5" style={{ height: '48px', borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ backgroundColor: 'rgba(255,255,255,0.15)', width: '48%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', borderTopLeftRadius: '12px', borderBottomLeftRadius: '12px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#FFFFFF', fontSize: '12px', fontWeight: 700 }}>Mining</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px' }}>{lvl.days} days — {fmtNum(totalNftm)} NFTM</div>
            </div>
          </div>
          <div style={{ backgroundColor: '#ef4444', width: '4%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ color: '#FFFFFF', fontSize: '9px', fontWeight: 900 }}>72h</div>
          </div>
          <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', width: '48%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', borderTopRightRadius: '12px', borderBottomRightRadius: '12px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#FFFFFF', fontSize: '12px', fontWeight: 700 }}>Farming</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px' }}>{lvl.days} days — {fmtNum(daReceived)} DA</div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <span className="relative flex" style={{ height: '8px', width: '8px' }}>
            <span className="animate-ping absolute inline-flex rounded-full" style={{ height: '100%', width: '100%', backgroundColor: '#ef4444', opacity: 0.75 }} />
            <span className="relative inline-flex rounded-full" style={{ height: '8px', width: '8px', backgroundColor: '#ef4444' }} />
          </span>
          <span style={{ color: '#f87171', fontSize: '11px', fontWeight: 500 }}>72-hour critical window — miss it and the entire cycle restarts from scratch</span>
        </div>
      </div>

      {/* 3. Flow: 4 metrics */}
      <div className="mb-6">
        <div className="grid grid-cols-2 md:grid-cols-7 gap-2">
          <div style={{ backgroundColor: '#383838', border: '1px solid rgba(255,255,255,0.05)' }} className="rounded-xl p-4 text-center md:col-span-1">
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginBottom: '8px' }}>INVEST</div>
            <div style={{ color: '#FFFFFF', fontSize: '20px', fontWeight: 900 }}>{fmtUsd(lvl.price)}</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', marginTop: '4px' }}>NFT cost</div>
          </div>

          <div className="hidden md:flex items-center justify-center" style={{ color: 'rgba(255,255,255,0.2)', fontSize: '20px' }}>→</div>

          <div style={{ backgroundColor: '#383838', border: '1px solid rgba(255,255,255,0.05)' }} className="rounded-xl p-4 text-center md:col-span-1">
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginBottom: '8px' }}>MINE</div>
            <div style={{ color: '#FFFFFF', fontSize: '20px', fontWeight: 900 }}>{fmtNum(totalNftm)} NFTM</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', marginTop: '4px' }}>C1: {fmtNum(nftmCycle1)} + C2: {fmtNum(nftmCycle2)}</div>
          </div>

          <div className="hidden md:flex items-center justify-center" style={{ color: 'rgba(255,255,255,0.2)', fontSize: '20px' }}>→</div>

          <div style={{ backgroundColor: '#383838', border: '1px solid rgba(255,255,255,0.05)' }} className="rounded-xl p-4 text-center md:col-span-1">
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginBottom: '8px' }}>FARM</div>
            <div style={{ color: '#FFFFFF', fontSize: '20px', fontWeight: 900 }}>{fmtNum(daReceived)} DA</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', marginTop: '4px' }}>at initial price $1.00/DA</div>
          </div>

          <div className="hidden md:flex items-center justify-center" style={{ color: 'rgba(255,255,255,0.2)', fontSize: '20px' }}>→</div>

          <div style={{ backgroundColor: '#383838', border: '1px solid rgba(255,255,255,0.05)' }} className="rounded-xl p-4 text-center md:col-span-1">
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginBottom: '8px' }}>HARVEST</div>
            <div style={{ color: '#FFFFFF', fontSize: '20px', fontWeight: 900 }}>~{totalDays}d</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', marginTop: '4px' }}>total pipeline</div>
          </div>
        </div>
      </div>

      {/* 4. Options: Sell / Lend / Hold */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
        <div style={{ border: '1px solid rgba(239,68,68,0.3)', backgroundColor: 'rgba(239,68,68,0.05)' }} className="rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <span style={{ fontSize: '16px' }}>Fire</span>
            <span style={{ color: '#f87171', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sell DA</span>
            <span style={{ color: '#f87171', backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', fontSize: '10px', fontWeight: 600, padding: '2px 8px', borderRadius: '9999px', marginLeft: 'auto' }}>75% payout</span>
          </div>
          <div style={{ color: '#FFFFFF', fontSize: '24px', fontWeight: 900 }}>{fmtUsd(sellPayout)}</div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', marginTop: '4px' }}>25% permanently burned · DA position lost</div>
        </div>

        <div style={{ border: '1px solid rgba(74,222,128,0.3)', backgroundColor: 'rgba(34,197,94,0.05)' }} className="rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <span style={{ fontSize: '16px' }}>Bank</span>
            <span style={{ color: '#4ade80', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Lend DA</span>
            <span style={{ color: '#4ade80', backgroundColor: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', fontSize: '10px', fontWeight: 600, padding: '2px 8px', borderRadius: '9999px', marginLeft: 'auto' }}>70% LTV</span>
          </div>
          <div style={{ color: '#FFFFFF', fontSize: '24px', fontWeight: 900 }}>{fmtUsd(lendAmount)}</div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', marginTop: '4px' }}>30-day cutoff · DA preserved in TokenStack</div>
        </div>

        <div style={{ border: '1px solid rgba(251,191,36,0.3)', backgroundColor: 'rgba(251,191,36,0.05)' }} className="rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <span style={{ fontSize: '16px' }}>Diamond</span>
            <span style={{ color: '#fbbf24', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Hold DA</span>
            <span style={{ color: '#fbbf24', backgroundColor: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)', fontSize: '10px', fontWeight: 600, padding: '2px 8px', borderRadius: '9999px', marginLeft: 'auto' }}>full value</span>
          </div>
          <div style={{ color: '#FFFFFF', fontSize: '24px', fontWeight: 900 }}>{fmtUsd(holdValue)}</div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', marginTop: '4px' }}>Price grows as others burn DA</div>
        </div>
      </div>

      <div style={{ backgroundColor: 'rgba(56,56,56,0.7)', border: '1px solid rgba(255,255,255,0.05)' }} className="rounded-lg px-4 py-3 mb-6">
        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>
          At initial DA price ($1.00), manual sell returns <span style={{ color: '#FFFFFF', fontWeight: 700 }}>{sellRoi}%</span> of your NFT investment after ~{totalDays} days.
          Break-even DA price for full NFT recovery: <span style={{ color: '#FFFFFF', fontWeight: 700 }}>{fmtUsd(breakeven)}</span>
        </span>
      </div>

      {/* 5. Comparison Table */}
      <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>All Mining-Capable NFTs at DA Price $1.00</div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
          <thead>
            <tr>
              {['NFT', 'Cost', 'Days', 'NFTM', 'DA', 'Sell@75%', 'Break-even'].map(function(h) {
                return <th key={h} style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '8px 10px', textAlign: 'left', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>{h}</th>;
              })}
            </tr>
          </thead>
          <tbody>
            {allNfts.map(function(row) {
              return (
                <tr key={row.level} style={{ backgroundColor: row.level === selectedLevel ? 'rgba(255,255,255,0.05)' : 'transparent' }}>
                  <td style={{ padding: '10px', color: '#FFFFFF', fontWeight: 600, fontSize: '13px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>L{row.level} {row.name}</td>
                  <td style={{ padding: '10px', color: '#FFFFFF', fontSize: '13px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{fmtUsd(row.price)}</td>
                  <td style={{ padding: '10px', color: '#FFFFFF', fontSize: '13px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{row.days}</td>
                  <td style={{ padding: '10px', color: '#FFFFFF', fontSize: '13px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{fmtNum(row.nftm)}</td>
                  <td style={{ padding: '10px', color: '#FFFFFF', fontSize: '13px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{fmtNum(row.da)}</td>
                  <td style={{ padding: '10px', color: '#FFFFFF', fontSize: '13px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{fmtUsd(row.sell)}</td>
                  <td style={{ padding: '10px', color: '#fbbf24', fontSize: '13px', fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{fmtUsd(row.breakeven)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 6. Disclaimer */}
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', lineHeight: 1.6, marginTop: '16px', marginBottom: 0 }}>
        NFTM is an internal mining counter, not a token. At initial DA price $1.00, 1 NFTM = 1 DA.
        Actual DA received depends on DA price at time of harvest. Mining + farming durations are equal.
      </p>
    </div>
  );
};
