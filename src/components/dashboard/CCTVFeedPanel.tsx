import { motion } from 'framer-motion';
import { CCTVFeed } from '../../types';
import { Video, Users, Activity, Wifi, WifiOff } from 'lucide-react';
import { Badge } from '../ui';

interface CCTVFeedPanelProps {
  feeds: CCTVFeed[];
}

export function CCTVFeedPanel({ feeds }: CCTVFeedPanelProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Video className="w-5 h-5 text-cyan-400" />
          Live CCTV Feeds
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">
            {feeds.filter(f => f.aiActive).length} AI Active
          </span>
          <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {feeds.map((feed, index) => (
          <motion.div
            key={feed.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="relative rounded-lg overflow-hidden border border-slate-700/50 bg-slate-900/50"
          >
            <div className="relative aspect-video bg-slate-800">
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src={`https://images.pexels.com/photos/${274916 + index * 100}/pexels-photo-${274916 + index * 100}.jpeg?auto=compress&cs=tinysrgb&w=400`}
                  alt="CCTV footage placeholder"
                  className="w-full h-full object-cover opacity-60"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
              </div>

              <div className="absolute top-2 left-2 flex items-center gap-1.5">
                <motion.div
                  className={`w-2 h-2 rounded-full ${feed.status === 'analyzing' ? 'bg-emerald-400' : 'bg-slate-400'}`}
                  animate={feed.status === 'analyzing' ? { scale: [1, 1.5, 1], opacity: [1, 0.5, 1] } : {}}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                />
                <span className="text-xs text-white/80 font-medium">{feed.location}</span>
              </div>

              {feed.status === 'offline' ? (
                <WifiOff className="absolute top-2 right-2 w-4 h-4 text-red-400" />
              ) : (
                <Wifi className="absolute top-2 right-2 w-4 h-4 text-emerald-400" />
              )}

              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-slate-900/90">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-300">{feed.name}</span>
                  {feed.aiActive && (
                    <motion.span
                      className="flex items-center gap-1 text-xs text-cyan-400 font-medium"
                      animate={{ opacity: [1, 0.7, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      <Activity className="w-3 h-3" />
                      AI Active
                    </motion.span>
                  )}
                </div>
              </div>
            </div>

            <div className="p-2 border-t border-slate-700/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-medium text-white">{feed.peopleCount}</span>
                </div>
                <Badge status={feed.status === 'analyzing' ? 'safe' : 'info'} size="sm" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
