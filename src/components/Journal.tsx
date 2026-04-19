import React from 'react';
import { Trade } from '../types';
import { format } from 'date-fns';
import { Search, Filter, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function Journal({ trades }: { trades: Trade[] }) {
  return (
    <div className="flex flex-col gap-6">
      {/* Filters Bar */}
      <div className="flex justify-between items-center border border-line bg-white p-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 border-r border-line pr-6">
            <Search className="w-4 h-4 opacity-40" />
            <input 
              type="text" 
              placeholder="Search Symbol..." 
              className="bg-transparent border-none outline-none text-[11px] font-mono placeholder:opacity-30"
            />
          </div>
          <div className="flex gap-4">
            {['All Trades', 'Live Only', 'Paper Only', 'Winners'].map((f) => (
              <button key={f} className="text-[10px] font-bold uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity">
                {f}
              </button>
            ))}
          </div>
        </div>
        <button className="flex items-center gap-2 bg-ink text-bg px-4 py-2 text-[10px] font-bold uppercase tracking-wider">
          <Filter className="w-3.5 h-3.5" />
          More Filters
        </button>
      </div>

      {/* Main Journal Table */}
      <div className="border border-line bg-white overflow-hidden">
        <div className="grid grid-cols-[80px_1fr_1fr_1fr_1fr_1.5fr] bg-ink text-bg text-[10px] font-bold uppercase tracking-widest">
          <div className="p-4 border-r border-line/20">Date</div>
          <div className="p-4 border-r border-line/20">Symbol</div>
          <div className="p-4 border-r border-line/20">Direction</div>
          <div className="p-4 border-r border-line/20">PnL ($)</div>
          <div className="p-4 border-r border-line/20">Mode</div>
          <div className="p-4">Strategy / Signals</div>
        </div>

        {trades.length === 0 ? (
          <div className="p-20 text-center opacity-30 select-none">
            <p className="text-sm font-black tracking-tighter uppercase mb-2">The Archive is Empty</p>
            <p className="text-[10px] uppercase tracking-widest">Log signals via webhook or manual entry to start compounding edge.</p>
          </div>
        ) : (
          trades.map((trade) => (
            <div key={trade.id} className="data-row">
              <div className="px-4 py-2 flex items-center">{format(new Date(trade.date), 'MM/dd')}</div>
              <div className="px-4 py-2 flex items-center gap-2">
                <span className="font-black tracking-tighter">{trade.symbol}</span>
              </div>
              <div className="px-4 py-2 flex items-center">
                {trade.direction === 'LONG' ? (
                  <span className="flex items-center gap-1 text-green-600 font-bold">
                    <ArrowUpRight className="w-3 h-3" /> LONG
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-red-600 font-bold">
                    <ArrowDownRight className="w-3 h-3" /> SHORT
                  </span>
                )}
              </div>
              <div className={`px-4 py-2 flex items-center font-mono font-bold ${trade.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {trade.pnl >= 0 ? '+' : ''}{trade.pnl.toFixed(2)}
              </div>
              <div className="px-4 py-2 flex items-center">
                <span className="text-[9px] font-mono border border-line/20 px-2 py-0.5 rounded-full">{trade.mode}</span>
              </div>
              <div className="px-4 py-2 flex items-center text-[10px] opacity-60">
                {trade.strategy}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
