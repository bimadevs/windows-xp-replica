import React from 'react';
import { SheetContent } from '@/components/ui/sheet';
import { UserHeader } from './start-menu/UserHeader';
import { MenuContent } from './start-menu/MenuContent';
import { BottomActions } from './start-menu/BottomActions';

// Changed to default export for lazy loading
export const StartMenu = () => {
  return (
    <SheetContent 
      side="bottom" 
      className="h-auto max-h-[80vh] p-0 w-[400px] left-0 rounded-t-lg shadow-lg overflow-hidden" 
      hideClose
    >
      <div className="flex flex-col overflow-hidden h-full bg-[#3a6ea5] rounded-t-lg">
        <UserHeader />
        <div className="flex-1 overflow-hidden">
          <MenuContent />
        </div>
        <BottomActions />
      </div>
    </SheetContent>
  );
};

export default StartMenu;