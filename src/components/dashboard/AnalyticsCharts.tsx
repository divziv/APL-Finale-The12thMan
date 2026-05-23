import { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { motion } from 'framer-motion';
import { TrendingUp, BarChart3 } from 'lucide-react';
import { Zone } from '../../types';
import { generateTimeSeriesData } from '../../data/mockData';

interface AnalyticsChartsProps {
  zones: Zone[];
}

export function AnalyticsCharts({ zones }: AnalyticsChartsProps) {
  const [crowdTrend, setCrowdTrend] = useState(generateTimeSeriesData(1));
  const [selectedTimeRange, setSelectedTimeRange] = useState<'1h' | '4h' | '12h'>('1h');

  useEffect(() => {
    const updateData = () => setCrowdTrend(generateTimeSeriesData(selectedTimeRange === '1h' ? 1 : selectedTimeRange === '4h' ? 4 : 12));
    updateData();
    const timer = setInterval(updateData, 15000);
    return () => clearInterval(timer);
  }, [selectedTimeRange]);

  const zoneDistribution = zones.map(zone => ({
    name: zone.name.includes('Section') ? zone.name.replace('Section ', '') : zone.name.split(' ')[0],
    current: zone.currentCount,
    capacity: zone.capacity,
    percentage: Math.round((zone.currentCount / zone.capacity) * 100),
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900/40 border border-slate-700/50 rounded-xl p-4"
      >
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            Crowd Trend
          </h4>
          <div className="flex gap-1">
            {(['1h', '4h', '12h'] as const).map(range => (
              <button
                key={range}
                onClick={() => setSelectedTimeRange(range)}
                className={`px-2 py-1 text-xs rounded ${
                  selectedTimeRange === range
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={crowdTrend}>
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" strokeOpacity={0.3} />
            <XAxis dataKey="timestamp" stroke="#64748b" fontSize={10} />
            <YAxis stroke="#64748b" fontSize={10} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #475569',
                borderRadius: '8px',
              }}
              labelStyle={{ color: '#fff' }}
              itemStyle={{ color: '#22d3ee' }}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#22d3ee"
              strokeWidth={2}
              fill="url(#colorCount)"
              animationDuration={500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-slate-900/40 border border-slate-700/50 rounded-xl p-4"
      >
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            Zone Occupancy
          </h4>
          <span className="text-xs text-slate-400">Current vs Capacity</span>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={zoneDistribution.slice(0, 6)} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" strokeOpacity={0.3} />
            <XAxis type="number" stroke="#64748b" fontSize={10} />
            <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={10} width={60} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #475569',
                borderRadius: '8px',
              }}
              cursor={{ fill: 'rgba(34, 211, 238, 0.1)' }}
            />
            <Bar dataKey="current" fill="#22d3ee" radius={[0, 4, 4, 0]} name="Current" />
            <Bar dataKey="capacity" fill="#475569" radius={[0, 4, 4, 0]} name="Capacity" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}
