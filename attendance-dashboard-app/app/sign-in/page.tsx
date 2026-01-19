'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignIn = async () => {
    // Clear previous errors
    setError('');

    // Validate inputs
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    try {
      setLoading(true);

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        // Show the actual error message for debugging
        console.error('Supabase sign-in error:', signInError);
        setError(signInError.message || 'Invalid email or password');
        return;
      }

      if (!data.user) {
        setError('Failed to sign in');
        return;
      }

      // Redirect to home page
      router.push('/');
      router.refresh();
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Sign in error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="form-page">
      <section className="form-container">
        <h1 className="form-title">Sign In</h1>
        
        {error && <div className="form-error" style={{ marginBottom: '1rem' }}>{error}</div>}

        <div className="form-group">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            id="email"
            type="email"
            className="form-input"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            onKeyDown={(e) => e.key === 'Enter' && handleSignIn()}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            id="password"
            type="password"
            className="form-input"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            onKeyDown={(e) => e.key === 'Enter' && handleSignIn()}
          />
        </div>

        <button 
          className="form-button" 
          onClick={handleSignIn}
          disabled={loading}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>

        <div className="form-footer">
          <Link href="/sign-up" className="form-footer-link">
            Sign Up
          </Link>
        </div>
      </section>
    </main>
  );
}