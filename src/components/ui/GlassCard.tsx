import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
  glow?: 'cyan' | 'red' | 'yellow' | 'green' | 'none';
}

export function GlassCard({ children, className = '', onClick, hover = true, glow = 'none' }: GlassCardProps) {
  const glowColors = {
    cyan: 'hover:shadow-[0_0_30px_rgba(34,211,238,0.3)]',
    red: 'hover:shadow-[0_0_30px_rgba(239,68,68,0.3)]',
    yellow: 'hover:shadow-[0_0_30px_rgba(250,204,21,0.3)]',
    green: 'hover:shadow-[0_0_30px_rgba(34,197,94,0.3)]',
    none: '',
  };

  return (
    <motion.div
      className={`
        backdrop-blur-xl
        bg-slate-900/60
        border
        border-slate-700/50
        rounded-xl
        p-6
        ${hover ? 'cursor-pointer transition-all duration-300' : ''}
        ${glowColors[glow]}
        ${className}
      `}
      onClick={onClick}
      whileHover={hover ? { y: -2, scale: 1.01 } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {children}
    </motion.div>
  );
}
