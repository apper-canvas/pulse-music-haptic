import React, { useState, useCallback } from "react";
import TrackRow from "@/components/molecules/TrackRow";
import PlaylistCard from "@/components/molecules/PlaylistCard";
import AlbumCard from "@/components/molecules/AlbumCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { searchService, tracksService } from "@/services/api/musicService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Search = ({ onPlayTrack, onLikeTrack, onAddToQueue }) => {
  const [searchResults, setSearchResults] = useState({
    tracks: [],
    playlists: [],
    albums: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const navigate = useNavigate();

  const handleSearch = useCallback(async (searchQuery) => {
    try {
      setQuery(searchQuery);
      setError("");
      
      if (!searchQuery.trim()) {
        setSearchResults({ tracks: [], playlists: [], albums: [] });
        setHasSearched(false);
        return;
      }

      setLoading(true);
      setHasSearched(true);
      const results = await searchService.searchAll(searchQuery);
      setSearchResults(results);
    } catch (err) {
      setError("Failed to search");
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handlePlayPlaylist = async (playlist) => {
    try {
      const tracks = await tracksService.getByIds(playlist.trackIds);
      if (tracks.length > 0) {
        onPlayTrack(tracks[0], tracks);
      }
    } catch (err) {
      console.error("Error playing playlist:", err);
      toast.error("Failed to play playlist");
    }
  };

  const handlePlayAlbum = async (album) => {
    try {
      const tracks = await tracksService.getByIds(album.trackIds);
      if (tracks.length > 0) {
        onPlayTrack(tracks[0], tracks);
      }
    } catch (err) {
      console.error("Error playing album:", err);
      toast.error("Failed to play album");
    }
  };

  const handlePlaylistClick = (playlist) => {
    navigate(`/playlist/${playlist.Id}`);
  };

  const handleAlbumClick = (album) => {
    navigate(`/album/${album.Id}`);
  };

  const totalResults = searchResults.tracks.length + searchResults.playlists.length + searchResults.albums.length;

  if (!hasSearched) {
    return (
      <div className="p-6 pb-32">
        <div className="text-center py-16">
          <div className="bg-gray-dark/30 rounded-full p-8 mb-6 inline-flex">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">🎵</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Search for Music</h1>
          <p className="text-gray-light text-lg max-w-md mx-auto">
            Find your favorite songs, albums, artists, and playlists
          </p>
        </div>

        {/* Browse Categories */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">Browse All</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { name: "Pop", color: "from-pink-500 to-purple-600" },
              { name: "Hip-Hop", color: "from-orange-500 to-red-600" },
              { name: "Rock", color: "from-gray-700 to-gray-900" },
              { name: "Electronic", color: "from-cyan-500 to-blue-600" },
              { name: "Jazz", color: "from-yellow-600 to-orange-600" },
              { name: "Classical", color: "from-purple-700 to-indigo-800" },
              { name: "Country", color: "from-green-600 to-yellow-600" },
              { name: "R&B", color: "from-red-600 to-pink-600" },
            ].map((category, index) => (
              <div
                key={index}
                className={`bg-gradient-to-br ${category.color} p-6 rounded-lg cursor-pointer hover:scale-105 transition-transform duration-200 h-32 flex items-end`}
              >
                <h3 className="text-white font-bold text-xl">{category.name}</h3>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6 pb-32">
        <div className="mb-6">
          <div className="h-8 bg-gray-dark rounded w-64 mb-2"></div>
          <div className="h-4 bg-gray-dark rounded w-48"></div>
        </div>
        <Loading type="list" count={8} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 pb-32">
        <Error message={error} onRetry={() => handleSearch(query)} />
      </div>
    );
  }

  if (totalResults === 0) {
    return (
      <div className="p-6 pb-32">
        <Empty
          title="No results found"
          description={`No results found for "${query}". Try searching with different keywords.`}
          icon="Search"
          action={{
            label: "Clear Search",
            onClick: () => {
              setQuery("");
              setHasSearched(false);
              setSearchResults({ tracks: [], playlists: [], albums: [] });
            }
          }}
        />
      </div>
    );
  }

  return (
    <div className="p-6 pb-32">
      {/* Search Results Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Search results for "{query}"
        </h1>
        <p className="text-gray-light">
          Found {totalResults} results
        </p>
      </div>

      {/* Top Result */}
      {searchResults.tracks.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Top Result</h2>
          <div className="bg-surface p-6 rounded-lg hover:bg-gray-dark cursor-pointer transition-all duration-200 max-w-sm">
            <div className="flex items-center gap-4 mb-4">
              <img 
                src={searchResults.tracks[0].coverUrl}
                alt={searchResults.tracks[0].title}
                className="w-16 h-16 rounded-lg"
              />
              <div>
                <h3 className="text-white font-bold text-lg">{searchResults.tracks[0].title}</h3>
                <p className="text-gray-light">{searchResults.tracks[0].artist}</p>
              </div>
            </div>
            <button
              onClick={() => onPlayTrack(searchResults.tracks[0], [searchResults.tracks[0]])}
              className="bg-primary hover:bg-green-400 text-black font-medium px-6 py-2 rounded-full transition-all duration-200 hover:scale-105"
            >
              Play
            </button>
          </div>
        </section>
      )}

      {/* Tracks */}
      {searchResults.tracks.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Songs</h2>
          <div className="space-y-1">
            {searchResults.tracks.slice(0, 5).map((track, index) => (
              <TrackRow
                key={track.Id}
                track={track}
                index={index}
                onPlay={(track) => onPlayTrack(track, searchResults.tracks)}
                onLike={onLikeTrack}
                onAddToQueue={onAddToQueue}
                showIndex={false}
              />
            ))}
          </div>
        </section>
      )}

      {/* Playlists */}
      {searchResults.playlists.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Playlists</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {searchResults.playlists.map((playlist) => (
              <PlaylistCard
                key={playlist.Id}
                playlist={playlist}
                onPlay={handlePlayPlaylist}
                onClick={handlePlaylistClick}
              />
            ))}
          </div>
        </section>
      )}

      {/* Albums */}
      {searchResults.albums.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Albums</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {searchResults.albums.map((album) => (
              <AlbumCard
                key={album.Id}
                album={album}
                onPlay={handlePlayAlbum}
                onClick={handleAlbumClick}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Search;