import { motion } from "framer-motion";

interface AwenLogoProps {
  className?: string;
}

const AwenLogo = ({ className = "w-10 h-10" }: AwenLogoProps) => {
  return (
    <motion.svg
      viewBox="0 0 100 100"
      className={className}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <defs>
        <linearGradient id="awenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(217, 91%, 60%)" />
          <stop offset="50%" stopColor="hsl(200, 90%, 55%)" />
          <stop offset="100%" stopColor="hsl(187, 94%, 48%)" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      
      {/* Abstract triskelion-inspired wave symbol */}
      <g filter="url(#glow)">
        {/* Center circle */}
        <circle
          cx="50"
          cy="50"
          r="8"
          fill="url(#awenGradient)"
        />
        
        {/* Three flowing waves emanating from center */}
        <motion.path
          d="M50 42 Q65 30, 75 35 Q85 40, 80 55"
          stroke="url(#awenGradient)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, delay: 0.2 }}
        />
        <motion.path
          d="M44 54 Q30 55, 25 70 Q22 82, 35 85"
          stroke="url(#awenGradient)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, delay: 0.4 }}
        />
        <motion.path
          d="M56 54 Q60 70, 50 80 Q40 90, 25 82"
          stroke="url(#awenGradient)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, delay: 0.6 }}
        />
        
        {/* Outer ring */}
        <motion.circle
          cx="50"
          cy="50"
          r="42"
          stroke="url(#awenGradient)"
          strokeWidth="1.5"
          fill="none"
          opacity="0.4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, delay: 0.8 }}
        />
      </g>
    </motion.svg>
  );
};

export default AwenLogo;
