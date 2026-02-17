
import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import InstructionConsole from './InstructionConsole';

const Layout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    { label: 'Dashboard', path: '/', icon: '📊' },
    { label: 'Fund House', path: '/fund-houses', icon: '🏠' },
    { label: 'Schemes', path: '/schemes', icon: 'SC' },
    { label: 'Scheme Migration', path: '/scheme-migration', icon: 'MG' },
    { label: 'Data Loader', path: '/loader', icon: '📥' },
  ];

  const handleActionComplete = () => {
    // Refresh the current route or navigate if needed
    window.location.reload();
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-slate-900 text-white flex flex-col transition-all duration-300 shadow-2xl z-20`}>
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded flex items-center justify-center font-bold shadow-lg">MF</div>
          {isSidebarOpen && <span className="font-bold text-lg tracking-tight">Admin Shell</span>}
        </div>
        
        <nav className="flex-1 mt-6 px-3 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 px-3 py-3 rounded-lg transition-all duration-200 ${
                  isActive ? 'bg-indigo-600 text-white shadow-indigo-500/20 shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                {isSidebarOpen && <span className="font-medium">{item.label}</span>}
              </Link>
            );
          })}

        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="w-full flex items-center justify-center p-2 rounded hover:bg-slate-800 text-slate-500 transition-colors"
          >
            {isSidebarOpen ? <span className="text-xs font-bold uppercase tracking-widest">Collapse View</span> : '→'}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
              Portal / {navItems.find(n => n.path === location.pathname)?.label || 'System'}
            </h2>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:block text-right">
              <p className="text-sm font-bold text-slate-900">Root Administrator</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-tighter">System Override Active</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center overflow-hidden shadow-inner">
               <img src="https://picsum.photos/seed/admin-root/40/40" alt="Avatar" />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 relative scroll-smooth bg-slate-50/50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;

