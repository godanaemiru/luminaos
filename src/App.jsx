import React, { useState, useEffect } from 'react';
import { 
  User, Terminal, Code, Mail, Folder, Settings, Search, 
  Wifi, Volume2, BatteryMedium, Power, Film, FileText, 
  RefreshCw, FolderPlus, FilePlus, Palette, Gamepad2, 
  Edit2, Trash2, LayoutGrid, ExternalLink
} from 'lucide-react';

import { SYSTEM_THEME } from './config/constants';
import { Window } from './components/Window';

// Apps
import { AboutApp } from './apps/AboutApp';
import { TerminalApp } from './apps/TerminalApp';
import { ProjectsApp } from './apps/ProjectsApp';
import { VideoApp } from './apps/VideoApp';
import { PaintApp } from './apps/PaintApp';
import { SnakeGame } from './apps/SnakeGame';
import { ContactApp } from './apps/ContactApp';
import { SettingsApp } from './apps/SettingsApp';
import { CustomFolderApp, CustomFileApp } from './apps/CustomApps';
import { FileExplorerApp } from './apps/FileExplorerApp';

const APPS = [
  { id: 'about', title: 'About Me', icon: User, component: AboutApp, color: 'text-blue-400' },
  { id: 'terminal', title: 'Terminal', icon: Terminal, component: TerminalApp, color: 'text-green-400' },
  { id: 'projects', title: 'Projects', icon: Code, component: ProjectsApp, color: 'text-purple-400' },
  { id: 'video', title: 'Media Player', icon: Film, component: VideoApp, color: 'text-pink-400' },
  { id: 'paint', title: 'Paint', icon: Palette, component: PaintApp, color: 'text-yellow-400' },
  { id: 'snake', title: 'Snake', icon: Gamepad2, component: SnakeGame, color: 'text-green-500' },
  { id: 'contact', title: 'Contact', icon: Mail, component: ContactApp, color: 'text-red-400' },
  { id: 'settings', title: 'Settings', icon: Settings, component: SettingsApp, color: 'text-gray-300' },
  { id: 'explorer', title: 'File Explorer', icon: Folder, component: FileExplorerApp, color: 'text-yellow-500' },
];

export default function App() {
  const [theme, setTheme] = useState(SYSTEM_THEME);
  
  // Persisted state for files and folders
  const [customApps, setCustomApps] = useState(() => {
    try {
      const saved = localStorage.getItem('lumina_custom_apps');
      return saved ? JSON.parse(saved).map(app => ({ ...app, parentId: app.parentId || 'root' })) : [];
    } catch { return []; }
  });
  
  const [desktopShortcuts, setDesktopShortcuts] = useState(() => {
    try {
      const saved = localStorage.getItem('lumina_shortcuts');
      return saved ? JSON.parse(saved) : APPS.map(a => a.id);
    } catch { return APPS.map(a => a.id); }
  });

  // Combine standard apps and custom persisted files/folders
  const appsRegistry = [
    ...APPS,
    ...customApps.map(ca => ({
      ...ca,
      icon: ca.type === 'folder' ? Folder : FileText,
      component: ca.type === 'folder' ? CustomFolderApp : CustomFileApp,
      color: ca.type === 'folder' ? 'text-blue-300' : 'text-gray-300'
    }))
  ];

  const [openApps, setOpenApps] = useState(['about']);
  const [minimizedApps, setMinimizedApps] = useState([]);
  const [activeApp, setActiveApp] = useState('about');
  const [showLauncher, setShowLauncher] = useState(false);
  const [launcherQuery, setLauncherQuery] = useState('');
  const [time, setTime] = useState(new Date());
  const [powerState, setPowerState] = useState('on');
  const [contextMenu, setContextMenu] = useState({ show: false, x: 0, y: 0, targetId: null });
  const [renamingAppId, setRenamingAppId] = useState(null);
  const [renameInput, setRenameInput] = useState('');
  const [hoveredDockIndex, setHoveredDockIndex] = useState(null);

  // A failed write (quota exceeded, private browsing) must not take the desktop down.
  useEffect(() => {
    try {
      localStorage.setItem('lumina_custom_apps', JSON.stringify(customApps));
      localStorage.setItem('lumina_shortcuts', JSON.stringify(desktopShortcuts));
    } catch {
      console.warn('LuminaOS: could not persist to localStorage; changes will be lost on reload.');
    }
  }, [customApps, desktopShortcuts]);

  // Clock updates
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowLauncher(false);
        setLauncherQuery('');
        setContextMenu({ show: false, x: 0, y: 0, targetId: null });
        setRenamingAppId(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const openApp = (appId) => {
    setOpenApps(prev => {
      // Bring the app to the front of the stack (end of the array)
      const filtered = prev.filter(id => id !== appId);
      return [...filtered, appId];
    });
    
    setMinimizedApps(prev => prev.filter(id => id !== appId));
    setActiveApp(appId);
    setShowLauncher(false);
    setLauncherQuery('');
  };

  const closeApp = (appId) => {
    setOpenApps(prev => {
      const newApps = prev.filter(id => id !== appId);
      
      if (activeApp === appId) {
        // Find the next visible (non-minimized) app to naturally fall back to
        const visibleApps = newApps.filter(id => !minimizedApps.includes(id));
        setActiveApp(visibleApps.length > 0 ? visibleApps[visibleApps.length - 1] : null);
      }
      return newApps;
    });
    
    setMinimizedApps(prev => prev.filter(id => id !== appId));
  };

  const minimizeApp = (appId) => {
    if (!minimizedApps.includes(appId)) {
      setMinimizedApps([...minimizedApps, appId]);
    }
    if (activeApp === appId) {
      const visibleApps = openApps.filter(id => id !== appId && !minimizedApps.includes(id));
      setActiveApp(visibleApps.length > 0 ? visibleApps[visibleApps.length - 1] : null);
    }
  };

  const toggleApp = (appId) => {
    if (openApps.includes(appId)) {
      if (activeApp === appId && !minimizedApps.includes(appId)) {
        minimizeApp(appId);
      } else {
        openApp(appId); 
      }
    } else {
      openApp(appId);
    }
  };

  const handlePowerOff = () => {
    setPowerState('shutting-down');
    setTimeout(() => setPowerState('off'), 2000);
  };

  const handlePowerOn = () => {
    setPowerState('booting');
    setTimeout(() => setPowerState('on'), 2000);
    setOpenApps(['about']);
    setMinimizedApps([]);
    setActiveApp('about');
  };

  const handleContextMenu = (e, targetId = null) => {
    e.preventDefault();
    const x = Math.min(e.clientX, window.innerWidth - 180);
    const y = Math.min(e.clientY, window.innerHeight - 150);
    setContextMenu({ show: true, x, y, targetId });
  };

  const closeContextMenu = () => {
    if (contextMenu.show) setContextMenu({ show: false, x: 0, y: 0, targetId: null });
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleNewFolder = (parentId = 'root') => {
    const id = `folder-${Date.now()}`;
    const newApp = { id, type: 'folder', title: 'New Folder', parentId, data: {} };
    setCustomApps([...customApps, newApp]);
    if (parentId === 'root') setDesktopShortcuts([...desktopShortcuts, id]);
    closeContextMenu();
    return id;
  };

  const handleNewFile = (parentId = 'root') => {
    const id = `file-${Date.now()}`;
    const newApp = { id, type: 'file', title: 'New Document.txt', parentId, data: { content: '' } };
    setCustomApps([...customApps, newApp]);
    if (parentId === 'root') setDesktopShortcuts([...desktopShortcuts, id]);
    closeContextMenu();
    return id;
  };

  const deleteApp = (appId) => {
    closeApp(appId);
    setDesktopShortcuts(desktopShortcuts.filter(id => id !== appId));
    setCustomApps(customApps.filter(app => app.id !== appId));
    closeContextMenu();
  };

  const startRename = (appId, currentTitle) => {
    setRenamingAppId(appId);
    setRenameInput(currentTitle);
    closeContextMenu();
  };

  const submitRename = (appId) => {
    if (renameInput.trim()) {
      setCustomApps(prev => prev.map(app => app.id === appId ? { ...app, title: renameInput.trim() } : app));
    }
    setRenamingAppId(null);
  };

  const osProps = { 
    theme, 
    setTheme,
    vfs: customApps,
    createFolder: handleNewFolder,
    createFile: handleNewFile,
    deleteItem: deleteApp,
    renameItem: (id, newTitle) => {
      setCustomApps(prev => prev.map(app => app.id === id ? { ...app, title: newTitle } : app));
    },
    updateCustomApp: (id, newData) => {
      setCustomApps(prev => prev.map(a => a.id === id ? { ...a, data: { ...a.data, ...newData } } : a));
    }
  };

  const launcherResults = appsRegistry.filter(app =>
    app.title.toLowerCase().includes(launcherQuery.trim().toLowerCase())
  );

  if (powerState === 'off') {
    return (
      <div className="h-screen w-screen bg-black flex items-center justify-center">
        <button 
          onClick={handlePowerOn}
          className="text-white/20 hover:text-white/80 transition-colors flex flex-col items-center gap-4 group"
        >
          <Power size={64} className="group-hover:scale-110 transition-transform duration-500" />
          <span className="text-xl font-mono tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">POWER ON</span>
        </button>
      </div>
    );
  }

  if (powerState === 'shutting-down' || powerState === 'booting') {
    return (
      <div className="h-screen w-screen bg-black flex items-center justify-center flex-col gap-6 text-white font-mono">
        <div className="w-16 h-16 border-4 border-t-blue-500 border-r-blue-500 border-b-purple-500 border-l-purple-500 rounded-full animate-spin"></div>
        <p className="text-xl tracking-wider">
          {powerState === 'shutting-down' ? 'Shutting down LuminaOS...' : 'Booting LuminaOS...'}
        </p>
      </div>
    );
  }

  return (
    <div 
      className={`h-screen w-screen overflow-hidden bg-gradient-to-br ${theme.bg} text-white font-sans relative`}
      onClick={closeContextMenu}
    >
      
      {/* Background Mesh/Decoration */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.18] mix-blend-screen"
        style={{
          backgroundImage:
            'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.9) 0.5px, transparent 0.5px)',
          backgroundSize: '3px 3px',
        }}
      ></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] pointer-events-none"></div>

      {/* GNOME-style Top Bar */}
      <div className="h-8 bg-black/40 backdrop-blur-md w-full flex items-center justify-between px-4 text-sm font-medium border-b border-white/10 z-[200] relative">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowLauncher(!showLauncher)}
            className={`hover:bg-white/10 px-3 py-1 rounded transition-colors flex items-center gap-2 ${showLauncher ? 'bg-white/10' : ''}`}
          >
            <LayoutGrid size={14} className="text-blue-400" />
            Activities
          </button>
        </div>
        
        <div className="flex items-center hover:bg-white/10 px-3 py-1 rounded transition-colors cursor-default font-semibold">
          {time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          <span className="mx-2">•</span>
          {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 hover:bg-white/10 px-2 py-1 rounded transition-colors cursor-pointer">
            <Wifi size={14} />
            <Volume2 size={14} />
            <BatteryMedium size={14} />
          </div>
          
          {/* Power Button */}
          <button 
            onClick={handlePowerOff} 
            className="flex items-center justify-center hover:bg-red-500/80 px-2 py-1 rounded transition-colors ml-1 text-gray-300 hover:text-white"
            title="Shut Down"
          >
            <Power size={14} />
          </button>
        </div>
      </div>

      {/* App Launcher / Activities Overlay */}
      {showLauncher && (
        <div
          className="absolute inset-0 z-[150] bg-black/40 backdrop-blur-xl flex flex-col items-center pt-24 animate-fade-in"
          onClick={() => { setShowLauncher(false); setLauncherQuery(''); }}
        >
          <div className="w-[90%] md:w-1/2 max-w-2xl bg-white/10 rounded-full flex items-center px-4 py-3 mb-12 border border-white/20 shadow-2xl" onClick={e => e.stopPropagation()}>
            <Search size={20} className="text-gray-400 mr-3" />
            <input
              type="text"
              placeholder="Type to search..."
              className="bg-transparent border-none outline-none text-white w-full text-lg placeholder-gray-400"
              value={launcherQuery}
              onChange={e => setLauncherQuery(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && launcherResults[0]) openApp(launcherResults[0].id); }}
              autoFocus
            />
          </div>
          <div className="flex flex-wrap gap-8 justify-center max-w-4xl px-8 overflow-y-auto">
            {launcherResults.length === 0 ? (
              <p className="text-gray-400">No apps match &ldquo;{launcherQuery}&rdquo;</p>
            ) : launcherResults.map(app => (
               <div
                 key={`launcher-${app.id}`}
                 onClick={(e) => { e.stopPropagation(); openApp(app.id); }}
                 className="flex flex-col items-center gap-3 p-4 rounded-2xl hover:bg-white/10 cursor-pointer transition-all w-32 group"
               >
                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl border border-white/10 group-hover:border-white/30 backdrop-blur-md">
                    <app.icon size={40} className={app.color} />
                  </div>
                  <span className="text-white text-sm font-medium text-center line-clamp-2">{app.title}</span>
               </div>
            ))}
          </div>
        </div>
      )}

      {/* Desktop Area / Windows */}
      <div 
        className="absolute inset-0 pt-8 pb-20 overflow-hidden"
        onContextMenu={(e) => handleContextMenu(e, null)}
      >
        
        {/* Desktop Icons */}
        <div className="absolute top-12 left-4 flex flex-col flex-wrap h-[calc(100vh-120px)] gap-6 z-0 content-start">
          {desktopShortcuts.map((appId) => {
            const app = appsRegistry.find(a => a.id === appId);
            if (!app || (app.parentId && app.parentId !== 'root')) return null;
            
            const isRenaming = renamingAppId === app.id;
            const isCustom = customApps.some(ca => ca.id === app.id);
            
            return (
              <div
                key={`desktop-${app.id}`}
                role="button"
                tabIndex={0}
                onClick={(e) => { e.stopPropagation(); openApp(app.id); closeContextMenu(); }}
                onKeyDown={(e) => { if (e.key === 'Enter') { openApp(app.id); closeContextMenu(); } }}
                onContextMenu={(e) => { if(isCustom) handleContextMenu(e, app.id); else handleContextMenu(e, null); }}
                className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-white/10 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-400/60 cursor-pointer w-24 group transition-colors"
              >
                <div className="w-12 h-12 rounded-2xl bg-black/20 flex items-center justify-center backdrop-blur-md border border-white/10 group-hover:bg-black/40 transition-all shadow-lg">
                  <app.icon size={26} className={`${app.color} drop-shadow-md`} />
                </div>
                {isRenaming ? (
                  <input
                    autoFocus
                    className="text-xs text-black text-center px-1 rounded w-full outline-none mt-1"
                    value={renameInput}
                    onChange={e => setRenameInput(e.target.value)}
                    onBlur={() => submitRename(app.id)}
                    onKeyDown={e => e.key === 'Enter' && submitRename(app.id)}
                    onClick={e => e.stopPropagation()}
                  />
                ) : (
                  <span className="text-xs text-white text-center drop-shadow-md font-medium text-shadow-sm px-1 rounded bg-black/20 backdrop-blur-sm line-clamp-2 mt-1">{app.title}</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Render Windows */}
        {appsRegistry.map((app, index) => {
          const isOpen = openApps.includes(app.id);
          const isMinimized = minimizedApps.includes(app.id);
          const isActive = activeApp === app.id;
          
          if (!isOpen) return null;
          
          return (
            <div 
              className={`absolute inset-0 pointer-events-none transition-all duration-300 ${isMinimized ? 'opacity-0 scale-95 translate-y-10' : 'opacity-100 scale-100 translate-y-0'}`} 
              key={`window-wrapper-${app.id}`}
            >
              <div className="pointer-events-auto w-full h-full absolute inset-0">
                <Window 
                  app={app}
                  isOpen={isOpen}
                  isActive={isActive}
                  onClose={() => closeApp(app.id)}
                  onMinimize={() => minimizeApp(app.id)}
                  onFocus={() => openApp(app.id)}
                  index={index}
                  stackOrder={openApps.indexOf(app.id)}
                  osProps={osProps}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* macOS/Deepin style Bottom Dock */}
      <div 
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-[100]"
        onContextMenu={e => e.stopPropagation()}
      >
        <div 
          className="flex items-end gap-2 p-2 rounded-2xl bg-black/30 backdrop-blur-xl border border-white/10 shadow-2xl transition-all duration-300 ease-out h-[64px]"
          onMouseLeave={() => setHoveredDockIndex(null)}
        >
          {APPS.map((app, i) => {
            const isOpen = openApps.includes(app.id);
            const isMinimized = minimizedApps.includes(app.id);
            const isActive = activeApp === app.id && !isMinimized;
            
            // Calculate scale based on mouse proximity (macOS effect)
            const distance = hoveredDockIndex !== null ? Math.abs(hoveredDockIndex - i) : null;
            let scale = 1;
            if (distance === 0) scale = 1.45;
            else if (distance === 1) scale = 1.15;
            
            return (
              <div key={`dock-${app.id}`} className="relative group flex flex-col items-center origin-bottom transition-transform duration-200 ease-out" style={{ transform: `scale(${scale})` }}>
                {/* Tooltip */}
                <span className="absolute -top-12 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-gray-700 shadow-lg">
                  {app.title}
                </span>
                
                {/* Dock Icon */}
                <button
                  onClick={() => toggleApp(app.id)}
                  onMouseEnter={() => setHoveredDockIndex(i)}
                  className={`
                    w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200
                    ${isActive ? 'bg-white/20 shadow-lg shadow-black/50' : 'bg-white/5 hover:bg-white/15'}
                  `}
                >
                  <app.icon size={24} className={app.color} />
                </button>

                {/* Open Indicator */}
                {isOpen && (
                  <div className={`absolute -bottom-1 w-1 h-1 rounded-full ${isActive ? 'bg-blue-400 scale-125' : 'bg-gray-400'}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Context Menu */}
      {contextMenu.show && (
        <div 
          className="absolute z-[999] bg-[#1a1b26]/95 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl py-1.5 w-48 text-sm text-gray-200 animate-menu-in"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onContextMenu={e => e.preventDefault()}
        >
          {contextMenu.targetId ? (
            <>
              <button onClick={() => { openApp(contextMenu.targetId); closeContextMenu(); }} className="w-full text-left px-4 py-2 hover:bg-blue-500 hover:text-white transition-colors flex items-center gap-3">
                <ExternalLink size={14}/> Open
              </button>
              <button onClick={() => startRename(contextMenu.targetId, appsRegistry.find(a => a.id === contextMenu.targetId)?.title)} className="w-full text-left px-4 py-2 hover:bg-blue-500 hover:text-white transition-colors flex items-center gap-3">
                <Edit2 size={14}/> Rename
              </button>
              <div className="h-[1px] bg-white/10 my-1.5"></div>
              <button onClick={() => deleteApp(contextMenu.targetId)} className="w-full text-left px-4 py-2 hover:bg-red-500 hover:text-white transition-colors flex items-center gap-3 text-red-400">
                <Trash2 size={14}/> Delete
              </button>
            </>
          ) : (
            <>
              <button onClick={handleRefresh} className="w-full text-left px-4 py-2 hover:bg-blue-500 hover:text-white transition-colors flex items-center gap-3">
                <RefreshCw size={14}/> Refresh
              </button>
              <div className="h-[1px] bg-white/10 my-1.5"></div>
              <button onClick={() => handleNewFolder('root')} className="w-full text-left px-4 py-2 hover:bg-blue-500 hover:text-white transition-colors flex items-center gap-3">
                <FolderPlus size={14}/> New Folder
              </button>
              <button onClick={() => handleNewFile('root')} className="w-full text-left px-4 py-2 hover:bg-blue-500 hover:text-white transition-colors flex items-center gap-3">
                <FilePlus size={14}/> New Document
              </button>
            </>
          )}
        </div>
      )}

    </div>
  );
}