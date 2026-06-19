import { useEffect, useRef } from 'react';
import { animate, createTimeline, svg, onScroll, utils } from 'animejs';
import { useReducedMotion } from '../hooks/useReducedMotion.js';

const LABELS = [
  'watching',
  'narrative shifting',
  'signal confirmed',
  'rotation detected',
  'strategy generated',
];

export default function Hero() {
  const containerRef = useRef(null);
  const labelRef = useRef(null);
  const jsonRef = useRef(null);
  const trailRef = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const [shape0, shape1, shape2, shape3, shape4] = utils.$('.hero-shape');
    const [activePath] = utils.$('.hero-active-path');
    const [trail] = svg.createDrawable('.hero-trail');
    const labelEl = labelRef.current;
    const jsonEl = jsonRef.current;

    // Reduced motion: just fade the final state in, no scroll-scrub, no morph.
    if (reduced) {
      utils.set(activePath, { d: utils.get(shape4, 'd') });
      utils.set(trail, { draw: '0 1' });
      labelEl.textContent = LABELS[4];
      animate(jsonEl, { opacity: [0, 1], duration: 400 });
      return;
    }

    const setLabel = (text) => {
      animate(labelEl, {
        opacity: [1, 0],
        duration: 120,
        ease: 'inOutQuad',
        onComplete: () => {
          labelEl.textContent = text;
          animate(labelEl, { opacity: [0, 1], duration: 180, ease: 'inOutQuad' });
        },
      });
    };

    // Start state: flat line, teal.
    utils.set(activePath, { d: utils.get(shape0, 'd') });
    utils.set(trail, { draw: '0 0' });
    utils.set(jsonEl, { opacity: 0 });
    labelEl.textContent = LABELS[0];

    const tl = createTimeline({
      defaults: { ease: 'inOutQuad' },
      autoplay: onScroll({
        container,
        target: container,
        sync: true,
        enter: 'top top',
        leave: 'bottom top',
      }),
    });

    // Stage 1: flat line -> rising candlestick (~0% -> 25%)
    tl.add(activePath, { d: svg.morphTo(shape1), duration: 25 })
      .call(() => setLabel(LABELS[1]))
      .add(trail, { draw: '0 .25', duration: 25 }, '<')

      // Stage 2: candlestick -> steeper ascending bars (~25% -> 50%)
      .add(activePath, { d: svg.morphTo(shape2), duration: 25 })
      .call(() => setLabel(LABELS[2]))
      .add(trail, { draw: '0 .5', duration: 25 }, '<')

      // Stage 3: ascending bars -> breakout line + marker (~50% -> 75%)
      .add(activePath, { d: svg.morphTo(shape3), duration: 25 })
      .call(() => setLabel(LABELS[3]))
      .add(trail, { draw: '0 .75', duration: 25 }, '<')

      // Stage 4: breakout -> strategy card glyph (~75% -> 100%)
      .add(activePath, { d: svg.morphTo(shape4), duration: 25 })
      .call(() => setLabel(LABELS[4]))
      .add(trail, { draw: '0 1', duration: 25 }, '<')
      .add(jsonEl, { opacity: [0, 1], duration: 15 });

    return () => {
      tl.revert?.();
    };
  }, [reduced]);

  return (
    <div className="hero-scroll-container" ref={containerRef}>
      <div className="hero-pin">
        <div className="hero-title mono">scanning capital flows</div>

        <div className="hero-symbol-wrap">
          <svg viewBox="0 0 200 200" width="220" height="220">
            <g stroke="var(--teal)" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round">
              {/* Hidden reference shapes — same node count so morphTo reads cleanly */}
              {/* 0: flat line */}
              <path className="hero-shape" style={{ opacity: 0 }}
                d="M40,100 L60,100 L80,100 L100,100 L120,100 L140,100 L160,100" />
              {/* 1: small rising candlestick / bar */}
              <path className="hero-shape" style={{ opacity: 0 }}
                d="M40,120 L60,110 L80,95 L100,100 L120,80 L140,85 L160,90" />
              {/* 2: steeper ascending bars */}
              <path className="hero-shape" style={{ opacity: 0 }}
                d="M40,150 L60,120 L80,90 L100,95 L120,60 L140,65 L160,40" />
              {/* 3: breakout line with peak marker (approximated via path geometry) */}
              <path className="hero-shape" style={{ opacity: 0 }}
                d="M40,160 L60,130 L80,100 L100,70 L120,40 L140,35 L160,30" />
              {/* 4: strategy card glyph (rectangle + checkmark, flattened to a path) */}
              <path className="hero-shape" style={{ opacity: 0 }}
                d="M40,60 L160,60 L160,140 L40,140 L40,60 L70,100 L95,125 L160,60" />

              {/* The path actually rendered & morphed at runtime */}
              <path
                className="hero-active-path"
                d="M40,100 L60,100 L80,100 L100,100 L120,100 L140,100 L160,100"
              />

              {/* Trail line drawn via createDrawable beneath the symbol */}
              <line className="hero-trail" x1="40" y1="180" x2="160" y2="180"
                stroke="var(--teal)" strokeWidth="2" strokeOpacity="0.5" />
            </g>
          </svg>
          <div className="hero-json mono" ref={jsonRef}>
{`{
  "recommendation": "rotate into RWA",
  "confidence": 78
}`}
          </div>
        </div>

        <div className="hero-label mono" ref={labelRef}>watching</div>
      </div>

      {/* This spacer is what gives the sticky pin somewhere to scroll against */}
      <div className="hero-spacer" />
    </div>
  );
}
