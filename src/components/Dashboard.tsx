import React from 'react';
import { Signal } from '../types';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { Activity, Zap, Info } from 'lucide-react';

const mockChartData = [
  { time: '09:30', price: 150.2 },
  { time: '10:00', price: 151.5 },
  { time: '10:30', price: 151.2 },
  { time: '11:00', price: 152.8 },
  { time: '11:30', price: 153.1 },
  { time: '12:00', price: 152.9 },
  { time: '12:30', price: 154.2 },
  { time: '13:00', price: 155.0 },
];

export default function Dashboard({ signals }: { signals: Signal[] }) {
  return (
    <div className="grid grid-cols-12 gap-8">
      {/* Visual Header Stats */}
      <div className="col-span-12 grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Market Regime', value: 'Trending / High Vol', detail: 'ADX: 28 / ATR: 2.4' },
          { label: 'Today P&L', value: '+$1,240.50', detail: '+1.2% Day Change' },
          { label: 'Open Positions', value: '2', detail: 'BTC/USD, AAPL' },
          { label: 'System Edge', value: '62%', detail: 'Avg Win Rate (30d)' },
        ].map((item, i) => (
          <div key={i} className="border border-line p-6 bg-white">
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-2">{item.label}</p>
            <p className="text-2xl font-black tracking-tighter">{item.value}</p>
            <p className="text-[10px] opacity-60 font-mono mt-1">{item.detail}</p>
          </div>
        ))}
      </div>

      {/* Main Chart Area */}
      <div className="col-span-12 lg:col-span-8 border border-line bg-white p-6 h-[400px]">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            <h2 className="text-xs font-bold uppercase tracking-wider">Market Dynamics (Benchmark)</h2>
          </div>
          <div className="flex gap-4 text-[9px] font-mono opacity-50">
            <span>VOL: 2M</span>
            <span>VWAP: 152.4</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height="85%">
          <AreaChart data={mockChartData}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#141414" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#141414" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E4E3E0" />
            <XAxis 
              dataKey="time" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 9, fontFamily: 'JetBrains Mono' }} 
            />
            <YAxis 
              domain={['auto', 'auto']} 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 9, fontFamily: 'JetBrains Mono' }} 
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#141414', color: '#E4E3E0', border: 'none', fontSize: '10px', fontFamily: 'JetBrains Mono' }}
              itemStyle={{ color: '#F27D26' }}
            />
            <Area type="monotone" dataKey="price" stroke="#141414" fillOpacity={1} fill="url(#colorPrice)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Side Signal Stream */}
      <div className="col-span-12 lg:col-span-4 border border-line bg-white flex flex-col">
        <div className="p-4 border-b border-line bg-ink text-bg flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-accent" />
            <h2 className="text-[10px] font-bold uppercase tracking-widest">Live Signal Feed</h2>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[8px] font-mono">LIVE</span>
          </div>
        </div>
        <div className="flex-1 overflow-auto max-h-[352px]">
          {signals.length === 0 ? (
            <div className="h-full flex items-center justify-center p-8 opacity-30 text-center">
              <p className="text-[10px] uppercase font-bold tracking-widest">Waiting for webhook triggers...</p>
            </div>
          ) : (
            signals.map((sig, idx) => (
              <div key={idx} className="p-4 border-b border-line hover:bg-bg/10 transition-colors">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs font-black tracking-tighter">{sig.symbol}</span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 ${sig.action === 'BUY' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {sig.action}
                  </span>
                </div>
                <div className="flex justify-between text-[9px] font-mono opacity-50">
                  <span>Price: {sig.price}</span>
                  <span>Score: <span className={sig.score >= 6 ? 'font-bold text-ink' : ''}>{sig.score}/8</span></span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
