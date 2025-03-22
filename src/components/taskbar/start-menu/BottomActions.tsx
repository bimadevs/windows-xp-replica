import React from 'react';
import { SheetClose } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { LogOut, Power } from 'lucide-react';

export const BottomActions = () => {
  const handleShutdown = () => {
    // Dispatch shutdown event to be caught by App.tsx
    window.dispatchEvent(new CustomEvent('shutdown'));
  };

  return (
    <div className="border-t border-[#0A246A] py-2 bg-[#1F3B7B] px-2 rounded-b-lg flex-shrink-0">
      <div className="flex items-center justify-between text-white">
        <div className="flex items-center space-x-3">
          <LogOut className="w-6 h-6" />
          <div>
            <div className="font-bold">Log Off</div>
            <div className="text-xs">Windows</div>
          </div>
        </div>
        
        <SheetClose asChild>
          <Button 
            variant="link" 
            className="text-white hover:text-white flex items-center space-x-3 p-0"
            onClick={handleShutdown}
          >
            <Power className="w-6 h-6" />
            <div>
              <div className="font-bold">Turn Off</div>
              <div className="text-xs">Computer</div>
            </div>
          </Button>
        </SheetClose>
      </div>
    </div>
  );
};