import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";

const TopBar = ({ onSearch, showSearch = false }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const canGoBack = window.history.length > 1;
  const canGoForward = false; // We don't track forward history in this implementation

  const handleBack = () => {
    navigate(-1);
  };

  const handleForward = () => {
    navigate(1);
  };

  return (
    <div className="flex items-center justify-between p-4 bg-background/95 backdrop-blur-sm border-b border-gray-dark sticky top-0 z-10">
      {/* Navigation Controls */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            disabled={!canGoBack}
            className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 disabled:opacity-30"
          >
            <ApperIcon name="ChevronLeft" size={18} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleForward}
            disabled={!canGoForward}
            className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 disabled:opacity-30"
          >
            <ApperIcon name="ChevronRight" size={18} />
          </Button>
        </div>

        {/* Search Bar - shown on search page */}
        {showSearch && (
          <SearchBar 
            onSearch={onSearch}
            className="flex-1 max-w-lg"
            placeholder="What do you want to listen to?"
          />
        )}
      </div>

      {/* User Controls */}
      <div className="flex items-center gap-4">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate("/premium")}
          className="hidden md:flex"
        >
          Upgrade to Premium
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8 rounded-full"
        >
          <ApperIcon name="Bell" size={18} />
        </Button>

        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate("/login")}
        >
          Log in
        </Button>
      </div>
    </div>
  );
};

export default TopBar;