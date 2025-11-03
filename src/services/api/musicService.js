import tracksData from "@/services/mockData/tracks.json";
import playlistsData from "@/services/mockData/playlists.json";
import albumsData from "@/services/mockData/albums.json";

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
  }
};

// Service for getting trending songs for non-authenticated users
export const trendingService = {
  getTrendingSongs: async () => {
    // Return a curated list of trending tracks
    return tracksData.slice(0, 6);
  }
};

// Playlists Service
export const playlistsService = {
  async getAll() {
    await delay(400);
    return [...playlistsData];
  },

  async getFeatured() {
    await delay(350);
    return playlistsData
      .filter(playlist => playlist.featured)
      .map(playlist => ({ ...playlist }));
  },

  async getById(id) {
    await delay(200);
    const playlist = playlistsData.find(playlist => playlist.Id === parseInt(id));
    return playlist ? { ...playlist } : null;
  },

  async getUserPlaylists() {
    await delay(300);
    return playlistsData
      .filter(playlist => !playlist.featured)
      .map(playlist => ({ ...playlist }));
  },

  async search(query) {
    await delay(300);
    if (!query.trim()) return [];
    
    const searchTerm = query.toLowerCase();
    return playlistsData
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

// Combined Search Service
export const searchService = {
  async searchAll(query) {
    await delay(400);
    if (!query.trim()) {
      return {
        tracks: [],
        playlists: [],
        albums: []
      };
    }

    const [tracks, playlists, albums] = await Promise.all([
      tracksService.search(query),
      playlistsService.search(query),
      albumsService.search(query)
    ]);

    return {
      tracks,
      playlists,
      albums
    };
  }
};