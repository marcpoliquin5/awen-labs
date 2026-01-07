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
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      
      <g filter="url(#glow)">
        {/* Outer ring */}
        <motion.circle
          cx="50"
          cy="50"
          r="44"
          stroke="url(#awenGradient)"
          strokeWidth="2.5"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
        
        {/* Three dots at the top - arranged in arc */}
        <motion.circle
          cx="50"
          cy="16"
          r="5"
          fill="url(#awenGradient)"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        />
        <motion.circle
          cx="30"
          cy="24"
          r="5"
          fill="url(#awenGradient)"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        />
        <motion.circle
          cx="70"
          cy="24"
          r="5"
          fill="url(#awenGradient)"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        />
        
        {/* Three flowing lines going down */}
        <motion.path
          d="M30 32 Q26 50, 32 65 Q38 78, 30 88"
          stroke="url(#awenGradient)"
          strokeWidth="3.5"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
        />
        <motion.path
          d="M50 22 Q44 45, 50 60 Q56 75, 50 88"
          stroke="url(#awenGradient)"
          strokeWidth="3.5"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        />
        <motion.path
          d="M70 32 Q74 50, 68 65 Q62 78, 70 88"
          stroke="url(#awenGradient)"
          strokeWidth="3.5"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
        />
      </g>
    </motion.svg>
  );
};

export default AwenLogo;
