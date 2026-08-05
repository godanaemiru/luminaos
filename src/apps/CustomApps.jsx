import React from 'react';
import { Folder } from 'lucide-react';

export const CustomFolderApp = ({ app }) => (
  <div className="p-6 h-full text-gray-400 flex flex-col items-center justify-center bg-[#1a1b26]">
    <Folder size={48} className="mb-4 opacity-50" />
    <p>Folder: <strong className="text-white">{app?.title || 'Empty'}</strong></p>
    <p className="text-sm mt-2">Inner file support coming soon!</p>
  </div>
);

export const CustomFileApp = ({ app, os }) => {
  return (
    <textarea 
      className="w-full h-full bg-[#1e1e1e] text-white p-4 outline-none resize-none font-mono"
      value={app?.data?.content || ''}
      onChange={e => os.updateCustomApp(app.id, { content: e.target.value })}
      placeholder="Start typing to save automatically..."
      spellCheck="false"
    />
  );
};
