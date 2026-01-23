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
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0052ff 0%, #ffffff 100%)',
          borderRadius: 96,
          fontSize: 180,
          fontWeight: 800,
          color: '#0a0e27',
          letterSpacing: -6,
        }}
      >
        BB
      </div>
    ),
    {
      width: 512,
      height: 512,
    }
  )
}

