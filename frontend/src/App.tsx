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
import { DocsModal } from './components/DocsModal';
import { Footer } from './components/Footer';

function MainApp() {
  const { wallet, setIsWalletModalOpen, getSigner } = useWallet();
  const [receipts, setReceipts] = useState<DecisionReceipt[]>([]);
  const [activeDecision, setActiveDecision] = useState<FinalDecision | null>(null);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isDocsModalOpen, setIsDocsModalOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const [txState, setTxState] = useState<TxProgressState>({ step: 'idle' });

  useEffect(() => {
    setReceipts(getStoredReceipts());
  }, []);

  const handleScrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOpenReceipts = () => handleScrollTo('receipts');

  const handleStartAnalysisClick = () => {
    handleScrollTo('live');
    if (!wallet.isConnected) setIsWalletModalOpen(true);
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
    setTxState({ step: 'waiting_approval' });

    try {
      const signer = await getSigner();
      const result = await publishDecisionToContract(
        signer,
        activeDecision,
        wallet.address || '',
        (txHash) => setTxState({ step: 'submitted', txHash })
      );

      setTxState({
        step: 'confirmed',
        txHash: result.txHash,
        decisionHash: result.decisionHash,
        blockNumber: result.blockNumber,
        receipt: result.receipt,
      });

      setReceipts((prev) => [result.receipt, ...prev.filter((r) => r.id !== result.receipt.id)]);
    } catch (err: any) {
      console.error('Publish transaction failed:', err);
      setTxState({
        step: 'failed',
        error: err?.code === 4001 || err?.code === 'ACTION_REJECTED'
          ? 'Transaction rejected in wallet.'
          : (err?.shortMessage || err?.reason || err?.message || 'Transaction failed.'),
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const handleResetTx = () => setTxState({ step: 'idle' });

  const handleViewPublishedReceipt = () => {
    setTxState({ step: 'idle' });
    handleScrollTo('receipts');
  };

  return (
    <div className="relative min-h-screen bg-[#0B0D0C] text-[#F3F1EA]">
      <Navbar
        onOpenReceipts={handleOpenReceipts}
        onOpenDocs={() => setIsDocsModalOpen(true)}
        onScrollTo={handleScrollTo}
      />

      <main>
        <HeroSection onRunAnalysis={handleStartAnalysisClick} onOpenDocs={() => setIsDocsModalOpen(true)} />
        <FlowSection />
        <FeaturesSection />
        <LiveAnalysisSection onReviewPublish={handleReviewPublish} />
        <MyDecisionReceipts receipts={receipts} onTriggerAnalysis={handleStartAnalysisClick} />
      </main>

      <Footer />

      <ReviewPublishModal
        decision={activeDecision}
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        onConfirmPublish={handleConfirmPublish}
        isPublishing={isPublishing}
      />

      <TransactionProgressPanel
        txState={txState}
        onViewReceipt={handleViewPublishedReceipt}
        onReset={handleResetTx}
        onRetry={handleConfirmPublish}
      />

      <DocsModal isOpen={isDocsModalOpen} onClose={() => setIsDocsModalOpen(false)} />
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
