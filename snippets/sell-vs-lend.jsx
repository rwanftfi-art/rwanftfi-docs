import { useState } from 'react';

export const SellVsLend = () => {
  const [daAmount, setDaAmount] = useState(1000);
  const [daPrice, setDaPrice] = useState(1.00);

  const fmtUsd = (n) => {
    const digits = Math.abs(n) >= 10000 ? 0 : 2;
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: digits }).format(n);
  };

  // SELL (Manual)
  const sellPayout = daAmount * daPrice * 0.75;
  const sellBurned = daAmount * 0.25;

  // LEND — pure 70% LTV, no 5% fee
  const lendBorrow = daAmount * daPrice * 0.70;
  const lendLocked = daAmount;
  const lendAfterRepay = daAmount;

  // Dynamic insight values
  const doubleValue = daAmount * daPrice * 2;

  const sliderStyle = {
    touchAction: 'manipulation',
    height: '6px',
    borderRadius: '3px',
    background: 'linear-gradient(to right, rgba(255,255,255,0.4), rgba(255,255,255,0.15))',
    outline: 'none',
    WebkitAppearance: 'none',
    appearance: 'none',
  };

  return (
    <>
    <style>{`
  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #FFFFFF;
    cursor: pointer;
    border: 2px solid rgba(255,255,255,0.3);
    box-shadow: 0 0 6px rgba(255,255,255,0.2);
  }
  input[type="range"]::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #FFFFFF;
    cursor: pointer;
    border: 2px solid rgba(255,255,255,0.3);
    box-shadow: 0 0 6px rgba(255,255,255,0.2);
  }
  input[type="range"]::-webkit-slider-runnable-track {
    height: 6px;
    border-radius: 3px;
  }
  input[type="range"]::-moz-range-track {
    height: 6px;
    border-radius: 3px;
    background: rgba(255,255,255,0.15);
  }
`}</style>
    <div style={{ backgroundColor: '#000000', color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.05)' }} className="p-6 rounded-xl not-prose border">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 style={{ color: '#FFFFFF' }} className="text-lg font-serif italic">Sell vs Lend</h3>
        <span style={{ color: 'rgba(255,255,255,0.6)', backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }} className="text-xs px-3 py-1 rounded-full font-medium">Interactive</span>
      </div>

      {/* Sliders */}
      <div className="space-y-3 mb-6">
        {/* DA Amount */}
        <div style={{ backgroundColor: '#383838', border: '1px solid rgba(255,255,255,0.05)' }} className="rounded-xl p-4">
          <div className="flex justify-between items-center mb-2">
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>DA Amount</span>
            <span style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: 700 }}>{daAmount.toLocaleString('en-US')} DA</span>
          </div>
          <input type="range" min="100" max="10000" step="100" value={daAmount}
            onChange={(e) => setDaAmount(Number(e.target.value))}
            className="w-full cursor-pointer"
            style={sliderStyle} />
        </div>

        {/* DA Price */}
        <div style={{ backgroundColor: '#383838', border: '1px solid rgba(255,255,255,0.05)' }} className="rounded-xl p-4">
          <div className="flex justify-between items-center mb-2">
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>DA Price</span>
            <span style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: 700 }}>${daPrice.toFixed(2)}</span>
          </div>
          <input type="range" min="1.00" max="100.00" step="0.10" value={daPrice}
            onChange={(e) => setDaPrice(Number(e.target.value))}
            className="w-full cursor-pointer"
            style={sliderStyle} />
        </div>
      </div>

      {/* Two-column comparison cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* SELL Card */}
        <div style={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} className="rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <span style={{ fontSize: '18px' }}>🔥</span>
            <h4 style={{ color: '#FFFFFF' }} className="text-base font-bold">SELL (Manual)</h4>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', marginBottom: '4px' }}>You receive</div>
            <div style={{ color: '#FFFFFF', fontSize: '24px', fontWeight: 700 }}>{fmtUsd(sellPayout)}</div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', marginBottom: '4px' }}>DA burned</div>
            <div style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: 600 }}>{sellBurned.toLocaleString('en-US')} DA (25%)</div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', marginBottom: '4px' }}>Your DA after</div>
            <div style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: 600 }}>0 DA</div>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '12px' }}>
            <div style={{ color: '#EF4444', fontSize: '13px', marginBottom: '6px' }}>✗ Position lost</div>
            <div style={{ color: '#EF4444', fontSize: '13px' }}>✗ No future upside</div>
          </div>

          {/* Auto-sell note */}
          <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px', marginTop: '14px', fontStyle: 'italic' }}>
            Auto-sell (if you miss the window): 70% payout, 30% burned.
          </div>
        </div>

        {/* LEND Card */}
        <div style={{ backgroundColor: '#1F2937', border: '1px solid #2563EB' }} className="rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <span style={{ fontSize: '18px' }}>🏦</span>
            <h4 style={{ color: '#FFFFFF' }} className="text-base font-bold">LEND</h4>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', marginBottom: '4px' }}>You borrow</div>
            <div style={{ color: '#FFFFFF', fontSize: '24px', fontWeight: 700 }}>{fmtUsd(lendBorrow)}</div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', marginBottom: '4px' }}>DA locked</div>
            <div style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: 600 }}>
              {lendLocked.toLocaleString('en-US')} DA <span style={{ color: 'rgba(255,255,255,0.4)' }}>(still yours)</span>
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', marginBottom: '4px' }}>Your DA after repay</div>
            <div style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: 600 }}>{lendAfterRepay.toLocaleString('en-US')} DA</div>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '12px' }}>
            <div style={{ color: '#10B981', fontSize: '13px', marginBottom: '6px' }}>✓ Position kept</div>
            <div style={{ color: '#10B981', fontSize: '13px' }}>✓ Full price exposure</div>
          </div>
        </div>
      </div>

      {/* Insight bar */}
      <div style={{
        backgroundColor: '#1a2332',
        borderLeft: '3px solid #2563EB',
        marginTop: '16px',
        padding: '14px 16px',
        borderRadius: '6px',
      }}>
        <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', lineHeight: '1.6' }}>
          Lending gives you <span style={{ color: '#FFFFFF', fontWeight: 600 }}>{fmtUsd(lendBorrow)}</span> now while keeping all{' '}
          <span style={{ color: '#FFFFFF', fontWeight: 600 }}>{daAmount.toLocaleString('en-US')} DA</span>.
          If price doubles, your DA is worth{' '}
          <span style={{ color: '#FFFFFF', fontWeight: 600 }}>{fmtUsd(doubleValue)}</span> — you keep the upside.
        </div>
      </div>

      {/* Warning bar */}
      <div style={{
        backgroundColor: '#2D1B1B',
        color: '#F87171',
        marginTop: '12px',
        padding: '12px 16px',
        borderRadius: '6px',
        fontSize: '12px',
      }}>
        ⚠ Loan must be repaid within 30 days. If not repaid, your DA collateral may be liquidated.
      </div>
    </div>
    </>
  );
};
