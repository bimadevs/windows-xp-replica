import React, { useState, useRef, useEffect } from 'react';
import { Minus, Square, X } from 'lucide-react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from './ui/resizable';
import { playSystemSound } from '@/lib/sounds';

interface WindowProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  onMinimize?: () => void;
  onActivate?: () => void;
  isActive?: boolean;
  initialPosition?: { x: number; y: number };
  zIndex?: number;
}

export const Window = ({ 
  title, 
  children, 
  onClose, 
  onMinimize,
  onActivate,
  isActive = false,
  initialPosition = { x: 100, y: 100 },
  zIndex = 10
}: WindowProps) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState({ width: 600, height: 400 });
  const dragRef = useRef<{ isDragging: boolean; startX: number; startY: number }>({
    isDragging: false,
    startX: 0,
    startY: 0
  });

  // Play window open sound on mount
  useEffect(() => {
    playSystemSound('windowOpen');
    
    return () => {
      // Play window close sound on unmount
      playSystemSound('windowClose');
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMaximized) return;
    
    // Activate window on click
    if (onActivate && !isActive) {
      onActivate();
    }
    
    dragRef.current = {
      isDragging: true,
      startX: e.clientX - position.x,
      startY: e.clientY - position.y
    };
  };

  const handleWindowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Activate window on click
    if (onActivate && !isActive) {
      onActivate();
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!dragRef.current.isDragging) return;
    
    const newX = e.clientX - dragRef.current.startX;
    const newY = e.clientY - dragRef.current.startY;
    
    setPosition({
      x: Math.max(0, newX),
      y: Math.max(0, newY)
    });
  };

  const handleMouseUp = () => {
    dragRef.current.isDragging = false;
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
  };

  const handleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onMinimize) {
      playSystemSound('windowClose');
      onMinimize();
    }
  };

  const handleMaximize = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMaximized(!isMaximized);
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div
      className={`fixed bg-[#ECE9D8] rounded shadow-vista-window animate-window-open border
        ${isActive ? 'border-[#0054E3]' : 'border-gray-400'}
        ${isMaximized ? 'inset-0 m-0' : ''}
      `}
      style={!isMaximized ? { 
        left: position.x, 
        top: position.y,
        width: size.width,
        height: size.height,
        zIndex
      } : { zIndex }}
      onClick={handleWindowClick}
    >
      <div
        className={`h-8 rounded-t flex items-center justify-between px-2 cursor-move
          ${isActive 
            ? 'bg-gradient-to-r from-[#0054E3] to-[#2E8AEF]' 
            : 'bg-gradient-to-r from-gray-400 to-gray-500'
          }
        `}
        onMouseDown={handleMouseDown}
      >
        <span className="text-white font-segoe text-sm flex items-center gap-2">
          {title}
        </span>
        <div className="flex items-center gap-[2px]">
          <button
            onClick={handleMinimize}
            className="w-[22px] h-[22px] flex items-center justify-center hover:bg-[#3C81E5] hover:brightness-110 transition-all duration-150 rounded-sm group border border-white/40"
          >
            <Minus className="w-3 h-3 text-white" />
          </button>
          <button
            onClick={handleMaximize}
            className="w-[22px] h-[22px] flex items-center justify-center hover:bg-[#3C81E5] hover:brightness-110 transition-all duration-150 rounded-sm group border border-white/40"
          >
            <Square className="w-3 h-3 text-white" />
          </button>
          <button
            onClick={handleClose}
            className="w-[22px] h-[22px] flex items-center justify-center bg-[#E81123] hover:brightness-110 transition-all duration-150 rounded-sm group border border-white/40"
          >
            <X className="w-3 h-3 text-white" />
          </button>
        </div>
      </div>
      <div className="p-4 bg-[#ECE9D8] h-[calc(100%-2rem)] relative">
        {children}
        {!isMaximized && (
          <>
            <div
              className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
              onMouseDown={(e) => {
                e.stopPropagation();
                const startWidth = size.width;
                const startHeight = size.height;
                const startX = e.clientX;
                const startY = e.clientY;

                const handleResize = (e: MouseEvent) => {
                  const deltaX = e.clientX - startX;
                  const deltaY = e.clientY - startY;
                  setSize({
                    width: Math.max(300, startWidth + deltaX),
                    height: Math.max(200, startHeight + deltaY)
                  });
                };

                const handleMouseUp = () => {
                  document.removeEventListener('mousemove', handleResize);
                  document.removeEventListener('mouseup', handleMouseUp);
                };

                document.addEventListener('mousemove', handleResize);
                document.addEventListener('mouseup', handleMouseUp);
              }}
            />
          </>
        )}
      </div>
    </div>
  );
};