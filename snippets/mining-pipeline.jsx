import { useState } from 'react';

export const MiningPipeline = () => {
  const [selectedLevel, setSelectedLevel] = useState(5);

  const LEVELS = {
    5:  { name: 'HYDRO',    price: 550,   days: 45, c1: 0.10, c2: 0, cycles: 1 },
    6:  { name: 'QUANTUM',  price: 1100,  days: 44, c1: 0.10, c2: 0, cycles: 1 },
    7:  { name: 'PULSE',    price: 2200,  days: 43, c1: 0.10, c2: 0, cycles: 1 },
    8:  { name: 'AURORA',   price: 5500,  days: 42, c1: 0.10, c2: 0.15, cycles: 2 },
    9:  { name: 'FLAME',    price: 11000, days: 41, c1: 0.10, c2: 0.15, cycles: 2 },
    10: { name: 'INFINITY', price: 24000, days: 40, c1: 0.10, c2: 0.15, cycles: 2 },
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
  var totalDays = lvl.days * 2 * lvl.cycles;
  var daPrice = 1.00;
  var daReceived = totalNftm / daPrice;
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
          <div style={{ backgroundColor: 'rgba(255,255,255,0.18)', width: '48%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', borderTopLeftRadius: '12px', borderBottomLeftRadius: '12px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#FFFFFF', fontSize: '12px', fontWeight: 700 }}>Mining</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px' }}>
                {lvl.cycles === 1 ? lvl.days + ' days' : '2 × ' + lvl.days + ' days'} — {fmtNum(totalNftm)} NFTM
              </div>
            </div>
          </div>
          <div style={{ backgroundColor: '#ef4444', width: '4%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ color: '#FFFFFF', fontSize: '9px', fontWeight: 900 }}>72h</div>
          </div>
          <div style={{ backgroundColor: 'rgba(255,255,255,0.08)', width: '48%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', borderTopRightRadius: '12px', borderBottomRightRadius: '12px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#FFFFFF', fontSize: '12px', fontWeight: 700 }}>Farming</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px' }}>{lvl.cycles === 1 ? lvl.days + ' days' : '2 × ' + lvl.days + ' days'} — {fmtNum(daReceived)} DA</div>
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

      {/* 3. Your DA Output: Video + Content */}
      <div className="mb-6" style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
        {/* Video */}
        <div style={{ flexShrink: 0, width: '120px', display: 'flex', justifyContent: 'center' }} className="mx-auto sm:mx-0">
          <video autoPlay muted loop playsInline style={{ width: '120px', height: '120px', borderRadius: '12px', objectFit: 'cover' }}>
            <source src="/NFTManimation.webm" type="video/webm" />
          </video>
        </div>
        {/* Content */}
        <div style={{ flex: '1 1 0%', minWidth: '240px' }}>
          <div style={{ backgroundColor: '#383838', border: '1px solid rgba(255,255,255,0.05)' }}
               className="rounded-xl p-5 text-center">
            <div style={{ color: 'rgba(255,255,255,0.4)' }}
                 className="text-[10px] uppercase tracking-wider mb-1">
              You Receive After {totalDays} days
            </div>
            <div style={{ color: '#FFFFFF', fontSize: '36px' }}
                 className="font-black">
              {fmtNum(daReceived)} DA
            </div>
            <div style={{ color: 'rgba(255,255,255,0.5)' }}
                 className="text-xs mt-1">
              Worth {fmtUsd(daReceived * daPrice)} at current DA price
            </div>
            <div style={{ color: 'rgba(255,255,255,0.5)' }}
                 className="text-xs mt-2">
              from {fmtUsd(lvl.price)} investment · {lvl.cycles === 1
                ? 'cycle 1: ' + fmtNum(nftmCycle1) + ' NFTM'
                : 'cycle 1: ' + fmtNum(nftmCycle1) + ' + cycle 2: ' + fmtNum(nftmCycle2) + ' NFTM'
              }
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3" style={{ marginTop: '12px' }}>
        <div style={{ backgroundColor: '#383838', border: '1px solid rgba(255,255,255,0.05)' }}
             className="rounded-xl p-3 text-center">
          <div style={{ color: 'rgba(255,255,255,0.4)' }} className="text-[10px] uppercase tracking-wider mb-1">Investment</div>
          <div style={{ color: '#FFFFFF' }} className="text-base font-bold">{fmtUsd(lvl.price)}</div>
        </div>
        <div style={{ backgroundColor: '#383838', border: '1px solid rgba(255,255,255,0.05)' }}
             className="rounded-xl p-3 text-center">
          <div style={{ color: 'rgba(255,255,255,0.4)' }} className="text-[10px] uppercase tracking-wider mb-1">DA Value</div>
          <div style={{ color: '#FFFFFF' }} className="text-base font-bold">{fmtUsd(daReceived * daPrice)}</div>
        </div>
        <div style={{ backgroundColor: '#383838', border: '1px solid rgba(255,255,255,0.05)' }}
             className="rounded-xl p-3 text-center">
          <div style={{ color: 'rgba(255,255,255,0.4)' }} className="text-[10px] uppercase tracking-wider mb-1">Pipeline</div>
          <div style={{ color: '#FFFFFF' }} className="text-base font-bold">{totalDays} days</div>
        </div>
      </div>
      {lvl.cycles === 1 && (
        <div style={{
          backgroundColor: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.15)',
          marginTop: '12px'
        }} className="rounded-xl p-4 text-center">
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>
            DAO Second cycle (15%) can be activated for this NFT level via DAO voting, increasing total NFTM by {fmtNum(lvl.price * 0.15)}.
          </div>
        </div>
      )}
      <div style={{ color: 'rgba(255,255,255,0.4)' }}
           className="text-xs text-center mt-3">
        Once harvested, compare your options on{' '}
        <a href={'/en/da-selling-lending'}
           style={{ color: '#FFFFFF', textDecoration: 'underline' }}>
          Selling & Lending
        </a>
      </div>

    </div>
  );
};
