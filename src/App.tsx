import { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { MobileApp } from './components/MobileApp';
import { Smartphone, Monitor } from 'lucide-react';

type ViewMode = 'dashboard' | 'mobile';

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');

  return (
    <div className="relative">
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2 p-1 bg-slate-900/80 backdrop-blur-xl rounded-lg border border-slate-700/50">
        <button
          onClick={() => setViewMode('dashboard')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
            viewMode === 'dashboard'
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Monitor className="w-4 h-4" />
          Admin
        </button>
        <button
          onClick={() => setViewMode('mobile')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
            viewMode === 'mobile'
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          Mobile
        </button>
      </div>

      {viewMode === 'dashboard' ? <Dashboard /> : <MobileApp onSwitchToDashboard={() => setViewMode('dashboard')} />}
    </div>
  );
}

export default App;
