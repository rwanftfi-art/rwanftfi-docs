import { useState, useEffect, useRef } from 'react';

export const FrozenBalanceSimulator = ({ lang }) => {
  if (typeof window === 'undefined') { return null; }

  var L = lang === 'ru' ? 'ru' : 'en';

  var T = {
    en: {
      title: 'Frozen Balance Simulator',
      interactive: 'Interactive',
      yourNft: 'Your NFT',
      yourNftHint: 'Your current Income Limit',
      inviteeNft: "Invitee's First NFT",
      inviteeNftHint: 'First purchase by direct personal invitee',
      commission: 'Sponsor Commission',
      commissionHint: '30% of NFT price (first purchase)',
      remaining: 'Your Remaining Income Limit',
      remainingHint: 'Available room before compression',
      triggerOff: 'No freeze — commission fits in your limit',
      triggerOffSub: 'Full amount credited immediately under the standard 75 / 20 / 5 split.',
      triggerOn: 'Frozen Balance triggered',
      triggerOnSub: 'Excess above your limit is held for 72 hours while you decide.',
      immediate: 'Credited immediately',
      immediateHint: 'Within your Income Limit · 75 / 20 / 5 split',
      frozen: 'Frozen for 72 h',
      frozenHint: 'Excess above your Income Limit',
      lostHeader: 'Standard split applied to the credited part',
      reg: 'Regular Balance',
      acc: 'Accumulative Balance',
      pool: 'DA Liquidity Pool',
      regHint: 'Withdraw anytime',
      accHint: 'Decay timer',
      poolHint: 'New DA minting',
      timerHeader: '72-hour window',
      timerSub: 'Choose how the freeze resolves',
      tabUpgrade: 'Upgrade NFT',
      tabAutobuy: 'Autobuy fires',
      tabForfeit: 'Miss deadline',
      upgradeTitle: 'You upgrade to a higher tier',
      upgradeBody: 'Frozen funds are released and credited under the same 75 / 20 / 5 split. The released amount is deducted from the new NFT\'s Income Limit.',
      upgradeChoose: 'Pick the NFT you upgrade to',
      upgradeReleased: 'Frozen amount released',
      upgradeNewLimit: 'New NFT Income Limit',
      upgradeRemaining: 'Remaining limit after release',
      upgradeImpossible: 'Pick a tier above your current NFT — and at least the invitee\'s tier — to absorb the frozen amount in full.',
      autobuyTitle: 'Autobuy fires first and refreshes your limit',
      autobuyBody: 'Autobuy repurchases the same-level NFT before the commission is applied. The freshly refreshed Income Limit absorbs the commission first; only the leftover (if any) goes into Frozen Balance.',
      autobuyRefreshed: 'Refreshed Income Limit',
      autobuyAbsorbed: 'Absorbed by autobuy',
      autobuyLeftover: 'Still goes to freeze',
      autobuyNote: 'If your own NFT and refreshed limit are sufficient, Frozen Balance never activates.',
      forfeitTitle: 'You miss the 72-hour window',
      forfeitBody: 'The frozen amount is permanently forfeited and split between the DA Liquidity Pool and your upline sponsor.',
      forfeitPool: 'To DA Liquidity Pool',
      forfeitSponsor: 'To upline sponsor',
      forfeitCascade: 'If your upline sponsor has zero Income Limit, the 30% cascades upward to the next active sponsor. If no upline has an active limit, 100% routes to the DA Liquidity Pool.',
      footerNote: 'Frozen Balance applies only to the first purchase of each direct personal invitee. Repeat purchases that exceed your limit go to Lost Income via standard compression.',
      noFreezeFooter: 'Increase the invitee\'s NFT level — or pick a smaller NFT for yourself — to see the freeze trigger.',
      hours: 'h',
      level: 'L',
    },
    ru: {
      title: 'Симулятор Frozen Balance',
      interactive: 'Интерактив',
      yourNft: 'Ваш NFT',
      yourNftHint: 'Текущий Лимит дохода',
      inviteeNft: 'Первый NFT личника',
      inviteeNftHint: 'Первая покупка прямого приглашённого',
      commission: 'Спонсорская комиссия',
      commissionHint: '30% от цены NFT (первая покупка)',
      remaining: 'Ваш оставшийся Лимит',
      remainingHint: 'Запас перед компрессией',
      triggerOff: 'Фриз не сработал — комиссия укладывается в Лимит',
      triggerOffSub: 'Вся сумма зачисляется сразу по стандарту 75 / 20 / 5.',
      triggerOn: 'Frozen Balance активирован',
      triggerOnSub: 'Излишек над Лимитом удерживается 72 часа — пока вы принимаете решение.',
      immediate: 'Зачисляется сразу',
      immediateHint: 'В рамках вашего Лимита · распределение 75 / 20 / 5',
      frozen: 'Заморожено на 72 ч',
      frozenHint: 'Излишек над вашим Лимитом',
      lostHeader: 'Стандартное распределение зачисленной части',
      reg: 'Обычный баланс',
      acc: 'Накопительный баланс',
      pool: 'Пул ликвидности DA',
      regHint: 'Вывод в любой момент',
      accHint: 'Таймер распада',
      poolHint: 'Минтинг нового DA',
      timerHeader: '72-часовое окно',
      timerSub: 'Выберите, как разрешится фриз',
      tabUpgrade: 'Апгрейд NFT',
      tabAutobuy: 'Автопокупка',
      tabForfeit: 'Пропуск дедлайна',
      upgradeTitle: 'Вы апгрейдите NFT на более высокий уровень',
      upgradeBody: 'Замороженные средства высвобождаются и зачисляются по тому же распределению 75 / 20 / 5. Высвобожденная сумма списывается с Лимита нового NFT.',
      upgradeChoose: 'Выберите NFT, на который апгрейдитесь',
      upgradeReleased: 'Высвобождено из фриза',
      upgradeNewLimit: 'Лимит нового NFT',
      upgradeRemaining: 'Остаток Лимита после высвобождения',
      upgradeImpossible: 'Выберите уровень выше текущего — и не ниже уровня личника — чтобы вместить замороженную сумму.',
      autobuyTitle: 'Сначала срабатывает автопокупка и обновляет Лимит',
      autobuyBody: 'Автопокупка переоткупает NFT того же уровня до того, как применяется комиссия. Новый Лимит сначала впитывает комиссию, и только остаток (если есть) уходит во фриз.',
      autobuyRefreshed: 'Обновлённый Лимит дохода',
      autobuyAbsorbed: 'Поглощено автопокупкой',
      autobuyLeftover: 'Уходит во фриз',
      autobuyNote: 'Если вашего NFT и обновлённого Лимита достаточно — Frozen Balance не активируется вовсе.',
      forfeitTitle: 'Вы пропустили 72-часовой дедлайн',
      forfeitBody: 'Замороженная сумма окончательно теряется и делится между Пулом ликвидности DA и вышестоящим спонсором.',
      forfeitPool: 'В Пул ликвидности DA',
      forfeitSponsor: 'Спонсору в апплайн',
      forfeitCascade: 'Если у спонсора Лимит дохода ноль — 30% передаются дальше вверх по цепочке до первого активного спонсора. Если ни у кого в апплайне нет активного Лимита — все 100% уходят в Пул ликвидности DA.',
      footerNote: 'Frozen Balance работает только на первую покупку каждого прямого приглашённого. Повторные покупки сверх Лимита уходят в Lost Income по стандартной компрессии.',
      noFreezeFooter: 'Поднимите уровень NFT личника — или возьмите меньший NFT для себя — чтобы увидеть срабатывание фриза.',
      hours: 'ч',
      level: 'L',
    }
  }[L];

  var NFT_DATA = [
    { level: 1,  name: 'GENESIS',  price: 28,    limit: 75,    tier: 'Basic'   },
    { level: 2,  name: 'ADVANCE',  price: 55,    limit: 160,   tier: 'Basic'   },
    { level: 3,  name: 'ASCEND',   price: 140,   limit: 375,   tier: 'Basic'   },
    { level: 4,  name: 'ECLIPSE',  price: 275,   limit: 650,   tier: 'Basic'   },
    { level: 5,  name: 'HYDRO',    price: 550,   limit: 1400,  tier: 'Premium' },
    { level: 6,  name: 'QUANTUM',  price: 1100,  limit: 2700,  tier: 'Premium' },
    { level: 7,  name: 'PULSE',    price: 2200,  limit: 5800,  tier: 'Premium' },
    { level: 8,  name: 'AURORA',   price: 5500,  limit: 12800, tier: 'Premium' },
    { level: 9,  name: 'FLAME',    price: 11000, limit: 28000, tier: 'Elite'   },
    { level: 10, name: 'INFINITY', price: 24000, limit: 70000, tier: 'Elite'   },
  ];

  var fmtUsd = function(n) {
    var digits = Math.abs(n) >= 1000 ? 0 : 2;
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: digits }).format(n);
  };

  var [yourLevel, setYourLevel] = useState(2);
  var [inviteeLevel, setInviteeLevel] = useState(7);
  var [scenario, setScenario] = useState('upgrade');
  var [upgradeLevel, setUpgradeLevel] = useState(7);
  var [hour, setHour] = useState(18);
  var hourRef = useRef(null);

  // Animate the 72h clock
  useEffect(function() {
    if (hourRef.current) clearInterval(hourRef.current);
    hourRef.current = setInterval(function() {
      setHour(function(h) {
        var next = h + 1;
        if (next > 72) return 0;
        return next;
      });
    }, 700);
    return function() { if (hourRef.current) clearInterval(hourRef.current); };
  }, []);

  var yourNft = NFT_DATA[yourLevel - 1];
  var inviteeNft = NFT_DATA[inviteeLevel - 1];
  var commission = inviteeNft.price * 0.30;
  var inLimit = Math.min(commission, yourNft.limit);
  var frozen = Math.max(commission - yourNft.limit, 0);
  var triggered = frozen > 0;

  // Keep upgrade selection useful
  useEffect(function() {
    if (upgradeLevel <= yourLevel) {
      var next = Math.min(yourLevel + 1, 10);
      setUpgradeLevel(next);
    }
  }, [yourLevel]);

  var upgradeNft = NFT_DATA[upgradeLevel - 1];
  var upgradeRemaining = Math.max(upgradeNft.limit - frozen, 0);
  var upgradeCovers = upgradeNft.limit >= frozen && upgradeLevel > yourLevel;

  // Autobuy: refresh = same-level limit; absorbs commission first
  var refreshedLimit = yourNft.limit;
  var autobuyAbsorbed = Math.min(commission, refreshedLimit);
  var autobuyLeftover = Math.max(commission - refreshedLimit, 0);

  // Forfeit
  var forfeitPool = frozen * 0.70;
  var forfeitSponsor = frozen * 0.30;

  // Tier badge color
  var tierColor = function(t) {
    if (t === 'Elite') return { color: '#fbbf24', bg: 'rgba(251,191,36,0.15)', border: 'rgba(251,191,36,0.4)' };
    if (t === 'Premium') return { color: '#FFFFFF', bg: 'rgba(255,255,255,0.12)', border: 'rgba(255,255,255,0.3)' };
    return { color: '#FFFFFF', bg: 'rgba(255,255,255,0.08)', border: 'rgba(255,255,255,0.18)' };
  };

  var nftSelectStyle = {
    backgroundColor: 'rgba(56,56,56,0.7)',
    color: '#FFFFFF',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    padding: '8px 28px 8px 10px',
    fontSize: '13px',
    fontWeight: 600,
    width: '100%',
    outline: 'none',
    cursor: 'pointer',
    WebkitAppearance: 'none',
    appearance: 'none',
    backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'10\' height=\'6\'%3E%3Cpath d=\'M0 0l5 6 5-6z\' fill=\'%23999\'/%3E%3C/svg%3E")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 10px center',
  };

  var tabStyle = function(name) {
    var active = scenario === name;
    return {
      flex: '1 1 0%',
      minWidth: '120px',
      padding: '10px 12px',
      borderRadius: '10px',
      fontSize: '12px',
      fontWeight: 700,
      cursor: 'pointer',
      transition: 'all 0.2s',
      backgroundColor: active ? '#FFFFFF' : 'rgba(56,56,56,0.7)',
      color: active ? '#000000' : 'rgba(255,255,255,0.7)',
      border: active ? '1px solid rgba(255,255,255,0.3)' : '1px solid rgba(255,255,255,0.05)',
    };
  };

  // Clock geometry
  var clockSize = 140;
  var clockR = 56;
  var clockCx = clockSize / 2;
  var clockCy = clockSize / 2;
  var hourFrac = hour / 72;
  var hourAngle = -Math.PI / 2 + hourFrac * Math.PI * 2;
  var hourX = clockCx + clockR * 0.78 * Math.cos(hourAngle);
  var hourY = clockCy + clockR * 0.78 * Math.sin(hourAngle);

  // Build sweep arc up to current hour
  var sweepEndX = clockCx + clockR * Math.cos(hourAngle);
  var sweepEndY = clockCy + clockR * Math.sin(hourAngle);
  var largeArc = hourFrac > 0.5 ? 1 : 0;
  var sweepPath = 'M ' + clockCx + ' ' + (clockCy - clockR) +
    ' A ' + clockR + ' ' + clockR + ' 0 ' + largeArc + ' 1 ' +
    sweepEndX + ' ' + sweepEndY +
    ' L ' + clockCx + ' ' + clockCy + ' Z';

  var pulseKf = '@keyframes fbPulse{0%,100%{opacity:0.55;transform:scale(1)}50%{opacity:1;transform:scale(1.08)}}@keyframes fbFlow{0%{stroke-dashoffset:24}100%{stroke-dashoffset:0}}';

  var youColor = tierColor(yourNft.tier);
  var inviteeColor = tierColor(inviteeNft.tier);

  return (
    <div style={{ backgroundColor: '#000000', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.05)' }} className="p-6 rounded-xl not-prose">
      <style>{pulseKf}</style>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 style={{ color: '#FFFFFF', margin: 0 }} className="text-lg font-serif italic">{T.title}</h3>
        <span style={{ color: 'rgba(255,255,255,0.6)', backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', fontSize: '11px', padding: '4px 12px', borderRadius: '9999px', fontWeight: 500 }}>{T.interactive}</span>
      </div>

      {/* NFT Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        {/* Your NFT */}
        <div style={{ backgroundColor: '#383838', border: '1px solid rgba(255,255,255,0.05)' }} className="rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{T.yourNft}</label>
            <span style={{ color: youColor.color, backgroundColor: youColor.bg, border: '1px solid ' + youColor.border, fontSize: '9px', padding: '2px 8px', borderRadius: '9999px', fontWeight: 700, textTransform: 'uppercase' }}>{yourNft.tier}</span>
          </div>
          <select value={yourLevel} onChange={function(e) { setYourLevel(Number(e.target.value)); }} style={nftSelectStyle}>
            {NFT_DATA.map(function(n) {
              return <option key={n.level} value={n.level}>{T.level + n.level + ' — ' + n.name + ' · ' + fmtUsd(n.limit)}</option>;
            })}
          </select>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', marginTop: '6px' }}>{T.yourNftHint}: <span style={{ color: '#FFFFFF', fontWeight: 700 }}>{fmtUsd(yourNft.limit)}</span></div>
        </div>

        {/* Invitee's First NFT */}
        <div style={{ backgroundColor: '#383838', border: '1px solid rgba(255,255,255,0.05)' }} className="rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{T.inviteeNft}</label>
            <span style={{ color: inviteeColor.color, backgroundColor: inviteeColor.bg, border: '1px solid ' + inviteeColor.border, fontSize: '9px', padding: '2px 8px', borderRadius: '9999px', fontWeight: 700, textTransform: 'uppercase' }}>{inviteeNft.tier}</span>
          </div>
          <select value={inviteeLevel} onChange={function(e) { setInviteeLevel(Number(e.target.value)); }} style={nftSelectStyle}>
            {NFT_DATA.map(function(n) {
              return <option key={n.level} value={n.level}>{T.level + n.level + ' — ' + n.name + ' · ' + fmtUsd(n.price)}</option>;
            })}
          </select>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', marginTop: '6px' }}>{T.inviteeNftHint}</div>
        </div>
      </div>

      {/* KPI strip: commission + remaining */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div style={{ backgroundColor: '#383838', border: '1px solid rgba(255,255,255,0.05)' }} className="rounded-xl p-4">
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{T.commission}</div>
          <div style={{ color: '#FFFFFF', fontSize: '24px', fontWeight: 900, lineHeight: 1.2, marginTop: '4px' }}>{fmtUsd(commission)}</div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', marginTop: '4px' }}>{T.commissionHint}</div>
        </div>
        <div style={{ backgroundColor: '#383838', border: '1px solid rgba(255,255,255,0.05)' }} className="rounded-xl p-4">
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{T.remaining}</div>
          <div style={{ color: '#FFFFFF', fontSize: '24px', fontWeight: 900, lineHeight: 1.2, marginTop: '4px' }}>{fmtUsd(yourNft.limit)}</div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', marginTop: '4px' }}>{T.remainingHint}</div>
        </div>
      </div>

      {/* Trigger banner */}
      <div style={{
        backgroundColor: triggered ? 'rgba(96,165,250,0.08)' : 'rgba(74,222,128,0.06)',
        border: '1px solid ' + (triggered ? 'rgba(96,165,250,0.3)' : 'rgba(74,222,128,0.2)'),
        padding: '12px 16px',
        borderRadius: '12px',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}>
        <div style={{
          width: '32px', height: '32px',
          borderRadius: '50%',
          backgroundColor: triggered ? 'rgba(96,165,250,0.18)' : 'rgba(74,222,128,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
          fontSize: '16px',
        }}>
          {triggered ? '❄' : '✓'}
        </div>
        <div>
          <div style={{ color: triggered ? '#60a5fa' : '#4ade80', fontSize: '13px', fontWeight: 700 }}>
            {triggered ? T.triggerOn : T.triggerOff}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', marginTop: '2px' }}>
            {triggered ? T.triggerOnSub : T.triggerOffSub}
          </div>
        </div>
      </div>

      {/* Split visualization */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
        {/* Immediate */}
        <div style={{
          backgroundColor: 'rgba(74,222,128,0.06)',
          border: '1px solid rgba(74,222,128,0.25)',
          borderRadius: '12px',
          padding: '16px',
        }}>
          <div className="flex items-center justify-between mb-1">
            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{T.immediate}</span>
            <span style={{ color: '#4ade80', backgroundColor: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.3)', fontSize: '9px', fontWeight: 700, padding: '2px 8px', borderRadius: '9999px' }}>NOW</span>
          </div>
          <div style={{ color: '#4ade80', fontSize: '26px', fontWeight: 900 }}>{fmtUsd(inLimit)}</div>
          <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '11px', marginTop: '4px' }}>{T.immediateHint}</div>
        </div>

        {/* Frozen */}
        <div style={{
          backgroundColor: triggered ? 'rgba(96,165,250,0.07)' : 'rgba(255,255,255,0.02)',
          border: '1px solid ' + (triggered ? 'rgba(96,165,250,0.3)' : 'rgba(255,255,255,0.08)'),
          borderRadius: '12px',
          padding: '16px',
          opacity: triggered ? 1 : 0.55,
        }}>
          <div className="flex items-center justify-between mb-1">
            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{T.frozen}</span>
            <span style={{
              color: triggered ? '#60a5fa' : 'rgba(255,255,255,0.4)',
              backgroundColor: triggered ? 'rgba(96,165,250,0.12)' : 'rgba(255,255,255,0.05)',
              border: '1px solid ' + (triggered ? 'rgba(96,165,250,0.3)' : 'rgba(255,255,255,0.1)'),
              fontSize: '9px', fontWeight: 700, padding: '2px 8px', borderRadius: '9999px'
            }}>72{T.hours}</span>
          </div>
          <div style={{ color: triggered ? '#60a5fa' : 'rgba(255,255,255,0.35)', fontSize: '26px', fontWeight: 900 }}>{fmtUsd(frozen)}</div>
          <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '11px', marginTop: '4px' }}>{T.frozenHint}</div>
        </div>
      </div>

      {/* 75/20/5 mini split */}
      {inLimit > 0 && (
        <div style={{ backgroundColor: '#383838', border: '1px solid rgba(255,255,255,0.05)', padding: '12px 14px', borderRadius: '12px', marginBottom: '20px' }}>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>{T.lostHeader}</div>
          <div style={{ display: 'flex', height: '8px', borderRadius: '4px', overflow: 'hidden', marginBottom: '10px' }}>
            <div style={{ width: '75%', backgroundColor: '#4ade80' }} />
            <div style={{ width: '20%', backgroundColor: '#fbbf24' }} />
            <div style={{ width: '5%', backgroundColor: '#60a5fa' }} />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: '#4ade80', display: 'inline-block' }} />
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '10px', fontWeight: 600 }}>75% {T.reg}</span>
              </div>
              <div style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: 700 }}>{fmtUsd(inLimit * 0.75)}</div>
              <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '9px' }}>{T.regHint}</div>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: '#fbbf24', display: 'inline-block' }} />
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '10px', fontWeight: 600 }}>20% {T.acc}</span>
              </div>
              <div style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: 700 }}>{fmtUsd(inLimit * 0.20)}</div>
              <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '9px' }}>{T.accHint}</div>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: '#60a5fa', display: 'inline-block' }} />
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '10px', fontWeight: 600 }}>5% {T.pool}</span>
              </div>
              <div style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: 700 }}>{fmtUsd(inLimit * 0.05)}</div>
              <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '9px' }}>{T.poolHint}</div>
            </div>
          </div>
        </div>
      )}

      {/* 72-hour resolution panel — only when frozen */}
      {triggered && (
        <div style={{ backgroundColor: '#383838', border: '1px solid rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px' }}>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
            {/* Animated 72h clock */}
            <div style={{ flexShrink: 0, display: 'flex', justifyContent: 'center' }}>
              <svg width={clockSize} height={clockSize} viewBox={'0 0 ' + clockSize + ' ' + clockSize}>
                <circle cx={clockCx} cy={clockCy} r={clockR} fill="rgba(96,165,250,0.05)" stroke="rgba(96,165,250,0.2)" strokeWidth="1" />
                <path d={sweepPath} fill="rgba(96,165,250,0.18)" />
                {[0, 18, 36, 54].map(function(t) {
                  var a = -Math.PI / 2 + (t / 72) * Math.PI * 2;
                  var x1 = clockCx + (clockR - 6) * Math.cos(a);
                  var y1 = clockCy + (clockR - 6) * Math.sin(a);
                  var x2 = clockCx + clockR * Math.cos(a);
                  var y2 = clockCy + clockR * Math.sin(a);
                  return <line key={t} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.3)" strokeWidth="1" />;
                })}
                <line x1={clockCx} y1={clockCy} x2={hourX} y2={hourY} stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx={clockCx} cy={clockCy} r="3" fill="#60a5fa" />
                <text x={clockCx} y={clockCy - 18} textAnchor="middle" fill="rgba(255,255,255,0.45)" style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>72{T.hours}</text>
                <text x={clockCx} y={clockCy + 22} textAnchor="middle" fill="#FFFFFF" style={{ fontSize: '15px', fontWeight: 800 }}>{hour}{T.hours}</text>
              </svg>
            </div>
            <div style={{ flex: '1 1 0%' }}>
              <div style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: 700, marginBottom: '4px' }}>{T.timerHeader}</div>
              <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '12px', marginBottom: '12px' }}>{T.timerSub}</div>
              <div className="flex flex-wrap gap-2">
                <button onClick={function() { setScenario('upgrade'); }} style={tabStyle('upgrade')}>{T.tabUpgrade}</button>
                <button onClick={function() { setScenario('autobuy'); }} style={tabStyle('autobuy')}>{T.tabAutobuy}</button>
                <button onClick={function() { setScenario('forfeit'); }} style={tabStyle('forfeit')}>{T.tabForfeit}</button>
              </div>
            </div>
          </div>

          {/* Scenario panels */}
          {scenario === 'upgrade' && (
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '14px' }}>
              <div style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>{T.upgradeTitle}</div>
              <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '12px', lineHeight: 1.5, marginBottom: '12px' }}>{T.upgradeBody}</div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px', display: 'block' }}>{T.upgradeChoose}</label>
                <select value={upgradeLevel} onChange={function(e) { setUpgradeLevel(Number(e.target.value)); }} style={nftSelectStyle}>
                  {NFT_DATA.filter(function(n) { return n.level > yourLevel; }).map(function(n) {
                    return <option key={n.level} value={n.level}>{T.level + n.level + ' — ' + n.name + ' · ' + fmtUsd(n.limit)}</option>;
                  })}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div style={{ backgroundColor: 'rgba(74,222,128,0.06)', border: '1px solid rgba(74,222,128,0.2)', borderRadius: '10px', padding: '10px 12px' }}>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{T.upgradeReleased}</div>
                  <div style={{ color: '#4ade80', fontSize: '16px', fontWeight: 800, marginTop: '2px' }}>{fmtUsd(frozen)}</div>
                </div>
                <div style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '10px 12px' }}>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{T.upgradeNewLimit}</div>
                  <div style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: 800, marginTop: '2px' }}>{fmtUsd(upgradeNft.limit)}</div>
                </div>
                <div style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '10px 12px' }}>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{T.upgradeRemaining}</div>
                  <div style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: 800, marginTop: '2px' }}>{fmtUsd(upgradeRemaining)}</div>
                </div>
              </div>

              {!upgradeCovers && (
                <div style={{ marginTop: '10px', color: 'rgba(251,191,36,0.85)', fontSize: '11px' }}>{T.upgradeImpossible}</div>
              )}
            </div>
          )}

          {scenario === 'autobuy' && (
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '14px' }}>
              <div style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>{T.autobuyTitle}</div>
              <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '12px', lineHeight: 1.5, marginBottom: '12px' }}>{T.autobuyBody}</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '10px 12px' }}>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{T.autobuyRefreshed}</div>
                  <div style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: 800, marginTop: '2px' }}>{fmtUsd(refreshedLimit)}</div>
                </div>
                <div style={{ backgroundColor: 'rgba(74,222,128,0.06)', border: '1px solid rgba(74,222,128,0.2)', borderRadius: '10px', padding: '10px 12px' }}>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{T.autobuyAbsorbed}</div>
                  <div style={{ color: '#4ade80', fontSize: '16px', fontWeight: 800, marginTop: '2px' }}>{fmtUsd(autobuyAbsorbed)}</div>
                </div>
                <div style={{ backgroundColor: autobuyLeftover > 0 ? 'rgba(96,165,250,0.06)' : 'rgba(255,255,255,0.04)', border: '1px solid ' + (autobuyLeftover > 0 ? 'rgba(96,165,250,0.25)' : 'rgba(255,255,255,0.08)'), borderRadius: '10px', padding: '10px 12px' }}>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{T.autobuyLeftover}</div>
                  <div style={{ color: autobuyLeftover > 0 ? '#60a5fa' : 'rgba(255,255,255,0.6)', fontSize: '16px', fontWeight: 800, marginTop: '2px' }}>{fmtUsd(autobuyLeftover)}</div>
                </div>
              </div>
              <div style={{ marginTop: '10px', color: 'rgba(255,255,255,0.45)', fontSize: '11px', fontStyle: 'italic' }}>{T.autobuyNote}</div>
            </div>
          )}

          {scenario === 'forfeit' && (
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '14px' }}>
              <div style={{ color: '#f87171', fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>{T.forfeitTitle}</div>
              <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '12px', lineHeight: 1.5, marginBottom: '12px' }}>{T.forfeitBody}</div>

              {/* Forfeit split bar */}
              <div style={{ display: 'flex', height: '10px', borderRadius: '5px', overflow: 'hidden', marginBottom: '10px' }}>
                <div style={{ width: '70%', backgroundColor: '#60a5fa' }} />
                <div style={{ width: '30%', backgroundColor: '#f87171' }} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div style={{ backgroundColor: 'rgba(96,165,250,0.06)', border: '1px solid rgba(96,165,250,0.25)', borderRadius: '10px', padding: '10px 12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: '#60a5fa', display: 'inline-block' }} />
                    <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '10px', fontWeight: 600 }}>70% — {T.forfeitPool}</span>
                  </div>
                  <div style={{ color: '#60a5fa', fontSize: '18px', fontWeight: 800, marginTop: '4px' }}>{fmtUsd(forfeitPool)}</div>
                </div>
                <div style={{ backgroundColor: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.25)', borderRadius: '10px', padding: '10px 12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: '#f87171', display: 'inline-block' }} />
                    <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '10px', fontWeight: 600 }}>30% — {T.forfeitSponsor}</span>
                  </div>
                  <div style={{ color: '#f87171', fontSize: '18px', fontWeight: 800, marginTop: '4px' }}>{fmtUsd(forfeitSponsor)}</div>
                </div>
              </div>
              <div style={{ marginTop: '10px', color: 'rgba(255,255,255,0.45)', fontSize: '11px' }}>{T.forfeitCascade}</div>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', lineHeight: 1.6, marginTop: '14px', marginBottom: 0 }}>
        {triggered ? T.footerNote : T.noFreezeFooter}
      </p>
    </div>
  );
};
