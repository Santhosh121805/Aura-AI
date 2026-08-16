import React, { useState, useEffect } from 'react';
import { WalletProvider, useWallet } from './lib/walletContext';
import { DecisionReceipt, FinalDecision, TxProgressState } from './types';
import { getStoredReceipts, publishDecisionToContract } from './lib/contract';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { FlowSection } from './components/FlowSection';
import { FeaturesSection } from './components/FeaturesSection';
import { LiveAnalysisSection } from './components/LiveAnalysisSection';
import { ReviewPublishModal } from './components/ReviewPublishModal';
import { TransactionProgressPanel } from './components/TransactionProgressPanel';
import { MyDecisionReceipts } from './components/MyDecisionReceipts';
import { WalletModal } from './components/WalletModal';
import { DocsModal } from './components/DocsModal';
import { Footer } from './components/Footer';

function MainApp() {
  const { wallet, setIsWalletModalOpen } = useWallet();
  const [receipts, setReceipts] = useState<DecisionReceipt[]>([]);
  const [activeDecision, setActiveDecision] = useState<FinalDecision | null>(null);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isDocsModalOpen, setIsDocsModalOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const [txState, setTxState] = useState<TxProgressState>({
    step: 'idle',
  });

  // Load historical and stored receipts on mount
  useEffect(() => {
    const stored = getStoredReceipts();
    setReceipts(stored);
  }, []);

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenReceipts = () => {
    handleScrollTo('receipts');
  };

  const handleStartAnalysisClick = () => {
    handleScrollTo('live');
    if (!wallet.isConnected) {
      setIsWalletModalOpen(true);
    }
  };

  const handleReviewPublish = (decision: FinalDecision) => {
    setActiveDecision(decision);
    setIsPublishModalOpen(true);
  };

  const handleConfirmPublish = async () => {
    if (!activeDecision) return;

    if (!wallet.isConnected) {
      setIsPublishModalOpen(false);
      setIsWalletModalOpen(true);
      return;
    }

    setIsPublishing(true);
    setIsPublishModalOpen(false);

    // State 1: Waiting for wallet approval
    setTxState({
      step: 'waiting_approval',
    });

    try {
      // Simulate signature / submission delay
      await new Promise((r) => setTimeout(r, 900));

      // State 2: Transaction Submitted
      const simulatedHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      setTxState({
        step: 'submitted',
        txHash: simulatedHash,
      });

      // Send to contract helper
      const result = await publishDecisionToContract(activeDecision, wallet.address || '0x71C...38A4');

      // State 3: Confirmed & Approved
      setTxState({
        step: 'confirmed',
        txHash: result.txHash,
        decisionHash: result.decisionHash,
        blockNumber: result.blockNumber,
        receipt: result.receipt,
      });

      // Update receipts state
      setReceipts((prev) => [result.receipt, ...prev.filter((r) => r.id !== result.receipt.id)]);
    } catch (err: any) {
      console.error('Publish transaction failed:', err);
      setTxState({
        step: 'failed',
        error: err?.message || 'Transaction rejected by wallet or RPC timeout.',
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const handleResetTx = () => {
    setTxState({ step: 'idle' });
  };

  const handleViewPublishedReceipt = () => {
    setTxState({ step: 'idle' });
    handleScrollTo('receipts');
  };

  return (
    <div className="relative min-h-screen bg-[#050807] text-[#f8fafc] font-body selection:bg-emerald-600/40">
      
      {/* Subtle, crystal-clear background atmosphere without intrusive video */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-emerald-500/5 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-emerald-600/5 rounded-full blur-[160px]" />
        <div className="absolute bottom-1/4 left-1/3 w-[600px] h-[400px] bg-emerald-500/4 rounded-full blur-[150px]" />
      </div>

      {/* Floating Top Navbar */}
      <Navbar
        onOpenReceipts={handleOpenReceipts}
        onOpenDocs={() => setIsDocsModalOpen(true)}
        onScrollTo={handleScrollTo}
      />

      {/* Main Content Area */}
      <main className="relative z-10 animate-fade-in">
        {/* 1. Hero Section: Left Headline & CTA + Right Video Artwork Showcase */}
        <HeroSection
          onRunAnalysis={handleStartAnalysisClick}
          onOpenDocs={() => setIsDocsModalOpen(true)}
        />

        {/* 2. Flow Section (Simplified, clean, highly readable) */}
        <FlowSection />

        {/* 3. Features Section (Simplified grid) */}
        <FeaturesSection />

        {/* 4. Live Analysis & Decision Receipt Section */}
        <LiveAnalysisSection
          onReviewPublish={handleReviewPublish}
        />

        {/* 5. My Decision Receipts Section */}
        <MyDecisionReceipts
          receipts={receipts}
          onTriggerAnalysis={handleStartAnalysisClick}
        />
      </main>

      {/* Footer */}
      <Footer />

      {/* Review & Publish Modal */}
      <ReviewPublishModal
        decision={activeDecision}
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        onConfirmPublish={handleConfirmPublish}
        isPublishing={isPublishing}
      />

      {/* Transaction Progress Panel */}
      <TransactionProgressPanel
        txState={txState}
        onViewReceipt={handleViewPublishedReceipt}
        onReset={handleResetTx}
        onRetry={handleConfirmPublish}
      />

      {/* Reown-Style Multi-Wallet Modal */}
      <WalletModal />

      {/* Docs / Skill Spec Modal */}
      <DocsModal
        isOpen={isDocsModalOpen}
        onClose={() => setIsDocsModalOpen(false)}
      />

    </div>
  );
}

export default function App() {
  return (
    <WalletProvider>
      <MainApp />
    </WalletProvider>
  );
}
