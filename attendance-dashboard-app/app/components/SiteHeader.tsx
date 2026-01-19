'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

export default function SiteHeader() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            setLoading(false);
        };

        getUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, [supabase.auth]);

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

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setIsDropdownOpen(false);
        router.push('/');
        router.refresh();
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
                    {isDropdownOpen && !loading && (
                        <div className="header-dropdown">
                            {!user ? (
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