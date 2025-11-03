import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { formatTime } from "@/utils/formatTime";
import { cn } from "@/utils/cn";

const TrackRow = ({ 
  track, 
  index, 
  isPlaying = false, 
  onPlay, 
  onLike, 
  onAddToQueue,
  showIndex = true,
  className 
}) => {
  const handlePlay = () => {
    if (onPlay) {
      onPlay(track);
    }
  };

  const handleLike = (e) => {
    e.stopPropagation();
    if (onLike) {
      onLike(track.Id);
    }
  };

  const handleAddToQueue = (e) => {
    e.stopPropagation();
    if (onAddToQueue) {
      onAddToQueue(track);
    }
  };

  return (
    <div 
      className={cn(
        "group flex items-center gap-4 px-4 py-2 rounded-lg hover:bg-gray-dark/50 cursor-pointer transition-all duration-200",
        isPlaying && "bg-gray-dark/30",
        className
      )}
      onClick={handlePlay}
    >
      {/* Play Button / Index */}
      <div className="w-4 text-center">
        {isPlaying ? (
          <ApperIcon name="Volume2" size={16} className="text-primary" />
        ) : (
          <>
            <span className="text-gray-light text-sm group-hover:hidden">
              {showIndex ? index + 1 : ""}
            </span>
            <Button
              variant="play"
              size="icon"
              className="hidden group-hover:flex w-8 h-8 opacity-80 hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                handlePlay();
              }}
            >
              <ApperIcon name="Play" size={14} />
            </Button>
          </>
        )}
      </div>

      {/* Track Cover */}
      <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0">
        <img 
          src={track.coverUrl} 
          alt={track.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Track Info */}
      <div className="flex-1 min-w-0">
        <div className={cn(
          "font-medium text-white truncate",
          isPlaying && "text-primary"
        )}>
          {track.title}
        </div>
        <div className="text-sm text-gray-light truncate">
          {track.artist}
        </div>
      </div>

      {/* Album */}
      <div className="hidden md:block flex-1 min-w-0">
        <div className="text-sm text-gray-light truncate hover:text-white cursor-pointer">
          {track.album}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="opacity-0 group-hover:opacity-100 w-8 h-8"
          onClick={handleLike}
        >
          <ApperIcon 
            name={track.liked ? "Heart" : "Heart"} 
            size={16}
            className={track.liked ? "text-primary fill-current" : "text-gray-light"} 
          />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="opacity-0 group-hover:opacity-100 w-8 h-8"
          onClick={handleAddToQueue}
        >
          <ApperIcon name="Plus" size={16} className="text-gray-light" />
        </Button>

        <div className="text-sm text-gray-light min-w-[3rem] text-right">
          {formatTime(track.duration)}
        </div>
      </div>
    </div>
  );
};

export default TrackRow;