import React, { useEffect, useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Slider from "@/components/atoms/Slider";
import Button from "@/components/atoms/Button";
import LyricsPanel from "@/components/molecules/LyricsPanel";
import { cn } from "@/utils/cn";
import { formatTime } from "@/utils/formatTime";

const PlayerBar = ({ 
currentTrack, 
  isPlaying, 
  currentTime, 
  duration, 
  volume,
  shuffle,
  repeat,
  lyrics,
  queue = [],
  onPlayPause,
  onNext,
  onPrevious,
  onSeek,
  onVolumeChange,
  onToggleShuffle,
  onToggleRepeat,
  onGetLyrics,
  className
}) => {
const [showLyrics, setShowLyrics] = useState(false);

  // Auto-show lyrics when they become available
  useEffect(() => {
    if (lyrics && !showLyrics && currentTrack) {
      setShowLyrics(true);
    }
  }, [lyrics, currentTrack]);
  if (!currentTrack) {
    return (
      <div className={cn("bg-surface border-t border-gray-dark p-4", className)}>
        <div className="text-center text-gray-light">
          Select a track to start playing
        </div>
      </div>
    );
  }

  const handleSeek = (e) => {
    const newTime = parseInt(e.target.value);
    onSeek(newTime);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value);
    onVolumeChange(newVolume);
  };

  const getRepeatIcon = () => {
    switch (repeat) {
      case "track":
        return "Repeat1";
      case "queue":
        return "Repeat";
      default:
        return "Repeat";
    }
  };

  return (
    <div className={cn("bg-surface border-t border-gray-dark shadow-player", className)}>
      {/* Progress Bar - Full Width */}
      <div className="px-4 pt-2">
        <Slider
          value={currentTime}
          max={duration}
          onChange={handleSeek}
          className="h-1"
        />
      </div>

      {/* Player Controls */}
      <div className="flex items-center justify-between p-4 pt-2">
        {/* Now Playing */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
            <img 
              src={currentTrack.coverUrl} 
              alt={currentTrack.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-white font-medium truncate text-sm">
              {currentTrack.title}
            </div>
            <div className="text-gray-light text-xs truncate">
              {currentTrack.artist}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 flex-shrink-0"
          >
            <ApperIcon 
              name="Heart" 
              size={16} 
              className={currentTrack.liked ? "text-primary fill-current" : "text-gray-light"} 
            />
          </Button>
        </div>

        {/* Main Controls */}
        <div className="flex flex-col items-center gap-2 flex-1 max-w-md">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleShuffle}
              className={cn(
                "w-8 h-8",
                shuffle ? "text-primary" : "text-gray-light"
              )}
            >
              <ApperIcon name="Shuffle" size={16} />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={onPrevious}
              className="w-8 h-8"
            >
              <ApperIcon name="SkipBack" size={18} />
            </Button>

            <Button
              variant="play"
              size="play"
              onClick={onPlayPause}
              className="w-10 h-10"
            >
              <ApperIcon 
                name={isPlaying ? "Pause" : "Play"} 
                size={20} 
              />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={onNext}
              className="w-8 h-8"
            >
              <ApperIcon name="SkipForward" size={18} />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleRepeat}
              className={cn(
                "w-8 h-8",
                repeat !== "off" ? "text-primary" : "text-gray-light"
              )}
            >
              <ApperIcon name={getRepeatIcon()} size={16} />
            </Button>
          </div>

          {/* Time Display */}
          <div className="flex items-center gap-3 text-xs text-gray-light">
            <span>{formatTime(currentTime)}</span>
            <span>/</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume & Additional Controls */}
<div className="flex items-center gap-3 flex-1 justify-end">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "w-8 h-8 hidden md:flex",
              shuffle ? "text-primary hover:text-primary" : "text-gray-light hover:text-white"
            )}
            onClick={onToggleShuffle}
            title={shuffle ? "Shuffle on" : "Shuffle off"}
          >
            <ApperIcon name="Shuffle" size={16} />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "w-8 h-8 hidden md:flex relative",
              repeat !== 'off' ? "text-primary hover:text-primary" : "text-gray-light hover:text-white"
            )}
            onClick={onToggleRepeat}
            title={
              repeat === 'track' ? "Repeat track" : 
              repeat === 'queue' ? "Repeat queue" : 
              "Repeat off"
            }
          >
            <ApperIcon name="Repeat" size={16} />
            {repeat === 'track' && (
              <span className="absolute -bottom-1 -right-1 text-xs font-bold text-primary">1</span>
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "w-8 h-8 hidden md:flex",
              lyrics ? "text-primary hover:text-primary" : "text-gray-light hover:text-white"
            )}
onClick={() => {
              if (currentTrack) {
                if (!lyrics) {
                  onGetLyrics(currentTrack.Id);
                } else {
                  setShowLyrics(!showLyrics);
                }
              }
            }}
            title="Show lyrics"
          >
            <ApperIcon name="FileText" size={16} />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 hidden md:flex relative group"
            title={`Queue (${queue.length} tracks)`}
          >
            <ApperIcon name="List" size={16} />
            {queue.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {queue.length > 9 ? "9+" : queue.length}
              </span>
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 hidden sm:flex"
          >
            <ApperIcon name="Monitor" size={16} />
          </Button>

          <div className="hidden sm:flex items-center gap-2 min-w-[100px]">
            <ApperIcon name="Volume2" size={16} className="text-gray-light" />
            <Slider
              value={volume}
              max={100}
              onChange={handleVolumeChange}
              className="flex-1"
            />
          </div>
        </div>
      </div>

{/* Lyrics Panel */}
      <LyricsPanel
        isOpen={showLyrics}
        onClose={() => setShowLyrics(false)}
        lyrics={lyrics}
        currentTime={currentTime}
        isPlaying={isPlaying}
        trackTitle={currentTrack?.title}
        artistName={currentTrack?.artist}
        onSeekToTime={onSeek}
      />
    </div>
  );
};

export default PlayerBar;