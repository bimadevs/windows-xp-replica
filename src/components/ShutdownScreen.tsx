import React, { useState, useEffect } from 'react';
import { playSystemSound } from '@/lib/sounds';

interface ShutdownScreenProps {
  onShutdownComplete?: () => void;
  isShuttingDown: boolean;
}

export const ShutdownScreen = ({ onShutdownComplete, isShuttingDown }: ShutdownScreenProps) => {
  const [message, setMessage] = useState('Saving your settings...');
  
  useEffect(() => {
    if (!isShuttingDown) return;

    // Play shutdown sound
    playSystemSound('shutdown');
    
    // Change message after 2 seconds
    const messageTimer = setTimeout(() => {
      setMessage('Shutting down...');
      
      // Call onShutdownComplete after 3 more seconds
      setTimeout(() => {
        if (onShutdownComplete) {
          onShutdownComplete();
        }
      }, 3000);
    }, 2000);
    
    return () => clearTimeout(messageTimer);
  }, [isShuttingDown, onShutdownComplete]);
  
  if (!isShuttingDown) {
    return null;
  }
  
  return (
    <div className="fixed inset-0 bg-[#0C3868] z-50 flex flex-col items-center justify-center">
      <img 
        src="/images/windows-xp-shutdown-logo.png" 
        alt="Windows XP" 
        className="w-64 mb-12"
      />
      
      <div className="w-64 bg-[#2F579F] h-4 rounded-sm overflow-hidden relative">
        <div className="absolute inset-0 flex bg-gradient-to-r from-[#388EEC] to-[#57BFFF] animate-pulse">
        </div>
      </div>
      
      <p className="text-white text-sm mt-4 font-tahoma">
        {message}
      </p>
    </div>
  );
}; 