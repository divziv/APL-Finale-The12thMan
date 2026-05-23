import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Alert, AlertSeverity } from '../../types';
import { Badge } from '../ui';
import { AlertTriangle, Info, AlertCircle, Siren, CheckCircle, Video as LucideIcon } from 'lucide-react';

interface AlertFeedProps {
  alerts: Alert[];
  onAcknowledge?: (alertId: string) => void;
  emergencyMode?: boolean;
}

const severityIcons: Record<AlertSeverity, LucideIcon> = {
  info: Info,
  warning: AlertTriangle,
  critical: AlertCircle,
  emergency: Siren,
};

const severityColors: Record<AlertSeverity, string> = {
  info: 'border-blue-500/30 bg-blue-500/5',
  warning: 'border-amber-500/30 bg-amber-500/5',
  critical: 'border-red-500/40 bg-red-500/10',
  emergency: 'border-red-600/50 bg-red-600/20',
};

export function AlertFeed({ alerts, onAcknowledge }: AlertFeedProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [alerts]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-cyan-400" />
          Live Alert Feed
        </h3>
        {alerts.filter(a => !a.acknowledged).length > 0 && (
          <motion.span
            className="px-2 py-1 bg-cyan-500/20 text-cyan-400 text-sm font-medium rounded-full"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            {alerts.filter(a => !a.acknowledged).length} Active
          </motion.span>
        )}
      </div>

      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto space-y-3 pr-2 max-h-[400px] scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent"
      >
        <AnimatePresence mode="popLayout">
          {alerts.length === 0 ? (
            <motion.div
              key="no-alerts"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-12 text-slate-500"
            >
              <CheckCircle className="w-12 h-12 mb-3 opacity-50" />
              <p className="text-sm">No active alerts</p>
            </motion.div>
          ) : (
            alerts.map(alert => {
              const Icon = severityIcons[alert.severity];
              return (
                <motion.div
                  key={alert.id}
                  layout
                  initial={{ opacity: 0, x: -20, height: 0 }}
                  animate={{ opacity: 1, x: 0, height: 'auto' }}
                  exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`
                    relative p-4 rounded-lg border transition-all
                    ${alert.acknowledged ? 'opacity-50' : ''}
                    ${severityColors[alert.severity]}
                    ${!alert.acknowledged ? 'hover:bg-slate-800/30 cursor-pointer' : ''}
                  `}
                  onClick={() => !alert.acknowledged && onAcknowledge?.(alert.id)}
                >
                  <div className="flex items-start gap-3">
                    <motion.div
                      animate={alert.severity === 'emergency' ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ repeat: Infinity, duration: 1 }}
                    >
                      <Icon
                        className={`w-5 h-5 mt-0.5 ${
                          alert.severity === 'info'
                            ? 'text-blue-400'
                            : alert.severity === 'warning'
                            ? 'text-amber-400'
                            : alert.severity === 'critical'
                            ? 'text-red-400'
                            : 'text-red-500 animate-pulse'
                        }`}
                      />
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge status={alert.severity} size="sm" pulse={alert.severity === 'emergency'} />
                        <span className="text-xs text-slate-500">
                          {alert.timestamp.toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                          })}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-white">{alert.message}</p>
                      {alert.zoneId && (
                        <p className="mt-1 text-xs text-slate-400">Zone: {alert.zoneId}</p>
                      )}
                    </div>
                  </div>

                  {!alert.acknowledged && (
                    <motion.div
                      className="absolute top-2 right-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <span className="text-xs text-cyan-400 hover:text-cyan-300">Click to acknowledge</span>
                    </motion.div>
                  )}
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
