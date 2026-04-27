import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music2, Disc } from 'lucide-react';

interface Track {
  id: number;
  title: string;
  artist: string;
  url: string;
  cover: string;
}

const tracks: Track[] = [
  {
    id: 1,
    title: "Neon Horizon",
    artist: "Synthwave AI",
    // These are reliable SoundHelix links for demo purposes
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&h=400&fit=crop"
  },
  {
    id: 2,
    title: "Cyber City Drift",
    artist: "Neural Beatz",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    cover: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=400&fit=crop"
  },
  {
    id: 3,
    title: "Midnight Matrix",
    artist: "Digital Ghost",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    cover: "https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?w=400&h=400&fit=crop"
  }
];

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const currentTrack = tracks[currentTrackIndex];

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      setProgress((current / duration) * 100);
    }
  };

  const handleEnded = () => {
    nextTrack();
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="w-full flex flex-col bg-black border-2 border-neon-cyan/20 p-8 shadow-[0_0_40px_rgba(0,255,255,0.05)] relative overflow-hidden group">
      <div className="absolute inset-x-0 top-0 h-1 bg-neon-cyan/10 animate-pulse" />
      
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />

      <div className="mb-0">
        <h2 className="text-xl font-black text-neon-cyan/50 uppercase tracking-[0.4em] mb-6 glitch">ARCHIVE::LOADED</h2>
        
        <div className="aspect-square w-full bg-black border-4 border-white/5 overflow-hidden relative group screen-tear">
          <img 
            src={currentTrack.cover} 
            alt={currentTrack.title} 
            className="w-full h-full object-cover grayscale brightness-75 contrast-125 transition-all duration-700"
            referrerPolicy="no-referrer"
            style={{ imageRendering: 'pixelated' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
          
          <div className="absolute bottom-8 left-8 right-8">
            <motion.div
              initial={false}
              animate={{ x: 0, opacity: 1 }}
              key={currentTrack.id}
              className="space-y-2"
            >
              <div className="text-4xl font-black italic uppercase tracking-tighter text-white glitch">{currentTrack.title}</div>
              <div className="text-base text-neon-magenta font-mono font-bold uppercase tracking-[0.3em]">{currentTrack.artist}</div>
            </motion.div>
          </div>

          <button 
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center bg-neon-cyan/10 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]"
          >
             <div className="w-24 h-24 bg-black border-4 border-neon-cyan flex items-center justify-center shadow-[0_0_30px_rgba(0,255,255,0.5)]">
                {isPlaying ? <Pause size={48} className="text-neon-cyan" /> : <Play size={48} className="ml-2 text-neon-cyan" />}
             </div>
          </button>
        </div>
      </div>

      <div className="mt-12 space-y-10">
        <div className="space-y-4">
          <div className="relative h-2 bg-white/10 overflow-hidden">
            <motion.div 
              className="absolute h-full bg-neon-magenta shadow-[0_0_15px_#ff00ff]"
              style={{ width: `${progress}%` }}
              transition={{ type: 'spring', bounce: 0, duration: 0.2 }}
            />
          </div>
          <div className="flex justify-between text-xs font-mono text-neon-magenta/60 uppercase tracking-[0.2em]">
            <span>0{Math.floor(audioRef.current?.currentTime || 0 / 60)}:{(Math.floor(audioRef.current?.currentTime || 0) % 60).toString().padStart(2, '0')}</span>
            <span>END::SIGNAL</span>
          </div>
        </div>

        <div className="flex items-center justify-around">
          <button 
            onClick={prevTrack}
            className="text-neon-cyan opacity-40 hover:opacity-100 transition-opacity active:scale-90"
          >
            <SkipBack size={48} fill="currentColor" />
          </button>
          
          <button 
            onClick={togglePlay}
            className="w-24 h-24 bg-neon-cyan text-black flex items-center justify-center hover:brightness-125 active:scale-95 transition-all shadow-[0_0_30px_rgba(0,255,255,0.4)]"
          >
            {isPlaying ? <Pause size={42} fill="currentColor" /> : <Play size={42} fill="currentColor" className="ml-2" />}
          </button>

          <button 
            onClick={nextTrack}
            className="text-neon-cyan opacity-40 hover:opacity-100 transition-opacity active:scale-90"
          >
            <SkipForward size={48} fill="currentColor" />
          </button>
        </div>
      </div>

      <div className="mt-10 flex items-end gap-1 h-16 opacity-30 px-4 group-hover:opacity-60 transition-opacity">
        {[...Array(24)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              height: isPlaying ? [10, 60, 20, 100, 30, 80, 15][i % 7] : 10 
            }}
            transition={{ 
              duration: 0.3 + (i * 0.04), 
              repeat: Infinity, 
              repeatType: "reverse" 
            }}
            className="flex-1 bg-neon-cyan/50 border-t-2 border-neon-cyan"
          />
        ))}
      </div>
    </div>
  );
};
