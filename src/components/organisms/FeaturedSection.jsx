import React, { useEffect, useState } from "react";
import { playlistsService, tracksService } from "@/services/api/musicService";
import { useNavigate } from "react-router-dom";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import PlaylistCard from "@/components/molecules/PlaylistCard";

const FeaturedSection = ({ onPlayPlaylist, isAuthenticated = true }) => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loadFeaturedPlaylists = async () => {
    try {
      setError("");
      setLoading(true);
      const featuredPlaylists = await playlistsService.getFeatured();
      setPlaylists(featuredPlaylists);
    } catch (err) {
      setError("Failed to load featured playlists");
      console.error("Error loading featured playlists:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeaturedPlaylists();
  }, []);

  const handlePlayPlaylist = async (playlist) => {
    try {
      const tracks = await tracksService.getByIds(playlist.trackIds);
      if (tracks.length > 0 && onPlayPlaylist) {
        onPlayPlaylist(tracks[0], tracks);
      }
    } catch (err) {
      console.error("Error playing playlist:", err);
    }
  };

  const handlePlaylistClick = (playlist) => {
    navigate(`/playlist/${playlist.Id}`);
  };

  if (loading) {
    return (
      <section className="mb-12">
        <div className="mb-6">
          <div className="h-8 bg-gray-dark rounded w-64 mb-2"></div>
          <div className="h-4 bg-gray-dark rounded w-96"></div>
        </div>
        <Loading type="grid" count={6} />
      </section>
    );
  }

  if (error) {
    return (
      <section className="mb-12">
        <Error message={error} onRetry={loadFeaturedPlaylists} />
      </section>
    );
  }

if (playlists.length === 0) {
    return (
      <section className="mb-12">
        <Empty
          title="No featured playlists"
          description="Check back later for curated playlists just for you."
          icon="Music"
        />
      </section>
    );
  }

  return (
    <section className="mb-12">
      {/* Section Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">Featured Playlists</h2>
        <p className="text-gray-light">Handpicked playlists to discover your next favorite song</p>
      </div>

      {/* Playlists Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {playlists.map((playlist) => (
          <PlaylistCard
            key={playlist.Id}
            playlist={playlist}
            onPlay={handlePlayPlaylist}
            onClick={handlePlaylistClick}
          />
        ))}
      </div>
    </section>
  );
};

export default FeaturedSection;