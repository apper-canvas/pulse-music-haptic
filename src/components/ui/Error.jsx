import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ message = "Something went wrong", onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="bg-red-500/10 rounded-full p-4 mb-4">
        <ApperIcon 
          name="AlertCircle" 
          size={48} 
          className="text-red-400" 
        />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">Oops! Something went wrong</h3>
      <p className="text-gray-light mb-6 max-w-md">
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-primary hover:bg-green-400 text-black font-medium px-6 py-2 rounded-full 
                   transition-all duration-200 hover:shadow-glow-green hover:scale-105 
                   focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default Error;