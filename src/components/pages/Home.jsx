import React from "react";
import RecentlyPlayed from "@/components/organisms/RecentlyPlayed";
import FeaturedSection from "@/components/organisms/FeaturedSection";

const Home = ({ onPlayTrack }) => {
  return (
    <div className="p-6 pb-32">
      {/* Hero Section */}
      <section className="mb-12">
        <div className="bg-gradient-to-br from-secondary/20 to-primary/20 rounded-xl p-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Welcome to Pulse Music
          </h1>
          <p className="text-xl text-gray-light mb-6">
            Discover your next favorite song from millions of tracks
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-primary hover:bg-green-400 text-black font-semibold px-8 py-3 rounded-full transition-all duration-200 hover:shadow-glow-green hover:scale-105">
              Start Listening
            </button>
            <button className="bg-transparent border border-white text-white hover:bg-white hover:text-black font-semibold px-8 py-3 rounded-full transition-all duration-200 hover:scale-105">
              Browse Music
            </button>
          </div>
        </div>
      </section>

{/* Featured Playlists */}
      <FeaturedSection onPlayPlaylist={onPlayTrack} />

      {/* Recently Played */}
      <RecentlyPlayed onPlayTrack={onPlayTrack} />

      {/* Popular Albums */}
      <section className="mb-12">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">Made for You</h2>
          <p className="text-gray-light">Your personal mixes updated daily</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="group bg-surface p-4 rounded-lg hover:bg-gray-dark cursor-pointer transition-all duration-300">
              <div className="aspect-square rounded-lg bg-gradient-to-br from-primary/30 to-secondary/30 mb-4 flex items-center justify-center">
                <span className="text-white font-bold text-lg">Mix {index + 1}</span>
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-white truncate">Daily Mix {index + 1}</h3>
                <p className="text-gray-light text-sm truncate">Made for you</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;