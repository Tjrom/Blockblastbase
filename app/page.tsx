'use client'

import { useState, useEffect, useCallback } from 'react'
import './game.css'

const BOARD_WIDTH = 10
const BOARD_HEIGHT = 20
const BLOCK_SIZE = 30

// Блоки для игры (разные формы)
const BLOCKS = [
  [[1, 1, 1, 1]], // I
  [[1, 1], [1, 1]], // O
  [[0, 1, 0], [1, 1, 1]], // T
  [[0, 1, 1], [1, 1, 0]], // S
  [[1, 1, 0], [0, 1, 1]], // Z
  [[1, 0, 0], [1, 1, 1]], // L
  [[0, 0, 1], [1, 1, 1]], // J
]

const COLORS = [
  '#00ffff', // Cyan
  '#ffff00', // Yellow
  '#ff00ff', // Magenta
  '#00ff00', // Green
  '#ff0000', // Red
  '#ff8800', // Orange
  '#0000ff', // Blue
]

type Cell = number | null
type Board = Cell[][]

export default function Home() {
  const [board, setBoard] = useState<Board>([])
  const [currentBlock, setCurrentBlock] = useState<number[][]>([])
  const [currentX, setCurrentX] = useState(0)
  const [currentY, setCurrentY] = useState(0)
  const [currentColor, setCurrentColor] = useState('#00ffff')
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [lines, setLines] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)

  // Инициализация пустой доски
  const initBoard = useCallback((): Board => {
    return Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(null))
  }, [])

  // Получить случайный блок
  const getRandomBlock = useCallback(() => {
    const blockIndex = Math.floor(Math.random() * BLOCKS.length)
    return {
      shape: BLOCKS[blockIndex],
      color: COLORS[blockIndex],
    }
  }, [])

  // Инициализация игры
  const initGame = useCallback(() => {
    const newBoard = initBoard()
    const { shape, color } = getRandomBlock()
    setBoard(newBoard)
    setCurrentBlock(shape)
    setCurrentX(Math.floor(BOARD_WIDTH / 2) - Math.floor(shape[0].length / 2))
    setCurrentY(0)
    setCurrentColor(color)
    setScore(0)
    setLevel(1)
    setLines(0)
    setGameOver(false)
    setIsPaused(false)
    setGameStarted(true)
  }, [initBoard, getRandomBlock])

  // Проверка коллизии
  const checkCollision = useCallback((block: number[][], x: number, y: number, board: Board): boolean => {
    for (let row = 0; row < block.length; row++) {
      for (let col = 0; col < block[row].length; col++) {
        if (block[row][col]) {
          const newX = x + col
          const newY = y + row
          
          if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
            return true
          }
          
          if (newY >= 0 && board[newY][newX] !== null) {
            return true
          }
        }
      }
    }
    return false
  }, [])

  // Разместить блок на доске
  const placeBlock = useCallback((block: number[][], x: number, y: number, color: string, board: Board): Board => {
    const newBoard = board.map(row => [...row])
    
    for (let row = 0; row < block.length; row++) {
      for (let col = 0; col < block[row].length; col++) {
        if (block[row][col]) {
          const boardY = y + row
          const boardX = x + col
          if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
            newBoard[boardY][boardX] = color as any
          }
        }
      }
    }
    
    return newBoard
  }, [])

  // Удалить заполненные линии
  const clearLines = useCallback((board: Board): { newBoard: Board; linesCleared: number } => {
    let newBoard = board.map(row => [...row])
    let linesCleared = 0
    
    for (let row = BOARD_HEIGHT - 1; row >= 0; row--) {
      if (newBoard[row].every(cell => cell !== null)) {
        newBoard.splice(row, 1)
        newBoard.unshift(Array(BOARD_WIDTH).fill(null))
        linesCleared++
        row++ // Проверить эту же строку снова
      }
    }
    
    return { newBoard, linesCleared }
  }, [])

  // Движение блока вниз
  const moveDown = useCallback(() => {
    if (gameOver || isPaused || !gameStarted) return

    setBoard(prevBoard => {
      if (checkCollision(currentBlock, currentX, currentY + 1, prevBoard)) {
        // Блок не может двигаться вниз, размещаем его
        const newBoard = placeBlock(currentBlock, currentX, currentY, currentColor, prevBoard)
        const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard)
        
        if (linesCleared > 0) {
          setLines(prev => prev + linesCleared)
          setScore(prev => prev + linesCleared * 100 * level)
          setLevel(prev => Math.floor((prev + linesCleared) / 10) + 1)
        }
        
        // Проверка на game over
        if (checkCollision(currentBlock, currentX, currentY, clearedBoard)) {
          setGameOver(true)
          return clearedBoard
        }
        
        // Новый блок
        const { shape, color } = getRandomBlock()
        setCurrentBlock(shape)
        setCurrentX(Math.floor(BOARD_WIDTH / 2) - Math.floor(shape[0].length / 2))
        setCurrentY(0)
        setCurrentColor(color)
        
        return clearedBoard
      } else {
        setCurrentY(prev => prev + 1)
        return prevBoard
      }
    })
  }, [currentBlock, currentX, currentY, currentColor, gameOver, isPaused, gameStarted, checkCollision, placeBlock, clearLines, getRandomBlock, level])

  // Движение влево
  const moveLeft = useCallback(() => {
    if (gameOver || isPaused || !gameStarted) return

    setBoard(prevBoard => {
      if (!checkCollision(currentBlock, currentX - 1, currentY, prevBoard)) {
        setCurrentX(prev => prev - 1)
      }
      return prevBoard
    })
  }, [currentBlock, currentX, currentY, gameOver, isPaused, gameStarted, checkCollision])

  // Движение вправо
  const moveRight = useCallback(() => {
    if (gameOver || isPaused || !gameStarted) return

    setBoard(prevBoard => {
      if (!checkCollision(currentBlock, currentX + 1, currentY, prevBoard)) {
        setCurrentX(prev => prev + 1)
      }
      return prevBoard
    })
  }, [currentBlock, currentX, currentY, gameOver, isPaused, gameStarted, checkCollision])

  // Поворот блока
  const rotateBlock = useCallback(() => {
    if (gameOver || isPaused || !gameStarted) return

    const rotated = currentBlock[0].map((_, i) =>
      currentBlock.map(row => row[i]).reverse()
    )
    
    setBoard(prevBoard => {
      if (!checkCollision(rotated, currentX, currentY, prevBoard)) {
        setCurrentBlock(rotated)
      }
      return prevBoard
    })
  }, [currentBlock, currentX, currentY, gameOver, isPaused, gameStarted, checkCollision])

  // Обработка клавиатуры
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameStarted) return
      
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault()
          moveLeft()
          break
        case 'ArrowRight':
          e.preventDefault()
          moveRight()
          break
        case 'ArrowDown':
          e.preventDefault()
          moveDown()
          break
        case 'ArrowUp':
        case ' ':
          e.preventDefault()
          rotateBlock()
          break
        case 'p':
        case 'P':
          e.preventDefault()
          setIsPaused(prev => !prev)
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [gameStarted, moveLeft, moveRight, moveDown, rotateBlock])

  // Автоматическое движение вниз
  useEffect(() => {
    if (gameOver || isPaused || !gameStarted) return

    const interval = Math.max(100, 1000 - (level - 1) * 50)
    const timer = setInterval(() => {
      moveDown()
    }, interval)

    return () => clearInterval(timer)
  }, [gameOver, isPaused, gameStarted, level, moveDown])

  // Инициализация при загрузке
  useEffect(() => {
    setBoard(initBoard())
  }, [initBoard])

  // Рендер доски с текущим блоком
  const renderBoard = () => {
    const displayBoard = board.map(row => [...row])
    
    // Добавляем текущий блок на доску для отображения
    if (gameStarted && !gameOver) {
      for (let row = 0; row < currentBlock.length; row++) {
        for (let col = 0; col < currentBlock[row].length; col++) {
          if (currentBlock[row][col]) {
            const boardY = currentY + row
            const boardX = currentX + col
            if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
              displayBoard[boardY][boardX] = currentColor as any
            }
          }
        }
      }
    }
    
    return displayBoard
  }

  const displayBoard = renderBoard()

  return (
    <div className="game-container">
      <div className="game-header">
        <h1 className="game-title">🎮 BLOCK BLAST</h1>
        <p className="game-subtitle">RETRO ARCADE 1980s</p>
      </div>

      <div className="game-wrapper">
        <div className="game-sidebar">
          <div className="game-stats">
            <div className="stat-item">
              <div className="stat-label">SCORE</div>
              <div className="stat-value">{score.toLocaleString()}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">LEVEL</div>
              <div className="stat-value">{level}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">LINES</div>
              <div className="stat-value">{lines}</div>
            </div>
          </div>

          <div className="game-controls">
            {!gameStarted ? (
              <button className="retro-button" onClick={initGame}>
                START GAME
              </button>
            ) : (
              <>
                <button className="retro-button" onClick={() => setIsPaused(prev => !prev)}>
                  {isPaused ? 'RESUME' : 'PAUSE'}
                </button>
                <button className="retro-button" onClick={initGame}>
                  RESTART
                </button>
              </>
            )}
          </div>

          <div className="game-instructions">
            <div className="instruction-title">CONTROLS</div>
            <div className="instruction-item">← → Move</div>
            <div className="instruction-item">↓ Drop</div>
            <div className="instruction-item">↑ / Space Rotate</div>
            <div className="instruction-item">P Pause</div>
          </div>
        </div>

        <div className="game-board-container">
          {gameOver && (
            <div className="game-over">
              <div className="game-over-text">GAME OVER</div>
              <button className="retro-button" onClick={initGame}>
                PLAY AGAIN
              </button>
            </div>
          )}
          {isPaused && (
            <div className="game-paused">
              <div className="game-paused-text">PAUSED</div>
            </div>
          )}
          <div className="game-board">
            {displayBoard.map((row, rowIndex) => (
              <div key={rowIndex} className="board-row">
                {row.map((cell, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={`board-cell ${cell ? 'filled' : ''}`}
                    style={cell ? { backgroundColor: String(cell) } : {}}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
