import React, { useState } from 'react';
import { Film } from 'lucide-react';

export const VideoApp = () => {
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
    } catch {
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
