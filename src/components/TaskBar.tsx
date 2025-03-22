import React, { Suspense, lazy } from 'react';
import { Sheet } from './ui/sheet';
import { StartButton } from './taskbar/StartButton';
import { SystemTray } from './taskbar/SystemTray';
import { TaskbarButton } from './taskbar/TaskbarButton';

// Lazy load the StartMenu component
const StartMenu = lazy(() => import('./taskbar/StartMenu').then(module => ({ 
  default: module.StartMenu 
})));

interface WindowState {
  id: number;
  title: string;
  position: { x: number; y: number };
  isActive?: boolean;
  iconUrl?: string;
}

interface TaskBarProps {
  onCloseAllWindows?: () => void;
  activeWindows?: WindowState[];
  onWindowSelect?: (id: number) => void;
}

export const TaskBar = ({ onCloseAllWindows, activeWindows = [], onWindowSelect }: TaskBarProps) => {
  return (
    <Sheet>
      <div className="fixed bottom-0 left-0 right-0 h-12 bg-gradient-to-r from-blue-700 to-blue-600 border-t border-blue-400 flex items-center justify-between px-1 z-50">
        <div className="flex items-center h-full gap-2 overflow-x-auto max-w-[75%] no-scrollbar">
          <StartButton />
          <div className="h-[2px] bg-blue-400/30 mx-1 flex-shrink-0" />
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {activeWindows.map((window) => (
              <TaskbarButton 
                key={window.id}
                title={window.title}
                isActive={window.isActive}
                iconUrl={window.iconUrl || getDefaultIconForTitle(window.title)}
                onClick={() => onWindowSelect && onWindowSelect(window.id)}
              />
            ))}
          </div>
        </div>
        <SystemTray onCloseAllWindows={onCloseAllWindows} />
      </div>
      <Suspense fallback={<div className="h-[70vh] w-[400px] bg-[#3a6ea5] animate-pulse" />}>
        <StartMenu />
      </Suspense>
    </Sheet>
  );
};

// Helper function to get default icon based on title
function getDefaultIconForTitle(title: string): string {
  switch (title) {
    case 'Notepad':
      return '/images/4acedd65-1a68-4afe-a9e3-d0618ac9e82a.png';
    case 'My Documents':
      return '/images/f8736e34-c644-4ce0-ad98-f0b518a54160.png';
    case 'My Pictures':
      return '/images/9c61f943-1ac0-45ee-9419-4861af0f6b6a.png';
    case 'My Videos':
      return '/images/6e35bda1-6465-4300-8789-438e81d958ad.png';
    case 'My Briefcase':
      return '/images/1b0d2c84-c6fa-4555-9c61-7ab8f7ef3e2e.png';
    case 'Internet Explorer':
      return '/images/internet-explorer-icon.png';
    default:
      return '/images/f8736e34-c644-4ce0-ad98-f0b518a54160.png';
  }
}