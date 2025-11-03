import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { formatTime } from "@/utils/formatTime";
import { cn } from "@/utils/cn";

const QueueDisplay = ({ 
  queue, 
  currentTrack, 
  onPlayTrack, 
  onRemoveFromQueue,
  onReorderQueue,
  className 
}) => {
  if (queue.length === 0) {
    return (
      <div className={cn("p-6 text-center", className)}>
        <ApperIcon name="List" size={48} className="text-gray-medium mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">Queue is empty</h3>
        <p className="text-gray-light">
          Add songs to your queue to see them here
        </p>
      </div>
    );
  }

  const currentIndex = queue.findIndex(track => track.Id === currentTrack?.Id);
  const upcomingTracks = queue.slice(currentIndex + 1);

  return (
    <div className={cn("p-6", className)}>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-2">Queue</h2>
        <p className="text-gray-light">
          {upcomingTracks.length} tracks coming up
        </p>
      </div>

      {/* Now Playing */}
      {currentTrack && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-light uppercase tracking-wider mb-3">
            Now Playing
          </h3>
          <div className="flex items-center gap-4 p-3 bg-gray-dark/50 rounded-lg border-l-4 border-primary">
            <img 
              src={currentTrack.coverUrl} 
              alt={currentTrack.title}
              className="w-12 h-12 rounded object-cover"
            />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-white truncate">
                {currentTrack.title}
              </div>
              <div className="text-sm text-gray-light truncate">
                {currentTrack.artist}
              </div>
            </div>
            <div className="text-sm text-gray-light">
              {formatTime(currentTrack.duration)}
            </div>
          </div>
        </div>
      )}

      {/* Upcoming Tracks */}
      {upcomingTracks.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-light uppercase tracking-wider mb-3">
            Next Up
          </h3>
          <div className="space-y-1">
            {upcomingTracks.map((track, index) => (
              <div
                key={`${track.Id}-${currentIndex + index + 1}`}
                className="group flex items-center gap-4 p-3 rounded-lg hover:bg-gray-dark/50 cursor-pointer transition-all duration-200"
                onClick={() => onPlayTrack(track, queue)}
              >
                <div className="w-8 text-center">
                  <span className="text-sm text-gray-light group-hover:hidden">
                    {index + 1}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hidden group-hover:flex w-8 h-8"
                  >
                    <ApperIcon name="Play" size={16} />
                  </Button>
                </div>
                
                <img 
                  src={track.coverUrl} 
                  alt={track.title}
                  className="w-10 h-10 rounded object-cover"
                />
                
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-white truncate group-hover:text-primary transition-colors">
                    {track.title}
                  </div>
                  <div className="text-sm text-gray-light truncate">
                    {track.artist}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-light">
                    {formatTime(track.duration)}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 w-8 h-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveFromQueue(currentIndex + index + 1);
                    }}
                  >
                    <ApperIcon name="X" size={16} className="text-gray-light hover:text-white" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QueueDisplay;