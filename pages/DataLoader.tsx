
import React, { useState } from 'react';

const DataLoader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<{ success: number; failed: number } | null>(null);

  const handleUpload = () => {
    if (!file) return;
    setIsUploading(true);
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setResults({ success: 142, failed: 3 });
          return 100;
        }
        return prev + 5;
      });
    }, 150);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-900">Bulk Data Loader</h1>
        <p className="text-slate-500 mt-2">Upload JSON or CSV files to batch update Mutual Funds and Schemes.</p>
      </div>

      <div className="bg-white border-2 border-dashed border-slate-300 rounded-2xl p-12 text-center space-y-4 hover:border-indigo-400 transition-colors">
        <div className="text-5xl text-slate-300 mb-2">📁</div>
        <div>
          <input 
            type="file" 
            id="fileInput"
            className="hidden" 
            onChange={(e) => setFile(e.target.files?.[0] || null)} 
          />
          <label 
            htmlFor="fileInput"
            className="cursor-pointer bg-slate-50 px-6 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-100 transition-all inline-block"
          >
            {file ? file.name : 'Select Data File'}
          </label>
        </div>
        <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Supported: .csv, .json (Max 50MB)</p>
      </div>

      {file && !isUploading && !results && (
        <div className="flex justify-center">
          <button 
            onClick={handleUpload}
            className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-lg transition-transform hover:scale-105 active:scale-95"
          >
            Start Ingestion Process
          </button>
        </div>
      )}

      {isUploading && (
        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-slate-700">Validating & Injecting Records...</span>
            <span className="text-sm font-mono text-indigo-600">{progress}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden">
            <div 
              className="bg-indigo-600 h-full transition-all duration-300 ease-out" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            Processing chunks 10-24...
          </div>
        </div>
      )}

      {results && (
        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm animate-fadeIn">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xl">✓</div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Ingestion Complete</h3>
              <p className="text-sm text-slate-500">Operations finalized with the following statistics:</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-100">
              <span className="block text-xs font-bold text-emerald-700 uppercase mb-1">Success</span>
              <span className="text-2xl font-bold text-emerald-900">{results.success} Records</span>
            </div>
            <div className="p-4 rounded-lg bg-rose-50 border border-rose-100">
              <span className="block text-xs font-bold text-rose-700 uppercase mb-1">Failed</span>
              <span className="text-2xl font-bold text-rose-900">{results.failed} Records</span>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-slate-100">
             <button 
              onClick={() => { setResults(null); setFile(null); }}
              className="text-indigo-600 text-sm font-bold hover:underline"
             >
               ← Process Another Batch
             </button>
          </div>
        </div>
      )}

      <div className="p-6 bg-slate-900 text-slate-400 rounded-xl font-mono text-xs overflow-x-auto">
        <h4 className="text-slate-300 mb-2 font-bold">// Required Schema Format Example</h4>
        <pre>{`{
  "funds": [
    {
      "name": "string",
      "amc": "string",
      "schemes": [
        { "name": "string", "nav": number }
      ]
    }
  ]
}`}</pre>
      </div>
    </div>
  );
};

export default DataLoader;
