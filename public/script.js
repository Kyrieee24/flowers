/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Blooming Pink Flower Bouquet Animation Controller (script.js)
 * Controls stem growth, leaf appearances, staggered flower blooming sequence,
 * fireflies particles, and the synchronized message reveal.
 */

// Configuration for dense bouquet flower blooming schedule
const FLOWERS_CONFIG = [
  { id: 1, name: 'Pinnacle Crown', bloomDelay: 2.2, bloomDuration: 2.0 },
  { id: 2, name: 'High Spire Left', bloomDelay: 3.2, bloomDuration: 1.9 },
  { id: 3, name: 'High Spire Right', bloomDelay: 3.6, bloomDuration: 1.9 },
  { id: 4, name: 'Arching Peony Left', bloomDelay: 4.2, bloomDuration: 2.0 },
  { id: 5, name: 'Arching Rose Right', bloomDelay: 4.6, bloomDuration: 2.0 },
  { id: 6, name: 'Grand Monarch Center', bloomDelay: 2.6, bloomDuration: 2.2 },
  { id: 7, name: 'Blush Mid Left', bloomDelay: 2.0, bloomDuration: 2.0 },
  { id: 8, name: 'Magenta Mid Right', bloomDelay: 3.8, bloomDuration: 2.0 },
  { id: 9, name: 'Grace Peony Far Left', bloomDelay: 5.2, bloomDuration: 1.9 },
  { id: 10, name: 'Grace Blush Far Right', bloomDelay: 5.6, bloomDuration: 1.9 },
  { id: 11, name: 'Wing Blossom Mid Left', bloomDelay: 6.0, bloomDuration: 1.8 },
  { id: 12, name: 'Wing Blossom Mid Right', bloomDelay: 6.4, bloomDuration: 1.8 },
  { id: 13, name: 'Sweetheart Center', bloomDelay: 1.8, bloomDuration: 1.8 },
  { id: 14, name: 'Cascade Lower Left', bloomDelay: 2.4, bloomDuration: 1.7 },
  { id: 15, name: 'Cascade Lower Right', bloomDelay: 2.8, bloomDuration: 1.7 },
  { id: 16, name: 'Petite Ribbon Bud', bloomDelay: 1.5, bloomDuration: 1.6 }
];

const MESSAGE_TEXT = "Always keep your heart full of hope and positive thoughts.\nNo matter the hardships and battles you are facing,\nnever forget how truly strong, radiant, and beautiful you are. 🌸✨";

class FlowerAnimationController {
  constructor() {
    this.timers = [];
    this.init();
  }

  init() {
    this.startBloomSequence();
  }

  startBloomSequence() {
    // 1. Reset any previous state
    this.clearTimers();

    // 2. Schedule each flower to bloom at its appointed time
    FLOWERS_CONFIG.forEach(flower => {
      const timer = setTimeout(() => {
        const flowerEl = document.getElementById(`flower-${flower.id}`);
        if (flowerEl) {
          flowerEl.classList.add('bloomed');
        }
      }, flower.bloomDelay * 1000);
      this.timers.push(timer);
    });

    // 3. Calculate time when ALL flowers have completely bloomed
    const maxBloomFinish = Math.max(
      ...FLOWERS_CONFIG.map(f => f.bloomDelay + f.bloomDuration)
    );

    // 4. Activate bouquet ambient glow aura
    const auraTimer = setTimeout(() => {
      const aura = document.querySelector('.bouquet-ambient-aura');
      if (aura) aura.classList.add('active');
    }, maxBloomFinish * 1000);
    this.timers.push(auraTimer);

    // 5. Wait 1.2s after the final flower finishes blooming, then reveal message
    const messageRevealDelay = (maxBloomFinish + 1.2) * 1000;
    const messageTimer = setTimeout(() => {
      this.revealMessage();
    }, messageRevealDelay);
    this.timers.push(messageTimer);
  }

  revealMessage() {
    const container = document.getElementById('message-reveal-container');
    const textTarget = document.getElementById('message-text-target');
    if (!container || !textTarget) return;

    container.style.display = 'block';
    container.classList.add('message-card-entrance');

    // Typewriter effect for text
    let index = 0;
    textTarget.textContent = '';
    const typeInterval = setInterval(() => {
      if (index <= MESSAGE_TEXT.length) {
        textTarget.textContent = MESSAGE_TEXT.slice(0, index);
        index++;
      } else {
        clearInterval(typeInterval);
      }
    }, 28);
  }

  clearTimers() {
    this.timers.forEach(clearTimeout);
    this.timers = [];
  }
}

// Auto-start on DOM ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    window.flowerController = new FlowerAnimationController();
  });
}
