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
          alignItems: 'center',
          justifyContent: 'space-between',
          background:
            'radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.10) 0%, transparent 55%), radial-gradient(circle at 80% 80%, rgba(0, 82, 255, 0.25) 0%, transparent 55%), linear-gradient(135deg, #0a0e27 0%, #0f1a3a 40%, #0a0e27 100%)',
          color: '#ffffff',
          padding: '80px 90px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontSize: 110,
              fontWeight: 900,
              letterSpacing: -4,
              lineHeight: 1.05,
              background: 'linear-gradient(90deg, #0052ff 0%, #ffffff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            BLOCK BLAST
          </div>
          <div style={{ fontSize: 44, marginTop: 18, color: '#64b5ff', fontWeight: 700 }}>
            Puzzle game on Base • On-chain leaderboard
          </div>
        </div>

        <div
          style={{
            width: 260,
            height: 260,
            borderRadius: 56,
            background: 'linear-gradient(135deg, #0052ff 0%, #ffffff 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 110,
            fontWeight: 900,
            color: '#0a0e27',
          }}
        >
          BB
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}

