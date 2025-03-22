import React, { useState, useEffect, useRef } from 'react';
import { playSystemSound } from '@/lib/sounds';

interface CommandPromptProps {
  onClose?: () => void;
}

interface Command {
  input: string;
  output: string;
}

export const CommandPrompt = ({ onClose }: CommandPromptProps) => {
  const [commands, setCommands] = useState<Command[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [currentDirectory, setCurrentDirectory] = useState('C:\\Windows\\System32');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // File system simulation
  const fileSystem = {
    'C:\\': {
      type: 'dir',
      content: ['Windows', 'Program Files', 'Users', 'autoexec.bat', 'config.sys']
    },
    'C:\\Windows': {
      type: 'dir',
      content: ['System32', 'Fonts', 'Cursors', 'winxp.dll', 'explorer.exe']
    },
    'C:\\Windows\\System32': {
      type: 'dir',
      content: ['cmd.exe', 'notepad.exe', 'calc.exe', 'drivers', 'config']
    },
    'C:\\Program Files': {
      type: 'dir',
      content: ['Internet Explorer', 'Windows NT', 'Movie Maker', 'Accessories']
    },
    'C:\\Users': {
      type: 'dir',
      content: ['Administrator', 'Guest', 'Default']
    },
    'C:\\Users\\Administrator': {
      type: 'dir',
      content: ['Documents', 'Desktop', 'Downloads', 'My Pictures', 'My Music']
    }
  };

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Scroll to bottom when commands change
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [commands]);

  // Handle command execution
  const executeCommand = (input: string) => {
    if (!input.trim()) {
      addCommand(input, '');
      return;
    }

    // Add to history
    setCommandHistory(prev => [input, ...prev].slice(0, 50));
    setHistoryIndex(-1);

    // Process command
    const parts = input.trim().split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    playSystemSound('notification');

    switch (command) {
      case 'help':
        handleHelp();
        break;
      case 'cls':
        handleClear();
        break;
      case 'dir':
        handleDir();
        break;
      case 'cd':
        handleCd(args);
        break;
      case 'echo':
        handleEcho(args);
        break;
      case 'type':
        handleType(args);
        break;
      case 'date':
        handleDate();
        break;
      case 'time':
        handleTime();
        break;
      case 'ver':
        handleVer();
        break;
      case 'exit':
        handleExit();
        break;
      case 'systeminfo':
        handleSystemInfo();
        break;
      case 'prompt':
        handlePrompt(args);
        break;
      case 'calc':
        handleCalc();
        break;
      case 'notepad':
        handleNotepad();
        break;
      case 'color':
        handleColor();
        break;
      default:
        addCommand(input, `'${command}' is not recognized as an internal or external command, operable program or batch file.`);
    }
  };

  // Command handlers
  const handleHelp = () => {
    const helpText = `
Berikut adalah beberapa perintah internal yang tersedia:

HELP     - Menampilkan bantuan untuk perintah
CLS      - Membersihkan layar
DIR      - Menampilkan daftar file dan direktori
CD       - Menampilkan atau mengubah direktori saat ini
ECHO     - Menampilkan pesan
TYPE     - Menampilkan isi file teks
DATE     - Menampilkan atau mengubah tanggal
TIME     - Menampilkan atau mengubah waktu
VER      - Menampilkan versi Windows
EXIT     - Keluar dari Command Prompt
SYSTEMINFO - Menampilkan informasi sistem
PROMPT   - Mengubah prompt command line
CALC     - Menjalankan Calculator
NOTEPAD  - Menjalankan Notepad
COLOR    - Mengubah warna teks dan latar belakang
`.trim();
    addCommand('help', helpText);
  };

  const handleClear = () => {
    setCommands([]);
  };

  const handleDir = () => {
    const currentPath = currentDirectory;
    const fsEntry = fileSystem[currentPath];
    
    if (!fsEntry) {
      addCommand('dir', `Directory not found: ${currentPath}`);
      return;
    }
    
    let output = ` Directory of ${currentPath}\n\n`;
    
    const date = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    
    const time = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    
    fsEntry.content.forEach(item => {
      if (item.endsWith('.exe') || item.endsWith('.bat') || item.endsWith('.dll') || item.endsWith('.sys')) {
        output += `${date}  ${time}    ${Math.floor(Math.random() * 1000000).toString().padStart(10, ' ')} ${item}\n`;
      } else {
        output += `${date}  ${time}    <DIR>          ${item}\n`;
      }
    });
    
    output += `               ${fsEntry.content.length} File(s)`;
    addCommand('dir', output);
  };

  const handleCd = (args: string[]) => {
    if (!args.length || args[0] === '/?' || args[0] === '--help') {
      const helpText = `
CD [path]
  Displays the name of or changes the current directory.

CD..  : Moves to the parent directory.
CD\\   : Moves to the root of current drive.
CD     : Displays the current directory.
`.trim();
      addCommand('cd ' + (args[0] || ''), helpText);
      return;
    }

    if (args[0] === '.') {
      // Stay in current directory
      addCommand('cd .', currentDirectory);
      return;
    }

    if (args[0] === '..') {
      // Go to parent directory
      const parts = currentDirectory.split('\\');
      if (parts.length > 1) {
        parts.pop();
        const newDir = parts.join('\\');
        setCurrentDirectory(newDir || 'C:\\');
        addCommand('cd ..', '');
      } else {
        addCommand('cd ..', 'Already at root directory.');
      }
      return;
    }

    if (args[0] === '\\') {
      // Go to root
      setCurrentDirectory('C:\\');
      addCommand('cd \\', '');
      return;
    }

    // Try to change to specified directory
    let targetPath = args[0];
    if (!targetPath.includes(':\\')) {
      // Relative path
      targetPath = currentDirectory + '\\' + targetPath;
    }

    if (fileSystem[targetPath]) {
      setCurrentDirectory(targetPath);
      addCommand(`cd ${args[0]}`, '');
    } else {
      addCommand(`cd ${args[0]}`, `The system cannot find the path specified: ${targetPath}`);
    }
  };

  const handleEcho = (args: string[]) => {
    if (!args.length) {
      addCommand('echo', 'ECHO is on.');
      return;
    }

    if (args[0] === 'off') {
      addCommand('echo off', 'ECHO is now off.');
      return;
    }

    if (args[0] === 'on') {
      addCommand('echo on', 'ECHO is now on.');
      return;
    }

    const message = args.join(' ');
    addCommand(`echo ${message}`, message);
  };

  const handleType = (args: string[]) => {
    if (!args.length) {
      addCommand('type', 'Required parameter missing.');
      return;
    }

    const filename = args[0];
    if (filename === 'autoexec.bat') {
      addCommand(`type ${filename}`, '@ECHO OFF\nPATH=%PATH%;C:\\Windows;C:\\Windows\\System32\nPROMPT=$P$G');
    } else if (filename === 'config.sys') {
      addCommand(`type ${filename}`, 'FILES=30\nBUFFERS=20');
    } else {
      addCommand(`type ${filename}`, `The system cannot find the file specified: ${filename}`);
    }
  };

  const handleDate = () => {
    const today = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    addCommand('date', `Current date is: ${today}`);
  };

  const handleTime = () => {
    const now = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
    addCommand('time', `Current time is: ${now}`);
  };

  const handleVer = () => {
    addCommand('ver', 'Microsoft Windows XP [Version 5.1.2600]');
  };

  const handleExit = () => {
    addCommand('exit', 'Exiting Command Prompt...');
    if (onClose) {
      setTimeout(onClose, 500);
    }
  };

  const handleSystemInfo = () => {
    const info = `
Host Name:                 WINXP-PC
OS Name:                   Microsoft Windows XP Professional
OS Version:                5.1.2600 Service Pack 3 Build 2600
OS Manufacturer:           Microsoft Corporation
System Manufacturer:       Virtual Machine
System Model:              Windows XP Clone
System Type:               X86-based PC
Processor:                 x86 Family 6 Model 142 Stepping 9 GenuineIntel ~2200 Mhz
BIOS Version:              Virtual Machine Bios
Windows Directory:         C:\\WINDOWS
System Directory:          C:\\WINDOWS\\System32
Boot Device:               \\Device\\HarddiskVolume1
System Locale:             en-us;English (United States)
Input Locale:              en-us;English (United States)
Time Zone:                 (GMT-08:00) Pacific Time (US & Canada)
Total Physical Memory:     512 MB
Available Physical Memory: 256 MB
Virtual Memory: Max Size:  2,048 MB
Virtual Memory: Available: 1,024 MB
Virtual Memory: In Use:    1,024 MB
Page File Location(s):     C:\\pagefile.sys
`.trim();
    addCommand('systeminfo', info);
  };

  const handlePrompt = (args: string[]) => {
    if (!args.length) {
      addCommand('prompt', 'Current prompt format: $P$G');
      return;
    }
    addCommand(`prompt ${args.join(' ')}`, 'Prompt format changed.');
  };

  const handleCalc = () => {
    addCommand('calc', 'Starting Calculator...');
    window.dispatchEvent(new CustomEvent('openWindow', { detail: { title: 'Calculator' } }));
  };

  const handleNotepad = () => {
    addCommand('notepad', 'Starting Notepad...');
    window.dispatchEvent(new CustomEvent('openWindow', { detail: { title: 'Notepad' } }));
  };

  const handleColor = () => {
    addCommand('color', 'Command not implemented in this version.');
  };

  // Add command and output to history
  const addCommand = (input: string, output: string) => {
    setCommands(prev => [...prev, { input, output }]);
    setCurrentInput('');
  };

  // Handle input submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeCommand(currentInput);
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentInput(e.target.value);
  };

  // Handle keyboard navigation through command history
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCurrentInput('');
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-black text-white font-mono text-sm">
      <div className="h-6 bg-[#000080] text-white flex items-center px-2 text-sm">
        <span>Command Prompt</span>
      </div>
      
      <div 
        ref={containerRef}
        className="flex-1 p-2 overflow-y-auto whitespace-pre-wrap"
        onClick={() => inputRef.current?.focus()}
      >
        <div className="mb-2">Microsoft Windows XP [Version 5.1.2600]</div>
        <div className="mb-4">Copyright (C) 1985-2001 Microsoft Corp.</div>
        
        {commands.map((cmd, index) => (
          <div key={index} className="mb-1">
            <div>{currentDirectory}&gt;{cmd.input}</div>
            {cmd.output && <div className="whitespace-pre-wrap">{cmd.output}</div>}
          </div>
        ))}
        
        <form onSubmit={handleSubmit} className="flex">
          <div className="flex-shrink-0">{currentDirectory}&gt;</div>
          <input
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-black text-white border-none outline-none ml-1"
            autoFocus
          />
        </form>
      </div>
    </div>
  );
}; 