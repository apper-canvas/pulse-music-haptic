import React from "react";

const Loading = ({ type = "grid", count = 6 }) => {
  if (type === "grid") {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gray-dark rounded-lg aspect-square mb-3"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-dark rounded w-3/4"></div>
              <div className="h-3 bg-gray-dark rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "list") {
    return (
      <div className="space-y-2">
        {Array.from({ length: count || 8 }).map((_, index) => (
          <div key={index} className="flex items-center space-x-4 p-2 animate-pulse">
            <div className="w-12 h-12 bg-gray-dark rounded"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-dark rounded w-1/3"></div>
              <div className="h-3 bg-gray-dark rounded w-1/4"></div>
            </div>
            <div className="h-3 bg-gray-dark rounded w-12"></div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "hero") {
    return (
      <div className="animate-pulse">
        <div className="h-64 bg-gradient-to-br from-gray-dark to-surface rounded-lg mb-8"></div>
        <div className="space-y-4">
          <div className="h-8 bg-gray-dark rounded w-1/2"></div>
          <div className="h-4 bg-gray-dark rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
    </div>
  );
};

export default Loading;