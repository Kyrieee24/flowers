/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FlowerData } from '../types';
import { bloomAudio } from '../utils/audio';

interface FlowerHeadProps {
  flower: FlowerData;
  isBloomed: boolean;
  onFlowerClick?: (flowerId: number, e: React.MouseEvent) => void;
}

// Rich, multi-hued realistic pink flower palettes
const PETAL_PALETTES = {
  rose: {
    outer: [
      'linear-gradient(135deg, #fff1f2 0%, #fbcfe8 35%, #f472b6 75%, #db2777 100%)',
      'linear-gradient(135deg, #fdf2f8 0%, #fed7aa 25%, #f472b6 65%, #e11d48 100%)',
      'linear-gradient(135deg, #fff1f5 0%, #fce7f3 40%, #fb7185 75%, #be185d 100%)',
    ],
    mid: [
      'linear-gradient(135deg, #fbcfe8 0%, #f472b6 45%, #ec4899 80%, #be185d 100%)',
      'linear-gradient(135deg, #fce7f3 0%, #fb7185 50%, #db2777 85%, #9d174d 100%)',
      'linear-gradient(135deg, #fed7aa 0%, #f472b6 45%, #e11d48 85%, #881337 100%)',
    ],
    inner: [
      'linear-gradient(135deg, #f472b6 0%, #db2777 50%, #be185d 100%)',
      'linear-gradient(135deg, #fb7185 0%, #e11d48 55%, #9f1239 100%)',
      'linear-gradient(135deg, #ec4899 0%, #be185d 50%, #831843 100%)',
    ],
    bud: 'linear-gradient(to top, #365314 0%, #fbcfe8 45%, #ec4899 80%, #be185d 100%)',
  },
  magenta: {
    outer: [
      'linear-gradient(135deg, #fdf4ff 0%, #f5d0fe 35%, #e879f9 70%, #c026d3 100%)',
      'linear-gradient(135deg, #fff1f2 0%, #fce7f3 35%, #f472b6 70%, #db2777 100%)',
      'linear-gradient(135deg, #fae8ff 0%, #fbcfe8 35%, #d946ef 70%, #a21caf 100%)',
    ],
    mid: [
      'linear-gradient(135deg, #f5d0fe 0%, #d946ef 45%, #c026d3 80%, #86198f 100%)',
      'linear-gradient(135deg, #fce7f3 0%, #ec4899 45%, #be185d 80%, #701a75 100%)',
      'linear-gradient(135deg, #fbcfe8 0%, #e879f9 50%, #c026d3 85%, #581c87 100%)',
    ],
    inner: [
      'linear-gradient(135deg, #d946ef 0%, #a21caf 55%, #701a75 100%)',
      'linear-gradient(135deg, #ec4899 0%, #be185d 55%, #831843 100%)',
      'linear-gradient(135deg, #c026d3 0%, #86198f 50%, #581c87 100%)',
    ],
    bud: 'linear-gradient(to top, #3f6212 0%, #f5d0fe 45%, #d946ef 80%, #86198f 100%)',
  },
  blush: {
    outer: [
      'linear-gradient(135deg, #ffffff 0%, #fff1f2 40%, #fbcfe8 75%, #f472b6 100%)',
      'linear-gradient(135deg, #fffbeb 0%, #ffe4e6 40%, #fda4af 75%, #fb7185 100%)',
      'linear-gradient(135deg, #fff1f2 0%, #fce7f3 40%, #fbcfe8 75%, #ec4899 100%)',
    ],
    mid: [
      'linear-gradient(135deg, #fbcfe8 0%, #f472b6 50%, #ec4899 85%, #db2777 100%)',
      'linear-gradient(135deg, #ffe4e6 0%, #fda4af 50%, #fb7185 85%, #e11d48 100%)',
      'linear-gradient(135deg, #fce7f3 0%, #f472b6 45%, #db2777 85%, #be185d 100%)',
    ],
    inner: [
      'linear-gradient(135deg, #f472b6 0%, #ec4899 50%, #db2777 100%)',
      'linear-gradient(135deg, #fda4af 0%, #fb7185 50%, #e11d48 100%)',
      'linear-gradient(135deg, #ec4899 0%, #db2777 50%, #be185d 100%)',
    ],
    bud: 'linear-gradient(to top, #365314 0%, #fff1f2 40%, #fbcfe8 70%, #ec4899 100%)',
  },
  'soft-pink': {
    outer: [
      'linear-gradient(135deg, #fdf2f8 0%, #fbcfe8 45%, #f472b6 80%, #db2777 100%)',
      'linear-gradient(135deg, #fff7ed 0%, #fce7f3 40%, #fb7185 75%, #e11d48 100%)',
      'linear-gradient(135deg, #fff1f5 0%, #fbcfe8 45%, #ec4899 80%, #be185d 100%)',
    ],
    mid: [
      'linear-gradient(135deg, #fce7f3 0%, #f472b6 50%, #db2777 85%, #be185d 100%)',
      'linear-gradient(135deg, #fbcfe8 0%, #fb7185 50%, #e11d48 85%, #9f1239 100%)',
      'linear-gradient(135deg, #fed7aa 0%, #f472b6 45%, #ec4899 85%, #be185d 100%)',
    ],
    inner: [
      'linear-gradient(135deg, #f472b6 0%, #db2777 55%, #be185d 100%)',
      'linear-gradient(135deg, #fb7185 0%, #e11d48 55%, #881337 100%)',
      'linear-gradient(135deg, #ec4899 0%, #be185d 55%, #9d174d 100%)',
    ],
    bud: 'linear-gradient(to top, #365314 0%, #fdf2f8 40%, #fbcfe8 70%, #db2777 100%)',
  },
  peony: {
    outer: [
      'linear-gradient(135deg, #fff1f2 0%, #fda4af 40%, #fb7185 75%, #f43f5e 100%)',
      'linear-gradient(135deg, #fff5f5 0%, #fed7aa 30%, #fda4af 65%, #e11d48 100%)',
      'linear-gradient(135deg, #fdf2f8 0%, #fbcfe8 35%, #fb7185 70%, #be123c 100%)',
    ],
    mid: [
      'linear-gradient(135deg, #fda4af 0%, #fb7185 45%, #f43f5e 80%, #e11d48 100%)',
      'linear-gradient(135deg, #fbcfe8 0%, #f472b6 45%, #e11d48 80%, #9f1239 100%)',
      'linear-gradient(135deg, #fed7aa 0%, #fda4af 45%, #e11d48 80%, #881337 100%)',
    ],
    inner: [
      'linear-gradient(135deg, #fb7185 0%, #f43f5e 50%, #e11d48 100%)',
      'linear-gradient(135deg, #f43f5e 0%, #e11d48 50%, #9f1239 100%)',
      'linear-gradient(135deg, #e11d48 0%, #be123c 50%, #881337 100%)',
    ],
    bud: 'linear-gradient(to top, #365314 0%, #ffe4e6 45%, #fda4af 75%, #e11d48 100%)',
  },
};

export const FlowerHead: React.FC<FlowerHeadProps> = ({
  flower,
  isBloomed,
  onFlowerClick,
}) => {
  const [isPulsing, setIsPulsing] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPulsing(true);
    bloomAudio.playBloomSound(flower.id);
    bloomAudio.playSparkleSound();
    if (onFlowerClick) {
      onFlowerClick(flower.id, e);
    }
    setTimeout(() => setIsPulsing(false), 650);
  };

  const palette = PETAL_PALETTES[flower.petalColorType] || PETAL_PALETTES.rose;

  // Helper to render petal rings with nuanced gradient variations per petal
  const renderPetalLayer = (
    count: number,
    layerIndex: 1 | 2 | 3,
    width: number,
    height: number,
    layerGradients: string[],
    offsetDeg: number = 0,
    distancePx: number = 0
  ) => {
    const angleStep = 360 / count;
    return (
      <div className={`petal-layer-${layerIndex} absolute inset-0 pointer-events-none`}>
        {Array.from({ length: count }).map((_, i) => {
          const angle = i * angleStep + offsetDeg;
          const petalDelay = flower.bloomDelay + 0.15 * layerIndex + i * 0.08;
          const gradient = layerGradients[i % layerGradients.length];

          return (
            <div
              key={`layer-${layerIndex}-petal-${i}`}
              className="petal group"
              style={
                {
                  width: `${width}px`,
                  height: `${height}px`,
                  background: gradient,
                  '--angle': `${angle}deg`,
                  '--dist': `${distancePx}px`,
                  animationDelay: `${petalDelay}s`,
                  animationDuration: `${flower.bloomDuration}s`,
                  zIndex: 20 - layerIndex * 4,
                } as React.CSSProperties
              }
            >
              {/* Petal Inner Texture & Light Sheen */}
              <div className="w-full h-full rounded-[inherit] opacity-35 bg-gradient-to-b from-white/35 via-transparent to-black/15 pointer-events-none" />
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div
      id={`flower-${flower.id}`}
      className={`flower-head-container absolute cursor-pointer select-none pointer-events-auto ${
        isBloomed ? 'bloomed' : ''
      } ${isPulsing ? 'flower-pulse-active' : ''}`}
      style={{
        left: '0px',
        top: '0px',
        transform: `translate(-50%, -50%) rotate(${flower.rotation}deg) scale(${flower.scale})`,
        zIndex: 30 + flower.id,
      }}
      onClick={handleClick}
      title="Click to blossom pulse"
    >
      {/* Container sizing box (90x90) */}
      <div className="relative w-[90px] h-[90px] flex items-center justify-center pointer-events-auto">

        {/* 1. Green Sepals / Calyx Base */}
        <div className="absolute bottom-6 w-8 h-8 pointer-events-none z-10 flex items-center justify-center">
          <div
            className="sepal-leaf sepal-leaf-left absolute w-3.5 h-6 rounded-full bg-gradient-to-t from-[#224016] to-[#4d7c0f] shadow-sm"
            style={{ left: '3px', bottom: '0' }}
          />
          <div
            className="sepal-leaf sepal-leaf-right absolute w-3.5 h-6 rounded-full bg-gradient-to-t from-[#224016] to-[#4d7c0f] shadow-sm"
            style={{ right: '3px', bottom: '0' }}
          />
          <div
            className="sepal-leaf sepal-leaf-center absolute w-3 h-5 rounded-full bg-gradient-to-t from-[#1b3311] to-[#365314]"
            style={{ bottom: '2px' }}
          />
        </div>

        {/* 2. Closed Bud (visible before and fading as petals open) */}
        <div
          className="bud-core absolute w-6 h-8 rounded-full shadow-md z-25 flex items-center justify-center pointer-events-none"
          style={{
            background: palette.bud,
            bottom: '24px',
          }}
        >
          <div className="w-2.5 h-5 rounded-full bg-gradient-to-t from-pink-500 to-pink-300 opacity-90" />
        </div>

        {/* 3. Layer 1: Outer Petals (Soft translucent blush, warm rose undertones) */}
        {renderPetalLayer(
          flower.petalsPerLayer[0] || 6,
          1,
          44,
          56,
          palette.outer,
          0,
          -12
        )}

        {/* 4. Layer 2: Middle Petals (Vibrant rose, raspberry & magenta undertones) */}
        {renderPetalLayer(
          flower.petalsPerLayer[1] || 5,
          2,
          36,
          48,
          palette.mid,
          24,
          -8
        )}

        {/* 5. Layer 3: Inner Petals (Deep ruby magenta & velvety rose core) */}
        {renderPetalLayer(
          flower.petalsPerLayer[2] || 4,
          3,
          28,
          40,
          palette.inner,
          45,
          -4
        )}

        {/* 6. Glowing Golden Pistil / Stamens Center */}
        <div
          className="flower-core-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
        >
          {/* Glowing center orb */}
          <div className="relative w-7 h-7 rounded-full bg-gradient-to-tr from-[#f59e0b] via-[#fbbf24] to-[#fef08a] shadow-[0_0_15px_#fbbf24] flex items-center justify-center">
            {/* Stamens dots */}
            {[0, 60, 120, 180, 240, 300].map((deg) => (
              <div
                key={`stamen-${deg}`}
                className="stamen-dot absolute w-1.5 h-1.5 rounded-full bg-[#fef08a] shadow-[0_0_6px_#fef08a]"
                style={{
                  transform: `rotate(${deg}deg) translateY(-8px)`,
                }}
              />
            ))}
            <div className="w-2.5 h-2.5 rounded-full bg-white/90 shadow-[0_0_8px_#ffffff]" />
          </div>
        </div>

      </div>
    </div>
  );
};
