import React from 'react';

interface TaskbarButtonProps {
  title: string;
  isActive?: boolean;
  iconUrl: string;
  onClick: () => void;
}

export const TaskbarButton = ({ title, isActive = false, iconUrl, onClick }: TaskbarButtonProps) => {
  return (
    <button 
      onClick={onClick}
      className={`h-10 px-2 py-1 flex items-center space-x-1 rounded-sm text-white transition-colors
        ${isActive 
          ? 'bg-gradient-to-b from-blue-500 to-blue-600 border border-blue-300' 
          : 'hover:bg-blue-600 hover:border hover:border-blue-500'
        }
      `}
      title={title}
    >
      <img 
        src={iconUrl} 
        alt={title} 
        className="w-5 h-5" 
      />
      <span className="text-xs font-segoe max-w-32 truncate">{title}</span>
    </button>
  );
}; 