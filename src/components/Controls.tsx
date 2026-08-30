/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Volume2, VolumeX, RotateCcw } from 'lucide-react';
import { bloomAudio } from '../utils/audio';

interface ControlsProps {
  isMuted: boolean;
  onToggleSound: () => void;
  firefliesEnabled: boolean;
  onToggleFireflies: () => void;
  butterfliesEnabled: boolean;
  onToggleButterflies: () => void;
  onReplay: () => void;
  isBlooming: boolean;
}

export const Controls: React.FC<ControlsProps> = ({
  isMuted,
  onToggleSound,
  firefliesEnabled,
  onToggleFireflies,
  butterfliesEnabled,
  onToggleButterflies,
  onReplay,
  isBlooming,
}) => {
  return (
    <header className="absolute top-2.5 sm:top-4 left-0 right-0 z-40 px-3 sm:px-6 flex items-center justify-between pointer-events-none">
      {/* Title / Brand */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 backdrop-blur-md bg-[#120721]/70 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full border border-pink-500/25 shadow-lg pointer-events-auto">
        <span className="text-base sm:text-lg">🌸</span>
        <h1 className="font-serif-romance text-xs sm:text-base font-semibold tracking-wide text-pink-100">
          Enchanted Bloom
        </h1>
      </div>

      {/* Control Action Buttons */}
      <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
        {/* Replay Bloom Animation */}
        <button
          id="replay-bloom-btn"
          onClick={() => {
            bloomAudio.playSparkleSound();
            onReplay();
          }}
          disabled={isBlooming}
          className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-medium backdrop-blur-md border transition-all duration-300 cursor-pointer ${
            isBlooming
              ? 'bg-pink-900/30 text-pink-400/50 border-pink-500/10 cursor-not-allowed'
              : 'bg-[#120721]/70 hover:bg-pink-600/40 text-pink-200 border-pink-500/30 hover:border-pink-400/60 shadow-md hover:scale-105 active:scale-95'
          }`}
          title="Replay Blooming Sequence"
        >
          <RotateCcw className={`w-3 sm:w-3.5 h-3 sm:h-3.5 ${isBlooming ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Bloom Again</span>
        </button>

        {/* Audio Toggle */}
        <button
          id="sound-toggle-btn"
          onClick={onToggleSound}
          className={`p-1.5 sm:p-2 rounded-full backdrop-blur-md border transition-all duration-200 cursor-pointer shadow-md hover:scale-105 active:scale-95 ${
            !isMuted
              ? 'bg-pink-600/50 text-pink-100 border-pink-400/60 shadow-[0_0_12px_rgba(244,114,182,0.4)]'
              : 'bg-[#120721]/70 text-pink-300/70 border-pink-500/20 hover:text-pink-100'
          }`}
          title={isMuted ? 'Turn Sound On (Bloom Chimes)' : 'Mute Bloom Chimes'}
        >
          {isMuted ? <VolumeX className="w-3.5 sm:w-4 h-3.5 sm:h-4" /> : <Volume2 className="w-3.5 sm:w-4 h-3.5 sm:h-4" />}
        </button>

        {/* Fireflies / Sparkles Toggle */}
        <button
          id="fireflies-toggle-btn"
          onClick={onToggleFireflies}
          className={`p-1.5 sm:p-2 rounded-full backdrop-blur-md border transition-all duration-200 cursor-pointer shadow-md hover:scale-105 active:scale-95 ${
            firefliesEnabled
              ? 'bg-pink-600/50 text-pink-100 border-pink-400/60 shadow-[0_0_12px_rgba(244,114,182,0.4)]'
              : 'bg-[#120721]/70 text-pink-300/70 border-pink-500/20 hover:text-pink-100'
          }`}
          title={firefliesEnabled ? 'Hide Glowing Fireflies' : 'Show Glowing Fireflies'}
        >
          <span className="text-xs sm:text-sm">✨</span>
        </button>

        {/* Butterflies Toggle */}
        <button
          id="butterflies-toggle-btn"
          onClick={onToggleButterflies}
          className={`p-1.5 sm:p-2 rounded-full backdrop-blur-md border transition-all duration-200 cursor-pointer shadow-md hover:scale-105 active:scale-95 ${
            butterfliesEnabled
              ? 'bg-pink-600/50 text-pink-100 border-pink-400/60 shadow-[0_0_12px_rgba(244,114,182,0.4)]'
              : 'bg-[#120721]/70 text-pink-300/70 border-pink-500/20 hover:text-pink-100'
          }`}
          title={butterfliesEnabled ? 'Hide Butterflies' : 'Show Butterflies'}
        >
          <span className="text-xs sm:text-sm">🦋</span>
        </button>
      </div>
    </header>
  );
};
