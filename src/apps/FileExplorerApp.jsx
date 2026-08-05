import React, { useState } from 'react';
import { Folder, FileText, ChevronRight, Search, Plus, FolderPlus, FilePlus, ArrowLeft, Trash2, Edit2 } from 'lucide-react';

export const FileExplorerApp = ({ os }) => {
  const [currentPath, setCurrentPath] = useState(['root']);
  const [searchTerm, setSearchTerm] = useState('');

  const currentFolderId = currentPath[currentPath.length - 1];
  
  // Get items in the current folder
  const items = os.vfs.filter(item => item.parentId === currentFolderId);
  
  const filteredItems = items.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const navigateTo = (id) => {
    setCurrentPath([...currentPath, id]);
  };

  const navigateBack = () => {
    if (currentPath.length > 1) {
      setCurrentPath(currentPath.slice(0, -1));
    }
  };

  const getBreadcrumbs = () => {
    return currentPath.map((id) => {
      if (id === 'root') return { id, name: 'Root' };
      const folder = os.vfs.find(f => f.id === id);
      return { id, name: folder ? folder.title : 'Unknown' };
    });
  };

  const handleItemDoubleClick = (item) => {
    if (item.type === 'folder') {
      navigateTo(item.id);
    } else {
      // Logic to open file would go here if we had an openApp method in osProps
      // For now, we'll just assume double-clicking opens it if it's already an app
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#1a1b26] text-gray-200">
      {/* Toolbar */}
      <div className="p-3 border-b border-white/10 flex items-center gap-4 bg-black/20">
        <div className="flex items-center gap-1">
          <button 
            onClick={navigateBack}
            disabled={currentPath.length === 1}
            className="p-1.5 rounded hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
        </div>

        {/* Breadcrumbs */}
        <div className="flex-1 flex items-center gap-1 bg-black/40 px-3 py-1.5 rounded-md border border-white/10 overflow-hidden">
          {getBreadcrumbs().map((crumb, i) => (
            <React.Fragment key={crumb.id}>
              <button 
                onClick={() => setCurrentPath(currentPath.slice(0, i + 1))}
                className="text-xs hover:text-blue-400 whitespace-nowrap transition-colors"
              >
                {crumb.name}
              </button>
              {i < currentPath.length - 1 && <ChevronRight size={12} className="text-gray-600" />}
            </React.Fragment>
          ))}
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-md border border-white/10 w-48 focus-within:border-blue-500/50 transition-colors">
          <Search size={14} className="text-gray-400" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="bg-transparent border-none outline-none text-xs text-white w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-1 border-l border-white/10 pl-3 ml-2">
          <button 
            onClick={() => os.createFolder(currentFolderId)}
            className="p-1.5 rounded hover:bg-white/10 text-blue-400"
            title="New Folder"
          >
            <FolderPlus size={18} />
          </button>
          <button 
            onClick={() => os.createFile(currentFolderId)}
            className="p-1.5 rounded hover:bg-white/10 text-green-400"
            title="New File"
          >
            <FilePlus size={18} />
          </button>
        </div>
      </div>

      {/* Main View */}
      <div className="flex-1 p-4 overflow-y-auto">
        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full opacity-30 gap-3">
             <Folder size={64} />
             <p className="text-sm">Folder is empty</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredItems.map(item => (
              <div 
                key={item.id}
                onDoubleClick={() => handleItemDoubleClick(item)}
                className="relative flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-white/5 cursor-pointer group transition-colors"
              >
                <div className="relative">
                  {item.type === 'folder' ? (
                    <Folder size={48} className="text-blue-400 drop-shadow-lg" />
                  ) : (
                    <FileText size={48} className="text-gray-400 drop-shadow-lg" />
                  )}
                </div>
                <span className="text-xs text-center line-clamp-2 w-full break-all px-1">
                  {item.title}
                </span>
                
                {/* Overlay actions */}
                <div className="absolute top-1 right-1 flex flex-col gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity bg-black/60 rounded-md p-1">
                  <button aria-label={`Delete ${item.title}`} onClick={(e) => { e.stopPropagation(); os.deleteItem(item.id); }} className="p-1 hover:text-red-400 transition-colors">
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="px-4 py-1.5 bg-black/40 border-t border-white/10 text-[10px] text-gray-500 flex justify-between">
        <span>{filteredItems.length} items</span>
        <span>Storage: LocalBrowser</span>
      </div>
    </div>
  );
};
