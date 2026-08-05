import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Minus, Maximize2, Minimize2 } from 'lucide-react';
import { ErrorBoundary } from './ErrorBoundary';

const TOP_BAR_HEIGHT = 32;
const MIN_VISIBLE = 80;

export const Window = ({ app, isOpen, onClose, onMinimize, isActive, onFocus, index, stackOrder, osProps }) => {
  const [pos, setPos] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const windowRef = useRef(null);

  const clamp = useCallback((x, y) => {
    const w = windowRef.current?.offsetWidth ?? 0;
    return {
      x: Math.min(Math.max(x, MIN_VISIBLE - w), window.innerWidth - MIN_VISIBLE),
      y: Math.min(Math.max(y, TOP_BAR_HEIGHT), window.innerHeight - MIN_VISIBLE),
    };
  }, []);

  // Centered once after mount, when the element has a measurable size. Deliberately
  // not keyed on `index` — that changes on every focus and would yank the window back.
  useEffect(() => {
    const el = windowRef.current;
    if (!el) return;
    const cascade = (index % 6) * 24;
    setPos(clamp(
      (window.innerWidth - el.offsetWidth) / 2 + cascade,
      (window.innerHeight - el.offsetHeight) / 2 + cascade
    ));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMouseDown = (e) => {
    if (isMaximized || !pos) return;
    dragOffset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    setIsDragging(true);
    onFocus();
  };

  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e) => setPos(clamp(e.clientX - dragOffset.current.x, e.clientY - dragOffset.current.y));
    const onUp = () => setIsDragging(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [isDragging, clamp]);

  // Keep windows reachable when the viewport shrinks.
  useEffect(() => {
    const onResize = () => setPos(p => (p ? clamp(p.x, p.y) : p));
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [clamp]);

  if (!isOpen) return null;

  const AppContent = app.component;

  return (
    <div
      ref={windowRef}
      onMouseDown={onFocus}
      className={`absolute shadow-2xl flex flex-col border overflow-hidden animate-window-in ${osProps.theme.border} backdrop-blur-xl transition-shadow duration-300
        ${isActive ? 'shadow-blue-900/40' : 'shadow-black/50 brightness-[0.85]'}
        ${isDragging ? 'select-none' : ''}
        ${osProps.theme.windowBg}
        ${isMaximized
          ? 'top-8 left-0 w-full h-[calc(100vh-32px)] rounded-none'
          : 'w-[95vw] h-[75vh] md:w-[700px] md:h-[480px] rounded-xl'}
      `}
      style={
        isMaximized
          ? { zIndex: isActive ? 100 : 10 + stackOrder }
          : {
              transform: `translate3d(${pos?.x ?? 0}px, ${pos?.y ?? TOP_BAR_HEIGHT}px, 0)`,
              visibility: pos ? 'visible' : 'hidden',
              zIndex: isActive ? 100 : 10 + stackOrder,
            }
      }
    >
      {/* Title Bar - macOS/Deepin style controls */}
      <div
        onMouseDown={handleMouseDown}
        onDoubleClick={() => setIsMaximized(m => !m)}
        className={`h-10 flex items-center px-4 select-none ${isActive ? 'bg-white/10' : 'bg-white/5'} border-b ${osProps.theme.border} ${isMaximized ? '' : 'cursor-move'}`}
      >
        <div className="flex gap-2 window-controls">
          <button aria-label={`Close ${app.title}`} onMouseDown={(e) => e.stopPropagation()} onClick={onClose} className="w-3.5 h-3.5 rounded-full bg-red-500 hover:bg-red-400 flex items-center justify-center group cursor-pointer transition-colors">
            <X size={10} className="text-black/50 opacity-0 group-hover:opacity-100" />
          </button>
          <button aria-label={`Minimize ${app.title}`} onMouseDown={(e) => e.stopPropagation()} onClick={onMinimize} className="w-3.5 h-3.5 rounded-full bg-yellow-500 hover:bg-yellow-400 flex items-center justify-center group cursor-pointer transition-colors">
            <Minus size={10} className="text-black/50 opacity-0 group-hover:opacity-100" />
          </button>
          <button aria-label={isMaximized ? `Restore ${app.title}` : `Maximize ${app.title}`} onMouseDown={(e) => e.stopPropagation()} onClick={() => setIsMaximized(m => !m)} className="w-3.5 h-3.5 rounded-full bg-green-500 hover:bg-green-400 flex items-center justify-center group cursor-pointer transition-colors">
            {isMaximized
              ? <Minimize2 size={8} className="text-black/50 opacity-0 group-hover:opacity-100" />
              : <Maximize2 size={8} className="text-black/50 opacity-0 group-hover:opacity-100" />}
          </button>
        </div>
        <div className="flex-1 flex justify-center items-center gap-2 text-gray-300 font-medium text-sm pointer-events-none truncate">
          <app.icon size={16} className={app.color} />
          <span className="truncate">{app.title}</span>
        </div>
        <div className="w-[42px]"></div> {/* Spacer for symmetry */}
      </div>

      {/* Window Content */}
      <div className="flex-1 overflow-hidden relative bg-black/20">
        <ErrorBoundary appTitle={app.title}>
          <AppContent os={osProps} app={app} />
        </ErrorBoundary>
      </div>
    </div>
  );
};
