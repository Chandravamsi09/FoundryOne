import React from 'react';
import { motion } from 'framer-motion';

interface ModulePlaceholderProps {
  title: string;
  icon?: string;
  description?: string;
}

export default function ModulePlaceholder({ title, icon = '🚀', description = 'This module is currently under development.' }: ModulePlaceholderProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center p-12 text-center bg-white/70 backdrop-blur-xl rounded-3xl border border-white/40 shadow-sm min-h-[400px]"
    >
      <motion.div 
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
        className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center text-5xl mb-6 shadow-inner"
      >
        {icon}
      </motion.div>
      <h2 className="text-3xl font-bold text-slate-900 mb-3">{title}</h2>
      <p className="text-slate-500 max-w-md">{description}</p>
      
      <div className="mt-8 flex gap-3">
        <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </motion.div>
  );
}
