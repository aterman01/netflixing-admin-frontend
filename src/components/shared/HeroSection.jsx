import { motion } from 'framer-motion';
import { Users, TrendingUp, CheckCircle } from 'lucide-react';

const HeroSection = ({ stats }) => {
  return (
    <div className="relative h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-netflix-black via-netflix-gray/50 to-netflix-black" />
      
      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-netflix-red to-orange-500 bg-clip-text text-transparent"
        >
          Netflixing
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-2xl md:text-3xl text-gray-300 mb-12"
        >
          Your AI-Powered Content Delivery Platform
        </motion.p>

        {/* Stats */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-8 text-left"
          >
            <div className="bg-netflix-gray/50 backdrop-blur-lg px-8 py-6 rounded-xl">
              <Users className="w-8 h-8 text-netflix-red mb-2" />
              <p className="text-4xl font-bold">{stats.totalAgents || 23}</p>
              <p className="text-gray-400">AI Agents</p>
            </div>

            <div className="bg-netflix-gray/50 backdrop-blur-lg px-8 py-6 rounded-xl">
              <TrendingUp className="w-8 h-8 text-netflix-red mb-2" />
              <p className="text-4xl font-bold">{stats.activeContent || 0}</p>
              <p className="text-gray-400">Active Content</p>
            </div>

            <div className="bg-netflix-gray/50 backdrop-blur-lg px-8 py-6 rounded-xl">
              <CheckCircle className="w-8 h-8 text-netflix-red mb-2" />
              <p className="text-4xl font-bold">{stats.approvedContent || 0}</p>
              <p className="text-gray-400">Approved</p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-netflix-black to-transparent" />
    </div>
  );
};

export default HeroSection;
