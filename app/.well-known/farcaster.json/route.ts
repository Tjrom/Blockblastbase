export async function GET() {
  const ROOT_URL = process.env.NEXT_PUBLIC_URL || 'https://blockblastbase.vercel.app'
  
  const manifest = {
    accountAssociation: {
      header: '',
      payload: '',
      signature: ''
    },
    miniapp: {
      version: '1',
      name: 'Block Blast',
      subtitle: 'Puzzle Game on Base',
      description: 'Block Blast puzzle game with on-chain leaderboard on Base Sepolia. Drag and drop blocks to clear lines and compete for the top score!',
      homeUrl: ROOT_URL,
      splashBackgroundColor: '#0a0e27',
      primaryCategory: 'games',
      tags: ['puzzle', 'games', 'blockchain', 'base', 'leaderboard'],
      tagline: 'Clear blocks, score points, compete on-chain!',
    },
  }

  return Response.json(manifest)
}
