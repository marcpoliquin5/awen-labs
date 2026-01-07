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
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
        
        {/* Three dots at the top */}
        <motion.circle
          cx="50"
          cy="14"
          r="4"
          fill="url(#awenGradient)"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        />
        <motion.circle
          cx="32"
          cy="22"
          r="4"
          fill="url(#awenGradient)"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        />
        <motion.circle
          cx="68"
          cy="22"
          r="4"
          fill="url(#awenGradient)"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.7 }}
        />
        
        {/* Left flowing line */}
        <motion.path
          d="M32 26 Q28 40, 32 55 Q36 70, 30 82"
          stroke="url(#awenGradient)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
        />
        
        {/* Center flowing line */}
        <motion.path
          d="M50 18 Q46 35, 50 50 Q54 65, 50 82"
          stroke="url(#awenGradient)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        />
        
        {/* Right flowing line */}
        <motion.path
          d="M68 26 Q72 40, 68 55 Q64 70, 70 82"
          stroke="url(#awenGradient)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
        />
      </g>
    </motion.svg>
  );
};

export default AwenLogo;
