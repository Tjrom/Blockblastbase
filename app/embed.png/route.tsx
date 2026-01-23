import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background:
            'radial-gradient(circle at 30% 20%, rgba(0, 82, 255, 0.15) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%), linear-gradient(135deg, #0a0e27 0%, #0f1a3a 50%, #0a0e27 100%)',
          position: 'relative',
        }}
      >
        {/* Логотип - большой блок с градиентом */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '40px',
          }}
        >
          <div
            style={{
              width: '280',
              height: '280',
              borderRadius: '32px',
              background: 'linear-gradient(135deg, #0052ff 0%, #00b2ff 50%, #ffffff 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 20px 60px rgba(0, 82, 255, 0.4)',
              border: '4px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <div
              style={{
                fontSize: '140',
                fontWeight: 900,
                color: '#0a0e27',
                letterSpacing: '-2px',
                fontFamily: 'system-ui, -apple-system, sans-serif',
              }}
            >
              BB
            </div>
          </div>
        </div>

        {/* Название игры */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div
            style={{
              fontSize: '96',
              fontWeight: 900,
              letterSpacing: '-2px',
              lineHeight: 1.1,
              color: '#ffffff',
              textAlign: 'center',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              textShadow: '0 4px 20px rgba(0, 82, 255, 0.5)',
            }}
          >
            BLOCK BLAST
          </div>
          <div
            style={{
              fontSize: '32',
              color: '#64b5ff',
              fontWeight: 600,
              textAlign: 'center',
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
          >
            Puzzle Game on Base
          </div>
          <div
            style={{
              fontSize: '24',
              color: '#89c3ff',
              fontWeight: 500,
              textAlign: 'center',
              marginTop: '8px',
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
          >
            Drag blocks • Clear lines • Compete on-chain
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 800, // 3:2 aspect ratio
    }
  )
}
