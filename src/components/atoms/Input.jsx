import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ 
  className, 
  type = "text", 
  placeholder,
  ...props 
}, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "w-full px-4 py-3 bg-gray-dark border border-gray-medium rounded-lg text-white placeholder-gray-light",
        "focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none",
        "transition-all duration-200",
        className
      )}
      placeholder={placeholder}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;