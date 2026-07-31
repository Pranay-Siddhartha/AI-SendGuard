'use client';
import { Search, Bell, ChevronDown } from 'lucide-react';
import { useAuth } from '@/lib/auth';

export default function TopNav() {
  const { user } = useAuth();
  return (
    <header className="h-20 border-b border-border bg-background/50 backdrop-blur-md flex items-center justify-between px-8 z-10">
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
        <input 
          type="text" 
          placeholder="Search analyses, policies..." 
          className="w-full bg-cards border border-border rounded-full pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary transition-colors"
        />
      </div>

      <div className="flex items-center gap-6">
        <div className="relative cursor-pointer">
          <Bell className="w-5 h-5 text-text-secondary hover:text-white transition-colors" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
        </div>
        
        <div className="flex items-center gap-2 cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors border border-transparent hover:border-border">
          <span className="text-sm font-medium text-white">Main Workspace</span>
          <ChevronDown className="w-4 h-4 text-text-muted" />
        </div>
      </div>
    </header>
  );
}
