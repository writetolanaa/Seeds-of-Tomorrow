import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'danger' }>(
  ({ className, variant = 'primary', ...props }, ref) => {
    const variants = {
      primary: "bg-primary text-primary-foreground",
      secondary: "bg-secondary text-secondary-foreground",
      danger: "bg-destructive text-destructive-foreground",
    };
    return (
      <button
        ref={ref}
        className={cn(
          "px-6 py-3 font-bold text-lg transition-all duration-200",
          "sketch-border",
          variants[variant],
          "disabled:opacity-50 disabled:cursor-not-allowed",
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export const DialogBox = ({
  speaker,
  text,
  onNext,
  color = '#4CAF50',
}: {
  speaker: string;
  text: string;
  onNext?: () => void;
  color?: string;
}) => (
  <motion.div
    initial={{ y: 60, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    exit={{ y: 60, opacity: 0 }}
    className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-50 cursor-pointer"
    onClick={onNext}
  >
    <div className="bg-white/95 sketch-border p-5 relative rounded-xl shadow-xl">
      <div
        className="absolute -top-4 left-5 px-4 py-1 rounded-full text-white font-bold text-sm shadow-md"
        style={{ background: color }}
      >
        {speaker}
      </div>
      <p className="text-base text-gray-700 leading-relaxed mt-3 min-h-[2.5rem] font-sans">
        {text}
      </p>
      {onNext && (
        <div className="absolute bottom-3 right-4 animate-bounce text-gray-400 text-xs font-semibold flex items-center gap-1">
          tap to continue <span>▼</span>
        </div>
      )}
    </div>
  </motion.div>
);
