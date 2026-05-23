import { motion } from 'framer-motion';
import { EvacuationRoute } from '../../types';
import { Badge } from '../ui';
import { AlertTriangle, Navigation, Users, ArrowRight } from 'lucide-react';
import { evacuationRoutes as initialRoutes } from '../../data/mockData';

interface EmergencyPanelProps {
  routes?: EvacuationRoute[];
  zonesCount: number;
}

export function EmergencyPanel({ routes = initialRoutes, zonesCount }: EmergencyPanelProps) {
  const totalEvacuated = routes.reduce((sum, r) => sum + r.currentFlow, 0);
  const activeRoutes = routes.filter(r => r.status === 'active');

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="bg-gradient-to-br from-red-900/20 via-red-800/10 to-slate-900/40 border border-red-500/30 rounded-xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="p-2 bg-red-500/20 rounded-lg"
          >
            <AlertTriangle className="w-6 h-6 text-red-400" />
          </motion.div>
          <div>
            <h3 className="text-lg font-bold text-red-400">EVACUATION MODE ACTIVE</h3>
            <p className="text-xs text-red-300/70">Emergency protocols engaged</p>
          </div>
        </div>
        <Badge status="emergency" pulse />
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-red-900/20 rounded-lg">
          <p className="text-2xl font-bold text-red-400">{activeRoutes.length}</p>
          <p className="text-xs text-slate-400">Active Routes</p>
        </div>
        <div className="text-center p-3 bg-amber-900/20 rounded-lg">
          <p className="text-2xl font-bold text-amber-400">{zonesCount}</p>
          <p className="text-xs text-slate-400">Zones to Evacuate</p>
        </div>
        <div className="text-center p-3 bg-emerald-900/20 rounded-lg">
          <p className="text-2xl font-bold text-emerald-400">{totalEvacuated}</p>
          <p className="text-xs text-slate-400">Evacuated</p>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-white flex items-center gap-2">
          <Navigation className="w-4 h-4 text-cyan-400" />
          Evacuation Routes
        </h4>
        {routes.slice(0, 4).map((route, index) => (
          <motion.div
            key={route.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-3 rounded-lg border ${
              route.status === 'active'
                ? 'bg-emerald-900/20 border-emerald-500/30'
                : route.status === 'standby'
                ? 'bg-slate-800/50 border-slate-700/50'
                : 'bg-red-900/20 border-red-500/30'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ArrowRight
                  className={`w-4 h-4 ${
                    route.status === 'active' ? 'text-emerald-400' : 'text-slate-500'
                  }`}
                />
                <span className="text-sm font-medium text-white">{route.name}</span>
              </div>
              <Badge status={route.status === 'active' ? 'safe' : route.status === 'standby' ? 'info' : 'critical'} size="sm" />
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2">
                <Users className="w-3 h-3 text-slate-400" />
                <span className="text-xs text-slate-400">
                  {route.currentFlow}/{route.capacity}
                </span>
              </div>
              <div className="h-2 w-24 bg-slate-700/50 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full ${
                    route.status === 'active' ? 'bg-emerald-500' : 'bg-slate-600'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${(route.currentFlow / route.capacity) * 100}%` }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
