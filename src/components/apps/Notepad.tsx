import React, { useState, useEffect } from 'react';
import { playSystemSound } from '@/lib/sounds';

interface NotepadProps {
  onClose?: () => void;
}

export const Notepad = ({ onClose }: NotepadProps) => {
  const [text, setText] = useState('');
  const [fileName, setFileName] = useState('Untitled.txt');
  const [isModified, setIsModified] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [isWordWrap, setIsWordWrap] = useState(true);
  const [fontSize, setFontSize] = useState(14);
  
  // Auto-save to local storage
  useEffect(() => {
    // Load saved text if available
    const savedText = localStorage.getItem('notepadText');
    const savedFileName = localStorage.getItem('notepadFileName');
    
    if (savedText) {
      setText(savedText);
    }
    
    if (savedFileName) {
      setFileName(savedFileName);
    }
    
    // Set up interval to save content
    const saveInterval = setInterval(() => {
      if (isModified) {
        localStorage.setItem('notepadText', text);
        localStorage.setItem('notepadFileName', fileName);
        setIsModified(false);
      }
    }, 5000);
    
    return () => clearInterval(saveInterval);
  }, [text, fileName, isModified]);
  
  // Handle text change
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    setIsModified(true);
  };
  
  // Handle file name change
  const handleFileNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileName(e.target.value);
    setIsModified(true);
  };
  
  // Save file
  const handleSave = () => {
    playSystemSound('notification');
    localStorage.setItem('notepadText', text);
    localStorage.setItem('notepadFileName', fileName);
    setIsModified(false);
    setShowSaveDialog(false);
  };
  
  // New file
  const handleNew = () => {
    if (isModified) {
      setShowSaveDialog(true);
    } else {
      setText('');
      setFileName('Untitled.txt');
    }
  };
  
  // Toggle word wrap
  const toggleWordWrap = () => {
    setIsWordWrap(!isWordWrap);
  };
  
  // Change font size
  const changeFontSize = (size: number) => {
    setFontSize(size);
  };
  
  return (
    <div className="flex flex-col h-full bg-[#ECE9D8]">
      {/* Menubar */}
      <div className="flex text-xs border-b border-gray-400">
        <div className="relative group">
          <button className="px-3 py-1 hover:bg-[#316AC5] hover:text-white">File</button>
          <div className="absolute hidden group-hover:block left-0 top-full bg-[#ECE9D8] border border-gray-400 shadow-md z-10 w-48">
            <button 
              className="w-full text-left px-4 py-1 hover:bg-[#316AC5] hover:text-white flex items-center"
              onClick={handleNew}
            >
              <span className="flex-1">New</span>
              <span className="text-gray-500">Ctrl+N</span>
            </button>
            <button className="w-full text-left px-4 py-1 hover:bg-[#316AC5] hover:text-white flex items-center">
              <span className="flex-1">Open...</span>
              <span className="text-gray-500">Ctrl+O</span>
            </button>
            <button 
              className="w-full text-left px-4 py-1 hover:bg-[#316AC5] hover:text-white flex items-center"
              onClick={() => setShowSaveDialog(true)}
            >
              <span className="flex-1">Save</span>
              <span className="text-gray-500">Ctrl+S</span>
            </button>
            <button className="w-full text-left px-4 py-1 hover:bg-[#316AC5] hover:text-white">
              Save As...
            </button>
            <div className="border-t border-gray-400 my-1"></div>
            <button className="w-full text-left px-4 py-1 hover:bg-[#316AC5] hover:text-white">
              Page Setup...
            </button>
            <button className="w-full text-left px-4 py-1 hover:bg-[#316AC5] hover:text-white">
              Print...
            </button>
            <div className="border-t border-gray-400 my-1"></div>
            <button 
              className="w-full text-left px-4 py-1 hover:bg-[#316AC5] hover:text-white"
              onClick={onClose}
            >
              Exit
            </button>
          </div>
        </div>
        
        <div className="relative group">
          <button className="px-3 py-1 hover:bg-[#316AC5] hover:text-white">Edit</button>
          <div className="absolute hidden group-hover:block left-0 top-full bg-[#ECE9D8] border border-gray-400 shadow-md z-10 w-48">
            <button className="w-full text-left px-4 py-1 hover:bg-[#316AC5] hover:text-white flex items-center">
              <span className="flex-1">Undo</span>
              <span className="text-gray-500">Ctrl+Z</span>
            </button>
            <div className="border-t border-gray-400 my-1"></div>
            <button className="w-full text-left px-4 py-1 hover:bg-[#316AC5] hover:text-white flex items-center">
              <span className="flex-1">Cut</span>
              <span className="text-gray-500">Ctrl+X</span>
            </button>
            <button className="w-full text-left px-4 py-1 hover:bg-[#316AC5] hover:text-white flex items-center">
              <span className="flex-1">Copy</span>
              <span className="text-gray-500">Ctrl+C</span>
            </button>
            <button className="w-full text-left px-4 py-1 hover:bg-[#316AC5] hover:text-white flex items-center">
              <span className="flex-1">Paste</span>
              <span className="text-gray-500">Ctrl+V</span>
            </button>
            <button className="w-full text-left px-4 py-1 hover:bg-[#316AC5] hover:text-white flex items-center">
              <span className="flex-1">Delete</span>
              <span className="text-gray-500">Del</span>
            </button>
            <div className="border-t border-gray-400 my-1"></div>
            <button className="w-full text-left px-4 py-1 hover:bg-[#316AC5] hover:text-white flex items-center">
              <span className="flex-1">Select All</span>
              <span className="text-gray-500">Ctrl+A</span>
            </button>
            <button className="w-full text-left px-4 py-1 hover:bg-[#316AC5] hover:text-white">
              Time/Date
            </button>
          </div>
        </div>
        
        <div className="relative group">
          <button className="px-3 py-1 hover:bg-[#316AC5] hover:text-white">Format</button>
          <div className="absolute hidden group-hover:block left-0 top-full bg-[#ECE9D8] border border-gray-400 shadow-md z-10 w-48">
            <button 
              className="w-full text-left px-4 py-1 hover:bg-[#316AC5] hover:text-white flex items-center"
              onClick={toggleWordWrap}
            >
              <span className="flex-1">Word Wrap</span>
              {isWordWrap && <span>✓</span>}
            </button>
            <button className="w-full text-left px-4 py-1 hover:bg-[#316AC5] hover:text-white">
              Font...
            </button>
          </div>
        </div>
        
        <div className="relative group">
          <button className="px-3 py-1 hover:bg-[#316AC5] hover:text-white">View</button>
          <div className="absolute hidden group-hover:block left-0 top-full bg-[#ECE9D8] border border-gray-400 shadow-md z-10 w-48">
            <div className="relative group/submenu">
              <button className="w-full text-left px-4 py-1 hover:bg-[#316AC5] hover:text-white flex items-center justify-between">
                <span>Zoom</span>
                <span>▶</span>
              </button>
              <div className="absolute hidden group-hover/submenu:block left-full top-0 bg-[#ECE9D8] border border-gray-400 shadow-md z-20 w-48">
                <button 
                  className="w-full text-left px-4 py-1 hover:bg-[#316AC5] hover:text-white"
                  onClick={() => changeFontSize(12)}
                >
                  Small
                </button>
                <button 
                  className="w-full text-left px-4 py-1 hover:bg-[#316AC5] hover:text-white"
                  onClick={() => changeFontSize(14)}
                >
                  Medium
                </button>
                <button 
                  className="w-full text-left px-4 py-1 hover:bg-[#316AC5] hover:text-white"
                  onClick={() => changeFontSize(18)}
                >
                  Large
                </button>
              </div>
            </div>
            <button className="w-full text-left px-4 py-1 hover:bg-[#316AC5] hover:text-white">
              Status Bar
            </button>
          </div>
        </div>
        
        <div className="relative group">
          <button className="px-3 py-1 hover:bg-[#316AC5] hover:text-white">Help</button>
          <div className="absolute hidden group-hover:block left-0 top-full bg-[#ECE9D8] border border-gray-400 shadow-md z-10 w-48">
            <button className="w-full text-left px-4 py-1 hover:bg-[#316AC5] hover:text-white">
              View Help
            </button>
            <div className="border-t border-gray-400 my-1"></div>
            <button className="w-full text-left px-4 py-1 hover:bg-[#316AC5] hover:text-white">
              About Notepad
            </button>
          </div>
        </div>
      </div>
      
      {/* Editor area */}
      <textarea
        className={`flex-1 p-2 resize-none focus:outline-none font-mono bg-white`}
        style={{ 
          fontSize: `${fontSize}px`, 
          wordWrap: isWordWrap ? 'break-word' : 'normal',
          whiteSpace: isWordWrap ? 'pre-wrap' : 'pre'
        }}
        value={text}
        onChange={handleTextChange}
        placeholder="Start typing here..."
      />
      
      {/* Status bar */}
      <div className="bg-[#ECE9D8] border-t border-gray-400 p-1 text-xs flex justify-between">
        <span>Ln 1, Col 1</span>
        <span>{isModified ? "Modified" : "Saved"}</span>
      </div>
      
      {/* Save dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-[#ECE9D8] border border-gray-400 shadow-md w-96 rounded">
            <div className="h-8 bg-gradient-to-r from-[#0054E3] to-[#2E8AEF] flex items-center px-3">
              <span className="text-white text-xs font-semibold">Save As</span>
            </div>
            <div className="p-4">
              <div className="mb-4">
                <label className="block text-xs mb-1">File name:</label>
                <input 
                  type="text" 
                  className="w-full px-2 py-1 border border-gray-400 text-sm"
                  value={fileName}
                  onChange={handleFileNameChange}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button 
                  className="px-3 py-1 bg-[#ECE9D8] border border-gray-400 shadow text-xs"
                  onClick={handleSave}
                >
                  Save
                </button>
                <button 
                  className="px-3 py-1 bg-[#ECE9D8] border border-gray-400 shadow text-xs"
                  onClick={() => setShowSaveDialog(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 