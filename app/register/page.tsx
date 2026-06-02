'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/lib/auth';
import { User, Mail, Phone, Lock, ShieldCheck, ChevronRight, AlertCircle, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await authService.register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      });
      setShowVerification(true);
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const success = await authService.verifyEmail(verificationCode);
    if (success) {
      router.push('/');
    } else {
      setError('Invalid code. Try 123456');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 selection:bg-rose-500/30 font-sans">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=2670')] bg-cover bg-center opacity-10" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-2xl bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] shadow-2xl overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-600 via-orange-500 to-rose-600" />
        
        <div className="flex flex-col md:flex-row h-full">
           {/* Left Side: Branding / Info */}
           <div className="md:w-1/3 bg-rose-600 p-10 flex flex-col justify-between text-white relative overflow-hidden">
              <div className="relative z-10">
                 <Link href="/" className="flex items-center gap-2 mb-12">
                    <ArrowLeft className="w-5 h-5" /> <span className="font-bold uppercase tracking-widest text-xs">Back</span>
                 </Link>
                 <h2 className="text-4xl font-black leading-tight mb-4">Join the<br />Elite Pass</h2>
                 <p className="text-rose-100 text-sm font-medium">Unlock exclusive premieres and priority booking at AuraCinema.</p>
              </div>
              <div className="relative z-10 space-y-4">
                 <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest opacity-80">
                    <ShieldCheck className="w-5 h-5" /> Secured Data
                 </div>
              </div>
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
           </div>

           {/* Right Side: Form */}
           <div className="flex-1 p-10 md:p-14">
              <AnimatePresence mode="wait">
                {!showVerification ? (
                  <motion.div 
                    key="register"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                     <h3 className="text-2xl font-bold text-white mb-8">Create AuraCinema ID</h3>
                     <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                           <div className="space-y-1.5">
                              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2">Full Name</label>
                              <div className="relative">
                                 <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                 <input 
                                   required 
                                   value={formData.name}
                                   onChange={e => setFormData({...formData, name: e.target.value})}
                                   placeholder="John Doe" 
                                   className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-white focus:border-rose-500/50 outline-none transition-all text-sm font-medium" 
                                 />
                              </div>
                           </div>
                           <div className="space-y-1.5">
                              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2">Phone</label>
                              <div className="relative">
                                 <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                 <input 
                                   required 
                                   value={formData.phone}
                                   onChange={e => setFormData({...formData, phone: e.target.value})}
                                   placeholder="+91..." 
                                   className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-white focus:border-rose-500/50 outline-none transition-all text-sm font-medium" 
                                 />
                              </div>
                           </div>
                        </div>

                        <div className="space-y-1.5">
                           <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2">Email Address</label>
                           <div className="relative">
                              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                              <input 
                                required 
                                type="email"
                                value={formData.email}
                                onChange={e => setFormData({...formData, email: e.target.value})}
                                placeholder="name@clark.com" 
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-white focus:border-rose-500/50 outline-none transition-all text-sm font-medium" 
                              />
                           </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                           <div className="space-y-1.5">
                              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2">Password</label>
                              <div className="relative">
                                 <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                 <input 
                                   required 
                                   type="password"
                                   value={formData.password}
                                   onChange={e => setFormData({...formData, password: e.target.value})}
                                   placeholder="••••••••" 
                                   className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-white focus:border-rose-500/50 outline-none transition-all text-sm font-medium" 
                                 />
                              </div>
                           </div>
                           <div className="space-y-1.5">
                              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2">Confirm</label>
                              <div className="relative">
                                 <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                 <input 
                                   required 
                                   type="password"
                                   value={formData.confirmPassword}
                                   onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                                   placeholder="••••••••" 
                                   className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-white focus:border-rose-500/50 outline-none transition-all text-sm font-medium" 
                                 />
                              </div>
                           </div>
                        </div>

                        {error && (
                          <div className="text-rose-500 text-xs font-bold flex items-center gap-2 bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">
                             <AlertCircle className="w-4 h-4" /> {error}
                          </div>
                        )}

                        <button 
                           type="submit"
                           disabled={loading}
                           className="w-full bg-rose-600 hover:bg-rose-500 disabled:bg-zinc-800 text-white font-black uppercase tracking-widest py-4 rounded-2xl mt-4 flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-rose-600/20"
                        >
                           {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (
                             <>Join AuraCinema <ChevronRight className="w-5 h-5" /></>
                           )}
                        </button>
                     </form>
                     <p className="text-center mt-8 text-zinc-500 text-xs font-medium">
                        Already a member? <Link href="/login" className="text-white hover:text-rose-500 font-bold transition-colors underline">Sign In Here</Link>
                     </p>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="verify"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                     <h3 className="text-2xl font-bold text-white mb-4 italic">Verify Identity</h3>
                     <p className="text-zinc-500 text-sm font-medium mb-8">We've sent a code to your email. Check your inbox (or use demo code: 123456).</p>
                     
                     <form onSubmit={handleVerify} className="space-y-6">
                        <div className="relative">
                           <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-rose-500" />
                           <input 
                             required 
                             maxLength={6}
                             value={verificationCode}
                             onChange={e => setVerificationCode(e.target.value)}
                             placeholder="Enter 6-digit code" 
                             className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-4 text-2xl font-black tracking-[0.5em] text-white focus:border-rose-500 outline-none text-center" 
                           />
                        </div>

                        <button 
                           type="submit"
                           className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-rose-600/20"
                        >
                           Complete Activation
                        </button>
                     </form>
                  </motion.div>
                )}
              </AnimatePresence>
           </div>
        </div>
      </motion.div>
    </div>
  );
}
