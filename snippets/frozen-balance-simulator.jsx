import { useState, useEffect, useRef } from 'react';

export const FrozenBalanceSimulator = ({ lang }) => {
  if (typeof window === 'undefined') { return null; }

  // Interface strings by page language; any other language falls back to English.
  // "{n}" stands for a number.
  /* i18n:begin */
  var STR = {
    en: {
      title: 'Frozen Balance Simulator',
      interactive: 'Interactive',
      yourNft: 'Your NFT',
      yourNftHint: 'Your current Protocol Reward Cap',
      inviteeNft: 'Invitee\'s First NFT',
      inviteeNftHint: 'First purchase by direct personal invitee',
      commission: 'Sponsor Bonus',
      commissionHint: 'of NFT price (first purchase)',
      remaining: 'Your Remaining Protocol Reward Cap',
      remainingHint: 'Available room before compression',
      triggerOff: 'No freeze — the bonus fits within your cap',
      triggerOffSub: 'Full amount credited immediately under the standard 75 / 20 / 5 split.',
      triggerOn: 'Frozen Balance triggered',
      triggerOnSub: 'Excess above your cap is held for 72 hours while you decide.',
      immediate: 'Credited immediately',
      now: 'NOW',
      immediateHint: 'Within your Protocol Reward Cap · 75 / 20 / 5 split',
      frozen: 'Frozen for 72 h',
      frozenHint: 'Excess above your Protocol Reward Cap',
      lostHeader: 'Standard split applied to the credited part',
      reg: 'Regular Balance',
      acc: 'Accumulative Balance',
      pool: 'DA Liquidity Pool',
      regHint: 'Withdraw anytime',
      accHint: '180-day lifetime (temporary)',
      poolHint: 'New DA minting',
      timerHeader: '72-hour window',
      timerSub: 'Choose how the freeze resolves',
      tabUpgrade: 'Upgrade NFT',
      tabAutobuy: 'Autobuy fires',
      tabForfeit: 'Miss deadline',
      upgradeTitle: 'You upgrade to a higher tier',
      upgradeBody: 'Frozen funds are released and credited under the same 75 / 20 / 5 split. The released amount is deducted from the new NFT\'s Protocol Reward Cap.',
      upgradeChoose: 'Pick the NFT you upgrade to',
      upgradeReleased: 'Frozen amount released',
      upgradeNewLimit: 'New NFT Reward Cap',
      upgradeRemaining: 'Remaining cap after release',
      upgradeImpossible: 'Pick a tier above your current NFT — and at least the invitee\'s tier — to absorb the frozen amount in full.',
      autobuyTitle: 'Autobuy fires first and refreshes your cap',
      autobuyBody: 'Autobuy renews the same-level NFT before the bonus is applied. The refreshed Protocol Reward Cap absorbs the bonus first; only the leftover (if any) goes into Frozen Balance.',
      autobuyRefreshed: 'Refreshed Reward Cap',
      autobuyAbsorbed: 'Absorbed by autobuy',
      autobuyLeftover: 'Still goes to freeze',
      autobuyNote: 'If your own NFT and refreshed cap are sufficient, Frozen Balance never activates.',
      forfeitTitle: 'You miss the 72-hour window',
      forfeitBody: 'The amount is redistributed under the current protocol parameters: the configured share is routed to the DA Liquidity Pool and the remainder follows the sponsor route.',
      forfeitPool: 'To DA Liquidity Pool',
      forfeitSponsor: 'To upline sponsor',
      forfeitCascade: 'If your upline sponsor has a zero Protocol Reward Cap, the sponsor share cascades upward to the next eligible sponsor. If no upline is eligible, the full amount routes to the DA Liquidity Pool.',
      footerNote: 'Frozen Balance applies to the qualifying first purchase and Autobuy of a direct personal invitee. Manual repeat purchases above your cap follow the standard missed-reward and compression rules.',
      noFreezeFooter: 'Increase the invitee\'s NFT level — or pick a smaller NFT for yourself — to see the freeze trigger.',
      hoursN: '{n}h',
      level: 'L',
    },
    ru: {
      title: 'Симулятор Frozen Balance',
      interactive: 'Интерактивно',
      yourNft: 'Ваш NFT',
      yourNftHint: 'Ваш текущий Лимит вознаграждений протокола',
      inviteeNft: 'Первый NFT приглашённого',
      inviteeNftHint: 'Первая покупка прямого приглашённого',
      commission: 'Спонсорский бонус',
      commissionHint: 'от цены NFT (первая покупка)',
      remaining: 'Ваш оставшийся Лимит вознаграждений',
      remainingHint: 'Запас до компрессии',
      triggerOff: 'Заморозки нет — бонус укладывается в Лимит',
      triggerOffSub: 'Вся сумма зачисляется сразу по стандартному распределению 75 / 20 / 5.',
      triggerOn: 'Frozen Balance активирован',
      triggerOnSub: 'Излишек сверх Лимита удерживается 72 часа, пока вы принимаете решение.',
      immediate: 'Зачисляется сразу',
      now: 'СЕЙЧАС',
      immediateHint: 'В пределах вашего Лимита · распределение 75 / 20 / 5',
      frozen: 'Заморожено на 72 ч',
      frozenHint: 'Излишек сверх вашего Лимита',
      lostHeader: 'Стандартное распределение зачисленной части',
      reg: 'Обычный баланс',
      acc: 'Накопительный баланс',
      pool: 'Пул ликвидности DA',
      regHint: 'Вывод в любой момент',
      accHint: 'Срок жизни 180 дней (временно)',
      poolHint: 'Выпуск нового DA',
      timerHeader: '72-часовое окно',
      timerSub: 'Выберите, чем завершится заморозка',
      tabUpgrade: 'Апгрейд NFT',
      tabAutobuy: 'Срабатывает Autobuy',
      tabForfeit: 'Срок пропущен',
      upgradeTitle: 'Вы апгрейдите NFT на более высокий уровень',
      upgradeBody: 'Замороженные средства высвобождаются и зачисляются по тому же распределению 75 / 20 / 5. Высвобожденная сумма списывается с Лимита вознаграждений протокола нового NFT.',
      upgradeChoose: 'Выберите NFT для апгрейда',
      upgradeReleased: 'Высвобождено из заморозки',
      upgradeNewLimit: 'Лимит нового NFT',
      upgradeRemaining: 'Остаток Лимита после высвобождения',
      upgradeImpossible: 'Выберите уровень выше текущего и не ниже уровня приглашённого, чтобы Лимит вместил всю замороженную сумму.',
      autobuyTitle: 'Сначала срабатывает Autobuy и обновляет Лимит',
      autobuyBody: 'Autobuy продлевает NFT того же уровня до начисления бонуса. Обновлённый Лимит вознаграждений протокола сначала поглощает бонус, и только остаток, если он есть, помещается во Frozen Balance.',
      autobuyRefreshed: 'Обновлённый Лимит вознаграждений',
      autobuyAbsorbed: 'Поглощено через Autobuy',
      autobuyLeftover: 'Уходит в заморозку',
      autobuyNote: 'Если обновлённого Лимита вашего NFT достаточно, Frozen Balance не активируется.',
      forfeitTitle: 'Вы пропустили 72-часовое окно',
      forfeitBody: 'Сумма перераспределяется по текущим параметрам протокола: настроенная доля направляется в Пул ликвидности DA, а остаток следует по спонсорскому маршруту.',
      forfeitPool: 'В Пул ликвидности DA',
      forfeitSponsor: 'Вышестоящему спонсору',
      forfeitCascade: 'Если у вышестоящего спонсора Лимит вознаграждений протокола равен нулю, спонсорская доля передаётся дальше вверх до первого подходящего спонсора. Если подходящих спонсоров выше нет, вся сумма направляется в Пул ликвидности DA.',
      footerNote: 'Frozen Balance действует для квалифицируемой первой покупки и Autobuy прямого приглашённого. Ручные повторные покупки сверх Лимита следуют стандартным правилам пропущенных вознаграждений и компрессии.',
      noFreezeFooter: 'Повысьте уровень NFT приглашённого или выберите для себя NFT меньшего уровня, чтобы увидеть срабатывание заморозки.',
      hoursN: '{n} ч',
      level: 'L',
    },
    pt: {
      title: 'Simulador do Saldo Congelado',
      interactive: 'Interativo',
      yourNft: 'Seu NFT',
      yourNftHint: 'Seu Limite de Recompensas do Protocolo atual',
      inviteeNft: 'Primeiro NFT do convidado',
      inviteeNftHint: 'Primeira compra do convidado pessoal direto',
      commission: 'Bônus de Patrocinador',
      commissionHint: 'do preço do NFT (primeira compra)',
      remaining: 'Seu Limite Restante',
      remainingHint: 'Espaço disponível antes da compressão',
      triggerOff: 'Sem congelamento — o bônus cabe no seu limite',
      triggerOffSub: 'O valor integral é creditado imediatamente de acordo com a divisão padrão 75\u00A0/\u00A020\u00A0/\u00A05.',
      triggerOn: 'Saldo Congelado acionado',
      triggerOnSub: 'O excedente acima do seu limite fica retido por 72 horas enquanto você decide.',
      immediate: 'Creditado imediatamente',
      now: 'AGORA',
      immediateHint: 'Dentro do seu Limite de Recompensas do Protocolo · divisão 75\u00A0/\u00A020\u00A0/\u00A05',
      frozen: 'Congelado por 72 h',
      frozenHint: 'Excedente acima do seu Limite de Recompensas do Protocolo',
      lostHeader: 'Divisão padrão aplicada à parte creditada',
      reg: 'Saldo Regular',
      acc: 'Saldo Acumulativo',
      pool: 'Pool de Liquidez do DA',
      regHint: 'Retirada a qualquer momento',
      accHint: 'Vida útil de 180 dias (temporária)',
      poolHint: 'Cunhagem de novo DA',
      timerHeader: 'Janela de 72 horas',
      timerSub: 'Escolha como o congelamento será resolvido',
      tabUpgrade: 'Upgrade do NFT',
      tabAutobuy: 'Autobuy ativo',
      tabForfeit: 'Prazo perdido',
      upgradeTitle: 'Você faz upgrade para um nível superior',
      upgradeBody: 'Os fundos congelados são liberados e creditados de acordo com a mesma divisão 75\u00A0/\u00A020\u00A0/\u00A05. O valor liberado é deduzido do Limite de Recompensas do Protocolo do novo NFT.',
      upgradeChoose: 'Escolha o NFT do upgrade',
      upgradeReleased: 'Valor congelado liberado',
      upgradeNewLimit: 'Limite do novo NFT',
      upgradeRemaining: 'Limite após a liberação',
      upgradeImpossible: 'Escolha um nível acima do seu NFT atual — e no mínimo o nível do convidado — para absorver todo o valor congelado.',
      autobuyTitle: 'O Autobuy é acionado primeiro e restabelece o seu limite',
      autobuyBody: 'O Autobuy renova o NFT do mesmo nível antes de o bônus ser aplicado. O Limite de Recompensas do Protocolo restabelecido absorve primeiro o bônus; somente o eventual excedente vai para o Saldo Congelado.',
      autobuyRefreshed: 'Limite restabelecido',
      autobuyAbsorbed: 'Absorvido pelo Autobuy',
      autobuyLeftover: 'Ainda vai para o congelamento',
      autobuyNote: 'Se o seu próprio NFT e o limite restabelecido forem suficientes, o Saldo Congelado nunca é ativado.',
      forfeitTitle: 'Você perde a janela de 72 horas',
      forfeitBody: 'O valor é redistribuído de acordo com os parâmetros atuais do protocolo: a parcela configurada é direcionada ao Pool de Liquidez do DA e o restante segue a rota do patrocinador.',
      forfeitPool: 'Para o Pool de Liquidez do DA',
      forfeitSponsor: 'Para o patrocinador acima',
      forfeitCascade: 'Se o patrocinador acima tiver o Limite de Recompensas do Protocolo zerado, a parcela do patrocinador passa em cascata para o próximo patrocinador elegível acima. Se nenhum patrocinador acima for elegível, o valor integral é direcionado ao Pool de Liquidez do DA.',
      footerNote: 'O Saldo Congelado se aplica à primeira compra qualificada e ao Autobuy de um convidado pessoal direto. Compras repetidas manuais acima do seu limite seguem as regras padrão de recompensas perdidas e de compressão.',
      noFreezeFooter: 'Aumente o nível do NFT do convidado — ou escolha um NFT menor para você — para ver o congelamento ser acionado.',
      hoursN: '{n} h',
      level: 'L',
    },
  };
  /* i18n:end */
  var L = STR[lang] ? lang : 'en';
  var T = STR[L];
  var fill = function(s, n) { return s.split('{n}').join(n); };

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

  // Thousands and decimal separators and the percent sign as on each language's pages.
  var SEP = { ru: '\u00A0', uk: '\u00A0', fr: '\u00A0', tr: '.', es: '.', de: '.', pt: '.', it: '.', id: '.', vi: '.' }[L] || ',';
  var DEC = SEP === ',' ? '.' : ',';
  var PCT = { tr: '%{n}', de: '{n}\u00A0%', fr: '{n}\u00A0%' }[L] || '{n}%';
  var fmtUsd = function(n) {
    var parts = Math.abs(n).toFixed(Math.abs(n) >= 1000 ? 0 : 2).split('.');
    return '$' + parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, SEP) + (parts[1] ? DEC + parts[1] : '');
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

  // Current on-chain values (Phase 2, activated by DAO vote in June 2026)
  var SPONSOR_FIRST_PURCHASE = 0.20;
  var FORFEIT_POOL_SHARE = 0.80;
  var FORFEIT_SPONSOR_SHARE = 0.20;
  var pct = function(x) { return Math.round(x * 100) + '%'; };
  var pctText = function(x) { return fill(PCT, Math.round(x * 100)); };

  var yourNft = NFT_DATA[yourLevel - 1];
  var inviteeNft = NFT_DATA[inviteeLevel - 1];
  var commission = inviteeNft.price * SPONSOR_FIRST_PURCHASE;
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
  var forfeitPool = frozen * FORFEIT_POOL_SHARE;
  var forfeitSponsor = frozen * FORFEIT_SPONSOR_SHARE;

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
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', marginTop: '4px' }}>{pctText(SPONSOR_FIRST_PURCHASE) + ' ' + T.commissionHint}</div>
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
            <span style={{ color: '#4ade80', backgroundColor: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.3)', fontSize: '9px', fontWeight: 700, padding: '2px 8px', borderRadius: '9999px' }}>{T.now}</span>
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
            }}>{fill(T.hoursN, 72)}</span>
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
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '10px', fontWeight: 600 }}>{pctText(0.75)} {T.reg}</span>
              </div>
              <div style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: 700 }}>{fmtUsd(inLimit * 0.75)}</div>
              <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '9px' }}>{T.regHint}</div>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: '#fbbf24', display: 'inline-block' }} />
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '10px', fontWeight: 600 }}>{pctText(0.20)} {T.acc}</span>
              </div>
              <div style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: 700 }}>{fmtUsd(inLimit * 0.20)}</div>
              <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '9px' }}>{T.accHint}</div>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: '#60a5fa', display: 'inline-block' }} />
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '10px', fontWeight: 600 }}>{pctText(0.05)} {T.pool}</span>
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
                <text x={clockCx} y={clockCy - 18} textAnchor="middle" fill="rgba(255,255,255,0.45)" style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{fill(T.hoursN, 72)}</text>
                <text x={clockCx} y={clockCy + 22} textAnchor="middle" fill="#FFFFFF" style={{ fontSize: '15px', fontWeight: 800 }}>{fill(T.hoursN, hour)}</text>
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
                    return <option key={n.level} value={n.level}>{T.level + n.level + ' — ' + n.name + ' · ' + fmtUsd(n.price)}</option>;
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
                <div style={{ width: pct(FORFEIT_POOL_SHARE), backgroundColor: '#60a5fa' }} />
                <div style={{ width: pct(FORFEIT_SPONSOR_SHARE), backgroundColor: '#f87171' }} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div style={{ backgroundColor: 'rgba(96,165,250,0.06)', border: '1px solid rgba(96,165,250,0.25)', borderRadius: '10px', padding: '10px 12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: '#60a5fa', display: 'inline-block' }} />
                    <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '10px', fontWeight: 600 }}>{pctText(FORFEIT_POOL_SHARE)} — {T.forfeitPool}</span>
                  </div>
                  <div style={{ color: '#60a5fa', fontSize: '18px', fontWeight: 800, marginTop: '4px' }}>{fmtUsd(forfeitPool)}</div>
                </div>
                <div style={{ backgroundColor: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.25)', borderRadius: '10px', padding: '10px 12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: '#f87171', display: 'inline-block' }} />
                    <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '10px', fontWeight: 600 }}>{pctText(FORFEIT_SPONSOR_SHARE)} — {T.forfeitSponsor}</span>
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
