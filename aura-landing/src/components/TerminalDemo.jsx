import { useEffect, useRef } from 'react';
import { createTimeline, stagger, utils } from 'animejs';
import { useReducedMotion } from '../hooks/useReducedMotion.js';

const LINES = [
  'Fetching CoinMarketCap data...',
  'Fetching BNB Chain institutional flows...',
  'Running 6 agents...',
  'Signals aligned — confidence 78%',
  'Generating strategy spec...',
];

const RESULT_JSON = `{
  "recommendation": "rotate into RWA",
  "confidence": 78
}`;

export default function TerminalDemo() {
  const wrapRef = useRef(null);
  const resultRef = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const lines = utils.$('.terminal-line', wrap);
    const resultEl = resultRef.current;

    if (reduced) {
      utils.set(lines, { opacity: 1 });
      utils.set(resultEl, { opacity: 1 });
      resultEl.textContent = RESULT_JSON;
      return;
    }

    const typeState = { i: 0 };

    const tl = createTimeline({ defaults: { ease: 'outQuad' } });

    tl.add(lines, {
      opacity: [0, 1],
      duration: 200,
      delay: stagger(300),
    }).add(resultEl, {
      opacity: [0, 1],
      duration: 200,
    }).add(typeState, {
      i: RESULT_JSON.length,
      duration: RESULT_JSON.length * 28,
      ease: 'linear',
      modifier: utils.round(0),
      onUpdate: () => {
        resultEl.textContent = RESULT_JSON.slice(0, typeState.i);
      },
    });

    return () => tl.revert?.();
  }, [reduced]);

  return (
    <div className="terminal" ref={wrapRef}>
      <div className="terminal-bar">
        <div className="terminal-dot" />
        <div className="terminal-dot" />
        <div className="terminal-dot" />
      </div>
      <div className="terminal-body">
        {LINES.map((line, i) => (
          <div className="terminal-line" key={i}>
            <span style={{ color: 'var(--teal)' }}>$</span> {line}
          </div>
        ))}
        <div className="terminal-result" ref={resultRef} />
      </div>
    </div>
  );
}
