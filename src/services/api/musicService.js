import tracksData from "@/services/mockData/tracks.json";
import playlistsData from "@/services/mockData/playlists.json";
import albumsData from "@/services/mockData/albums.json";

// Mock artists data derived from existing tracks
const artistsData = [
  {
    Id: 1,
    name: "The Weeknd",
    imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&crop=faces",
    followers: 85000000,
    verified: true,
    bio: "Canadian singer, songwriter, and record producer known for his dark pop sound.",
    genres: ["Pop", "R&B", "Alternative"]
  },
  {
    Id: 2,
    name: "Harry Styles",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=faces",
    followers: 47000000,
    verified: true,
    bio: "English singer, songwriter, and actor. Former member of One Direction.",
    genres: ["Pop", "Rock", "Folk"]
  },
  {
    Id: 3,
    name: "Dua Lipa",
    imageUrl: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=400&fit=crop&crop=faces",
    followers: 72000000,
    verified: true,
    bio: "English singer, songwriter known for her disco-pop sound.",
    genres: ["Pop", "Dance", "Electronic"]
  },
  {
    Id: 4,
    name: "Olivia Rodrigo",
    imageUrl: "https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w=400&h=400&fit=crop&crop=faces",
    followers: 28000000,
    verified: true,
    bio: "American singer-songwriter and actress known for emotional pop-rock songs.",
    genres: ["Pop", "Alternative", "Pop Rock"]
  },
  {
    Id: 5,
    name: "The Kid LAROI",
    imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop&crop=faces",
    followers: 15000000,
    verified: true,
    bio: "Australian rapper and singer known for melodic hip hop.",
    genres: ["Hip Hop", "Pop", "Rap"]
  },
  {
    Id: 6,
    name: "Glass Animals",
    imageUrl: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=400&h=400&fit=crop&crop=faces",
    followers: 12000000,
    verified: true,
    bio: "English indie rock band known for their unique psychedelic sound.",
    genres: ["Indie", "Alternative", "Electronic"]
  },
  {
    Id: 7,
    name: "Lil Nas X",
    imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&crop=faces",
    followers: 35000000,
    verified: true,
    bio: "American rapper and singer known for genre-blending music and viral hits.",
    genres: ["Hip Hop", "Pop", "Country Rap"]
  },
  {
    Id: 8,
    name: "Justin Bieber",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=faces",
    followers: 110000000,
    verified: true,
    bio: "Canadian singer known for his pop and R&B music.",
    genres: ["Pop", "R&B", "Dance"]
  }
];

// Helper function to add delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Tracks Service
export const tracksService = {
  async getAll() {
    await delay(300);
    return [...tracksData];
  },

  async getById(id) {
    await delay(200);
    const track = tracksData.find(track => track.Id === parseInt(id));
    return track ? { ...track } : null;
  },

  async getByIds(ids) {
    await delay(250);
    const stringIds = ids.map(id => id.toString());
    return tracksData
      .filter(track => stringIds.includes(track.Id.toString()))
      .map(track => ({ ...track }));
  },

  async toggleLike(id) {
    await delay(200);
    const track = tracksData.find(track => track.Id === parseInt(id));
    if (track) {
      track.liked = !track.liked;
      return { ...track };
    }
    return null;
  },

  async search(query) {
    await delay(300);
    if (!query.trim()) return [];
    
    const searchTerm = query.toLowerCase();
    return tracksData
      .filter(track => 
        track.title.toLowerCase().includes(searchTerm) ||
        track.artist.toLowerCase().includes(searchTerm) ||
        track.album.toLowerCase().includes(searchTerm)
      )
      .map(track => ({ ...track }));
  },

  async getRecommendations(limit = 10) {
    await delay(400);
    // Mock recommendation algorithm based on liked tracks
    const likedTracks = tracksData.filter(track => track.liked);
    if (likedTracks.length === 0) {
      return tracksData.slice(0, limit);
    }
    
    // Simple recommendation: tracks from same artists as liked tracks
    const likedArtists = [...new Set(likedTracks.map(track => track.artist))];
    const recommendations = tracksData
      .filter(track => !track.liked && likedArtists.includes(track.artist))
      .slice(0, limit);
    
    // Fill with random tracks if not enough recommendations
    if (recommendations.length < limit) {
      const remaining = tracksData
        .filter(track => !track.liked && !recommendations.find(r => r.Id === track.Id))
        .slice(0, limit - recommendations.length);
      recommendations.push(...remaining);
    }
    
    return recommendations;
  }
};

// Service for getting trending songs for non-authenticated users
export const trendingService = {
  getTrendingSongs: async () => {
    // Return a curated list of trending tracks
    return tracksData.slice(0, 6);
  }
};

// Mock user playlist storage
let userPlaylistsData = [];
let nextPlaylistId = 1000;

// Playlists Service
export const playlistsService = {
  async getAll() {
    await delay(400);
    return [...playlistsData, ...userPlaylistsData];
  },

  async getFeatured() {
    await delay(350);
    return playlistsData
      .filter(playlist => playlist.featured)
      .map(playlist => ({ ...playlist }));
  },

  async getById(id) {
    await delay(200);
    const allPlaylists = [...playlistsData, ...userPlaylistsData];
    const playlist = allPlaylists.find(playlist => playlist.Id === parseInt(id));
    return playlist ? { ...playlist } : null;
  },

  async getUserPlaylists() {
    await delay(300);
    return [...userPlaylistsData, ...playlistsData.filter(playlist => !playlist.featured)];
  },

  async create(playlistData) {
    await delay(400);
    const newPlaylist = {
      Id: nextPlaylistId++,
      title: playlistData.title,
      description: playlistData.description || "",
      coverUrl: playlistData.coverUrl || "/api/placeholder/300/300",
      trackIds: [],
      featured: false,
      createdBy: "user",
      createdAt: new Date().toISOString()
    };
    userPlaylistsData.push(newPlaylist);
    return { ...newPlaylist };
  },

  async update(id, data) {
    await delay(300);
    const playlistIndex = userPlaylistsData.findIndex(p => p.Id === parseInt(id));
    if (playlistIndex === -1) return null;
    
    userPlaylistsData[playlistIndex] = {
      ...userPlaylistsData[playlistIndex],
      ...data,
      updatedAt: new Date().toISOString()
    };
    return { ...userPlaylistsData[playlistIndex] };
  },

  async delete(id) {
    await delay(250);
    const playlistIndex = userPlaylistsData.findIndex(p => p.Id === parseInt(id));
    if (playlistIndex === -1) return false;
    
    userPlaylistsData.splice(playlistIndex, 1);
    return true;
  },

  async addTrack(playlistId, trackId) {
    await delay(300);
    const playlist = userPlaylistsData.find(p => p.Id === parseInt(playlistId));
    if (!playlist) return null;
    
    if (!playlist.trackIds.includes(parseInt(trackId))) {
      playlist.trackIds.push(parseInt(trackId));
      playlist.updatedAt = new Date().toISOString();
    }
    return { ...playlist };
  },

  async removeTrack(playlistId, trackId) {
    await delay(300);
    const playlist = userPlaylistsData.find(p => p.Id === parseInt(playlistId));
    if (!playlist) return null;
    
    playlist.trackIds = playlist.trackIds.filter(id => id !== parseInt(trackId));
    playlist.updatedAt = new Date().toISOString();
    return { ...playlist };
  },

  async search(query) {
    await delay(300);
    if (!query.trim()) return [];
    
    const searchTerm = query.toLowerCase();
    const allPlaylists = [...playlistsData, ...userPlaylistsData];
    return allPlaylists
      .filter(playlist => 
        playlist.title.toLowerCase().includes(searchTerm) ||
        playlist.description.toLowerCase().includes(searchTerm)
      )
      .map(playlist => ({ ...playlist }));
  }
};

// Albums Service
export const albumsService = {
  async getAll() {
    await delay(400);
    return [...albumsData];
  },

  async getById(id) {
    await delay(200);
    const album = albumsData.find(album => album.Id === parseInt(id));
    return album ? { ...album } : null;
  },

  async search(query) {
    await delay(300);
    if (!query.trim()) return [];
    
    const searchTerm = query.toLowerCase();
    return albumsData
      .filter(album => 
        album.title.toLowerCase().includes(searchTerm) ||
        album.artist.toLowerCase().includes(searchTerm)
      )
      .map(album => ({ ...album }));
  }
};

// Artists service
export const artistsService = {
  async getAll() {
    await delay(300);
    return [...artistsData];
  },

  async getById(id) {
    await delay(300);
    const artist = artistsData.find(a => a.Id === parseInt(id));
    if (!artist) {
      throw new Error('Artist not found');
    }
    return { ...artist };
  },

  async getTopTracks(artistId) {
    await delay(400);
    const artistTracks = tracksData.filter(track => track.artistId === artistId.toString());
    return artistTracks.slice(0, 10); // Top 10 tracks
  },

  async getAlbums(artistId) {
    await delay(400);
    const artistAlbums = albumsData.filter(album => album.artistId === artistId.toString());
    return artistAlbums;
  },

  async search(query) {
    await delay(300);
    if (!query.trim()) return [];
    
    const searchTerm = query.toLowerCase();
    return artistsData.filter(artist =>
      artist.name.toLowerCase().includes(searchTerm) ||
      artist.genres.some(genre => genre.toLowerCase().includes(searchTerm))
    );
  }
};

// User Service
export const userService = {
  async getCurrentUser() {
    await delay(200);
    return {
      Id: 1,
      name: "Alex Chen",
      email: "alex.chen@example.com",
      avatar: "/api/placeholder/40/40",
      premium: true,
      joinedAt: "2023-01-15",
      preferences: {
        explicitContent: false,
        autoplay: true,
        crossfade: 0,
        quality: "high"
      }
    };
  },

  async updateProfile(data) {
    await delay(300);
    // Mock update - in real app would persist to backend
    return {
      Id: 1,
      name: data.name || "Alex Chen",
      email: data.email || "alex.chen@example.com",
      avatar: data.avatar || "/api/placeholder/40/40",
      premium: true,
      updatedAt: new Date().toISOString()
    };
  }
};

// Recently Played Service
let recentlyPlayedData = [];
const MAX_RECENT_TRACKS = 50;

export const recentlyPlayedService = {
  async addTrack(track) {
    await delay(100);
    // Remove existing entry if present
    recentlyPlayedData = recentlyPlayedData.filter(item => item.track.Id !== track.Id);
    
    // Add to beginning
    recentlyPlayedData.unshift({
      track: { ...track },
      playedAt: new Date().toISOString()
    });
    
    // Keep only latest entries
    if (recentlyPlayedData.length > MAX_RECENT_TRACKS) {
      recentlyPlayedData = recentlyPlayedData.slice(0, MAX_RECENT_TRACKS);
    }
    
    return recentlyPlayedData[0];
  },

  async getRecent(limit = 20) {
    await delay(250);
    return recentlyPlayedData.slice(0, limit);
  },

  async clearHistory() {
    await delay(200);
    recentlyPlayedData = [];
    return true;
  }
};

// Combined Search Service
export const searchService = {
  async searchAll(query) {
    await delay(400);
    if (!query.trim()) {
      return {
        tracks: [],
        playlists: [],
        albums: [],
        artists: []
      };
    }

    const [tracks, playlists, albums, artists] = await Promise.all([
      tracksService.search(query),
      playlistsService.search(query),
      albumsService.search(query),
      artistsService.search(query)
    ]);

    return {
      tracks,
      playlists,
      albums,
      artists
    };
  }
};