'use client'

import { useState, useEffect, useCallback } from 'react'
import './game.css'

const BOARD_SIZE = 8

// Различные формы блоков для размещения
const BLOCK_SHAPES = [
  // Одиночные блоки
  [[1]],
  // Двойные блоки
  [[1, 1]],
  [[1], [1]],
  // Тройные блоки
  [[1, 1, 1]],
  [[1], [1], [1]],
  [[1, 1], [1, 0]],
  [[1, 1], [0, 1]],
  [[0, 1], [1, 1]],
  [[1, 0], [1, 1]],
  // Четверные блоки
  [[1, 1, 1, 1]],
  [[1], [1], [1], [1]],
  [[1, 1], [1, 1]],
  [[1, 1, 1], [1, 0, 0]],
  [[1, 1, 1], [0, 0, 1]],
  [[1, 0, 0], [1, 1, 1]],
  [[0, 0, 1], [1, 1, 1]],
  [[1, 1], [1, 0], [1, 0]],
  [[1, 1], [0, 1], [0, 1]],
  [[1, 0], [1, 0], [1, 1]],
  [[0, 1], [0, 1], [1, 1]],
  // Пятерные блоки
  [[1, 1, 1, 1, 1]],
  [[1], [1], [1], [1], [1]],
  [[1, 1, 1], [1, 1, 0]],
  [[1, 1, 1], [0, 1, 1]],
  [[1, 1, 0], [1, 1, 1]],
  [[0, 1, 1], [1, 1, 1]],
  [[1, 1, 1], [1, 0, 1]],
  [[1, 0, 1], [1, 1, 1]],
]

const COLORS = [
  '#00ffff', // Cyan
  '#ffff00', // Yellow
  '#ff00ff', // Magenta
  '#00ff00', // Green
  '#ff0000', // Red
  '#ff8800', // Orange
  '#0000ff', // Blue
  '#ff00ff', // Pink
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
  const [selectedBlock, setSelectedBlock] = useState<{ block: Block; index: number } | null>(null)
  const [previewPosition, setPreviewPosition] = useState<{ row: number; col: number } | null>(null)

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
  }, [initBoard, getRandomBlocks])

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
  const clearLines = useCallback((board: Board): { newBoard: Board; cleared: number } => {
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
    
    return { newBoard, cleared }
  }, [])

  // Обработка клика по доске
  const handleBoardClick = useCallback((row: number, col: number) => {
    if (!selectedBlock || gameOver || !gameStarted) return

    const { block } = selectedBlock
    
    if (canPlaceBlock(block, row, col, board)) {
      const color = COLORS[Math.floor(Math.random() * COLORS.length)]
      const newBoard = placeBlock(block, row, col, color, board)
      const { newBoard: clearedBoard, cleared } = clearLines(newBoard)
      
      if (cleared > 0) {
        setLines(prev => prev + cleared)
        setScore(prev => prev + cleared * 10)
      }
      
      // Удаляем использованный блок и добавляем новый
      const newNextBlocks = [...nextBlocks]
      newNextBlocks.splice(selectedBlock.index, 1)
      
      // Добавляем новый блок если осталось меньше 3
      if (newNextBlocks.length < 3) {
        const randomIndex = Math.floor(Math.random() * BLOCK_SHAPES.length)
        newNextBlocks.push(BLOCK_SHAPES[randomIndex])
      }
      
      setNextBlocks(newNextBlocks)
      setBoard(clearedBoard)
      setSelectedBlock(null)
      setPreviewPosition(null)
      
      // Проверка на game over
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
  }, [selectedBlock, board, nextBlocks, gameOver, gameStarted, canPlaceBlock, placeBlock, clearLines])

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
    setSelectedBlock({ block, index })
  }, [gameOver, gameStarted])

  // Инициализация при загрузке
  useEffect(() => {
    setBoard(initBoard())
    setNextBlocks(getRandomBlocks())
  }, [initBoard, getRandomBlocks])

  // Рендер доски с превью
  const renderBoard = () => {
    const displayBoard = board.map(row => [...row])
    
    // Добавляем превью блока
    if (selectedBlock && previewPosition) {
      const { block } = selectedBlock
      const { row, col } = previewPosition
      
      for (let r = 0; r < block.length; r++) {
        for (let c = 0; c < block[r].length; c++) {
          if (block[r][c]) {
            const boardRow = row + r
            const boardCol = col + c
            if (boardRow >= 0 && boardRow < BOARD_SIZE && boardCol >= 0 && boardCol < BOARD_SIZE) {
              displayBoard[boardRow][boardCol] = 'preview'
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
        <p className="game-subtitle">RETRO ARCADE PUZZLE</p>
      </div>

      <div className="game-wrapper">
        <div className="game-sidebar">
          <div className="game-stats">
            <div className="stat-item">
              <div className="stat-label">SCORE</div>
              <div className="stat-value">{score.toLocaleString()}</div>
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
              <button className="retro-button" onClick={initGame}>
                NEW GAME
              </button>
            )}
          </div>

          <div className="next-blocks">
            <div className="instruction-title">NEXT BLOCKS</div>
            <div className="blocks-container">
              {nextBlocks.map((block, index) => (
                <div
                  key={index}
                  className={`block-preview ${selectedBlock?.index === index ? 'selected' : ''}`}
                  onClick={() => handleBlockSelect(block, index)}
                >
                  {block.map((row, rowIndex) => (
                    <div key={rowIndex} className="block-row">
                      {row.map((cell, colIndex) => (
                        <div
                          key={colIndex}
                          className={`block-cell ${cell ? 'filled' : ''}`}
                          style={cell ? { backgroundColor: COLORS[index % COLORS.length] } : {}}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="game-instructions">
            <div className="instruction-title">HOW TO PLAY</div>
            <div className="instruction-item">1. Click a block</div>
            <div className="instruction-item">2. Place it on board</div>
            <div className="instruction-item">3. Fill lines/columns</div>
            <div className="instruction-item">4. Clear & score!</div>
          </div>
        </div>

        <div className="game-board-container">
          {gameOver && (
            <div className="game-over">
              <div className="game-over-text">GAME OVER</div>
              <div className="game-over-score">Final Score: {score}</div>
              <button className="retro-button" onClick={initGame}>
                PLAY AGAIN
              </button>
            </div>
          )}
          <div className="game-board">
            {displayBoard.map((row, rowIndex) => (
              <div key={rowIndex} className="board-row">
                {row.map((cell, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={`board-cell ${cell ? (cell === 'preview' ? 'preview' : 'filled') : ''}`}
                    style={cell && cell !== 'preview' ? { backgroundColor: String(cell) } : {}}
                    onClick={() => handleBoardClick(rowIndex, colIndex)}
                    onMouseEnter={() => handleBoardHover(rowIndex, colIndex)}
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
