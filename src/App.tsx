/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback } from 'react';
import { FlowerBouquet } from './components/FlowerBouquet';
import { FirefliesCanvas } from './components/FirefliesCanvas';
import { Butterflies } from './components/Butterflies';
import { MessageCard } from './components/MessageCard';
import { Controls } from './components/Controls';
import { bloomAudio } from './utils/audio';

const DEFAULT_MESSAGE = "Always keep your heart full of hope and positive thoughts.\nNo matter the hardships and battles you are facing,\nnever forget how truly strong, radiant, and beautiful you are. 🌸✨";

export default function App() {
  const [animKey, setAnimKey] = useState(1);
  const [isBlooming, setIsBlooming] = useState(true);
  const [showMessage, setShowMessage] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [firefliesEnabled, setFirefliesEnabled] = useState(true);
  const [butterfliesEnabled, setButterfliesEnabled] = useState(true);
  const [interactiveHint, setInteractiveHint] = useState(true);

  // Handle replay animation sequence
  const handleReplay = useCallback(() => {
    setIsBlooming(true);
    setShowMessage(false);
    setAnimKey((prev) => prev + 1);
  }, []);

  // Called when all flowers have finished blooming + 1.0s delay before revealing message
  const handleCompleteBloom = useCallback(() => {
    setIsBlooming(false);
    // Graceful pause after final bloom before opening the glowing message
    setTimeout(() => {
      setShowMessage(true);
      bloomAudio.playChime(659.25, 0.14); // Soft celebratory chime
    }, 1000);
  }, []);

  // Toggle sound effects
  const handleToggleSound = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    bloomAudio.setMuted(nextMuted);
  };

  // Flower interaction pulse
  const handleFlowerClick = (_flowerId: number, _e: React.MouseEvent) => {
    setInteractiveHint(false);
  };

  return (
    <main
      id="blooming-app-container"
      className="relative w-screen h-screen min-h-[100dvh] overflow-hidden flex flex-col items-center justify-between bg-ambient-vignette select-none"
    >
      {/* 1. Interactive Fireflies & Stardust Canvas */}
      <FirefliesCanvas enabled={firefliesEnabled} intensity={1.1} />

      {/* 2. Floating Luminous 3D Fluttering Butterflies */}
      <Butterflies enabled={butterfliesEnabled} />

      {/* 3. Ambient Radial Lighting Layers */}
      <div className="absolute inset-0 pointer-events-none -z-20">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[550px] h-[350px] sm:h-[550px] bg-pink-900/15 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[380px] sm:w-[650px] h-[220px] sm:h-[320px] bg-purple-950/25 rounded-full blur-3xl" />
      </div>

      {/* 4. Top Floating Navigation & Controls */}
      <Controls
        isMuted={isMuted}
        onToggleSound={handleToggleSound}
        firefliesEnabled={firefliesEnabled}
        onToggleFireflies={() => setFirefliesEnabled((prev) => !prev)}
        butterfliesEnabled={butterfliesEnabled}
        onToggleButterflies={() => setButterfliesEnabled((prev) => !prev)}
        onReplay={handleReplay}
        isBlooming={isBlooming}
      />

      {/* 5. Center Stage: The Blooming Bouquet & Message Presentation */}
      <div className="relative flex-1 w-full max-w-4xl flex flex-col items-center justify-center pt-14 sm:pt-16 pb-2 px-3 sm:px-6 z-20 overflow-hidden">
        
        {/* Bouquet Wrapper */}
        <div className={`transition-all duration-700 ease-out flex items-center justify-center w-full ${
          showMessage ? 'scale-[0.82] sm:scale-100 -translate-y-3 sm:translate-y-0' : 'scale-100 translate-y-0'
        }`}>
          <FlowerBouquet
            key={animKey}
            animKey={animKey}
            onCompleteBloom={handleCompleteBloom}
            onFlowerClick={handleFlowerClick}
          />
        </div>

        {/* 6. Message Reveal Card (Pop pump right after flowers finish blooming) */}
        <div className="w-full flex justify-center -mt-6 sm:-mt-8 z-30 px-2">
          <MessageCard
            show={showMessage}
            messageText={DEFAULT_MESSAGE}
            onReplay={handleReplay}
          />
        </div>
      </div>

      {/* 7. Subtle Interactive Footnote */}
      <footer className="relative z-30 pb-2.5 sm:pb-3 px-3 text-center text-[10px] sm:text-xs text-pink-300/40 pointer-events-none">
        {interactiveHint && !showMessage && (
          <p className="animate-pulse tracking-wide">
            ✨ Tap flowers or butterflies · Scatter glowing stardust
          </p>
        )}
      </footer>
    </main>
  );
}
