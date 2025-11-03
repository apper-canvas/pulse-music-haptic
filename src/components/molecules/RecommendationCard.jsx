import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { formatTime } from "@/utils/formatTime";
import { cn } from "@/utils/cn";

const RecommendationCard = ({ 
  track, 
  onPlay, 
  onLike, 
  onAddToQueue,
  className 
}) => {
  return (
    <div className={cn(
      "group bg-surface p-4 rounded-lg hover:bg-gray-dark cursor-pointer transition-all duration-300 hover:shadow-card",
      className
    )}>
      <div className="relative mb-4">
        <img 
          src={track.coverUrl} 
          alt={track.title}
          className="w-full aspect-square rounded-lg object-cover"
        />
        <Button
          variant="play"
          size="play"
          className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300"
          onClick={(e) => {
            e.stopPropagation();
            onPlay(track);
          }}
        >
          <ApperIcon name="Play" size={20} />
        </Button>
      </div>
      
      <div className="space-y-2">
        <h3 className="font-semibold text-white truncate group-hover:text-primary transition-colors">
          {track.title}
        </h3>
        <p className="text-sm text-gray-light truncate">
          {track.artist}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-medium">
            {formatTime(track.duration)}
          </span>
          
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8"
              onClick={(e) => {
                e.stopPropagation();
                onLike(track.Id);
              }}
            >
              <ApperIcon 
                name="Heart" 
                size={14}
                className={cn(
                  "transition-colors",
                  track.liked ? "text-primary fill-current" : "text-gray-light hover:text-white"
                )}
              />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8"
              onClick={(e) => {
                e.stopPropagation();
                onAddToQueue(track);
              }}
            >
              <ApperIcon name="Plus" size={14} className="text-gray-light hover:text-white" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationCard;