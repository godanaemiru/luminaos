import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Edit2, Eraser, Download } from 'lucide-react';

export const PaintApp = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#ffffff');
  const [bgColor, setBgColor] = useState('#1e1e1e');
  const [brushSize, setBrushSize] = useState(5);
  const [isEraser, setIsEraser] = useState(false);

  const getCoordinates = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const { x, y } = getCoordinates(e, canvas);
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const { x, y } = getCoordinates(e, canvas);
    const ctx = canvas.getContext('2d');
    ctx.lineTo(x, y);
    ctx.strokeStyle = isEraser ? bgColor : color;
    ctx.lineWidth = Number(brushSize);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.closePath();
      setIsDrawing(false);
    }
  };

  const fillBackground = useCallback((fill) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = fill;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const clearCanvas = () => fillBackground(bgColor);

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = `lumina-paint-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  // Apply initial background color (not on bgColor change — that would wipe the drawing)
  useEffect(() => {
    fillBackground('#1e1e1e');
  }, [fillBackground]);

  const PRESET_COLORS = ['#ef4444', '#22c55e', '#3b82f6', '#eab308', '#ffffff', '#000000'];

  return (
    <div className="h-full w-full flex flex-col bg-[#1e1e1e]">
      <div className="flex flex-wrap gap-3 p-2 bg-black/40 border-b border-white/10 items-center text-sm">
        
        {/* Tools */}
        <div className="flex gap-1 bg-white/5 p-1 rounded">
           <button onClick={() => setIsEraser(false)} className={`p-1.5 rounded transition-colors ${!isEraser ? 'bg-blue-500 text-white shadow' : 'text-gray-400 hover:text-white'}`} title="Brush">
             <Edit2 size={16} />
          </button>
           <button onClick={() => setIsEraser(true)} className={`p-1.5 rounded transition-colors ${isEraser ? 'bg-blue-500 text-white shadow' : 'text-gray-400 hover:text-white'}`} title="Eraser">
             <Eraser size={16} />
          </button>
        </div>

        {/* Color Picker & Presets */}
        <div className="flex items-center gap-2 border-l border-white/10 pl-3">
           <input type="color" value={color} onChange={e => { setColor(e.target.value); setIsEraser(false); }} className="w-7 h-7 rounded cursor-pointer bg-transparent border-0 p-0" title="Brush Color" />
           <div className="hidden sm:flex gap-1.5">
             {PRESET_COLORS.map(c => (
               <button key={c} onClick={() => { setColor(c); setIsEraser(false); }} className="w-5 h-5 rounded-full border border-white/20 hover:scale-110 transition-transform shadow-sm" style={{ backgroundColor: c }} title={c} />
             ))}
           </div>
        </div>

        {/* Brush Size */}
        <div className="flex items-center gap-2 border-l border-white/10 pl-3">
          <span className="text-gray-400 text-xs hidden md:inline">Size:</span>
          <input aria-label="Brush size" type="range" min="1" max="50" value={brushSize} onChange={e => setBrushSize(Number(e.target.value))} className="w-20 md:w-24 accent-blue-500" />
          <span className="text-white text-xs w-6">{brushSize}px</span>
        </div>

        {/* Background Color */}
        <div className="flex items-center gap-2 border-l border-white/10 pl-3">
           <span className="text-gray-400 text-xs hidden md:inline">Bg:</span>
           <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-7 h-7 rounded cursor-pointer bg-transparent border-0 p-0" title="Canvas Background Color (Applies on Clear/Erase)" />
        </div>

        {/* Actions */}
        <div className="flex gap-2 ml-auto border-l border-white/10 pl-3">
           <button onClick={downloadCanvas} className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors" title="Download Image">
             <Download size={16} />
           </button>
           <button onClick={clearCanvas} className="text-xs bg-red-500/20 hover:bg-red-500/40 text-red-400 px-3 py-1.5 rounded transition-colors" title="Clear Canvas with Background Color">
             Clear
           </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden relative cursor-crosshair touch-none">
         <canvas 
           ref={canvasRef}
           width={1200} 
           height={800} 
           className="w-full h-full"
           onMouseDown={startDrawing}
           onMouseMove={draw}
           onMouseUp={stopDrawing}
           onMouseLeave={stopDrawing}
           onTouchStart={e => { e.preventDefault(); startDrawing(e.touches[0]); }}
           onTouchMove={e => { e.preventDefault(); draw(e.touches[0]); }}
           onTouchEnd={stopDrawing}
         />
      </div>
    </div>
  );
};
