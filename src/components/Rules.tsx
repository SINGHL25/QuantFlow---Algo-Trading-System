import React from 'react';
import { Shield, AlertTriangle, Crosshair, Thermometer } from 'lucide-react';

export default function Rules() {
  const rules = [
    {
      title: 'Risk Per Trade',
      value: '1.0%',
      desc: 'Based on ATR distance from entry to stop loss.',
      icon: Crosshair
    },
    {
      title: 'Max Daily Loss',
      value: '3.0%',
      desc: 'Hard stop trading if aggregate loss exceeds this threshold.',
      icon: AlertTriangle
    },
    {
      title: 'Max Open Positions',
      value: '2',
      desc: 'To prevent over-exposure and correlation risk.',
      icon: Shield
    },
    {
      title: 'Volatility Floor',
      value: '0.8 ATR',
      desc: 'Reject signals if current volatility is below baseline.',
      icon: Thermometer
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black tracking-tighter uppercase">Risk Control Engine</h2>
        <p className="text-[11px] uppercase tracking-[0.2em] font-bold opacity-40">Systemic Safeguards for Preservation of Capital</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rules.map((rule, idx) => (
          <div key={idx} className="border border-line bg-white p-8 group hover:bg-ink hover:text-bg transition-colors duration-300">
            <div className="flex justify-between items-start mb-6">
              <rule.icon className="w-6 h-6 text-accent" />
              <span className="text-xs font-mono opacity-40">0{idx + 1}</span>
            </div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-1 opacity-60 group-hover:opacity-40 transition-opacity">{rule.title}</h3>
            <p className="text-4xl font-black tracking-tighter mb-4">{rule.value}</p>
            <p className="text-[11px] leading-relaxed opacity-60">{rule.desc}</p>
          </div>
        ))}
      </div>

      <div className="border border-line border-dashed p-8 bg-white/50 space-y-4">
        <h4 className="text-[10px] font-bold uppercase tracking-widest opacity-40">Middleware Verification Logic</h4>
        <pre className="text-[11px] font-mono leading-tight overflow-x-auto p-4 bg-ink/5 border border-line/10">
{`def check_risk(signal, state):
    if state.daily_loss > MAX_DAILY_LOSS:
        return Reject("Hard stop triggered")
    if state.open_positions >= MAX_POS:
        return Reject("Cap reached")
    
    size = calculate_position_size(signal.atr, risk=0.01)
    return size`}
        </pre>
      </div>
    </div>
  );
}
