'use client';
import { motion, useAnimation, useInView } from 'framer-motion';
import { Shield, Brain, AlertTriangle, CheckCircle, FileText, Lock } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-text-primary overflow-hidden relative font-sans">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-6 z-50 relative">
        <div className="flex items-center gap-2 text-2xl font-heading font-bold tracking-tight">
          <Shield className="text-primary w-8 h-8" />
          <span>SendGuard</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-text-secondary text-sm">
          <Link href="#features" className="hover:text-white transition-colors">Features</Link>
          <Link href="#how-it-works" className="hover:text-white transition-colors">How It Works</Link>
        </div>
      </nav>

      {/* Hero Content */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-4 text-center mt-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6 leading-tight">
            AI that vibe checks your files before <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">you hit send.</span>
          </h1>
          <p className="text-xl text-text-secondary mb-10 max-w-2xl mx-auto">
            Protect emails, files, and business communications using AI-powered semantic risk detection.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/analyze">
              <button className="px-8 py-4 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-medium hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all flex items-center gap-2">
                Start Analysis
              </button>
            </Link>
          </div>
        </motion.div>
      </main>

      {/* Floating Graphics Background */}
      <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
        <motion.div animate={{ y: [0, -20, 0] }} transition={{ repeat: Infinity, duration: 5 }} className="absolute top-[20%] left-[10%]">
          <Shield className="w-24 h-24 text-primary" />
        </motion.div>
        <motion.div animate={{ y: [0, 30, 0] }} transition={{ repeat: Infinity, duration: 6 }} className="absolute top-[40%] right-[15%]">
          <Lock className="w-32 h-32 text-secondary" />
        </motion.div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/20 blur-[120px] rounded-full mix-blend-screen" />
      </div>
    </div>
  );
}

