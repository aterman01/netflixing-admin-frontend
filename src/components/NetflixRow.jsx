import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ExternalLink, QrCode } from 'lucide-react';
import { Link } from 'react-router-dom';
import QRCodeDisplay from './shared/QRCodeDisplay.jsx';

const AgentCard = ({ agent, index }) => {
  const [showQR, setShowQR] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      className="group relative min-w-[300px] h-[400px] rounded-lg overflow-hidden cursor-pointer"
    >
      <Link to={`/agent/${agent.id}`}>
        <div className="relative w-full h-full">
          {/* Agent Image */}
          <img
            src={agent.avatar_url || agent.profile_image || '/placeholder-avatar.png'}
            alt={agent.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />
          
          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-6 group-hover:translate-y-0 transition-transform duration-300">
            <h3 className="text-2xl font-bold mb-2 text-white">{agent.name}</h3>
            <p className="text-netflix-red font-semibold mb-2">{agent.specialty}</p>
            <p className="text-gray-300 text-sm mb-4 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {agent.description}
            </p>
            
            {/* Action Buttons */}
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button className="flex items-center gap-2 bg-netflix-red hover:bg-netflix-darkRed px-4 py-2 rounded-md text-sm font-semibold transition-colors">
                <ExternalLink className="w-4 h-4" />
                View Profile
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setShowQR(!showQR);
                }}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-md text-sm font-semibold transition-colors"
              >
                <QrCode className="w-4 h-4" />
                QR
              </button>
            </div>
          </div>
        </div>
      </Link>

      {/* QR Code Modal */}
      <AnimatePresence>
        {showQR && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              e.stopPropagation();
              setShowQR(false);
            }}
            className="absolute inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
            >
              <QRCodeDisplay
                url={`${window.location.origin}/agent/${agent.id}`}
                agent={agent}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const NetflixRow = ({ title, agents, direction = 'left' }) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const cardWidth = 300;
  const gap = 16;
  const visibleCards = Math.floor((window.innerWidth - 100) / (cardWidth + gap));
  const maxScroll = Math.max(0, (agents.length - visibleCards) * (cardWidth + gap));

  const scroll = (direction) => {
    const scrollAmount = (cardWidth + gap) * 2;
    if (direction === 'left') {
      setScrollPosition(Math.max(0, scrollPosition - scrollAmount));
    } else {
      setScrollPosition(Math.min(maxScroll, scrollPosition + scrollAmount));
    }
  };

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-4 px-12">{title}</h2>
      
      <div className="relative group">
        {/* Left Arrow */}
        {scrollPosition > 0 && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/80 p-3 rounded-r-lg opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
        )}

        {/* Cards Container */}
        <div className="overflow-hidden px-12">
          <motion.div
            animate={{ x: -scrollPosition }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="flex gap-4"
          >
            {agents.map((agent, index) => (
              <AgentCard key={agent.id} agent={agent} index={index} />
            ))}
          </motion.div>
        </div>

        {/* Right Arrow */}
        {scrollPosition < maxScroll && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/80 p-3 rounded-l-lg opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        )}
      </div>
    </div>
  );
};

export default NetflixRow;
