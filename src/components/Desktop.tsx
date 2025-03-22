import React, { useState, useEffect } from 'react';
import { Window } from './Window';
import { TaskBar } from './TaskBar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Textarea } from './ui/textarea';
import { ContextMenu } from './ContextMenu';
import { InternetExplorer } from './apps/InternetExplorer';
import { Calculator } from './apps/Calculator';
import { Notepad } from './apps/Notepad';
import { Minesweeper } from './apps/Minesweeper';
import { CommandPrompt } from './apps/CommandPrompt';

interface WindowState {
  id: number;
  title: string;
  position: { x: number; y: number };
  isActive: boolean;
  iconUrl?: string;
  minimized: boolean;
}

export const Desktop = () => {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [nextId, setNextId] = useState(1);
  const [activeWindow, setActiveWindow] = useState<number | null>(null);

  useEffect(() => {
    // Listen for start menu events to open windows
    const handleOpenWindow = (e: CustomEvent<{ title: string; iconUrl?: string }>) => {
      openWindow(e.detail.title, e.detail.iconUrl);
    };

    window.addEventListener('openWindow', handleOpenWindow as EventListener);

    return () => {
      window.removeEventListener('openWindow', handleOpenWindow as EventListener);
    };
  }, [windows, nextId]); // Re-add event listener when these dependencies change

  const openWindow = (title: string, iconUrl?: string) => {
    const id = nextId;
    const offset = (windows.length * 30) % 150;
    
    // Set all windows to inactive
    const updatedWindows = windows.map(w => ({
      ...w,
      isActive: false
    }));
    
    // Add new window as active
    setWindows([
      ...updatedWindows, 
      { 
        id, 
        title,
        iconUrl,
        position: { x: 100 + offset, y: 100 + offset },
        isActive: true,
        minimized: false
      }
    ]);
    
    setActiveWindow(id);
    setNextId(nextId + 1);
  };

  const closeWindow = (id: number) => {
    const remainingWindows = windows.filter(w => w.id !== id);
    setWindows(remainingWindows);
    
    // If we closed the active window, activate the last window in the stack
    if (activeWindow === id && remainingWindows.length > 0) {
      const lastWindowId = remainingWindows[remainingWindows.length - 1].id;
      activateWindow(lastWindowId);
    } else if (remainingWindows.length === 0) {
      setActiveWindow(null);
    }
  };

  const closeAllWindows = () => {
    setWindows([]);
    setActiveWindow(null);
  };

  const activateWindow = (id: number) => {
    setWindows(windows.map(w => ({
      ...w,
      isActive: w.id === id
    })));
    setActiveWindow(id);
  };

  const minimizeWindow = (id: number) => {
    setWindows(windows.map(w => {
      if (w.id === id) {
        return { ...w, minimized: true, isActive: false };
      }
      return w;
    }));

    // Activate the last non-minimized window if available
    const visibleWindows = windows.filter(w => !w.minimized && w.id !== id);
    if (visibleWindows.length > 0) {
      activateWindow(visibleWindows[visibleWindows.length - 1].id);
    } else {
      setActiveWindow(null);
    }
  };

  const restoreWindow = (id: number) => {
    // Set all windows to inactive
    const updatedWindows = windows.map(w => ({
      ...w,
      isActive: w.id === id,
      minimized: w.id === id ? false : w.minimized
    }));
    
    setWindows(updatedWindows);
    setActiveWindow(id);
  };

  const desktopIcons = [
    { 
      title: 'My Documents',
      iconUrl: '/images/f8736e34-c644-4ce0-ad98-f0b518a54160.png'
    },
    { 
      title: 'Notepad',
      iconUrl: '/images/4acedd65-1a68-4afe-a9e3-d0618ac9e82a.png'
    },
    { 
      title: 'My Briefcase',
      iconUrl: '/images/1b0d2c84-c6fa-4555-9c61-7ab8f7ef3e2e.png'
    },
    { 
      title: 'My Pictures',
      iconUrl: '/images/9c61f943-1ac0-45ee-9419-4861af0f6b6a.png'
    },
    { 
      title: 'My Videos',
      iconUrl: '/images/6e35bda1-6465-4300-8789-438e81d958ad.png'
    },
    { 
      title: 'Internet Explorer',
      iconUrl: '/images/internet-explorer-icon.png'
    },
    { 
      title: 'Calculator',
      iconUrl: '/images/calculator-icon.png'
    },
    { 
      title: 'Minesweeper',
      iconUrl: '/images/minesweeper-icon.png'
    },
    { 
      title: 'Command Prompt',
      iconUrl: '/images/command-prompt-icon.png'
    }
  ];

  const renderWindowContent = (title: string) => {
    if (title === 'My Documents') {
      return (
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">My Documents</h2>
          <div className="grid grid-cols-4 gap-4">
            <div className="flex flex-col items-center">
              <img src="/images/doc-icon.png" alt="Document" className="w-12 h-12" />
              <span className="text-sm mt-1">Report.doc</span>
            </div>
            <div className="flex flex-col items-center">
              <img src="/images/doc-icon.png" alt="Document" className="w-12 h-12" />
              <span className="text-sm mt-1">Resume.doc</span>
            </div>
            <div className="flex flex-col items-center">
              <img src="/images/pdf-icon.png" alt="PDF" className="w-12 h-12" />
              <span className="text-sm mt-1">Manual.pdf</span>
            </div>
          </div>
        </div>
      );
    } else if (title === 'My Pictures') {
      return (
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">My Pictures</h2>
          <p className="text-gray-600">Content for My Pictures</p>
        </div>
      );
    } else if (title === 'My Videos') {
      return (
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">My Videos</h2>
          <p className="text-gray-600">Content for My Videos</p>
        </div>
      );
    } else if (title === 'Notepad') {
      return <Notepad onClose={() => closeWindow(activeWindow!)} />;
    } else if (title === 'Internet Explorer') {
      return <InternetExplorer onClose={() => closeWindow(activeWindow!)} />;
    } else if (title === 'Calculator') {
      return <Calculator onClose={() => closeWindow(activeWindow!)} />;
    } else if (title === 'Minesweeper') {
      return <Minesweeper onClose={() => closeWindow(activeWindow!)} />;
    } else if (title === 'Command Prompt') {
      return <CommandPrompt onClose={() => closeWindow(activeWindow!)} />;
    }
    return (
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        <p className="text-gray-600">Content for {title}</p>
      </div>
    );
  };

  const handleRefresh = () => {
    console.log('Refreshing desktop...');
    // Implementasi refresh desktop di sini
  };

  const handleArrangeIcons = () => {
    console.log('Arranging icons...');
    // Implementasi pengaturan icon di sini
  };

  const handleChangeBackground = () => {
    console.log('Changing background...');
    // Implementasi untuk mengubah background di sini
  };

  const handleProperties = () => {
    console.log('Opening properties...');
    // Implementasi untuk membuka properties di sini
  };

  return (
    <ContextMenu
      onOpenNotepad={() => openWindow('Notepad', '/images/4acedd65-1a68-4afe-a9e3-d0618ac9e82a.png')}
      onOpenIE={() => openWindow('Internet Explorer', '/images/internet-explorer-icon.png')}
      onRefresh={handleRefresh}
      onArrangeIcons={handleArrangeIcons}
      onChangeBackground={handleChangeBackground}
      onProperties={handleProperties}
    >
      <div 
        className="min-h-screen bg-[url('/images/1ca93d81-8052-47a5-9ebd-bbedc21d0ad5.png')] bg-cover bg-center p-4"
        onMouseDown={() => {
          // Deactivate all windows when clicking on desktop
          if (activeWindow !== null) {
            setWindows(windows.map(w => ({
              ...w,
              isActive: false
            })));
            setActiveWindow(null);
          }
        }}
      >
        <div className="grid grid-cols-auto-fit gap-6 p-4">
          {desktopIcons.map((icon, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation(); // Prevent desktop click handler
                openWindow(icon.title, icon.iconUrl);
              }}
              className="desktop-icon flex flex-col items-center space-y-2 p-2 rounded hover:bg-white/10 transition-colors group w-20"
            >
              <img 
                src={icon.iconUrl} 
                alt={icon.title}
                className="w-12 h-12 drop-shadow-lg"
              />
              <span className="text-white text-sm font-segoe text-center drop-shadow-[1px_1px_2px_rgba(0,0,0,0.8)]">
                {icon.title}
              </span>
            </button>
          ))}
        </div>

        {windows
          .filter(window => !window.minimized)
          .map((window) => (
            <Window
              key={window.id}
              title={window.title}
              isActive={window.isActive}
              onClose={() => closeWindow(window.id)}
              onMinimize={() => minimizeWindow(window.id)}
              onActivate={() => activateWindow(window.id)}
              initialPosition={window.position}
              zIndex={window.isActive ? 50 : 10}
            >
              {renderWindowContent(window.title)}
            </Window>
          ))}
        
        <TaskBar 
          onCloseAllWindows={closeAllWindows} 
          activeWindows={windows}
          onWindowSelect={(id) => {
            const window = windows.find(w => w.id === id);
            if (window) {
              if (window.minimized) {
                restoreWindow(id);
              } else {
                activateWindow(id);
              }
            }
          }}
        />
      </div>
    </ContextMenu>
  );
};