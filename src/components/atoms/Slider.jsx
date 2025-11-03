import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Slider = forwardRef(({ 
  className, 
  value = 0,
  max = 100,
  onChange,
  ...props 
}, ref) => {
  const percentage = (value / max) * 100;

  return (
    <div className={cn("relative w-full h-1 bg-gray-medium rounded-full cursor-pointer", className)}>
      <div 
        className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all duration-150"
        style={{ width: `${percentage}%` }}
      />
      <input
        ref={ref}
        type="range"
        min="0"
        max={max}
        value={value}
        onChange={onChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        {...props}
      />
      <div 
        className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg transition-all duration-150 hover:scale-125"
        style={{ left: `calc(${percentage}% - 6px)` }}
      />
    </div>
  );
});

Slider.displayName = "Slider";

export default Slider;