import { useState } from 'react';
import { useT } from '/snippets/i18n.js';

export const SellVsLend = () => {
  const t = useT();
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
        <h3 style={{ color: '#FFFFFF' }} className="text-lg font-serif italic">{t('sellVsLend')}</h3>
        <span style={{ color: 'rgba(255,255,255,0.6)', backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }} className="text-xs px-3 py-1 rounded-full font-medium">{t('interactive')}</span>
      </div>

      {/* Sliders — each full width */}
      <div className="space-y-3 mb-6">
        {/* DA Amount slider */}
        <div style={{ backgroundColor: '#383838', border: '1px solid rgba(255,255,255,0.05)' }} className="rounded-xl p-4">
          <div className="flex justify-between items-center mb-2">
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>{t('daAmount')}</span>
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
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>{t('currentDaPrice')}</span>
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
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>{t('expectedPrice')}</span>
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
          {t('sellDa')}
        </button>
        <button onClick={() => setTab('lend')}
          style={tab === 'lend' ? { backgroundColor: '#FFFFFF', color: '#000000' } : { backgroundColor: 'transparent', color: 'rgba(255,255,255,0.5)' }}
          className="flex-1 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all">
          {t('lendDa')}
        </button>
      </div>

      {/* ===== SELL TAB ===== */}
      {tab === 'sell' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Manual Sell Card */}
            <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.15)' }} className="rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <h4 style={{ color: '#FFFFFF' }} className="text-base font-bold">{t('manualSell').toUpperCase()}</h4>
                <span style={{ color: '#f87171', backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }} className="ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full">
                  {t('sellNow')}
                </span>
              </div>
              <div style={{ color: '#FFFFFF' }} className="text-2xl font-bold mb-3">{fmtUsd(manualSellPayout)}</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', marginTop: '8px', lineHeight: '1.6' }}>
                {t('manualSellDesc')}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', marginTop: '4px', lineHeight: '1.6' }}>
                {t('manualSellDesc2')}
              </div>
            </div>

            {/* Auto-Sell Card */}
            <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.15)' }} className="rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <h4 style={{ color: '#FFFFFF' }} className="text-base font-bold">{t('autoSell').toUpperCase()}</h4>
                <span style={{ color: '#fbbf24', backgroundColor: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)' }} className="ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full">
                  {t('sellAtPeak')}
                </span>
              </div>
              <div style={{ color: '#FFFFFF' }} className="text-2xl font-bold mb-3">{fmtUsd(autoSellPayout)}</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', marginTop: '8px', lineHeight: '1.6' }}>
                {t('autoSellDesc')}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', marginTop: '4px', lineHeight: '1.6' }}>
                {t('autoSellDesc2')}
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
                  <>{t('autoSellPaysMore')} <span style={{ color: '#FFFFFF', fontWeight: 600 }}>{fmtUsd(sellDifference)} {t('more')}</span> {t('despite30burn')}</>
                ) : (
                  <>{t('manualSellPaysMore')} <span style={{ color: '#FFFFFF', fontWeight: 600 }}>{fmtUsd(sellDifference)} {t('more')}</span>.</>
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
            <div className="flex items-center mb-4">
              <div style={{
                backgroundColor: 'rgba(255,255,255,0.15)',
                width: '28px', height: '28px',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '13px', fontWeight: 700, color: '#FFFFFF',
                flexShrink: 0
              }}>1</div>
              <span style={{ color: '#FFFFFF', fontSize: '15px', fontWeight: 700, marginLeft: '10px' }}>{t('borrow')}</span>
              <span style={{ color: '#4ade80', backgroundColor: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }} className="ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full">
                {t('ltv70')}
              </span>
            </div>
            <div style={{ color: '#FFFFFF', fontSize: '28px', fontWeight: 900 }}>{fmtUsd(loanAmount)}</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginTop: '4px' }}>{t('usdtLoan')}</div>
            <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', marginTop: '8px' }}>{t('daLocked')}: {daAmount.toLocaleString('en-US')} DA</div>
          </div>

          {/* Connector: Step 1 → Step 2 */}
          <div style={{ textAlign: 'center', padding: '4px 0' }}>
            <div style={{
              width: '1px', height: '16px',
              backgroundColor: 'rgba(255,255,255,0.15)',
              margin: '0 auto'
            }} />
            <div style={{
              color: '#4ade80', fontSize: '11px', fontWeight: 600,
              padding: '4px 12px',
              backgroundColor: 'rgba(74,222,128,0.08)',
              borderRadius: '9999px',
              display: 'inline-block'
            }}>
              {t('daPriceGrowsTo')} {fmtUsd(futurePrice)}
            </div>
            <div style={{
              width: '1px', height: '16px',
              backgroundColor: 'rgba(255,255,255,0.15)',
              margin: '0 auto'
            }} />
          </div>

          {/* Step 2: Partial Repay */}
          <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.15)' }} className="rounded-xl p-5 mb-2">
            <div className="flex items-center mb-4">
              <div style={{
                backgroundColor: 'rgba(255,255,255,0.15)',
                width: '28px', height: '28px',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '13px', fontWeight: 700, color: '#FFFFFF',
                flexShrink: 0
              }}>2</div>
              <span style={{ color: '#FFFFFF', fontSize: '15px', fontWeight: 700, marginLeft: '10px' }}>{t('partialRepay').toUpperCase()}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', marginBottom: '4px' }}>{t('payBack').toUpperCase()}</div>
                <div style={{ color: '#FFFFFF', fontSize: '20px', fontWeight: 700 }}>{fmtUsd(repayHalf)}</div>
              </div>
              <div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', marginBottom: '4px' }}>{t('getBack').toUpperCase()}</div>
                <div style={{ color: '#4ade80', fontSize: '20px', fontWeight: 700 }}>{unlockTokens.toLocaleString('en-US')} DA</div>
                <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px' }}>worth {fmtUsd(unlockValue)}</div>
              </div>
            </div>
          </div>

          {/* Connector: Step 2 → Step 3 */}
          <div style={{ textAlign: 'center', padding: '4px 0' }}>
            <div style={{
              width: '1px', height: '24px',
              backgroundColor: 'rgba(255,255,255,0.15)',
              margin: '0 auto'
            }} />
          </div>

          {/* Step 3: Your Profit */}
          <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.15)' }} className="rounded-xl p-5 mb-4">
            <div className="flex items-center mb-4">
              <div style={{
                backgroundColor: 'rgba(255,255,255,0.15)',
                width: '28px', height: '28px',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '13px', fontWeight: 700, color: '#FFFFFF',
                flexShrink: 0
              }}>3</div>
              <span style={{ color: '#FFFFFF', fontSize: '15px', fontWeight: 700, marginLeft: '10px' }}>{t('yourProfit').toUpperCase()}</span>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#FFFFFF', fontSize: '36px', fontWeight: 900 }}>{fmtUsd(netPosition)}</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', marginTop: '4px' }}>{t('netPosition')}</div>
            </div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '16px' }} />
            <div className="grid grid-cols-3 gap-3 text-center" style={{ marginTop: '12px' }}>
              <div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px' }}>{t('netPosition').toUpperCase()}</div>
                <div style={{ color: '#4ade80', fontSize: '16px', fontWeight: 700 }}>{fmtUsd(netPosition)}</div>
              </div>
              <div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px' }}>{t('vsHold').toUpperCase()}</div>
                <div style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: 700 }}>{fmtUsd(futureValue)}</div>
              </div>
              <div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px' }}>{t('vsSellNow').toUpperCase()}</div>
                <div style={{ color: '#f87171', fontSize: '16px', fontWeight: 700 }}>{fmtUsd(manualSellPayout)}</div>
              </div>
            </div>
          </div>

          {/* Lend Insight */}
          <div style={{
            backgroundColor: 'rgba(34,197,94,0.08)',
            border: '1px solid rgba(34,197,94,0.2)',
          }} className="rounded-xl p-4 text-center mb-3">
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>
              {t('lendInsight')} <span style={{ color: '#FFFFFF', fontWeight: 600 }}>{t('now')}</span> {t('keepExposure')}
            </div>
          </div>

          {/* Warning */}
          <div style={{
            backgroundColor: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.2)',
            marginTop: '12px',
          }} className="rounded-xl p-4 text-center">
            <div style={{ color: '#f87171', fontSize: '11px' }}>
              {t('loanWarning')}
            </div>
          </div>
        </>
      )}
    </div>
    </>
  );
};
