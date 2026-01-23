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
            'radial-gradient(circle at 10% 0%, rgba(255, 255, 255, 0.10) 0%, transparent 55%), radial-gradient(circle at 90% 100%, rgba(0, 82, 255, 0.25) 0%, transparent 55%), linear-gradient(135deg, #0a0e27 0%, #0f1a3a 40%, #0a0e27 100%)',
          color: '#ffffff',
          padding: 100,
        }}
      >
        <div
          style={{
            fontSize: 180,
            fontWeight: 900,
            letterSpacing: -6,
            lineHeight: 1,
            background: 'linear-gradient(90deg, #0052ff 0%, #ffffff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          BLOCK
        </div>
        <div
          style={{
            fontSize: 180,
            fontWeight: 900,
            letterSpacing: -6,
            lineHeight: 1,
            marginTop: 10,
            background: 'linear-gradient(90deg, #0052ff 0%, #ffffff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          BLAST
        </div>
        <div style={{ fontSize: 72, marginTop: 40, color: '#64b5ff', fontWeight: 700 }}>
          ON BASE
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 2400,
    }
  )
}

