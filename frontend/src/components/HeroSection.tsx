import React, { useEffect, useRef, useState } from 'react';
import { Play } from 'lucide-react';
import { VIDEO_CONFIG } from '../lib/constants';
import { Button } from './ui/Button';
import { Eyebrow } from './ui/Eyebrow';

interface HeroSectionProps {
  onRunAnalysis: () => void;
  onOpenDocs: () => void;
}

type VideoStatus = 'loading' | 'playing' | 'error';

export const HeroSection: React.FC<HeroSectionProps> = ({ onRunAnalysis, onOpenDocs }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [videoStatus, setVideoStatus] = useState<VideoStatus>('loading');
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Autoplay via the `autoplay` attribute doesn't give us a promise to catch,
  // so call play() ourselves once to detect a browser autoplay block and
  // offer a manual control — never fall back to permanently hiding the video.
  useEffect(() => {
    const v = videoRef.current;
    if (!v || reducedMotion) return;
    const playPromise = v.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => setAutoplayBlocked(true));
    }
  }, [reducedMotion]);

  const handleManualPlay = () => {
    videoRef.current
      ?.play()
      .then(() => setAutoplayBlocked(false))
      .catch((err) => console.warn('Manual video play failed:', err));
  };

  return (
    <section id="hero" className="relative min-h-[92vh] flex items-center px-6 lg:px-8 pt-28 pb-16">
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left: copy */}
        <div className="lg:col-span-6 flex flex-col items-start text-left animate-reveal">
          <Eyebrow className="mb-6">Explainable on-chain intelligence</Eyebrow>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight text-[#F3F1EA] mb-6 max-w-xl">
            Market intelligence that explains its decisions.
          </h1>

          <p className="text-base sm:text-lg text-[#F3F1EA]/70 leading-relaxed max-w-lg mb-9">
            Aura-AI brings six specialist agents together to analyze market signals, measure risk, and publish verifiable Decision Receipts on BOTChain.
          </p>

          <div className="flex flex-wrap items-center gap-6 mb-10">
            <Button onClick={onRunAnalysis}>Run Live Analysis</Button>
            <button onClick={onOpenDocs} className="text-sm text-[#F3F1EA]/70 underline-offset-4 hover:underline hover:text-[#31E6A1] transition-colors">
              See how it works
            </button>
          </div>

          <p className="text-xs text-[#F3F1EA]/45 font-data">
            Six specialist agents · Human-approved publishing · BOTChain Mainnet
          </p>
        </div>

        {/* Right: video — a static poster is only shown while loading, on a
            genuine playback error, or when the user has reduced motion on. */}
        <div className="lg:col-span-6 relative">
          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-[#141715]">
            {reducedMotion ? (
              <img src={VIDEO_CONFIG.poster} alt="Aura-AI decision agent" className="w-full h-full object-cover" loading="lazy" />
            ) : (
              <>
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  poster={VIDEO_CONFIG.poster}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  aria-label="Aura-AI decision agent animation"
                  onCanPlay={() => setVideoStatus((s) => (s === 'error' ? s : 'loading'))}
                  onPlaying={() => { setVideoStatus('playing'); setAutoplayBlocked(false); }}
                  onError={() => setVideoStatus('error')}
                >
                  <source src={VIDEO_CONFIG.url} type="video/mp4" />
                  <source src={VIDEO_CONFIG.webmUrl} type="video/webm" />
                </video>

                {autoplayBlocked && videoStatus !== 'error' && (
                  <button
                    onClick={handleManualPlay}
                    className="absolute inset-0 flex items-center justify-center gap-2 bg-[#0B0D0C]/50 text-[#F3F1EA] text-sm font-medium"
                  >
                    <Play className="w-5 h-5 fill-current" aria-hidden="true" />
                    Play animation
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
