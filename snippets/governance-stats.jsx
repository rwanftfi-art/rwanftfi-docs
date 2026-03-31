export const GovernanceStats = () => {
  if (typeof window === 'undefined') { return null; }

  return (
    <div style={{ backgroundColor: '#000000', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.05)' }} className="p-6 rounded-xl not-prose">

      {/* Header */}
      <div className="mb-6">
        <h3 style={{ color: '#FFFFFF', margin: 0 }} className="text-lg font-serif italic">Governance Overview</h3>
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
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Total Supply</div>
            <div style={{ color: '#FFFFFF', fontSize: '20px', fontWeight: 900 }}>10,000,000</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginTop: '4px' }}>GovTokens (ERC20Votes)</div>
          </div>
          {/* Proposal Threshold */}
          <div style={{ backgroundColor: '#383838', border: '1px solid rgba(255,255,255,0.05)', flex: '1 1 160px' }} className="rounded-xl p-4">
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Proposal Threshold</div>
            <div style={{ color: '#FFFFFF', fontSize: '20px', fontWeight: 900 }}>30%</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginTop: '4px' }}>of supply to submit</div>
          </div>
          {/* Passing Vote */}
          <div style={{ backgroundColor: '#383838', border: '1px solid rgba(255,255,255,0.05)', flex: '1 1 160px' }} className="rounded-xl p-4">
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Passing Vote</div>
            <div style={{ color: '#FFFFFF', fontSize: '20px', fontWeight: 900 }}>50%</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginTop: '4px' }}>majority to execute on-chain</div>
          </div>
        </div>
      </div>

    </div>
  );
};
