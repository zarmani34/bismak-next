'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FaLock, FaChartLine, FaBolt } from 'react-icons/fa';

export default function Portal() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F6F5D9] via-white to-[#F6F5D9] flex items-center justify-center p-5 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1],
            rotate: [0, 90, 0]
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-32 -left-32 w-96 h-96 bg-[#37574a] rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.15, 0.1],
            rotate: [0, -90, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, delay: 2 }}
          className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#D95C3E] rounded-full blur-3xl"
        />
        
        {/* Floating shapes */}
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 left-1/4 w-16 h-16 border-4 border-[#37574a]/20 rounded-lg"
        />
        <motion.div
          animate={{ 
            y: [0, 20, 0],
            rotate: [0, -180, -360]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/4 right-1/4 w-20 h-20 border-4 border-[#D95C3E]/20 rounded-full"
        />
      </div>

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative max-w-4xl w-full bg-white rounded-3xl shadow-2xl border-2 border-[#e0ddc7] p-12 md:p-16 text-center overflow-hidden"
      >
        {/* Decorative top accent */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#37574a] via-[#D95C3E] to-[#37574a]" />
        
        {/* Logo/Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          className="mb-8 inline-block"
        >
          <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-[#37574a] to-[#4a6b5c] rounded-3xl flex items-center justify-center shadow-xl mx-auto relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border-4 border-dashed border-white/30 rounded-3xl"
            />
            <svg className="w-12 h-12 md:w-16 md:h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </div>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-4xl md:text-6xl font-bold text-[#333333] mb-4"
        >
          Portal Under <span className="text-[#37574a]">Construction</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-lg md:text-xl text-[#4a4a4a] mb-8 max-w-2xl mx-auto"
        >
          We're working hard to bring you an enhanced portal experience. Our team is crafting something special for you.
        </motion.p>

        {/* Progress indicator */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-sm font-semibold text-[#8a8a8a]">Progress</span>
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-sm font-bold text-[#37574a]"
            >
              75%
            </motion.span>
          </div>
          <div className="max-w-md mx-auto h-3 bg-[#F6F5D9] rounded-full overflow-hidden border border-[#e0ddc7]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '75%' }}
              transition={{ delay: 0.8, duration: 1.5, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-[#37574a] to-[#4a6b5c] rounded-full relative overflow-hidden"
            >
              <motion.div
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Features coming */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="grid md:grid-cols-3 gap-6 mb-8"
        >
          {[
            { icon: FaLock, title: 'Secure Access', desc: 'Enhanced security' },
            { icon: FaChartLine, title: 'Dashboard', desc: 'Real-time insights' },
            { icon: FaBolt, title: 'Fast Performance', desc: 'Optimized speed' }
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              className="bg-[#F6F5D9] rounded-xl p-6 border border-[#e0ddc7] hover:border-[#37574a] transition-all"
            >
              <div className="text-4xl mb-3 text-[#37574a] flex justify-center">
                <feature.icon />
              </div>
              <h3 className="font-bold text-[#333333] mb-1">{feature.title}</h3>
              <p className="text-sm text-[#8a8a8a]">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="space-y-4"
        >
          <p className="text-[#4a4a4a] font-medium">
            Want to be notified when we launch?
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-6 py-4 rounded-xl border-2 border-[#e0ddc7] focus:border-[#37574a] focus:outline-none transition-colors text-[#333333] placeholder:text-[#8a8a8a]"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto bg-[#D95C3E] hover:bg-[#c4512a] text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all whitespace-nowrap"
            >
              Notify Me
            </motion.button>
          </div>
        </motion.div>

        {/* Footer info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-12 pt-8 border-t border-[#e0ddc7]"
        >
          <p className="text-sm text-[#8a8a8a] flex items-center justify-center gap-2">
            <span className="w-2 h-2 bg-[#4a7c59] rounded-full animate-pulse" />
            Expected launch: Q1 2026
          </p>
          <p className="text-xs text-[#8a8a8a] mt-2">
            Need immediate assistance? Contact us at{' '}
            <a href="mailto:support@bismak.com" className="text-[#37574a] hover:text-[#D95C3E] font-semibold">
              support@bismak.com
            </a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}