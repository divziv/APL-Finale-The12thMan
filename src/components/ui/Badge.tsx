import { motion } from 'framer-motion';
import { ZoneStatus, AlertSeverity } from '../../types';

interface BadgeProps {
  status: ZoneStatus | AlertSeverity;
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
}

const statusColors: Record<ZoneStatus | AlertSeverity, { bg: string; text: string; glow: string }> = {
  safe: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', glow: 'shadow-emerald-500/50' },
  moderate: { bg: 'bg-amber-500/20', text: 'text-amber-400', glow: 'shadow-amber-500/50' },
  congested: { bg: 'bg-orange-500/20', text: 'text-orange-400', glow: 'shadow-orange-500/50' },
  critical: { bg: 'bg-red-500/20', text: 'text-red-400', glow: 'shadow-red-500/50' },
  info: { bg: 'bg-blue-500/20', text: 'text-blue-400', glow: 'shadow-blue-500/50' },
  warning: { bg: 'bg-amber-500/20', text: 'text-amber-400', glow: 'shadow-amber-500/50' },
  emergency: { bg: 'bg-red-600/30', text: 'text-red-500', glow: 'shadow-red-600/50' },
};

const statusLabels: Record<ZoneStatus | AlertSeverity, string> = {
  safe: 'SAFE',
  moderate: 'MODERATE',
  congested: 'CONGESTED',
  critical: 'CRITICAL',
  info: 'INFO',
  warning: 'WARNING',
  emergency: 'EMERGENCY',
};

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-1.5 text-base',
};

export function Badge({ status, size = 'md', pulse = false }: BadgeProps) {
  const colors = statusColors[status];

  return (
    <motion.span
      className={`
        inline-flex items-center gap-1.5 font-semibold rounded-lg
        ${colors.bg} ${colors.text}
        ${sizes[size]}
        ${pulse ? 'animate-pulse shadow-lg ' + colors.glow : ''}
      `}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      {pulse && (
        <motion.span
          className="w-2 h-2 rounded-full bg-current"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1 }}
        />
      )}
      {statusLabels[status]}
    </motion.span>
  );
}
