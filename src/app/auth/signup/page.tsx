'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { Eye, EyeOff, Lock, User, Mail, ShieldCheck, ArrowRight } from 'lucide-react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getFirebaseAuth } from '@/lib/firebase/client';
import { clearAdminToken } from '@/lib/api/admin';

export default function SignupPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    if (!email.trim() || !email.includes('@')) {
      newErrors.email = 'Valid email address is required';
    }
    if (!password.trim() || password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!acceptTerms) {
      newErrors.terms = 'You must accept the terms of assay and supply';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);
    clearAdminToken();

    try {
      const credential = await createUserWithEmailAndPassword(getFirebaseAuth(), email.trim(), password);
      await updateProfile(credential.user, { displayName: fullName.trim() });
      showToast({
        title: 'Account Created Successfully',
        description: `Welcome to PureBlend, ${fullName}! Your account has standard client access.`,
        type: 'success'
      });
      router.push('/auth/login');
    } catch (error) {
      console.error('Account creation failed:', error);
      showToast({
        title: 'Unable to Create Account',
        description: 'Check your details and try again. If the problem continues, contact support.',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PublicLayout>
      <div className="max-w-md mx-auto px-4 py-16 sm:py-20">
        <div className="text-center mb-8 space-y-2">
          <div className="w-12 h-12 rounded bg-forest text-white font-mono font-bold text-xl flex items-center justify-center mx-auto shadow-xs border border-[#235848]">
            <span className="text-emerald-400">P</span>B
          </div>
          <h1 className="text-2xl font-black text-charcoal tracking-tight">
            Create Your PureBlend Account
          </h1>
          <p className="text-xs text-secondary-text">
            Create a client account. Administrative access is granted separately.
          </p>
        </div>


        {/* Sign Up Form */}
        <form onSubmit={handleSignup} className="bg-white rounded-lg border border-border-subtle p-6 sm:p-8 space-y-4 shadow-xs">
          <Input
            label="Full Name"
            type="text"
            required
            placeholder="Dr. Alex Lindqvist"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            error={errors.fullName}
            leftIcon={<User className="w-4 h-4" />}
          />

          <Input
            label="Email Address"
            type="email"
            required
            placeholder="name@example.com (Normal or corporate)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            leftIcon={<Mail className="w-4 h-4" />}
          />

          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="At least 6 characters"
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

          <Input
            label="Confirm Password"
            type={showPassword ? 'text' : 'password'}
            required
            placeholder="Re-enter password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={errors.confirmPassword}
            leftIcon={<Lock className="w-4 h-4" />}
          />

          {errors.terms && (
            <p className="text-[11px] text-red-600 font-medium">{errors.terms}</p>
          )}

          <div className="flex items-start gap-2 text-xs pt-1">
            <input
              type="checkbox"
              id="terms"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="rounded border-border-subtle text-primary-green focus:ring-primary-green w-3.5 h-3.5 mt-0.5"
            />
            <label htmlFor="terms" className="cursor-pointer select-none text-secondary-text leading-tight">
              I agree to PureBlend terms of assay, FCC XIII compliance standards, and privacy guidelines.
            </label>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full justify-center mt-2"
            isLoading={isLoading}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Create Client Account
          </Button>

          <div className="pt-4 border-t border-border-subtle text-center text-xs text-secondary-text">
            <span>Already have a PureBlend account? </span>
            <Link href="/auth/login" className="text-primary-green font-semibold hover:underline">
              Sign In Here
            </Link>
          </div>
        </form>

        <div className="mt-6 text-center text-[11px] text-secondary-text flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-primary-green" />
          <span>Secure Registration Gateway • 256-Bit TLS Encrypted</span>
        </div>
      </div>
    </PublicLayout>
  );
}
