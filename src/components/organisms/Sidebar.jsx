import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Sidebar = ({ className }) => {
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/", icon: "Home" },
    { name: "Search", path: "/search", icon: "Search" },
    { name: "Your Library", path: "/library", icon: "Library" },
  ];

  const libraryItems = [
    { name: "Liked Songs", path: "/library/liked", icon: "Heart" },
    { name: "Recently Played", path: "/library/recent", icon: "Clock" },
  ];

  return (
    <div className={cn("w-60 bg-black text-white flex flex-col h-full", className)}>
      {/* Logo */}
      <div className="p-6 border-b border-gray-dark">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
            <ApperIcon name="Music" size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold">Pulse Music</span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-6">
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive = item.path === "/" 
              ? location.pathname === "/" 
              : location.pathname.startsWith(item.path);
            
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={cn(
                  "flex items-center gap-4 p-3 rounded-lg text-gray-light hover:text-white transition-all duration-200 group",
                  isActive && "text-white bg-gray-dark/50 border-l-4 border-primary"
                )}
              >
                <ApperIcon 
                  name={item.icon} 
                  size={20} 
                  className={cn(
                    "transition-colors",
                    isActive ? "text-primary" : "text-gray-light group-hover:text-white"
                  )} 
                />
                <span className="font-medium">{item.name}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Library Section */}
        <div className="mt-8">
          <div className="text-xs font-semibold text-gray-light uppercase tracking-wider mb-4 px-3">
            Your Library
          </div>
          <div className="space-y-1">
            {libraryItems.map((item) => {
              const isActive = location.pathname === item.path;
              
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-4 p-3 rounded-lg text-gray-light hover:text-white transition-all duration-200 group",
                    isActive && "text-white bg-gray-dark/50 border-l-4 border-primary"
                  )}
                >
                  <ApperIcon 
                    name={item.icon} 
                    size={18} 
                    className={cn(
                      "transition-colors",
                      isActive ? "text-primary" : "text-gray-light group-hover:text-white"
                    )} 
                  />
                  <span className="text-sm">{item.name}</span>
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* Quick Playlists */}
        <div className="mt-8">
          <div className="text-xs font-semibold text-gray-light uppercase tracking-wider mb-4 px-3">
            Made for You
          </div>
          <div className="space-y-2">
            <NavLink 
              to="/playlist/1" 
              className="block p-3 rounded-lg text-gray-light hover:text-white hover:bg-gray-dark/30 transition-all duration-200"
            >
              <div className="text-sm font-medium">Today's Top Hits</div>
              <div className="text-xs text-gray-medium">50 songs</div>
            </NavLink>
            <NavLink 
              to="/playlist/2" 
              className="block p-3 rounded-lg text-gray-light hover:text-white hover:bg-gray-dark/30 transition-all duration-200"
            >
              <div className="text-sm font-medium">Chill Vibes</div>
              <div className="text-xs text-gray-medium">30 songs</div>
            </NavLink>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;