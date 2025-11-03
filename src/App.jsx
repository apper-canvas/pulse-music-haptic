import React, { useState } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { tracksService } from "@/services/api/musicService";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Home from "@/components/pages/Home";
import Library from "@/components/pages/Library";
import Search from "@/components/pages/Search";
import PlaylistDetail from "@/components/pages/PlaylistDetail";
import Layout from "@/components/organisms/Layout";
import usePlayer from "@/hooks/usePlayer";

const AppContent = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Mock authentication state
  const [showSignupModal, setShowSignupModal] = useState(false);
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    queue,
    shuffle,
    repeat,
    playTrack,
    togglePlayPause,
    playNext,
    playPrevious,
    seekTo,
    setVolume,
    addToQueue,
    toggleShuffle,
    toggleRepeat
  } = usePlayer();

  const playerState = {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    queue,
    shuffle,
    repeat
  };

const handlePlayTrack = (track, trackQueue = []) => {
    if (!isAuthenticated) {
      setShowSignupModal(true);
      return;
    }
    playTrack(track, trackQueue, 0, isAuthenticated);
  };

  const handleLikeTrack = async (trackId) => {
    if (!isAuthenticated) {
      setShowSignupModal(true);
      return;
    }
    try {
      const updatedTrack = await tracksService.toggleLike(trackId);
      if (updatedTrack) {
        toast.success(
          updatedTrack.liked 
            ? `Added ${updatedTrack.title} to liked songs` 
            : `Removed ${updatedTrack.title} from liked songs`
        );
      }
    } catch (error) {
      toast.error("Failed to update track");
      console.error("Error toggling like:", error);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const showSearch = location.pathname === "/search";

return (
    <div>
      <Layout
        playerState={playerState}
        onPlayPause={togglePlayPause}
        onNext={playNext}
        onPrevious={playPrevious}
        onSeek={seekTo}
        onVolumeChange={setVolume}
        onToggleShuffle={toggleShuffle}
        onToggleRepeat={toggleRepeat}
        onSearch={handleSearch}
        showSearch={showSearch}
        isAuthenticated={isAuthenticated}
      >
        <Routes>
          <Route 
            path="/" 
            element={<Home onPlayTrack={handlePlayTrack} isAuthenticated={isAuthenticated} />} 
          />
          <Route 
            path="/search" 
            element={
              <Search 
                onPlayTrack={handlePlayTrack}
                onLikeTrack={handleLikeTrack}
                onAddToQueue={addToQueue}
                searchQuery={searchQuery}
                isAuthenticated={isAuthenticated}
              />
            } 
          />
          <Route 
            path="/library/*" 
            element={
              <Library 
                onPlayTrack={handlePlayTrack}
                onLikeTrack={handleLikeTrack}
                onAddToQueue={addToQueue}
                isAuthenticated={isAuthenticated}
              />
            } 
          />
          <Route 
            path="/playlist/:id" 
            element={
              <PlaylistDetail 
                onPlayTrack={handlePlayTrack}
                onLikeTrack={handleLikeTrack}
                onAddToQueue={addToQueue}
                isAuthenticated={isAuthenticated}
              />
            } 
          />
        </Routes>
      </Layout>

    {/* Signup Modal */}
    {showSignupModal && (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-surface rounded-lg p-8 max-w-md mx-4 text-center">
          <div className="mb-6">
            <ApperIcon name="Music" size={48} className="text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Sign up for full access</h2>
            <p className="text-gray-light">
              Get unlimited access to millions of songs, create playlists, and enjoy music without interruptions.
            </p>
          </div>
          
          <div className="space-y-3 mb-6">
            <Button 
              variant="primary" 
              className="w-full"
              onClick={() => {
                setShowSignupModal(false);
                // Navigate to signup
              }}
            >
              Sign up free
            </Button>
            <Button 
              variant="secondary" 
              className="w-full"
              onClick={() => {
                setShowSignupModal(false);
                // Navigate to login
              }}
            >
              Log in
            </Button>
          </div>
          
          <button
            onClick={() => setShowSignupModal(false)}
            className="text-gray-light hover:text-white text-sm"
          >
            Continue with preview
          </button>
        </div>
      </div>
    )}
  </div>
};

const App = () => {
  return (
    <BrowserRouter>
      <AppContent />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastStyle={{
          background: '#282828',
          border: '1px solid #535353'
        }}
      />
    </BrowserRouter>
  );
};

export default App;