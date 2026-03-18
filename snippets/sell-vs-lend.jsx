import { useState } from 'react';

export const SellVsLend = () => {
  const [daAmount, setDaAmount] = useState(1000);
  const [daPrice, setDaPrice] = useState(1.50);
  const [sellMode, setSellMode] = useState('manual');

  const fmtUsd = (n) => {
    const digits = Math.abs(n) >= 10000 ? 0 : 2;
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: digits }).format(n);
  };

  const sellMultiplier = sellMode === 'manual' ? 0.75 : 0.70;
  const sellPayout = (daAmount > 0 && daPrice > 0) ? daAmount * daPrice * sellMultiplier : 0;
  const lendLoanAmount = (daAmount > 0 && daPrice > 0) ? daAmount * daPrice * 0.70 : 0;
  const positionValue = daAmount * daPrice;

  return (
    <div style={{ backgroundColor: '#000000', color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.05)' }} className="p-6 rounded-xl not-prose border">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 style={{ color: '#FFFFFF' }} className="text-lg font-serif italic">Sell vs Lend Decision Tool</h3>
        <span style={{ color: 'rgba(255,255,255,0.6)', backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }} className="text-xs px-3 py-1 rounded-full font-medium">Interactive</span>
      </div>

      {/* Sliders */}
      <div className="space-y-4 mb-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <label style={{ color: 'rgba(255,255,255,0.5)' }} className="text-[10px] font-semibold uppercase tracking-wider">DA Amount</label>
            <span style={{ color: '#FFFFFF' }} className="text-sm font-bold">{daAmount.toLocaleString('en-US')} DA</span>
          </div>
          <input type="range" min="0" max="10000" step="100" value={daAmount}
            onChange={(e) => setDaAmount(Number(e.target.value))}
            className="w-full accent-white"
            style={{ accentColor: 'rgba(255,255,255,0.6)' }} />
        </div>
        <div>
          <div className="flex justify-between items-center mb-2">
            <label style={{ color: 'rgba(255,255,255,0.5)' }} className="text-[10px] font-semibold uppercase tracking-wider">DA Price (USDT)</label>
            <span style={{ color: '#FFFFFF' }} className="text-sm font-bold">${daPrice.toFixed(2)}</span>
          </div>
          <input type="range" min="1.00" max="10.00" step="0.10" value={daPrice}
            onChange={(e) => setDaPrice(Number(e.target.value))}
            className="w-full"
            style={{ accentColor: 'rgba(255,255,255,0.6)' }} />
        </div>
      </div>

      {/* Position Value */}
      <p style={{ color: 'rgba(255,255,255,0.4)' }} className="text-xs mb-4">Position: {fmtUsd(positionValue)}</p>

      {/* Manual / Auto Toggle */}
      <div style={{ backgroundColor: 'rgba(56,56,56,0.7)' }} className="flex rounded-full p-1 mb-6">
        <button onClick={() => setSellMode('manual')}
          style={sellMode === 'manual' ? { backgroundColor: '#FFFFFF', color: '#000000' } : { backgroundColor: 'rgba(56,56,56,0.7)', color: 'rgba(255,255,255,0.5)' }}
          className="flex-1 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all">
          Manual (75%)
        </button>
        <button onClick={() => setSellMode('auto')}
          style={sellMode === 'auto' ? { backgroundColor: '#FFFFFF', color: '#000000' } : { backgroundColor: 'rgba(56,56,56,0.7)', color: 'rgba(255,255,255,0.5)' }}
          className="flex-1 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all">
          Auto (70%)
        </button>
      </div>

      {/* Side-by-Side Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Sell Card */}
        <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.15)' }} className="rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <h4 style={{ color: '#FFFFFF' }} className="text-base font-bold">SELL DA</h4>
            <span style={{ color: '#f87171', backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }} className="ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full">
              {(sellMultiplier * 100).toFixed(0)}% payout
            </span>
          </div>
          <div style={{ color: '#FFFFFF' }} className="text-2xl font-bold mb-1">{fmtUsd(sellPayout)}</div>
          <p style={{ color: 'rgba(255,255,255,0.4)' }} className="text-xs">DA burned permanently</p>
        </div>

        {/* Lend Card */}
        <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.15)' }} className="rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <h4 style={{ color: '#FFFFFF' }} className="text-base font-bold">LEND DA</h4>
            <span style={{ color: '#4ade80', backgroundColor: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }} className="ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full">
              70% LTV
            </span>
          </div>
          <div style={{ color: '#FFFFFF' }} className="text-2xl font-bold mb-1">{fmtUsd(lendLoanAmount)}</div>
          <p style={{ color: 'rgba(255,255,255,0.4)' }} className="text-xs">30-day cutoff · DA preserved</p>
        </div>
      </div>

      {Math.abs(sellPayout - lendLoanAmount) < 0.01 && sellPayout > 0 && (
        <div style={{
          backgroundColor: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          marginTop: '12px'
        }} className="rounded-xl p-4 text-center">
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>
            Auto-sell and Lending return the same USDT amount.
            <span style={{ color: '#4ade80', fontWeight: 600 }}> Lending is always better</span> —
            you keep your DA and benefit from future price growth.
          </div>
        </div>
      )}

      {sellPayout > lendLoanAmount + 0.01 && sellPayout > 0 && (
        <div style={{
          backgroundColor: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          marginTop: '12px'
        }} className="rounded-xl p-4 text-center">
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>
            Manual sell pays <span style={{ color: '#FFFFFF', fontWeight: 600 }}>
            {fmtUsd(sellPayout - lendLoanAmount)} more</span> than Lending —
            but you permanently lose your DA position.
          </div>
        </div>
      )}
    </div>
  );
};
