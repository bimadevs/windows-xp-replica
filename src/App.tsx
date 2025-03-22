import React, { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StartupScreen } from './components/StartupScreen';
import { ShutdownScreen } from './components/ShutdownScreen';
import { setSystemVolume, setSystemMuted } from '@/lib/sounds';
import Index from "./pages/Index";

const queryClient = new QueryClient();

function App() {
  const [isStarting, setIsStarting] = useState(true);
  const [isShuttingDown, setIsShuttingDown] = useState(false);
  const [isBooted, setIsBooted] = useState(false);

  // Set up event listeners for shutdown and volume control
  useEffect(() => {
    const handleShutdown = () => {
      setIsShuttingDown(true);
    };

    const handleVolumeChange = (e: CustomEvent<{volume: number}>) => {
      setSystemVolume(e.detail.volume / 100);
    };

    const handleMuteChange = (e: CustomEvent<{muted: boolean}>) => {
      setSystemMuted(e.detail.muted);
    };

    window.addEventListener('shutdown', handleShutdown as EventListener);
    window.addEventListener('volumeChange', handleVolumeChange as EventListener);
    window.addEventListener('muteChange', handleMuteChange as EventListener);

    return () => {
      window.removeEventListener('shutdown', handleShutdown as EventListener);
      window.removeEventListener('volumeChange', handleVolumeChange as EventListener);
      window.removeEventListener('muteChange', handleMuteChange as EventListener);
    };
  }, []);

  // Handle startup completion
  const handleStartupComplete = () => {
    setIsStarting(false);
    setIsBooted(true);
  };

  // Handle shutdown completion
  const handleShutdownComplete = () => {
    // In a real OS this would shut down the system
    // For our demo, we'll restart the boot process
    setIsShuttingDown(false);
    setIsBooted(false);
    setIsStarting(true);
  };

  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          
          {/* Startup Screen */}
          <StartupScreen 
            onStartupComplete={handleStartupComplete} 
            showStartup={isStarting}
          />
          
          {/* Shutdown Screen */}
          <ShutdownScreen 
            isShuttingDown={isShuttingDown}
            onShutdownComplete={handleShutdownComplete}
          />
          
          {/* Main Application (only shown when booted) */}
          {isBooted && !isShuttingDown && (
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
              </Routes>
            </BrowserRouter>
          )}
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
}

export default App;