import React, { useState, useCallback } from "react";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";
import { cn } from "@/utils/cn";

const SearchBar = ({ onSearch, placeholder = "Search for songs, artists, or albums", className }) => {
  const [query, setQuery] = useState("");

  const handleChange = useCallback((e) => {
    const value = e.target.value;
    setQuery(value);
    if (onSearch) {
      onSearch(value);
    }
  }, [onSearch]);

  const handleClear = useCallback(() => {
    setQuery("");
    if (onSearch) {
      onSearch("");
    }
  }, [onSearch]);

  return (
    <div className={cn("relative max-w-md", className)}>
      <div className="relative">
        <ApperIcon 
          name="Search" 
          size={20} 
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-light" 
        />
        <Input
          value={query}
          onChange={handleChange}
          placeholder={placeholder}
          className="pl-12 pr-10"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-light hover:text-white transition-colors p-1"
          >
            <ApperIcon name="X" size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;