import { motion } from 'framer-motion';
import { Zone } from '../../types';
import { AlertTriangle } from 'lucide-react';

interface StadiumHeatmapProps {
  zones: Zone[];
  onZoneClick?: (zone: Zone) => void;
  emergencyMode?: boolean;
}

const statusColors = {
  safe: { fill: 'rgba(34, 197, 94, 0.4)', stroke: '#22c55e', text: '#22c55e' },
  moderate: { fill: 'rgba(251, 191, 36, 0.4)', stroke: '#fbbf24', text: '#fbbf24' },
  congested: { fill: 'rgba(251, 146, 60, 0.5)', stroke: '#fb923c', text: '#fb923c' },
  critical: { fill: 'rgba(239, 68, 68, 0.6)', stroke: '#ef4444', text: '#ef4444' },
};

export function StadiumHeatmap({ zones, onZoneClick, emergencyMode }: StadiumHeatmapProps) {
  return (
    <div className="relative">
      <svg
        viewBox="0 0 500 450"
        className="w-full h-auto max-h-[400px]"
        style={{ filter: emergencyMode ? 'hue-rotate(0deg)' : 'none' }}
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="fieldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1e3a2a" />
            <stop offset="100%" stopColor="#0f1f17" />
          </linearGradient>
          <linearGradient id="emergencyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3a1a1a" />
            <stop offset="100%" stopColor="#1f0f0f" />
          </linearGradient>
        </defs>

        <rect
          x="0"
          y="0"
          width="500"
          height="450"
          rx="20"
          fill="rgba(15, 23, 42, 0.8)"
          stroke="rgba(71, 85, 105, 0.5)"
          strokeWidth="2"
        />

        <ellipse
          cx="250"
          cy="225"
          rx="120"
          ry="80"
          fill={emergencyMode ? 'url(#emergencyGradient)' : 'url(#fieldGradient)'}
          stroke={emergencyMode ? '#ef4444' : '#22c55e'}
          strokeWidth="2"
          className="transition-all duration-500"
        />

        {emergencyMode && (
          <text
            x="250"
            y="230"
            textAnchor="middle"
            fill="#ef4444"
            fontSize="14"
            fontWeight="bold"
            className="animate-pulse"
          >
            EVACUATION IN PROGRESS
          </text>
        )}

        {zones.map(zone => {
          const colors = statusColors[zone.status];

          return (
            <motion.g
              key={zone.id}
              className="cursor-pointer"
              onClick={() => onZoneClick?.(zone)}
              whileHover={{ scale: 1.02 }}
              style={{ transformOrigin: `${zone.x + zone.width / 2}px ${zone.y + zone.height / 2}px` }}
            >
              <motion.rect
                x={zone.x}
                y={zone.y}
                width={zone.width}
                height={zone.height}
                rx="8"
                fill={emergencyMode ? 'rgba(239, 68, 68, 0.3)' : colors.fill}
                stroke={emergencyMode ? '#ef4444' : colors.stroke}
                strokeWidth="2"
                filter="url(#glow)"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  fill: emergencyMode ? 'rgba(239, 68, 68, 0.3)' : colors.fill,
                }}
                transition={{ duration: 0.5 }}
              />

              <text
                x={zone.x + zone.width / 2}
                y={zone.y + zone.height / 2}
                textAnchor="middle"
                fill={emergencyMode ? '#ef4444' : colors.text}
                fontSize="11"
                fontWeight="600"
                className="pointer-events-none select-none"
              >
                {zone.name.includes('Section') ? zone.name.replace('Section ', '') : zone.name.split(' ')[0]}
              </text>

              <text
                x={zone.x + zone.width / 2}
                y={zone.y + zone.height / 2 + 16}
                textAnchor="middle"
                fill="white"
                fontSize="10"
                fontWeight="bold"
                className="pointer-events-none select-none"
              >
                {zone.currentCount}
              </text>

              {(zone.status === 'critical' || zone.status === 'congested') && !emergencyMode && (
                <motion.circle
                  cx={zone.x + zone.width - 12}
                  cy={zone.y + 12}
                  r="6"
                  fill="#ef4444"
                  animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                />
              )}
            </motion.g>
          );
        })}

        <g className="pointer-events-none">
          <rect x="50" y="450" width="120" height="0" fill="transparent" />
          <text x="20" y="440" fill="white" fontSize="10" fontWeight="bold">
            STADIUM LEGEND
          </text>

          <g transform="translate(20, 395)">
            <rect width="12" height="12" rx="2" fill={statusColors.safe.fill} stroke={statusColors.safe.stroke} />
            <text x="18" y="10" fill="white" fontSize="9">Safe (&lt;70%)</text>
          </g>
          <g transform="translate(90, 395)">
            <rect width="12" height="12" rx="2" fill={statusColors.moderate.fill} stroke={statusColors.moderate.stroke} />
            <text x="18" y="10" fill="white" fontSize="9">Moderate (70-85%)</text>
          </g>
          <g transform="translate(200, 395)">
            <rect width="12" height="12" rx="2" fill={statusColors.congested.fill} stroke={statusColors.congested.stroke} />
            <text x="18" y="10" fill="white" fontSize="9">Congested (85-95%)</text>
          </g>
          <g transform="translate(320, 395)">
            <rect width="12" height="12" rx="2" fill={statusColors.critical.fill} stroke={statusColors.critical.stroke} />
            <text x="18" y="10" fill="white" fontSize="9">Critical (&gt;95%)</text>
          </g>
        </g>
      </svg>

      {zones.filter(z => z.status === 'critical').length > 0 && (
        <motion.div
          className="absolute top-2 right-2 flex items-center gap-2 px-3 py-1.5 bg-red-500/20 border border-red-500/50 rounded-lg"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <AlertTriangle className="w-4 h-4 text-red-400" />
          <span className="text-red-400 text-sm font-medium">
            {zones.filter(z => z.status === 'critical').length} Critical Zones
          </span>
        </motion.div>
      )}
    </div>
  );
}
