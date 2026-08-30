/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sparkles, RotateCcw, Heart } from 'lucide-react';

interface MessageCardProps {
  show: boolean;
  messageText: string;
  onReplay?: () => void;
}

export const MessageCard: React.FC<MessageCardProps> = ({
  show,
  messageText,
  onReplay,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [burstKey, setBurstKey] = useState(0);

  // Typewriter and pump celebration triggered when 'show' becomes true
  useEffect(() => {
    if (!show) {
      setDisplayedText('');
      setIsTyping(false);
      return;
    }

    setBurstKey((prev) => prev + 1);
    setIsTyping(true);
    let index = 0;
    const speed = 20; // Fast and fluid flow

    const interval = setInterval(() => {
      if (index <= messageText.length) {
        setDisplayedText(messageText.slice(0, index));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [show, messageText]);

  if (!show) return null;

  // Decorative floating heart burst positions
  const burstParticles = [
    { id: 1, tx: '-38px', ty: '-60px', rot: '-20deg', delay: '0s', emoji: '💖' },
    { id: 2, tx: '40px', ty: '-65px', rot: '18deg', delay: '0.1s', emoji: '✨' },
    { id: 3, tx: '-60px', ty: '-30px', rot: '-30deg', delay: '0.2s', emoji: '🌸' },
    { id: 4, tx: '65px', ty: '-35px', rot: '25deg', delay: '0.15s', emoji: '💕' },
    { id: 5, tx: '0px', ty: '-80px', rot: '0deg', delay: '0.05s', emoji: '🌟' },
    { id: 6, tx: '-25px', ty: '-45px', rot: '-12deg', delay: '0.25s', emoji: '🌺' },
  ];

  return (
    <div
      id="message-reveal-container"
      className="message-pump-entrance relative z-40 max-w-lg sm:max-w-xl w-full px-2 sm:px-4 text-center pointer-events-auto"
    >
      {/* Floating Celebration Burst Elements */}
      <div key={`burst-${burstKey}`} className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center">
        {burstParticles.map((p) => (
          <span
            key={p.id}
            className="floating-heart-burst absolute text-base sm:text-xl select-none"
            style={{
              '--tx': p.tx,
              '--ty': p.ty,
              '--rot': p.rot,
              animationDelay: p.delay,
            } as React.CSSProperties}
          >
            {p.emoji}
          </span>
        ))}
      </div>

      {/* Main Pumping Card */}
      <div className="heartbeat-pump relative p-4 sm:p-7 rounded-2xl sm:rounded-3xl backdrop-blur-2xl bg-[#140a24]/92 border border-pink-400/50 glowing-box-border text-center overflow-hidden shadow-2xl group transition-transform">

        {/* Ambient warm radiant light aura behind card */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 sm:w-64 h-48 sm:h-64 bg-gradient-to-b from-pink-500/30 via-rose-500/15 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Top Header Badge */}
        <div className="flex items-center justify-center gap-1.5 mb-2.5 sm:mb-3">
          <div className="flex items-center gap-1.5 px-3 py-0.5 sm:py-1 rounded-full bg-pink-500/20 border border-pink-400/40 shadow-inner">
            <Heart className="w-3.5 h-3.5 text-pink-300 fill-pink-400 animate-bounce" />
            <span className="text-[11px] sm:text-xs tracking-widest uppercase text-pink-100 font-semibold font-sans">
              Always Remember
            </span>
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
          </div>
        </div>

        {/* Message Content with Mobile Font Fit */}
        <div className="relative py-1.5 sm:py-2.5 px-1 sm:px-4">
          <p className="font-serif-romance text-base sm:text-2xl md:text-[1.7rem] leading-relaxed sm:leading-relaxed text-pink-50 font-normal tracking-wide whitespace-pre-line drop-shadow-md min-h-[4rem] sm:min-h-[5.5rem]">
            <span className="shimmer-text">{displayedText}</span>
            {isTyping && (
              <span className="inline-block w-1.5 sm:w-2 h-5 sm:h-7 ml-1 bg-pink-300 animate-pulse align-middle rounded-full shadow-[0_0_8px_#f472b6]" />
            )}
          </p>
        </div>

        {/* Bottom Action bar */}
        {onReplay && (
          <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3.5 border-t border-pink-500/25 flex items-center justify-center text-xs text-pink-200/90 font-medium">
            <button
              id="replay-bottom-btn"
              onClick={onReplay}
              className="flex items-center gap-1.5 px-4 py-1.5 sm:py-2 rounded-full bg-pink-600/30 hover:bg-pink-600/50 active:bg-pink-600/60 border border-pink-400/40 text-pink-100 hover:text-white transition-all shadow-sm hover:scale-105 active:scale-95 cursor-pointer font-sans text-xs sm:text-sm"
              title="Watch the enchanted flowers bloom again"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Bloom Again</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
