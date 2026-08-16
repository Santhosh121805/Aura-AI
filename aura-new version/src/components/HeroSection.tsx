import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  BookOpen, 
  ShieldCheck, 
  Search, 
  CheckCircle2, 
  Check,
  Cpu,
  Layers
} from 'lucide-react';
import { VIDEO_CONFIG } from '../lib/constants';

interface HeroSectionProps {
  onRunAnalysis: () => void;
  onOpenDocs: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onRunAnalysis, onOpenDocs }) => {
  const [epochCounter, setEpochCounter] = useState(4824);
  const [quorumPercent, setQuorumPercent] = useState(94.8);

  useEffect(() => {
    const interval = setInterval(() => {
      setEpochCounter(prev => prev + 1);
      setQuorumPercent(prev => +(94.0 + Math.random() * 1.8).toFixed(1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full overflow-hidden bg-[#050807]">
      
      {/* Ambient background glows for depth without interfering with text */}
      <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/6 w-[32rem] h-[32rem] bg-emerald-400/5 rounded-full blur-3xl pointer-events-none" />

      {/* HERO SECTION CONTAINER */}
      <section 
        id="hero"
        className="relative min-h-[85vh] flex flex-col justify-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-24 sm:pt-28 pb-12 lg:py-16"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full">
          
          {/* ========================================================================= */}
          {/* LEFT SIDE — ~48% width (5 to 6 cols): Headline, Subtitle & CTAs           */}
          {/* ========================================================================= */}
          <div className="lg:col-span-6 flex flex-col items-start text-left z-20">
            
            {/* Small Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#081a11] border border-emerald-500/30 mb-6 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
              <span className="w-2 h-2 rounded-full bg-[#34d399] animate-pulse" />
              <span className="font-headline font-bold text-[11px] sm:text-xs text-[#34d399] tracking-[0.16em] uppercase">
                Accountability for Autonomous Capital Intelligence
              </span>
            </div>

            {/* Large High-Contrast Headline */}
            <h1 
              id="hero-headline"
              className="font-headline font-black text-4xl sm:text-5xl lg:text-[3.75rem] xl:text-[4.2rem] leading-[1.05] text-[#f8fafc] tracking-tight mb-5"
            >
              AI THAT READS.<br />
              <span className="text-[#34d399] text-glow-green">PROVES.</span><br />
              ATTESTS.
            </h1>

            {/* Short Supporting Description */}
            <p 
              id="hero-subtitle"
              className="font-body font-medium text-base sm:text-lg text-[#cbd5e1] leading-relaxed max-w-lg mb-8"
            >
              Analyze market signals. Prove consensus. Attest every decision on-chain.
            </p>

            {/* Two Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto mb-8">
              
              {/* PRIMARY: Run Analysis → */}
              <button
                id="hero-run-analysis-btn"
                onClick={onRunAnalysis}
                className="px-7 py-3.5 rounded-full glowing-green-pill text-[#f8fafc] font-headline font-black text-base shadow-[0_0_25px_rgba(16,185,129,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 cursor-pointer group"
              >
                <span>Run Analysis</span>
                <ArrowRight className="w-4 h-4 text-[#34d399] group-hover:translate-x-1 transition-transform" />
              </button>

              {/* SECONDARY: View Docs */}
              <button
                id="hero-view-docs-btn"
                onClick={onOpenDocs}
                className="px-6 py-3.5 rounded-full bg-[#081a11]/90 hover:bg-[#0c271a] text-[#f8fafc] font-headline font-bold text-base border border-emerald-500/30 hover:border-emerald-400 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-[#34d399]" />
                <span>View Docs</span>
              </button>

            </div>

            {/* Clean Trust Indicators */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-semibold text-emerald-300/80 pt-4 border-t border-emerald-500/15 w-full">
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#34d399]" /> 6 Autonomous Agents
              </span>
              <span className="text-emerald-500/30">•</span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#34d399]" /> BOTChain 677
              </span>
              <span className="text-emerald-500/30">•</span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#34d399]" /> Zero-Custody Attestation
              </span>
            </div>

          </div>

          {/* ========================================================================= */}
          {/* RIGHT SIDE — ~52% width (6 cols): Embedded Video in Hero Right Column     */}
          {/* Clear, crisp video showcase without obscuring text or causing glare       */}
          {/* ========================================================================= */}
          <div className="lg:col-span-6 relative flex items-center justify-center z-10">
            
            {/* Outer Sleek Glowing Frame */}
            <div className="relative w-full max-w-xl rounded-3xl overflow-hidden bg-[#04120a] border border-emerald-500/40 shadow-[0_0_40px_rgba(16,185,129,0.22)] p-2 sm:p-2.5 group">
              
              {/* Inner Video Container */}
              <div className="relative w-full aspect-[4/3] sm:h-[400px] lg:h-[430px] rounded-2xl overflow-hidden bg-[#020a06]">
                <video
                  className="w-full h-full object-cover object-center"
                  poster={VIDEO_CONFIG.poster}
                  autoPlay
                  muted
                  loop
                  playsInline
                >
                  <source src={VIDEO_CONFIG.url} type="video/mp4" />
                </video>

                {/* Subtle top & bottom vignette to frame the video gracefully */}
                <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />

                {/* Top Status Badge Overlay */}
                <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#03150d]/85 backdrop-blur-md border border-emerald-500/40 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-[#34d399] animate-pulse" />
                    <span className="font-data font-bold text-[11px] text-[#34d399] tracking-wider uppercase">
                      AURA-AI AUTONOMOUS CORE
                    </span>
                  </div>

                  <span className="font-data text-[10px] font-bold px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[#34d399] border border-emerald-500/30">
                    EPOCH #{epochCounter}
                  </span>
                </div>

                {/* Bottom Telemetry Overlay */}
                <div className="absolute bottom-3 left-3 right-3 p-2.5 sm:p-3 rounded-xl bg-[#03150d]/90 backdrop-blur-md border border-emerald-500/30 flex items-center justify-between z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-[#34d399] border border-emerald-500/30">
                      <Cpu className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-headline font-bold text-xs text-white">Live Committee Quorum</div>
                      <div className="text-[10px] text-emerald-300/70">6/6 Specialist Agents Active</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-data font-bold text-sm text-[#34d399]">{quorumPercent}%</div>
                    <div className="text-[9px] font-data text-emerald-300/60 uppercase">SUPERMAJORITY</div>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3 CORE CAPABILITIES (ANALYZE | PROVE | ATTEST)                           */}
      {/* Minimal, simplified, high readability                                     */}
      {/* ========================================================================= */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Card 1: ANALYZE */}
          <div className="rounded-2xl bg-[#07170f]/90 border border-emerald-500/25 p-6 hover:border-emerald-400/50 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.3)] group">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-[#34d399] mb-4 group-hover:bg-[#10b981] group-hover:text-white transition-all">
              <Search className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-2 mb-1.5">
              <h3 className="font-headline font-black text-lg text-white tracking-wide">
                ANALYZE
              </h3>
              <span className="text-[10px] font-data font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-[#34d399]">01</span>
            </div>
            <p className="font-body text-sm font-medium text-emerald-200/80 leading-relaxed">
              Specialist agents evaluate macroeconomic data, orderbooks, and liquidity sentiment in parallel.
            </p>
          </div>

          {/* Card 2: PROVE */}
          <div className="rounded-2xl bg-[#07170f]/90 border border-emerald-500/25 p-6 hover:border-emerald-400/50 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.3)] group">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-[#34d399] mb-4 group-hover:bg-[#10b981] group-hover:text-white transition-all">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-2 mb-1.5">
              <h3 className="font-headline font-black text-lg text-white tracking-wide">
                PROVE
              </h3>
              <span className="text-[10px] font-data font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-[#34d399]">02</span>
            </div>
            <p className="font-body text-sm font-medium text-emerald-200/80 leading-relaxed">
              Consensus votes, risk parameters, and reasoning traces are validated with supermajority threshold.
            </p>
          </div>

          {/* Card 3: ATTEST */}
          <div className="rounded-2xl bg-[#07170f]/90 border border-emerald-500/25 p-6 hover:border-emerald-400/50 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.3)] group">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-[#34d399] mb-4 group-hover:bg-[#10b981] group-hover:text-white transition-all">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-2 mb-1.5">
              <h3 className="font-headline font-black text-lg text-white tracking-wide">
                ATTEST
              </h3>
              <span className="text-[10px] font-data font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-[#34d399]">03</span>
            </div>
            <p className="font-body text-sm font-medium text-emerald-200/80 leading-relaxed">
              Every decision generates a cryptographic receipt permanently stored on BOTChain Mainnet.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
};
