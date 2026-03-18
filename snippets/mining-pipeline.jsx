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
    <div style={{ backgroundColor: '#000000', color: '#FFFFFF' }} className="p-6 rounded-xl not-prose border border-white/5">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 style={{ color: '#FFFFFF' }} className="text-lg font-serif italic">Mining → DA Pipeline</h3>
        <span style={{ color: 'rgba(255,255,255,0.6)', backgroundColor: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.2)' }} className="text-xs px-3 py-1 rounded-full font-medium border">Interactive</span>
      </div>

      {/* Level Selector */}
      <div className="mb-6">
        <label style={{ color: 'rgba(255,255,255,0.5)' }} className="text-[10px] font-semibold uppercase tracking-wider mb-2 block">Select NFT Level</label>
        <select value={selectedLevel} onChange={(e) => { setSelectedLevel(Number(e.target.value)); setCurrentStep(0); }}
          style={{ backgroundColor: '#383838', color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.05)', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M3 5l3 3 3-3' fill='none' stroke='%23A0A0A0' stroke-width='1.5'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', paddingRight: '36px' }}
          className="w-full sm:w-auto p-2.5 rounded-xl text-sm font-medium appearance-none cursor-pointer border">
          {Object.entries(LEVEL_NAMES).map(([lvl, name]) => (
            <option key={lvl} value={lvl}>L{lvl} — {name} ({fmtUsd(LEVEL_PRICES[lvl])}) — {MINING_CYCLES[lvl]} days</option>
          ))}
        </select>
      </div>

      {/* Step Indicator */}
      <div className="relative flex items-center justify-between mb-8 px-2">
        <div style={{ backgroundColor: 'rgba(56,56,56,0.7)' }} className="absolute top-4 left-6 right-6 h-0.5" />
        <div className="absolute top-4 left-6 h-0.5 transition-all duration-500"
          style={{ width: `calc(${(currentStep / 4) * 100}% - 48px * ${1 - currentStep / 4})`, background: 'linear-gradient(90deg, rgba(255,255,255,0.6), rgba(255,255,255,1))' }} />
        {STEPS.map((s, i) => {
          const isDone = i < currentStep;
          const isActive = i === currentStep;
          const isCritical = s.critical && isActive;
          return (
            <button key={i} onClick={() => setCurrentStep(i)} className="relative z-10 flex flex-col items-center gap-1.5 group">
              <div style={
                isDone ? { backgroundColor: '#FFFFFF', color: '#000000', boxShadow: '0 0 10px rgba(255,255,255,0.2)' } :
                isActive ? (isCritical ? { backgroundColor: '#ef4444', color: '#FFFFFF', boxShadow: '0 0 15px rgba(239,68,68,0.5)' } : { backgroundColor: '#FFFFFF', color: '#000000', boxShadow: '0 0 12px rgba(255,255,255,0.2)' }) :
                { backgroundColor: 'rgba(56,56,56,0.7)', color: 'rgba(255,255,255,0.4)' }
              } className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${isCritical && isActive ? 'animate-pulse' : ''}`}>
                {isDone ? '✓' : s.icon}
              </div>
              <span style={
                isActive ? (isCritical ? { color: '#f87171' } : { color: '#FFFFFF' }) :
                isDone ? { color: '#FFFFFF' } :
                { color: 'rgba(255,255,255,0.5)' }
              } className="text-[9px] font-semibold text-center leading-tight hidden sm:block">{s.label}</span>
            </button>
          );
        })}
      </div>

      {/* Step Content */}
      <div style={STEPS[currentStep].critical ? { backgroundColor: 'rgba(239,68,68,0.05)', borderColor: 'rgba(239,68,68,0.3)' } : { backgroundColor: '#383838', borderColor: 'rgba(255,255,255,0.05)' }}
        className={`rounded-xl p-5 mb-6 transition-all duration-300 border ${STEPS[currentStep].critical ? 'border-2' : ''}`}>
        <div className="flex items-start gap-4">
          <span className={`text-3xl flex-shrink-0 ${STEPS[currentStep].critical ? 'animate-pulse' : ''}`}>{STEPS[currentStep].icon}</span>
          <div className="flex-1 min-w-0">
            <h4 style={{ color: STEPS[currentStep].critical ? '#f87171' : '#FFFFFF' }} className="text-base font-bold mb-2">
              {STEPS[currentStep].title}
            </h4>
            <p style={{ color: STEPS[currentStep].critical ? '#fca5a5' : 'rgba(255,255,255,0.5)' }} className="text-sm mb-4 leading-relaxed">
              {STEPS[currentStep].desc}
            </p>

            {/* Progress bars for mining/farming steps */}
            {(currentStep === 1 || currentStep === 3) && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span style={{ color: 'rgba(255,255,255,0.5)' }}>{currentStep === 1 ? 'Mining' : 'Farming'} Progress</span>
                  <span style={{ color: 'rgba(255,255,255,0.5)' }}>{miningDays} days</span>
                </div>
                <div style={{ backgroundColor: 'rgba(56,56,56,0.7)' }} className="h-3 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: '100%', background: 'linear-gradient(90deg, rgba(255,255,255,0.4), rgba(255,255,255,0.7))' }} />
                </div>
              </div>
            )}

            {/* 72h critical warning */}
            {currentStep === 2 && (
              <div style={{ backgroundColor: 'rgba(239,68,68,0.1)', borderColor: 'rgba(239,68,68,0.2)' }} className="flex items-center gap-2 px-4 py-3 rounded-lg mt-2 border">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
                </span>
                <span style={{ color: '#f87171' }} className="text-xs font-bold">
                  WARNING: Missing this 72-hour window means restarting the ENTIRE mining cycle from scratch!
                </span>
              </div>
            )}

            {/* Step 4: Completion */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="text-4xl text-center">✅</div>
                <p style={{ color: '#FFFFFF' }} className="text-lg font-bold text-center">DA Credited to Your TokenStack!</p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div style={{ backgroundColor: 'rgba(56,56,56,0.7)' }} className="p-3 rounded-lg text-center">
                    <div style={{ color: 'rgba(255,255,255,0.4)' }} className="text-xs">Cycle 1 (10%)</div>
                    <div style={{ color: '#FFFFFF' }} className="text-lg font-bold">{fmtNum(nftmCalc.cycle1)} NFTM</div>
                  </div>
                  <div style={{ backgroundColor: 'rgba(56,56,56,0.7)' }} className="p-3 rounded-lg text-center">
                    <div style={{ color: 'rgba(255,255,255,0.4)' }} className="text-xs">Cycle 2 ({selectedLevel >= 8 ? '15%' : '10%'})</div>
                    <div style={{ color: '#FFFFFF' }} className="text-lg font-bold">{fmtNum(nftmCalc.cycle2)} NFTM</div>
                  </div>
                  <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.3)' }} className="p-3 rounded-lg text-center border">
                    <div style={{ color: '#FFFFFF' }} className="text-xs">Total NFTM</div>
                    <div style={{ color: '#FFFFFF' }} className="text-lg font-bold">{fmtNum(nftmCalc.total)} NFTM</div>
                  </div>
                </div>

                <p style={{ color: 'rgba(255,255,255,0.4)' }} className="text-sm text-center">
                  At initial DA price ($1.00), this converts to approximately <span style={{ color: '#FFFFFF' }} className="font-bold">{fmtNum(nftmCalc.total)} DA</span>
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {UNLOCK_PERIODS.map(p => (
                    <div key={p.period} style={{ backgroundColor: 'rgba(56,56,56,0.7)' }} className="p-3 rounded-lg text-center">
                      <div style={{ color: 'rgba(255,255,255,0.4)' }} className="text-[10px]">Period {p.period}</div>
                      <div style={{ color: '#FFFFFF' }} className="text-lg font-bold">{p.percent}</div>
                      <div style={{ color: 'rgba(255,255,255,0.4)' }} className="text-[10px]">available to sell</div>
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
          style={currentStep === 0 ? { color: 'rgba(255,255,255,0.4)', borderColor: 'rgba(255,255,255,0.05)', opacity: 0.3 } : { color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.1)' }}
          className="px-5 py-2 rounded-full text-xs font-semibold transition-all border hover:border-white/50">
          ← Back
        </button>
        <span style={{ color: 'rgba(255,255,255,0.4)' }} className="text-xs">{currentStep + 1} / 5</span>
        <button onClick={goNext} disabled={currentStep === 4}
          style={currentStep === 4 ? { backgroundColor: 'rgba(56,56,56,0.7)', color: 'rgba(255,255,255,0.4)', opacity: 0.3 } : { backgroundColor: '#FFFFFF', color: '#000000', boxShadow: '0 0 12px rgba(255,255,255,0.2)' }}
          className="px-5 py-2 rounded-full text-xs font-semibold transition-all">
          Next →
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-6">
        <div style={{ backgroundColor: '#383838' }} className="rounded-lg border border-white/5 p-3">
          <div style={{ color: 'rgba(255,255,255,0.5)' }} className="text-[10px] uppercase">Mining Cycle</div>
          <div style={{ color: '#FFFFFF' }} className="text-base font-bold">{miningDays} days</div>
        </div>
        <div style={{ backgroundColor: '#383838' }} className="rounded-lg border border-white/5 p-3">
          <div style={{ color: 'rgba(255,255,255,0.5)' }} className="text-[10px] uppercase">NFTM Cycle 1</div>
          <div style={{ color: '#FFFFFF' }} className="text-base font-bold">{fmtNum(nftmCalc.cycle1)}</div>
        </div>
        <div style={{ backgroundColor: '#383838' }} className="rounded-lg border border-white/5 p-3">
          <div style={{ color: 'rgba(255,255,255,0.5)' }} className="text-[10px] uppercase">NFTM Cycle 2</div>
          <div style={{ color: '#FFFFFF' }} className="text-base font-bold">{fmtNum(nftmCalc.cycle2)}</div>
          {selectedLevel >= 8 && <div style={{ color: 'rgba(255,255,255,0.7)' }} className="text-[10px] font-semibold">+5% enhanced</div>}
        </div>
        <div style={{ backgroundColor: '#383838' }} className="rounded-lg border border-white/5 p-3">
          <div style={{ color: 'rgba(255,255,255,0.5)' }} className="text-[10px] uppercase">Total Pipeline</div>
          <div style={{ color: '#FFFFFF' }} className="text-base font-bold">~{miningDays * 2 + 3}d</div>
        </div>
      </div>

      <p style={{ color: 'rgba(255,255,255,0.4)' }} className="text-xs leading-relaxed mt-4">
        Auto-sell triggers if DA is not sold manually before the TokenStack period expires (70% payout vs 75% manual).
        Both mining and farming cycles mirror the same duration ({miningDays} days for {levelName}).
      </p>
    </div>
  );
};
