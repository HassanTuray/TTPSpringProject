'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SiteHeader() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const router = useRouter();

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleSignIn = () => {
        router.push('/sign-in');
        setIsDropdownOpen(false);
    };

    const handleSignUp = () => {
        router.push('/sign-up');
        setIsDropdownOpen(false);
    };

    const handleViewProfile = () => {
        router.push('/view-profile');
        setIsDropdownOpen(false);
    };

    const handleLogout = () => {
        localStorage.setItem('isSignedIn', 'false');
        router.push('/');
        setIsDropdownOpen(false);
    };

    return (
        <header>
            <div className="header-container">
                {/* Logo Section */}
                <Link href="/" className="header-logo">
                    <Image 
                        src="/images/bes-black.png" 
                        alt="Logo" 
                        width={120} 
                        height={90} 
                    />
                </Link>

                {/* Middle Section - Empty for now */}
                <div className="header-middle"></div>

                {/* Sign in / User Account Icon */}
                <div className="header-user-section">
                    <button
                        onClick={toggleDropdown}
                        className="header-user-button"
                        aria-label="User account menu"
                    >
                        👤
                    </button>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                        <div className="header-dropdown">
                            {!(localStorage.getItem('isSignedIn') === "true") ? (
                                <>
                                    <button
                                        onClick={handleSignIn}
                                        className="header-dropdown-item header-dropdown-divider"
                                    >
                                        Sign In
                                    </button>
                                    <button
                                        onClick={handleSignUp}
                                        className="header-dropdown-item"
                                    >
                                        Sign Up
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={handleViewProfile}
                                        className="header-dropdown-item header-dropdown-divider"
                                    >
                                        View Profile
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="header-dropdown-item"
                                    >
                                        Logout
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}