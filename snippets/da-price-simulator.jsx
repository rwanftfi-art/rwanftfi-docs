import { useState } from 'react';

export const DaPriceSimulator = () => {
  const NFT_DATA = [
    { level: 5,  name: 'HYDRO',    price: 550,   days: 45, c1: 0.10, c2: 0.10 },
    { level: 6,  name: 'QUANTUM',  price: 1100,  days: 44, c1: 0.10, c2: 0.10 },
    { level: 7,  name: 'PULSE',    price: 2200,  days: 43, c1: 0.10, c2: 0.10 },
    { level: 8,  name: 'AURORA',   price: 5500,  days: 42, c1: 0.10, c2: 0.15 },
    { level: 9,  name: 'FLAME',    price: 11000, days: 41, c1: 0.10, c2: 0.15 },
    { level: 10, name: 'INFINITY', price: 24000, days: 40, c1: 0.10, c2: 0.15 },
  ];

  const PRESETS = [
    { label: 'Launch',   burned: 0,        liqBonus: 0 },
    { label: '6 Months', burned: 2100000,  liqBonus: 5000000 },
    { label: '1 Year',   burned: 5250000,  liqBonus: 15000000 },
    { label: 'Mature',   burned: 10500000, liqBonus: 30000000 },
  ];

  const SUPPLY = 21000000;
  const LIQ = 21000000;

  const fmtUsd = (n) => {
    var digits = Math.abs(n) >= 10000 ? 0 : 2;
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: digits }).format(n);
  };
  const fmtNum = (n) => new Intl.NumberFormat('en-US').format(Math.round(n));

  const [activeTab, setActiveTab] = useState('mining');
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [daPrice, setDaPrice] = useState(1.0);
  const [payoutMode, setPayoutMode] = useState('sell');
  const [burnAmount, setBurnAmount] = useState(0);
  const [liquidityInflow, setLiquidityInflow] = useState(0);
  const [activePreset, setActivePreset] = useState(0);

  var nft = NFT_DATA[selectedIdx];
  var totalNftm = nft.price * nft.c1 + nft.price * nft.c2;
  var daReceived = totalNftm / daPrice;
  var holdValue = daReceived * daPrice;
  var sellPayout = daReceived * daPrice * 0.75;
  var lendPayout = daReceived * daPrice * 0.70;
  var pipelineDays = nft.days + nft.days + 3;

  var heroValue = payoutMode === 'sell' ? sellPayout : payoutMode === 'lend' ? lendPayout : holdValue;
  var heroRoi = ((heroValue - nft.price) / nft.price) * 100;
  var heroLabel = payoutMode === 'sell' ? 'MANUAL SELL RETURN' : payoutMode === 'lend' ? 'LENDING RETURN' : 'HOLD VALUE';

  var finalSupply = Math.max(SUPPLY - burnAmount, 1);
  var finalLiquidity = LIQ + liquidityInflow;
  var finalPrice = finalLiquidity / finalSupply;
  var priceChange = ((finalPrice - 1) / 1) * 100;

  var presetPrices = PRESETS.map(function(p) {
    var s = Math.max(SUPPLY - p.burned, 1);
    var l = LIQ + p.liqBonus;
    return l / s;
  });

  var handlePreset = function(idx) {
    setActivePreset(idx);
    setBurnAmount(PRESETS[idx].burned);
    setLiquidityInflow(PRESETS[idx].liqBonus);
  };

  var handleSliderBurn = function(val) {
    setBurnAmount(val);
    setActivePreset(null);
  };
  var handleSliderLiq = function(val) {
    setLiquidityInflow(val);
    setActivePreset(null);
  };

  // SVG chart
  var W = 600, H = 180;
  var padL = 52, padR = 16, padT = 16, padB = 28;
  var cW = W - padL - padR, cH = H - padT - padB;
  var curvePoints = [];
  for (var ci = 0; ci <= 50; ci++) {
    var frac = ci / 50;
    var burned = burnAmount * frac;
    var sup = Math.max(SUPPLY - burned, 1);
    var liq = LIQ + liquidityInflow * frac;
    curvePoints.push({ i: ci, price: liq / sup });
  }
  var curvePrices = curvePoints.map(function(d) { return d.price; });
  var maxP = Math.max.apply(null, curvePrices.concat([1.01]));
  var minP = Math.min.apply(null, curvePrices.concat([0.99]));
  var rangeP = maxP - minP;
  if (rangeP < 0.01) rangeP = 0.01;
  var getX = function(i) { return padL + (i / 50) * cW; };
  var getY = function(p) { return padT + cH - ((p - minP) / rangeP) * cH; };
  var pathParts = [];
  for (var pi = 0; pi < curvePoints.length; pi++) {
    var prefix = pi === 0 ? 'M' : 'L';
    pathParts.push(prefix + ' ' + getX(curvePoints[pi].i).toFixed(1) + ' ' + getY(curvePoints[pi].price).toFixed(1));
  }
  var pathD = pathParts.join(' ');
  var areaD = pathD + ' L ' + getX(50).toFixed(1) + ' ' + (padT + cH) + ' L ' + padL + ' ' + (padT + cH) + ' Z';
  var lastPrice = curvePoints[50].price;

  // All NFTs table data
  var allNfts = NFT_DATA.map(function(d) {
    var tn = d.price * d.c1 + d.price * d.c2;
    var da = tn / daPrice;
    var sr = da * daPrice * 0.75;
    var roi = ((sr - d.price) / d.price) * 100;
    var pl = d.days + d.days + 3;
    return { level: d.level, name: d.name, price: d.price, totalNftm: tn, da: da, sellReturn: sr, roi: roi, pipeline: pl };
  });

  var tabStyle = function(active) {
    return {
      backgroundColor: active ? 'rgba(255,255,255,0.1)' : 'transparent',
      color: active ? '#FFFFFF' : 'rgba(255,255,255,0.4)',
      border: 'none', cursor: 'pointer', padding: '8px 20px',
      fontSize: '13px', fontWeight: active ? 700 : 500,
      borderRadius: '9999px',
    };
  };

  var pillStyle = function(active) {
    return {
      backgroundColor: active ? '#FFFFFF' : 'rgba(56,56,56,0.7)',
      color: active ? '#000000' : 'rgba(255,255,255,0.5)',
      border: 'none', cursor: 'pointer', padding: '6px 16px',
      fontSize: '13px', fontWeight: 600, borderRadius: '9999px',
    };
  };

  var presetBtnStyle = function(active) {
    return {
      backgroundColor: active ? '#FFFFFF' : '#383838',
      color: active ? '#000000' : 'rgba(255,255,255,0.6)',
      border: active ? 'none' : '1px solid rgba(255,255,255,0.1)',
      cursor: 'pointer', padding: '10px 16px', borderRadius: '12px',
      textAlign: 'center', flex: '1 1 0', minWidth: '0',
    };
  };

  // Grid lines for chart
  var gridLines = [];
  for (var gi = 0; gi < 4; gi++) {
    gridLines.push(minP + (rangeP * gi) / 3);
  }

  return (
    <div style={{ backgroundColor: '#000000', color: '#FFFFFF', padding: '24px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }} className="not-prose">
      <div className="flex items-center justify-between" style={{ marginBottom: '24px' }}>
        <h3 style={{ color: '#FFFFFF', fontSize: '18px', fontWeight: 700, margin: 0, fontStyle: 'italic', fontFamily: 'serif' }}>DA Economics Calculator</h3>
        <span style={{ color: 'rgba(255,255,255,0.6)', backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', fontSize: '11px', padding: '4px 12px', borderRadius: '9999px', fontWeight: 500 }}>Interactive</span>
      </div>

      <div className="flex" style={{ gap: '4px', marginBottom: '24px', backgroundColor: '#383838', borderRadius: '9999px', padding: '4px', width: 'fit-content' }}>
        <button style={tabStyle(activeTab === 'mining')} onClick={function() { setActiveTab('mining'); }}>Mining Journey</button>
        <button style={tabStyle(activeTab === 'price')} onClick={function() { setActiveTab('price'); }}>Price Growth</button>
      </div>

      {activeTab === 'mining' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ backgroundColor: '#383838', borderRadius: '12px', padding: '24px' }}>
            <div className="flex flex-col md:flex-row" style={{ gap: '16px', marginBottom: '24px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '6px' }}>NFT Level</label>
                <select
                  value={selectedIdx}
                  onChange={function(e) { setSelectedIdx(Number(e.target.value)); }}
                  style={{ backgroundColor: '#000000', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '8px 12px', fontSize: '14px', width: '100%', cursor: 'pointer', outline: 'none' }}
                >
                  {NFT_DATA.map(function(d, idx) {
                    return <option key={d.level} value={idx}>{'L' + d.level + ' — ' + d.name + ' (' + fmtUsd(d.price) + ')'}</option>;
                  })}
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <div className="flex justify-between" style={{ marginBottom: '6px' }}>
                  <label style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>DA Price</label>
                  <span style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: 700 }}>{'$' + daPrice.toFixed(2)}</span>
                </div>
                <input type="range" min="1.00" max="10.00" step="0.10" value={daPrice}
                  onChange={function(e) { setDaPrice(Number(e.target.value)); }}
                  className="w-full" style={{ height: '6px', cursor: 'pointer', accentColor: '#FFFFFF' }} />
                <div className="flex justify-between" style={{ marginTop: '4px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '10px' }}>$1.00</span>
                  <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '10px' }}>$10.00</span>
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>{heroLabel}</div>
              <div style={{ fontSize: '48px', fontWeight: 900, color: '#FFFFFF', lineHeight: 1.1 }}>
                {fmtUsd(heroValue)}
              </div>
              <div className="flex items-center justify-center" style={{ gap: '12px', marginTop: '12px' }}>
                <span style={{
                  backgroundColor: heroRoi >= 0 ? 'rgba(74,222,128,0.15)' : 'rgba(248,113,113,0.15)',
                  color: heroRoi >= 0 ? '#4ade80' : '#f87171',
                  fontSize: '14px', fontWeight: 700, padding: '4px 16px',
                  borderRadius: '9999px', display: 'inline-block',
                }}>
                  {(heroRoi >= 0 ? '+' : '') + heroRoi.toFixed(1) + '%'}
                </span>
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>{'~' + pipelineDays + ' days'}</span>
              </div>
            </div>

            <div className="flex justify-center" style={{ gap: '8px' }}>
              <button style={pillStyle(payoutMode === 'sell')} onClick={function() { setPayoutMode('sell'); }}>Sell (75%)</button>
              <button style={pillStyle(payoutMode === 'lend')} onClick={function() { setPayoutMode('lend'); }}>Lend (70%)</button>
              <button style={pillStyle(payoutMode === 'hold')} onClick={function() { setPayoutMode('hold'); }}>Hold</button>
            </div>
          </div>

          <div style={{ backgroundColor: '#383838', borderRadius: '12px', padding: '24px' }}>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '20px' }}>Pipeline Timeline</div>
            <div className="hidden md:block">
              <svg viewBox="0 0 700 80" style={{ width: '100%' }}>
                <line x1="60" y1="30" x2="640" y2="30" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
                <text x="210" y="14" textAnchor="middle" fill="rgba(255,255,255,0.6)" style={{ fontSize: '11px' }}>{nft.days + ' days'}</text>
                <text x="390" y="14" textAnchor="middle" fill="#f87171" style={{ fontSize: '11px', fontWeight: 700 }}>72h</text>
                <text x="540" y="14" textAnchor="middle" fill="rgba(255,255,255,0.6)" style={{ fontSize: '11px' }}>{nft.days + ' days'}</text>
                <circle cx="60" cy="30" r="6" fill="#FFFFFF" />
                <text x="60" y="50" textAnchor="middle" fill="rgba(255,255,255,0.8)" style={{ fontSize: '11px', fontWeight: 600 }}>Buy NFT</text>
                <text x="60" y="66" textAnchor="middle" fill="rgba(255,255,255,0.4)" style={{ fontSize: '10px' }}>{fmtUsd(nft.price)}</text>
                <circle cx="320" cy="30" r="6" fill="#FFFFFF" />
                <text x="320" y="50" textAnchor="middle" fill="rgba(255,255,255,0.8)" style={{ fontSize: '11px', fontWeight: 600 }}>Mine Complete</text>
                <text x="320" y="66" textAnchor="middle" fill="rgba(255,255,255,0.4)" style={{ fontSize: '10px' }}>{fmtNum(totalNftm) + ' NFTM'}</text>
                <circle cx="440" cy="30" r="9" fill="#f87171" opacity="0.15" />
                <circle cx="440" cy="30" r="5" fill="#f87171" />
                <text x="440" y="50" textAnchor="middle" fill="rgba(255,255,255,0.8)" style={{ fontSize: '11px', fontWeight: 600 }}>{'Stake & Farm'}</text>
                <text x="440" y="66" textAnchor="middle" fill="#f87171" style={{ fontSize: '10px' }}>72h lock</text>
                <circle cx="640" cy="30" r="7" fill="#FFFFFF" />
                <text x="640" y="50" textAnchor="middle" fill="rgba(255,255,255,0.8)" style={{ fontSize: '11px', fontWeight: 600 }}>DA Harvested</text>
                <text x="640" y="66" textAnchor="middle" fill="rgba(255,255,255,0.4)" style={{ fontSize: '10px' }}>{fmtNum(daReceived) + ' DA'}</text>
              </svg>
            </div>
            <div className="md:hidden">
              {[
                { label: 'Buy NFT', sub: fmtUsd(nft.price), alert: false },
                { label: 'Mining (' + nft.days + ' days)', sub: fmtNum(totalNftm) + ' NFTM', alert: false },
                { label: '72h Lock', sub: 'Mandatory wait', alert: true },
                { label: 'Farm (' + nft.days + ' days)', sub: fmtNum(daReceived) + ' DA', alert: false },
              ].map(function(step, i) {
                return (
                  <div key={i} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', position: 'relative', paddingLeft: '20px' }}>
                    {i < 3 && <div style={{ position: 'absolute', left: '25px', top: '14px', width: '2px', height: '40px', backgroundColor: step.alert ? '#f87171' : 'rgba(255,255,255,0.2)' }} />}
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: step.alert ? '#f87171' : '#FFFFFF', flexShrink: 0, marginTop: '2px' }} />
                    <div style={{ paddingBottom: '20px' }}>
                      <div style={{ color: step.alert ? '#f87171' : 'rgba(255,255,255,0.8)', fontSize: '13px', fontWeight: 600 }}>{step.label}</div>
                      <div style={{ color: step.alert ? '#f87171' : 'rgba(255,255,255,0.4)', fontSize: '11px' }}>{step.sub}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ backgroundColor: '#383838', borderRadius: '12px', padding: '24px' }}>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>{'All Mining NFTs at $' + daPrice.toFixed(2) + ' DA'}</div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr>
                    {['Level', 'Name', 'NFT Cost', 'NFTM', 'DA', 'Sell Return', 'ROI', 'Days'].map(function(h) {
                      return <th key={h} style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '8px 10px', textAlign: 'left', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>{h}</th>;
                    })}
                  </tr>
                </thead>
                <tbody>
                  {allNfts.map(function(row) {
                    var isActive = row.level === nft.level;
                    return (
                      <tr key={row.level} style={{ backgroundColor: isActive ? 'rgba(255,255,255,0.05)' : 'transparent' }}>
                        <td style={{ padding: '10px', color: '#FFFFFF', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{'L' + row.level}</td>
                        <td style={{ padding: '10px', color: '#FFFFFF', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{row.name}</td>
                        <td style={{ padding: '10px', color: '#FFFFFF', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{fmtUsd(row.price)}</td>
                        <td style={{ padding: '10px', color: '#FFFFFF', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{fmtNum(row.totalNftm)}</td>
                        <td style={{ padding: '10px', color: '#FFFFFF', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{fmtNum(row.da) + ' DA'}</td>
                        <td style={{ padding: '10px', color: '#FFFFFF', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{fmtUsd(row.sellReturn)}</td>
                        <td style={{ padding: '10px', color: row.roi >= 0 ? '#4ade80' : '#f87171', fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{(row.roi >= 0 ? '+' : '') + row.roi.toFixed(1) + '%'}</td>
                        <td style={{ padding: '10px', color: 'rgba(255,255,255,0.4)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{row.pipeline}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'price' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ backgroundColor: '#383838', borderRadius: '12px', padding: '24px' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>DA Token Price</div>
              <div style={{ fontSize: '48px', fontWeight: 900, color: '#FFFFFF', lineHeight: 1.1 }}>
                {'$' + finalPrice.toFixed(2)}
              </div>
              {priceChange !== 0 && (
                <div style={{ color: priceChange >= 0 ? '#4ade80' : '#f87171', fontSize: '14px', fontWeight: 600, marginTop: '8px' }}>
                  {(priceChange >= 0 ? '↑' : '↓') + ' ' + Math.abs(priceChange).toFixed(1) + '% from $1.00'}
                </div>
              )}
            </div>
            <div className="flex flex-col sm:flex-row" style={{ gap: '8px' }}>
              {PRESETS.map(function(p, idx) {
                return (
                  <button key={idx} style={presetBtnStyle(activePreset === idx)} onClick={function() { handlePreset(idx); }}>
                    <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.6, marginBottom: '4px' }}>{p.label}</div>
                    <div style={{ fontSize: '18px', fontWeight: 800 }}>{'$' + presetPrices[idx].toFixed(2)}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ backgroundColor: '#383838', borderRadius: '12px', padding: '24px' }}>
            <div className="flex items-center justify-between" style={{ marginBottom: '16px' }}>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Manual Controls</div>
              {activePreset === null && <span style={{ color: '#fbbf24', fontSize: '11px', fontWeight: 600 }}>Custom</span>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '16px' }}>
              <div>
                <div className="flex justify-between" style={{ marginBottom: '8px' }}>
                  <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontWeight: 500 }}>Tokens Burned</label>
                  <span style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: 700 }}>{fmtNum(burnAmount) + ' DA'}</span>
                </div>
                <input type="range" min="0" max="20000000" step="100000" value={burnAmount}
                  onChange={function(e) { handleSliderBurn(Number(e.target.value)); }}
                  className="w-full" style={{ height: '6px', cursor: 'pointer', accentColor: '#FFFFFF' }} />
                <div className="flex justify-between" style={{ marginTop: '4px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '10px' }}>0</span>
                  <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '10px' }}>20M DA</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between" style={{ marginBottom: '8px' }}>
                  <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontWeight: 500 }}>Liquidity Inflow</label>
                  <span style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: 700 }}>{fmtUsd(liquidityInflow)}</span>
                </div>
                <input type="range" min="0" max="50000000" step="500000" value={liquidityInflow}
                  onChange={function(e) { handleSliderLiq(Number(e.target.value)); }}
                  className="w-full" style={{ height: '6px', cursor: 'pointer', accentColor: '#FFFFFF' }} />
                <div className="flex justify-between" style={{ marginTop: '4px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '10px' }}>$0</span>
                  <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '10px' }}>$50M</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: '#383838', borderRadius: '12px', padding: '24px' }}>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>Price Curve</div>
            <svg viewBox={'0 0 ' + W + ' ' + H} style={{ width: '100%' }}>
              <defs>
                <linearGradient id="daPriceGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.01" />
                </linearGradient>
              </defs>
              {gridLines.map(function(val, i) {
                return (
                  <g key={i}>
                    <line x1={padL} y1={getY(val)} x2={W - padR} y2={getY(val)} stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
                    <text x={padL - 6} y={getY(val)} textAnchor="end" dominantBaseline="middle" fill="rgba(255,255,255,0.4)" style={{ fontSize: '9px' }}>{'$' + val.toFixed(2)}</text>
                  </g>
                );
              })}
              <path d={areaD} fill="url(#daPriceGrad)" />
              <path d={pathD} fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx={getX(50)} cy={getY(lastPrice)} r="4" fill="#FFFFFF" stroke="#383838" strokeWidth="2" />
              <text x={getX(50)} y={getY(lastPrice) - 10} textAnchor="middle" fill="#FFFFFF" style={{ fontSize: '10px', fontWeight: 700 }}>{'$' + lastPrice.toFixed(2)}</text>
              <text x={W / 2} y={H - 4} textAnchor="middle" fill="rgba(255,255,255,0.4)" style={{ fontSize: '9px' }}>{'Tokens Burned \u2192'}</text>
            </svg>
          </div>
        </div>
      )}

      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', lineHeight: 1.6, marginTop: '24px', marginBottom: 0 }}>
        Simplified model — actual values depend on ecosystem activity. Price = Liquidity Pool / Circulating Supply. Burns: 25% manual sell, 30% auto-sell. Lending LTV: 70%.
      </p>
    </div>
  );
};
