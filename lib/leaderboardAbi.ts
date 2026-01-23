export const BLOCKBLAST_LEADERBOARD_ABI = [
  {
    inputs: [{ internalType: 'uint256', name: 'score', type: 'uint256' }],
    name: 'submitScore',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getLeaderboard',
    outputs: [
      { internalType: 'address[]', name: 'players', type: 'address[]' },
      { internalType: 'uint256[]', name: 'scores', type: 'uint256[]' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'bestScore',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'leaderboardLength',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

