import React, { useState, useEffect } from "react";
import AlbumCard from "@/components/molecules/AlbumCard";
import PlaylistCard from "@/components/molecules/PlaylistCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { albumsService, tracksService, playlistsService } from "@/services/api/musicService";
import { useNavigate } from "react-router-dom";

const RecentlyPlayed = ({ onPlayTrack, isAuthenticated = true }) => {
  const [recentItems, setRecentItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loadRecentItems = async () => {
    try {
      setError("");
      setLoading(true);
      
      // Load both tracks and playlists to simulate recent items
      const [allTracks, allPlaylists] = await Promise.all([
        tracksService.getAll(),
        playlistsService.getAll()
      ]);

      // Create mixed recent items (simulate recent play history)
      const recentTracks = allTracks.slice(0, 4).map(track => ({
        ...track,
        type: 'track',
        lastPlayed: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) // Random within last week
      }));

      const recentPlaylists = allPlaylists.slice(0, 3).map(playlist => ({
        ...playlist,
        type: 'playlist',
        lastPlayed: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) // Random within last week
      }));

      // Combine and sort by last played
      const combined = [...recentTracks, ...recentPlaylists]
        .sort((a, b) => b.lastPlayed - a.lastPlayed)
        .slice(0, 8); // Show top 8 recent items

      setRecentItems(combined);
    } catch (err) {
      setError("Failed to load recent items");
      console.error("Error loading recent items:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecentItems();
  }, []);

  const handlePlayTrack = async (track) => {
    if (onPlayTrack) {
      onPlayTrack(track, [track]);
    }
  };

  const handlePlayPlaylist = async (playlist) => {
    try {
      const tracks = await tracksService.getByIds(playlist.trackIds);
      if (tracks.length > 0 && onPlayTrack) {
        onPlayTrack(tracks[0], tracks);
      }
    } catch (err) {
      console.error("Error playing playlist:", err);
    }
  };

  const handleItemClick = (item) => {
    if (item.type === 'track') {
      // For tracks, navigate to album or artist page
      navigate(`/search?q=${encodeURIComponent(item.artist)}`);
    } else if (item.type === 'playlist') {
      navigate(`/playlist/${item.Id}`);
    }
  };

  if (loading) {
    return (
      <section className="mb-12">
        <div className="mb-6">
          <div className="h-8 bg-gray-dark rounded w-64 mb-2"></div>
        </div>
        <div className="flex space-x-4 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-48">
              <div className="h-48 bg-gray-dark rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-dark rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-dark rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mb-12">
        <Error message={error} onRetry={loadRecentItems} />
      </section>
    );
  }

  if (recentItems.length === 0) {
    return null;
  }

  return (
    <section className="mb-12">
      {/* Section Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">
          {isAuthenticated ? "Continue Listening" : "Popular Right Now"}
        </h2>
      </div>

      {/* Horizontal Scrollable Container */}
      <div className="relative">
        <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory" 
             style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {recentItems.map((item) => (
            <div key={`${item.type}-${item.Id}`} className="flex-shrink-0 snap-start">
              {item.type === 'track' ? (
                <div className="w-48 group cursor-pointer" onClick={() => handleItemClick(item)}>
                  <div className="relative mb-4">
                    <img
                      src={item.coverUrl}
                      alt={item.title}
                      className="w-full h-48 object-cover rounded-lg shadow-card group-hover:shadow-lg transition-all duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-lg flex items-center justify-center">
                      <Button
                        variant="primary"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlayTrack(item);
                        }}
                      >
                        <ApperIcon name="Play" size={20} />
                      </Button>
                    </div>
                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 text-xs text-white px-2 py-1 rounded">
                      Track
                    </div>
                  </div>
                  <h3 className="text-white font-medium truncate mb-1">{item.title}</h3>
                  <p className="text-gray-light text-sm truncate">{item.artist}</p>
                </div>
              ) : (
                <div className="w-48">
                  <PlaylistCard
                    playlist={item}
                    onPlay={handlePlayPlaylist}
                    onClick={handleItemClick}
                    compact={true}
                  />
                  <div className="mt-2">
                    <div className="absolute top-2 left-2 bg-black bg-opacity-75 text-xs text-white px-2 py-1 rounded">
                      Playlist
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Gradient fade on right edge */}
        <div className="absolute top-0 right-0 w-8 h-full bg-gradient-to-l from-background to-transparent pointer-events-none"></div>
      </div>
    </section>
  );
};

export default RecentlyPlayed;