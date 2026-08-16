import React from 'react';
import { Section } from './ui/Section';
import { Eyebrow } from './ui/Eyebrow';

const STATEMENTS = [
  {
    title: 'Independent perspectives',
    copy: 'Six agents analyze different evidence instead of relying on one black-box output.',
  },
  {
    title: 'Risk can stop the action',
    copy: 'Aura-AI can return Watch or No Trade when the available evidence is weak.',
  },
  {
    title: 'Every decision is explainable',
    copy: 'Users can inspect the evidence, confidence, reasoning and agent agreement before publishing.',
  },
];

export const FeaturesSection: React.FC = () => {
  return (
    <Section id="features">
      <Eyebrow className="mb-3">Why Aura-AI</Eyebrow>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-12 mt-10">
        {STATEMENTS.map((s) => (
          <div key={s.title}>
            <h3 className="text-xl text-[#F3F1EA] mb-3 leading-snug">{s.title}</h3>
            <p className="text-sm text-[#F3F1EA]/60 leading-relaxed">{s.copy}</p>
          </div>
        ))}
      </div>
    </Section>
  );
};
