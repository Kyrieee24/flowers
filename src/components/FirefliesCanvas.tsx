/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import { Particle } from '../types';
import { bloomAudio } from '../utils/audio';

interface FirefliesCanvasProps {
  enabled: boolean;
  intensity?: number;
}

export const FirefliesCanvas: React.FC<FirefliesCanvasProps> = ({ enabled, intensity = 1 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const sparkRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number | null>(null);
  const lastMousePos = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    // Initialize fireflies
    const particleCount = Math.floor(45 * intensity);
    const fireflies: Particle[] = [];
    const colors = [
      'rgba(255, 182, 193, ', // Light pink
      'rgba(255, 105, 180, ', // Hot pink
      'rgba(254, 240, 138, ', // Soft golden warm
      'rgba(244, 114, 182, ', // Rose pink
      'rgba(251, 207, 232, ', // Pale blush
    ];

    for (let i = 0; i < particleCount; i++) {
      fireflies.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -0.2 - Math.random() * 0.4, // float gently upwards
        size: 1.2 + Math.random() * 2.8,
        alpha: 0.2 + Math.random() * 0.7,
        color: colors[Math.floor(Math.random() * colors.length)],
        glow: 6 + Math.random() * 14,
        pulseSpeed: 0.015 + Math.random() * 0.03,
        pulseOffset: Math.random() * Math.PI * 2,
      });
    }
    particlesRef.current = fireflies;

    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      time += 0.016;

      if (enabled) {
        // Draw background fireflies
        particlesRef.current.forEach((p) => {
          p.x += p.vx + Math.sin(time + p.pulseOffset) * 0.25;
          p.y += p.vy;

          // Wrap edges smoothly
          if (p.y < -20) p.y = window.innerHeight + 20;
          if (p.y > window.innerHeight + 20) p.y = -20;
          if (p.x < -20) p.x = window.innerWidth + 20;
          if (p.x > window.innerWidth + 20) p.x = -20;

          const currentAlpha = Math.max(0.1, p.alpha * (0.6 + 0.4 * Math.sin(time * 3 * p.pulseSpeed + p.pulseOffset)));

          ctx.save();
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.shadowBlur = p.glow;
          ctx.shadowColor = p.color + '0.9)';
          ctx.fillStyle = p.color + currentAlpha + ')';
          ctx.fill();

          // Extra bright starlight core
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.4, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 255, 255, ' + (currentAlpha * 1.2) + ')';
          ctx.fill();
          ctx.restore();
        });
      }

      // Draw interactive touch/cursor sparkles
      const sparks = sparkRef.current;
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.02; // slight gravity
        s.vx *= 0.96;
        s.vy *= 0.96;
        if (s.life !== undefined && s.maxLife !== undefined) {
          s.life -= 1;
          const ratio = s.life / s.maxLife;

          if (s.life <= 0) {
            sparks.splice(i, 1);
            continue;
          }

          ctx.save();
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size * ratio, 0, Math.PI * 2);
          ctx.shadowBlur = s.glow * ratio;
          ctx.shadowColor = s.color + '1)';
          ctx.fillStyle = s.color + (ratio * 0.9) + ')';
          ctx.fill();

          // Cross sparkle rays for large sparkles
          if (s.size > 2.5 && ratio > 0.4) {
            ctx.strokeStyle = `rgba(255, 255, 255, ${ratio * 0.7})`;
            ctx.lineWidth = 0.75;
            const rayLen = s.size * 2 * ratio;
            ctx.beginPath();
            ctx.moveTo(s.x - rayLen, s.y);
            ctx.lineTo(s.x + rayLen, s.y);
            ctx.moveTo(s.x, s.y - rayLen);
            ctx.lineTo(s.x, s.y + rayLen);
            ctx.stroke();
          }

          ctx.restore();
        }
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    // Mouse / Touch Sparkle Trigger
    const addSparksAt = (x: number, y: number, count = 4) => {
      const sparkColors = [
        'rgba(255, 220, 240, ',
        'rgba(255, 140, 190, ',
        'rgba(254, 243, 199, ',
        'rgba(255, 255, 255, ',
      ];
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.5 + Math.random() * 2.5;
        sparkRef.current.push({
          x: x + (Math.random() - 0.5) * 10,
          y: y + (Math.random() - 0.5) * 10,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.5,
          size: 1.5 + Math.random() * 3,
          alpha: 1,
          color: sparkColors[Math.floor(Math.random() * sparkColors.length)],
          glow: 8 + Math.random() * 12,
          pulseSpeed: 1,
          pulseOffset: 0,
          life: 30 + Math.floor(Math.random() * 30),
          maxLife: 60,
        });
      }
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      let clientX = 0;
      let clientY = 0;
      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      if (lastMousePos.current) {
        const dist = Math.hypot(clientX - lastMousePos.current.x, clientY - lastMousePos.current.y);
        if (dist > 15) {
          addSparksAt(clientX, clientY, 2);
          lastMousePos.current = { x: clientX, y: clientY };
        }
      } else {
        lastMousePos.current = { x: clientX, y: clientY };
      }
    };

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      let clientX = 0;
      let clientY = 0;
      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = e.clientX;
        clientY = e.clientY;
      }
      addSparksAt(clientX, clientY, 12);
      bloomAudio.playSparkleSound();
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('mousedown', handlePointerDown, { passive: true });
    window.addEventListener('touchstart', handlePointerDown, { passive: true });

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('touchstart', handlePointerDown);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [enabled, intensity]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-10 w-full h-full"
      style={{ touchAction: 'none' }}
    />
  );
};
