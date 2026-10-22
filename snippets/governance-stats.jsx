export const GovernanceStats = ({ lang }) => {
  if (typeof window === 'undefined') { return null; }

  // Interface strings by page language; any other language falls back to English.
  /* i18n:begin */
  var STR = {
    en: {
      title: 'Governance Overview',
      supply: 'Total Supply',
      proposal: 'Proposal Threshold',
      proposalNote: 'of supply to submit',
      passing: 'Passing Vote',
      passingNote: 'majority to execute on-chain',
      guardians: 'Guardian Wallets',
      guardiansNote: 'current governance wallets',
    },
    ru: {
      title: 'Обзор управления',
      supply: 'Общее предложение',
      proposal: 'Порог предложения',
      proposalNote: 'от общего объёма для подачи',
      passing: 'Порог принятия',
      passingNote: 'большинство для исполнения он-чейн',
      guardians: 'Кошельки Guardian',
      guardiansNote: 'текущие кошельки управления',
    },
    zh: {
      title: '治理概览',
      supply: '总供应量',
      proposal: '提案门槛',
      proposalNote: '提交提案所需的供应量占比',
      passing: '通过门槛',
      passingNote: '在链上执行所需的多数票',
      guardians: 'Guardian 钱包',
      guardiansNote: '当前治理钱包',
    },
    es: {
      title: 'Resumen de Gobernanza',
      supply: 'Suministro total',
      proposal: 'Umbral de propuesta',
      proposalNote: 'del suministro para presentarla',
      passing: 'Umbral de aprobación',
      passingNote: 'mayoría para ejecutar on-chain',
      guardians: 'Wallets Guardian',
      guardiansNote: 'wallets de gobernanza actuales',
    },
    de: {
      title: 'Governance-Übersicht',
      supply: 'Gesamtangebot',
      proposal: 'Vorschlagsschwelle',
      proposalNote: 'des Angebots zur Einreichung',
      passing: 'Annahmeschwelle',
      passingNote: 'Mehrheit für die On-Chain-Ausführung',
      guardians: 'Guardian-Wallets',
      guardiansNote: 'aktuelle Governance-Wallets',
    },
    pt: {
      title: 'Visão Geral da Governança',
      supply: 'Oferta Total',
      proposal: 'Limiar de Proposta',
      proposalNote: 'da oferta para apresentar',
      passing: 'Limiar de Aprovação',
      passingNote: 'maioria para a execução on-chain',
      guardians: 'Carteiras Guardian',
      guardiansNote: 'carteiras de governança atuais',
    },
    hi: {
      title: 'गवर्नेंस अवलोकन',
      supply: 'कुल आपूर्ति',
      proposal: 'प्रस्ताव थ्रेशोल्ड',
      proposalNote: 'प्रस्ताव प्रस्तुत करने हेतु आपूर्ति का हिस्सा',
      passing: 'अनुमोदन थ्रेशोल्ड',
      passingNote: 'ऑन-चेन निष्पादन के लिए बहुमत',
      guardians: 'Guardian वॉलेट',
      guardiansNote: 'वर्तमान गवर्नेंस वॉलेट',
    },
    it: {
      title: 'Panoramica della governance',
      supply: 'Offerta totale',
      proposal: 'Soglia di proposta',
      proposalNote: 'dell\'offerta per presentare una proposta',
      passing: 'Soglia di approvazione',
      passingNote: 'maggioranza per l\'esecuzione on-chain',
      guardians: 'Wallet Guardian',
      guardiansNote: 'wallet di governance attuali',
    },
    fr: {
      title: 'Aperçu de la Gouvernance',
      supply: 'Offre totale',
      proposal: 'Seuil de proposition',
      proposalNote: 'de l\'offre pour soumettre une proposition',
      passing: 'Seuil d\'approbation',
      passingNote: 'de majorité pour l\'exécution on-chain',
      guardians: 'Wallets Guardian',
      guardiansNote: 'wallets de gouvernance actuels',
    },
    id: {
      title: 'Ikhtisar Tata Kelola',
      supply: 'Total Pasokan',
      proposal: 'Ambang Proposal',
      proposalNote: 'dari pasokan untuk mengajukan',
      passing: 'Ambang Persetujuan',
      passingNote: 'mayoritas untuk eksekusi on-chain',
      guardians: 'Dompet Guardian',
      guardiansNote: 'dompet tata kelola saat ini',
    },
  };
  /* i18n:end */
  var L = STR[lang] ? lang : 'en';
  var T = STR[L];
  // Thousands separators and percent signs as on each language's pages.
  var SEP = { ru: '\u00A0', uk: '\u00A0', fr: '\u00A0', tr: '.', es: '.', de: '.', pt: '.', it: '.', id: '.', vi: '.' }[L] || ',';
  var PCT = { tr: '%{n}', de: '{n}\u00A0%', fr: '{n}\u00A0%' }[L] || '{n}%';
  var num = function(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, SEP); };
  var pct = function(n) { return PCT.split('{n}').join(n); };

  return (
    <div style={{ backgroundColor: '#000000', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.05)' }} className="p-6 rounded-xl not-prose">

      {/* Header */}
      <div className="mb-6">
        <h3 style={{ color: '#FFFFFF', margin: 0 }} className="text-lg font-serif italic">{T.title}</h3>
      </div>

      {/* KPI Section: Video + Cards */}
      <div className="mb-6" style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
        {/* Video */}
        <div style={{ flexShrink: 0, display: 'flex', justifyContent: 'center' }} className="w-[160px] sm:w-[140px] mx-auto sm:mx-0">
          <div style={{ backgroundColor: '#383838', borderRadius: '12px', overflow: 'hidden' }} className="w-[160px] h-[160px] sm:w-[140px] sm:h-[140px]">
            <video autoPlay muted loop playsInline style={{ borderRadius: '12px', objectFit: 'cover' }} className="w-[160px] h-[160px] sm:w-[140px] sm:h-[140px]">
              <source src="/DAOp.webm" type="video/webm" />
            </video>
          </div>
        </div>
        {/* KPI Cards */}
        <div style={{ flex: '1 1 0%', minWidth: '240px', display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          {/* Total Supply */}
          <div style={{ backgroundColor: '#383838', border: '1px solid rgba(255,255,255,0.05)', flex: '1 1 160px' }} className="rounded-xl p-4">
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>{T.supply}</div>
            <div style={{ color: '#FFFFFF', fontSize: '20px', fontWeight: 900 }}>{num(10000000)}</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginTop: '4px' }}>GovTokens (ERC20Votes)</div>
          </div>
          {/* Proposal Threshold */}
          <div style={{ backgroundColor: '#383838', border: '1px solid rgba(255,255,255,0.05)', flex: '1 1 160px' }} className="rounded-xl p-4">
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>{T.proposal}</div>
            <div style={{ color: '#FFFFFF', fontSize: '20px', fontWeight: 900 }}>{pct(30)}</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginTop: '4px' }}>{T.proposalNote}</div>
          </div>
          {/* Passing Vote */}
          <div style={{ backgroundColor: '#383838', border: '1px solid rgba(255,255,255,0.05)', flex: '1 1 160px' }} className="rounded-xl p-4">
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>{T.passing}</div>
            <div style={{ color: '#FFFFFF', fontSize: '20px', fontWeight: 900 }}>{pct(50)}</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginTop: '4px' }}>{T.passingNote}</div>
          </div>
          {/* Guardian Wallets */}
          <div style={{ backgroundColor: '#383838', border: '1px solid rgba(255,255,255,0.05)', flex: '1 1 160px' }} className="rounded-xl p-4">
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>{T.guardians}</div>
            <div style={{ color: '#FFFFFF', fontSize: '20px', fontWeight: 900 }}>20</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginTop: '4px' }}>{T.guardiansNote}</div>
          </div>
        </div>
      </div>

    </div>
  );
};
