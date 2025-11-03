import React, { useState, useEffect } from "react";
import RecommendationCard from "@/components/molecules/RecommendationCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { tracksService } from "@/services/api/musicService";

const Recommendations = ({ onPlayTrack, onLikeTrack, onAddToQueue, isAuthenticated }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRecommendations = async () => {
    try {
      setError("");
      setLoading(true);
      const recs = await tracksService.getRecommendations(8);
      setRecommendations(recs);
    } catch (err) {
      setError("Failed to load recommendations");
      console.error("Error loading recommendations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecommendations();
  }, []);

  if (loading) {
    return (
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Recommended for You</h2>
        </div>
        <Loading type="grid" count={8} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-8">
        <Error 
          message={error}
          onRetry={loadRecommendations}
        />
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Recommended for You</h2>
          <p className="text-gray-light">Based on your listening history</p>
        </div>
        
        <Button
          variant="ghost"
          onClick={loadRecommendations}
          className="text-sm"
        >
          <ApperIcon name="RefreshCw" size={16} className="mr-2" />
          Refresh
        </Button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {recommendations.map((track) => (
          <RecommendationCard
            key={track.Id}
            track={track}
            onPlay={(track) => onPlayTrack(track, recommendations)}
            onLike={onLikeTrack}
            onAddToQueue={onAddToQueue}
          />
        ))}
      </div>
    </div>
  );
};

export default Recommendations;