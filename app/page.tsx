'use client'

import { useEffect, useCallback, useMemo, useState, useRef } from 'react'
import { BrowserProvider, Contract, JsonRpcProvider } from 'ethers'
import { sdk } from '@farcaster/miniapp-sdk'
import './game.css'
import { BLOCKBLAST_LEADERBOARD_ABI } from '../lib/leaderboardAbi'

const BOARD_SIZE = 8

// Более точные формы блоков как в Block Blast
const BLOCK_SHAPES = [
  // Маленькие блоки
  [[1]],
  [[1, 1]],
  [[1], [1]],
  [[1, 1, 1]],
  [[1], [1], [1]],
  // L-образные
  [[1, 0], [1, 1]],
  [[0, 1], [1, 1]],
  [[1, 1], [1, 0]],
  [[1, 1], [0, 1]],
  // Квадраты
  [[1, 1], [1, 1]],
  // Прямые
  [[1, 1, 1, 1]],
  [[1], [1], [1], [1]],
  // T-образные
  [[1, 1, 1], [0, 1, 0]],
  [[0, 1, 0], [1, 1, 1]],
  [[1, 0], [1, 1], [1, 0]],
  [[0, 1], [1, 1], [0, 1]],
  // Z-образные
  [[1, 1, 0], [0, 1, 1]],
  [[0, 1, 1], [1, 1, 0]],
  [[1, 0], [1, 1], [0, 1]],
  [[0, 1], [1, 1], [1, 0]],
  // Большие блоки
  [[1, 1, 1], [1, 0, 0]],
  [[1, 1, 1], [0, 0, 1]],
  [[1, 0, 0], [1, 1, 1]],
  [[0, 0, 1], [1, 1, 1]],
  [[1, 1], [1, 0], [1, 0]],
  [[1, 1], [0, 1], [0, 1]],
  [[1, 0], [1, 0], [1, 1]],
  [[0, 1], [0, 1], [1, 1]],
  // Пятерные
  [[1, 1, 1, 1, 1]],
  [[1], [1], [1], [1], [1]],
  [[1, 1, 1], [1, 1, 0]],
  [[1, 1, 1], [0, 1, 1]],
]

// Темы игры
type Theme = {
  name: string
  colors: string[]
  background: string
  borderColor: string
  buttonGradient: string
  music: string
}

const THEMES: Theme[] = [
  {
    name: 'Base',
    colors: ['#0052ff', '#00b2ff', '#ffffff', '#64b5ff', '#89c3ff', '#b3d9ff', '#d6eaff', '#e8f4ff'],
    background: 'radial-gradient(circle at 10% 0%, rgba(255, 255, 255, 0.1) 0%, transparent 55%), radial-gradient(circle at 90% 100%, rgba(0, 82, 255, 0.2) 0%, transparent 55%), linear-gradient(135deg, #0a0e27 0%, #0f1a3a 40%, #0a0e27 100%)',
    borderColor: 'rgba(0, 178, 255, 0.4)',
    buttonGradient: 'linear-gradient(135deg, #0052ff 0%, #ffffff 100%)',
    music: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    name: 'Neon',
    colors: ['#ff00ff', '#00ffff', '#ffff00', '#ff0080', '#00ff80', '#80ff00', '#ff8000', '#8000ff'],
    background: 'radial-gradient(circle at 20% 30%, rgba(255, 0, 255, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(0, 255, 255, 0.3) 0%, transparent 50%), linear-gradient(135deg, #1a0033 0%, #330033 40%, #1a0033 100%)',
    borderColor: 'rgba(255, 0, 255, 0.6)',
    buttonGradient: 'linear-gradient(135deg, #ff00ff 0%, #00ffff 100%)',
    music: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    name: 'Sunset',
    colors: ['#ff6b6b', '#ffa07a', '#ffd700', '#ff8c00', '#ff6347', '#ff1493', '#ff69b4', '#ffb6c1'],
    background: 'radial-gradient(circle at 30% 20%, rgba(255, 107, 107, 0.3) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(255, 215, 0, 0.3) 0%, transparent 50%), linear-gradient(135deg, #2d1b3d 0%, #8b3a5c 40%, #2d1b3d 100%)',
    borderColor: 'rgba(255, 107, 107, 0.6)',
    buttonGradient: 'linear-gradient(135deg, #ff6b6b 0%, #ffd700 100%)',
    music: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  },
  {
    name: 'Ocean',
    colors: ['#00ced1', '#20b2aa', '#48d1cc', '#00bfff', '#1e90ff', '#4169e1', '#6495ed', '#87ceeb'],
    background: 'radial-gradient(circle at 20% 50%, rgba(0, 206, 209, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(30, 144, 255, 0.3) 0%, transparent 50%), linear-gradient(135deg, #001f3f 0%, #003d6b 40%, #001f3f 100%)',
    borderColor: 'rgba(0, 206, 209, 0.6)',
    buttonGradient: 'linear-gradient(135deg, #00ced1 0%, #1e90ff 100%)',
    music: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
  },
  {
    name: 'Forest',
    colors: ['#32cd32', '#228b22', '#90ee90', '#98fb98', '#00ff7f', '#7cfc00', '#adff2f', '#9acd32'],
    background: 'radial-gradient(circle at 50% 30%, rgba(50, 205, 50, 0.25) 0%, transparent 50%), radial-gradient(circle at 50% 70%, rgba(144, 238, 144, 0.2) 0%, transparent 50%), linear-gradient(135deg, #0d2818 0%, #1a4d2e 40%, #0d2818 100%)',
    borderColor: 'rgba(50, 205, 50, 0.6)',
    buttonGradient: 'linear-gradient(135deg, #32cd32 0%, #90ee90 100%)',
    music: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
  },
  {
    name: 'Space',
    colors: ['#9370db', '#ba55d3', '#da70d6', '#dda0dd', '#ee82ee', '#ff00ff', '#ff1493', '#c71585'],
    background: 'radial-gradient(circle at 25% 25%, rgba(147, 112, 219, 0.3) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(255, 0, 255, 0.3) 0%, transparent 50%), linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 40%, #0a0a1a 100%)',
    borderColor: 'rgba(147, 112, 219, 0.6)',
    buttonGradient: 'linear-gradient(135deg, #9370db 0%, #ff00ff 100%)',
    music: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
  },
]

type Cell = string | null
type Board = Cell[][]
type Block = number[][]

export default function Home() {
  const [board, setBoard] = useState<Board>([])
  const [nextBlocks, setNextBlocks] = useState<Block[]>([])
  const [score, setScore] = useState(0)
  const [lines, setLines] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [selectedBlock, setSelectedBlock] = useState<{ block: Block; index: number; color: string } | null>(null)
  const [previewPosition, setPreviewPosition] = useState<{ row: number; col: number } | null>(null)
  const [combo, setCombo] = useState(0)
  const [showLeaderboardModal, setShowLeaderboardModal] = useState(false)
  const [musicOn, setMusicOn] = useState(false)
  const [scoreAnimations, setScoreAnimations] = useState<Array<{ id: number; points: number; x: number; y: number }>>([])
  const [clearingLines, setClearingLines] = useState<Array<{ row: number } | { col: number }>>([])
  const audioRef = useRef<HTMLAudioElement>(null)
  const [currentThemeIndex, setCurrentThemeIndex] = useState(0)
  const [draggedBlock, setDraggedBlock] = useState<{ block: Block; index: number; color: string } | null>(null)
  const [touchStartPos, setTouchStartPos] = useState<{ x: number; y: number } | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  
  // Вычисляем текущую тему на основе счета
  const currentTheme = THEMES[currentThemeIndex % THEMES.length]
  const [account, setAccount] = useState<string | null>(null)
  const [chainId, setChainId] = useState<number | null>(null)
  const [leaderboard, setLeaderboard] = useState<{ player: string; score: number }[]>([])
  const [bestOnChain, setBestOnChain] = useState<number | null>(null)
  const [contractAddress, setContractAddress] = useState<string>(
    process.env.NEXT_PUBLIC_LEADERBOARD_ADDRESS || ''
  )
  const [txStatus, setTxStatus] = useState<string | null>(null)

  const baseSepoliaChainId = 84532
  const readProvider = useMemo(() => new JsonRpcProvider('https://sepolia.base.org'), [])

  const readContract = useMemo(() => {
    if (!contractAddress) return null
    try {
      return new Contract(contractAddress, BLOCKBLAST_LEADERBOARD_ABI, readProvider)
    } catch {
      return null
    }
  }, [contractAddress, readProvider])

  // Инициализация пустой доски
  const initBoard = useCallback((): Board => {
    return Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null))
  }, [])

  // Получить случайные блоки
  const getRandomBlocks = useCallback((): Block[] => {
    const blocks: Block[] = []
    for (let i = 0; i < 3; i++) {
      const randomIndex = Math.floor(Math.random() * BLOCK_SHAPES.length)
      blocks.push(BLOCK_SHAPES[randomIndex])
    }
    return blocks
  }, [])

  // Инициализация игры
  const initGame = useCallback(() => {
    const newBoard = initBoard()
    const blocks = getRandomBlocks()
    setBoard(newBoard)
    setNextBlocks(blocks)
    setScore(0)
    setLines(0)
    setGameOver(false)
    setGameStarted(true)
    setSelectedBlock(null)
    setPreviewPosition(null)
    setCombo(0)
    setCurrentThemeIndex(0)
    // Запускаем музыку если включена
    if (musicOn && audioRef.current) {
      audioRef.current.src = THEMES[0].music
      audioRef.current.volume = 0.3
      audioRef.current.play().catch(() => {})
    }
  }, [initBoard, getRandomBlocks, musicOn])
  
  // Управление музыкой
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3
      audioRef.current.src = currentTheme.music
      if (musicOn && gameStarted) {
        audioRef.current.play().catch(() => {})
      } else {
        audioRef.current.pause()
      }
    }
  }, [musicOn, gameStarted, currentTheme])

  const refreshOnChain = useCallback(async () => {
    if (!readContract) return
    try {
      const [players, scores] = await readContract.getLeaderboard()
      const rows = (players as string[]).map((p, i) => ({
        player: p,
        score: Number((scores as bigint[])[i]),
      }))
      setLeaderboard(rows)

      if (account) {
        const best = await readContract.bestScore(account)
        setBestOnChain(Number(best as bigint))
      } else {
        setBestOnChain(null)
      }
    } catch (e) {
      console.error(e)
    }
  }, [readContract, account])

  const connectWallet = useCallback(async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const eth = (window as any).ethereum
    if (!eth) {
      alert('Установи MetaMask')
      return
    }
    const provider = new BrowserProvider(eth)
    const accounts = await provider.send('eth_requestAccounts', [])
    setAccount(accounts[0] || null)
    const network = await provider.getNetwork()
    setChainId(Number(network.chainId))
  }, [])

  const switchToBaseSepolia = useCallback(async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const eth = (window as any).ethereum
    if (!eth) return
    try {
      await eth.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x14a34' }],
      })
    } catch (err: any) {
      if (err?.code === 4902) {
        await eth.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: '0x14a34',
              chainName: 'Base Sepolia',
              nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
              rpcUrls: ['https://sepolia.base.org'],
              blockExplorerUrls: ['https://sepolia-explorer.base.org'],
            },
          ],
        })
      }
    }
  }, [])

  const submitScoreOnChain = useCallback(
    async (scoreToSubmit: number) => {
      if (!contractAddress) {
        alert('Укажи адрес контракта лидерборда')
        return
      }
      if (!account) {
        await connectWallet()
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const eth = (window as any).ethereum
      if (!eth) return
      const provider = new BrowserProvider(eth)
      const network = await provider.getNetwork()
      const cid = Number(network.chainId)
      setChainId(cid)
      if (cid !== baseSepoliaChainId) {
        await switchToBaseSepolia()
      }

      const signer = await provider.getSigner()
      const writeContract = new Contract(contractAddress, BLOCKBLAST_LEADERBOARD_ABI, signer)
      setTxStatus('Submitting score...')
      try {
        const tx = await writeContract.submitScore(BigInt(scoreToSubmit))
        setTxStatus('Waiting for confirmation...')
        await tx.wait()
        setTxStatus('Saved on-chain!')
        await refreshOnChain()
        setTimeout(() => setTxStatus(null), 2500)
      } catch (e: any) {
        console.error(e)
        setTxStatus(e?.shortMessage || e?.message || 'Transaction failed')
      }
    },
    [contractAddress, account, connectWallet, refreshOnChain, switchToBaseSepolia]
  )

  // Проверка, можно ли разместить блок
  const canPlaceBlock = useCallback((block: Block, row: number, col: number, board: Board): boolean => {
    for (let r = 0; r < block.length; r++) {
      for (let c = 0; c < block[r].length; c++) {
        if (block[r][c]) {
          const boardRow = row + r
          const boardCol = col + c
          
          if (boardRow < 0 || boardRow >= BOARD_SIZE || boardCol < 0 || boardCol >= BOARD_SIZE) {
            return false
          }
          
          if (board[boardRow][boardCol] !== null) {
            return false
          }
        }
      }
    }
    return true
  }, [])

  // Разместить блок на доске
  const placeBlock = useCallback((block: Block, row: number, col: number, color: string, board: Board): Board => {
    const newBoard = board.map(r => [...r])
    
    for (let r = 0; r < block.length; r++) {
      for (let c = 0; c < block[r].length; c++) {
        if (block[r][c]) {
          newBoard[row + r][col + c] = color
        }
      }
    }
    
    return newBoard
  }, [])

  // Удалить заполненные линии и столбцы
  const clearLines = useCallback((board: Board): { newBoard: Board; cleared: number; combo: number; linesToClear: Array<{ row: number } | { col: number }> } => {
    let newBoard = board.map(row => [...row])
    let cleared = 0
    const rowsToClear: number[] = []
    const colsToClear: number[] = []
    
    // Проверка строк
    for (let row = 0; row < BOARD_SIZE; row++) {
      if (newBoard[row].every(cell => cell !== null)) {
        rowsToClear.push(row)
      }
    }
    
    // Проверка столбцов
    for (let col = 0; col < BOARD_SIZE; col++) {
      let isFull = true
      for (let row = 0; row < BOARD_SIZE; row++) {
        if (newBoard[row][col] === null) {
          isFull = false
          break
        }
      }
      if (isFull) {
        colsToClear.push(col)
      }
    }
    
    // Запускаем анимацию очистки
    const linesToClear: Array<{ row: number } | { col: number }> = [
      ...rowsToClear.map(r => ({ row: r })),
      ...colsToClear.map(c => ({ col: c })),
    ]
    if (linesToClear.length > 0) {
      setClearingLines(linesToClear)
      setTimeout(() => setClearingLines([]), 500)
    }
    
    // Очистка строк
    for (const row of rowsToClear) {
      newBoard[row] = Array(BOARD_SIZE).fill(null)
      cleared++
    }
    
    // Очистка столбцов
    for (const col of colsToClear) {
      for (let row = 0; row < BOARD_SIZE; row++) {
        newBoard[row][col] = null
      }
      cleared++
    }
    
    // Комбо: если очищено больше 1 линии - бонус
    const comboMultiplier = cleared > 1 ? cleared : 1
    
    return { newBoard, cleared, combo: comboMultiplier, linesToClear }
  }, [])

  // Обработка клика по доске
  const handleBoardClick = useCallback((row: number, col: number) => {
    if (!selectedBlock || gameOver || !gameStarted) return

    const { block, color } = selectedBlock
    
      if (canPlaceBlock(block, row, col, board)) {
      const newBoard = placeBlock(block, row, col, color, board)
      const { newBoard: clearedBoard, cleared, combo: comboMultiplier, linesToClear } = clearLines(newBoard)
      
      if (cleared > 0) {
        const points = cleared * 10 * comboMultiplier
        const newScore = score + points
        setLines(prev => prev + cleared)
        setScore(newScore)
        setCombo(comboMultiplier > 1 ? comboMultiplier : 0)
        
        // Проверяем, нужно ли сменить тему (каждые 50 очков)
        const newThemeIndex = Math.floor(newScore / 50)
        if (newThemeIndex !== currentThemeIndex) {
          setCurrentThemeIndex(newThemeIndex)
          // Меняем музыку если включена
          if (musicOn && audioRef.current) {
            audioRef.current.pause()
            audioRef.current.src = THEMES[newThemeIndex % THEMES.length].music
            audioRef.current.play().catch(() => {})
          }
        }
        
        // Анимация очков
        const animationId = Date.now()
        const cellRect = document.querySelector(`[data-row="${row}"][data-col="${col}"]`)?.getBoundingClientRect()
        const boardRect = document.querySelector('.game-board-container')?.getBoundingClientRect()
        const x = cellRect ? cellRect.left + cellRect.width / 2 - (boardRect?.left || 0) : 200
        const y = cellRect ? cellRect.top + cellRect.height / 2 - (boardRect?.top || 0) : 200
        
        setScoreAnimations(prev => [...prev, { id: animationId, points, x, y }])
        setTimeout(() => {
          setScoreAnimations(prev => prev.filter(a => a.id !== animationId))
        }, 1000)
        
        // Сброс комбо через 2 секунды
        setTimeout(() => setCombo(0), 2000)
      }
      
      // Удаляем использованный блок
      const newNextBlocks = [...nextBlocks]
      newNextBlocks.splice(selectedBlock.index, 1)
      
      // Добавляем новые блоки только когда все 3 блока использованы (массив пустой)
      if (newNextBlocks.length === 0) {
        // Генерируем 3 новых блока
        for (let i = 0; i < 3; i++) {
          const randomIndex = Math.floor(Math.random() * BLOCK_SHAPES.length)
          newNextBlocks.push(BLOCK_SHAPES[randomIndex])
        }
      }
      
      setNextBlocks(newNextBlocks)
      setBoard(clearedBoard)
      setSelectedBlock(null)
      setPreviewPosition(null)
      
      // Проверка на game over только если есть блоки для размещения
      if (newNextBlocks.length > 0) {
        const canPlaceAny = newNextBlocks.some(block => {
          for (let r = 0; r < BOARD_SIZE; r++) {
            for (let c = 0; c < BOARD_SIZE; c++) {
              if (canPlaceBlock(block, r, c, clearedBoard)) {
                return true
              }
            }
          }
          return false
        })
        
        if (!canPlaceAny) {
          setGameOver(true)
        }
      }
    }
  }, [selectedBlock, board, nextBlocks, gameOver, gameStarted, canPlaceBlock, placeBlock, clearLines, score, currentThemeIndex, musicOn])

  // Обработка наведения на доску
  const handleBoardHover = useCallback((row: number, col: number) => {
    if (!selectedBlock || gameOver || !gameStarted) {
      setPreviewPosition(null)
      return
    }

    const { block } = selectedBlock
    
    if (canPlaceBlock(block, row, col, board)) {
      setPreviewPosition({ row, col })
    } else {
      setPreviewPosition(null)
    }
  }, [selectedBlock, board, gameOver, gameStarted, canPlaceBlock])

  // Выбор блока
  const handleBlockSelect = useCallback((block: Block, index: number) => {
    if (gameOver || !gameStarted) return
    const color = currentTheme.colors[index % currentTheme.colors.length]
    setSelectedBlock({ block, index, color })
  }, [gameOver, gameStarted, currentTheme])

  // Начало перетаскивания блока
  const handleDragStart = useCallback((e: React.DragEvent, block: Block, index: number) => {
    if (gameOver || !gameStarted) {
      e.preventDefault()
      return
    }
    const color = currentTheme.colors[index % currentTheme.colors.length]
    setDraggedBlock({ block, index, color })
    setSelectedBlock({ block, index, color })
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', `${index}`) // Сохраняем индекс для совместимости
  }, [gameOver, gameStarted, currentTheme])

  // Окончание перетаскивания
  const handleDragEnd = useCallback(() => {
    setDraggedBlock(null)
  }, [])

  // Получить координаты ячейки из координат курсора
  const getCellFromCoordinates = useCallback((clientX: number, clientY: number): { row: number; col: number } | null => {
    const boardElement = document.querySelector('.game-board')
    if (!boardElement) return null
    
    const rect = boardElement.getBoundingClientRect()
    const x = clientX - rect.left
    const y = clientY - rect.top
    
    // Получаем размер ячейки
    const cellSize = rect.width / BOARD_SIZE
    const row = Math.floor(y / cellSize)
    const col = Math.floor(x / cellSize)
    
    // Проверяем границы
    if (row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE) {
      return { row, col }
    }
    return null
  }, [])

  // Разрешить drop на доске
  const handleBoardDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (draggedBlock) {
      const cell = getCellFromCoordinates(e.clientX, e.clientY)
      if (cell) {
        handleBoardHover(cell.row, cell.col)
      }
    }
  }, [draggedBlock, getCellFromCoordinates, handleBoardHover])

  // Обработка drop на доске
  const handleBoardDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (draggedBlock && !gameOver && gameStarted) {
      const cell = getCellFromCoordinates(e.clientX, e.clientY)
      if (cell) {
        handleBoardClick(cell.row, cell.col)
      }
      setDraggedBlock(null)
    }
  }, [draggedBlock, gameOver, gameStarted, getCellFromCoordinates, handleBoardClick])

  // Touch события для мобильных устройств
  const handleTouchStart = useCallback((e: React.TouchEvent, block: Block, index: number) => {
    if (gameOver || !gameStarted) return
    
    const touch = e.touches[0]
    const color = currentTheme.colors[index % currentTheme.colors.length]
    setDraggedBlock({ block, index, color })
    setSelectedBlock({ block, index, color })
    setTouchStartPos({ x: touch.clientX, y: touch.clientY })
    setIsDragging(true)
    e.stopPropagation()
  }, [gameOver, gameStarted, currentTheme])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging || !draggedBlock) return
    
    const touch = e.touches[0]
    if (!touch) return
    
    const cell = getCellFromCoordinates(touch.clientX, touch.clientY)
    if (cell) {
      handleBoardHover(cell.row, cell.col)
    }
    e.preventDefault()
    e.stopPropagation()
  }, [isDragging, draggedBlock, getCellFromCoordinates, handleBoardHover])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!draggedBlock) {
      setIsDragging(false)
      setTouchStartPos(null)
      return
    }
    
    const touch = e.changedTouches[0]
    if (!touch) {
      setDraggedBlock(null)
      setIsDragging(false)
      setTouchStartPos(null)
      return
    }
    
    const cell = getCellFromCoordinates(touch.clientX, touch.clientY)
    
    // Проверяем, что touch закончился на доске
    if (cell && !gameOver && gameStarted) {
      handleBoardClick(cell.row, cell.col)
    }
    
    setDraggedBlock(null)
    setIsDragging(false)
    setTouchStartPos(null)
    e.preventDefault()
    e.stopPropagation()
  }, [draggedBlock, gameOver, gameStarted, getCellFromCoordinates, handleBoardClick])

  // Touch на ячейке доски
  const handleCellTouchStart = useCallback((e: React.TouchEvent, row: number, col: number) => {
    if (selectedBlock && !gameOver && gameStarted) {
      // Если блок уже выбран, размещаем его сразу
      handleBoardClick(row, col)
      e.preventDefault()
      e.stopPropagation()
    }
  }, [selectedBlock, gameOver, gameStarted, handleBoardClick])

  // Инициализация при загрузке
  useEffect(() => {
    setBoard(initBoard())
    setNextBlocks(getRandomBlocks())
  }, [initBoard, getRandomBlocks])

  useEffect(() => {
    // initial load leaderboard if configured
    refreshOnChain()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contractAddress])

  useEffect(() => {
    refreshOnChain()
  }, [account, refreshOnChain])

  // Initialize Mini App SDK
  useEffect(() => {
    const initSDK = async () => {
      try {
        await sdk.actions.ready()
      } catch (error) {
        console.error('SDK ready error:', error)
      }
    }
    initSDK()
  }, [])

  // Рендер доски с превью
  const renderBoard = () => {
    const displayBoard = board.map(row => [...row])
    
    // Добавляем превью блока только на пустые ячейки
    if (selectedBlock && previewPosition) {
      const { block, color } = selectedBlock
      const { row, col } = previewPosition
      
      for (let r = 0; r < block.length; r++) {
        for (let c = 0; c < block[r].length; c++) {
          if (block[r][c]) {
            const boardRow = row + r
            const boardCol = col + c
            if (boardRow >= 0 && boardRow < BOARD_SIZE && boardCol >= 0 && boardCol < BOARD_SIZE) {
              // Показываем preview только если ячейка пустая
              if (displayBoard[boardRow][boardCol] === null) {
                displayBoard[boardRow][boardCol] = `preview-${color}`
              }
            }
          }
        }
      }
    }
    
    return displayBoard
  }

  const displayBoard = renderBoard()

  return (
    <div 
      className="game-container"
      style={{
        background: currentTheme.background,
      }}
    >
      <div className="game-topbar">
        <div className="brand">
          <div className="brand-title">BLOCK BLAST</div>
          <div className="brand-subtitle">{currentTheme.name.toUpperCase()} THEME</div>
        </div>

        <div className="hud">
          <div 
            className="hud-box"
            style={{
              borderColor: currentTheme.borderColor,
            }}
          >
            <div className="stat-label">SCORE</div>
            <div className="stat-value">{score.toLocaleString()}</div>
          </div>
          <div 
            className="hud-box"
            style={{
              borderColor: currentTheme.borderColor,
            }}
          >
            <div className="stat-label">LINES</div>
            <div className="stat-value">{lines}</div>
          </div>
          {combo > 1 && (
            <div 
              className="hud-box"
              style={{
                borderColor: currentTheme.borderColor,
              }}
            >
              <div className="stat-label">COMBO</div>
              <div className="stat-value combo-text">x{combo}</div>
            </div>
          )}
        </div>

        <div className="top-actions">
          <button
            className="retro-button music-button"
            onClick={() => setMusicOn(!musicOn)}
            title={musicOn ? 'Music ON' : 'Music OFF'}
          >
            {musicOn ? '🔊' : '🔇'}
          </button>
          {!gameStarted ? (
            <button className="retro-button" onClick={initGame}>
              START
            </button>
          ) : (
            <button className="retro-button" onClick={initGame}>
              NEW
            </button>
          )}
          <button
            className="retro-button"
            style={{
              background: currentTheme.buttonGradient,
            }}
            onClick={() => {
              setShowLeaderboardModal(true)
              refreshOnChain()
            }}
          >
            LEADERBOARD
          </button>
        </div>
      </div>

      <div className="game-stage">
          <div 
            className="game-board-container"
            style={{
              borderColor: currentTheme.borderColor,
            }}
          >
          {gameOver && (
            <div className="game-over">
              <div className="game-over-text">GAME OVER</div>
              <div className="game-over-score">Final Score: {score}</div>
              <div className="game-over-actions">
                <button
                  className="retro-button"
            style={{
              background: currentTheme.buttonGradient,
            }}
                  onClick={() => submitScoreOnChain(score)}
                  disabled={!contractAddress}
                >
                  SAVE ON-CHAIN
                </button>
                <button className="retro-button" onClick={() => setShowLeaderboardModal(true)}>
                  OPEN LEADERBOARD
                </button>
                <button className="retro-button" onClick={initGame}>
                  PLAY AGAIN
                </button>
              </div>
            </div>
          )}
          <div 
            className="game-board"
            onDragOver={handleBoardDragOver}
            onDrop={handleBoardDrop}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
          >
            {displayBoard.map((row, rowIndex) => (
              <div key={rowIndex} className="board-row">
                {row.map((cell, colIndex) => {
                  const isPreview = cell ? cell.startsWith('preview-') : false
                  const previewColor = isPreview && cell ? cell.replace('preview-', '') : null
                  return (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      data-row={rowIndex}
                      data-col={colIndex}
                      className={`board-cell ${cell && !isPreview ? 'filled' : ''} ${
                        isPreview ? 'preview' : ''
                      } ${
                        clearingLines.some(l => ('row' in l && l.row === rowIndex) || ('col' in l && l.col === colIndex))
                          ? 'clearing'
                          : ''
                      }`}
                      style={
                        cell && !isPreview
                          ? { backgroundColor: String(cell) }
                          : isPreview && previewColor
                          ? { backgroundColor: previewColor, opacity: 0.4 }
                          : {}
                      }
                      onClick={() => handleBoardClick(rowIndex, colIndex)}
                      onMouseEnter={() => handleBoardHover(rowIndex, colIndex)}
                      onTouchStart={(e) => handleCellTouchStart(e, rowIndex, colIndex)}
                    />
                  )
                })}
              </div>
            ))}
          </div>
        </div>

        <div 
          className="bottom-panel"
          style={{
            borderColor: currentTheme.borderColor,
          }}
        >
          <div className="bottom-hint">Drag & drop blocks or click to place on the 8×8 board</div>
          <div className="blocks-container-row">
              {nextBlocks.map((block, index) => {
                const blockColor = currentTheme.colors[index % currentTheme.colors.length]
              return (
                <div
                  key={index}
                  className={`block-preview ${selectedBlock?.index === index ? 'selected' : ''} ${draggedBlock?.index === index ? 'dragging' : ''}`}
                  onClick={() => handleBlockSelect(block, index)}
                  draggable={!gameOver && gameStarted}
                  onDragStart={(e) => handleDragStart(e, block, index)}
                  onDragEnd={handleDragEnd}
                  onTouchStart={(e) => handleTouchStart(e, block, index)}
                  onTouchEnd={(e) => {
                    // Если просто тапнули без перетаскивания - выбираем блок
                    if (touchStartPos && !isDragging) {
                      handleBlockSelect(block, index)
                    }
                  }}
                  style={{ touchAction: 'manipulation' }}
                >
                  {block.map((row, rowIndex) => (
                    <div key={rowIndex} className="block-row">
                      {row.map((cell, colIndex) => (
                        <div
                          key={colIndex}
                          className={`block-cell ${cell ? 'filled' : ''}`}
                          style={cell ? { backgroundColor: blockColor } : {}}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Фоновая музыка */}
      <audio ref={audioRef} loop />

      {/* Анимации очков */}
      {scoreAnimations.map((anim) => (
        <div
          key={anim.id}
          className="score-animation"
          style={{
            left: `${anim.x}px`,
            top: `${anim.y}px`,
          }}
        >
          +{anim.points}
        </div>
      ))}

      {showLeaderboardModal && (
        <div
          className="modal-overlay"
          onClick={() => {
            setShowLeaderboardModal(false)
          }}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">ON-CHAIN LEADERBOARD</div>
              <button className="modal-close" onClick={() => setShowLeaderboardModal(false)}>
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="modal-section">
                <div className="instruction-item" style={{ marginBottom: 8 }}>
                  Network: Base Sepolia
                </div>
                <input
                  className="retro-input"
                  placeholder="Leaderboard contract address"
                  value={contractAddress}
                  onChange={(e) => setContractAddress(e.target.value.trim())}
                />

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 10 }}>
                  {!account ? (
                    <button className="retro-button" onClick={connectWallet}>
                      CONNECT WALLET
                    </button>
                  ) : (
                    <div className="instruction-item" style={{ wordBreak: 'break-all' }}>
                      Wallet: {account.slice(0, 6)}…{account.slice(-4)} (chain {chainId ?? '?'})
                    </div>
                  )}

                  {account && chainId !== null && chainId !== baseSepoliaChainId && (
                    <button className="retro-button" onClick={switchToBaseSepolia}>
                      SWITCH TO BASE SEPOLIA
                    </button>
                  )}

                  <button className="retro-button" onClick={refreshOnChain} disabled={!contractAddress}>
                    REFRESH
                  </button>

                  {bestOnChain !== null && (
                    <div className="instruction-item">Your best on-chain: {bestOnChain}</div>
                  )}
                  {txStatus && <div className="instruction-item">{txStatus}</div>}
                </div>
              </div>

              <div className="modal-section">
                <div className="instruction-title">TOP SCORES</div>
                <div className="leaderboard-list">
                  {leaderboard.length === 0 ? (
                    <div className="instruction-item">No scores yet</div>
                  ) : (
                    leaderboard.slice(0, 10).map((e, i) => (
                      <div key={`${e.player}-${i}`} className="instruction-item">
                        {i + 1}. {e.player.slice(0, 6)}…{e.player.slice(-4)} — {e.score}
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="modal-section">
                <div className="instruction-title">HOW TO PLAY</div>
                <div className="instruction-item">- Use all 3 blocks, then you get 3 new blocks</div>
                <div className="instruction-item">- Fill rows or columns to clear</div>
                <div className="instruction-item">- Save your best score on-chain after Game Over</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
