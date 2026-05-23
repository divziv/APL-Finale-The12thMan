import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  AlertTriangle,
  MapPin,
  Shield,
  Radio,
  Siren,
  Activity,
  Settings,
  Bell,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { GlassCard, MetricCard, Badge } from './ui';
import {
  StadiumHeatmap,
  AlertFeed,
  CCTVFeedPanel,
  AnalyticsCharts,
  EmergencyPanel,
  ZoneDetails,
} from './dashboard';
import { useZoneSimulation, useAlertSimulation, useCrowdMetrics, useCCTVSimulation } from '../hooks';
import { Zone } from '../types';

export function Dashboard() {
  const { zones } = useZoneSimulation(3000);
  const { alerts, acknowledgeAlert } = useAlertSimulation(zones, 5000);
  const { metrics, toggleEmergencyMode } = useCrowdMetrics(zones);
  const cctvFeeds = useCCTVSimulation(2000);

  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleEmergencyToggle = () => {
    if (!metrics.emergencyMode) {
      if (confirm('Activate Emergency Evacuation Mode? This will trigger emergency protocols.')) {
        toggleEmergencyMode();
      }
    } else {
      toggleEmergencyMode();
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      metrics.emergencyMode
        ? 'bg-gradient-to-br from-red-950 via-slate-950 to-slate-900'
        : 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950'
    }`}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/10 via-transparent to-transparent" />

      <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-900/70 border-b border-slate-700/50">
        <div className="max-w-[1800px] mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                CrowdSphere AI
                {metrics.emergencyMode && (
                  <motion.span
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="text-xs px-2 py-0.5 bg-red-500/20 border border-red-500/50 rounded text-red-400"
                  >
                    EMERGENCY
                  </motion.span>
                )}
              </h1>
              <p className="text-xs text-slate-400">Smart Stadium Crowd Monitoring</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-sm text-cyan-400 font-medium flex items-center gap-1">
              <Activity className="w-4 h-4" /> Dashboard
              <ChevronRight className="w-3 h-3" />
            </a>
            <a href="#analytics" className="text-sm text-slate-400 hover:text-white transition-colors">
              Analytics
            </a>
            <a href="#feeds" className="text-sm text-slate-400 hover:text-white transition-colors">
              Live Feeds
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={handleEmergencyToggle}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                metrics.emergencyMode
                  ? 'bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30'
                  : 'bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:bg-slate-700/50'
              }`}
            >
              {metrics.emergencyMode ? (
                <>
                  <Siren className="w-4 h-4" /> Deactivate Emergency
                </>
              ) : (
                <>
                  <Radio className="w-4 h-4" /> Emergency Mode
                </>
              )}
            </button>

            <button className="relative p-2 hover:bg-slate-800/50 rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-slate-400" />
              {alerts.filter(a => !a.acknowledged).length > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center"
                >
                  {alerts.filter(a => !a.acknowledged).length}
                </motion.span>
              )}
            </button>

            <button className="p-2 hover:bg-slate-800/50 rounded-lg transition-colors md:hidden" onClick={() => setShowMobileMenu(!showMobileMenu)}>
              <Settings className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1800px] mx-auto p-4 md:p-6 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <MetricCard
            title="Total Crowd"
            value={metrics.totalCount.toLocaleString()}
            subtitle="Live count"
            icon={Users}
            color="cyan"
            trend="up"
            trendValue="+2.3%"
            emergency={metrics.emergencyMode}
          />
          <MetricCard
            title="Active Alerts"
            value={metrics.activeAlerts}
            subtitle={metrics.activeAlerts > 0 ? 'Requires attention' : 'All clear'}
            icon={AlertTriangle}
            color={metrics.activeAlerts > 0 ? 'red' : 'emerald'}
            emergency={metrics.emergencyMode}
          />
          <MetricCard
            title="Safe Zones"
            value={metrics.safeZones}
            subtitle={`${zones.length} total zones`}
            icon={Shield}
            color="emerald"
            emergency={metrics.emergencyMode}
          />
          <MetricCard
            title="Congested Areas"
            value={metrics.congestedZones}
            subtitle="Above 85% capacity"
            icon={MapPin}
            color={metrics.congestedZones > 0 ? 'amber' : 'slate'}
            emergency={metrics.emergencyMode}
          />
          <MetricCard
            title="System Status"
            value="Operational"
            subtitle="AI Detection Active"
            icon={Zap}
            color="cyan"
            emergency={metrics.emergencyMode}
          />
        </div>

        <AnimatePresence>
          {metrics.emergencyMode && (
            <EmergencyPanel zonesCount={zones.filter(z => z.status !== 'safe').length} />
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <GlassCard hover={false}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-cyan-400" />
                  Stadium Heatmap
                </h2>
                <Badge status={metrics.emergencyMode ? 'emergency' : 'safe'} pulse={metrics.emergencyMode} />
              </div>
              <StadiumHeatmap
                zones={zones}
                onZoneClick={setSelectedZone}
                emergencyMode={metrics.emergencyMode}
              />
            </GlassCard>

            <div id="feeds">
              <GlassCard hover={false}>
                <CCTVFeedPanel feeds={cctvFeeds} />
              </GlassCard>
            </div>

            <div id="analytics">
              <AnalyticsCharts zones={zones} />
            </div>
          </div>

          <div className="space-y-6">
            <GlassCard hover={false} className="h-[480px] overflow-hidden">
              <AlertFeed
                alerts={alerts}
                onAcknowledge={acknowledgeAlert}
                emergencyMode={metrics.emergencyMode}
              />
            </GlassCard>

            <GlassCard hover={false}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-cyan-400" />
                  Quick Stats
                </h3>
              </div>
              <div className="space-y-3">
                {zones.slice(0, 5).map(zone => (
                  <div key={zone.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          zone.status === 'safe'
                            ? 'bg-emerald-400'
                            : zone.status === 'moderate'
                            ? 'bg-amber-400'
                            : zone.status === 'congested'
                            ? 'bg-orange-400'
                            : 'bg-red-400'
                        }`}
                      />
                      <span className="text-sm text-slate-300">{zone.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-white font-medium">{zone.currentCount}</span>
                      <span className="text-xs text-slate-500">/ {zone.capacity}</span>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </main>

      <ZoneDetails zone={selectedZone} onClose={() => setSelectedZone(null)} />
    </div>
  );
}
