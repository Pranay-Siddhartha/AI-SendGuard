'use client';
import { useState } from 'react';
import FileUpload from '@/components/ui/FileUpload';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ShieldAlert, AlertTriangle, Play, Loader2, User, Users } from 'lucide-react';
import { analyzeFile } from '@/lib/api';
import { AnalysisResult } from '@/lib/types';
import RiskGauge from '@/components/ui/RiskGauge';

export default function AnalyzePage() {
  const [file, setFile] = useState<File | null>(null);
  const [sender, setSender] = useState('');
  const [recipient, setRecipient] = useState('');
  const [recipientType, setRecipientType] = useState<'single' | 'group'>('single');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!file) {
      setError('Please select a file first.');
      return;
    }
    setError('');
    setLoading(true);
    setResult(null);
    try {
      const res = await analyzeFile(file, 'user@company.com', 'unknown@external.com', recipientType);
      setResult(res);
    } catch (err: any) {
      setError(err.message || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-bold text-white mb-2">New Analysis</h1>
        <p className="text-text-secondary">Upload a file and specify sender/recipient to scan for sensitive data.</p>
      </div>

      {!result && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <FileUpload onFileSelect={setFile} selectedFile={file} />

          {file && (
            <div className="glass-card p-6 space-y-6">

              {/* Recipient Type Toggle */}
              <div>
                <label className="text-sm font-medium text-text-secondary mb-3 block">Recipient Type</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setRecipientType('single')}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 border ${
                      recipientType === 'single'
                        ? 'bg-primary/20 border-primary text-white shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                        : 'bg-cards border-border text-text-secondary hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <User className="w-4 h-4" />
                    Single
                  </button>
                  <button
                    type="button"
                    onClick={() => setRecipientType('group')}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 border ${
                      recipientType === 'group'
                        ? 'bg-secondary/20 border-secondary text-white shadow-[0_0_15px_rgba(139,92,246,0.2)]'
                        : 'bg-cards border-border text-text-secondary hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    Group
                  </button>
                </div>
              </div>

              {error && <p className="text-danger text-sm">{error}</p>}
              
              <button 
                onClick={handleAnalyze} 
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-secondary text-white font-medium py-4 rounded-xl hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5 fill-current" />}
                {loading ? 'Analyzing...' : 'Start AI Analysis'}
              </button>
            </div>
          )}
        </motion.div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
            <div className="absolute inset-2 rounded-full border-4 border-secondary/20 border-t-secondary animate-spin-reverse" />
          </div>
          <p className="text-lg font-medium text-white animate-pulse">Running semantic risk detection...</p>
        </div>
      )}

      <AnimatePresence>
        {result && !loading && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-heading font-bold text-white">Analysis Complete</h2>
              <button onClick={() => { setResult(null); setFile(null); setRecipientType('single'); }} className="px-4 py-2 text-sm rounded-lg border border-border hover:bg-white/5 transition-colors">
                New Analysis
              </button>
            </div>

            {/* Group Share Alert */}
            {result.recipient_type === 'group' && result.sensitive_sections?.some(s => s.reason.toLowerCase().includes('group')) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 p-4"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-red-500/5 animate-pulse" />
                <div className="relative flex items-center gap-4">
                  <div className="flex-shrink-0 p-3 rounded-xl bg-amber-500/20 border border-amber-500/30">
                    <Users className="w-6 h-6 text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="inline-flex items-center gap-1.5 text-sm font-bold text-amber-400">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                        </span>
                        Group Share Alert
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary">
                      This file is being shared with <span className="text-white font-medium">multiple recipients</span>. 
                      {result.detected_intent && (
                        <> A <span className="text-amber-400 font-medium">{result.detected_intent}</span> shared in a group has higher exposure risk.</>
                      )}
                    </p>
                  </div>
                  <div className="flex-shrink-0 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    Group
                  </div>
                </div>
              </motion.div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Decision Card */}
              <div className={`lg:col-span-2 glass-card p-8 border ${
                result.decision === 'block' ? 'border-danger shadow-[0_0_30px_rgba(239,68,68,0.15)]' :
                (result.decision === 'warn' || result.decision === 'approval_required') ? 'border-warning shadow-[0_0_30px_rgba(245,158,11,0.15)]' :
                'border-success shadow-[0_0_30px_rgba(34,197,94,0.15)]'
              }`}>
                <div className="flex items-start gap-6">
                  <div className={`p-4 rounded-2xl ${
                    result.decision === 'block' ? 'bg-danger/20 text-danger' :
                    (result.decision === 'warn' || result.decision === 'approval_required') ? 'bg-warning/20 text-warning' :
                    'bg-success/20 text-success'
                  }`}>
                    {result.decision === 'block' && <ShieldAlert className="w-10 h-10" />}
                    {(result.decision === 'warn' || result.decision === 'approval_required') && <AlertTriangle className="w-10 h-10" />}
                    {result.decision === 'safe_to_send' && <ShieldCheck className="w-10 h-10" />}
                  </div>
                  <div>
                    <h3 className="text-2xl font-heading font-bold text-white mb-2">
                      {result.decision === 'block' ? 'Transfer Blocked' : 
                       result.decision === 'approval_required' ? 'Approval Required' :
                       result.decision === 'warn' ? 'Warning: Review Required' : 
                       'Safe to Send'}
                    </h3>
                    <p className="text-text-secondary leading-relaxed">{result.ai_explanation}</p>
                    {result.ai_confidence && <p className="text-xs text-text-muted mt-2">AI Confidence: {Math.round(result.ai_confidence * 100)}%</p>}
                  </div>
                </div>
              </div>

              {/* Risk Gauge */}
              <div className="glass-card p-6 flex flex-col items-center justify-center">
                <RiskGauge score={result.risk_score} />
                <div className="mt-4 text-center">
                  <p className="text-sm text-text-secondary">Recipient Risk Score</p>
                  <p className="text-lg font-bold text-white">{result.recipient_risk_score ?? 'N/A'}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-card p-6">
                <h3 className="text-lg font-heading font-bold text-white mb-4">Detected Entities</h3>
                <div className="flex flex-wrap gap-2">
                  {result.detected_entities && result.detected_entities.length > 0 ? (
                    result.detected_entities.map((entity, i) => (
                      <span key={i} className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 border border-white/10 text-text-secondary">
                        <span className="text-primary mr-1">{entity.type}:</span> {entity.value}
                      </span>
                    ))
                  ) : (
                    <span className="text-text-muted text-sm">No sensitive entities detected.</span>
                  )}
                </div>
                
                {result.sensitive_sections && result.sensitive_sections.length > 0 && (
                   <div className="mt-6">
                     <h4 className="text-sm font-medium text-white mb-2">Sensitive Sections</h4>
                     <ul className="list-disc pl-5 text-sm text-text-secondary">
                       {result.sensitive_sections.map((sec, i) => (
                          <li key={i}><span className="text-white">{sec.reason}</span> — <span className="capitalize">{sec.severity}</span></li>
                       ))}
                     </ul>
                   </div>
                )}
              </div>

              <div className="glass-card p-6">
                <h3 className="text-lg font-heading font-bold text-white mb-4">Semantic Analysis</h3>
                <div className="space-y-4 text-sm">
                  {result.summary && (
                    <div>
                      <span className="text-text-muted block mb-1">Summary</span>
                      <p className="text-white bg-background/50 p-3 rounded-lg">{result.summary}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-text-muted block mb-1">Business Context</span>
                    <p className="text-white bg-background/50 p-3 rounded-lg">{result.business_context || 'Not available'}</p>
                  </div>
                  <div>
                    <span className="text-text-muted block mb-1">Detected Intent</span>
                    <p className="text-white bg-background/50 p-3 rounded-lg">{result.detected_intent || 'Not available'}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <span className="text-text-muted block mb-1">Recipient Type</span>
                      <p className="text-white font-medium capitalize">{result.recipient_type || 'Unknown'}</p>
                    </div>
                    <div>
                      <span className="text-text-muted block mb-1">Trust Level</span>
                      <p className="text-white font-medium capitalize">{result.recipient_trust_level || 'Unknown'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
