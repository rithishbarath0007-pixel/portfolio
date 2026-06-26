"use client";

import { useState, useTransition } from 'react';
import { motion } from 'framer-motion';
import { loginAdmin } from '@/actions/auth';
import { Eye, EyeOff } from 'lucide-react';

export default function AdminLoginForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setError('');
    startTransition(async () => {
      const result = await loginAdmin(formData);
      if (result?.error) {
        setError(result.error);
      }
    });
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 bg-neutral-900 border border-white/10 rounded-3xl shadow-2xl"
      >
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center mx-auto mb-4 text-xl">
            🔒
          </div>
          <h1 className="text-2xl font-medium text-white">Admin Access</h1>
          <p className="text-neutral-500 text-sm mt-2">Enter credentials to view Mission Control.</p>
        </div>

        <form action={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-neutral-400 ml-1">Username</label>
            <input
              type="text"
              name="username"
              required
              disabled={isPending}
              className="w-full mt-1 bg-black border border-neutral-800 focus:border-neutral-600 rounded-xl px-4 py-3 text-white placeholder:text-neutral-600 outline-none transition-colors disabled:opacity-50"
              placeholder="Enter username"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-neutral-400 ml-1">Password</label>
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                disabled={isPending}
                className="w-full bg-black border border-neutral-800 focus:border-neutral-600 rounded-xl px-4 py-3 text-white placeholder:text-neutral-600 outline-none transition-colors disabled:opacity-50 pr-12"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-sm text-center">
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 mt-4 bg-white text-black font-medium rounded-xl hover:bg-neutral-200 transition-colors disabled:opacity-50 flex items-center justify-center"
          >
            {isPending ? 'Verifying...' : 'Access Dashboard'}
          </button>
        </form>
      </motion.div>
    </main>
  );
}