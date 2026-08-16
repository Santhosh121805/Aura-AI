import React from 'react';
import { 
  Database, 
  Sparkles, 
  Activity, 
  TrendingUp, 
  Globe, 
  ShieldAlert, 
  Zap, 
  ShieldCheck
} from 'lucide-react';

export const FlowSection: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Signal Ingestion',
      subtitle: 'Price Feeds · DEX Flows · News',
      icon: Database
    },
    {
      num: '02',
      title: 'Parallel Analysis',
      subtitle: '6 Autonomous Specialists',
      icon: Sparkles
    },
    {
      num: '03',
      title: 'Quorum Consensus',
      subtitle: 'Supermajority Voting Gate',
      icon: Zap
    },
    {
      num: '04',
      title: 'On-Chain Attestation',
      subtitle: 'Immutable BOTChain Receipt',
      icon: ShieldCheck
    }
  ];

  const agents = [
    { name: 'Narrative Agent', signal: 'Sector Momentum', tag: 'News / Themes', icon: Sparkles },
    { name: 'Sentiment Agent', signal: 'Crowd Conviction', tag: 'Fear & Greed', icon: Activity },
    { name: 'Capital Flow Agent', signal: 'Treasury & DEX Inflows', tag: 'Liquidity Delta', icon: TrendingUp },
    { name: 'Macro Agent', signal: 'Sovereign Yields & Rates', tag: 'Macro Regime', icon: Globe },
    { name: 'Risk Agent', signal: 'Volatility & Tail Risk', tag: 'VaR Simulation', icon: ShieldAlert },
    { name: 'Strategy Arbiter', signal: 'Final Consensus', tag: 'Quorum Vote', icon: Zap }
  ];

  return (
    <section id="flow" className="relative py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#081a11] border border-emerald-500/30 mb-3 shadow-[0_0_12px_rgba(16,185,129,0.15)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#34d399] animate-pulse" />
          <span className="font-headline font-bold text-[10px] sm:text-[11px] text-[#34d399] tracking-[0.16em] uppercase">
            Execution Pipeline
          </span>
        </div>
        <h2 className="font-headline font-black text-3xl sm:text-4xl text-[#f8fafc] mb-2">
          How It Works
        </h2>
        <p className="font-body font-medium text-sm sm:text-base text-[#cbd5e1]">
          Four simple steps from real-time market data to verified on-chain attestation.
        </p>
      </div>

      {/* STEP BY STEP PIPELINE */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.num}
              className="relative rounded-2xl bg-[#06140d]/90 border border-emerald-500/25 p-5 hover:border-emerald-400 hover:bg-[#081e13] transition-all group"
            >
              {/* Step Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-[#34d399] group-hover:bg-[#10b981] group-hover:text-white transition-all">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="font-data font-black text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-[#34d399] border border-emerald-500/30">
                  STEP {step.num}
                </span>
              </div>

              {/* Step Title & Subtitle */}
              <h3 className="font-headline font-black text-base text-white mb-1 group-hover:text-[#34d399] transition-colors">
                {step.title}
              </h3>
              <p className="font-data text-xs text-emerald-200/75">
                {step.subtitle}
              </p>

              {/* Step Progress Line */}
              <div className="mt-4 w-full h-1 bg-emerald-950 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-[#34d399] w-full" />
              </div>
            </div>
          );
        })}
      </div>

      {/* 6 SPECIALIST AGENTS (Clean compact chips) */}
      <div className="rounded-2xl bg-[#040e08]/90 border border-emerald-500/20 p-5 sm:p-6 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#34d399] animate-pulse" />
            <h4 className="font-headline font-bold text-xs sm:text-sm text-white uppercase tracking-wider">
              Autonomous Agent Committee
            </h4>
          </div>
          <span className="font-data text-[10px] font-bold text-[#34d399]">
            6 SPECIALISTS ACTIVE
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {agents.map((agent) => {
            const Icon = agent.icon;
            return (
              <div
                key={agent.name}
                className="flex items-center justify-between p-3 rounded-xl bg-[#071910] border border-emerald-500/20 hover:border-emerald-400/60 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center text-[#34d399] border border-emerald-500/30 group-hover:bg-[#10b981] group-hover:text-white transition-all">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-headline font-bold text-xs text-white group-hover:text-[#34d399] transition-colors">
                      {agent.name}
                    </div>
                    <div className="font-data text-[10px] text-emerald-300/70">
                      {agent.signal}
                    </div>
                  </div>
                </div>

                <span className="font-data text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-[#34d399] border border-emerald-500/20 whitespace-nowrap">
                  {agent.tag}
                </span>
              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
};
