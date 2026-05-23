import { motion, AnimatePresence } from 'framer-motion';
import { Zone } from '../../types';
import { Badge } from '../ui';
import { X, Users, Activity, MapPin, TrendingUp } from 'lucide-react';

interface ZoneDetailsProps {
  zone: Zone | null;
  onClose: () => void;
}

export function ZoneDetails({ zone, onClose }: ZoneDetailsProps) {
  if (!zone) return null;

  const percentage = Math.round((zone.currentCount / zone.capacity) * 100);
  const availableSpace = zone.capacity - zone.currentCount;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={e => e.stopPropagation()}
          className="bg-slate-900/95 border border-slate-700/50 rounded-2xl p-6 max-w-md w-full shadow-2xl"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-500/10 rounded-lg">
                <MapPin className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{zone.name}</h3>
                <p className="text-xs text-slate-400">Zone ID: {zone.id.toUpperCase()}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          <div className="flex items-center justify-between mb-6">
            <Badge status={zone.status} pulse={zone.status === 'critical'} />
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-400">{percentage}% occupied</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm text-slate-400">Current Occupancy</span>
                </div>
                <span className="text-2xl font-bold text-white">{zone.currentCount}</span>
              </div>
              <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full ${
                    zone.status === 'safe'
                      ? 'bg-emerald-500'
                      : zone.status === 'moderate'
                      ? 'bg-amber-500'
                      : zone.status === 'congested'
                      ? 'bg-orange-500'
                      : 'bg-red-500'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>
              <div className="flex justify-between mt-2 text-xs text-slate-500">
                <span>0</span>
                <span>{zone.capacity} max</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                <Activity className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
                <p className="text-lg font-bold text-white">{availableSpace}</p>
                <p className="text-xs text-slate-400">Available Space</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                <Users className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                <p className="text-lg font-bold text-white">{zone.capacity}</p>
                <p className="text-xs text-slate-400">Total Capacity</p>
              </div>
            </div>
          </div>

          {zone.status === 'critical' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg"
            >
              <p className="text-sm text-red-400 font-medium">
                Action Required: This zone requires immediate attention
              </p>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
