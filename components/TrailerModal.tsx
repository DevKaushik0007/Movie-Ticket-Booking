'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface TrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoKey: string | null;
  title: string;
}

export default function TrailerModal({ isOpen, onClose, videoKey, title }: TrailerModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-5xl aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="absolute top-4 right-4 z-50">
            <button
              onClick={onClose}
              className="p-2 bg-black/50 hover:bg-rose-600 text-white rounded-full backdrop-blur-md transition-all active:scale-95"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {!videoKey ? (
            <div className="flex flex-col items-center justify-center h-full text-zinc-500">
               <p className="text-lg font-bold">Trailer Not Available</p>
               <p className="text-sm">We couldn't find a preview for {title}.</p>
            </div>
          ) : (
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${videoKey}?autoplay=1`}
              title={`${title} Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
