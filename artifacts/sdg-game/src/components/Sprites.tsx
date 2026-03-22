import React from 'react';
import { cn } from '@/lib/utils';

interface SpriteProps {
  className?: string;
  isWalking?: boolean;
}

// Player Wardens
export const Warden1 = ({ className, isWalking }: SpriteProps) => (
  <svg viewBox="0 0 100 100" className={cn("w-full h-full drop-shadow-md", isWalking && "animate-walk", className)}>
    {/* Body */}
    <circle cx="50" cy="70" r="20" fill="#fdf6e3" stroke="#3e2723" strokeWidth="4" />
    {/* Head */}
    <circle cx="50" cy="40" r="28" fill="#fdf6e3" stroke="#3e2723" strokeWidth="4" />
    {/* Eyes */}
    <circle cx="40" cy="35" r="5" fill="#3e2723" />
    <circle cx="60" cy="35" r="5" fill="#3e2723" />
    {/* Cheeks */}
    <ellipse cx="32" cy="42" rx="4" ry="2" fill="#ffb74d" opacity="0.6" />
    <ellipse cx="68" cy="42" rx="4" ry="2" fill="#ffb74d" opacity="0.6" />
    {/* Mouth */}
    <path d="M 45 45 Q 50 50 55 45" fill="none" stroke="#3e2723" strokeWidth="3" strokeLinecap="round" />
    {/* Hair/Leaf */}
    <path d="M 50 12 Q 60 0 70 15 Q 60 20 50 12" fill="#81c784" stroke="#3e2723" strokeWidth="3" />
  </svg>
);

export const Warden2 = ({ className, isWalking }: SpriteProps) => (
  <svg viewBox="0 0 100 100" className={cn("w-full h-full drop-shadow-md", isWalking && "animate-walk", className)}>
    {/* Body */}
    <path d="M 30 90 L 50 60 L 70 90 Z" fill="#fdf6e3" stroke="#3e2723" strokeWidth="4" strokeLinejoin="round" />
    {/* Head */}
    <rect x="25" y="15" width="50" height="50" rx="20" fill="#fdf6e3" stroke="#3e2723" strokeWidth="4" />
    {/* Eyes */}
    <line x1="35" y1="35" x2="45" y2="35" stroke="#3e2723" strokeWidth="4" strokeLinecap="round" />
    <line x1="55" y1="35" x2="65" y2="35" stroke="#3e2723" strokeWidth="4" strokeLinecap="round" />
    {/* Mouth */}
    <circle cx="50" cy="48" r="4" fill="#ffb74d" />
    {/* Accessory */}
    <circle cx="50" cy="15" r="8" fill="#4fc3f7" stroke="#3e2723" strokeWidth="3" />
  </svg>
);

export const Warden3 = ({ className, isWalking }: SpriteProps) => (
  <svg viewBox="0 0 100 100" className={cn("w-full h-full drop-shadow-md", isWalking && "animate-walk", className)}>
    {/* Body */}
    <rect x="35" y="55" width="30" height="35" rx="10" fill="#fdf6e3" stroke="#3e2723" strokeWidth="4" />
    {/* Head */}
    <polygon points="20,40 50,10 80,40 65,65 35,65" fill="#fdf6e3" stroke="#3e2723" strokeWidth="4" strokeLinejoin="round" />
    {/* Eyes */}
    <path d="M 35 35 Q 40 30 45 35" fill="none" stroke="#3e2723" strokeWidth="3" strokeLinecap="round" />
    <path d="M 55 35 Q 60 30 65 35" fill="none" stroke="#3e2723" strokeWidth="3" strokeLinecap="round" />
    {/* Mouth */}
    <path d="M 45 50 Q 50 55 55 50" fill="none" stroke="#3e2723" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

// Elemental Lords
export const SplashySprite = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={cn("w-full h-full animate-float drop-shadow-lg", className)}>
    <path d="M 50 10 Q 20 50 20 70 A 30 30 0 0 0 80 70 Q 80 50 50 10 Z" fill="#4fc3f7" stroke="#3e2723" strokeWidth="4" />
    <circle cx="35" cy="60" r="6" fill="#3e2723" />
    <circle cx="65" cy="60" r="6" fill="#3e2723" />
    <path d="M 45 75 Q 50 85 55 75" fill="none" stroke="#3e2723" strokeWidth="4" strokeLinecap="round" />
    <path d="M 25 65 Q 15 70 25 80" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.6"/>
  </svg>
);

export const PebblepuffSprite = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={cn("w-full h-full animate-float drop-shadow-lg", className)} style={{animationDuration: '4s'}}>
    <path d="M 20 40 Q 10 70 30 90 L 70 90 Q 90 70 80 40 Q 70 10 50 20 Q 30 10 20 40 Z" fill="#a1887f" stroke="#3e2723" strokeWidth="4" strokeLinejoin="round" />
    <circle cx="40" cy="55" r="5" fill="#3e2723" />
    <circle cx="60" cy="55" r="5" fill="#3e2723" />
    <circle cx="30" cy="65" r="6" fill="#ffb74d" opacity="0.8" />
    <circle cx="70" cy="65" r="6" fill="#ffb74d" opacity="0.8" />
    <line x1="45" y1="65" x2="55" y2="65" stroke="#3e2723" strokeWidth="4" strokeLinecap="round" />
    {/* Moss */}
    <path d="M 40 25 Q 50 15 60 25 Q 70 15 80 30" fill="none" stroke="#81c784" strokeWidth="6" strokeLinecap="round" />
  </svg>
);

export const LeafletSprite = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={cn("w-full h-full animate-float drop-shadow-lg", className)} style={{animationDuration: '2.5s'}}>
    <path d="M 50 10 C 90 40 80 90 50 90 C 20 90 10 40 50 10 Z" fill="#81c784" stroke="#3e2723" strokeWidth="4" />
    <ellipse cx="38" cy="55" rx="4" ry="7" fill="#3e2723" />
    <ellipse cx="62" cy="55" rx="4" ry="7" fill="#3e2723" />
    <path d="M 45 70 Q 50 75 55 70" fill="none" stroke="#3e2723" strokeWidth="3" strokeLinecap="round" />
    <circle cx="50" cy="30" r="4" fill="#fdf6e3" />
    <circle cx="35" cy="40" r="3" fill="#fdf6e3" />
    <circle cx="65" cy="40" r="3" fill="#fdf6e3" />
  </svg>
);

export const SparkleflameSprite = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={cn("w-full h-full animate-float drop-shadow-lg", className)} style={{animationDuration: '2s'}}>
    <path d="M 50 10 Q 30 50 20 70 A 30 30 0 0 0 80 70 Q 70 40 50 10 Z" fill="#ffb74d" stroke="#3e2723" strokeWidth="4" />
    <path d="M 50 30 Q 40 60 35 75 A 15 15 0 0 0 65 75 Q 60 50 50 30 Z" fill="#fff59d" />
    <path d="M 35 65 L 45 65 L 40 55 Z" fill="#3e2723" />
    <path d="M 65 65 L 55 65 L 60 55 Z" fill="#3e2723" />
    <path d="M 45 75 Q 50 80 55 75" fill="none" stroke="#3e2723" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

export const BalooSprite = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={cn("w-full h-full animate-float drop-shadow-lg", className)} style={{animationDuration: '3.5s'}}>
    {/* Ears */}
    <circle cx="25" cy="30" r="15" fill="#8d6e63" stroke="#3e2723" strokeWidth="4" />
    <circle cx="75" cy="30" r="15" fill="#8d6e63" stroke="#3e2723" strokeWidth="4" />
    {/* Head */}
    <circle cx="50" cy="55" r="35" fill="#d7ccc8" stroke="#3e2723" strokeWidth="4" />
    {/* Snout */}
    <ellipse cx="50" cy="65" rx="15" ry="10" fill="#fdf6e3" stroke="#3e2723" strokeWidth="3" />
    <circle cx="50" cy="60" r="4" fill="#3e2723" />
    {/* Eyes */}
    <circle cx="35" cy="45" r="5" fill="#3e2723" />
    <circle cx="65" cy="45" r="5" fill="#3e2723" />
  </svg>
);

export const ThinkletSprite = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={cn("w-full h-full animate-float drop-shadow-lg", className)} style={{animationDuration: '2.8s'}}>
    <ellipse cx="50" cy="50" rx="40" ry="35" fill="#b2dfdb" stroke="#3e2723" strokeWidth="4" />
    {/* Glasses */}
    <circle cx="35" cy="45" r="12" fill="none" stroke="#3e2723" strokeWidth="4" />
    <circle cx="65" cy="45" r="12" fill="none" stroke="#3e2723" strokeWidth="4" />
    <line x1="47" y1="45" x2="53" y2="45" stroke="#3e2723" strokeWidth="4" />
    {/* Eyes */}
    <circle cx="35" cy="45" r="4" fill="#3e2723" />
    <circle cx="65" cy="45" r="4" fill="#3e2723" />
    {/* Beak */}
    <polygon points="45,55 55,55 50,65" fill="#ffb74d" stroke="#3e2723" strokeWidth="2" strokeLinejoin="round" />
    {/* Graduation Cap Tassel */}
    <path d="M 50 15 L 50 5 L 80 15 Z" fill="#3e2723" />
  </svg>
);
