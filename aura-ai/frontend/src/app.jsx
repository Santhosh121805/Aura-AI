import Hero from './components/Hero.jsx';
import FlowDiagram from './components/FlowDiagram.jsx';
import FeatureGrid from './components/FeatureGrid.jsx';
import TerminalDemo from './components/TerminalDemo.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  return (
    <>
      <Hero />
      <FlowDiagram />
      <FeatureGrid />
      <section className="section">
        <TerminalDemo />
      </section>
      <Footer />
    </>
  );
}