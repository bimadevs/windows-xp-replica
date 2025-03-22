import React from 'react';
import {
  ContextMenu as ShadcnContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

interface ContextMenuProps {
  children: React.ReactNode;
  onNewFolder?: () => void;
  onRefresh?: () => void;
  onChangeBackground?: () => void;
  onArrangeIcons?: () => void;
  onOpenNotepad?: () => void;
  onOpenIE?: () => void;
  onProperties?: () => void;
}

export const ContextMenu = ({ 
  children, 
  onNewFolder,
  onRefresh,
  onChangeBackground,
  onArrangeIcons,
  onOpenNotepad,
  onOpenIE,
  onProperties
}: ContextMenuProps) => {
  return (
    <ShadcnContextMenu>
      <ContextMenuTrigger asChild>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className="bg-[#ECE9D8] border border-gray-400 shadow-md min-w-48 font-tahoma text-sm">
        <ContextMenuSub>
          <ContextMenuSubTrigger className="flex items-center justify-between px-2 py-1 hover:bg-[#316AC5] hover:text-white cursor-default">
            <span>New</span>
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="bg-[#ECE9D8] border border-gray-400 shadow-md min-w-32">
            <ContextMenuItem 
              className="flex items-center px-2 py-1 hover:bg-[#316AC5] hover:text-white cursor-default"
              onClick={onNewFolder}
            >
              Folder
            </ContextMenuItem>
            <ContextMenuItem className="flex items-center px-2 py-1 hover:bg-[#316AC5] hover:text-white cursor-default">
              Shortcut
            </ContextMenuItem>
            <ContextMenuSeparator className="bg-gray-300 my-1" />
            <ContextMenuItem 
              className="flex items-center px-2 py-1 hover:bg-[#316AC5] hover:text-white cursor-default"
              onClick={onOpenNotepad}
            >
              Text Document
            </ContextMenuItem>
            <ContextMenuItem className="flex items-center px-2 py-1 hover:bg-[#316AC5] hover:text-white cursor-default">
              Bitmap Image
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        
        <ContextMenuSeparator className="bg-gray-300 my-1" />
        
        <ContextMenuItem 
          className="flex items-center px-2 py-1 hover:bg-[#316AC5] hover:text-white cursor-default"
          onClick={onArrangeIcons}
        >
          Arrange Icons By
        </ContextMenuItem>
        
        <ContextMenuItem 
          className="flex items-center px-2 py-1 hover:bg-[#316AC5] hover:text-white cursor-default"
          onClick={onRefresh}
        >
          Refresh
        </ContextMenuItem>
        
        <ContextMenuSeparator className="bg-gray-300 my-1" />
        
        <ContextMenuItem 
          className="flex items-center px-2 py-1 hover:bg-[#316AC5] hover:text-white cursor-default"
          onClick={onOpenNotepad}
        >
          Open Notepad
        </ContextMenuItem>
        
        <ContextMenuItem 
          className="flex items-center px-2 py-1 hover:bg-[#316AC5] hover:text-white cursor-default"
          onClick={onOpenIE}
        >
          Open Internet Explorer
        </ContextMenuItem>
        
        <ContextMenuSeparator className="bg-gray-300 my-1" />
        
        <ContextMenuItem 
          className="flex items-center px-2 py-1 hover:bg-[#316AC5] hover:text-white cursor-default"
          onClick={onChangeBackground}
        >
          Change Background
        </ContextMenuItem>
        
        <ContextMenuItem 
          className="flex items-center px-2 py-1 hover:bg-[#316AC5] hover:text-white cursor-default"
          onClick={onProperties}
        >
          Properties
        </ContextMenuItem>
      </ContextMenuContent>
    </ShadcnContextMenu>
  );
}; 