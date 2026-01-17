'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignUp() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [year, setYear] = useState('');
  const [major, setMajor] = useState('');
  const [mainClub, setMainClub] = useState('');
  const [emailError, setEmailError] = useState('');
  const router = useRouter();

  const validateEmail = (emailValue: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailValue);
  };

  const handleSignUp = () => {
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    setEmailError('');
    localStorage.setItem('isSignedIn', 'true');
    router.push('/');
  };

  return (
    <main className="form-page">
      <section className="form-container">
        <h1 className="form-title">Sign Up</h1>

        <div className="form-group">
          <label htmlFor="username" className="form-label">Username</label>
          <input
            id="username"
            type="text"
            className="form-input"
            placeholder="Enter your username"
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

        <div className="form-group">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            id="email"
            type="text"
            className="form-input"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {emailError && <div className="form-error">{emailError}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="year" className="form-label">Year</label>
          <select
            id="year"
            className="form-select"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          >
            <option value="">Select your year</option>
            <option value="freshman">Freshman</option>
            <option value="sophomore">Sophomore</option>
            <option value="junior">Junior</option>
            <option value="senior">Senior</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="major" className="form-label">Major</label>
          <select
            id="major"
            className="form-select"
            value={major}
            onChange={(e) => setMajor(e.target.value)}
          >
            <option value="">Select your major</option>
            <option value="computer-science">Computer Science</option>
            <option value="electrical-engineering">Electrical Engineering</option>
            <option value="computer-engineering">Computer Engineering</option>
            <option value="information-science">Information Science</option>
            <option value="math">Math</option>
            <option value="mechanical-engineering">Mechanical Engineering</option>
            <option value="civil-engineering">Civil Engineering</option>
            <option value="fire-protection-engineering">Fire Protection Engineering</option>
            <option value="aerospace-engineering">Aerospace Engineering</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="mainClub" className="form-label">Main Club</label>
          <select
            id="mainClub"
            className="form-select"
            value={mainClub}
            onChange={(e) => setMainClub(e.target.value)}
          >
            <option value="">Select your main club</option>
            <option value="codeblack">CodeBlack</option>
            <option value="colorstack">ColorStack</option>
            <option value="black-engineers-society">Black Engineers Society</option>
          </select>
        </div>

        <button className="form-button" onClick={handleSignUp}>
          Sign Up
        </button>

        <div className="form-footer">
          Already have an account?{' '}
          <Link href="/sign-in" className="form-footer-link">
            Sign In
          </Link>
        </div>
      </section>
    </main>
  );
}