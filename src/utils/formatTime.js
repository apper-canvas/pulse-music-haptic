export const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return "0:00";
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const formatDuration = (totalSeconds) => {
  if (!totalSeconds || isNaN(totalSeconds)) return "0 min";
  
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours} hr ${minutes} min`;
  }
  
  return `${minutes} min`;
};