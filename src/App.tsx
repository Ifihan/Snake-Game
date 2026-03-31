import { MusicPlayer } from './components/MusicPlayer';
import { SnakeGame } from './components/SnakeGame';

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center py-12 px-4 relative font-[VT323]">
      <div className="scanline-overlay"></div>
      
      <header className="mb-12 text-center z-10 tear-effect">
        <h1 className="text-6xl md:text-8xl font-black text-[#00ffff] mb-2 glitch-text" data-text="SYS.FAV_SNAKE">
          SYS.FAV_SNAKE
        </h1>
        <p className="text-[#ff00ff] tracking-[0.3em] text-2xl bg-black px-4 py-1 inline-block border-2 border-[#00ffff]" style={{ boxShadow: '4px 4px 0px #ff00ff' }}>
          [ STATUS: ONLINE // GLITCH_ART_MODE ]
        </p>
      </header>

      <main className="w-full max-w-6xl flex flex-col lg:flex-row items-start justify-center gap-12 lg:gap-24 z-10">
        {/* Left side: Music Player */}
        <div className="w-full lg:w-auto flex flex-col items-center order-2 lg:order-1">
          <div className="w-full max-w-[400px] mb-4 px-2 flex justify-between invisible">
            <div className="text-xl font-bold">SPACER</div>
          </div>
          <MusicPlayer />
        </div>

        {/* Right/Center side: Snake Game */}
        <div className="w-full lg:w-auto flex justify-center order-1 lg:order-2">
          <SnakeGame />
        </div>
      </main>
    </div>
  );
}
