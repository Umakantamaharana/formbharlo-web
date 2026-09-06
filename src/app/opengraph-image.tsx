import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'FormBharlo - Sarkari Result & Latest Govt Jobs 2026';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#020617',
          backgroundImage:
            'radial-gradient(circle at 25px 25px, #1e293b 2%, transparent 0%), radial-gradient(circle at 75px 75px, #1e293b 2%, transparent 0%)',
          backgroundSize: '100px 100px',
          padding: '60px 70px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Brand Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '18px',
                background: 'linear-gradient(135deg, #2563eb, #4f46e5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontSize: '32px',
                fontWeight: 900,
                boxShadow: '0 8px 20px rgba(37,99,235,0.4)',
              }}
            >
              F
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '36px', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.5px' }}>
                Form<span style={{ color: '#60a5fa' }}>Bharlo</span>
                <span style={{ color: '#f59e0b', fontSize: '28px' }}>.in</span>
              </span>
              <span style={{ fontSize: '15px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                Har Sarkari Bharti, Ek Jagah
              </span>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '10px 24px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(37,99,235,0.2)',
              border: '1px solid rgba(96,165,250,0.4)',
              color: '#93c5fd',
              fontSize: '16px',
              fontWeight: 800,
              letterSpacing: '0.5px',
            }}
          >
            ⚡ Real-Time Sarkari Job Alerts
          </div>
        </div>

        {/* Hero Title Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', margin: '20px 0' }}>
          <h1
            style={{
              fontSize: '56px',
              fontWeight: 900,
              color: '#ffffff',
              lineHeight: 1.15,
              letterSpacing: '-1.5px',
              margin: 0,
            }}
          >
            Sarkari Result, Latest Govt Jobs, Admit Cards &amp; Online Forms 2026
          </h1>
          <p style={{ fontSize: '22px', color: '#94a3b8', margin: 0, lineHeight: 1.4 }}>
            Instant notifications on SSC, Railways (RRB), UPSC, Police, Defence, Banking &amp; State PSC recruitments with direct official application links.
          </p>
        </div>

        {/* Bottom Trust Tags */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '24px',
            borderTop: '1px solid #1e293b',
            width: '100%',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <span style={{ color: '#34d399', fontSize: '18px', fontWeight: 700 }}>
              ✓ 100% Free Public Portal
            </span>
            <span style={{ color: '#60a5fa', fontSize: '18px', fontWeight: 700 }}>
              ✓ Direct Official Gazette Links
            </span>
            <span style={{ color: '#fbbf24', fontSize: '18px', fontWeight: 700 }}>
              ✓ Photo Resizer Utility
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px 28px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              color: '#ffffff',
              fontSize: '20px',
              fontWeight: 800,
              boxShadow: '0 8px 24px rgba(37,99,235,0.4)',
            }}
          >
            formbharlo.in
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
