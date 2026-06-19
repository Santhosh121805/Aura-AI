import { useEffect, useRef } from 'react';
import { animate, svg, stagger, onScroll, utils } from 'animejs';
import { useReducedMotion } from '../hooks/useReduceMotion.js';

const NODES = ['Data Sources', '6 Agents', 'Decision Engine', 'Strategy Output'];

export default function FlowDiagram() {
  const sectionRef = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const connectors = svg.createDrawable('.flow-connector-line');
    const nodes = utils.$('.flow-node');

    if (reduced) {
      utils.set(connectors, { draw: '0 1' });
      utils.set(nodes, { opacity: 1 });
      return;
    }

    animate(connectors, {
      draw: ['0 0', '0 1'],
      duration: 700,
      delay: stagger(550),
      ease: 'inOutQuad',
      autoplay: onScroll({
        target: section,
        enter: 'top 80%',
        sync: false,
      }),
      onUpdate(self) {
        // glow whichever node corresponds to this connector's progress
      },
    });

    // Stagger a quick teal glow across nodes as the line "reaches" them
    animate(nodes, {
      borderColor: ['#1f1f1f', '#1D9E75', '#1f1f1f'],
      duration: 900,
      delay: stagger(550, { start: 250 }),
      autoplay: onScroll({ target: section, enter: 'top 80%' }),
    });
  }, [reduced]);

  return (
    <section className="section" ref={sectionRef}>
      <div className="flow-row">
        {NODES.map((label, i) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <div className="flow-node mono">{label}</div>
            {i < NODES.length - 1 && (
              <svg className="flow-connector" viewBox="0 0 100 24" preserveAspectRatio="none">
                <line
                  className="flow-connector-line"
                  x1="0" y1="12" x2="100" y2="12"
                  stroke="var(--teal)" strokeWidth="2"
                />
              </svg>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}