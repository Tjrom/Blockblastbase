export async function GET() {
  const ROOT_URL = process.env.NEXT_PUBLIC_URL || 'https://blockblastbase.vercel.app'
  
  const manifest = {
    accountAssociation: {
      header: 'eyJmaWQiOjIzMjkzMzcsInR5cGUiOiJhdXRoIiwia2V5IjoiMHhmODEyYjEyNEJGMDc2ZjY0M2Y5MzY1NzNCZTQ2OTYzMTc3MDQ4RDk5In0',
      payload: 'eyJkb21haW4iOiJibG9ja2JsYXN0YmFzZS52ZXJjZWwuYXBwIn0',
      signature: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAmAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABcKTLd5teTL7kqHckCAkr7CqhoUP4avKmms2uQC9HlJhxxXqynMEEQuUwwuO3uElDMwfigvwRSkqhgFiBxriX0gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAl8ZgIay2xclZzG8RWZzuWvO8j9R0fus3XxDee9lRlVy8FAAAABgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD3eyJ0eXBlIjoid2ViYXV0aG4uZ2V0IiwiY2hhbGxlbmdlIjoiZmpCVkZGeUt1VFdVdDhmaXFtd0hKZHcwdy1Qd0xYV2RqOU16OUtmM0lvNCIsIm9yaWdpbiI6Imh0dHBzOi8va2V5cy5jb2luYmFzZS5jb20iLCJjcm9zc09yaWdpbiI6ZmFsc2UsIm90aGVyX2tleXNfY2FuX2JlX2FkZGVkX2hlcmUiOiJkbyBub3QgY29tcGFyZSBjbGllbnREYXRhSlNPTiBhZ2FpbnN0IGEgdGVtcGxhdGUuIFNlZSBodHRwczovL2dvby5nbC95YWJQZXgifQAAAAAAAAAAAA'
    },
    miniapp: {
      version: '1',
      name: 'Block Blast',
      subtitle: 'Puzzle Game on Base',
      description: 'Block Blast puzzle game with on-chain leaderboard on Base Sepolia. Drag and drop blocks to clear lines and compete for the top score!',
      iconUrl: `${ROOT_URL}/icon.svg`,
      splashImageUrl: `${ROOT_URL}/splash.svg`,
      splashBackgroundColor: '#0a0e27',
      homeUrl: ROOT_URL,
      webhookUrl: `${ROOT_URL}/api/webhook`,
      primaryCategory: 'games',
      tags: ['puzzle', 'games', 'blockchain', 'base', 'leaderboard'],
      tagline: 'Clear blocks, score points, compete on-chain!',
      screenshotUrls: [`${ROOT_URL}/splash.svg`],
      heroImageUrl: `${ROOT_URL}/splash.svg`,
      ogTitle: 'Block Blast - Puzzle Game on Base',
      ogDescription: 'Block Blast puzzle game with on-chain leaderboard on Base Sepolia. Drag and drop blocks to clear lines and compete for the top score!',
      ogImageUrl: `${ROOT_URL}/splash.svg`,
    },
  }

  return Response.json(manifest)
}
