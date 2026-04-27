/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { Activity, Shield, Zap, Terminal } from 'lucide-react';

export default function App() {
  const [currentScore, setCurrentScore] = useState(0);

  return (
    <div className="h-screen bg-black text-neon-cyan flex flex-col font-sans overflow-hidden select-none">
      {/* Background Ambience / Static Overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-5">
        <div className="absolute inset-0 bg-[url('https://media.giphy.com/media/oEI9uWU0m6VfQNoi1T/giphy.gif')] mix-blend-screen" />
      </div>

      {/* Top HUD / Navigation */}
      <nav className="h-20 border-b-4 border-neon-cyan/20 flex items-center justify-between px-12 bg-black z-10 shrink-0 relative overflow-hidden">
        <div className="absolute inset-0 scanline opacity-5" />
        
        <div className="flex items-center gap-6">
          <div className="w-10 h-10 bg-neon-magenta shadow-[0_0_20px_#ff00ff] flex items-center justify-center">
             <Terminal size={24} className="text-black" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic glitch">
            SYNTH<span className="text-neon-magenta">_SNAKE</span>
            <span className="text-xs not-italic text-neon-magenta/60 font-mono tracking-widest ml-4">V_3.0.1</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-12 text-sm font-mono tracking-[0.3em] uppercase">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-neon-magenta animate-ping" />
            <span className="glitch">LINK::ACTIVE</span>
          </div>
          <div className="hidden lg:block text-neon-magenta/50">ENCODING::RAW</div>
          <div className="border-2 border-neon-cyan px-6 py-2 bg-neon-cyan/5 shadow-[0_0_20px_rgba(0,255,255,0.1)]">
            DATA_COUNT::{currentScore.toString().padStart(6, '0')}
          </div>
        </div>
      </nav>

      {/* Main Content Grid */}
      <div className="flex-1 grid grid-cols-12 gap-0 overflow-hidden relative z-10">
        
        {/* Sidebar: System Logs / Nodes */}
        <aside className="hidden lg:flex col-span-3 border-r-4 border-neon-cyan/10 bg-black/40 p-10 flex-col overflow-y-auto">
          <h2 className="text-sm font-bold text-neon-magenta uppercase tracking-[0.5em] mb-10 glitch">NETWORK::INFRA</h2>
          
          <div className="space-y-8 flex-1">
            {[
              { id: "NODE_ALPHA", stat: "SYNCHRONIZED", color: "neon-cyan" },
              { id: "NODE_GAMMA", stat: "CORRUPTED", color: "neon-magenta" },
              { id: "NODE_EPSILON", stat: "WAITING", color: "gray-500" }
            ].map((node, i) => (
              <div key={i} className={`p-6 border-2 border-${node.color}/20 flex items-center gap-6 group hover:border-${node.color}/60 transition-all cursor-crosshair`}>
                <div className={`w-3 h-12 bg-${node.color} opacity-40 group-hover:opacity-100 transition-opacity`} />
                <div>
                  <div className="text-lg font-black tracking-widest">{node.id}</div>
                  <div className={`text-[10px] text-${node.color} uppercase tracking-[0.2em] font-bold`}>{node.stat}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 border-t-2 border-white/5 pt-8">
             <div className="text-[10px] text-white/20 uppercase font-black mb-6 tracking-[0.4em]">LOGS::TERMINAL</div>
             <div className="font-mono text-xs text-neon-cyan/40 space-y-2">
                <p className="glitch">{'>'} INIT::BUFFER_LIMIT: 4096KB</p>
                <p>{'>'} STREAM::SYNTH_WAVE_DIRECTIVE</p>
                <p className="text-neon-magenta/50">{'>'} WARN::PACKET_LOSS_STABILIZED</p>
                <p className="animate-pulse">{'>'} LISTENING::SOCKET_443_</p>
             </div>
          </div>
        </aside>

        {/* Center: Main Game Stage */}
        <main className="col-span-12 lg:col-span-6 bg-[#050505] flex flex-col items-center justify-center relative p-12 overflow-hidden shadow-[inset_0_0_100px_rgba(0,0,0,1)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,255,0.05),transparent_70%)]" />
          <SnakeGame onScoreUpdate={setCurrentScore} />
        </main>

        {/* Right Panel: Audio Deck */}
        <aside className="hidden lg:flex col-span-3 border-l-4 border-neon-cyan/10 bg-black/40 p-0 flex-col overflow-y-auto">
          <div className="flex-1 p-10">
            <MusicPlayer />
          </div>

          <div className="m-10 bg-black border-2 border-neon-magenta/20 p-8 shadow-[inset_0_0_30px_rgba(255,0,255,0.05)]">
            <h4 className="text-[10px] font-black text-neon-magenta uppercase tracking-[0.5em] mb-6">GLOBAL_SYNC</h4>
            <div className="space-y-4">
              {[
                { n: "U_X0", s: "4820", c: "neon-cyan" },
                { n: "U_K2", s: "3910", c: "neon-magenta" },
                { n: "U_M4", s: "2100", c: "gray-700" }
              ].map((user, i) => (
                <div key={i} className="flex justify-between items-center font-mono text-xs border-b border-white/5 pb-2">
                   <span className="tracking-tighter opacity-40">{user.n}</span>
                   <span className={`text-${user.c} font-black tracking-widest`}>{user.s}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* Bottom Interface Bar */}
      <footer className="h-12 border-t-4 border-neon-cyan/20 bg-black flex items-center justify-between px-12 text-xs font-mono uppercase tracking-[0.4em] text-neon-cyan/40 shrink-0 relative overflow-hidden">
        <div className="absolute inset-0 scanline opacity-5" />
        <div className="flex gap-12 relative">
          <span className="glitch">PROC::RUNTIME_0X004</span>
          <span className="hidden md:inline">BANDWIDTH::MAX</span>
        </div>
        <div className="flex gap-12 relative">
          <span className="text-neon-magenta">FPS::60.00</span>
          <span className="animate-pulse">LATENCY::12MS</span>
        </div>
      </footer>
    </div>
  );
}

