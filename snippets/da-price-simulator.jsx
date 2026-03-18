import { useState } from 'react';

export const DaPriceSimulator = () => {
  const [activeTab, setActiveTab] = useState('mining');
  const [selectedLevel, setSelectedLevel] = useState(5);
  const [daPrice, setDaPrice] = useState(1.0);
  const [payoutMode, setPayoutMode] = useState('sell');
  const [burnAmount, setBurnAmount] = useState(0);
  const [liquidityInflow, setLiquidityInflow] = useState(0);
  const [activePreset, setActivePreset] = useState(0);

  const NFT_DATA = {
    5:  { name: 'HYDRO',    price: 550,   days: 45, c1: 0.10, c2: 0.10 },
    6:  { name: 'QUANTUM',  price: 1100,  days: 44, c1: 0.10, c2: 0.10 },
    7:  { name: 'PULSE',    price: 2200,  days: 43, c1: 0.10, c2: 0.10 },
    8:  { name: 'AURORA',   price: 5500,  days: 42, c1: 0.10, c2: 0.15 },
    9:  { name: 'FLAME',    price: 11000, days: 41, c1: 0.10, c2: 0.15 },
    10: { name: 'INFINITY', price: 24000, days: 40, c1: 0.10, c2: 0.15 },
  };

  const INITIAL_SUPPLY = 21000000;
  const INITIAL_LIQUIDITY = 21000000;

  const PRESETS = [
    { label: 'Launch',    burned: 0,        liqBonus: 0,        price: 1.00 },
    { label: '6 Months',  burned: 2100000,  liqBonus: 5000000,  price: null },
    { label: '1 Year',    burned: 5250000,  liqBonus: 15000000, price: null },
    { label: 'Mature',    burned: 10500000, liqBonus: 30000000, price: null },
  ];

  const fmtUsd = (n) => {
    const digits = Math.abs(n) >= 10000 ? 0 : 2;
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: digits }).format(n);
  };
  const fmtNum = (n) => new Intl.NumberFormat('en-US').format(Math.round(n));

  const calcPrice = (liquidity, supply) => {
    if (supply <= 0) return 0;
    return liquidity / supply;
  };

  const nft = NFT_DATA[selectedLevel];

  // Mining calculations (inline, no useMemo)
  const cycle1Nftm = nft.price * nft.c1;
  const cycle2Nftm = nft.price * nft.c2;
  const totalNftm = cycle1Nftm + cycle2Nftm;
  const daReceived = totalNftm / daPrice;
  const holdValue = daReceived * daPrice;
  const sellPayout = daReceived * daPrice * 0.75;
  const lendPayout = daReceived * daPrice * 0.70;
  const pipelineDays = nft.days + nft.days + 3;

  const getValue = (mode) => {
    if (mode === 'sell') return sellPayout;
    if (mode === 'lend') return lendPayout;
    return holdValue;
  };

  const getRoi = (mode) => {
    const val = getValue(mode);
    return ((val - nft.price) / nft.price) * 100;
  };

  const heroValue = getValue(payoutMode);
  const heroRoi = getRoi(payoutMode);

  // Price Growth calculations (inline)
  const finalSupply = Math.max(INITIAL_SUPPLY - burnAmount, 1);
  const finalLiquidity = INITIAL_LIQUIDITY + liquidityInflow;
  const finalPrice = calcPrice(finalLiquidity, finalSupply);
  const priceChange = ((finalPrice - 1) / 1) * 100;

  // Compute preset prices
  const presetPrices = PRESETS.map(function(p) {
    if (p.price !== null) return p.price;
    const s = Math.max(INITIAL_SUPPLY - p.burned, 1);
    const l = INITIAL_LIQUIDITY + p.liqBonus;
    return l / s;
  });

  const handlePreset = (idx) => {
    setActivePreset(idx);
    setBurnAmount(PRESETS[idx].burned);
    setLiquidityInflow(PRESETS[idx].liqBonus);
  };

  const handleSliderBurn = (val) => {
    setBurnAmount(val);
    setActivePreset(null);
  };
  const handleSliderLiq = (val) => {
    setLiquidityInflow(val);
    setActivePreset(null);
  };

  // SVG chart data for Price Growth
  const curveData = [];
  const N = 50;
  for (let i = 0; i <= N; i++) {
    const frac = i / N;
    const burned = burnAmount * frac;
    const supply = Math.max(INITIAL_SUPPLY - burned, 1);
    const liq = INITIAL_LIQUIDITY + liquidityInflow * frac;
    curveData.push({ i: i, price: calcPrice(liq, supply) });
  }

  const W = 600, H = 180;
  const PAD = { top: 16, right: 16, bottom: 28, left: 52 };
  const cW = W - PAD.left - PAD.right, cH = H - PAD.top - PAD.bottom;

  // Find max/min without spread
  let maxP = 1.01;
  let minP = 0.99;
  for (let i = 0; i < curveData.length; i++) {
    if (curveData[i].price > maxP) maxP = curveData[i].price;
    if (curveData[i].price < minP) minP = curveData[i].price;
  }
  const rangeP = maxP - minP || 0.01;

  const getX = (i) => PAD.left + (i / 50) * cW;
  const getY = (p) => PAD.top + cH - ((p - minP) / rangeP) * cH;
  const pathD = curveData.map(function(d, i) { return (i === 0 ? 'M' : 'L') + ' ' + getX(d.i).toFixed(1) + ' ' + getY(d.price).toFixed(1); }).join(' ');
  const areaD = pathD + ' L ' + getX(50).toFixed(1) + ' ' + (PAD.top + cH) + ' L ' + PAD.left + ' ' + (PAD.top + cH) + ' Z';
  const lastPt = curveData[curveData.length - 1];

  // All NFTs comparison table
  const allNfts = Object.entries(NFT_DATA).map(function(entry) {
    const lvl = entry[0];
    const d = entry[1];
    const tNftm = d.price * d.c1 + d.price * d.c2;
    const da = tNftm / daPrice;
    const sellReturn = da * daPrice * 0.75;
    const roi = ((sellReturn - d.price) / d.price) * 100;
    const pipeline = d.days + d.days + 3;
    return { level: Number(lvl), name: d.name, price: d.price, days: d.days, c1: d.c1, c2: d.c2, totalNftm: tNftm, da: da, sellReturn: sellReturn, roi: roi, pipeline: pipeline };
  });

  const heroLabel = payoutMode === 'sell' ? 'MANUAL SELL RETURN' : payoutMode === 'lend' ? 'LENDING RETURN' : 'HOLD VALUE';

  const tabStyle = (active) => ({
    backgroundColor: active ? 'rgba(255,255,255,0.1)' : 'transparent',
    color: active ? '#FFFFFF' : 'rgba(255,255,255,0.4)',
    border: 'none',
    cursor: 'pointer',
    padding: '8px 20px',
    fontSize: '13px',
    fontWeight: active ? 700 : 500,
    borderRadius: '9999px',
    transition: 'all 0.2s',
  });

  const pillStyle = (active) => ({
    backgroundColor: active ? '#FFFFFF' : 'rgba(56,56,56,0.7)',
    color: active ? '#000000' : 'rgba(255,255,255,0.5)',
    border: 'none',
    cursor: 'pointer',
    padding: '6px 16px',
    fontSize: '13px',
    fontWeight: 600,
    borderRadius: '9999px',
    transition: 'all 0.2s',
  });

  const presetStyle = (active) => ({
    backgroundColor: active ? '#FFFFFF' : '#383838',
    color: active ? '#000000' : 'rgba(255,255,255,0.6)',
    border: active ? 'none' : '1px solid rgba(255,255,255,0.1)',
    cursor: 'pointer',
    padding: '10px 16px',
    borderRadius: '12px',
    textAlign: 'center',
    transition: 'all 0.2s',
    flex: '1 1 0',
    minWidth: '0',
  });

  return (
    <div style={{ backgroundColor: '#000000', color: '#FFFFFF', padding: '24px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }} className="not-prose">
      {/* Header */}
      <div className="flex items-center justify-between" style={{ marginBottom: '24px' }}>
        <h3 style={{ color: '#FFFFFF', fontSize: '18px', fontWeight: 700, margin: 0, fontStyle: 'italic', fontFamily: 'serif' }}>DA Economics Calculator</h3>
        <span style={{ color: 'rgba(255,255,255,0.6)', backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', fontSize: '11px', padding: '4px 12px', borderRadius: '9999px', fontWeight: 500 }}>Interactive</span>
      </div>

      {/* Tabs */}
      <div className="flex" style={{ gap: '4px', marginBottom: '24px', backgroundColor: '#383838', borderRadius: '9999px', padding: '4px', width: 'fit-content' }}>
        <button style={tabStyle(activeTab === 'mining')} onClick={() => setActiveTab('mining')}>Mining Journey</button>
        <button style={tabStyle(activeTab === 'price')} onClick={() => setActiveTab('price')}>Price Growth</button>
      </div>

      {/* TAB 1: MINING JOURNEY */}
      {activeTab === 'mining' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Hero Block */}
          <div style={{ backgroundColor: '#383838', borderRadius: '12px', padding: '24px' }}>
            {/* Inputs row */}
            <div className="flex flex-col md:flex-row" style={{ gap: '16px', marginBottom: '24px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '6px' }}>NFT Level</label>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(Number(e.target.value))}
                  style={{ backgroundColor: '#000000', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '8px 12px', fontSize: '14px', width: '100%', cursor: 'pointer', outline: 'none' }}
                >
                  {Object.entries(NFT_DATA).map(function(entry) {
                    const lvl = entry[0];
                    const d = entry[1];
                    return <option key={lvl} value={lvl}>L{lvl} — {d.name} ({fmtUsd(d.price)})</option>;
                  })}
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <div className="flex justify-between" style={{ marginBottom: '6px' }}>
                  <label style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>DA Price</label>
                  <span style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: 700 }}>${daPrice.toFixed(2)}</span>
                </div>
                <input
                  type="range" min="1.00" max="10.00" step="0.10"
                  value={daPrice}
                  onChange={(e) => setDaPrice(Number(e.target.value))}
                  className="w-full"
                  style={{ height: '6px', cursor: 'pointer', accentColor: '#FFFFFF' }}
                />
                <div className="flex justify-between" style={{ marginTop: '4px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '10px' }}>$1.00</span>
                  <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '10px' }}>$10.00</span>
                </div>
              </div>
            </div>

            {/* Hero Number */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>{heroLabel}</div>
              <div style={{ fontSize: '48px', fontWeight: 900, color: '#FFFFFF', lineHeight: 1.1 }} className="md:text-5xl text-4xl">
                {fmtUsd(heroValue)}
              </div>
              <div className="flex items-center justify-center" style={{ gap: '12px', marginTop: '12px' }}>
                <span style={{
                  backgroundColor: heroRoi >= 0 ? 'rgba(74,222,128,0.15)' : 'rgba(248,113,113,0.15)',
                  color: heroRoi >= 0 ? '#4ade80' : '#f87171',
                  fontSize: '14px',
                  fontWeight: 700,
                  padding: '4px 16px',
                  borderRadius: '9999px',
                  display: 'inline-block',
                }}>
                  {heroRoi >= 0 ? '+' : ''}{heroRoi.toFixed(1)}%
                </span>
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>~{pipelineDays} days</span>
              </div>
            </div>

            {/* Payout mode pills */}
            <div className="flex justify-center" style={{ gap: '8px' }}>
              <button style={pillStyle(payoutMode === 'sell')} onClick={() => setPayoutMode('sell')}>Sell (75%)</button>
              <button style={pillStyle(payoutMode === 'lend')} onClick={() => setPayoutMode('lend')}>Lend (70%)</button>
              <button style={pillStyle(payoutMode === 'hold')} onClick={() => setPayoutMode('hold')}>Hold</button>
            </div>
          </div>

          {/* Timeline */}
          <div style={{ backgroundColor: '#383838', borderRadius: '12px', padding: '24px' }}>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '20px' }}>Pipeline Timeline</div>

            {/* Desktop horizontal timeline */}
            <div className="hidden md:block">
              <svg viewBox="0 0 700 90" style={{ width: '100%' }}>
                <line x1="60" y1="35" x2="640" y2="35" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
                <text x="210" y="16" textAnchor="middle" fill="rgba(255,255,255,0.6)" style={{ fontSize: '11px' }}>{nft.days} days</text>
                <text x="390" y="16" textAnchor="middle" fill="#f87171" style={{ fontSize: '11px', fontWeight: 700 }}>72h</text>
                <text x="540" y="16" textAnchor="middle" fill="rgba(255,255,255,0.6)" style={{ fontSize: '11px' }}>{nft.days} days</text>
                <circle cx="60" cy="35" r="6" fill="#FFFFFF" />
                <text x="60" y="56" textAnchor="middle" fill="rgba(255,255,255,0.8)" style={{ fontSize: '11px', fontWeight: 600 }}>Buy NFT</text>
                <text x="60" y="72" textAnchor="middle" fill="rgba(255,255,255,0.4)" style={{ fontSize: '10px' }}>{fmtUsd(nft.price)}</text>
                <circle cx="320" cy="35" r="6" fill="#FFFFFF" />
                <text x="320" y="56" textAnchor="middle" fill="rgba(255,255,255,0.8)" style={{ fontSize: '11px', fontWeight: 600 }}>Mine Complete</text>
                <text x="320" y="72" textAnchor="middle" fill="rgba(255,255,255,0.4)" style={{ fontSize: '10px' }}>{fmtNum(totalNftm)} NFTM</text>
                <circle cx="440" cy="35" r="9" fill="#f87171" opacity="0.15" />
                <circle cx="440" cy="35" r="5" fill="#f87171" />
                <text x="440" y="56" textAnchor="middle" fill="rgba(255,255,255,0.8)" style={{ fontSize: '11px', fontWeight: 600 }}>Stake {'&'} Farm</text>
                <text x="440" y="72" textAnchor="middle" fill="#f87171" style={{ fontSize: '10px' }}>72h lock</text>
                <circle cx="640" cy="35" r="7" fill="#FFFFFF" />
                <text x="640" y="56" textAnchor="middle" fill="rgba(255,255,255,0.8)" style={{ fontSize: '11px', fontWeight: 600 }}>DA Harvested</text>
                <text x="640" y="72" textAnchor="middle" fill="rgba(255,255,255,0.4)" style={{ fontSize: '10px' }}>{fmtNum(daReceived)} DA</text>
              </svg>
            </div>

            {/* Mobile vertical timeline */}
            <div className="md:hidden" style={{ display: 'flex', flexDirection: 'column', gap: '0', paddingLeft: '20px' }}>
              {[
                { label: 'Buy NFT', sub: fmtUsd(nft.price), isAlert: false },
                { label: 'Mining (' + nft.days + ' days)', sub: fmtNum(totalNftm) + ' NFTM', isAlert: false },
                { label: '72h Lock', sub: 'Mandatory wait', isAlert: true },
                { label: 'Farm (' + nft.days + ' days)', sub: fmtNum(daReceived) + ' DA', isAlert: false },
              ].map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', position: 'relative' }}>
                  {i < 3 && <div style={{ position: 'absolute', left: '5px', top: '14px', width: '2px', height: '40px', backgroundColor: step.isAlert ? '#f87171' : 'rgba(255,255,255,0.2)' }} />}
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: step.isAlert ? '#f87171' : '#FFFFFF', flexShrink: 0, marginTop: '2px' }} />
                  <div style={{ paddingBottom: '20px' }}>
                    <div style={{ color: step.isAlert ? '#f87171' : 'rgba(255,255,255,0.8)', fontSize: '13px', fontWeight: 600 }}>{step.label}</div>
                    <div style={{ color: step.isAlert ? '#f87171' : 'rgba(255,255,255,0.4)', fontSize: '11px' }}>{step.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Comparison Table */}
          <div style={{ backgroundColor: '#383838', borderRadius: '12px', padding: '24px' }}>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>All Mining NFTs at ${daPrice.toFixed(2)} DA</div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr>
                    {['Level', 'Name', 'NFT Cost', 'Total NFTM', 'DA', 'Sell Return', 'ROI', 'Days'].map((h) => (
                      <th key={h} style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '8px 10px', textAlign: 'left', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {allNfts.map((row) => (
                    <tr key={row.level} style={{ backgroundColor: row.level === selectedLevel ? 'rgba(255,255,255,0.05)' : 'transparent', transition: 'background-color 0.2s' }}>
                      <td style={{ padding: '10px', color: '#FFFFFF', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>L{row.level}</td>
                      <td style={{ padding: '10px', color: '#FFFFFF', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{row.name}</td>
                      <td style={{ padding: '10px', color: '#FFFFFF', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{fmtUsd(row.price)}</td>
                      <td style={{ padding: '10px', color: '#FFFFFF', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{fmtNum(row.totalNftm)}</td>
                      <td style={{ padding: '10px', color: '#FFFFFF', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{fmtNum(row.da)} DA</td>
                      <td style={{ padding: '10px', color: '#FFFFFF', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{fmtUsd(row.sellReturn)}</td>
                      <td style={{ padding: '10px', color: row.roi >= 0 ? '#4ade80' : '#f87171', fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{row.roi >= 0 ? '+' : ''}{row.roi.toFixed(1)}%</td>
                      <td style={{ padding: '10px', color: 'rgba(255,255,255,0.4)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{row.pipeline}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRICE GROWTH */}
      {activeTab === 'price' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Hero Price + Presets */}
          <div style={{ backgroundColor: '#383838', borderRadius: '12px', padding: '24px' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>DA Token Price</div>
              <div style={{ fontSize: '48px', fontWeight: 900, color: '#FFFFFF', lineHeight: 1.1 }} className="md:text-5xl text-4xl">
                ${finalPrice.toFixed(2)}
              </div>
              {priceChange !== 0 && (
                <div style={{ color: priceChange >= 0 ? '#4ade80' : '#f87171', fontSize: '14px', fontWeight: 600, marginTop: '8px' }}>
                  {priceChange >= 0 ? '↑' : '↓'} {Math.abs(priceChange).toFixed(1)}% from $1.00
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row" style={{ gap: '8px' }}>
              {PRESETS.map((p, idx) => (
                <button key={idx} style={presetStyle(activePreset === idx)} onClick={() => handlePreset(idx)}>
                  <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.6, marginBottom: '4px' }}>{p.label}</div>
                  <div style={{ fontSize: '18px', fontWeight: 800 }}>${presetPrices[idx].toFixed(2)}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Manual sliders */}
          <div style={{ backgroundColor: '#383838', borderRadius: '12px', padding: '24px' }}>
            <div className="flex items-center justify-between" style={{ marginBottom: '16px' }}>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Manual Controls</div>
              {activePreset === null && <span style={{ color: '#fbbf24', fontSize: '11px', fontWeight: 600 }}>Custom</span>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '16px' }}>
              <div>
                <div className="flex justify-between" style={{ marginBottom: '8px' }}>
                  <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontWeight: 500 }}>Tokens Burned</label>
                  <span style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: 700 }}>{fmtNum(burnAmount)} DA</span>
                </div>
                <input type="range" min="0" max="20000000" step="100000" value={burnAmount}
                  onChange={(e) => handleSliderBurn(Number(e.target.value))}
                  className="w-full"
                  style={{ height: '6px', cursor: 'pointer', accentColor: '#FFFFFF' }}
                />
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
                  onChange={(e) => handleSliderLiq(Number(e.target.value))}
                  className="w-full"
                  style={{ height: '6px', cursor: 'pointer', accentColor: '#FFFFFF' }}
                />
                <div className="flex justify-between" style={{ marginTop: '4px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '10px' }}>$0</span>
                  <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '10px' }}>$50M</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mini SVG chart */}
          <div style={{ backgroundColor: '#383838', borderRadius: '12px', padding: '24px' }}>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>Price Curve</div>
            <svg viewBox={'0 0 ' + W + ' ' + H} style={{ width: '100%' }}>
              <defs>
                <linearGradient id="daPriceGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.01" />
                </linearGradient>
              </defs>
              {[0, 1, 2, 3].map(function(i) {
                const val = minP + (rangeP * i) / 3;
                return (
                  <g key={i}>
                    <line x1={PAD.left} y1={getY(val)} x2={W - PAD.right} y2={getY(val)} stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
                    <text x={PAD.left - 6} y={getY(val)} textAnchor="end" dominantBaseline="middle" fill="rgba(255,255,255,0.4)" style={{ fontSize: '9px' }}>${val.toFixed(2)}</text>
                  </g>
                );
              })}
              <path d={areaD} fill="url(#daPriceGrad)" />
              <path d={pathD} fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx={getX(50)} cy={getY(lastPt.price)} r="4" fill="#FFFFFF" stroke="#383838" strokeWidth="2" />
              <text x={getX(50)} y={getY(lastPt.price) - 10} textAnchor="middle" fill="#FFFFFF" style={{ fontSize: '10px', fontWeight: 700 }}>${lastPt.price.toFixed(2)}</text>
              <text x={W / 2} y={H - 4} textAnchor="middle" fill="rgba(255,255,255,0.4)" style={{ fontSize: '9px' }}>Tokens Burned</text>
            </svg>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', lineHeight: 1.6, marginTop: '24px', marginBottom: 0 }}>
        Simplified model — actual values depend on ecosystem activity.
        Price = Liquidity Pool / Circulating Supply.
        Burns: 25% manual sell, 30% auto-sell. Lending LTV: 70%.
      </p>
    </div>
  );
};
