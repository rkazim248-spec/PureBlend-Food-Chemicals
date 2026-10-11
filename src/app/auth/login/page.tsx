'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { Eye, EyeOff, Lock, User, ShieldCheck, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [email, setEmail] = useState('procurement@beveragepartner.com');
  const [password, setPassword] = useState('PureBlend2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleQuickDemoRole = (roleEmail: string, roleTitle: string) => {
    setEmail(roleEmail);
    setPassword('PureBlend2026!');
    showToast({
      title: `${roleTitle} Loaded`,
      description: `Credentials populated for ${roleEmail}`,
      type: 'info'
    });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!email.trim() || !email.includes('@')) {
      newErrors.email = 'Valid business email is required';
    }
    if (!password.trim() || password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      showToast({
        title: 'Authentication Successful',
        description: `Welcome back. Redirecting to PureBlend Portal Console...`,
        type: 'success'
      });
      router.push('/admin');
    }, 700);
  };

  return (
    <PublicLayout>
      <div className="max-w-md mx-auto px-4 py-16 sm:py-20">
        <div className="text-center mb-8 space-y-2">
          <div className="w-12 h-12 rounded bg-forest text-white font-mono font-bold text-xl flex items-center justify-center mx-auto shadow-xs border border-[#235848]">
            <span className="text-emerald-400">P</span>B
          </div>
          <h1 className="text-2xl font-black text-charcoal tracking-tight">
            PureBlend Partner & Client Portal
          </h1>
          <p className="text-xs text-secondary-text">
            Access batch Certificates of Analysis (COA), contract volume allocations, and open RFQ tracking.
          </p>
        </div>



        {/* Sign In Form */}
        <form onSubmit={handleLogin} className="bg-white rounded-lg border border-border-subtle p-6 sm:p-8 space-y-4 shadow-xs">
          <Input
            label="Email Address"
            type="email"
            required
            placeholder="name@example.com (Normal or corporate)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            leftIcon={<User className="w-4 h-4" />}
          />

          <div className="relative">
            <Input
              label="Account Password"
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              leftIcon={<Lock className="w-4 h-4" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="pointer-events-auto text-secondary-text hover:text-charcoal p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none text-secondary-text">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-border-subtle text-primary-green focus:ring-primary-green w-3.5 h-3.5"
              />
              <span>Remember session</span>
            </label>
            <button
              type="button"
              onClick={() =>
                showToast({
                  title: 'Password Reset Notification',
                  description: 'A reset verification link has been dispatched to your email.',
                  type: 'info'
                })
              }
              className="text-primary-green hover:underline font-medium"
            >
              Forgot password?
            </button>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full justify-center mt-2"
            isLoading={isLoading}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Authenticate & Open Console
          </Button>

          <div className="pt-4 border-t border-border-subtle text-center text-xs text-secondary-text">
            <span>Don&apos;t have an account? </span>
            <Link href="/auth/signup" className="text-primary-green font-semibold hover:underline">
              Create Account
            </Link>
          </div>
        </form>

        <div className="mt-6 text-center text-[11px] text-secondary-text flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-primary-green" />
          <span>256-Bit TLS Encrypted Commercial Procurement Protocol</span>
        </div>
      </div>
    </PublicLayout>
  );
}
