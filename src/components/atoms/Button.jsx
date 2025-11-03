import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "md", 
  children, 
  ...props 
}, ref) => {
  const baseClasses = "font-medium rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-primary hover:bg-green-400 text-black hover:shadow-glow-green hover:scale-105 focus:ring-primary",
    secondary: "bg-transparent border border-gray-medium hover:border-white text-white hover:bg-white hover:text-black hover:shadow-glow-purple focus:ring-accent",
    ghost: "bg-transparent text-gray-light hover:text-white hover:bg-gray-dark focus:ring-accent",
    play: "bg-primary hover:bg-green-400 text-black rounded-full p-0 hover:scale-110 focus:ring-primary shadow-lg",
  };
  
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
    icon: "p-3",
    play: "w-12 h-12 flex items-center justify-center",
  };

  return (
    <button
      ref={ref}
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;