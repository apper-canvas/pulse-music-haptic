import React, { useEffect, useState, useRef } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const LyricsPanel = ({ 
  isOpen, 
  onClose, 
  lyrics, 
  currentTime, 
  isPlaying,
  trackTitle,
  artistName 
}) => {
  const [activeLine, setActiveLine] = useState(0);
  const containerRef = useRef(null);
  const activeLineRef = useRef(null);

  useEffect(() => {
    if (!lyrics?.lines || !isPlaying) return;

    // Find the current active line based on time
    let currentLineIndex = 0;
    for (let i = lyrics.lines.length - 1; i >= 0; i--) {
      if (currentTime >= lyrics.lines[i].time) {
        currentLineIndex = i;
        break;
      }
    }

    setActiveLine(currentLineIndex);
  }, [currentTime, lyrics, isPlaying]);

  useEffect(() => {
    // Auto-scroll to active line
    if (activeLineRef.current && containerRef.current) {
      const container = containerRef.current;
      const activeLine = activeLineRef.current;
      
      const containerHeight = container.clientHeight;
      const lineTop = activeLine.offsetTop;
      const lineHeight = activeLine.clientHeight;
      
      const scrollTop = lineTop - containerHeight / 2 + lineHeight / 2;
      
      container.scrollTo({
        top: Math.max(0, scrollTop),
        behavior: 'smooth'
      });
    }
  }, [activeLine]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-surface rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-medium">
          <div>
            <h2 className="text-2xl font-bold text-white">Lyrics</h2>
            {trackTitle && artistName && (
              <p className="text-gray-light mt-1">
                {trackTitle} • {artistName}
              </p>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-light hover:text-white"
          >
            <ApperIcon name="X" size={24} />
          </Button>
        </div>

        {/* Lyrics Content */}
        <div
          ref={containerRef}
          className="flex-1 overflow-y-auto p-6 space-y-4"
        >
          {lyrics?.lines ? (
            <div className="space-y-3">
              {lyrics.lines.map((line, index) => (
                <div
                  key={index}
                  ref={index === activeLine ? activeLineRef : null}
                  className={cn(
                    "text-lg leading-relaxed transition-all duration-300 cursor-pointer hover:text-white",
                    index === activeLine && isPlaying
                      ? "text-primary font-semibold text-xl transform scale-105"
                      : index < activeLine
                      ? "text-gray-light"
                      : "text-gray-medium"
                  )}
                  onClick={() => {
                    // Could implement seek to line functionality
                    console.log(`Seek to time: ${line.time}s`);
                  }}
                >
                  {line.text}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64">
              <ApperIcon name="Music" size={48} className="text-gray-medium mb-4" />
              <p className="text-gray-light text-lg">No lyrics available</p>
              <p className="text-gray-medium text-sm mt-2">
                Lyrics will appear here when available
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-medium">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-light text-sm">
              <ApperIcon name="Music" size={16} />
              <span>Synchronized lyrics</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-light hover:text-white"
                onClick={() => {
                  // Could implement lyrics sharing
                  navigator.clipboard?.writeText(
                    lyrics?.lines?.map(line => line.text).join('\n') || ''
                  );
                }}
              >
                <ApperIcon name="Share" size={16} className="mr-2" />
                Share
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-light hover:text-white"
                onClick={onClose}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LyricsPanel;