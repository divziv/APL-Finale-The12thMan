import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Users,
  Navigation,
  Bell,
  Clock,
  Ticket,
  Shield,
  AlertTriangle,
  ChevronRight,
  MessageCircle,
  Home,
  LayoutDashboard,
} from 'lucide-react';
import { GlassCard, Badge } from './ui';
import { StadiumHeatmap } from './dashboard/StadiumHeatmap';
import { ZoneDetails } from './dashboard/ZoneDetails';
import { useZoneSimulation, useCrowdMetrics } from '../hooks';
import { navigationSuggestions } from '../data/mockData';
import { Zone } from '../types';

type MobileView = 'home' | 'map' | 'alerts' | 'assistant';

interface MobileAppProps {
  onSwitchToDashboard: () => void;
}

export function MobileApp({ onSwitchToDashboard }: MobileAppProps) {
  const [activeView, setActiveView] = useState<MobileView>('home');
  const { zones } = useZoneSimulation(5000);
  const { metrics } = useCrowdMetrics(zones);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);

  const eventDetails = {
    name: 'Championship Final 2026',
    venue: 'Grand Arena Stadium',
    date: 'Today, 7:00 PM',
    ticket: 'Section B-2, Row 15, Seat 42',
  };

  const emergencyAlerts = metrics.congestedZones > 2 || metrics.emergencyMode;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-900/80 border-b border-slate-700/50 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white">CrowdSphere</h1>
              <p className="text-[10px] text-slate-400">Visitor App</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onSwitchToDashboard}
              className="text-xs px-2 py-1 bg-slate-800/50 border border-slate-700/50 rounded text-slate-300 hover:bg-slate-700/50 transition-colors"
            >
              <LayoutDashboard className="w-3 h-3 inline mr-1" />
              Admin
            </button>
            {emergencyAlerts && (
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="relative"
              >
                <Bell className="w-5 h-5 text-red-400" />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full" />
              </motion.div>
            )}
          </div>
        </div>
      </header>

      <main className="pb-20">
        <AnimatePresence mode="wait">
          {activeView === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="px-4 py-4 space-y-4"
            >
              <div className="p-4 bg-gradient-to-r from-cyan-900/30 via-blue-900/20 to-slate-900/30 border border-cyan-500/20 rounded-xl">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h2 className="text-lg font-bold text-white">{eventDetails.name}</h2>
                    <p className="text-sm text-slate-400">{eventDetails.venue}</p>
                  </div>
                  <Clock className="w-5 h-5 text-cyan-400" />
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <Clock className="w-3 h-3" />
                  {eventDetails.date}
                </div>
              </div>

              <GlassCard hover={false} className="p-4 border border-amber-500/20 bg-amber-900/10">
                <div className="flex items-center gap-3">
                  <Ticket className="w-5 h-5 text-amber-400" />
                  <div className="flex-1">
                    <p className="text-xs text-slate-400">Your Ticket</p>
                    <p className="text-sm font-medium text-white">{eventDetails.ticket}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </div>
              </GlassCard>

              <div className="grid grid-cols-2 gap-3">
                <GlassCard hover={true} className="p-4">
                  <div className="flex flex-col items-center text-center">
                    <div className={`p-3 rounded-full ${emergencyAlerts ? 'bg-red-500/20' : 'bg-emerald-500/20'} mb-2`}>
                      <Users className={`w-6 h-6 ${emergencyAlerts ? 'text-red-400' : 'text-emerald-400'}`} />
                    </div>
                    <p className="text-xs text-slate-400">Current Crowd</p>
                    <p className="text-xl font-bold text-white">{metrics.totalCount.toLocaleString()}</p>
                  </div>
                </GlassCard>
                <GlassCard hover={true} className="p-4">
                  <div className="flex flex-col items-center text-center">
                    <div className={`p-3 rounded-full ${metrics.safeZones > zones.length / 2 ? 'bg-emerald-500/20' : 'bg-amber-500/20'}`}>
                      <Shield className={`w-6 h-6 ${metrics.safeZones > zones.length / 2 ? 'text-emerald-400' : 'text-amber-400'}`} />
                    </div>
                    <p className="text-xs text-slate-400">Safe Zones</p>
                    <p className="text-xl font-bold text-white">{metrics.safeZones}/{zones.length}</p>
                  </div>
                </GlassCard>
              </div>

              <div className="mt-4">
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-cyan-400" />
                  Smart Suggestions
                </h3>
                <div className="space-y-2">
                  {navigationSuggestions.slice(0, 3).map((suggestion, index) => (
                    <motion.div
                      key={suggestion.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-3 bg-slate-800/30 border border-slate-700/50 rounded-lg"
                    >
                      <p className="text-sm text-white">{suggestion.message}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-slate-400">{suggestion.destination}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-cyan-400">{suggestion.eta}</span>
                          <Badge status={suggestion.crowdLevel} size="sm" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {metrics.emergencyMode && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-red-900/20 border border-red-500/30 rounded-xl"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    <span className="text-sm font-bold text-red-400">Emergency Alert</span>
                  </div>
                  <p className="text-sm text-white">
                    Please proceed to nearest exit. Follow evacuation signs.
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}

          {activeView === 'map' && (
            <motion.div
              key="map"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="px-4 py-4"
            >
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-cyan-400" />
                Crowd Heatmap
              </h2>
              <GlassCard hover={false} className="p-4">
                <StadiumHeatmap
                  zones={zones}
                  onZoneClick={setSelectedZone}
                  emergencyMode={metrics.emergencyMode}
                />
              </GlassCard>
              <div className="mt-4 flex justify-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-emerald-500" />
                  <span className="text-xs text-slate-400">Safe</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-amber-500" />
                  <span className="text-xs text-slate-400">Moderate</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-red-500" />
                  <span className="text-xs text-slate-400">Congested</span>
                </div>
              </div>
            </motion.div>
          )}

          {activeView === 'alerts' && (
            <motion.div
              key="alerts"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="px-4 py-4"
            >
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5 text-cyan-400" />
                Alerts & Notifications
              </h2>
              <div className="space-y-3">
                {metrics.emergencyMode ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-900/20 border border-red-500/30 rounded-xl"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-5 h-5 text-red-400 animate-pulse" />
                      <Badge status="emergency" pulse />
                    </div>
                    <p className="text-sm text-white font-medium">Emergency Evacuation Active</p>
                    <p className="text-xs text-slate-400 mt-1">Move toward Exit A - 2 min away</p>
                  </motion.div>
                ) : (
                  <>
                    <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <p className="text-sm text-white">Welcome to the Championship Final!</p>
                      <p className="text-xs text-slate-400 mt-1">Event starts at 7:00 PM</p>
                    </div>
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                      <p className="text-sm text-white">Section B-2 is your ticket location</p>
                      <p className="text-xs text-slate-400 mt-1">Current status: {zones.find(z => z.id === 'b2')?.status || 'safe'}</p>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}

          {activeView === 'assistant' && (
            <motion.div
              key="assistant"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="px-4 py-4"
            >
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-cyan-400" />
                AI Assistant
              </h2>
              <div className="space-y-3">
                {['Nearest restroom with low queue?', 'Best food court option?', 'How to get to my seat?'].map((q, i) => (
                  <button key={i} className="w-full p-3 bg-slate-800/30 border border-slate-700/50 rounded-lg text-left hover:bg-slate-700/30 transition-colors">
                    <p className="text-sm text-white">{q}</p>
                  </button>
                ))}
              </div>
              <div className="mt-6 p-4 bg-gradient-to-r from-cyan-900/20 to-blue-900/10 border border-cyan-500/20 rounded-xl">
                <p className="text-sm text-white font-medium">Quick tip:</p>
                <p className="text-xs text-slate-300 mt-1">
                  The AI assistant can help you find the fastest routes, less crowded areas, and real-time updates during the event.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 backdrop-blur-xl bg-slate-900/90 border-t border-slate-700/50 px-2 py-2">
        <div className="flex items-center justify-around">
          {[
            { id: 'home' as MobileView, icon: Home, label: 'Home' },
            { id: 'map' as MobileView, icon: MapPin, label: 'Map' },
            { id: 'alerts' as MobileView, icon: Bell, label: 'Alerts' },
            { id: 'assistant' as MobileView, icon: MessageCircle, label: 'Assistant' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors ${
                activeView === item.id
                  ? 'text-cyan-400 bg-cyan-500/10'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      <ZoneDetails zone={selectedZone} onClose={() => setSelectedZone(null)} />
    </div>
  );
}
