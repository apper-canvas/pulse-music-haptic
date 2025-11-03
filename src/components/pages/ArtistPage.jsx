import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { artistsService } from "@/services/api/musicService";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import TrackRow from "@/components/molecules/TrackRow";
import AlbumCard from "@/components/molecules/AlbumCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { toast } from "react-toastify";
import { cn } from "@/utils/cn";

const ArtistPage = ({ onPlayTrack, onLikeTrack, onAddToQueue, isAuthenticated }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [artist, setArtist] = useState(null);
  const [topTracks, setTopTracks] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    loadArtistData();
  }, [id]);

  const loadArtistData = async () => {
    try {
      setLoading(true);
      setError("");

      const [artistData, tracksData, albumsData] = await Promise.all([
        artistsService.getById(id),
        artistsService.getTopTracks(id),
        artistsService.getAlbums(id)
      ]);

      setArtist(artistData);
      setTopTracks(tracksData);
      setAlbums(albumsData);
    } catch (err) {
      setError("Failed to load artist data");
      console.error("Artist page error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFollowToggle = () => {
    if (!isAuthenticated) {
      toast.info("Please sign in to follow artists");
      return;
    }
    
    setFollowing(!following);
    toast.success(following ? "Unfollowed artist" : "Following artist");
  };

  const handlePlayAll = () => {
    if (topTracks.length > 0) {
      onPlayTrack(topTracks[0], topTracks, 0, isAuthenticated);
      toast.success(`Playing ${artist.name}`);
    }
  };

  const handleShufflePlay = () => {
    if (topTracks.length > 0) {
      const shuffledTracks = [...topTracks].sort(() => Math.random() - 0.5);
      onPlayTrack(shuffledTracks[0], shuffledTracks, 0, isAuthenticated);
      toast.success(`Shuffling ${artist.name}`);
    }
  };

  const handleTrackPlay = (track, trackList) => {
    const trackIndex = trackList.findIndex(t => t.Id === track.Id);
    onPlayTrack(track, trackList, trackIndex, isAuthenticated);
  };

  const handleLike = (track) => {
    if (!isAuthenticated) {
      toast.info("Please sign in to like tracks");
      return;
    }
    onLikeTrack(track.Id, !track.liked);
  };

  const handleAddToQueue = (track) => {
    onAddToQueue(track);
    toast.success(`Added "${track.title}" to queue`);
  };

  const handleAlbumClick = (album) => {
    // Navigate to album detail page (would need to be implemented)
    toast.info(`Album view: ${album.title}`);
  };

  if (loading) {
    return (
      <div className="p-6 pb-32">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 pb-32">
        <Error message={error} onRetry={loadArtistData} />
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="p-6 pb-32">
        <Empty
          title="Artist not found"
          description="The artist you're looking for doesn't exist."
          icon="User"
          action={{
            label: "Back to Search",
            onClick: () => navigate("/search")
          }}
        />
      </div>
    );
  }

  return (
    <div className="pb-32">
      {/* Artist Header */}
      <div className="relative h-80 md:h-96 bg-gradient-to-b from-purple-900/50 to-background">
        <div className="absolute inset-0 bg-black/20" />
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${artist.imageUrl})` }}
        />
        
        <div className="relative h-full flex items-end p-6">
          <div className="flex items-center gap-6">
            <div className="w-48 h-48 rounded-full overflow-hidden shadow-xl border-4 border-white/20">
              <img
                src={artist.imageUrl}
                alt={artist.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {artist.verified && (
                  <ApperIcon name="BadgeCheck" size={24} className="text-primary" />
                )}
                <span className="text-white/80 font-medium">Artist</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                {artist.name}
              </h1>
              <p className="text-white/80 mb-2">
                {artist.followers?.toLocaleString()} monthly listeners
              </p>
              {artist.genres && (
                <div className="flex flex-wrap gap-2">
                  {artist.genres.map((genre) => (
                    <span
                      key={genre}
                      className="px-3 py-1 bg-white/20 text-white text-sm rounded-full"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Action Buttons */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            size="lg"
            className="h-12 px-8 bg-primary hover:bg-primary/90"
            onClick={handlePlayAll}
            disabled={topTracks.length === 0}
          >
            <ApperIcon name="Play" size={20} className="mr-2" />
            Play
          </Button>
          
          <Button
            size="lg"
            variant="outline"
            className="h-12 px-8"
            onClick={handleShufflePlay}
            disabled={topTracks.length === 0}
          >
            <ApperIcon name="Shuffle" size={20} className="mr-2" />
            Shuffle
          </Button>
          
          <Button
            size="icon"
            variant="ghost"
            className={cn(
              "w-12 h-12 rounded-full border border-gray-medium",
              following ? "bg-primary text-white border-primary" : "text-gray-light hover:text-white"
            )}
            onClick={handleFollowToggle}
          >
            <ApperIcon name={following ? "UserCheck" : "UserPlus"} size={20} />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            className="w-12 h-12 rounded-full border border-gray-medium text-gray-light hover:text-white"
          >
            <ApperIcon name="MoreHorizontal" size={20} />
          </Button>
        </div>

        {/* Artist Bio */}
        {artist.bio && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">About</h2>
            <p className="text-gray-light leading-relaxed max-w-4xl">
              {artist.bio}
            </p>
          </div>
        )}

        {/* Popular Tracks */}
        {topTracks.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Popular</h2>
            <div className="space-y-2">
              {topTracks.slice(0, 5).map((track, index) => (
                <TrackRow
                  key={track.Id}
                  track={track}
                  index={index + 1}
                  isPlaying={false}
                  onPlay={() => handleTrackPlay(track, topTracks)}
                  onLike={() => handleLike(track)}
                  onAddToQueue={() => handleAddToQueue(track)}
                  showIndex={true}
                  showAlbum={true}
                  isAuthenticated={isAuthenticated}
                />
              ))}
              {topTracks.length > 5 && (
                <Button
                  variant="ghost"
                  className="w-full mt-4 text-gray-light hover:text-white"
                  onClick={() => {
                    // Could expand to show all tracks
                    toast.info(`${topTracks.length - 5} more tracks available`);
                  }}
                >
                  Show all {topTracks.length} songs
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Albums */}
        {albums.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Albums</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {albums.map((album) => (
                <AlbumCard
                  key={album.Id}
                  album={album}
                  onPlay={() => {
                    // Would play first track of album
                    toast.success(`Playing ${album.title}`);
                  }}
                  onClick={() => handleAlbumClick(album)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty States */}
        {topTracks.length === 0 && albums.length === 0 && (
          <Empty
            title="No content available"
            description={`No tracks or albums found for ${artist.name}.`}
            icon="Music"
          />
        )}
      </div>
    </div>
  );
};

export default ArtistPage;