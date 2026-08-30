/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface FlowerData {
  id: number;
  name: string;
  stemPath: string;
  stemLength: number;
  bloomDelay: number; // in seconds
  stemDelay: number;
  bloomDuration: number;
  position: {
    x: number; // coordinate in 600x600 viewBox
    y: number;
  };
  scale: number;
  rotation: number; // base tilt
  swayDelay: number;
  swayDuration: number;
  swayAngle: number;
  petalColorType: 'rose' | 'blush' | 'magenta' | 'soft-pink' | 'peony';
  layerCount: number;
  petalsPerLayer: number[];
  leaves: {
    side: 'left' | 'right';
    positionOnStem: number; // 0 to 1
    angle: number;
    scale: number;
    delay: number;
  }[];
}

export interface ButterflyData {
  id: number;
  name: string;
  baseX: number; // percentage
  baseY: number; // percentage
  flightPathClass: string;
  size: number;
  wingColor: 'rose-gold' | 'neon-pink' | 'violet-glow' | 'sunset-blush';
  flapSpeed: number; // seconds
  flutterDelay: number;
  flightDuration: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  glow: number;
  pulseSpeed: number;
  pulseOffset: number;
  life?: number;
  maxLife?: number;
}
