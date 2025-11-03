import React, { useState, useEffect } from "react";
import AlbumCard from "@/components/molecules/AlbumCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { albumsService, tracksService } from "@/services/api/musicService";
import { useNavigate } from "react-router-dom";

const RecentlyPlayed = ({ onPlayAlbum }) => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loadRecentAlbums = async () => {
    try {
      setError("");
      setLoading(true);
      const allAlbums = await albumsService.getAll();
      // Simulate recently played by taking first 6 albums
      setAlbums(allAlbums.slice(0, 6));
    } catch (err) {
      setError("Failed to load recent albums");
      console.error("Error loading recent albums:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecentAlbums();
  }, []);

  const handlePlayAlbum = async (album) => {
    try {
      const tracks = await tracksService.getByIds(album.trackIds);
      if (tracks.length > 0 && onPlayAlbum) {
        onPlayAlbum(tracks[0], tracks);
      }
    } catch (err) {
      console.error("Error playing album:", err);
    }
  };

  const handleAlbumClick = (album) => {
    navigate(`/album/${album.Id}`);
  };

  if (loading) {
    return (
      <section className="mb-12">
        <div className="mb-6">
          <div className="h-8 bg-gray-dark rounded w-64 mb-2"></div>
        </div>
        <Loading type="grid" count={6} />
      </section>
    );
  }

  if (error) {
    return (
      <section className="mb-12">
        <Error message={error} onRetry={loadRecentAlbums} />
      </section>
    );
  }

  if (albums.length === 0) {
    return null;
  }

  return (
    <section className="mb-12">
      {/* Section Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">Recently Played</h2>
      </div>

      {/* Albums Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {albums.map((album) => (
          <AlbumCard
            key={album.Id}
            album={album}
            onPlay={handlePlayAlbum}
            onClick={handleAlbumClick}
          />
        ))}
      </div>
    </section>
  );
};

export default RecentlyPlayed;