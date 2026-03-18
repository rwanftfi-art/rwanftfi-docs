import { useState } from 'react';

export const MiningPipeline = () => {
  const [selectedLevel, setSelectedLevel] = useState(5);
  const [currentStep, setCurrentStep] = useState(0);

  const fmtNum = (n) => new Intl.NumberFormat('en-US').format(n);
  const fmtUsd = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(n);

  const MINING_CYCLES = { 5: 45, 6: 44, 7: 43, 8: 42, 9: 41, 10: 40 };
  const LEVEL_NAMES = { 5: 'HYDRO', 6: 'QUANTUM', 7: 'PULSE', 8: 'AURORA', 9: 'FLAME', 10: 'INFINITY' };
  const LEVEL_PRICES = { 5: 550, 6: 1100, 7: 2200, 8: 5500, 9: 11000, 10: 24000 };

  const calcNFTM = (level) => {
    const price = LEVEL_PRICES[level];
    const cycle1 = price * 0.10;
    const cycle2 = level >= 8 ? price * 0.15 : price * 0.10;
    return { cycle1, cycle2, total: cycle1 + cycle2 };
  };

  const UNLOCK_PERIODS = [
    { period: 1, percent: '25%' },
    { period: 2, percent: '40%' },
    { period: 3, percent: '50%' },
    { period: 4, percent: '100%' },
  ];

  const miningDays = MINING_CYCLES[selectedLevel];
  const nftmCalc = calcNFTM(selectedLevel);
  const levelName = LEVEL_NAMES[selectedLevel];
  const levelPrice = LEVEL_PRICES[selectedLevel];

  const STEPS = [
    { icon: '⚡', label: 'Activate', title: 'Activate Mining', desc: `Start mining on your L${selectedLevel} ${levelName} NFT (${fmtUsd(levelPrice)}). Mining cycle duration: ${miningDays} days.` },
    { icon: '⛏', label: 'Mining', title: `Mining NFTM — ${miningDays} Days`, desc: `Your NFT generates NFTM over ${miningDays} days. Cycle 1 produces ${fmtNum(nftmCalc.cycle1)} NFTM (10% of ${fmtUsd(levelPrice)}).` },
    { icon: '⚠', label: '72h Window', title: 'Critical: 72-Hour Claim Window', desc: 'You MUST stake your NFTM within 72 hours! If you miss this window, the entire cycle is lost and you must restart from scratch.', critical: true },
    { icon: '🌱', label: 'Farming', title: `Farming DA — ${miningDays} Days`, desc: `Staked NFTM enters the Farming phase for ${miningDays} days. At the end, NFTM converts to actual DA tokens based on the current DA price.` },
    { icon: '💎', label: 'Complete', title: 'DA Credited to Your TokenStack!', desc: 'Your mining and farming cycles are complete. DA tokens are now in your TokenStack with progressive unlock periods.' },
  ];

  const goNext = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const goBack = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  return (
    <div className="p-6 rounded-xl not-prose bg-[#000000] border border-white/5 dark:bg-white dark:border-zinc-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-serif italic text-white dark:text-zinc-900">Mining → DA Pipeline</h3>
        <span className="text-xs px-3 py-1 rounded-full font-medium bg-white/10 text-white/60 border border-white/20 dark:bg-black/10 dark:text-black/60 dark:border-black/20">Interactive</span>
      </div>

      {/* Level Selector */}
      <div className="mb-6">
        <label className="text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-2 block">Select NFT Level</label>
        <select value={selectedLevel} onChange={(e) => { setSelectedLevel(Number(e.target.value)); setCurrentStep(0); }}
          className="w-full sm:w-auto p-2.5 rounded-xl bg-[#383838] border border-white/5 text-white text-sm font-medium appearance-none cursor-pointer dark:bg-zinc-50 dark:border-zinc-200 dark:text-zinc-900"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M3 5l3 3 3-3' fill='none' stroke='%23A0A0A0' stroke-width='1.5'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', paddingRight: '36px' }}>
          {Object.entries(LEVEL_NAMES).map(([lvl, name]) => (
            <option key={lvl} value={lvl}>L{lvl} — {name} ({fmtUsd(LEVEL_PRICES[lvl])}) — {MINING_CYCLES[lvl]} days</option>
          ))}
        </select>
      </div>

      {/* Step Indicator — circles + connecting line */}
      <div className="relative flex items-center justify-between mb-8 px-2">
        {/* Background line */}
        <div className="absolute top-4 left-6 right-6 h-0.5 bg-[#383838]/70 dark:bg-zinc-200" />
        {/* Progress line */}
        <div className="absolute top-4 left-6 h-0.5 transition-all duration-500"
          style={{ width: `calc(${(currentStep / 4) * 100}% - 48px * ${1 - currentStep / 4})`, background: 'linear-gradient(90deg, rgba(255,255,255,0.6), rgba(255,255,255,1))' }} />
        {STEPS.map((s, i) => {
          const isDone = i < currentStep;
          const isActive = i === currentStep;
          const isCritical = s.critical && isActive;
          return (
            <button key={i} onClick={() => setCurrentStep(i)} className="relative z-10 flex flex-col items-center gap-1.5 group">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                isDone ? 'bg-white dark:bg-black text-black dark:text-white shadow-[0_0_10px_rgba(255,255,255,0.2)]' :
                isActive ? (isCritical ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)] animate-pulse' : 'bg-white dark:bg-black text-black dark:text-white shadow-[0_0_12px_rgba(255,255,255,0.2)]') :
                'bg-[#383838]/70 text-white/40 dark:bg-zinc-200 dark:text-zinc-500'
              }`}>
                {isDone ? '✓' : s.icon}
              </div>
              <span className={`text-[9px] font-semibold text-center leading-tight hidden sm:block ${
                isActive ? (isCritical ? 'text-red-400' : 'text-white dark:text-black') : isDone ? 'text-white dark:text-black' : 'text-white/40'
              }`}>{s.label}</span>
            </button>
          );
        })}
      </div>

      {/* Step Content */}
      <div className={`rounded-xl p-5 mb-6 transition-all duration-300 ${
        STEPS[currentStep].critical
          ? 'bg-red-500/5 border-2 border-red-500/30 dark:bg-red-50 dark:border-red-200'
          : 'bg-[#383838] border border-white/5 dark:bg-zinc-50 dark:border-zinc-200'
      }`}>
        <div className="flex items-start gap-4">
          <span className={`text-3xl flex-shrink-0 ${STEPS[currentStep].critical ? 'animate-pulse' : ''}`}>{STEPS[currentStep].icon}</span>
          <div className="flex-1 min-w-0">
            <h4 className={`text-base font-bold mb-2 ${STEPS[currentStep].critical ? 'text-red-400' : 'text-white dark:text-zinc-900'}`}>
              {STEPS[currentStep].title}
            </h4>
            <p className={`text-sm mb-4 leading-relaxed ${STEPS[currentStep].critical ? 'text-red-300 dark:text-red-600' : 'text-white/40 dark:text-zinc-600'}`}>
              {STEPS[currentStep].desc}
            </p>

            {/* Progress bars for mining/farming steps */}
            {(currentStep === 1 || currentStep === 3) && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-white/40">
                  <span>{currentStep === 1 ? 'Mining' : 'Farming'} Progress</span>
                  <span>{miningDays} days</span>
                </div>
                <div className="h-3 bg-[#383838]/70 dark:bg-zinc-200 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: '100%', background: 'linear-gradient(90deg, rgba(255,255,255,0.4), rgba(255,255,255,0.7))' }} />
                </div>
              </div>
            )}

            {/* 72h critical warning */}
            {currentStep === 2 && (
              <div className="flex items-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg mt-2 dark:bg-red-50 dark:border-red-200">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
                </span>
                <span className="text-xs font-bold text-red-400 dark:text-red-600">
                  WARNING: Missing this 72-hour window means restarting the ENTIRE mining cycle from scratch!
                </span>
              </div>
            )}

            {/* Step 4: Completion — show both cycles */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="text-4xl text-center">✅</div>
                <p className="text-lg font-bold text-white dark:text-black text-center">DA Credited to Your TokenStack!</p>

                {/* NFTM Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="p-3 bg-[#383838]/70 dark:bg-zinc-100 rounded-lg text-center">
                    <div className="text-xs text-white/40 dark:text-zinc-500">Cycle 1 (10%)</div>
                    <div className="text-lg font-bold text-white dark:text-zinc-900">{fmtNum(nftmCalc.cycle1)} NFTM</div>
                  </div>
                  <div className="p-3 bg-[#383838]/70 dark:bg-zinc-100 rounded-lg text-center">
                    <div className="text-xs text-white/40 dark:text-zinc-500">Cycle 2 ({selectedLevel >= 8 ? '15%' : '10%'})</div>
                    <div className="text-lg font-bold text-white dark:text-zinc-900">{fmtNum(nftmCalc.cycle2)} NFTM</div>
                  </div>
                  <div className="p-3 bg-white/10 dark:bg-black/10 rounded-lg text-center border border-white/30 dark:border-black/30">
                    <div className="text-xs text-white dark:text-black">Total NFTM</div>
                    <div className="text-lg font-bold text-white dark:text-black">{fmtNum(nftmCalc.total)} NFTM</div>
                  </div>
                </div>

                <p className="text-sm text-white/40 dark:text-zinc-500 text-center">
                  At initial DA price ($1.00), this converts to approximately <span className="text-white dark:text-zinc-900 font-bold">{fmtNum(nftmCalc.total)} DA</span>
                </p>

                {/* Unlock schedule */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {UNLOCK_PERIODS.map(p => (
                    <div key={p.period} className="p-3 bg-[#383838]/70 dark:bg-zinc-100 rounded-lg text-center">
                      <div className="text-[10px] text-white/40 dark:text-zinc-500">Period {p.period}</div>
                      <div className="text-lg font-bold text-white dark:text-zinc-900">{p.percent}</div>
                      <div className="text-[10px] text-white/40 dark:text-zinc-500">available to sell</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <button onClick={goBack} disabled={currentStep === 0}
          className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${currentStep === 0 ? 'opacity-30 cursor-not-allowed border border-white/5 text-white/40' : 'border border-white/10 text-white hover:border-white/50 hover:shadow-[0_0_10px_rgba(255,255,255,0.15)] dark:border-zinc-300 dark:text-zinc-700'}`}>
          ← Back
        </button>
        <span className="text-xs text-white/40 dark:text-zinc-500">{currentStep + 1} / 5</span>
        <button onClick={goNext} disabled={currentStep === 4}
          className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${currentStep === 4 ? 'opacity-30 cursor-not-allowed bg-[#383838]/70 text-white/40' : 'bg-white dark:bg-black text-black dark:text-white shadow-[0_0_12px_rgba(255,255,255,0.2)] hover:shadow-[0_0_15px_rgba(255,255,255,0.15)]'}`}>
          Next →
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-6">
        <div className="rounded-lg bg-[#383838] border border-white/5 p-3 dark:bg-zinc-50 dark:border-zinc-200">
          <div className="text-[10px] text-white/40 uppercase">Mining Cycle</div>
          <div className="text-base font-bold text-white dark:text-zinc-900">{miningDays} days</div>
        </div>
        <div className="rounded-lg bg-[#383838] border border-white/5 p-3 dark:bg-zinc-50 dark:border-zinc-200">
          <div className="text-[10px] text-white/40 uppercase">NFTM Cycle 1</div>
          <div className="text-base font-bold text-white dark:text-zinc-900">{fmtNum(nftmCalc.cycle1)}</div>
        </div>
        <div className="rounded-lg bg-[#383838] border border-white/5 p-3 dark:bg-zinc-50 dark:border-zinc-200">
          <div className="text-[10px] text-white/40 uppercase">NFTM Cycle 2</div>
          <div className="text-base font-bold text-white dark:text-zinc-900">{fmtNum(nftmCalc.cycle2)}</div>
          {selectedLevel >= 8 && <div className="text-[10px] text-green-500 font-semibold">+5% enhanced</div>}
        </div>
        <div className="rounded-lg bg-[#383838] border border-white/5 p-3 dark:bg-zinc-50 dark:border-zinc-200">
          <div className="text-[10px] text-white/40 uppercase">Total Pipeline</div>
          <div className="text-base font-bold text-white dark:text-zinc-900">~{miningDays * 2 + 3}d</div>
        </div>
      </div>

      <p className="text-xs text-white/40 leading-relaxed mt-4 dark:text-zinc-500">
        Auto-sell triggers if DA is not sold manually before the TokenStack period expires (70% payout vs 75% manual).
        Both mining and farming cycles mirror the same duration ({miningDays} days for {levelName}).
      </p>
    </div>
  );
};
