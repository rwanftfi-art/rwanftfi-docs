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
  var totalDays = lvl.days * 2 + 3; // mining + farming + 72h claim window
  var daPrice = 1.00; // Initial DA price
  var daReceived = totalNftm / daPrice; // NFTM converts to DA at current price
  var sellPayout = daReceived * daPrice * 0.75;
  var lendAmount = daReceived * daPrice * 0.70;
  var holdValue = daReceived * daPrice;
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

      {/* 3. Options: Sell / Lend / Hold */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
        <div style={{ border: '1px solid rgba(248,113,113,0.3)', backgroundColor: 'rgba(248,113,113,0.05)' }} className="rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <span style={{ color: '#f87171', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sell DA</span>
            <span style={{ color: 'rgba(255,255,255,0.5)', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', fontSize: '10px', fontWeight: 600, padding: '2px 8px', borderRadius: '9999px', marginLeft: 'auto', whiteSpace: 'nowrap' }}>75% payout</span>
          </div>
          <div style={{ color: '#FFFFFF', fontSize: '24px', fontWeight: 900, whiteSpace: 'nowrap' }}>{fmtUsd(sellPayout)}</div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', marginTop: '4px' }}>25% permanently burned · DA position lost</div>
        </div>

        <div style={{ border: '1px solid rgba(74,222,128,0.3)', backgroundColor: 'rgba(74,222,128,0.05)' }} className="rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <span style={{ color: '#4ade80', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Lend DA</span>
            <span style={{ color: 'rgba(255,255,255,0.5)', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', fontSize: '10px', fontWeight: 600, padding: '2px 8px', borderRadius: '9999px', marginLeft: 'auto', whiteSpace: 'nowrap' }}>70% LTV</span>
          </div>
          <div style={{ color: '#FFFFFF', fontSize: '24px', fontWeight: 900, whiteSpace: 'nowrap' }}>{fmtUsd(lendAmount)}</div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', marginTop: '4px' }}>30-day cutoff · DA preserved in TokenStack</div>
        </div>

        <div style={{ border: '1px solid rgba(251,191,36,0.3)', backgroundColor: 'rgba(251,191,36,0.05)' }} className="rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <span style={{ color: '#fbbf24', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Hold DA</span>
            <span style={{ color: 'rgba(255,255,255,0.5)', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', fontSize: '10px', fontWeight: 600, padding: '2px 8px', borderRadius: '9999px', marginLeft: 'auto', whiteSpace: 'nowrap' }}>full value</span>
          </div>
          <div style={{ color: '#FFFFFF', fontSize: '24px', fontWeight: 900, whiteSpace: 'nowrap' }}>{fmtUsd(holdValue)}</div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', marginTop: '4px' }}>Price grows as others burn DA</div>
        </div>
      </div>

    </div>
  );
};
