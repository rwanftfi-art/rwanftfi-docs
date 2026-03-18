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
    if (daAmount <= 0 || daPrice <= 0) return { text: 'Enter DA amount and price to see recommendation.', color: 'text-white/40' };
    if (sellMode === 'auto') return { text: 'Auto-sell and lending yield the same 70% — lending preserves your DA position and benefits from future price growth.', color: 'text-green-400 dark:text-green-600' };
    if (diffPct < 10) return { text: 'Difference is <10%. Lending is likely the better strategy — you keep your DA and benefit from future price appreciation.', color: 'text-green-400 dark:text-green-600' };
    return { text: `Manual sell gives ${fmtUsd(sellVsLendDiff)} more upfront, but burns your DA permanently. Consider if short-term cash outweighs long-term DA appreciation.`, color: 'text-amber-400 dark:text-amber-600' };
  };
  const rec = getRecommendation();

  return (
    <div className="p-6 rounded-xl not-prose bg-[#000000] border border-white/5 dark:bg-white dark:border-zinc-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-serif italic text-white">Sell vs Lend Decision Tool</h3>
        <span className="text-xs px-3 py-1 rounded-full font-medium bg-white/10 text-white/60 border border-white/20 dark:bg-black/10 dark:text-black/60 dark:border-black/20">Interactive</span>
      </div>

      {/* Input Bar */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="flex-1 rounded-xl bg-[#383838] border border-white/5 p-4 dark:bg-zinc-50 dark:border-zinc-200">
          <label className="text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-2 block">DA Amount</label>
          <input type="number" min="0" max="1000000" step="1" value={daAmount}
            onChange={(e) => setDaAmount(Math.max(0, Number(e.target.value)))}
            className="w-full p-3 rounded-lg bg-[#383838]/70 border border-white/5 text-white text-lg font-bold dark:bg-zinc-100 dark:border-zinc-200 dark:text-zinc-900"
            placeholder="1000" />
        </div>
        <div className="flex-1 rounded-xl bg-[#383838] border border-white/5 p-4 dark:bg-zinc-50 dark:border-zinc-200">
          <label className="text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-2 block">Current DA Price (USDT)</label>
          <input type="number" min="0.01" max="10000" step="0.01" value={daPrice}
            onChange={(e) => setDaPrice(Math.max(0.01, Number(e.target.value)))}
            className="w-full p-3 rounded-lg bg-[#383838]/70 border border-white/5 text-white text-lg font-bold dark:bg-zinc-100 dark:border-zinc-200 dark:text-zinc-900"
            placeholder="1.50" />
        </div>

        {/* Sell Mode + Position Value */}
        <div className="flex flex-col gap-3 md:w-56 flex-shrink-0">
          <div className="flex bg-[#383838]/70 dark:bg-zinc-100 rounded-full p-1">
            <button onClick={() => setSellMode('manual')}
              className={`flex-1 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all ${sellMode === 'manual' ? 'bg-red-500 text-white' : 'text-white/40'}`}>
              Manual (75%)
            </button>
            <button onClick={() => setSellMode('auto')}
              className={`flex-1 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all ${sellMode === 'auto' ? 'bg-red-500 text-white' : 'text-white/40'}`}>
              Auto (70%)
            </button>
          </div>
          <div className="rounded-xl bg-[#383838] border border-white/5 p-3 text-center dark:bg-zinc-50 dark:border-zinc-200">
            <div className="text-[10px] text-white/40 uppercase">Position Value</div>
            <div className="text-base font-bold text-white dark:text-zinc-900">{fmtUsd(positionValue)}</div>
          </div>
        </div>
      </div>

      {/* Side-by-Side Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Sell Panel */}
        <div className="rounded-xl border-2 border-red-500/20 bg-red-500/5 p-5 dark:bg-red-50 dark:border-red-200">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">🔥</span>
            <h4 className="text-base font-bold text-red-400 dark:text-red-600">SELL DA</h4>
            <span className="ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 dark:text-red-600">
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
              <div key={i} className="flex justify-between items-center py-2 border-b border-red-500/10 last:border-b-0 dark:border-red-200">
                <span className="text-sm text-red-400/70 dark:text-red-500">{label}</span>
                <span className={`font-bold text-red-400 dark:text-red-600 transition-all duration-300 ${big ? 'text-xl' : 'text-base'}`}>{val}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/10 dark:bg-red-100 dark:border-red-200">
            <span className="text-[11px] text-red-400 dark:text-red-600">⚠ Tokens are permanently burned. You lose your DA position.</span>
          </div>
        </div>

        {/* Lend Panel */}
        <div className="rounded-xl border-2 border-green-500/20 bg-green-500/5 p-5 dark:bg-green-50 dark:border-green-200">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">🏦</span>
            <h4 className="text-base font-bold text-green-400 dark:text-green-600">LEND DA</h4>
            <span className="ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 dark:text-green-600">
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
              <div key={i} className="flex justify-between items-center py-2 border-b border-green-500/10 last:border-b-0 dark:border-green-200">
                <span className="text-sm text-green-400/70 dark:text-green-500">{label}</span>
                <span className={`font-bold text-green-400 dark:text-green-600 transition-all duration-300 ${big ? 'text-xl' : 'text-base'}`}>{val}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 px-3 py-2 rounded-lg bg-green-500/10 border border-green-500/10 dark:bg-green-100 dark:border-green-200">
            <span className="text-[11px] text-green-400 dark:text-green-600">✓ DA stays in your TokenStack. Repay loan to unlock. If not repaid within 30 days, collateral may be liquidated.</span>
          </div>
          {/* FIX 4: Accent when Auto-sell = same 70% as Lend */}
          {sellMode === 'auto' && (
            <div className="mt-2 px-3 py-2 rounded-lg border border-white/20 bg-white/5 dark:border-black/20 dark:bg-black/5">
              <span className="text-[11px] font-semibold text-white/60 dark:text-black/60">
                💡 Same 70% payout as auto-sell — but you keep your DA. Your asset continues to appreciate as others burn tokens.
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Summary Bar */}
      <div className="rounded-xl bg-[#383838] border border-white/5 p-5 dark:bg-zinc-50 dark:border-zinc-200">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <div className="text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-2">Comparison Summary</div>
            <div className="flex items-baseline gap-3 mb-2 flex-wrap">
              <div><span className="text-xs text-red-400 font-medium">Sell:</span> <span className="text-base font-bold text-white dark:text-zinc-900">{fmtUsd(sellCalc.payout)}</span></div>
              <span className="text-white/40">vs</span>
              <div><span className="text-xs text-green-400 font-medium">Lend:</span> <span className="text-base font-bold text-white dark:text-zinc-900">{fmtUsd(lendCalc.loanAmount)}</span></div>
              <span className="text-sm font-semibold text-white/40">Δ {fmtUsd(Math.abs(sellVsLendDiff))} ({diffPct.toFixed(1)}%)</span>
            </div>
            <p className={`text-sm font-medium ${rec.color}`}>{rec.text}</p>
          </div>
          {/* Visual bar */}
          <div className="w-full sm:w-48 flex-shrink-0">
            <div className="text-[10px] text-white/40 mb-1 text-center">Payout comparison</div>
            <div className="flex rounded-full overflow-hidden h-4 bg-[#383838]/70 dark:bg-zinc-200">
              {(() => {
                const total = sellCalc.payout + lendCalc.loanAmount;
                if (total <= 0) return null;
                return (<>
                  <div className="bg-red-500 h-full transition-all duration-300" style={{ width: `${(sellCalc.payout / total) * 100}%` }} />
                  <div className="bg-green-500 h-full transition-all duration-300" style={{ width: `${(lendCalc.loanAmount / total) * 100}%` }} />
                </>);
              })()}
            </div>
            <div className="flex justify-between text-[9px] text-white/40 mt-0.5"><span>Sell</span><span>Lend</span></div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="text-xs text-white/40 leading-relaxed space-y-1 mt-4 dark:text-zinc-500">
        <p>Simplified model — assumes initial supply of 21M DA. Actual values depend on ecosystem activity.</p>
        <p>
          Manual sell: <code className="px-1 bg-[#383838]/70 dark:bg-zinc-200 rounded text-white dark:text-zinc-900">payout = amount × price × 0.75</code> (burn 25%).{' '}
          Auto-sell: <code className="px-1 bg-[#383838]/70 dark:bg-zinc-200 rounded text-white dark:text-zinc-900">payout = amount × price × 0.70</code> (burn 30%).{' '}
          Lend: <code className="px-1 bg-[#383838]/70 dark:bg-zinc-200 rounded text-white dark:text-zinc-900">loan = amount × price × 0.70</code>. Loan cutoff: 30 days.
        </p>
      </div>
    </div>
  );
};
