import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, 
  User, 
  Code, 
  Mail, 
  Folder, 
  Cpu, 
  X, 
  Minus, 
  Maximize2, 
  Monitor, 
  ExternalLink,
  Settings,
  Search,
  Clock,
  Wifi,
  Volume2,
  BatteryMedium,
  ChevronRight,
  Send,
  LayoutGrid,
  Power,
  Film,
  FileText,
  RefreshCw,
  FolderPlus,
  FilePlus
} from 'lucide-react';

// --- Configuration & Content ---

const SYSTEM_THEME = {
  bg: 'from-slate-900 via-purple-900 to-slate-900', // Desktop background gradient
  windowBg: 'bg-[#1a1b26]/95', // Tokyo Night inspired dark theme
  accent: 'text-blue-400',
  border: 'border-white/10'
};

const PROJECTS = [
  {
    title: "Kernel Fetch",
    description: "A fast system info script written in Bash, inspired by neofetch.",
    tech: ["Bash", "Linux", "CLI"],
    link: "#"
  },
  {
    title: "Wayland Compositor",
    description: "A lightweight, experimental Wayland compositor built with wlroots.",
    tech: ["C", "Wayland", "OpenGL"],
    link: "#"
  },
  {
    title: "Vim Configs",
    description: "My highly customized, IDE-like Neovim configuration.",
    tech: ["Lua", "Vimscript"],
    link: "#"
  }
];

// --- Sub-components (Apps) ---

const TerminalApp = () => {
  const [history, setHistory] = useState([
    { type: 'output', text: 'LuminaOS v1.0.0 (Linux x86_64)' },
    { type: 'output', text: 'Type "help" for a list of available commands.' },
  ]);
  const [input, setInput] = useState('');
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (e) => {
    if (e.key === 'Enter') {
      const cmd = input.trim().toLowerCase();
      let output = '';

      switch (cmd) {
        case 'help':
          output = 'Available commands: help, whoami, ls, cat about.txt, clear, date, neofetch, sudo';
          break;
        case 'whoami':
          output = 'guest_user';
          break;
        case 'ls':
          output = 'about.txt  projects/  resume.pdf  contact.sh  pictures/';
          break;
        case 'cat about.txt':
          output = 'Hi, I am Godana, a developer building cool things for the web and desktop.';
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

      setHistory(prev => [...prev, { type: 'input', text: input }, ...(output ? [{ type: 'output', text: output }] : [])]);
      setInput('');
    }
  };

  return (
    <div className="h-full w-full bg-[#1a1b26] text-green-400 p-4 font-mono text-sm overflow-y-auto selection:bg-green-400/30">
      {history.map((line, i) => (
        <div key={i} className="mb-1 flex">
          {line.type === 'input' && <span className="text-blue-400 mr-2">guest@lumina:~$</span>}
          <span className={`${line.type === 'output' ? 'text-gray-300' : ''} whitespace-pre-wrap font-mono`}>{line.text}</span>
        </div>
      ))}
      <div className="flex items-center mt-1">
        <span className="text-blue-400 mr-2">guest@lumina:~$</span>
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

const AboutApp = () => (
  <div className="p-6 h-full overflow-y-auto text-gray-200">
    <div className="flex flex-col md:flex-row gap-6 items-start">
      <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0 border-4 border-[#1a1b26] shadow-xl">
        <User size={64} className="text-white" />
      </div>
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Godana</h1>
        <h2 className="text-xl text-blue-400 mb-4">Software Engineer & Tech Enthusiast</h2>
        <p className="leading-relaxed mb-6 text-gray-300">
          Passionate about open-source software, building efficient systems, and creating beautiful user interfaces. 
          When I'm not configuring my window manager or compiling a custom kernel, I'm usually exploring new web technologies.
        </p>
        
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <Cpu size={20} /> Tech Stack
        </h3>
        <div className="flex flex-wrap gap-2">
          {['Linux', 'React', 'Node.js', 'Python', 'C++', 'Docker', 'Git'].map(skill => (
            <span key={skill} className="px-3 py-1 bg-white/10 rounded-full text-sm hover:bg-white/20 transition-colors cursor-default">
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const ProjectsApp = () => (
  <div className="p-6 h-full overflow-y-auto">
    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
      <Code size={24} className="text-blue-400" /> Recent Projects
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {PROJECTS.map((project, idx) => (
        <div key={idx} className="bg-white/5 border border-white/10 p-5 rounded-lg hover:bg-white/10 transition-colors group">
          <h3 className="text-lg font-semibold text-white flex justify-between items-center mb-2">
            {project.title}
            <ExternalLink size={16} className="text-gray-400 group-hover:text-blue-400 transition-colors" />
          </h3>
          <p className="text-gray-400 text-sm mb-4 line-clamp-2">{project.description}</p>
          <div className="flex gap-2 text-xs text-blue-300">
            {project.tech.map(t => <span key={t}>#{t}</span>)}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ContactApp = () => (
  <div className="p-6 h-full overflow-y-auto flex flex-col items-center justify-center">
    <h2 className="text-2xl font-bold text-white mb-2">Let's Connect</h2>
    <p className="text-gray-400 mb-8 text-center max-w-md">
      Currently open for new opportunities. Feel free to reach out if you have a question or just want to talk about Linux distros!
    </p>
    
    <div className="flex gap-6 mb-10">
      <a href="#" className="p-4 bg-white/5 border border-white/10 rounded-full hover:bg-white/20 hover:text-white transition-all text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4"/>
          <path d="M9 18c-4.5 1.5-5-2.5-7-3"/>
        </svg>
      </a>
      <a href="#" className="p-4 bg-white/5 border border-white/10 rounded-full hover:bg-[#0077b5]/20 hover:text-[#0077b5] transition-all text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
          <rect width="4" height="12" x="2" y="9"/>
          <circle cx="4" cy="4" r="2"/>
        </svg>
      </a>
      <a href="#" className="p-4 bg-white/5 border border-white/10 rounded-full hover:bg-red-500/20 hover:text-red-400 transition-all text-gray-400">
        <Mail size={28} />
      </a>
    </div>

    <div className="w-full max-w-md bg-white/5 border border-white/10 p-1 rounded-lg flex items-center">
      <input 
        type="email" 
        placeholder="Drop your email..." 
        className="bg-transparent border-none outline-none text-white p-3 flex-1"
      />
      <button className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-md transition-colors flex items-center gap-2">
        <Send size={16} /> Send
      </button>
    </div>
  </div>
);

const VideoApp = () => {
  const [videoId, setVideoId] = useState('jfKfPfyJRdk'); // Default chill lofi stream
  const [inputUrl, setInputUrl] = useState('');
  const [error, setError] = useState('');

  const extractVideoId = (url) => {
    try {
      if (url.includes('youtu.be/')) {
        return url.split('youtu.be/')[1].split(/[?#]/)[0].substring(0, 11);
      }
      if (url.includes('youtube.com/watch')) {
        const urlObj = new URL(url);
        return urlObj.searchParams.get('v').substring(0, 11);
      }
      if (url.includes('youtube.com/shorts/')) {
        return new URL(url).pathname.split('/shorts/')[1].substring(0, 11);
      }
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
      return (match && match[2].length === 11) ? match[2] : null;
    } catch(e) {
      return null;
    }
  };

  const handlePlaySubmit = (e) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;
    
    const id = extractVideoId(inputUrl);
    if (id) {
      setVideoId(id);
      setInputUrl('');
      setError('');
    } else {
      setError('Please enter a valid YouTube URL');
    }
  };

  return (
    <div className="h-full w-full bg-[#1a1b26] flex flex-col font-sans">
      {/* Search/Address Bar */}
      <div className="p-3 bg-black/40 border-b border-white/10 flex gap-3 items-center">
        <Film size={18} className="text-pink-400 flex-shrink-0" />
        <form onSubmit={handlePlaySubmit} className="flex-1 flex gap-2">
          <input
            type="text"
            placeholder="Paste YouTube URL here (e.g., https://youtube.com/watch?v=...)"
            className="flex-1 bg-white/5 border border-white/10 rounded px-3 py-1.5 text-sm outline-none focus:border-pink-500 transition-colors text-white placeholder-gray-500"
            value={inputUrl}
            onChange={(e) => { setInputUrl(e.target.value); setError(''); }}
          />
          <button type="submit" className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-1.5 rounded text-sm transition-colors font-medium">
            Play
          </button>
        </form>
      </div>
      
      {error && (
        <div className="bg-red-500/10 border-b border-red-500/20 text-red-400 text-xs px-3 py-1.5 text-center">
          {error}
        </div>
      )}

      {/* Embedded Player */}
      <div className="flex-1 bg-black w-full relative">
        {videoId ? (
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 gap-3">
            <Film size={48} className="opacity-20" />
            <p>Enter a YouTube URL above to play</p>
          </div>
        )}
      </div>
    </div>
  );
};

const CustomFolderApp = () => (
  <div className="p-6 h-full text-gray-400 flex flex-col items-center justify-center bg-[#1a1b26]">
    <Folder size={48} className="mb-4 opacity-50" />
    <p>This folder is empty.</p>
  </div>
);

const CustomFileApp = () => {
  const [content, setContent] = useState('');
  return (
    <textarea 
      className="w-full h-full bg-[#1e1e1e] text-white p-4 outline-none resize-none font-mono"
      value={content}
      onChange={e => setContent(e.target.value)}
      placeholder="Start typing..."
      spellCheck="false"
    />
  );
};

const SettingsApp = ({ os }) => {
  const themes = [
    { name: 'Tokyo Night', bg: 'from-slate-900 via-purple-900 to-slate-900', windowBg: 'bg-[#1a1b26]/95' },
    { name: 'Ocean Blue', bg: 'from-blue-900 via-cyan-900 to-blue-900', windowBg: 'bg-slate-900/95' },
    { name: 'Hacker Green', bg: 'from-green-900 via-black to-green-900', windowBg: 'bg-black/95' },
    { name: 'Sunset', bg: 'from-orange-900 via-red-900 to-purple-900', windowBg: 'bg-zinc-900/95' }
  ];

  return (
    <div className="p-6 h-full overflow-y-auto text-gray-200">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <Settings size={24} className="text-blue-400" /> System Settings
      </h2>
      <div className="space-y-6">
        <section>
          <h3 className="text-lg font-semibold text-white mb-3">Appearance</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {themes.map(t => (
              <button
                key={t.name}
                onClick={() => os.setTheme({ ...os.theme, bg: t.bg, windowBg: t.windowBg })}
                className={`p-4 rounded-lg border text-left transition-colors ${os.theme.bg === t.bg ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
              >
                <div className={`w-full h-12 rounded-md mb-2 bg-gradient-to-br ${t.bg} border border-white/20`}></div>
                <span className="text-sm font-medium text-white">{t.name}</span>
              </button>
            ))}
          </div>
        </section>
        
        <section className="pt-4 border-t border-white/10">
          <h3 className="text-lg font-semibold text-white mb-3">System Info</h3>
          <div className="bg-white/5 border border-white/10 p-4 rounded-lg text-sm text-gray-400 space-y-2">
            <p><strong className="text-gray-300">OS:</strong> LuminaOS v1.1.0</p>
            <p><strong className="text-gray-300">User:</strong> Godana</p>
            <p><strong className="text-gray-300">Kernel:</strong> React Virtual DOM</p>
            <p><strong className="text-gray-300">Resolution:</strong> {typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : 'Unknown'}</p>
          </div>
        </section>
      </div>
    </div>
  );
};

// --- Core OS Components ---

const APPS = [
  { id: 'about', title: 'About Me', icon: User, component: AboutApp, color: 'text-blue-400' },
  { id: 'terminal', title: 'Terminal', icon: Terminal, component: TerminalApp, color: 'text-green-400' },
  { id: 'projects', title: 'Projects', icon: Code, component: ProjectsApp, color: 'text-purple-400' },
  { id: 'video', title: 'Media Player', icon: Film, component: VideoApp, color: 'text-pink-400' },
  { id: 'contact', title: 'Contact', icon: Mail, component: ContactApp, color: 'text-red-400' },
  { id: 'settings', title: 'Settings', icon: Settings, component: SettingsApp, color: 'text-gray-300' },
];

const Window = ({ app, isOpen, onClose, onMinimize, isActive, onFocus, index, osProps }) => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isMaximized, setIsMaximized] = useState(false);
  const windowRef = useRef(null);

  useEffect(() => {
    // Initial center positioning
    const w = Math.min(700, window.innerWidth * 0.95);
    const h = Math.min(480, window.innerHeight * 0.75);
    setPos({
      x: Math.max(0, (window.innerWidth - w) / 2 + (index * 20)),
      y: Math.max(32, (window.innerHeight - h) / 2 + (index * 20))
    });
  }, []);

  const handleMouseDown = (e) => {
    if (isMaximized) return;
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - pos.x,
      y: e.clientY - pos.y
    });
    onFocus();
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPos({
        x: e.clientX - dragOffset.x,
        y: Math.max(32, e.clientY - dragOffset.y) // Prevent dragging above top bar
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  if (!isOpen) return null;

  const AppContent = app.component;

  return (
    <div 
      ref={windowRef}
      onMouseDown={onFocus}
      className={`absolute shadow-2xl flex flex-col border ${osProps.theme.border} backdrop-blur-xl transition-shadow duration-300
        ${isActive ? 'z-50 shadow-blue-900/40' : 'z-10 shadow-black/50 brightness-[0.85]'}
        ${osProps.theme.windowBg}
        ${isMaximized ? '!top-8 !left-0 !w-full !h-[calc(100vh-32px)] !rounded-none !translate-x-0 !translate-y-0' : 'md:w-[700px] md:h-[480px] w-[95vw] h-[75vh] rounded-xl overflow-hidden'}
      `}
      style={!isMaximized ? {
        transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`
      } : {}}
    >
      {/* Title Bar - macOS/Deepin style controls */}
      <div 
        onMouseDown={handleMouseDown}
        onDoubleClick={() => setIsMaximized(!isMaximized)}
        className={`h-10 flex items-center px-4 select-none ${isActive ? 'bg-white/10' : 'bg-white/5'} border-b ${osProps.theme.border} cursor-move`}
      >
        <div className="flex gap-2 window-controls">
          <button onMouseDown={(e) => e.stopPropagation()} onClick={onClose} className="w-3.5 h-3.5 rounded-full bg-red-500 hover:bg-red-400 flex items-center justify-center group cursor-pointer transition-colors">
            <X size={10} className="text-black/50 opacity-0 group-hover:opacity-100" />
          </button>
          <button onMouseDown={(e) => e.stopPropagation()} onClick={onMinimize} className="w-3.5 h-3.5 rounded-full bg-yellow-500 hover:bg-yellow-400 flex items-center justify-center group cursor-pointer transition-colors">
            <Minus size={10} className="text-black/50 opacity-0 group-hover:opacity-100" />
          </button>
          <button onMouseDown={(e) => e.stopPropagation()} onClick={() => setIsMaximized(!isMaximized)} className="w-3.5 h-3.5 rounded-full bg-green-500 hover:bg-green-400 flex items-center justify-center group cursor-pointer transition-colors">
            <Maximize2 size={8} className="text-black/50 opacity-0 group-hover:opacity-100" />
          </button>
        </div>
        <div className="flex-1 flex justify-center items-center gap-2 text-gray-300 font-medium text-sm pointer-events-none">
          <app.icon size={16} className={app.color} />
          {app.title}
        </div>
        <div className="w-[42px]"></div> {/* Spacer for symmetry */}
      </div>

      {/* Window Content */}
      <div className="flex-1 overflow-hidden relative bg-black/20">
        <AppContent os={osProps} />
      </div>
    </div>
  );
};

export default function App() {
  const [theme, setTheme] = useState(SYSTEM_THEME);
  const [appsRegistry, setAppsRegistry] = useState(APPS);
  const [desktopShortcuts, setDesktopShortcuts] = useState(APPS.map(a => a.id));
  const [openApps, setOpenApps] = useState(['about']);
  const [minimizedApps, setMinimizedApps] = useState([]);
  const [activeApp, setActiveApp] = useState('about');
  const [showLauncher, setShowLauncher] = useState(false);
  const [time, setTime] = useState(new Date());
  const [powerState, setPowerState] = useState('on'); // 'on', 'shutting-down', 'off', 'booting'
  const [contextMenu, setContextMenu] = useState({ show: false, x: 0, y: 0 });

  // Clock updates
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const openApp = (appId) => {
    if (!openApps.includes(appId)) {
      setOpenApps([...openApps, appId]);
    }
    if (minimizedApps.includes(appId)) {
      setMinimizedApps(minimizedApps.filter(id => id !== appId));
    }
    setActiveApp(appId);
    setShowLauncher(false);
  };

  const closeApp = (appId) => {
    const newApps = openApps.filter(id => id !== appId);
    setOpenApps(newApps);
    setMinimizedApps(minimizedApps.filter(id => id !== appId));
    if (activeApp === appId) {
      setActiveApp(newApps.length > 0 ? newApps[newApps.length - 1] : null);
    }
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
        openApp(appId); // Restores and focuses
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
    // Optional: reset environment on fresh boot
    setOpenApps(['about']);
    setMinimizedApps([]);
    setActiveApp('about');
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    // Prevent the menu from rendering off-screen
    const x = Math.min(e.clientX, window.innerWidth - 180);
    const y = Math.min(e.clientY, window.innerHeight - 150);
    setContextMenu({ show: true, x, y });
  };

  const closeContextMenu = () => {
    if (contextMenu.show) setContextMenu({ show: false, x: 0, y: 0 });
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleNewFolder = () => {
    const id = `folder-${Date.now()}`;
    const newApp = { id, title: 'New Folder', icon: Folder, component: CustomFolderApp, color: 'text-blue-300' };
    setAppsRegistry([...appsRegistry, newApp]);
    setDesktopShortcuts([...desktopShortcuts, id]);
    closeContextMenu();
  };

  const handleNewFile = () => {
    const id = `file-${Date.now()}`;
    const newApp = { id, title: 'New Document.txt', icon: FileText, component: CustomFileApp, color: 'text-gray-300' };
    setAppsRegistry([...appsRegistry, newApp]);
    setDesktopShortcuts([...desktopShortcuts, id]);
    closeContextMenu();
  };

  const osProps = { theme, setTheme };

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
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none mix-blend-screen"></div>
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
          className="absolute inset-0 z-[150] bg-black/40 backdrop-blur-xl flex flex-col items-center pt-24 animate-in fade-in duration-200"
          onClick={() => setShowLauncher(false)}
        >
          <div className="w-[90%] md:w-1/2 max-w-2xl bg-white/10 rounded-full flex items-center px-4 py-3 mb-12 border border-white/20 shadow-2xl" onClick={e => e.stopPropagation()}>
            <Search size={20} className="text-gray-400 mr-3" />
            <input 
              type="text" 
              placeholder="Type to search..." 
              className="bg-transparent border-none outline-none text-white w-full text-lg placeholder-gray-400" 
              autoFocus
            />
          </div>
          <div className="flex flex-wrap gap-8 justify-center max-w-4xl px-8">
            {APPS.map(app => (
               <div 
                 key={`launcher-${app.id}`} 
                 onClick={(e) => { e.stopPropagation(); toggleApp(app.id); setShowLauncher(false); }} 
                 className="flex flex-col items-center gap-3 p-4 rounded-2xl hover:bg-white/10 cursor-pointer transition-all w-32 group"
               >
                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl border border-white/10 group-hover:border-white/30 backdrop-blur-md">
                    <app.icon size={40} className={app.color} />
                  </div>
                  <span className="text-white text-sm font-medium">{app.title}</span>
               </div>
            ))}
          </div>
        </div>
      )}

      {/* Desktop Area / Windows */}
      <div 
        className="absolute inset-0 pt-8 pb-20 overflow-hidden"
        onContextMenu={handleContextMenu}
      >
        
        {/* Desktop Icons */}
        <div className="absolute top-12 left-4 flex flex-col flex-wrap h-[calc(100vh-120px)] gap-6 z-0 content-start">
          {desktopShortcuts.map((appId) => {
            const app = appsRegistry.find(a => a.id === appId);
            if (!app) return null;
            
            return (
              <div 
                key={`desktop-${app.id}`} 
                onDoubleClick={(e) => { e.stopPropagation(); openApp(app.id); closeContextMenu(); }}
                onClick={(e) => { e.stopPropagation(); openApp(app.id); closeContextMenu(); }} // For mobile accessibility
                className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-white/10 cursor-pointer w-24 group transition-colors"
              >
                <div className="w-12 h-12 rounded-2xl bg-black/20 flex items-center justify-center backdrop-blur-md border border-white/10 group-hover:bg-black/40 transition-all shadow-lg">
                  <app.icon size={26} className={`${app.color} drop-shadow-md`} />
                </div>
                <span className="text-xs text-white text-center drop-shadow-md font-medium text-shadow-sm px-1 rounded bg-black/20 backdrop-blur-sm line-clamp-2">{app.title}</span>
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
                  index={openApps.indexOf(app.id)}
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
        <div className="flex items-end gap-2 p-2 rounded-2xl bg-black/30 backdrop-blur-xl border border-white/10 shadow-2xl">
          {APPS.map((app) => {
            const isOpen = openApps.includes(app.id);
            const isMinimized = minimizedApps.includes(app.id);
            const isActive = activeApp === app.id && !isMinimized;
            
            return (
              <div key={`dock-${app.id}`} className="relative group flex flex-col items-center">
                {/* Tooltip */}
                <span className="absolute -top-10 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-gray-700 shadow-lg">
                  {app.title}
                </span>
                
                {/* Dock Icon */}
                <button
                  onClick={() => toggleApp(app.id)}
                  className={`
                    w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200
                    ${isActive ? 'bg-white/20 scale-110 shadow-lg shadow-black/50' : 'bg-white/5 hover:bg-white/15 hover:scale-105'}
                  `}
                >
                  <app.icon size={24} className={app.color} />
                </button>

                {/* Open Indicator */}
                {isOpen && (
                  <div className={`absolute -bottom-1 w-1 h-1 rounded-full ${isActive ? 'bg-blue-400' : 'bg-gray-400'}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Context Menu */}
      {contextMenu.show && (
        <div 
          className="absolute z-[999] bg-[#1a1b26]/95 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl py-1.5 w-48 text-sm text-gray-200 animate-in fade-in duration-100"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onContextMenu={e => e.preventDefault()}
        >
          <button onClick={handleRefresh} className="w-full text-left px-4 py-2 hover:bg-blue-500 hover:text-white transition-colors flex items-center gap-3">
            <RefreshCw size={14}/> Refresh
          </button>
          <div className="h-[1px] bg-white/10 my-1.5"></div>
          <button onClick={handleNewFolder} className="w-full text-left px-4 py-2 hover:bg-blue-500 hover:text-white transition-colors flex items-center gap-3">
            <FolderPlus size={14}/> New Folder
          </button>
          <button onClick={handleNewFile} className="w-full text-left px-4 py-2 hover:bg-blue-500 hover:text-white transition-colors flex items-center gap-3">
            <FilePlus size={14}/> New Document
          </button>
        </div>
      )}

    </div>
  );
}