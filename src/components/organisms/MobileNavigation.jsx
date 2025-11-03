import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const MobileNavigation = ({ className }) => {
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/", icon: "Home" },
    { name: "Search", path: "/search", icon: "Search" },
    { name: "Library", path: "/library", icon: "Library" },
  ];

  return (
    <div className={cn("lg:hidden fixed bottom-20 left-0 right-0 bg-surface border-t border-gray-dark z-40", className)}>
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = item.path === "/" 
            ? location.pathname === "/" 
            : location.pathname.startsWith(item.path);
          
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={cn(
                "flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-200",
                isActive ? "text-primary" : "text-gray-light"
              )}
            >
              <ApperIcon 
                name={item.icon} 
                size={20} 
                className={isActive ? "text-primary" : "text-gray-light"} 
              />
              <span className="text-xs font-medium">{item.name}</span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};

export default MobileNavigation;