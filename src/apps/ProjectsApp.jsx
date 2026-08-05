import React, { useState } from 'react';
import { Search, LayoutGrid, List, ExternalLink, Star } from 'lucide-react';
import { PROJECTS } from '../config/constants';

export const ProjectsApp = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  const filteredProjects = PROJECTS.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.tech.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex flex-col h-full bg-[#1a1b26]">
      {/* Toolbar */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between gap-4 bg-black/20">
        <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-md border border-white/10 flex-1 max-w-sm focus-within:border-blue-500/50 transition-colors">
          <Search size={16} className="text-gray-400" />
          <input 
            type="text" 
            placeholder="Search projects by name or tech..." 
            className="bg-transparent border-none outline-none text-sm text-white w-full placeholder-gray-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-1 bg-black/40 rounded-md border border-white/10 p-1">
          <button 
            onClick={() => setViewMode('grid')} 
            className={`p-1.5 rounded transition-colors ${viewMode === 'grid' ? 'bg-white/20 text-white shadow' : 'text-gray-500 hover:text-white'}`}
            title="Grid View"
          >
            <LayoutGrid size={16} />
          </button>
          <button 
            onClick={() => setViewMode('list')} 
            className={`p-1.5 rounded transition-colors ${viewMode === 'list' ? 'bg-white/20 text-white shadow' : 'text-gray-500 hover:text-white'}`}
            title="List View"
          >
            <List size={16} />
          </button>
        </div>
      </div>
      
      {/* Content Area */}
      <div className="p-6 overflow-y-auto flex-1">
        {filteredProjects.length === 0 ? (
           <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-3 mt-10">
             <Search size={48} className="opacity-20" />
             <p>No projects matched your search.</p>
           </div>
        ) : (
          <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "flex flex-col gap-3"}>
            {filteredProjects.map((project, idx) => (
              <div 
                key={idx} 
                className={`bg-white/5 border border-white/10 p-5 rounded-lg hover:bg-white/10 transition-all group ${viewMode === 'list' ? 'flex justify-between items-center' : ''}`}
              >
                <div className={viewMode === 'list' ? 'flex-1' : ''}>
                  <h3 className="text-lg font-semibold text-white flex justify-between items-center mb-2">
                    <span className="flex items-center gap-3">
                      {project.title}
                      {viewMode === 'grid' && (
                        <span className="flex items-center gap-1 text-xs text-gray-400 font-normal bg-black/30 px-2 py-0.5 rounded-full">
                          <Star size={10} className="text-yellow-500/90" />
                          {project.stars}
                        </span>
                      )}
                    </span>
                    {viewMode === 'grid' && <ExternalLink size={16} className="text-gray-500 group-hover:text-blue-400 transition-colors cursor-pointer" />}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{project.description}</p>
                  <div className="flex gap-2 text-xs text-blue-300">
                    {project.tech.map(t => <span key={t}>#{t}</span>)}
                  </div>
                </div>
                
                {/* Extra details for List View */}
                {viewMode === 'list' && (
                  <div className="flex items-center gap-6 ml-6">
                    <div className="flex items-center gap-1.5 text-gray-400 bg-black/30 px-3 py-1 rounded-full text-sm">
                       <Star size={14} className="text-yellow-500/90" />
                       <span>{project.stars}</span>
                    </div>
                    <button className="p-2 bg-white/5 hover:bg-blue-500/20 hover:text-blue-400 rounded-lg transition-colors text-gray-400">
                      <ExternalLink size={18} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
