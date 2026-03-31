import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2 } from 'lucide-react';

const TRACKS = [
  { id: 1, title: "DATA.STREAM_01", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { id: 2, title: "CYBER.PULSE_02", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { id: 3, title: "SYNTH.ERR_03", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" }
];

export function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(e => console.error("Audio play failed:", e));
    }
  }, [currentTrackIndex, isPlaying]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.error("Audio play failed:", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const skipForward = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
  };

  const skipBack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
  };

  return (
    <div 
      className="bg-black border-4 border-[#00ffff] p-6 flex flex-col items-center justify-center gap-4 relative overflow-hidden font-[VT323]"
      style={{ width: 400, height: 400, boxShadow: '8px 8px 0px #ff00ff' }}
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-[#ff00ff] opacity-50 animate-pulse"></div>
      <h2 className="text-4xl font-bold text-[#ff00ff] uppercase tracking-widest mb-2 glitch-text" data-text="AUDIO.UPLINK">AUDIO.UPLINK</h2>
      
      <div className="text-center mb-4 border-b-2 border-[#00ffff] pb-4 w-full">
        <p className="text-3xl text-white font-semibold mb-2">{TRACKS[currentTrackIndex].title}</p>
        <p className="text-xl text-[#ff00ff]">SEQ: {currentTrackIndex + 1} / {TRACKS.length}</p>
      </div>

      <audio 
        ref={audioRef} 
        src={TRACKS[currentTrackIndex].url} 
        onEnded={skipForward}
      />

      <div className="flex items-center gap-8 mb-4">
        <button onClick={skipBack} className="text-[#ff00ff] hover:text-[#00ffff] hover:scale-110 transition-all">
          <SkipBack size={40} />
        </button>
        <button 
          onClick={togglePlay} 
          className="bg-transparent border-2 border-[#00ffff] text-[#00ffff] p-4 hover:bg-[#ff00ff] hover:text-black hover:border-[#ff00ff] transition-all"
          style={{ boxShadow: '4px 4px 0px #ff00ff' }}
        >
          {isPlaying ? <Pause size={40} /> : <Play size={40} className="ml-1" />}
        </button>
        <button onClick={skipForward} className="text-[#ff00ff] hover:text-[#00ffff] hover:scale-110 transition-all">
          <SkipForward size={40} />
        </button>
      </div>

      <div className="flex items-center gap-4 w-full px-4 mt-2 bg-[#050505] border border-[#ff00ff] p-2">
        <Volume2 size={24} className="text-[#00ffff]" />
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.01" 
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-full accent-[#00ffff]"
        />
      </div>
    </div>
  );
}
