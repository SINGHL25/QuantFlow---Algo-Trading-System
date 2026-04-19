import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  BookOpen, 
  Settings, 
  Activity, 
  AlertTriangle,
  ChevronRight,
  Plus,
  BarChart2,
  Brain
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';
import { Trade, Signal } from './types.ts';
import { analyzePerformance } from './services/geminiService.ts';

// Components
import Dashboard from './components/Dashboard.tsx';
import Journal from './components/Journal.tsx';
import Rules from './components/Rules.tsx';
import AIInsights from './components/AIInsights.tsx';

const socket = io();

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'journal' | 'rules'>('dashboard');
  const [signals, setSignals] = useState<Signal[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    // Listen for real-time signals
    socket.on('signal', (signal: Signal) => {
      setSignals(prev => [signal, ...prev].slice(0, 10));
    });

    // Initial data fetch
    fetch('/api/journal')
      .then(res => res.json())
      .then(setTrades);

    return () => {
      socket.off('signal');
    };
  }, []);

  const handleAIAnalyze = async () => {
    setIsAnalyzing(true);
    const result = await analyzePerformance(trades);
    setAiAnalysis(result || '');
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-accent selection:text-white">
      {/* Header */}
      <header className="border-b border-line p-6 flex justify-between items-center bg-white sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-ink flex items-center justify-center">
            <TrendingUp className="text-bg w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold tracking-tighter uppercase">QuantFlow <span className="text-accent">Sys</span></h1>
        </div>
        
        <nav className="flex gap-8">
          {[
            { id: 'dashboard', icon: Activity, label: 'Live Desk' },
            { id: 'journal', icon: BookOpen, label: 'Trade Journal' },
            { id: 'rules', icon: Settings, label: 'Risk Engine' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-widest transition-opacity ${
                activeTab === tab.id ? 'opacity-100 underline underline-offset-8' : 'opacity-40 hover:opacity-60'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button 
            onClick={handleAIAnalyze}
            disabled={isAnalyzing}
            className="flex items-center gap-2 bg-ink text-bg px-4 py-2 text-[10px] font-bold uppercase tracking-wider hover:bg-accent transition-colors disabled:opacity-50"
          >
            <Brain className="w-3.5 h-3.5" />
            {isAnalyzing ? 'Processing...' : 'AI Performance Deep-Dive'}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 overflow-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Dashboard signals={signals} />
            </motion.div>
          )}
          {activeTab === 'journal' && (
            <motion.div
              key="journal"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Journal trades={trades} />
            </motion.div>
          )}
          {activeTab === 'rules' && (
            <motion.div
              key="rules"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Rules />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* AI Sidebar/Modal Overlay */}
      <AnimatePresence>
        {aiAnalysis && (
          <motion.div 
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed right-0 top-0 bottom-0 w-[400px] bg-white border-l border-line p-8 shadow-2xl z-20 overflow-auto"
          >
            <AIInsights analysis={aiAnalysis} onClose={() => setAiAnalysis('')} />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Footer Info */}
      <footer className="p-4 border-t border-line text-[9px] uppercase tracking-widest opacity-40 flex justify-between">
        <span>System Status: Local Persistence / WebSockets Active</span>
        <span>QuantFlow Engine v1.0.4 - Built for Decision Control</span>
      </footer>
    </div>
  );
}
