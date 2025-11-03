import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TrackRow from "@/components/molecules/TrackRow";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { playlistsService, tracksService } from "@/services/api/musicService";
import { formatDuration } from "@/utils/formatTime";

const PlaylistDetail = ({ onPlayTrack, onLikeTrack, onAddToQueue }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [playlist, setPlaylist] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPlaylistData = async () => {
    try {
      setError("");
      setLoading(true);
      
      const playlistData = await playlistsService.getById(id);
      if (!playlistData) {
        setError("Playlist not found");
        return;
      }

      const playlistTracks = await tracksService.getByIds(playlistData.trackIds);
      
      setPlaylist(playlistData);
      setTracks(playlistTracks);
    } catch (err) {
      setError("Failed to load playlist");
      console.error("Error loading playlist:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadPlaylistData();
    }
  }, [id]);

  const handlePlayAll = () => {
    if (tracks.length > 0) {
      onPlayTrack(tracks[0], tracks);
    }
  };

  if (loading) {
    return (
      <div className="p-6 pb-32">
        <Loading type="hero" />
        <div className="mt-8">
          <Loading type="list" count={8} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 pb-32">
        <Error 
          message={error} 
          onRetry={loadPlaylistData}
        />
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="p-6 pb-32">
        <Empty
          title="Playlist not found"
          description="The playlist you're looking for doesn't exist or has been removed."
          icon="Music"
          action={{
            label: "Browse Playlists",
            onClick: () => navigate("/")
          }}
        />
      </div>
    );
  }

  return (
    <div className="pb-32">
      {/* Playlist Header */}
      <div className="bg-gradient-to-b from-secondary/20 to-background p-8 pb-6">
        <div className="flex items-end gap-6">
          {/* Cover Image */}
          <div className="w-48 h-48 rounded-lg overflow-hidden flex-shrink-0 shadow-card">
            <img 
              src={playlist.coverUrl} 
              alt={playlist.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Playlist Info */}
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-white mb-2">
              {playlist.featured ? "Featured Playlist" : "Playlist"}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
              {playlist.title}
            </h1>
            <p className="text-gray-light text-lg mb-4 max-w-2xl">
              {playlist.description}
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-light">
              <span className="font-semibold text-white">Pulse Music</span>
              <span>•</span>
              <span>{playlist.trackCount} songs</span>
              <span>•</span>
              <span>{formatDuration(playlist.duration)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="px-8 py-6 bg-gradient-to-b from-black/20 to-background">
        <div className="flex items-center gap-6">
          <Button
            variant="play"
            size="play"
            onClick={handlePlayAll}
            className="w-14 h-14"
            disabled={tracks.length === 0}
          >
            <ApperIcon name="Play" size={24} />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8"
          >
            <ApperIcon name="Heart" size={20} className="text-gray-light" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8"
          >
            <ApperIcon name="MoreHorizontal" size={20} className="text-gray-light" />
          </Button>
        </div>
      </div>

      {/* Track List */}
      <div className="px-8">
        {tracks.length === 0 ? (
          <Empty
            title="No tracks in this playlist"
            description="This playlist is empty. Add some tracks to get started."
            icon="Music"
          />
        ) : (
          <div>
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-4 py-2 text-sm text-gray-light border-b border-gray-dark mb-2">
              <div className="col-span-1 text-center">#</div>
              <div className="col-span-5 md:col-span-4">Title</div>
              <div className="hidden md:block col-span-3">Album</div>
              <div className="col-span-6 md:col-span-4 text-right">
                <ApperIcon name="Clock3" size={16} className="inline" />
              </div>
            </div>

            {/* Track List */}
            <div className="space-y-1">
              {tracks.map((track, index) => (
                <TrackRow
                  key={track.Id}
                  track={track}
                  index={index}
                  onPlay={(track) => onPlayTrack(track, tracks)}
                  onLike={onLikeTrack}
                  onAddToQueue={onAddToQueue}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaylistDetail;