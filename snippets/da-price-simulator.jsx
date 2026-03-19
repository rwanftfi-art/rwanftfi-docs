import { useState } from 'react';

export const DaPriceSimulator = () => {
  var INITIAL_SUPPLY = 100000;
  var INITIAL_LIQUIDITY = 100000;
  var INITIAL_PRICE = INITIAL_LIQUIDITY / INITIAL_SUPPLY;

  var [supply, setSupply] = useState(INITIAL_SUPPLY);
  var [liquidity, setLiquidity] = useState(INITIAL_LIQUIDITY);

  var price = liquidity / supply;
  var changePercent = ((price - INITIAL_PRICE) / INITIAL_PRICE) * 100;

  var burnPresets = [
    { label: 'No burn', supply: 100000 },
    { label: '25%', supply: 75000 },
    { label: '50%', supply: 50000 },
    { label: '75%', supply: 25000 },
    { label: '90%', supply: 10000 },
  ];

  var fmtNum = function(n) {
    return new Intl.NumberFormat('en-US').format(Math.round(n));
  };

  var fmtUsd = function(n) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(n);
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
      <div style={{ backgroundColor: '#000000', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.05)', padding: '24px', borderRadius: '12px' }} className="not-prose">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <h3 style={{ color: '#FFFFFF', margin: 0, fontSize: '18px', fontStyle: 'italic', fontFamily: 'serif' }}>DA Price Simulator</h3>
          <span style={{ color: 'rgba(255,255,255,0.6)', backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', fontSize: '11px', padding: '4px 12px', borderRadius: '9999px', fontWeight: 500 }}>Interactive</span>
        </div>

        {/* Price Result Card */}
        <div style={{ backgroundColor: '#1F2937', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '24px', marginBottom: '24px', textAlign: 'center' }}>
          <div style={{ color: '#9CA3AF', fontSize: '11px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>DA Price</div>
          <div style={{ color: '#FFFFFF', fontSize: '40px', fontWeight: 900, lineHeight: 1.2 }}>{fmtUsd(price)}</div>
          <div style={{ color: '#10B981', fontSize: '14px', fontWeight: 600, marginTop: '8px' }}>
            ↑ {fmtNum(changePercent)}% from $1.00
          </div>
        </div>

        {/* Sliders */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
          {/* Circulating Supply Slider */}
          <div style={{ backgroundColor: '#1F2937', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px' }}>
            <div style={{ marginBottom: '8px' }}>
              <label style={{ color: '#9CA3AF', fontSize: '11px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Circulating Supply</label>
              <span style={{ color: '#FFFFFF', fontSize: '18px', fontWeight: 800, display: 'block' }}>{fmtNum(supply)} DA</span>
            </div>
            <input type="range" min="1000" max="100000" step="1000" value={supply}
              onChange={function(e) { setSupply(Number(e.target.value)); }}
              style={{
                width: '100%',
                cursor: 'pointer',
                touchAction: 'manipulation',
                height: '6px',
                borderRadius: '3px',
                background: 'linear-gradient(to right, rgba(255,255,255,0.4), rgba(255,255,255,0.15))',
                outline: 'none',
                WebkitAppearance: 'none',
                appearance: 'none',
              }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px' }}>1,000</span>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px' }}>100,000 DA</span>
            </div>
          </div>

          {/* USDT Liquidity Pool Slider */}
          <div style={{ backgroundColor: '#1F2937', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px' }}>
            <div style={{ marginBottom: '8px' }}>
              <label style={{ color: '#9CA3AF', fontSize: '11px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>USDT Liquidity Pool</label>
              <span style={{ color: '#FFFFFF', fontSize: '18px', fontWeight: 800, display: 'block' }}>{fmtUsd(liquidity)}</span>
            </div>
            <input type="range" min="100000" max="50000000" step="100000" value={liquidity}
              onChange={function(e) { setLiquidity(Number(e.target.value)); }}
              style={{
                width: '100%',
                cursor: 'pointer',
                touchAction: 'manipulation',
                height: '6px',
                borderRadius: '3px',
                background: 'linear-gradient(to right, rgba(255,255,255,0.4), rgba(255,255,255,0.15))',
                outline: 'none',
                WebkitAppearance: 'none',
                appearance: 'none',
              }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px' }}>$100K</span>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px' }}>$50M</span>
            </div>
          </div>
        </div>

        {/* Formula Line */}
        <div style={{ color: '#9CA3AF', fontSize: '13px', textAlign: 'center', marginBottom: '24px', fontFamily: 'monospace' }}>
          Price = {fmtUsd(liquidity)} ÷ {fmtNum(supply)} = <span style={{ color: '#2563EB', fontWeight: 700 }}>{fmtUsd(price)}</span>
        </div>

        {/* Burn Preset Buttons */}
        <div style={{ marginBottom: '0' }}>
          <div style={{ color: '#9CA3AF', fontSize: '11px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px', textAlign: 'center' }}>Quick Burn Presets</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
            {burnPresets.map(function(preset) {
              var isActive = supply === preset.supply;
              return (
                <button
                  key={preset.label}
                  onClick={function() { setSupply(preset.supply); }}
                  style={{
                    backgroundColor: isActive ? '#2563EB' : 'rgba(255,255,255,0.1)',
                    color: '#FFFFFF',
                    border: isActive ? '1px solid #2563EB' : '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};
