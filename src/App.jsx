import React, { useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import Home from "@/components/pages/Home";
import Search from "@/components/pages/Search";
import Library from "@/components/pages/Library";
import PlaylistDetail from "@/components/pages/PlaylistDetail";
import usePlayer from "@/hooks/usePlayer";
import { tracksService } from "@/services/api/musicService";
import { toast } from "react-toastify";

const AppContent = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

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
    playTrack(track, trackQueue);
  };

  const handleLikeTrack = async (trackId) => {
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
    >
      <Routes>
        <Route 
          path="/" 
          element={<Home onPlayTrack={handlePlayTrack} />} 
        />
        <Route 
          path="/search" 
          element={
            <Search 
              onPlayTrack={handlePlayTrack}
              onLikeTrack={handleLikeTrack}
              onAddToQueue={addToQueue}
              searchQuery={searchQuery}
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
            />
          } 
        />
      </Routes>
    </Layout>
  );
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