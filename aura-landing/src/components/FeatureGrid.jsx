import { useEffect, useRef } from 'react';
import { animate, stagger, utils, onScroll } from 'animejs';
import { useReducedMotion } from '../hooks/useReducedMotion.js';

export default function FeatureGrid() {
  const sectionRef = useRef(null);
  const counterRef = useRef(null);
  const ringRef = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const bars = utils.$('.narrative-bar');
    const dots = utils.$('.agent-dot');
    const counterEl = counterRef.current;
    const ringEl = ringRef.current;

    if (reduced) {
      utils.set(bars, { height: '60%' });
      utils.set(dots, { background: 'var(--teal)' });
      if (counterEl) counterEl.textContent = '$80M';
      if (ringEl) utils.set(ringEl, { strokeDashoffset: 24 }); // ~78%
      return;
    }

    const scrollOpts = onScroll({ target: section, enter: 'top 85%' });

    // Narrative detection bars — looping stagger height changes
    animate(bars, {
      height: ['20%', '85%', '20%'],
      duration: 1600,
      delay: stagger(160),
      loop: true,
      ease: 'inOutSine',
      autoplay: scrollOpts,
    });

    // Institutional flow counter — animate a plain object, write to innerHTML in onUpdate
    const counterState = { value: 0 };
    animate(counterState, {
      value: 80,
      duration: 1800,
      ease: 'inOutExpo',
      loop: true,
      modifier: utils.round(0),
      onUpdate: () => {
        if (counterEl) counterEl.textContent = `$${counterState.value}M`;
      },
      autoplay: scrollOpts,
    });

    // Confidence scoring ring — stroke-dashoffset toward 78%
    // Circumference for r=18 is ~113.1; 78% drawn means offset ~24.9
    animate(ringEl, {
      strokeDashoffset: [113, 24.9],
      duration: 1400,
      ease: 'inOutExpo',
      loop: true,
      alternate: true,
      autoplay: scrollOpts,
    });

    // 6 specialist agents — dots lighting up one after another
    animate(dots, {
      backgroundColor: ['transparent', '#1D9E75', 'transparent'],
      duration: 1400,
      delay: stagger(150),
      loop: true,
      autoplay: scrollOpts,
    });
  }, [reduced]);

  return (
    <section className="section feature-grid" ref={sectionRef}>
      <div className="feature-card">
        <h3>Narrative detection</h3>
        <p>Tracks rotation between RWA, AI, and PerpDEX narratives in real time.</p>
        <div className="feature-viz">
          <div className="bar narrative-bar" style={{ height: '30%' }} />
          <div className="bar narrative-bar" style={{ height: '50%' }} />
          <div className="bar narrative-bar" style={{ height: '20%' }} />
        </div>
      </div>

      <div className="feature-card">
        <h3>Institutional flow</h3>
        <p>Aggregates on-chain inflow signals across major venues.</p>
        <div className="counter mono" ref={counterRef}>$0M</div>
      </div>

      <div className="feature-card">
        <h3>Confidence scoring</h3>
        <p>Weighs agent agreement into a single confidence score.</p>
        <svg width="64" height="64" viewBox="0 0 48 48">
          <circle cx="24" cy="24" r="18" fill="none" stroke="var(--border)" strokeWidth="4" />
          <circle
            ref={ringRef}
            cx="24" cy="24" r="18" fill="none"
            stroke="var(--teal)" strokeWidth="4"
            strokeDasharray="113.1"
            strokeDashoffset="113.1"
            strokeLinecap="round"
            transform="rotate(-90 24 24)"
          />
        </svg>
      </div>

      <div className="feature-card">
        <h3>6 specialist agents</h3>
        <p>Each agent independently scores a narrative dimension before consensus.</p>
        <div className="agent-row">
          {Array.from({ length: 6 }).map((_, i) => (
            <div className="agent-dot" key={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
