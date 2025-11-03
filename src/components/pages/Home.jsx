import React from "react";
import Recommendations from "@/components/organisms/Recommendations";
import RecentlyPlayed from "@/components/organisms/RecentlyPlayed";
import FeaturedSection from "@/components/organisms/FeaturedSection";

const Home = ({ onPlayTrack, onLikeTrack, onAddToQueue, isAuthenticated }) => {
  return (
<div className="p-6 pb-32 space-y-8">
      <RecentlyPlayed onPlayTrack={onPlayTrack} isAuthenticated={isAuthenticated} />
      <FeaturedSection onPlayTrack={onPlayTrack} isAuthenticated={isAuthenticated} />
      {isAuthenticated && (
        <Recommendations 
          onPlayTrack={onPlayTrack} 
          onLikeTrack={onLikeTrack}
          onAddToQueue={onAddToQueue}
          isAuthenticated={isAuthenticated} 
        />
      )}
    </div>
  );
};

export default Home;