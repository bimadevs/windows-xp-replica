import React, { useState, useEffect } from 'react';
import { playSystemSound } from '@/lib/sounds';

interface StartupScreenProps {
  onStartupComplete: () => void;
  showStartup?: boolean;
}

export const StartupScreen = ({ onStartupComplete, showStartup = true }: StartupScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'startup' | 'progress' | 'complete'>('startup');

  useEffect(() => {
    if (!showStartup) {
      onStartupComplete();
      return;
    }

    // Play startup sound
    playSystemSound('startup');

    // Start with Windows XP logo for 2 seconds
    const startupTimer = setTimeout(() => {
      setPhase('progress');
      
      // Then show progress bar that fills over 3 seconds
      const interval = setInterval(() => {
        setProgress(prevProgress => {
          const newProgress = prevProgress + 2;
          
          if (newProgress >= 100) {
            clearInterval(interval);
            
            // After progress is complete, show final screen for 1 second before completing
            setTimeout(() => {
              setPhase('complete');
              setTimeout(onStartupComplete, 1000);
            }, 500);
            
            return 100;
          }
          
          return newProgress;
        });
      }, 60);
      
      return () => clearInterval(interval);
    }, 2000);
    
    return () => clearTimeout(startupTimer);
  }, [onStartupComplete, showStartup]);

  if (!showStartup) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      {phase === 'startup' && (
        <div className="text-center">
          <img 
            src="/images/windows-xp-startup-logo.png" 
            alt="Windows XP"
            className="w-64 mb-8 animate-pulse" 
          />
        </div>
      )}
      
      {phase === 'progress' && (
        <div className="w-full h-full flex flex-col items-center justify-center bg-[#0C3868]">
          <img 
            src="/images/windows-xp-startup-logo.png" 
            alt="Windows XP"
            className="w-64 mb-8" 
          />
          
          <div className="w-64 bg-[#2F579F] h-4 rounded-sm overflow-hidden relative">
            <div 
              className="absolute inset-0 flex"
              style={{ width: '120%', transform: `translateX(-${100 - progress}%)` }}
            >
              {[...Array(6)].map((_, i) => (
                <div 
                  key={i}
                  className="h-full w-16 bg-gradient-to-r from-[#388EEC] to-[#57BFFF]"
                  style={{ marginRight: '10px' }}
                />
              ))}
            </div>
          </div>
          
          <p className="text-white text-sm mt-4 font-tahoma">
            Starting Windows...
          </p>
        </div>
      )}
      
      {phase === 'complete' && (
        <div className="w-full h-full flex items-center justify-center bg-[#0C3868]">
          <p className="text-white text-lg font-tahoma">
            Welcome to Windows XP
          </p>
        </div>
      )}
    </div>
  );
}; 