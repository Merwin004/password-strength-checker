import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'motion/react';

const rules = [
  { id: 'length', label: 'Min 12 Characters', shortLabel: 'Length', test: (p: string) => p.length >= 12, meta: (p: string) => `${p.length}/12` },
  { id: 'uppercase', label: 'Capital Letters', shortLabel: 'Upper', test: (p: string) => /[A-Z]/.test(p), meta: (p: string) => /[A-Z]/.test(p) ? 'DETECTED' : 'MISSING' },
  { id: 'lowercase', label: 'Lowercase Letters', shortLabel: 'Lower', test: (p: string) => /[a-z]/.test(p), meta: (p: string) => /[a-z]/.test(p) ? 'DETECTED' : 'MISSING' },
  { id: 'number', label: 'Numerical Integrity', shortLabel: 'Number', test: (p: string) => /[0-9]/.test(p), meta: (p: string) => /[0-9]/.test(p) ? 'VALID' : 'INVALID' },
  { id: 'special', label: 'Special Symbols', shortLabel: 'Special', test: (p: string) => /[^A-Za-z0-9]/.test(p), meta: (p: string) => /[^A-Za-z0-9]/.test(p) ? 'DETECTED' : 'MISSING' },
];

function calculateEntropy(p: string): number {
  if (p.length === 0) return 0;
  let poolSize = 0;
  if (/[a-z]/.test(p)) poolSize += 26;
  if (/[A-Z]/.test(p)) poolSize += 26;
  if (/[0-9]/.test(p)) poolSize += 10;
  if (/[^A-Za-z0-9]/.test(p)) poolSize += 32; // rough approx
  if (poolSize === 0) return 0;
  return p.length * Math.log2(poolSize);
}

export default function App() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const allMet = rules.every(rule => rule.test(password));
  const metCount = rules.filter(r => r.test(password)).length;
  const entropy = calculateEntropy(password);

  const isInitial = password.length === 0;

  return (
    <div className="bg-slate-900 text-slate-100 font-sans min-h-screen flex flex-col items-center justify-center p-6 md:p-12 overflow-hidden selection:bg-emerald-500/30">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl"
      >
        <header className="mb-12 border-b border-slate-800 pb-8 flex justify-between items-end">
          <div>
            <h1 className="text-xs uppercase tracking-[0.4em] text-slate-500 font-semibold mb-2">Security Analysis</h1>
            <p className="text-3xl md:text-4xl font-light tracking-tight">Password Validator</p>
          </div>
          <div className="text-right hidden sm:block">
            {allMet ? (
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20 uppercase tracking-widest">System Active</span>
            ) : (
              <span className="text-[10px] bg-slate-800/50 text-slate-400 px-3 py-1 rounded-full border border-slate-700 uppercase tracking-widest">System Standby</span>
            )}
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Output Monitor Area */}
          <div className="lg:col-span-7 bg-slate-800/50 border border-slate-700 p-8 md:p-10 rounded-xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none"></div>
            
            <label className="block text-[10px] uppercase tracking-widest text-slate-400 mb-6">Input Monitor</label>
            <div className="relative z-10 group">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder=""
                className={`w-full bg-slate-900 border ${allMet ? 'border-emerald-500/50 focus:border-emerald-400' : 'border-slate-600 focus:border-slate-500'} text-white font-mono text-3xl md:text-5xl tracking-[0.2em] md:tracking-[0.5em] p-6 md:p-8 pr-16 md:pr-20 rounded-lg outline-none transition-colors duration-300 placeholder:text-slate-700`}
              />
              {!password && (
                <div className="absolute top-1/2 -translate-y-1/2 left-6 md:left-8 text-slate-700 font-mono text-3xl md:text-5xl tracking-[0.2em] md:tracking-[0.5em] pointer-events-none">
                  ••••••••
                </div>
              )}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 -translate-y-1/2 right-6 md:right-8 text-slate-600 hover:text-slate-400 transition-colors"
                title={showPassword ? 'Hide Input' : 'Show Input'}
              >
                {showPassword ? <EyeOff className="w-6 h-6 md:w-8 md:h-8" strokeWidth={1.5} /> : <Eye className="w-6 h-6 md:w-8 md:h-8" strokeWidth={1.5} />}
              </button>
            </div>
            <div className="mt-8 flex justify-between items-center text-[10px] md:text-xs text-slate-500 font-mono uppercase tracking-tighter">
              <span>Status: {allMet ? <span className="text-emerald-400">Verified</span> : 'Awaiting Input'}</span>
              <span className="hidden sm:inline">Buffer: Encrypted</span>
            </div>
          </div>

          {/* Validation Matrix */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            {rules.map((rule) => {
              const isMet = rule.test(password);

              return (
                <div 
                  key={rule.id} 
                  className={`bg-slate-800/30 border border-slate-700 p-5 md:p-6 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-opacity duration-500 ${
                    isInitial ? 'opacity-50' : isMet ? 'opacity-100' : 'opacity-80'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div 
                      className={`flex-shrink-0 w-2 h-2 rounded-full transition-all duration-300 ${
                        isInitial 
                          ? 'bg-slate-600' 
                          : isMet 
                            ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]' 
                            : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]'
                      }`}
                    ></div>
                    <span className="text-sm tracking-wide text-slate-200">{rule.label}</span>
                  </div>
                  <span 
                    className={`text-[10px] font-mono uppercase transition-colors duration-300 ${
                      isInitial 
                        ? 'text-slate-500' 
                        : isMet 
                          ? 'text-emerald-400' 
                          : 'text-rose-400/80'
                    }`}
                  >
                    {isInitial ? 'Pending' : rule.meta(password)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <footer className="mt-16 pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between gap-8 sm:gap-0">
          <div className="flex gap-8 sm:gap-12">
            <div>
              <div className="text-[10px] uppercase text-slate-600 tracking-widest mb-1">Entropy</div>
              <div className="text-xl font-light tracking-tight text-white">{entropy.toFixed(1)} bits</div>
            </div>
            <div>
              <div className="text-[10px] uppercase text-slate-600 tracking-widest mb-1">Strength</div>
              <div className={`text-xl font-light tracking-tight transition-colors duration-300 ${allMet ? 'text-emerald-400' : (metCount > 2 ? 'text-amber-400' : 'text-slate-400')}`}>
                {isInitial ? 'Unknown' : allMet ? 'Reliable' : (metCount > 2 ? 'Moderate' : 'Weak')}
              </div>
            </div>
          </div>
          <div className="flex items-center w-full sm:w-auto">
            <div className="w-full sm:w-48 xl:w-64 h-1 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ease-out ${allMet ? 'bg-emerald-500' : 'bg-slate-500'}`}
                style={{ width: `${isInitial ? 0 : (metCount / rules.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </footer>
      </motion.div>
    </div>
  );
}
