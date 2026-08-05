import React from 'react';
import { Mail, Send } from 'lucide-react';

export const ContactApp = () => (
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
