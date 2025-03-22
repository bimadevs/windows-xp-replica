import React, { useState, useEffect } from 'react';
import { playSystemSound } from '@/lib/sounds';

interface MinesweeperProps {
  onClose?: () => void;
}

// Cell interface
interface Cell {
  row: number;
  col: number;
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
}

// Game difficulty presets
const DIFFICULTY = {
  BEGINNER: { rows: 9, cols: 9, mines: 10 },
  INTERMEDIATE: { rows: 16, cols: 16, mines: 40 },
  EXPERT: { rows: 16, cols: 30, mines: 99 }
};

export const Minesweeper = ({ onClose }: MinesweeperProps) => {
  const [difficulty, setDifficulty] = useState(DIFFICULTY.BEGINNER);
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [gameStatus, setGameStatus] = useState<'ready' | 'playing' | 'won' | 'lost'>('ready');
  const [minesLeft, setMinesLeft] = useState(difficulty.mines);
  const [timer, setTimer] = useState(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  const [firstClick, setFirstClick] = useState(true);
  
  // Initialize the game board
  const initializeGame = () => {
    const { rows, cols, mines } = difficulty;
    
    // Create empty grid
    const newGrid: Cell[][] = Array(rows).fill(null).map((_, rowIndex) => 
      Array(cols).fill(null).map((_, colIndex) => ({
        row: rowIndex,
        col: colIndex,
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        neighborMines: 0
      }))
    );
    
    setGrid(newGrid);
    setGameStatus('ready');
    setMinesLeft(mines);
    setTimer(0);
    if (timerInterval) clearInterval(timerInterval);
    setTimerInterval(null);
    setFirstClick(true);
  };
  
  // Place mines after first click
  const placeMines = (grid: Cell[][], firstRow: number, firstCol: number) => {
    const { rows, cols, mines } = difficulty;
    let minesPlaced = 0;
    const newGrid = [...grid];
    
    // Ensure first click is never a mine and its surrounding cells aren't mines
    const safeZone = [];
    for (let r = Math.max(0, firstRow - 1); r <= Math.min(rows - 1, firstRow + 1); r++) {
      for (let c = Math.max(0, firstCol - 1); c <= Math.min(cols - 1, firstCol + 1); c++) {
        safeZone.push(`${r},${c}`);
      }
    }
    
    while (minesPlaced < mines) {
      const randomRow = Math.floor(Math.random() * rows);
      const randomCol = Math.floor(Math.random() * cols);
      
      // Skip if it's in the safe zone or already a mine
      if (safeZone.includes(`${randomRow},${randomCol}`) || 
          newGrid[randomRow][randomCol].isMine) {
        continue;
      }
      
      newGrid[randomRow][randomCol].isMine = true;
      minesPlaced++;
    }
    
    // Calculate neighbor mines
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (!newGrid[r][c].isMine) {
          let mineCount = 0;
          
          // Check all 8 surrounding cells
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              if (dr === 0 && dc === 0) continue;
              
              const newR = r + dr;
              const newC = c + dc;
              
              if (newR >= 0 && newR < rows && newC >= 0 && newC < cols && 
                  newGrid[newR][newC].isMine) {
                mineCount++;
              }
            }
          }
          
          newGrid[r][c].neighborMines = mineCount;
        }
      }
    }
    
    return newGrid;
  };
  
  // Handle cell left click
  const handleCellClick = (row: number, col: number) => {
    if (gameStatus === 'lost' || gameStatus === 'won' || 
        grid[row][col].isRevealed || grid[row][col].isFlagged) {
      return;
    }
    
    // Start timer on first click
    if (gameStatus === 'ready') {
      setGameStatus('playing');
      const interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
      setTimerInterval(interval);
    }
    
    // First click should never be a mine
    if (firstClick) {
      const newGrid = placeMines([...grid], row, col);
      setGrid(newGrid);
      setFirstClick(false);
      revealCell(newGrid, row, col);
      return;
    }
    
    // Handle click on a mine
    if (grid[row][col].isMine) {
      // Game over
      const newGrid = [...grid];
      newGrid[row][col].isRevealed = true;
      
      // Reveal all mines
      for (let r = 0; r < difficulty.rows; r++) {
        for (let c = 0; c < difficulty.cols; c++) {
          if (newGrid[r][c].isMine) {
            newGrid[r][c].isRevealed = true;
          }
        }
      }
      
      setGrid(newGrid);
      setGameStatus('lost');
      if (timerInterval) clearInterval(timerInterval);
      playSystemSound('error');
    } else {
      // Reveal cell and check for win
      const newGrid = [...grid];
      revealCell(newGrid, row, col);
      checkWin(newGrid);
    }
  };
  
  // Reveal a cell
  const revealCell = (grid: Cell[][], row: number, col: number) => {
    const { rows, cols } = difficulty;
    const cell = grid[row][col];
    
    if (cell.isRevealed || cell.isFlagged) return;
    
    cell.isRevealed = true;
    playSystemSound('notification');
    
    // If cell has no neighbor mines, reveal all surrounding cells
    if (cell.neighborMines === 0) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          
          const newR = row + dr;
          const newC = col + dc;
          
          if (newR >= 0 && newR < rows && newC >= 0 && newC < cols && 
              !grid[newR][newC].isRevealed && !grid[newR][newC].isFlagged) {
            revealCell(grid, newR, newC);
          }
        }
      }
    }
  };
  
  // Handle cell right click (flag)
  const handleCellRightClick = (e: React.MouseEvent, row: number, col: number) => {
    e.preventDefault();
    
    if (gameStatus === 'lost' || gameStatus === 'won' || grid[row][col].isRevealed) {
      return;
    }
    
    const newGrid = [...grid];
    const cell = newGrid[row][col];
    
    if (cell.isFlagged) {
      cell.isFlagged = false;
      setMinesLeft(minesLeft + 1);
    } else {
      cell.isFlagged = true;
      setMinesLeft(minesLeft - 1);
    }
    
    setGrid(newGrid);
    playSystemSound('notification');
    checkWin(newGrid);
  };
  
  // Check for win condition
  const checkWin = (grid: Cell[][]) => {
    const { rows, cols } = difficulty;
    
    // Win if all non-mine cells are revealed
    let allNonMinesRevealed = true;
    
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (!grid[r][c].isMine && !grid[r][c].isRevealed) {
          allNonMinesRevealed = false;
          break;
        }
      }
      if (!allNonMinesRevealed) break;
    }
    
    if (allNonMinesRevealed) {
      setGameStatus('won');
      if (timerInterval) clearInterval(timerInterval);
      
      // Flag all mines
      const finalGrid = [...grid];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (finalGrid[r][c].isMine) {
            finalGrid[r][c].isFlagged = true;
          }
        }
      }
      
      setGrid(finalGrid);
      setMinesLeft(0);
      playSystemSound('windowOpen'); // Victory sound
    }
  };
  
  // Change difficulty
  const changeDifficulty = (level: keyof typeof DIFFICULTY) => {
    setDifficulty(DIFFICULTY[level]);
    // Reset game with new difficulty
    setTimeout(initializeGame, 0);
  };
  
  // Initialize game on mount or difficulty change
  useEffect(() => {
    initializeGame();
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [difficulty]);
  
  // Get color based on number of neighbor mines
  const getNumberColor = (num: number): string => {
    switch (num) {
      case 1: return 'text-blue-600';
      case 2: return 'text-green-600';
      case 3: return 'text-red-600';
      case 4: return 'text-blue-900';
      case 5: return 'text-red-900';
      case 6: return 'text-teal-600';
      case 7: return 'text-black';
      case 8: return 'text-gray-600';
      default: return '';
    }
  };
  
  return (
    <div className="flex flex-col h-full bg-[#ECE9D8]">
      {/* Menu bar */}
      <div className="flex text-xs border-b border-gray-400">
        <div className="relative group">
          <button className="px-3 py-1 hover:bg-[#316AC5] hover:text-white">Game</button>
          <div className="absolute hidden group-hover:block left-0 top-full bg-[#ECE9D8] border border-gray-400 shadow-md z-10 w-48">
            <button 
              className="w-full text-left px-4 py-1 hover:bg-[#316AC5] hover:text-white"
              onClick={initializeGame}
            >
              New Game
            </button>
            <div className="border-t border-gray-400 my-1"></div>
            <button 
              className="w-full text-left px-4 py-1 hover:bg-[#316AC5] hover:text-white flex items-center"
              onClick={() => changeDifficulty('BEGINNER')}
            >
              <span className="flex-1">Beginner</span>
              {difficulty === DIFFICULTY.BEGINNER && <span>✓</span>}
            </button>
            <button 
              className="w-full text-left px-4 py-1 hover:bg-[#316AC5] hover:text-white flex items-center"
              onClick={() => changeDifficulty('INTERMEDIATE')}
            >
              <span className="flex-1">Intermediate</span>
              {difficulty === DIFFICULTY.INTERMEDIATE && <span>✓</span>}
            </button>
            <button 
              className="w-full text-left px-4 py-1 hover:bg-[#316AC5] hover:text-white flex items-center"
              onClick={() => changeDifficulty('EXPERT')}
            >
              <span className="flex-1">Expert</span>
              {difficulty === DIFFICULTY.EXPERT && <span>✓</span>}
            </button>
            <div className="border-t border-gray-400 my-1"></div>
            <button 
              className="w-full text-left px-4 py-1 hover:bg-[#316AC5] hover:text-white"
              onClick={onClose}
            >
              Exit
            </button>
          </div>
        </div>
        
        <div className="relative group">
          <button className="px-3 py-1 hover:bg-[#316AC5] hover:text-white">Help</button>
          <div className="absolute hidden group-hover:block left-0 top-full bg-[#ECE9D8] border border-gray-400 shadow-md z-10 w-48">
            <button className="w-full text-left px-4 py-1 hover:bg-[#316AC5] hover:text-white">
              How to Play
            </button>
            <button className="w-full text-left px-4 py-1 hover:bg-[#316AC5] hover:text-white">
              About Minesweeper
            </button>
          </div>
        </div>
      </div>
      
      {/* Game status area */}
      <div className="flex justify-between p-3 bg-[#ECE9D8] border-b border-gray-400">
        <div className="bg-black text-red-500 font-bold px-2 py-1 w-16 text-center">
          {minesLeft.toString().padStart(3, '0')}
        </div>
        
        <button
          className="w-10 h-10 bg-[#ECE9D8] border-t border-l border-white border-r-2 border-b-2 border-r-gray-800 border-b-gray-800 flex items-center justify-center"
          onClick={initializeGame}
        >
          {gameStatus === 'lost' ? '😵' : gameStatus === 'won' ? '😎' : '🙂'}
        </button>
        
        <div className="bg-black text-red-500 font-bold px-2 py-1 w-16 text-center">
          {Math.min(999, timer).toString().padStart(3, '0')}
        </div>
      </div>
      
      {/* Game board */}
      <div className="flex-1 overflow-auto p-3 flex items-start justify-center">
        <div 
          className="border-t border-l border-white border-r-2 border-b-2 border-r-gray-800 border-b-gray-800 bg-[#C0C0C0]"
          style={{ 
            display: 'grid',
            gridTemplateRows: `repeat(${difficulty.rows}, 20px)`,
            gridTemplateColumns: `repeat(${difficulty.cols}, 20px)`
          }}
        >
          {grid.map((row, rowIndex) => 
            row.map((cell, colIndex) => (
              <div 
                key={`${rowIndex}-${colIndex}`}
                className={`w-[20px] h-[20px] flex items-center justify-center text-xs font-bold cursor-pointer select-none
                  ${cell.isRevealed
                    ? 'bg-[#C0C0C0] border border-gray-400'
                    : 'bg-[#C0C0C0] border-t border-l border-white border-r border-b border-gray-800'
                  }`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                onContextMenu={(e) => handleCellRightClick(e, rowIndex, colIndex)}
              >
                {cell.isRevealed ? (
                  cell.isMine ? (
                    <span>💣</span>
                  ) : (
                    cell.neighborMines > 0 ? (
                      <span className={getNumberColor(cell.neighborMines)}>
                        {cell.neighborMines}
                      </span>
                    ) : null
                  )
                ) : (
                  cell.isFlagged ? <span>🚩</span> : null
                )}
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* Game status message */}
      {(gameStatus === 'won' || gameStatus === 'lost') && (
        <div className="bg-[#ECE9D8] p-2 text-xs text-center border-t border-gray-400">
          {gameStatus === 'won' 
            ? `Congratulations! You won in ${timer} seconds.` 
            : 'Game over! You hit a mine.'}
        </div>
      )}
    </div>
  );
}; 