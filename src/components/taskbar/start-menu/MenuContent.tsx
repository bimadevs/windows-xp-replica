import React from 'react';
import { SheetClose } from '../../ui/sheet';

interface MenuItemProps {
  icon: string;
  title: string;
  onClick?: () => void;
  special?: boolean;
}

const MenuItem = ({ icon, title, onClick, special = false }: MenuItemProps) => (
  <SheetClose asChild>
    <button 
      onClick={onClick}
      className={`flex items-center space-x-3 p-2 w-full text-left rounded-sm ${
        special 
          ? 'hover:bg-[#2C5AA7] hover:text-white' 
          : 'hover:bg-[#D6ECF9] hover:text-black'
      }`}
    >
      <img 
        src={icon} 
        alt={title} 
        className="w-7 h-7" 
      />
      <span className={`${special ? 'font-bold' : ''}`}>{title}</span>
    </button>
  </SheetClose>
);

interface MenuItemGroupProps {
  title: string;
  children: React.ReactNode;
}

const MenuItemGroup = ({ title, children }: MenuItemGroupProps) => (
  <div className="mb-4">
    <div className="text-sm font-semibold text-[#0050A0] px-2 py-1 border-b border-[#0050A0]/20">
      {title}
    </div>
    <div className="mt-1">
      {children}
    </div>
  </div>
);

export const MenuContent = () => {
  return (
    <div className="flex h-full overflow-hidden">
      <div className="w-[210px] flex flex-col h-full bg-white pt-2 overflow-y-auto">
        <div className="px-2 space-y-1">
          <MenuItem 
            icon="/images/internet-explorer-icon.png" 
            title="Internet Explorer" 
            special={true}
            onClick={() => window.dispatchEvent(new CustomEvent('openWindow', { detail: { title: 'Internet Explorer' } }))}
          />
          <MenuItem 
            icon="/images/mail-icon.webp" 
            title="E-mail" 
            special={true}
          />
          <div className="border-t border-gray-300 my-2"></div>
          <MenuItem 
            icon="/images/4acedd65-1a68-4afe-a9e3-d0618ac9e82a.png" 
            title="Notepad"
            onClick={() => window.dispatchEvent(new CustomEvent('openWindow', { detail: { title: 'Notepad' } }))}
          />
          <MenuItem 
            icon="/images/paint-icon.webp" 
            title="Paint" 
          />
          <MenuItem 
            icon="/images/media-player-icon.png" 
            title="Windows Media Player" 
          />
          <MenuItem 
            icon="/images/command-prompt-icon.png" 
            title="Command Prompt" 
            onClick={() => window.dispatchEvent(new CustomEvent('openWindow', { detail: { title: 'Command Prompt' } }))}
          />
          <MenuItem 
            icon="/images/calculator-icon.png" 
            title="Calculator" 
            onClick={() => window.dispatchEvent(new CustomEvent('openWindow', { detail: { title: 'Calculator' } }))}
          />
          <MenuItem 
            icon="/images/minesweeper-icon.png" 
            title="Minesweeper" 
            onClick={() => window.dispatchEvent(new CustomEvent('openWindow', { detail: { title: 'Minesweeper' } }))}
          />
        </div>
        <div className="mt-4 px-2">
          <MenuItem 
            icon="/images/all-programs-icon.png" 
            title="All Programs" 
          />
        </div>
      </div>
      <div className="w-[190px] bg-[#EBF3FB] border-l border-gray-300 h-full px-2 py-2 overflow-y-auto">
        <MenuItemGroup title="My Documents">
          <MenuItem 
            icon="/images/f8736e34-c644-4ce0-ad98-f0b518a54160.png" 
            title="My Documents" 
            onClick={() => window.dispatchEvent(new CustomEvent('openWindow', { detail: { title: 'My Documents' } }))}
          />
          <MenuItem 
            icon="/images/9c61f943-1ac0-45ee-9419-4861af0f6b6a.png" 
            title="My Pictures" 
            onClick={() => window.dispatchEvent(new CustomEvent('openWindow', { detail: { title: 'My Pictures' } }))}
          />
          <MenuItem 
            icon="/images/6e35bda1-6465-4300-8789-438e81d958ad.png" 
            title="My Videos" 
            onClick={() => window.dispatchEvent(new CustomEvent('openWindow', { detail: { title: 'My Videos' } }))}
          />
          <MenuItem 
            icon="/images/music-icon.png" 
            title="My Music" 
          />
        </MenuItemGroup>
        
        <MenuItemGroup title="My Computer">
          <MenuItem 
            icon="/images/my-computer-icon.webp" 
            title="My Computer" 
          />
          <MenuItem 
            icon="/images/control-panel-icon.webp" 
            title="Control Panel" 
          />
        </MenuItemGroup>
        
        <MenuItemGroup title="System">
          <MenuItem 
            icon="/images/help-icon.png" 
            title="Help and Support" 
          />
          <MenuItem 
            icon="/images/run-icon.png" 
            title="Run..." 
          />
        </MenuItemGroup>
      </div>
    </div>
  );
};