import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { recentlyPlayedService } from "@/services/api/musicService";

// Mock lyrics data for demonstration
const mockLyrics = {
  1: {
    title: "Blinding Lights",
    artist: "The Weeknd",
    lines: [
      { time: 0, text: "Yeah" },
      { time: 3, text: "I've been tryna call" },
      { time: 6, text: "I've been on my own for long enough" },
      { time: 10, text: "Maybe you can show me how to love, maybe" },
      { time: 15, text: "I feel like I'm just missing" },
      { time: 18, text: "Something when you're gone" },
      { time: 21, text: "Sometimes I wanna text you but for what?" },
      { time: 25, text: "I cannot say" },
      { time: 28, text: "I'm blinded by the lights" },
      { time: 32, text: "No, I can't sleep until I feel your touch" },
      { time: 36, text: "I said, ooh, I'm blinded by the lights" },
      { time: 40, text: "No, I can't sleep until I feel your touch" }
    ]
  },
  2: {
    title: "Watermelon Sugar",
    artist: "Harry Styles", 
    lines: [
      { time: 0, text: "Tastes like strawberries on a summer evenin'" },
      { time: 4, text: "And it sounds just like a song" },
      { time: 8, text: "I want more berries and that summer feelin'" },
      { time: 12, text: "It's so wonderful and warm" },
      { time: 16, text: "Breathe me in, breathe me out" },
      { time: 20, text: "I don't know if I could ever go without" },
      { time: 24, text: "I'm just thinking out loud" },
      { time: 28, text: "I don't know if I could ever go without" },
      { time: 32, text: "Watermelon sugar high" },
      { time: 36, text: "Watermelon sugar high" },
      { time: 40, text: "Watermelon sugar high" }
    ]
  }
};

const usePlayer = () => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState('off'); // 'off', 'queue', 'track'
  const [volume, setVolume] = useState(1);
  const [error, setError] = useState(null);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [lyrics, setLyrics] = useState(null);
  const audioRef = useRef(null);
  const intervalRef = useRef(null);

  // Play next track
  const playNext = useCallback(() => {
    if (queue.length === 0) return;

    let nextIndex;
    if (shuffle) {
      nextIndex = Math.floor(Math.random() * queue.length);
    } else {
      nextIndex = currentIndex + 1;
      if (nextIndex >= queue.length) {
        if (repeat === "queue") {
          nextIndex = 0;
        } else {
          setIsPlaying(false);
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
          return;
        }
      }
    }

    playTrack(queue[nextIndex], queue, nextIndex);
  }, [queue, currentIndex, shuffle, repeat]);

  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    const audio = audioRef.current;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
    };

    const updateDuration = () => {
      setDuration(audio.duration || 0);
    };

    const handleEnded = () => {
      if (repeat === "track") {
        audio.currentTime = 0;
        audio.play();
      } else {
        playNext();
      }
    };

    const handleError = () => {
      toast.error("Failed to load track");
      setIsPlaying(false);
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [repeat, playNext]);

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  // Play track
const playTrack = useCallback(async (track, trackQueue = [], index = 0, isAuthenticated = false) => {
    try {
      setCurrentTrack(track);
      setQueue(trackQueue.length > 0 ? trackQueue : [track]);
      setCurrentIndex(index);
      
      // Clear previous lyrics
      setLyrics(null);
      
      // Add to recently played
      try {
        await recentlyPlayedService.addTrack(track);
        const recent = await recentlyPlayedService.getRecent();
        setRecentlyPlayed(recent);
      } catch (error) {
        console.error("Failed to update recently played:", error);
      }
      
      if (audioRef.current) {
        audioRef.current.src = track.audioUrl || "";
        audioRef.current.currentTime = 0;
        setCurrentTime(0);
        
        // Simulate loading/playing since we don't have real audio files
        setIsPlaying(true);
        
        // Show different messages based on authentication status
        if (isAuthenticated) {
          toast.success(`Now playing: ${track.title}`);
        } else {
          toast.info(`Preview: ${track.title} (50 second preview)`);
        }
        
        // Simulate progress for demo purposes
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        
        const maxDuration = isAuthenticated ? track.duration : Math.min(50, track.duration);
        
        intervalRef.current = setInterval(() => {
          setCurrentTime(prev => {
            const newTime = prev + 1;
            if (newTime >= maxDuration) {
              clearInterval(intervalRef.current);
              
              if (!isAuthenticated && newTime >= 50) {
                // Preview ended
                setIsPlaying(false);
                toast.warning("Preview ended. Sign up for full access!");
                return 50;
              }
              
              if (repeat === "track") {
                setCurrentTime(0);
                return 0;
              } else {
                playNext();
                return maxDuration;
              }
            }
            return newTime;
          });
        }, 1000);
        
        setDuration(maxDuration);
      }
    } catch (error) {
      toast.error("Failed to play track");
      console.error("Play error:", error);
    }
  }, [repeat, playNext]);

  // Toggle play/pause
  const togglePlayPause = useCallback(() => {
    if (!currentTrack) return;

    if (isPlaying) {
      setIsPlaying(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    } else {
      setIsPlaying(true);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      intervalRef.current = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 1;
          if (newTime >= duration) {
            clearInterval(intervalRef.current);
            if (repeat === "track") {
              setCurrentTime(0);
              return 0;
            } else {
              playNext();
              return duration;
            }
          }
          return newTime;
        });
      }, 1000);
    }
  }, [currentTrack, isPlaying, duration, repeat, playNext]);

  // Play previous track
  const playPrevious = useCallback(() => {
    if (queue.length === 0) return;

    if (currentTime > 3) {
      // If more than 3 seconds played, restart current track
      setCurrentTime(0);
      return;
    }

    let prevIndex;
    if (shuffle) {
      prevIndex = Math.floor(Math.random() * queue.length);
    } else {
      prevIndex = currentIndex - 1;
      if (prevIndex < 0) {
        prevIndex = repeat === "queue" ? queue.length - 1 : 0;
      }
    }

    playTrack(queue[prevIndex], queue, prevIndex);
  }, [queue, currentIndex, currentTime, shuffle, repeat, playTrack]);

  // Seek to position
  const seekTo = useCallback((time) => {
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  }, []);

  // Add track to queue
  const addToQueue = useCallback((track) => {
    setQueue(prev => {
      const isAlreadyInQueue = prev.some(t => t.Id === track.Id);
      if (isAlreadyInQueue) {
        toast.info(`"${track.title}" is already in queue`, {
          position: "bottom-right",
          autoClose: 2000,
        });
        return prev;
      }
      
      toast.success(`Added "${track.title}" to queue`, {
        position: "bottom-right",
        autoClose: 2000,
      });
      
      return [...prev, track];
    });
  }, []);

// Get lyrics for current track
  const getLyrics = useCallback(async (trackId) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const trackLyrics = mockLyrics[trackId];
      if (trackLyrics) {
        setLyrics(trackLyrics);
        toast.success("Lyrics loaded");
      } else {
        setLyrics({
          title: currentTrack?.title || "Unknown",
          artist: currentTrack?.artist || "Unknown Artist",
          lines: [{ time: 0, text: "Lyrics not available for this track" }]
        });
        toast.info("Lyrics not available for this track");
      }
    } catch (error) {
      console.error("Error loading lyrics:", error);
      toast.error("Failed to load lyrics");
    }
  }, [currentTrack]);

  // Toggle shuffle
  const toggleShuffle = useCallback(() => {
    setShuffle(prev => {
      const newShuffle = !prev;
      toast.success(newShuffle ? "Shuffle on" : "Shuffle off");
      return newShuffle;
    });
  }, []);

  // Toggle repeat mode
  const toggleRepeat = useCallback(() => {
    setRepeat(prev => {
      const modes = ['off', 'queue', 'track'];
      const currentIndex = modes.indexOf(prev);
      const nextMode = modes[(currentIndex + 1) % modes.length];
      
      const modeLabels = {
        off: "Repeat off",
        queue: "Repeat queue",
        track: "Repeat track"
      };
      toast.success(modeLabels[nextMode]);
      return nextMode;
    });
  }, []);

  // Load recently played on mount
  useEffect(() => {
    const loadRecentlyPlayed = async () => {
      try {
        const recent = await recentlyPlayedService.getRecent();
        setRecentlyPlayed(recent);
      } catch (error) {
        console.error("Failed to load recently played:", error);
      }
    };
    loadRecentlyPlayed();
  }, []);

  return {
// State
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    queue,
    shuffle,
    repeat,
    lyrics,
    error,
    recentlyPlayed,
    
    // Actions
    playTrack,
    togglePlayPause,
    playNext,
    playPrevious,
    seekTo,
    setVolume,
    addToQueue,
    toggleShuffle,
    toggleRepeat,
    getLyrics
  };
};

export default usePlayer;