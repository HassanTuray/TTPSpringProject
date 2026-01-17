'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSignIn = () => {
    // Store sign-in state in localStorage
    localStorage.setItem('isSignedIn', "true");
    // Navigate to landing page
    router.push('/');
  };

  return (
    <main className="form-page">
      <section className="form-container">
        <h1 className="form-title">Sign In</h1>
        
        <div className="form-group">
          <label htmlFor="username" className="form-label">Username or Email</label>
          <input
            id="username"
            type="text"
            className="form-input"
            placeholder="Enter your username or email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
          />
        </div>

        <button className="form-button" onClick={handleSignIn}>
          Sign In
        </button>

        <div className="form-footer">
          {/* Don't have an account?{' '} */}
          <Link href="/sign-up" className="form-footer-link">
            Sign Up
          </Link>
        </div>
      </section>
    </main>
  );
}