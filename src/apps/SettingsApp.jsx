import React from 'react';
import { Settings } from 'lucide-react';

export const SettingsApp = ({ os }) => {
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
