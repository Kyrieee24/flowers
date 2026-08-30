/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useRef } from 'react';
import { FLOWERS_DATA, BACKGROUND_FOLIAGE } from '../data/flowersData';
import { FlowerHead } from './FlowerHead';
import { bloomAudio } from '../utils/audio';

interface FlowerBouquetProps {
  animKey: number; // key to restart animation
  onCompleteBloom?: () => void;
  onFlowerClick?: (flowerId: number, e: React.MouseEvent) => void;
}

export const FlowerBouquet: React.FC<FlowerBouquetProps> = ({
  animKey,
  onCompleteBloom,
  onFlowerClick,
}) => {
  const [bloomedFlowers, setBloomedFlowers] = useState<number[]>([]);
  const [allBloomed, setAllBloomed] = useState<boolean>(false);
  const audioTimersRef = useRef<NodeJS.Timeout[]>([]);

  // Setup blooming timeline and audio synchronization
  useEffect(() => {
    setBloomedFlowers([]);
    setAllBloomed(false);
    audioTimersRef.current.forEach(clearTimeout);
    audioTimersRef.current = [];

    // Schedule blooming state for each flower
    FLOWERS_DATA.forEach((flower) => {
      const timer = setTimeout(() => {
        setBloomedFlowers((prev) => [...prev, flower.id]);
        bloomAudio.playBloomSound(flower.id);
      }, flower.bloomDelay * 1000);
      audioTimersRef.current.push(timer);
    });

    // Schedule completed bouquet state
    const maxBloomTime = Math.max(
      ...FLOWERS_DATA.map((f) => f.bloomDelay + f.bloomDuration)
    );

    const completeTimer = setTimeout(() => {
      setAllBloomed(true);
      if (onCompleteBloom) {
        onCompleteBloom();
      }
    }, maxBloomTime * 1000);

    audioTimersRef.current.push(completeTimer);

    return () => {
      audioTimersRef.current.forEach(clearTimeout);
    };
  }, [animKey, onCompleteBloom]);

  return (
    <div className="relative w-full max-w-[560px] aspect-[1/1] sm:max-w-[620px] flex items-center justify-center select-none pointer-events-auto">

      {/* Ambient Pink Aura Glow behind the completed bouquet */}
      <div
        className={`bouquet-ambient-aura absolute w-[360px] h-[360px] sm:w-[440px] sm:h-[440px] rounded-full pointer-events-none -z-10 transition-opacity duration-1000 ${
          allBloomed ? 'active opacity-90' : 'opacity-0'
        }`}
        style={{
          background: 'radial-gradient(circle, rgba(244, 114, 182, 0.35) 0%, rgba(219, 39, 119, 0.18) 40%, rgba(147, 51, 234, 0.05) 70%, transparent 100%)',
          top: '25%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* Swaying container for the entire bouquet */}
      <div className={`relative w-full h-full ${allBloomed ? 'bouquet-master-sway' : ''}`}>

        {/* SVG layer for Stems and Leaves */}
        <svg
          viewBox="0 0 600 600"
          className="absolute inset-0 w-full h-full overflow-visible pointer-events-none"
        >
          <defs>
            {/* Linear gradient for stems */}
            <linearGradient id="stemGrad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#1e3a12" />
              <stop offset="40%" stopColor="#2d5a27" />
              <stop offset="85%" stopColor="#3f7528" />
              <stop offset="100%" stopColor="#528f32" />
            </linearGradient>

            {/* Leaf Gradient */}
            <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#5aa532" />
              <stop offset="50%" stopColor="#366b1e" />
              <stop offset="100%" stopColor="#1f4211" />
            </linearGradient>

            {/* Background Foliage Gradient */}
            <linearGradient id="foliageGrad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#162e0e" />
              <stop offset="100%" stopColor="#2b531a" />
            </linearGradient>

            {/* Filter for subtle leaf shadow */}
            <filter id="leafShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#080410" floodOpacity="0.4" />
            </filter>
          </defs>

          {/* 1. Background foliage sprigs */}
          {BACKGROUND_FOLIAGE.map((foliage) => (
            <g key={foliage.id} className="opacity-80">
              <path
                d={foliage.path}
                fill="none"
                stroke="url(#foliageGrad)"
                strokeWidth="3.5"
                strokeLinecap="round"
                className="stem-path"
                style={{ animationDelay: '0.4s' }}
              />
              {foliage.leaves.map((leaf, idx) => (
                <g
                  key={`${foliage.id}-leaf-${idx}`}
                  className="leaf-node"
                  style={{
                    transformOrigin: `${leaf.x}px ${leaf.y}px`,
                    animationDelay: `${leaf.delay}s`,
                    '--target-angle': `${leaf.angle}deg`,
                  } as React.CSSProperties}
                >
                  <path
                    d="M 0 0 C 12 -8, 24 -6, 32 0 C 24 6, 12 8, 0 0 Z"
                    fill="url(#leafGrad)"
                    transform={`translate(${leaf.x}, ${leaf.y}) scale(${leaf.scale})`}
                    filter="url(#leafShadow)"
                  />
                </g>
              ))}
            </g>
          ))}

          {/* 2. Main Flower Stems & Leaves */}
          {FLOWERS_DATA.map((flower) => {
            const isBloomed = bloomedFlowers.includes(flower.id);
            return (
              <g
                key={`stem-group-${flower.id}`}
                className={`swaying-stem ${isBloomed ? 'bloomed-sway' : ''}`}
                style={{
                  '--sway-time': `${flower.swayDuration}s`,
                  '--sway-delay': `${flower.swayDelay}s`,
                  '--sway-deg': `${flower.swayAngle}deg`,
                  '--base-rot': '0deg',
                } as React.CSSProperties}
              >
                {/* Curved Stem Path */}
                <path
                  d={flower.stemPath}
                  fill="none"
                  stroke="url(#stemGrad)"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  className="stem-path"
                  style={{ animationDelay: `${flower.stemDelay}s` }}
                />

                {/* Leaves along this stem */}
                {flower.leaves.map((leaf, leafIdx) => {
                  const leafX = flower.position.x + (300 - flower.position.x) * (1 - leaf.positionOnStem) + (leaf.side === 'left' ? -12 : 12);
                  const leafY = 560 - (560 - flower.position.y) * leaf.positionOnStem;

                  return (
                    <g
                      key={`flower-${flower.id}-leaf-${leafIdx}`}
                      className="leaf-node"
                      style={{
                        transformOrigin: `${leafX}px ${leafY}px`,
                        animationDelay: `${leaf.delay}s`,
                        '--target-angle': `${leaf.angle}deg`,
                      } as React.CSSProperties}
                    >
                      {/* Realistic leaf shape with center vein */}
                      <g transform={`translate(${leafX}, ${leafY}) scale(${leaf.scale})`}>
                        <path
                          d="M 0 0 C 18 -14, 38 -10, 48 0 C 38 10, 18 14, 0 0 Z"
                          fill="url(#leafGrad)"
                          filter="url(#leafShadow)"
                        />
                        {/* Leaf vein line */}
                        <path
                          d="M 0 0 C 15 -2, 32 -1, 44 0"
                          stroke="#72b842"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                          fill="none"
                          opacity="0.75"
                        />
                      </g>
                    </g>
                  );
                })}
              </g>
            );
          })}

          {/* 3. Base Stem Ribbon / Tie */}
          <g transform="translate(300, 560)">
            <ellipse cx="0" cy="0" rx="16" ry="6" fill="#1b3311" opacity="0.8" />
            {/* Satin Pink Ribbon Bow */}
            <path
              d="M -12 2 C -24 8, -26 -8, -10 -4 Z"
              fill="#ec4899"
              opacity="0.9"
              className="drop-shadow-md"
            />
            <path
              d="M 12 2 C 24 8, 26 -8, 10 -4 Z"
              fill="#ec4899"
              opacity="0.9"
              className="drop-shadow-md"
            />
            <circle cx="0" cy="0" r="4.5" fill="#db2777" />
            <path
              d="M -2 4 C -6 18, -12 24, -14 30"
              stroke="#f472b6"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 2 4 C 6 18, 12 24, 14 30"
              stroke="#f472b6"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        </svg>

        {/* 4. Flower Heads (Pure HTML/CSS Shapes) Layered on top of stems */}
        {FLOWERS_DATA.map((flower) => {
          const isBloomed = bloomedFlowers.includes(flower.id);
          return (
            <div
              key={`flower-head-wrapper-${flower.id}`}
              className="absolute pointer-events-none"
              style={{
                left: `${(flower.position.x / 600) * 100}%`,
                top: `${(flower.position.y / 600) * 100}%`,
                zIndex: 30 + flower.id,
              }}
            >
              <FlowerHead
                flower={flower}
                isBloomed={isBloomed}
                onFlowerClick={onFlowerClick}
              />
            </div>
          );
        })}

      </div>
    </div>
  );
};
