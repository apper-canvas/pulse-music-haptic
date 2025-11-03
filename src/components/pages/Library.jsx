import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import PlaylistCard from "@/components/molecules/PlaylistCard";
import TrackRow from "@/components/molecules/TrackRow";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { playlistsService, tracksService } from "@/services/api/musicService";
import { useNavigate } from "react-router-dom";
import { cn } from "@/utils/cn";

const Library = ({ onPlayTrack, onLikeTrack, onAddToQueue }) => {
  const [playlists, setPlaylists] = useState([]);
  const [likedTracks, setLikedTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("playlists");
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const location = useLocation();
  const navigate = useNavigate();

  // Check if we're on a specific library page
  const isLikedPage = location.pathname === "/library/liked";
  const isRecentPage = location.pathname === "/library/recent";

  const loadLibraryData = async () => {
    try {
      setError("");
      setLoading(true);
      const [userPlaylists, allTracks] = await Promise.all([
        playlistsService.getUserPlaylists(),
        tracksService.getAll()
      ]);
      
      setPlaylists(userPlaylists);
      setLikedTracks(allTracks.filter(track => track.liked));
    } catch (err) {
      setError("Failed to load library");
      console.error("Error loading library:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLibraryData();
  }, []);

  const handlePlayPlaylist = async (playlist) => {
    try {
      const tracks = await tracksService.getByIds(playlist.trackIds);
      if (tracks.length > 0) {
        onPlayTrack(tracks[0], tracks);
      }
    } catch (err) {
      console.error("Error playing playlist:", err);
    }
  };

  const handlePlaylistClick = (playlist) => {
    navigate(`/playlist/${playlist.Id}`);
  };

  // Handle liked songs page
  if (isLikedPage) {
    if (loading) {
      return (
        <div className="p-6 pb-32">
          <Loading type="list" count={10} />
        </div>
      );
    }

    return (
      <div className="p-6 pb-32">
        {/* Header */}
        <div className="flex items-center gap-6 mb-8 pb-6 border-b border-gray-dark">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
            <ApperIcon name="Heart" size={32} className="text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Liked Songs</h1>
            <p className="text-gray-light">{likedTracks.length} songs</p>
          </div>
        </div>

        {likedTracks.length === 0 ? (
          <Empty
            title="No liked songs yet"
            description="Songs you like will appear here. Start exploring and hearting your favorites!"
            icon="Heart"
            action={{
              label: "Discover Music",
              onClick: () => navigate("/")
            }}
          />
        ) : (
          <div className="space-y-1">
            {likedTracks.map((track, index) => (
              <TrackRow
                key={track.Id}
                track={track}
                index={index}
                onPlay={(track) => onPlayTrack(track, likedTracks)}
                onLike={onLikeTrack}
                onAddToQueue={onAddToQueue}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Handle recently played page
  if (isRecentPage) {
    return (
      <div className="p-6 pb-32">
        {/* Header */}
        <div className="flex items-center gap-6 mb-8 pb-6 border-b border-gray-dark">
          <div className="w-20 h-20 bg-gradient-to-br from-secondary to-accent rounded-lg flex items-center justify-center">
            <ApperIcon name="Clock" size={32} className="text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Recently Played</h1>
            <p className="text-gray-light">Your listening history</p>
          </div>
        </div>

        <Empty
          title="No recent activity"
          description="Your recently played tracks will show up here after you start listening."
          icon="Clock"
          action={{
            label: "Start Listening",
            onClick: () => navigate("/")
          }}
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6 pb-32">
        <div className="mb-6">
          <div className="h-8 bg-gray-dark rounded w-32 mb-4"></div>
          <div className="flex gap-4 mb-6">
            <div className="h-8 bg-gray-dark rounded w-24"></div>
            <div className="h-8 bg-gray-dark rounded w-24"></div>
          </div>
        </div>
        <Loading type="grid" count={6} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 pb-32">
        <Error message={error} onRetry={loadLibraryData} />
      </div>
    );
  }

  return (
    <div className="p-6 pb-32">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Your Library</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode("grid")}
            className={cn(
              "p-2 rounded hover:bg-gray-dark transition-colors",
              viewMode === "grid" ? "text-primary" : "text-gray-light"
            )}
          >
            <ApperIcon name="Grid3x3" size={20} />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={cn(
              "p-2 rounded hover:bg-gray-dark transition-colors",
              viewMode === "list" ? "text-primary" : "text-gray-light"
            )}
          >
            <ApperIcon name="List" size={20} />
          </button>
        </div>
      </div>

      {/* Quick Access */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <NavLink 
          to="/library/liked" 
          className="group flex items-center gap-4 bg-surface p-4 rounded-lg hover:bg-gray-dark transition-all duration-200"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded flex items-center justify-center">
            <ApperIcon name="Heart" size={20} className="text-white" />
          </div>
          <div>
            <div className="font-semibold text-white group-hover:text-primary transition-colors">Liked Songs</div>
            <div className="text-sm text-gray-light">{likedTracks.length} songs</div>
          </div>
        </NavLink>

        <NavLink 
          to="/library/recent" 
          className="group flex items-center gap-4 bg-surface p-4 rounded-lg hover:bg-gray-dark transition-all duration-200"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-secondary to-accent rounded flex items-center justify-center">
            <ApperIcon name="Clock" size={20} className="text-white" />
          </div>
          <div>
            <div className="font-semibold text-white group-hover:text-primary transition-colors">Recently Played</div>
            <div className="text-sm text-gray-light">Your history</div>
          </div>
        </NavLink>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 mb-6 border-b border-gray-dark">
        {[
          { key: "playlists", label: "Playlists" },
          { key: "albums", label: "Albums" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "pb-3 font-medium transition-all duration-200 border-b-2",
              activeTab === tab.key 
                ? "text-primary border-primary" 
                : "text-gray-light border-transparent hover:text-white"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === "playlists" && (
        <div>
          {playlists.length === 0 ? (
            <Empty
              title="No playlists yet"
              description="Create your first playlist to organize your favorite tracks."
              icon="Music"
              action={{
                label: "Create Playlist",
                onClick: () => console.log("Create playlist")
              }}
            />
          ) : (
            <div className={cn(
              viewMode === "grid" 
                ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4"
                : "space-y-2"
            )}>
              {playlists.map((playlist) => (
                <PlaylistCard
                  key={playlist.Id}
                  playlist={playlist}
                  onPlay={handlePlayPlaylist}
                  onClick={handlePlaylistClick}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "albums" && (
        <Empty
          title="No albums saved"
          description="Albums you save will appear here for easy access."
          icon="Disc"
          action={{
            label: "Browse Albums",
            onClick: () => navigate("/search")
          }}
        />
      )}
    </div>
  );
};

export default Library;