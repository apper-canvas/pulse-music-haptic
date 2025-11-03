import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { formatDuration } from "@/utils/formatTime";
import { cn } from "@/utils/cn";

const PlaylistCard = ({ playlist, onPlay, onClick, className }) => {
  const handlePlay = (e) => {
    e.stopPropagation();
    if (onPlay) {
      onPlay(playlist);
    }
  };

  const handleClick = () => {
    if (onClick) {
      onClick(playlist);
    }
  };

  return (
    <div 
      className={cn(
        "group bg-surface p-4 rounded-lg hover:bg-gray-dark cursor-pointer transition-all duration-300 hover:shadow-card hover:shadow-glow-purple/20",
        className
      )}
      onClick={handleClick}
    >
      {/* Cover Image */}
      <div className="relative mb-4 aspect-square rounded-lg overflow-hidden">
        <img 
          src={playlist.coverUrl} 
          alt={playlist.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Button
            variant="play"
            size="play"
            onClick={handlePlay}
            className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300"
          >
            <ApperIcon name="Play" size={20} />
          </Button>
        </div>
      </div>

      {/* Playlist Info */}
      <div className="space-y-1">
        <h3 className="font-semibold text-white text-lg truncate group-hover:text-primary transition-colors">
          {playlist.title}
        </h3>
        <p className="text-gray-light text-sm line-clamp-2 leading-relaxed">
          {playlist.description}
        </p>
        <div className="flex items-center gap-2 text-xs text-gray-light pt-2">
          <span>{playlist.trackCount} tracks</span>
          <span>•</span>
          <span>{formatDuration(playlist.duration)}</span>
        </div>
      </div>
    </div>
  );
};

export default PlaylistCard;