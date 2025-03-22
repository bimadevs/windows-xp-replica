import React, { useState, KeyboardEvent, useEffect } from 'react';
import { playSystemSound } from '@/lib/sounds';

interface CalculatorProps {
  onClose?: () => void;
}

export const Calculator = ({ onClose }: CalculatorProps) => {
  const [display, setDisplay] = useState('0');
  const [memory, setMemory] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [resetOnNextDigit, setResetOnNextDigit] = useState(false);
  
  // Handle digit input
  const handleDigit = (digit: string) => {
    playSystemSound('notification');
    
    if (display === '0' || resetOnNextDigit) {
      setDisplay(digit);
      setResetOnNextDigit(false);
    } else {
      setDisplay(display.length < 12 ? display + digit : display);
    }
  };
  
  // Handle decimal point
  const handleDecimal = () => {
    playSystemSound('notification');
    
    if (resetOnNextDigit) {
      setDisplay('0.');
      setResetOnNextDigit(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };
  
  // Handle operations
  const handleOperation = (op: string) => {
    playSystemSound('notification');
    
    const currentValue = parseFloat(display);
    
    if (prevValue === null) {
      setPrevValue(currentValue);
    } else if (operation) {
      const result = calculate(prevValue, currentValue, operation);
      setPrevValue(result);
      setDisplay(String(result));
    }
    
    setOperation(op);
    setResetOnNextDigit(true);
  };
  
  // Calculate result
  const calculate = (a: number, b: number, op: string): number => {
    switch (op) {
      case '+':
        return a + b;
      case '-':
        return a - b;
      case '*':
        return a * b;
      case '/':
        return b !== 0 ? a / b : 0; // Prevent division by zero
      default:
        return b;
    }
  };
  
  // Handle equals
  const handleEquals = () => {
    playSystemSound('notification');
    
    if (prevValue !== null && operation) {
      const currentValue = parseFloat(display);
      const result = calculate(prevValue, currentValue, operation);
      
      setDisplay(String(result));
      setPrevValue(null);
      setOperation(null);
      setResetOnNextDigit(true);
    }
  };
  
  // Handle clear
  const handleClear = () => {
    playSystemSound('notification');
    setDisplay('0');
    setPrevValue(null);
    setOperation(null);
    setResetOnNextDigit(false);
  };
  
  // Handle backspace
  const handleBackspace = () => {
    playSystemSound('notification');
    
    if (display.length === 1 || display === '0' || resetOnNextDigit) {
      setDisplay('0');
    } else {
      setDisplay(display.slice(0, -1));
    }
  };
  
  // Handle negate
  const handleNegate = () => {
    playSystemSound('notification');
    
    if (display !== '0') {
      setDisplay(display.charAt(0) === '-' ? display.substring(1) : '-' + display);
    }
  };
  
  // Handle percentage
  const handlePercent = () => {
    playSystemSound('notification');
    
    const currentValue = parseFloat(display);
    const percentValue = currentValue / 100;
    setDisplay(String(percentValue));
  };
  
  // Handle square root
  const handleSqrt = () => {
    playSystemSound('notification');
    
    const currentValue = parseFloat(display);
    if (currentValue >= 0) {
      const sqrtValue = Math.sqrt(currentValue);
      setDisplay(String(sqrtValue));
      setResetOnNextDigit(true);
    }
  };
  
  // Handle memory functions
  const handleMemoryStore = () => {
    playSystemSound('notification');
    setMemory(parseFloat(display));
  };
  
  const handleMemoryRecall = () => {
    playSystemSound('notification');
    if (memory !== null) {
      setDisplay(String(memory));
      setResetOnNextDigit(true);
    }
  };
  
  const handleMemoryClear = () => {
    playSystemSound('notification');
    setMemory(null);
  };
  
  const handleMemoryAdd = () => {
    playSystemSound('notification');
    if (memory !== null) {
      setMemory(memory + parseFloat(display));
    } else {
      setMemory(parseFloat(display));
    }
  };
  
  const handleMemorySubtract = () => {
    playSystemSound('notification');
    if (memory !== null) {
      setMemory(memory - parseFloat(display));
    } else {
      setMemory(-parseFloat(display));
    }
  };
  
  // Handle keyboard input
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    const key = e.key;
    
    if (key >= '0' && key <= '9') {
      handleDigit(key);
    } else if (key === '.') {
      handleDecimal();
    } else if (key === '+') {
      handleOperation('+');
    } else if (key === '-') {
      handleOperation('-');
    } else if (key === '*') {
      handleOperation('*');
    } else if (key === '/') {
      handleOperation('/');
    } else if (key === 'Enter' || key === '=') {
      handleEquals();
    } else if (key === 'Escape') {
      handleClear();
    } else if (key === 'Backspace') {
      handleBackspace();
    }
  };
  
  // Style for calculator buttons
  const buttonStyle = "flex items-center justify-center p-2 font-bold text-sm bg-[#ECE9D8] hover:bg-[#CCE4F3] active:bg-[#316AC5] active:text-white border border-gray-400 focus:outline-none";
  
  // Style for operation buttons
  const opButtonStyle = "flex items-center justify-center p-2 font-bold text-sm bg-[#ECE9D8] hover:bg-[#FFEFC1] active:bg-[#FFD680] border border-gray-400 focus:outline-none";
  
  // Style for memory buttons
  const memButtonStyle = "flex items-center justify-center p-2 font-bold text-sm bg-[#ECE9D8] hover:bg-[#E3E3E3] active:bg-[#C7C7C7] border border-gray-400 focus:outline-none";
  
  return (
    <div 
      className="flex flex-col h-full bg-[#ECE9D8] p-1"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {/* Menu bar */}
      <div className="flex text-xs mb-2">
        <button className="px-2 py-1 hover:bg-[#316AC5] hover:text-white">View</button>
        <button className="px-2 py-1 hover:bg-[#316AC5] hover:text-white">Edit</button>
        <button className="px-2 py-1 hover:bg-[#316AC5] hover:text-white">Help</button>
      </div>
      
      {/* Display */}
      <div className="text-right p-2 mb-2 bg-white border border-gray-400 shadow-inner text-xl font-mono h-10 overflow-hidden">
        {display}
      </div>
      
      {/* Calculator buttons */}
      <div className="flex-1 grid grid-cols-5 gap-1">
        {/* Memory row */}
        <button className={memButtonStyle} onClick={handleMemoryClear}>MC</button>
        <button className={memButtonStyle} onClick={handleMemoryRecall}>MR</button>
        <button className={memButtonStyle} onClick={handleMemoryStore}>MS</button>
        <button className={memButtonStyle} onClick={handleMemoryAdd}>M+</button>
        <button className={memButtonStyle} onClick={handleMemorySubtract}>M-</button>
        
        {/* First row */}
        <button className={buttonStyle} onClick={handleBackspace}>←</button>
        <button className={buttonStyle} onClick={handleClear}>CE</button>
        <button className={buttonStyle} onClick={handleClear}>C</button>
        <button className={buttonStyle} onClick={handleNegate}>±</button>
        <button className={buttonStyle} onClick={handleSqrt}>√</button>
        
        {/* Second row */}
        <button className={buttonStyle} onClick={() => handleDigit('7')}>7</button>
        <button className={buttonStyle} onClick={() => handleDigit('8')}>8</button>
        <button className={buttonStyle} onClick={() => handleDigit('9')}>9</button>
        <button className={opButtonStyle} onClick={() => handleOperation('/')}>÷</button>
        <button className={buttonStyle} onClick={handlePercent}>%</button>
        
        {/* Third row */}
        <button className={buttonStyle} onClick={() => handleDigit('4')}>4</button>
        <button className={buttonStyle} onClick={() => handleDigit('5')}>5</button>
        <button className={buttonStyle} onClick={() => handleDigit('6')}>6</button>
        <button className={opButtonStyle} onClick={() => handleOperation('*')}>×</button>
        <button className={buttonStyle} onClick={() => {
          const inverse = 1 / parseFloat(display);
          setDisplay(String(inverse));
          setResetOnNextDigit(true);
        }}>1/x</button>
        
        {/* Fourth row */}
        <button className={buttonStyle} onClick={() => handleDigit('1')}>1</button>
        <button className={buttonStyle} onClick={() => handleDigit('2')}>2</button>
        <button className={buttonStyle} onClick={() => handleDigit('3')}>3</button>
        <button className={opButtonStyle} onClick={() => handleOperation('-')}>-</button>
        <button 
          className={`${opButtonStyle} row-span-2`} 
          onClick={handleEquals}
        >=</button>
        
        {/* Fifth row */}
        <button className={`${buttonStyle} col-span-2`} onClick={() => handleDigit('0')}>0</button>
        <button className={buttonStyle} onClick={handleDecimal}>.</button>
        <button className={opButtonStyle} onClick={() => handleOperation('+')}>+</button>
      </div>
    </div>
  );
}; 