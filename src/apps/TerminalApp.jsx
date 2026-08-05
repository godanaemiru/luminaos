import React, { useState, useEffect, useRef } from 'react';

export const TerminalApp = ({ os }) => {
  const [currentDirId, setCurrentDirId] = useState('root');
  const [history, setHistory] = useState([
    { type: 'output', text: 'LuminaOS v1.0.0 (Linux x86_64)' },
    { type: 'output', text: 'Type "help" for a list of available commands.' },
  ]);
  const [input, setInput] = useState('');
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const getCurrentPathName = () => {
    if (currentDirId === 'root') return '~';
    const folder = os.vfs.find(f => f.id === currentDirId);
    return folder ? `~/${folder.title}` : '~';
  };

  const handleCommand = (e) => {
    if (e.key === 'Enter') {
      const fullCmd = input.trim();
      const parts = fullCmd.split(' ');
      const cmd = parts[0].toLowerCase();
      const args = parts.slice(1);
      let output = '';

      switch (cmd) {
        case 'help':
          output = 'Available commands: help, whoami, ls, cd, mkdir, touch, cat, clear, date, neofetch, sudo';
          break;
        case 'whoami':
          output = 'guest_user';
          break;
        case 'ls': {
          const items = os.vfs.filter(item => item.parentId === currentDirId);
          output = items.map(item => item.type === 'folder' ? `${item.title}/` : item.title).join('  ');
          break;
        }
        case 'cd':
          if (!args[0] || args[0] === '~' || args[0] === '/') {
            setCurrentDirId('root');
          } else if (args[0] === '..') {
            const current = os.vfs.find(f => f.id === currentDirId);
            if (current && current.parentId) {
              setCurrentDirId(current.parentId);
            } else {
              setCurrentDirId('root');
            }
          } else {
            const folder = os.vfs.find(f => f.type === 'folder' && f.parentId === currentDirId && f.title.toLowerCase() === args[0].toLowerCase());
            if (folder) {
              setCurrentDirId(folder.id);
            } else {
              output = `cd: ${args[0]}: No such directory`;
            }
          }
          break;
        case 'mkdir':
          if (args[0]) {
            const id = os.createFolder(currentDirId);
            // We can't easily set the title immediately because createFolder returns the ID but sets a default title
            // For a better experience, we'd need to modify App.jsx to allow passing a title to createFolder
            os.renameItem(id, args[0]);
            output = `Created directory: ${args[0]}`;
          } else {
            output = 'mkdir: missing operand';
          }
          break;
        case 'touch':
          if (args[0]) {
            const id = os.createFile(currentDirId);
            os.renameItem(id, args[0]);
            output = `Created file: ${args[0]}`;
          } else {
            output = 'touch: missing operand';
          }
          break;
        case 'cat':
          if (args[0]) {
            const file = os.vfs.find(f => f.type === 'file' && f.parentId === currentDirId && f.title.toLowerCase() === args[0].toLowerCase());
            if (file) {
              output = file.data.content || '(File is empty)';
            } else {
              output = `cat: ${args[0]}: No such file`;
            }
          } else {
            output = 'cat: missing operand';
          }
          break;
        case 'date':
          output = new Date().toString();
          break;
        case 'neofetch':
          output = `
       .o+o.          guest@luminaos
      .oOOOOOo.       --------------
     .oOOOOOOOOOo.    OS: LuminaOS v1.0.0
    .oOOOOOOOOOOOOOo. Kernel: Web (React)
           \\OOOOOOOO/   Uptime: Just booted
            \\OOOOOO/    WM: Lumina Glass
             \\OOOO/     Theme: Dark Mode
              \\OO/      Icons: Lucide
               \\/       Terminal: lumina-term`;
          break;
        case 'sudo':
          output = `guest_user is not in the sudoers file. This incident will be reported.`;
          break;
        case 'clear':
          setHistory([]);
          setInput('');
          return;
        case '':
          output = '';
          break;
        default:
          output = `bash: ${cmd}: command not found`;
      }

      setHistory(prev => [...prev, { type: 'input', text: input, path: getCurrentPathName() }, ...(output ? [{ type: 'output', text: output }] : [])]);
      setInput('');
    }
  };

  return (
    <div className="h-full w-full bg-[#1a1b26]/70 backdrop-blur-md text-green-400 p-4 font-mono text-sm overflow-y-auto selection:bg-green-400/30">
      {history.map((line, i) => (
        <div key={i} className="mb-1 flex">
          {line.type === 'input' && <span className="text-blue-400 mr-2">guest@lumina:{line.path}$</span>}
          <span className={`${line.type === 'output' ? 'text-gray-300' : ''} whitespace-pre-wrap font-mono`}>{line.text}</span>
        </div>
      ))}
      <div className="flex items-center mt-1">
        <span className="text-blue-400 mr-2">guest@lumina:{getCurrentPathName()}$</span>
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleCommand}
          autoFocus
          className="flex-1 bg-transparent outline-none border-none text-green-400"
          spellCheck="false"
        />
      </div>
      <div ref={endRef} />
    </div>
  );
};
