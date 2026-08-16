import React, { useEffect, useRef, useState } from 'react';
import { Rocket, ArrowRight, ShieldCheck, Cpu, ExternalLink, Activity, CheckCircle2, Zap, Lock, Terminal } from 'lucide-react';

interface IntroScreenProps {
  onGetStarted: () => void;
  onOpenDocs: () => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({ onGetStarted, onOpenDocs }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  // Cycle active telemetry simulation step
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 6);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Animated cyber green starfield & stardust particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      pulseSpeed: number;
      color: string;
    }> = [];

    const colors = [
      'rgba(52, 211, 153, ',  // emerald-400
      'rgba(16, 185, 129, ',  // emerald-500
      'rgba(0, 245, 155, ',   // neon cyber green
      'rgba(255, 255, 255, ', // pure white
      'rgba(110, 231, 183, ', // emerald-300
    ];

    for (let i = 0; i < 85; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2.2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.25,
        speedY: (Math.random() - 0.5) * 0.25,
        opacity: Math.random() * 0.8 + 0.2,
        pulseSpeed: Math.random() * 0.02 + 0.008,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let t = 0;
    const render = () => {
      t += 0.015;
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const currentOpacity = (Math.sin(t * p.pulseSpeed * 100) * 0.35 + 0.65) * p.opacity;
        ctx.fillStyle = `${p.color}${currentOpacity})`;
        ctx.shadowBlur = p.size > 1.5 ? 8 : 0;
        ctx.shadowColor = '#10b981';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const agents = [
    { name: 'Macro Strategist', role: 'Global Liquidity & Fed Rate', weight: '22%' },
    { name: 'Technical Quant', role: 'Order Book Depth & Momentum', weight: '18%' },
    { name: 'Sentiment Analyst', role: 'Derivatives & Social Heat', weight: '16%' },
    { name: 'Liquidity Auditor', role: 'Slippage & Routing Bounds', weight: '18%' },
    { name: 'Risk Sentinel', role: 'VaR & Drawdown Circuit Breakers', weight: '14%' },
    { name: 'Executive Arbiter', role: 'Zero-Custody BOTChain Proof', weight: '12%' },
  ];

  return (
    <div 
      id="aura-intro-landing"
      className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden bg-transparent text-[#f8fafc] select-none"
    >
      {/* Particle Canvas Layer */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 pointer-events-none z-10 opacity-70"
      />

      {/* Atmospheric Radial Green & Emerald Background */}
      <div 
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: `
            radial-gradient(circle at 75% 35%, rgba(16, 185, 129, 0.22) 0%, rgba(5, 150, 105, 0.12) 32%, transparent 70%),
            radial-gradient(circle at 20% 65%, rgba(52, 211, 153, 0.14) 0%, transparent 55%),
            linear-gradient(180deg, rgba(2, 18, 12, 0.4) 0%, rgba(2, 18, 12, 0.2) 50%, rgba(2, 18, 12, 0.65) 100%)
          `
        }}
      />

      {/* Top Header Navigation Bar */}
      <header className="relative z-30 w-full px-6 sm:px-12 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Logo Glyph */}
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center shadow-[0_0_12px_rgba(16,185,129,0.4)]">
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#34d399]" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 2L3 20h18L12 2z" strokeLinejoin="round" />
              <circle cx="12" cy="13" r="1.5" fill="#34d399" />
            </svg>
          </div>
          <span className="font-headline font-black text-sm tracking-[0.25em] text-white">
            AURA-AI NETWORK
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={onOpenDocs}
            className="text-xs font-body font-bold text-emerald-300/80 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <span>Whitepaper / Spec</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#34d399]" />
          </button>
        </div>
      </header>

      {/* Main Hero Showcase Container */}
      <div className="relative z-20 max-w-7xl mx-auto w-full px-6 sm:px-12 lg:px-16 flex-1 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-10 my-auto py-8">
        
        {/* LEFT COLUMN: Green themed AURA-AI branding & Get Started */}
        <div className="w-full lg:w-1/2 flex flex-col items-start text-left max-w-xl">
          
          {/* Brand Logo & Name Header */}
          <div className="flex items-center gap-5 mb-5 animate-fade-in">
            {/* Custom Glowing Delta + Star Glyph in Green */}
            <div className="relative flex items-center justify-center">
              {/* Outer Glow effect */}
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 opacity-60 blur-md animate-pulse" />
              
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#021f15]/90 border border-emerald-400/60 flex items-center justify-center shadow-[0_0_25px_rgba(16,185,129,0.55)]">
                <svg 
                  viewBox="0 0 100 100" 
                  className="w-9 h-9 sm:w-10 sm:h-10 text-[#6ee7b7]" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Delta / Triangle Outline */}
                  <path 
                    d="M50 12 L86 82 L14 82 Z" 
                    stroke="url(#deltaGreenGrad)" 
                    strokeWidth="7" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                  />
                  {/* Horizontal crossbar */}
                  <line 
                    x1="32" 
                    y1="64" 
                    x2="68" 
                    y2="64" 
                    stroke="#34d399" 
                    strokeWidth="4" 
                    strokeLinecap="round" 
                    strokeOpacity="0.5"
                  />
                  {/* Glowing 4-point star in center */}
                  <path 
                    d="M50 34 Q50 50 36 50 Q50 50 50 66 Q50 50 64 50 Q50 50 50 34 Z" 
                    fill="url(#starGreenGrad)" 
                  />
                  <defs>
                    <linearGradient id="deltaGreenGrad" x1="14" y1="12" x2="86" y2="82" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#6ee7b7" />
                      <stop offset="0.5" stopColor="#34d399" />
                      <stop offset="1" stopColor="#059669" />
                    </linearGradient>
                    <linearGradient id="starGreenGrad" x1="36" y1="34" x2="64" y2="66" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#ffffff" />
                      <stop offset="1" stopColor="#34d399" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>

            {/* AURA-AI Text */}
            <h1 className="font-headline font-black text-3xl sm:text-5xl lg:text-5.5xl text-[#f8fafc] tracking-[0.22em] text-glow-green">
              AURA-AI
            </h1>
          </div>

          {/* Tagline */}
          <p className="font-body font-medium text-lg sm:text-xl lg:text-2xl text-emerald-100/95 leading-snug mb-6 tracking-wide">
            Accountability for autonomous capital intelligence
          </p>

          {/* Glowing Green Divider Line */}
          <div className="w-full max-w-md h-[1.5px] bg-gradient-to-r from-emerald-400/90 via-teal-300/60 to-transparent mb-6 relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-[2.5px] bg-[#34d399] shadow-[0_0_12px_#34d399]" />
          </div>

          {/* Sub-tagline: Analyze . Prove . Attest in Green */}
          <div className="flex items-center gap-3 sm:gap-4 font-headline font-bold text-sm sm:text-base tracking-[0.25em] text-emerald-200 uppercase mb-9">
            <span className="text-[#6ee7b7]">Analyze</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#34d399] shadow-[0_0_8px_#34d399]" />
            <span className="text-[#34d399]">Prove</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#34d399] shadow-[0_0_8px_#34d399]" />
            <span className="text-[#059669]">Attest</span>
          </div>

          {/* Get Started Button (Green theme) */}
          <div className="relative group cursor-pointer">
            {/* Ambient Background Glow */}
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 opacity-70 blur-lg group-hover:opacity-100 group-hover:scale-105 transition-all duration-300" />
            
            <button
              id="get-started-intro-btn"
              onClick={onGetStarted}
              className="relative px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-[#022318] border-2 border-emerald-400/90 hover:border-emerald-300 text-white font-headline font-bold text-base sm:text-lg flex items-center gap-4 sm:gap-5 shadow-[0_0_35px_rgba(16,185,129,0.65)] group-hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 cursor-pointer"
            >
              {/* Rocket Badge Circle */}
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-emerald-950/90 border border-emerald-400/60 flex items-center justify-center text-[#34d399] shadow-[0_0_15px_rgba(52,211,153,0.6)] group-hover:rotate-12 transition-transform duration-300">
                <Rocket className="w-4 h-4 sm:w-5 sm:h-5 text-[#f8fafc]" />
              </div>

              {/* Text */}
              <span className="tracking-wide">Get Started</span>

              {/* Arrow */}
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-[#34d399] group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Quick Metrics Badges */}
          <div className="flex flex-wrap items-center gap-3 mt-10 text-[11px] font-body font-semibold text-emerald-300/80">
            <span className="px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/30">
              6-Agent Autonomous Consensus
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/30">
              BOTChain Mainnet (677)
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/30">
              Zero-Custody Attestation
            </span>
          </div>

        </div>

        {/* RIGHT COLUMN: Autonomous Intelligence Terminal & Consensus Matrix (Replaces previous figure) */}
        <div className="w-full lg:w-1/2 flex items-center justify-center relative py-4">
          
          {/* Ambient Terminal Glow */}
          <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tr from-emerald-600/30 via-teal-500/20 to-emerald-400/10 blur-3xl animate-pulse pointer-events-none" />

          {/* Cyber Terminal Container */}
          <div className="relative w-full max-w-[500px] glass-panel-light rounded-3xl p-6 sm:p-7 border border-emerald-400/40 shadow-[0_0_40px_rgba(16,185,129,0.35)] flex flex-col gap-5">
            
            {/* Terminal Header */}
            <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-3 h-3 rounded-full bg-emerald-500/30 border border-emerald-400 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#34d399] animate-ping" />
                </div>
                <span className="font-data text-xs font-bold text-emerald-300 tracking-wider">
                  COMMITTEE_CORE :: LIVE_CONSENSUS
                </span>
              </div>

              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-[10px] font-mono font-bold text-[#34d399]">
                EPOCH #4,821
              </span>
            </div>

            {/* Live Quorum & Confidence Score Telemetry */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-500/30">
                <div className="text-[11px] font-semibold text-emerald-300/70 mb-1 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-[#34d399]" />
                  <span>Consensus Quorum</span>
                </div>
                <div className="font-data font-black text-xl text-white flex items-baseline gap-1.5">
                  <span>94.8%</span>
                  <span className="text-[10px] text-emerald-400 font-bold">SUPERMAJORITY</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-500/30">
                <div className="text-[11px] font-semibold text-emerald-300/70 mb-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#34d399]" />
                  <span>Execution Safety</span>
                </div>
                <div className="font-data font-black text-xl text-[#34d399] flex items-baseline gap-1.5">
                  <span>0.00%</span>
                  <span className="text-[10px] text-emerald-300/70 font-bold">DRAWDOWN SLIP</span>
                </div>
              </div>
            </div>

            {/* 6-Agent Node Consensus Pipeline */}
            <div className="flex flex-col gap-2">
              <div className="text-[11px] font-bold text-emerald-200 uppercase tracking-wider flex items-center justify-between">
                <span>Autonomous Agents Pipeline</span>
                <span className="font-mono text-[10px] text-emerald-400">6 / 6 ONLINE</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {agents.map((agent, i) => {
                  const isActive = activeStep === i;
                  return (
                    <div 
                      key={agent.name}
                      className={`p-2.5 rounded-xl border transition-all duration-300 ${
                        isActive 
                          ? 'bg-emerald-500/20 border-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.3)] scale-[1.02]' 
                          : 'bg-emerald-950/40 border-emerald-500/20 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-headline font-bold text-xs text-white truncate">
                          {agent.name}
                        </span>
                        <CheckCircle2 className={`w-3.5 h-3.5 ${isActive ? 'text-[#34d399]' : 'text-emerald-500/40'}`} />
                      </div>
                      <div className="text-[10px] font-mono text-emerald-300/70 truncate mt-0.5">
                        {agent.role}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Cryptographic Attestation Block */}
            <div className="p-3 rounded-2xl bg-[#021f15]/90 border border-emerald-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center text-[#34d399]">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-white">BOTChain Smart Contract</div>
                  <div className="font-mono text-[10px] text-emerald-300/80">0x8a92...4b12 · Verified</div>
                </div>
              </div>

              <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-1 rounded-lg border border-emerald-500/30">
                <Zap className="w-3 h-3 text-[#34d399]" />
                <span>Zero-Custody</span>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Footer Minimalist Legend */}
      <footer className="relative z-30 w-full px-6 sm:px-12 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-body text-emerald-300/70 border-t border-emerald-500/10">
        <div className="flex items-center gap-2">
          <span className="font-bold text-white">AURA-AI</span>
          <span>· Explainable Autonomous Treasury Consensus</span>
        </div>
        <div className="flex items-center gap-6 font-mono text-[11px]">
          <span>Target Contract: 0x8a92...4b12</span>
          <span>Chain ID: 677</span>
        </div>
      </footer>

    </div>
  );
};
