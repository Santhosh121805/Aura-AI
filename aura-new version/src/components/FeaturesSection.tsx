import React from 'react';
import { 
  GitMerge, 
  Radio, 
  HelpCircle, 
  ShieldCheck, 
  Lock, 
  History,
  Cpu,
  Zap,
  Shield,
  Layers
} from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const leftBranch = [
    {
      id: 'branch-consensus',
      title: 'Consensus Engine',
      subtitle: 'Trades on Quorum',
      tag: 'SUPERMAJORITY',
      icon: GitMerge,
    },
    {
      id: 'branch-feeds',
      title: 'Live Data Feeds',
      subtitle: 'Real-Time Market Depth',
      tag: 'SUB-SECOND',
      icon: Radio,
    },
    {
      id: 'branch-explainable',
      title: 'Explainable AI',
      subtitle: 'Transparent Traces',
      tag: 'NO BLACK-BOX',
      icon: HelpCircle,
    }
  ];

  const rightBranch = [
    {
      id: 'branch-botchain',
      title: 'BOTChain Verified',
      subtitle: 'On-Chain Registry',
      tag: 'CHAIN ID: 677',
      icon: ShieldCheck,
    },
    {
      id: 'branch-custody',
      title: 'Zero-Custody Access',
      subtitle: 'Decisions Only',
      tag: '100% NON-CUSTODIAL',
      icon: Lock,
    },
    {
      id: 'branch-receipts',
      title: 'Immutable Receipts',
      subtitle: 'Permanent Audit Trail',
      tag: 'EVM VERIFIED',
      icon: History,
    }
  ];

  return (
    <section id="features" className="relative py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Background Atmosphere */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[32rem] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#081a11] border border-emerald-500/30 mb-3 shadow-[0_0_12px_rgba(16,185,129,0.15)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#34d399] animate-pulse" />
          <span className="font-headline font-bold text-[10px] sm:text-[11px] text-[#34d399] tracking-[0.16em] uppercase">
            System Hierarchy
          </span>
        </div>
        <h2 className="font-headline font-black text-3xl sm:text-4xl text-[#f8fafc] mb-2">
          Why AURA-AI
        </h2>
        <p className="font-body font-medium text-sm sm:text-base text-[#cbd5e1]">
          Institutional crypto intelligence engineered for Web3 treasuries and capital allocators.
        </p>
      </div>

      {/* TREE STRUCTURE DIAGRAM */}
      <div className="relative max-w-5xl mx-auto">
        
        {/* ========================================================================= */}
        {/* ROOT TREE PARENT: AURA-AI CORE                                           */}
        {/* ========================================================================= */}
        <div className="flex flex-col items-center justify-center relative z-20">
          <div className="px-6 py-4 rounded-2xl bg-gradient-to-b from-[#0a2619] to-[#04140c] border-2 border-emerald-400/50 shadow-[0_0_35px_rgba(16,185,129,0.35)] flex items-center gap-3.5 group hover:scale-105 transition-all">
            <div className="w-11 h-11 rounded-xl bg-[#10b981] text-[#021f15] flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.6)]">
              <Cpu className="w-6 h-6" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="font-headline font-black text-lg sm:text-xl text-white tracking-wide">
                  AURA-AI CORE
                </span>
                <span className="w-2 h-2 rounded-full bg-[#34d399] animate-ping" />
              </div>
              <span className="font-data text-xs font-bold text-[#34d399] tracking-wider uppercase">
                AUTONOMOUS CONSENSUS ENGINE
              </span>
            </div>
          </div>

          {/* Root Stem Connector Line */}
          <div className="w-0.5 h-10 bg-gradient-to-b from-emerald-400 to-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
        </div>

        {/* ========================================================================= */}
        {/* BRANCH SPLIT BAR (Desktop & Tablet)                                       */}
        {/* ========================================================================= */}
        <div className="hidden md:block relative w-3/4 mx-auto h-8 mb-6 pointer-events-none">
          {/* Horizontal Branch Bar */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500/80 via-emerald-400 to-emerald-500/80 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
          
          {/* Left Vertical Drop Line */}
          <div className="absolute top-0 left-0 w-0.5 h-8 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          
          {/* Right Vertical Drop Line */}
          <div className="absolute top-0 right-0 w-0.5 h-8 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
        </div>

        {/* ========================================================================= */}
        {/* TWO PRIMARY BRANCHES (Left: Intelligence | Right: Attestation)            */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 relative z-10">
          
          {/* LEFT BRANCH: Intelligence & Consensus */}
          <div className="flex flex-col gap-4">
            
            {/* Branch Header Pill */}
            <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-[#061c12] border border-emerald-500/30 text-left mb-1 shadow-sm">
              <Zap className="w-4 h-4 text-[#34d399]" />
              <span className="font-headline font-bold text-xs sm:text-sm text-white uppercase tracking-wider">
                Autonomous Intelligence Layer
              </span>
            </div>

            {/* Left Branch Items */}
            {leftBranch.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className="relative flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-[#06140d]/95 border border-emerald-500/25 hover:border-emerald-400 hover:bg-[#081e13] hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-[#34d399] group-hover:bg-[#10b981] group-hover:text-white transition-all shadow-sm">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-headline font-bold text-base text-white group-hover:text-[#34d399] transition-colors">
                        {item.title}
                      </h3>
                      <p className="font-data text-xs text-emerald-300/80 font-medium">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <span className="font-data text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/15 text-[#34d399] border border-emerald-500/30 whitespace-nowrap">
                    {item.tag}
                  </span>
                </div>
              );
            })}
          </div>

          {/* RIGHT BRANCH: Attestation & Security */}
          <div className="flex flex-col gap-4">
            
            {/* Branch Header Pill */}
            <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-[#061c12] border border-emerald-500/30 text-left mb-1 shadow-sm">
              <Shield className="w-4 h-4 text-[#34d399]" />
              <span className="font-headline font-bold text-xs sm:text-sm text-white uppercase tracking-wider">
                Attestation & Security Layer
              </span>
            </div>

            {/* Right Branch Items */}
            {rightBranch.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className="relative flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-[#06140d]/95 border border-emerald-500/25 hover:border-emerald-400 hover:bg-[#081e13] hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-[#34d399] group-hover:bg-[#10b981] group-hover:text-white transition-all shadow-sm">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-headline font-bold text-base text-white group-hover:text-[#34d399] transition-colors">
                        {item.title}
                      </h3>
                      <p className="font-data text-xs text-emerald-300/80 font-medium">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <span className="font-data text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/15 text-[#34d399] border border-emerald-500/30 whitespace-nowrap">
                    {item.tag}
                  </span>
                </div>
              );
            })}
          </div>

        </div>

      </div>

    </section>
  );
};
