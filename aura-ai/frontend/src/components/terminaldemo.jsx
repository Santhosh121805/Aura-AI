import { useEffect, useRef, useState } from 'react';
import { createTimeline, stagger, utils } from 'animejs';
import { useReducedMotion } from '../hooks/useReduceMotion.js';

const LINES = [
  'Fetching CoinMarketCap data...',
  'Fetching BNB Chain institutional flows...',
  'Running 6 agents...',
  'Signals aligned — confidence 78%',
  'Generating strategy spec...',
];

const DEFAULT_RESULT = `{
  "recommendation": "rotate into RWA",
  "confidence": 78
}`;

export default function TerminalDemo() {
  const wrapRef = useRef(null);
  const resultRef = useRef(null);
  const reduced = useReducedMotion();
  const [resultJSON, setResultJSON] = useState(DEFAULT_RESULT);
  const [loading, setLoading] = useState(false);

  async function runSkill() {
    setLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/aura/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      setResultJSON(JSON.stringify(data, null, 2));
    } catch (err) {
      setResultJSON(JSON.stringify({ error: String(err) }, null, 2));
    } finally {
      setLoading(false);
    }
  }

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
      i: resultJSON.length,
      duration: resultJSON.length * 12,
      ease: 'linear',
      modifier: utils.round(0),
      onUpdate: () => {
        resultEl.textContent = resultJSON.slice(0, typeState.i);
      },
    });

    return () => tl.revert?.();
  }, [reduced]);

  return (
    <div className="terminal" ref={wrapRef}>
      <div style={{ display: 'flex', gap: 8, padding: '8px 12px' }}>
        <button className="btn" onClick={runSkill} disabled={loading}>
          {loading ? 'Running…' : 'Run Skill'}
        </button>
      </div>
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