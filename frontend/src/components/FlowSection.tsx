import React from 'react';
import { Radio, Users, GitMerge, FileCheck } from 'lucide-react';
import { INITIAL_AGENTS } from '../lib/constants';
import { Section } from './ui/Section';
import { Eyebrow } from './ui/Eyebrow';

const STEPS = [
  { icon: Radio, title: 'Collect Signals', copy: 'Aura-AI reads live market, sentiment, capital-flow, macro and risk data.' },
  { icon: Users, title: 'Specialist Analysis', copy: 'Six focused agents study different parts of the market independently.' },
  { icon: GitMerge, title: 'Reach Consensus', copy: 'The engine compares their evidence and chooses Strategy Ready, Watch or No Trade.' },
  { icon: FileCheck, title: 'Publish Receipt', copy: 'The user reviews the decision and can publish an immutable receipt on BOTChain.' },
];

export const FlowSection: React.FC = () => {
  return (
    <Section id="flow">
      <Eyebrow className="mb-3">How it works</Eyebrow>
      <h2 className="text-3xl sm:text-4xl text-[#F3F1EA] mb-16 max-w-2xl">
        From live market data to an on-chain receipt.
      </h2>

      {/* 4-step flow: horizontal line desktop, vertical mobile */}
      <div className="relative flex flex-col md:flex-row gap-10 md:gap-6 mb-24">
        <div
          className="hidden md:block absolute top-5 left-0 right-0 h-px bg-[#F3F1EA]/12"
          aria-hidden="true"
        />
        <div
          className="md:hidden absolute top-0 bottom-0 left-5 w-px bg-[#F3F1EA]/12"
          aria-hidden="true"
        />
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          return (
            <div key={step.title} className="relative flex md:flex-col gap-4 md:gap-5 flex-1">
              <div className="relative z-10 w-10 h-10 shrink-0 rounded-full bg-[#0B0D0C] border border-[#31E6A1]/40 flex items-center justify-center text-[#31E6A1]">
                <Icon className="w-4 h-4" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-[#F3F1EA] mb-1">{step.title}</h3>
                <p className="text-sm text-[#F3F1EA]/60 leading-relaxed max-w-[22ch]">{step.copy}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Six specialist agents — compact list */}
      <div>
        <h3 className="text-sm font-semibold text-[#F3F1EA]/50 uppercase tracking-wide mb-6">
          Six specialist agents
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-1">
          {INITIAL_AGENTS.map((agent) => (
            <details key={agent.id} className="group border-b border-[#F3F1EA]/8 py-3.5">
              <summary className="flex items-center gap-3 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                <span className="w-1.5 h-1.5 rounded-full bg-[#31E6A1]/60 shrink-0" aria-hidden="true" />
                <span className="text-sm font-medium text-[#F3F1EA]">{agent.name}</span>
              </summary>
              <p className="text-sm text-[#F3F1EA]/55 mt-2 pl-5 leading-relaxed">{agent.role}</p>
            </details>
          ))}
        </div>
      </div>
    </Section>
  );
};
