'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Search, History, Shield, Users, BarChart3, Settings, LogOut } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Analyze', href: '/analyze', icon: Search },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 border-r border-border bg-cards/50 backdrop-blur-md flex flex-col h-full relative z-20">
      <div className="p-6 flex items-center gap-3">
        <Shield className="w-8 h-8 text-primary" />
        <span className="text-xl font-heading font-bold text-white">SendGuard</span>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={twMerge(
                clsx(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                  isActive ? "bg-gradient-to-r from-primary/20 to-transparent text-white border-l-2 border-primary" : "text-text-secondary hover:bg-white/5 hover:text-white"
                )
              )}
            >
              <Icon className={clsx("w-5 h-5", isActive ? "text-primary drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]" : "group-hover:text-white")} />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
