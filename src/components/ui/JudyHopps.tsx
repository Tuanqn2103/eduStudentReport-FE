"use client";

import React from "react";
import { motion } from "framer-motion";

interface JudyHoppsProps {
  size?: number;
  className?: string;
  animated?: boolean;
}

export default function JudyHopps({ size = 120, className = "", animated = true }: JudyHoppsProps) {
  const animationVariants = {
    bounce: {
      y: [0, -10, 0],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        repeatDelay: 2,
      },
    },
    hop: {
      y: [0, -20, 0],
      rotate: [0, -5, 5, 0],
      transition: {
        duration: 0.4,
      },
    },
  };

  const Component = animated ? motion.div : "div";

  return (
    <Component
      className={className}
      variants={animated ? animationVariants : undefined}
      animate={animated ? "bounce" : undefined}
      whileHover={animated ? "hop" : undefined}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-lg"
      >
        {/* Judy Hopps Cute Bunny Face - Chibi Style */}
        {/* Head */}
        <ellipse cx="100" cy="90" rx="70" ry="75" fill="#FFE5F1" stroke="#F8BBD0" strokeWidth="2" />
        
        {/* Left Ear */}
        <ellipse cx="60" cy="40" rx="20" ry="45" fill="#FFE5F1" stroke="#F8BBD0" strokeWidth="2" />
        <ellipse cx="60" cy="50" rx="12" ry="30" fill="#F8BBD0" />
        
        {/* Right Ear */}
        <ellipse cx="140" cy="40" rx="20" ry="45" fill="#FFE5F1" stroke="#F8BBD0" strokeWidth="2" />
        <ellipse cx="140" cy="50" rx="12" ry="30" fill="#F8BBD0" />
        
        {/* Face */}
        <circle cx="100" cy="90" r="60" fill="#FFF5F8" />
        
        {/* Left Eye */}
        <circle cx="80" cy="80" r="8" fill="#1a1a1a" />
        <circle cx="82" cy="78" r="3" fill="#ffffff" />
        
        {/* Right Eye */}
        <circle cx="120" cy="80" r="8" fill="#1a1a1a" />
        <circle cx="122" cy="78" r="3" fill="#ffffff" />
        
        {/* Nose */}
        <ellipse cx="100" cy="95" rx="4" ry="3" fill="#F48FB1" />
        
        {/* Mouth */}
        <path
          d="M 100 100 Q 95 105 90 102 Q 95 107 100 105 Q 105 107 110 102 Q 105 105 100 100"
          stroke="#F48FB1"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        
        {/* Cheeks */}
        <circle cx="65" cy="95" r="12" fill="#F8BBD0" opacity="0.6" />
        <circle cx="135" cy="95" r="12" fill="#F8BBD0" opacity="0.6" />
        
        {/* Badge/Star (Judy's police badge style) */}
        <path
          d="M 100 120 L 105 130 L 115 132 L 108 140 L 110 150 L 100 145 L 90 150 L 92 140 L 85 132 L 95 130 Z"
          fill="#FFD700"
          stroke="#FFA500"
          strokeWidth="1"
        />
      </svg>
    </Component>
  );
}

