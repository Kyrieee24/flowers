/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BUTTERFLIES_DATA } from '../data/flowersData';
import { ButterflyData } from '../types';
import { bloomAudio } from '../utils/audio';

interface ButterfliesProps {
  enabled: boolean;
}

export const Butterflies: React.FC<ButterfliesProps> = ({ enabled }) => {
  const [scaredId, setScaredId] = useState<number | null>(null);

  if (!enabled) return null;

  const handleButterflyClick = (b: ButterflyData, e: React.MouseEvent) => {
    e.stopPropagation();
    setScaredId(b.id);
    bloomAudio.playSparkleSound();
    setTimeout(() => setScaredId(null), 1200);
  };

  const getWingGradients = (color: ButterflyData['wingColor']) => {
    switch (color) {
      case 'violet-glow':
        return {
          top: 'linear-gradient(135deg, #fdf4ff 0%, #d946ef 45%, #86198f 90%)',
          bottom: 'linear-gradient(135deg, #e879f9 0%, #a21caf 60%, #4c1d95 100%)',
          glow: 'rgba(217, 70, 239, 0.7)',
          core: '#fdf4ff',
        };
      case 'neon-pink':
        return {
          top: 'linear-gradient(135deg, #fff1f2 0%, #f43f5e 45%, #be123c 90%)',
          bottom: 'linear-gradient(135deg, #fb7185 0%, #e11d48 60%, #881337 100%)',
          glow: 'rgba(244, 63, 94, 0.7)',
          core: '#ffffff',
        };
      case 'sunset-blush':
        return {
          top: 'linear-gradient(135deg, #fef08a 0%, #f472b6 45%, #db2777 90%)',
          bottom: 'linear-gradient(135deg, #fb923c 0%, #ec4899 60%, #9d174d 100%)',
          glow: 'rgba(251, 146, 60, 0.7)',
          core: '#fef08a',
        };
      case 'rose-gold':
      default:
        return {
          top: 'linear-gradient(135deg, #ffffff 0%, #fbcfe8 35%, #ec4899 75%, #be185d 100%)',
          bottom: 'linear-gradient(135deg, #fce7f3 0%, #f472b6 50%, #db2777 90%)',
          glow: 'rgba(244, 114, 182, 0.75)',
          core: '#ffffff',
        };
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-35 overflow-hidden">
      {BUTTERFLIES_DATA.map((b) => {
        const colors = getWingGradients(b.wingColor);
        const isScared = scaredId === b.id;

        return (
          <div
            key={`butterfly-${b.id}`}
            id={`butterfly-${b.id}`}
            className={`absolute ${b.flightPathClass} pointer-events-auto cursor-pointer select-none transition-transform duration-500`}
            style={{
              left: `${b.baseX}%`,
              top: `${b.baseY}%`,
              animationDuration: `${b.flightDuration}s`,
              animationDelay: `${b.flutterDelay}s`,
              transform: isScared ? 'scale(1.4) translateY(-30px)' : undefined,
            }}
            onClick={(e) => handleButterflyClick(b, e)}
            title={`${b.name} (Click to flutter!)`}
          >
            {/* Butterfly Body and Wing Pair */}
            <div
              className="relative flex items-center justify-center filter drop-shadow-md"
              style={{
                width: `${b.size}px`,
                height: `${b.size}px`,
                filter: `drop-shadow(0 0 10px ${colors.glow})`,
              }}
            >
              {/* Left Wing (3D Flapping) */}
              <div
                className="butterfly-wing-left absolute right-1/2 origin-right flex flex-col items-end"
                style={{
                  animationDuration: `${b.flapSpeed}s`,
                }}
              >
                {/* Upper Left Wing */}
                <div
                  className="rounded-tl-[85%] rounded-tr-[35%] rounded-bl-[45%] rounded-br-[15%] shadow-sm relative overflow-hidden"
                  style={{
                    background: colors.top,
                    width: `${b.size * 0.58}px`,
                    height: `${b.size * 0.7}px`,
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent" />
                  <div className="absolute top-1 left-1.5 w-1 h-1 rounded-full bg-white/90 shadow-[0_0_3px_#fff]" />
                </div>
                {/* Lower Left Wing */}
                <div
                  className="rounded-tl-[35%] rounded-tr-[15%] rounded-bl-[85%] rounded-br-[40%] -mt-1 shadow-sm relative overflow-hidden"
                  style={{
                    background: colors.bottom,
                    width: `${b.size * 0.44}px`,
                    height: `${b.size * 0.5}px`,
                  }}
                >
                  <div className="absolute bottom-1 left-1 w-0.8 h-0.8 rounded-full bg-white/80" />
                </div>
              </div>

              {/* Right Wing (3D Flapping) */}
              <div
                className="butterfly-wing-right absolute left-1/2 origin-left flex flex-col items-start"
                style={{
                  animationDuration: `${b.flapSpeed}s`,
                }}
              >
                {/* Upper Right Wing */}
                <div
                  className="rounded-tr-[85%] rounded-tl-[35%] rounded-br-[45%] rounded-bl-[15%] shadow-sm relative overflow-hidden"
                  style={{
                    background: colors.top,
                    width: `${b.size * 0.58}px`,
                    height: `${b.size * 0.7}px`,
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-white/30 to-transparent" />
                  <div className="absolute top-1 right-1.5 w-1 h-1 rounded-full bg-white/90 shadow-[0_0_3px_#fff]" />
                </div>
                {/* Lower Right Wing */}
                <div
                  className="rounded-tr-[35%] rounded-tl-[15%] rounded-br-[85%] rounded-bl-[40%] -mt-1 shadow-sm relative overflow-hidden"
                  style={{
                    background: colors.bottom,
                    width: `${b.size * 0.44}px`,
                    height: `${b.size * 0.5}px`,
                  }}
                >
                  <div className="absolute bottom-1 right-1 w-0.8 h-0.8 rounded-full bg-white/80" />
                </div>
              </div>

              {/* Slender Body & Antennae */}
              <div className="relative z-20 flex flex-col items-center">
                {/* Antennae */}
                <div className="flex justify-between w-2.5 -mb-0.5 pointer-events-none">
                  <div className="w-1 h-2 border-l border-t border-pink-200/90 rounded-tl-full transform -rotate-15" />
                  <div className="w-1 h-2 border-r border-t border-pink-200/90 rounded-tr-full transform rotate-15" />
                </div>
                {/* Thorax and Abdomen */}
                <div
                  className="rounded-full shadow-sm"
                  style={{
                    width: `${Math.max(2.5, b.size * 0.12)}px`,
                    height: `${b.size * 0.75}px`,
                    background: 'linear-gradient(to bottom, #fdf2f8 0%, #db2777 50%, #500724 100%)',
                  }}
                />
              </div>

              {/* Luminous Butterfly Core Glow */}
              <div
                className="absolute w-2 h-2 rounded-full blur-xs pointer-events-none"
                style={{
                  background: colors.core,
                  boxShadow: `0 0 12px 2px ${colors.glow}`,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
