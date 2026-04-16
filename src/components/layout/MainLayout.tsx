import { Outlet, Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { Calendar, Clock, ArrowRightLeft, AlertTriangle, Settings, Building } from 'lucide-react';

const MENU_ITEMS = [
  { path: '/', label: 'Proyección de Turnos', icon: Calendar },
  { path: '/schedule', label: 'Horario Detallado', icon: Clock },
  { path: '/shift-changes', label: 'Cambio de Turno', icon: ArrowRightLeft },
  { path: '/discrepancies', label: 'Descuadres', icon: AlertTriangle },
  { path: '/settings', label: 'Configuración', icon: Settings },
];

export function MainLayout() {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-xl print:hidden">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center border border-primary/30 shrink-0">
            <Building className="w-6 h-6 text-blue-400" />
          </div>
          <div className="flex flex-col">
             <h1 className="font-bold text-lg leading-tight">Casino <span className="text-blue-400">Pro</span></h1>
             <a href="https://nexastudio.info/" target="_blank" rel="noopener noreferrer" className="text-[10px] text-slate-400 tracking-widest uppercase mt-1 hover:text-blue-400 transition-colors">
               by NexaStudio
             </a>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {MENU_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-lg transition-colors cursor-pointer text-sm font-medium",
                  isActive 
                    ? "bg-blue-600/20 text-blue-400 border border-blue-500/20" 
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "text-blue-400" : "text-slate-500")} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden flex flex-col">
        <div className="h-16 bg-white border-b flex items-center px-8 shadow-sm justify-between shrink-0 print:hidden">
          <h2 className="font-semibold text-slate-800">
            {MENU_ITEMS.find((i) => i.path === location.pathname)?.label || 'Casino App'}
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full font-medium border border-emerald-200">En línea (Local)</span>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-6 relative">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
