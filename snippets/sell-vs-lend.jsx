import { useState } from 'react';

export const SellVsLend = () => {
  const [daAmount, setDaAmount] = useState(1000);
  const [currentPrice, setCurrentPrice] = useState(1.00);
  const [futurePrice, setFuturePrice] = useState(2.00);
  const [tab, setTab] = useState('sell');

  const fmtUsd = (n) => {
    const digits = Math.abs(n) >= 10000 ? 0 : 2;
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: digits }).format(n);
  };

  // Sell calculations
  const manualSellPayout = daAmount * currentPrice * 0.75;
  const autoSellPayout = daAmount * futurePrice * 0.70;

  // Lend calculations
  const loanAmount = daAmount * currentPrice * 0.70 * 0.95;
  const futureValue = daAmount * futurePrice;
  const repayHalf = loanAmount / 2;
  const unlockTokens = daAmount / 2;
  const unlockValue = unlockTokens * futurePrice;
  const netPosition = loanAmount - repayHalf + unlockValue;

  // Insight for sell tab
  const autoSellBetter = futurePrice > currentPrice * (75 / 70);
  const sellDifference = Math.abs(autoSellPayout - manualSellPayout);

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
        <h3 style={{ color: '#FFFFFF' }} className="text-lg font-serif italic">Sell vs Lend Strategy Tool</h3>
        <span style={{ color: 'rgba(255,255,255,0.6)', backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }} className="text-xs px-3 py-1 rounded-full font-medium">Interactive</span>
      </div>

      {/* Sliders — each full width */}
      <div className="space-y-3 mb-6">
        {/* DA Amount slider */}
        <div style={{ backgroundColor: '#383838', border: '1px solid rgba(255,255,255,0.05)' }} className="rounded-xl p-4">
          <div className="flex justify-between items-center mb-2">
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>DA Amount</span>
            <span style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: 700 }}>{daAmount.toLocaleString('en-US')} DA</span>
          </div>
          <input type="range" min="0" max="10000" step="100" value={daAmount}
            onChange={(e) => setDaAmount(Number(e.target.value))}
            className="w-full cursor-pointer"
            style={sliderStyle} />
        </div>

        {/* Current Price slider */}
        <div style={{ backgroundColor: '#383838', border: '1px solid rgba(255,255,255,0.05)' }} className="rounded-xl p-4">
          <div className="flex justify-between items-center mb-2">
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>Current DA Price</span>
            <span style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: 700 }}>${currentPrice.toFixed(2)}</span>
          </div>
          <input type="range" min="1.00" max="10.00" step="0.10" value={currentPrice}
            onChange={(e) => setCurrentPrice(Number(e.target.value))}
            className="w-full cursor-pointer"
            style={sliderStyle} />
        </div>

        {/* Future Price slider */}
        <div style={{ backgroundColor: '#383838', border: '1px solid rgba(255,255,255,0.05)' }} className="rounded-xl p-4">
          <div className="flex justify-between items-center mb-2">
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>Expected Price in 4 Months</span>
            <span style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: 700 }}>${futurePrice.toFixed(2)}</span>
          </div>
          <input type="range" min="1.00" max="20.00" step="0.10" value={futurePrice}
            onChange={(e) => setFuturePrice(Number(e.target.value))}
            className="w-full cursor-pointer"
            style={sliderStyle} />
        </div>
      </div>

      {/* Tab Switcher */}
      <div style={{ backgroundColor: 'rgba(56,56,56,0.7)' }} className="flex rounded-full p-1 mb-6">
        <button onClick={() => setTab('sell')}
          style={tab === 'sell' ? { backgroundColor: '#FFFFFF', color: '#000000' } : { backgroundColor: 'transparent', color: 'rgba(255,255,255,0.5)' }}
          className="flex-1 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all">
          SELL DA
        </button>
        <button onClick={() => setTab('lend')}
          style={tab === 'lend' ? { backgroundColor: '#FFFFFF', color: '#000000' } : { backgroundColor: 'transparent', color: 'rgba(255,255,255,0.5)' }}
          className="flex-1 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all">
          LEND DA
        </button>
      </div>

      {/* ===== SELL TAB ===== */}
      {tab === 'sell' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Manual Sell Card */}
            <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.15)' }} className="rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <h4 style={{ color: '#FFFFFF' }} className="text-base font-bold">MANUAL SELL</h4>
                <span style={{ color: '#f87171', backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }} className="ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full">
                  Sell now
                </span>
              </div>
              <div style={{ color: '#FFFFFF' }} className="text-2xl font-bold mb-3">{fmtUsd(manualSellPayout)}</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', marginTop: '8px', lineHeight: '1.6' }}>
                75% payout · At current price · 25% burned
              </div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', marginTop: '4px', lineHeight: '1.6' }}>
                Sell now at current price. You lose DA position.
              </div>
            </div>

            {/* Auto-Sell Card */}
            <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.15)' }} className="rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <h4 style={{ color: '#FFFFFF' }} className="text-base font-bold">AUTO-SELL</h4>
                <span style={{ color: '#fbbf24', backgroundColor: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)' }} className="ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full">
                  Sell at peak
                </span>
              </div>
              <div style={{ color: '#FFFFFF' }} className="text-2xl font-bold mb-3">{fmtUsd(autoSellPayout)}</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', marginTop: '8px', lineHeight: '1.6' }}>
                70% payout · At future price · 30% burned
              </div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', marginTop: '4px', lineHeight: '1.6' }}>
                Sells automatically after TokenStack expires. Price grows over 4 months.
              </div>
            </div>
          </div>

          {/* Sell Insight */}
          {daAmount > 0 && (
            <div style={{
              backgroundColor: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              marginTop: '16px'
            }} className="rounded-xl p-4 text-center">
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>
                {autoSellBetter ? (
                  <>Auto-sell pays <span style={{ color: '#FFFFFF', fontWeight: 600 }}>{fmtUsd(sellDifference)} more</span> despite 30% burn — DA price growth outweighs the extra 5% burn.</>
                ) : (
                  <>At this price projection, manual sell pays <span style={{ color: '#FFFFFF', fontWeight: 600 }}>{fmtUsd(sellDifference)} more</span>.</>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* ===== LEND TAB ===== */}
      {tab === 'lend' && (
        <>
          {/* Step 1: Borrow */}
          <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.15)' }} className="rounded-xl p-5 mb-2">
            <div className="flex items-center gap-2 mb-3">
              <span style={{ color: '#000000', backgroundColor: 'rgba(255,255,255,0.8)' }} className="text-[10px] font-bold px-2 py-0.5 rounded-full">STEP 1</span>
              <h4 style={{ color: '#FFFFFF' }} className="text-sm font-bold">BORROW</h4>
              <span style={{ color: '#4ade80', backgroundColor: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }} className="ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full">
                70% LTV
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span style={{ color: 'rgba(255,255,255,0.5)' }} className="text-xs">Loan received</span>
              <span style={{ color: '#FFFFFF' }} className="text-lg font-bold">{fmtUsd(loanAmount)}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span style={{ color: 'rgba(255,255,255,0.5)' }} className="text-xs">DA locked</span>
              <span style={{ color: 'rgba(255,255,255,0.7)' }} className="text-sm font-medium">{daAmount.toLocaleString('en-US')} DA</span>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.35)' }} className="text-[11px]">Your DA stays locked. You receive USDT loan (minus 5% fee).</p>
          </div>

          {/* Arrow */}
          <div style={{ color: '#4ade80', fontSize: '12px', fontWeight: 600, textAlign: 'center', padding: '8px 0' }}>
            ↓ DA price grows to {fmtUsd(futurePrice)} ↓
          </div>

          {/* Step 2: Partial Repay */}
          <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.15)' }} className="rounded-xl p-5 mb-2">
            <div className="flex items-center gap-2 mb-3">
              <span style={{ color: '#000000', backgroundColor: 'rgba(255,255,255,0.8)' }} className="text-[10px] font-bold px-2 py-0.5 rounded-full">STEP 2</span>
              <h4 style={{ color: '#FFFFFF' }} className="text-sm font-bold">PARTIAL REPAY</h4>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span style={{ color: 'rgba(255,255,255,0.5)' }} className="text-xs">Repay half</span>
              <span style={{ color: '#FFFFFF' }} className="text-lg font-bold">{fmtUsd(repayHalf)}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span style={{ color: 'rgba(255,255,255,0.5)' }} className="text-xs">Unlock</span>
              <span style={{ color: 'rgba(255,255,255,0.7)' }} className="text-sm font-medium">{unlockTokens.toLocaleString('en-US')} DA</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span style={{ color: 'rgba(255,255,255,0.5)' }} className="text-xs">Your {unlockTokens.toLocaleString('en-US')} DA now worth</span>
              <span style={{ color: '#4ade80' }} className="text-sm font-bold">{fmtUsd(unlockValue)}</span>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.35)' }} className="text-[11px]">Repay half the loan → get half your tokens back at NEW price.</p>
          </div>

          {/* Arrow */}
          <div style={{ color: 'rgba(255,255,255,0.3)' }} className="text-center text-xl py-1">↓</div>

          {/* Step 3: Your Profit */}
          <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.15)' }} className="rounded-xl p-5 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <span style={{ color: '#000000', backgroundColor: 'rgba(255,255,255,0.8)' }} className="text-[10px] font-bold px-2 py-0.5 rounded-full">STEP 3</span>
              <h4 style={{ color: '#FFFFFF' }} className="text-sm font-bold">YOUR PROFIT</h4>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span style={{ color: 'rgba(255,255,255,0.5)' }} className="text-xs">Cash received</span>
                <span style={{ color: '#FFFFFF' }} className="text-sm font-bold">{fmtUsd(loanAmount)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span style={{ color: 'rgba(255,255,255,0.5)' }} className="text-xs">Cash repaid</span>
                <span style={{ color: '#f87171' }} className="text-sm font-bold">-{fmtUsd(repayHalf)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span style={{ color: 'rgba(255,255,255,0.5)' }} className="text-xs">DA returned</span>
                <span style={{ color: '#4ade80' }} className="text-sm font-bold">{unlockTokens.toLocaleString('en-US')} DA ({fmtUsd(unlockValue)})</span>
              </div>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '8px', marginTop: '4px' }} className="flex justify-between items-center">
                <span style={{ color: '#FFFFFF' }} className="text-sm font-bold">Net position</span>
                <span style={{ color: '#FFFFFF', fontSize: '24px', fontWeight: 900 }}>{fmtUsd(netPosition)}</span>
              </div>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '12px', paddingTop: '8px' }}>
                <div className="flex justify-between items-center mb-1">
                  <span style={{ color: 'rgba(255,255,255,0.4)' }} className="text-xs">vs just holding</span>
                  <span style={{ color: 'rgba(255,255,255,0.4)' }} className="text-xs">{fmtUsd(futureValue)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span style={{ color: 'rgba(255,255,255,0.4)' }} className="text-xs">vs manual sell</span>
                  <span style={{ color: 'rgba(255,255,255,0.4)' }} className="text-xs">{fmtUsd(manualSellPayout)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Lend Insight */}
          <div style={{
            backgroundColor: 'rgba(34,197,94,0.08)',
            border: '1px solid rgba(34,197,94,0.2)',
          }} className="rounded-xl p-4 text-center mb-3">
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>
              Lending lets you access liquidity <span style={{ color: '#FFFFFF', fontWeight: 600 }}>NOW</span> while keeping exposure to DA price growth.
            </div>
          </div>

          {/* Warning */}
          <div style={{
            backgroundColor: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.2)',
          }} className="rounded-xl p-4 text-center">
            <div style={{ color: '#f87171', fontSize: '11px' }}>
              Loan must be managed within 30 days. If less than 30 days remain before auto-sell, lending is not available.
            </div>
          </div>
        </>
      )}
    </div>
    </>
  );
};
