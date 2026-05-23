import { motion } from 'framer-motion';
import { Video as LucideIcon } from 'lucide-react';
import { GlassCard } from './GlassCard';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  color?: 'cyan' | 'red' | 'amber' | 'emerald' | 'slate';
  emergency?: boolean;
}

const colorMap: Record<string, { icon: string; glow: 'cyan' | 'red' | 'yellow' | 'green' | 'none'; bg: string }> = {
  cyan: { icon: 'text-cyan-400', glow: 'cyan', bg: 'from-cyan-500/10' },
  red: { icon: 'text-red-400', glow: 'red', bg: 'from-red-500/10' },
  amber: { icon: 'text-amber-400', glow: 'yellow', bg: 'from-amber-500/10' },
  emerald: { icon: 'text-emerald-400', glow: 'green', bg: 'from-emerald-500/10' },
  slate: { icon: 'text-slate-400', glow: 'none', bg: 'from-slate-500/10' },
};

export function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  color = 'cyan',
  emergency = false,
}: MetricCardProps) {
  const colors = emergency ? colorMap.red : colorMap[color];

  return (
    <GlassCard glow={colors.glow} hover={false}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
          <motion.h3
            className={`text-3xl font-bold ${colors.icon}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={String(value)}
            transition={{ duration: 0.3 }}
          >
            {value}
          </motion.h3>
          {subtitle && (
            <p className="text-slate-500 text-xs mt-1">{subtitle}</p>
          )}
          {trend && trendValue && (
            <div className="flex items-center gap-1 mt-2">
              <motion.span
                className={`text-sm font-medium ${
                  trend === 'up' ? 'text-red-400' : trend === 'down' ? 'text-emerald-400' : 'text-slate-400'
                }`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}
              </motion.span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${colors.bg} to-transparent`}>
          <Icon className={`w-6 h-6 ${colors.icon}`} />
        </div>
      </div>
    </GlassCard>
  );
}
