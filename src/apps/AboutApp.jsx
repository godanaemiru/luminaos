import React from 'react';
import { User, Cpu } from 'lucide-react';

export const AboutApp = () => (
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
