import { useState, useMemo } from 'react';

export const SellVsLend = () => {
  const [daAmount, setDaAmount] = useState(1000);
  const [daPrice, setDaPrice] = useState(1.50);
  const [sellMode, setSellMode] = useState('manual');

  const CURRENT_SUPPLY = 21_000_000;

  const fmtUsd = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(n);
  const fmtNum = (n) => new Intl.NumberFormat('en-US').format(Math.round(n));

  const sellMultiplier = sellMode === 'manual' ? 0.75 : 0.70;

  const sellCalc = useMemo(() => {
    if (daAmount <= 0 || daPrice <= 0) return { payout: 0, burned: 0, newPrice: 0, priceIncrease: 0 };
    const payout = daAmount * daPrice * sellMultiplier;
    const burned = daAmount;
    const currentLiquidity = CURRENT_SUPPLY * daPrice;
    const newLiquidity = currentLiquidity - payout;
    const newSupply = CURRENT_SUPPLY - burned;
    const newPrice = newSupply > 0 ? newLiquidity / newSupply : 0;
    const priceIncrease = daPrice > 0 ? ((newPrice - daPrice) / daPrice) * 100 : 0;
    return { payout, burned, newPrice, priceIncrease };
  }, [daAmount, daPrice, sellMultiplier]);

  const lendCalc = useMemo(() => {
    if (daAmount <= 0 || daPrice <= 0) return { loanAmount: 0, collateral: 0, deadline: 30 };
    const loanAmount = daAmount * daPrice * 0.70;
    return { loanAmount, collateral: daAmount, deadline: 30 };
  }, [daAmount, daPrice]);

  const positionValue = daAmount * daPrice;
  const sellVsLendDiff = sellCalc.payout - lendCalc.loanAmount;
  const diffPct = lendCalc.loanAmount > 0 ? Math.abs(sellVsLendDiff / lendCalc.loanAmount) * 100 : 0;

  const getRecommendation = () => {
    if (daAmount <= 0 || daPrice <= 0) return { text: 'Enter DA amount and price to see recommendation.', style: { color: 'rgba(255,255,255,0.4)' } };
    if (sellMode === 'auto') return { text: 'Auto-sell and lending yield the same 70% — lending preserves your DA position and benefits from future price growth.', style: { color: '#4ade80' } };
    if (diffPct < 10) return { text: 'Difference is <10%. Lending is likely the better strategy — you keep your DA and benefit from future price appreciation.', style: { color: '#4ade80' } };
    return { text: `Manual sell gives ${fmtUsd(sellVsLendDiff)} more upfront, but burns your DA permanently. Consider if short-term cash outweighs long-term DA appreciation.`, style: { color: '#fbbf24' } };
  };
  const rec = getRecommendation();

  return (
    <div style={{ backgroundColor: '#000000', color: '#FFFFFF' }} className="p-6 rounded-xl not-prose border border-white/5">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 style={{ color: '#FFFFFF' }} className="text-lg font-serif italic">Sell vs Lend Decision Tool</h3>
        <span style={{ color: 'rgba(255,255,255,0.6)', backgroundColor: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.2)' }} className="text-xs px-3 py-1 rounded-full font-medium border">Interactive</span>
      </div>

      {/* Input Bar */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div style={{ backgroundColor: '#383838' }} className="flex-1 rounded-xl border border-white/5 p-4">
          <label style={{ color: 'rgba(255,255,255,0.5)' }} className="text-[10px] font-semibold uppercase tracking-wider mb-2 block">DA Amount</label>
          <input type="number" min="0" max="1000000" step="1" value={daAmount}
            onChange={(e) => setDaAmount(Math.max(0, Number(e.target.value)))}
            style={{ backgroundColor: 'rgba(56,56,56,0.7)', color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.05)' }}
            className="w-full p-3 rounded-lg text-lg font-bold border"
            placeholder="1000" />
        </div>
        <div style={{ backgroundColor: '#383838' }} className="flex-1 rounded-xl border border-white/5 p-4">
          <label style={{ color: 'rgba(255,255,255,0.5)' }} className="text-[10px] font-semibold uppercase tracking-wider mb-2 block">Current DA Price (USDT)</label>
          <input type="number" min="0.01" max="10000" step="0.01" value={daPrice}
            onChange={(e) => setDaPrice(Math.max(0.01, Number(e.target.value)))}
            style={{ backgroundColor: 'rgba(56,56,56,0.7)', color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.05)' }}
            className="w-full p-3 rounded-lg text-lg font-bold border"
            placeholder="1.50" />
        </div>

        {/* Sell Mode + Position Value */}
        <div className="flex flex-col gap-3 md:w-56 flex-shrink-0">
          <div style={{ backgroundColor: 'rgba(56,56,56,0.7)' }} className="flex rounded-full p-1">
            <button onClick={() => setSellMode('manual')}
              style={sellMode === 'manual' ? { backgroundColor: '#ef4444', color: '#FFFFFF' } : { color: 'rgba(255,255,255,0.5)' }}
              className="flex-1 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all">
              Manual (75%)
            </button>
            <button onClick={() => setSellMode('auto')}
              style={sellMode === 'auto' ? { backgroundColor: '#ef4444', color: '#FFFFFF' } : { color: 'rgba(255,255,255,0.5)' }}
              className="flex-1 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all">
              Auto (70%)
            </button>
          </div>
          <div style={{ backgroundColor: '#383838' }} className="rounded-xl border border-white/5 p-3 text-center">
            <div style={{ color: 'rgba(255,255,255,0.5)' }} className="text-[10px] uppercase">Position Value</div>
            <div style={{ color: '#FFFFFF' }} className="text-base font-bold">{fmtUsd(positionValue)}</div>
          </div>
        </div>
      </div>

      {/* Side-by-Side Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Sell Panel */}
        <div style={{ backgroundColor: 'rgba(239,68,68,0.05)', borderColor: 'rgba(239,68,68,0.2)' }} className="rounded-xl border-2 p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">🔥</span>
            <h4 style={{ color: '#f87171' }} className="text-base font-bold">SELL DA</h4>
            <span style={{ color: '#f87171', backgroundColor: 'rgba(239,68,68,0.1)', borderColor: 'rgba(239,68,68,0.2)' }} className="ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full border">
              {sellMode === 'manual' ? 'Manual' : 'Auto'} — {(sellMultiplier * 100).toFixed(0)}% payout
            </span>
          </div>
          <div className="space-y-3">
            {[
              ['USDT Received', fmtUsd(sellCalc.payout), true],
              ['DA Burned', `${fmtNum(sellCalc.burned)} DA`, false],
              ['New DA Price', fmtUsd(sellCalc.newPrice), false],
              ['Price Change', `${sellCalc.priceIncrease >= 0 ? '+' : ''}${sellCalc.priceIncrease.toFixed(2)}%`, false],
            ].map(([label, val, big], i) => (
              <div key={i} style={{ borderBottom: '1px solid rgba(239,68,68,0.1)' }} className="flex justify-between items-center py-2 last:border-b-0">
                <span style={{ color: 'rgba(248,113,113,0.7)' }} className="text-sm">{label}</span>
                <span style={{ color: '#f87171' }} className={`font-bold transition-all duration-300 ${big ? 'text-xl' : 'text-base'}`}>{val}</span>
              </div>
            ))}
          </div>
          <div style={{ backgroundColor: 'rgba(239,68,68,0.1)', borderColor: 'rgba(239,68,68,0.1)' }} className="mt-4 px-3 py-2 rounded-lg border">
            <span style={{ color: '#f87171' }} className="text-[11px]">⚠ Tokens are permanently burned. You lose your DA position.</span>
          </div>
        </div>

        {/* Lend Panel */}
        <div style={{ backgroundColor: 'rgba(34,197,94,0.05)', borderColor: 'rgba(34,197,94,0.2)' }} className="rounded-xl border-2 p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">🏦</span>
            <h4 style={{ color: '#4ade80' }} className="text-base font-bold">LEND DA</h4>
            <span style={{ color: '#4ade80', backgroundColor: 'rgba(34,197,94,0.1)', borderColor: 'rgba(34,197,94,0.2)' }} className="ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full border">
              70% LTV
            </span>
          </div>
          <div className="space-y-3">
            {[
              ['USDT Loan', fmtUsd(lendCalc.loanAmount), true],
              ['DA Collateral', `${fmtNum(lendCalc.collateral)} DA (locked)`, false],
              ['Loan Deadline', `${lendCalc.deadline} days`, false],
              ['DA Position', '✓ Preserved', false],
            ].map(([label, val, big], i) => (
              <div key={i} style={{ borderBottom: '1px solid rgba(34,197,94,0.1)' }} className="flex justify-between items-center py-2 last:border-b-0">
                <span style={{ color: 'rgba(74,222,128,0.7)' }} className="text-sm">{label}</span>
                <span style={{ color: '#4ade80' }} className={`font-bold transition-all duration-300 ${big ? 'text-xl' : 'text-base'}`}>{val}</span>
              </div>
            ))}
          </div>
          <div style={{ backgroundColor: 'rgba(34,197,94,0.1)', borderColor: 'rgba(34,197,94,0.1)' }} className="mt-4 px-3 py-2 rounded-lg border">
            <span style={{ color: '#4ade80' }} className="text-[11px]">✓ DA stays in your TokenStack. Repay loan to unlock. If not repaid within 30 days, collateral may be liquidated.</span>
          </div>
          {sellMode === 'auto' && (
            <div style={{ borderColor: 'rgba(255,255,255,0.2)', backgroundColor: 'rgba(255,255,255,0.05)' }} className="mt-2 px-3 py-2 rounded-lg border">
              <span style={{ color: 'rgba(255,255,255,0.6)' }} className="text-[11px] font-semibold">
                💡 Same 70% payout as auto-sell — but you keep your DA. Your asset continues to appreciate as others burn tokens.
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Summary Bar */}
      <div style={{ backgroundColor: '#383838' }} className="rounded-xl border border-white/5 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <div style={{ color: 'rgba(255,255,255,0.5)' }} className="text-[10px] font-semibold uppercase tracking-wider mb-2">Comparison Summary</div>
            <div className="flex items-baseline gap-3 mb-2 flex-wrap">
              <div><span style={{ color: '#f87171' }} className="text-xs font-medium">Sell:</span> <span style={{ color: '#FFFFFF' }} className="text-base font-bold">{fmtUsd(sellCalc.payout)}</span></div>
              <span style={{ color: 'rgba(255,255,255,0.5)' }}>vs</span>
              <div><span style={{ color: '#4ade80' }} className="text-xs font-medium">Lend:</span> <span style={{ color: '#FFFFFF' }} className="text-base font-bold">{fmtUsd(lendCalc.loanAmount)}</span></div>
              <span style={{ color: 'rgba(255,255,255,0.5)' }} className="text-sm font-semibold">Δ {fmtUsd(Math.abs(sellVsLendDiff))} ({diffPct.toFixed(1)}%)</span>
            </div>
            <p style={rec.style} className="text-sm font-medium">{rec.text}</p>
          </div>
          {/* Visual bar */}
          <div className="w-full sm:w-48 flex-shrink-0">
            <div style={{ color: 'rgba(255,255,255,0.5)' }} className="text-[10px] mb-1 text-center">Payout comparison</div>
            <div style={{ backgroundColor: 'rgba(56,56,56,0.7)' }} className="flex rounded-full overflow-hidden h-4">
              {(() => {
                const total = sellCalc.payout + lendCalc.loanAmount;
                if (total <= 0) return null;
                return (<>
                  <div className="h-full transition-all duration-300" style={{ width: `${(sellCalc.payout / total) * 100}%`, backgroundColor: '#ef4444' }} />
                  <div className="h-full transition-all duration-300" style={{ width: `${(lendCalc.loanAmount / total) * 100}%`, backgroundColor: '#22c55e' }} />
                </>);
              })()}
            </div>
            <div className="flex justify-between text-[9px] mt-0.5"><span style={{ color: 'rgba(255,255,255,0.5)' }}>Sell</span><span style={{ color: 'rgba(255,255,255,0.5)' }}>Lend</span></div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div style={{ color: 'rgba(255,255,255,0.4)' }} className="text-xs leading-relaxed space-y-1 mt-4">
        <p>Simplified model — assumes initial supply of 21M DA. Actual values depend on ecosystem activity.</p>
        <p>
          Manual sell: <code style={{ backgroundColor: 'rgba(56,56,56,0.7)', color: '#FFFFFF' }} className="px-1 rounded">payout = amount × price × 0.75</code> (burn 25%).{' '}
          Auto-sell: <code style={{ backgroundColor: 'rgba(56,56,56,0.7)', color: '#FFFFFF' }} className="px-1 rounded">payout = amount × price × 0.70</code> (burn 30%).{' '}
          Lend: <code style={{ backgroundColor: 'rgba(56,56,56,0.7)', color: '#FFFFFF' }} className="px-1 rounded">loan = amount × price × 0.70</code>. Loan cutoff: 30 days.
        </p>
      </div>
    </div>
  );
};
