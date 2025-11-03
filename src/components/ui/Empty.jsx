import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No content found", 
  description = "There's nothing here yet.", 
  action,
  icon = "Music" 
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="bg-gray-dark/50 rounded-full p-6 mb-6">
        <ApperIcon 
          name={icon} 
          size={64} 
          className="text-gray-medium" 
        />
      </div>
      <h3 className="text-2xl font-semibold text-white mb-3">{title}</h3>
      <p className="text-gray-light mb-8 max-w-md text-lg">
        {description}
      </p>
      {action && (
        <button
          onClick={action.onClick}
          className="bg-primary hover:bg-green-400 text-black font-semibold px-8 py-3 rounded-full 
                   transition-all duration-200 hover:shadow-glow-green hover:scale-105 
                   focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

export default Empty;