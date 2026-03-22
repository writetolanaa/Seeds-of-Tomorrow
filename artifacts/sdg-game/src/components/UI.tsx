import React from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

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
          "px-6 py-3 font-display text-lg font-bold transition-all duration-200",
          "sketch-border sketch-shadow sketch-shadow-hover sketch-shadow-active",
          variants[variant],
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:box-shadow-none",
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export const DialogBox = ({ 
  speaker, 
  text, 
  onNext 
}: { 
  speaker: string; 
  text: string; 
  onNext?: () => void 
}) => {
  return (
    <motion.div 
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 50, opacity: 0 }}
      className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-50 cursor-pointer"
      onClick={onNext}
    >
      <div className="bg-card sketch-border sketch-shadow p-6 relative">
        <div className="absolute -top-4 left-6 bg-secondary sketch-border-sm px-4 py-1 font-display font-bold">
          {speaker}
        </div>
        <p className="text-xl font-body text-card-foreground leading-relaxed mt-2 min-h-[3rem]">
          {text}
        </p>
        {onNext && (
          <div className="absolute bottom-4 right-4 animate-bounce">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </div>
        )}
      </div>
    </motion.div>
  );
};
