import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/organisms/Sidebar";
import TopBar from "@/components/organisms/TopBar";
import MobileNavigation from "@/components/organisms/MobileNavigation";
import PlayerBar from "@/components/organisms/PlayerBar";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Layout = ({ 
  playerState, 
  onPlayPause, 
  onNext, 
  onPrevious, 
  onSeek, 
  onVolumeChange,
  onToggleShuffle,
  onToggleRepeat,
  onSearch,
  showSearch = false 
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-background text-white overflow-hidden">
      {/* Desktop Layout */}
      <div className="flex flex-1 min-h-0">
        {/* Desktop Sidebar - Fixed Position */}
        <div className="hidden lg:block">
          <div className="fixed left-0 top-0 bottom-20 w-60">
            <Sidebar />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 lg:ml-60">
          {/* Top Bar */}
          <TopBar onSearch={onSearch} showSearch={showSearch} />

          {/* Page Content */}
          <div className="flex-1 overflow-y-auto">
            <Outlet />
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          
          {/* Sidebar */}
          <div className="relative w-80 max-w-[80vw] bg-black transform transition-transform duration-300">
            <div className="flex items-center justify-between p-4 border-b border-gray-dark">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <ApperIcon name="Music" size={20} className="text-white" />
                </div>
                <span className="text-xl font-bold">Pulse Music</span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 hover:bg-gray-dark rounded-lg transition-colors"
              >
                <ApperIcon name="X" size={20} />
              </button>
            </div>
            <div className="h-full overflow-y-auto pb-20">
              <Sidebar />
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 p-2 bg-black/40 backdrop-blur-sm rounded-lg hover:bg-black/60 transition-colors"
      >
        <ApperIcon name="Menu" size={20} />
      </button>

      {/* Mobile Navigation */}
      <MobileNavigation />

      {/* Player Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30">
        <PlayerBar
          currentTrack={playerState.currentTrack}
          isPlaying={playerState.isPlaying}
          currentTime={playerState.currentTime}
          duration={playerState.duration}
          volume={playerState.volume}
          shuffle={playerState.shuffle}
          repeat={playerState.repeat}
          onPlayPause={onPlayPause}
          onNext={onNext}
          onPrevious={onPrevious}
          onSeek={onSeek}
          onVolumeChange={onVolumeChange}
          onToggleShuffle={onToggleShuffle}
          onToggleRepeat={onToggleRepeat}
        />
      </div>
    </div>
  );
};

export default Layout;