'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/lib/auth';
import { Mail, Lock, LogIn, ChevronRight, Info, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await authService.login(formData.email, formData.password);
      router.push('/');
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      await authService.login('demo@ticket.com', 'demo123');
      router.push('/');
    } catch (err) {
      setError('Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 selection:bg-rose-500/30">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2670')] bg-cover bg-center opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505]" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl overflow-hidden group">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-600 to-orange-500" />
           
           <div className="text-center mb-10">
              <Link href="/" className="inline-block mb-6 group">
                 <h1 className="text-4xl font-black italic tracking-tighter text-white">
                    MOVIE<span className="text-rose-600 group-hover:text-rose-500 transition-colors">HUB</span>
                 </h1>
              </Link>
              <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
              <p className="text-zinc-500 text-sm font-medium">Log in to book your cinematic experience.</p>
           </div>

           <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                 <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] ml-2">Email Identity</label>
                 <div className="relative group/input">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within/input:text-rose-500 transition-colors" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-rose-500/50 focus:ring-4 focus:ring-rose-500/10 transition-all font-medium placeholder:text-zinc-600 outline-none"
                      placeholder="you@example.com"
                    />
                 </div>
              </div>

              <div className="space-y-1.5">
                 <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] ml-2">Access Key</label>
                 <div className="relative group/input">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within/input:text-rose-500 transition-colors" />
                    <input
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-rose-500/50 focus:ring-4 focus:ring-rose-500/10 transition-all font-medium placeholder:text-zinc-600 outline-none"
                      placeholder="••••••••"
                    />
                 </div>
              </div>

              {error && (
                <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 text-rose-500 text-xs font-bold text-center flex items-center justify-center gap-2">
                   <AlertCircle className="w-4 h-4" /> {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-rose-600 hover:bg-rose-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transform active:scale-95 transition-all shadow-xl shadow-rose-600/20 text-lg group/btn"
              >
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (
                  <>
                    Authorize Access <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
           </form>

           <div className="mt-8 pt-8 border-t border-white/5 flex flex-col items-center gap-4">
              <button 
                onClick={handleDemoLogin}
                className="text-zinc-400 hover:text-white text-sm font-bold transition-colors flex items-center gap-2"
              >
                 <Info className="w-4 h-4 text-rose-500" /> Quick Demo Login
              </button>
              <p className="text-zinc-500 text-sm font-medium">
                New here? <Link href="/register" className="text-rose-500 font-bold hover:underline">Create Pass</Link>
              </p>
           </div>
        </div>
      </motion.div>
    </div>
  );
}
