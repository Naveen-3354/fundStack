import React, { useState } from 'react';
import { apiService } from '../services/apiService';
import { RiskLevel, SchemeType } from '../types';

type Action =
  | {
      action: 'CREATE_FUND';
      data: {
        name?: string;
        amcName?: string;
        category?: string;
        aum?: number;
        foundedDate?: string;
        active?: boolean;
      };
    }
  | {
      action: 'CREATE_SCHEME';
      data: {
        fundName?: string;
        name?: string;
        type?: SchemeType;
        riskLevel?: RiskLevel;
        nav?: number;
        expenseRatio?: number;
        returns1Y?: number;
        returns3Y?: number;
      };
    };

const parseInstruction = (instruction: string): Action[] => {
  // Supports either strict JSON array of actions, or one simple shorthand command.
  const trimmed = instruction.trim();

  if (trimmed.startsWith('[')) {
    const parsed = JSON.parse(trimmed);
    return Array.isArray(parsed) ? parsed : [];
  }

  // Simple fallback command parsing for local/offline mode
  // Format: fund:<name>,amc:<amc>,category:<category>,aum:<number>
  if (trimmed.toLowerCase().startsWith('fund:')) {
    const parts = trimmed.split(',').map((p) => p.trim());
    const map = new Map<string, string>();
    parts.forEach((part) => {
      const [k, ...rest] = part.split(':');
      if (!k || rest.length === 0) return;
      map.set(k.toLowerCase(), rest.join(':').trim());
    });

    return [
      {
        action: 'CREATE_FUND',
        data: {
          name: map.get('fund') || 'Untitled Fund',
          amcName: map.get('amc') || 'Generic AMC',
          category: map.get('category') || 'Equity',
          aum: Number(map.get('aum') || 0),
          foundedDate: new Date().toISOString().split('T')[0],
          active: true,
        },
      },
    ];
  }

  return [];
};

const InstructionConsole: React.FC<{ onActionComplete: () => void }> = ({ onActionComplete }) => {
  const [instruction, setInstruction] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  const processInstruction = async () => {
    if (!instruction.trim()) return;
    setLoading(true);
    setMessage({ text: 'Processing instruction locally...', type: 'info' });

    try {
      const actions = parseInstruction(instruction);

      if (!actions || actions.length === 0) {
        throw new Error(
          'No valid action found. Provide a JSON action array or shorthand like: fund:HDFC Flexi,amc:HDFC AMC,category:Equity,aum:12000',
        );
      }

      for (const item of actions) {
        if (item.action === 'CREATE_FUND') {
          await apiService.createFund({
            name: item.data.name || 'Untitled Fund',
            amcName: item.data.amcName || 'Generic AMC',
            category: item.data.category || 'Equity',
            aum: item.data.aum || 0,
            foundedDate: item.data.foundedDate || new Date().toISOString().split('T')[0],
            active: item.data.active ?? true,
          });
        } else if (item.action === 'CREATE_SCHEME') {
          const currentFunds = await apiService.getFunds(1, 100);
          const fund = currentFunds.data.find((f) =>
            f.name.toLowerCase().includes(item.data.fundName?.toLowerCase() || ''),
          );

          if (!fund) {
            throw new Error('Fund not found for scheme creation. Create fund first or provide a valid fundName.');
          }

          await apiService.createScheme({
            fundId: fund.id,
            name: item.data.name || 'Growth Plan',
            type: item.data.type || SchemeType.OPEN_ENDED,
            riskLevel: item.data.riskLevel || RiskLevel.MODERATE,
            nav: item.data.nav || 10,
            expenseRatio: item.data.expenseRatio || 1,
            returns1Y: item.data.returns1Y || 0,
            returns3Y: item.data.returns3Y || 0,
          });
        }
      }

      setInstruction('');
      setMessage({ text: 'Instruction processed successfully!', type: 'success' });
      onActionComplete();
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      setMessage({ text: error.message || 'Error processing instruction.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 pt-8 border-t border-slate-800 px-3">
      <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Command Console (Offline Mode)</h4>
      <div className="relative group">
        <textarea
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          placeholder='JSON actions or shorthand: fund:HDFC Flexi,amc:HDFC AMC,category:Equity,aum:12000'
          className="w-full bg-slate-800/50 border border-slate-700 rounded-lg p-3 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all min-h-[80px] resize-none"
        />
        <button
          onClick={processInstruction}
          disabled={loading || !instruction}
          className="absolute bottom-2 right-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 text-white p-1.5 rounded-md transition-colors shadow-lg"
        >
          {loading ? (
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          )}
        </button>
      </div>
      {message && (
        <div
          className={`mt-2 text-[10px] px-2 py-1 rounded flex items-center gap-2 ${
            message.type === 'success'
              ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-800'
              : message.type === 'error'
                ? 'bg-rose-900/30 text-rose-400 border border-rose-800'
                : 'bg-indigo-900/30 text-indigo-400 border border-indigo-800'
          }`}
        >
          <div className={`w-1 h-1 rounded-full ${message.type === 'info' ? 'animate-pulse bg-indigo-400' : 'bg-current'}`}></div>
          {message.text}
        </div>
      )}
    </div>
  );
};

export default InstructionConsole;
