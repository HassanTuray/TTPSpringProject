'use client'

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import { getYearLabel, getClubLabel, getMajorLabel, toDbFormat } from '@/lib/formatters';

type ColumnName = 'username' | 'year' | 'major' | 'main_club' | 'num_events_attended';

type Club = 
    | 'CodeBlack' 
    | 'Black Engineer Society' 
    | 'ColorStack'

type Major = 
    | 'Computer Science' 
    | 'Electrical Engineering' 
    | 'Computer Engineering'
    | 'Information Science'
    | 'Math'
    | 'Mechanical Engineering'
    | 'Civil Engineering'
    | 'Fire Protection Engineering'
    | 'Aerospace Engineering'
    | 'Other'

type Year = 
    | 'Freshman' 
    | 'Sophomore' 
    | 'Junior' 
    | 'Senior'

type Filter = {
    club: Club[];
    major: Major[];
    year: Year[];
}

type LeaderboardEntry = {
    username: string;
    num_events_attended: number;
    main_club: string;
    major: string;
    year: string;
}

const maxLeaderboardResults = 20

export default function Leaderboard() {
    const [user, setUser] = useState<User | null>(null);
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [usernameSearch, setUsernameSearch] = useState<string>('');
    const [filters, setFilters] = useState<Filter>({
        club: [],
        major: [],
        year: []
    });
    const [sortBy, setSortBy] = useState<string>('num_events_attended')
    const [sortAscending, setSortAscending] = useState<boolean>(false)
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [activeColumn, setActiveColumn] = useState<ColumnName | null>(null);
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };

        getUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, [supabase.auth]);

    useEffect(() => {
        fetchLeaderboard();
    }, [activeColumn, filters, page, sortBy, sortAscending, usernameSearch]);

    const fetchLeaderboard = async () => {
        setLoading(true);

        // Fetch maxLeaderboardResults + 1 items to check if there's a next page
        let query = supabase
            .from('user_profiles')
            .select('username, num_events_attended, main_club, major, year')
            .order(sortBy, { ascending: sortAscending })
            .range((page - 1) * maxLeaderboardResults, page * maxLeaderboardResults);
            
        if (usernameSearch) {
            query = query.ilike('username', `%${usernameSearch}%`);
        }
            
        if (filters.club.length > 0) {
            const dbClubs = filters.club.map(club => toDbFormat(club));
            query = query.in('main_club', dbClubs);
        }

        if (filters.major.length > 0) {
            const dbMajors = filters.major.map(major => toDbFormat(major));
            query = query.in('major', dbMajors);
        }

        if (filters.year.length > 0) {
            const dbYears = filters.year.map(year => toDbFormat(year));
            query = query.in('year', dbYears);
        }

        const { data } = await query;
        setLoading(false);
        
        // Check if there's a next page
        if (data && data.length > maxLeaderboardResults) {
            setHasNextPage(true);
            setLeaderboard(data.slice(0, maxLeaderboardResults)); // Only show first maxLeaderboardResults
        } else {
            setHasNextPage(false);
            setLeaderboard(data || []);
        }
    }

    const handleFilterChange = (filterType: keyof Filter, value: string) => {
        setFilters(prev => {
            const currentValues = prev[filterType] as string[];
            const newValues = currentValues.includes(value)
                ? currentValues.filter(v => v !== value)
                : [...currentValues, value];
            return { ...prev, [filterType]: newValues };
        });
        setPage(1); // Reset to page 1 when filters change
    };

    const handleColumnClick = (column: ColumnName) => {
      if (column === activeColumn && sortAscending) {
        // Second click: reverse sort column
        setSortAscending(!sortAscending);
      } else if (column === activeColumn) {
        // Third click: reset to default
        setActiveColumn(null);
        setSortBy('num_events_attended');
        setSortAscending(false);
      } else {
        // First click: set column
        setActiveColumn(column);
        setSortBy(column.toString());

        if (column === 'num_events_attended') {
          setSortAscending(false);
        } else {
          setSortAscending(true);
        }
      }
    }

    return (
        <div className="leaderboard-wrapper">
            {/* Sidebar */}
            <div className={`leaderboard-sidebar ${sidebarVisible ? 'visible' : ''}`}>
                <div className="sidebar-header">
                    <h3>Filters</h3>
                    <button onClick={() => setSidebarVisible(false)} className="sidebar-close">×</button>
                </div>

                {/* Username Search */}
                <div className="filter-group">
                    <label className="filter-label">Username</label>
                    <input
                        type="text"
                        className="filter-input"
                        placeholder="Search username..."
                        value={usernameSearch}
                        onChange={(e) => {
                            setUsernameSearch(e.target.value);
                            setPage(1);
                        }}
                    />
                </div>

                {/* Year Filter */}
                <div className="filter-group">
                    <label className="filter-label">Year</label>
                    {(['Freshman', 'Sophomore', 'Junior', 'Senior'] as Year[]).map(year => (
                        <label key={year} className="filter-checkbox">
                            <input
                                type="checkbox"
                                checked={filters.year.includes(year)}
                                onChange={() => handleFilterChange('year', year)}
                            />
                            <span>{year}</span>
                        </label>
                    ))}
                </div>

                {/* Major Filter */}
                <div className="filter-group">
                    <label className="filter-label">Major</label>
                    {(['Computer Science', 'Electrical Engineering', 'Computer Engineering', 'Information Science', 'Math', 'Mechanical Engineering', 'Civil Engineering', 'Fire Protection Engineering', 'Aerospace Engineering', 'Other'] as Major[]).map(major => (
                        <label key={major} className="filter-checkbox">
                            <input
                                type="checkbox"
                                checked={filters.major.includes(major)}
                                onChange={() => handleFilterChange('major', major)}
                            />
                            <span>{major}</span>
                        </label>
                    ))}
                </div>

                {/* Club Filter */}
                <div className="filter-group">
                    <label className="filter-label">Main Club</label>
                    {(['CodeBlack', 'Black Engineer Society', 'ColorStack'] as Club[]).map(club => (
                        <label key={club} className="filter-checkbox">
                            <input
                                type="checkbox"
                                checked={filters.club.includes(club)}
                                onChange={() => handleFilterChange('club', club)}
                            />
                            <span>{club}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="leaderboard-container">
                <button 
                    className="sidebar-toggle" 
                    onClick={() => setSidebarVisible(!sidebarVisible)}
                >
                    {sidebarVisible ? '◀' : '☰'}
                </button>
                
                <table>
              <thead>
                <tr>
                  <th onClick={() => handleColumnClick('username')} className={activeColumn === 'username' ? 'active-column' : ''}>
                    Username
                  </th>
                  <th onClick={() => handleColumnClick('year')} className={activeColumn === 'year' ? 'active-column' : ''}>
                    Year
                  </th>
                  <th onClick={() => handleColumnClick('major')} className={activeColumn === 'major' ? 'active-column' : ''}>
                    Major
                  </th>
                  <th onClick={() => handleColumnClick('main_club')} className={activeColumn === 'main_club' ? 'active-column' : ''}>
                    Main Club
                  </th>
                  <th onClick={() => handleColumnClick('num_events_attended')} className={activeColumn === 'num_events_attended' ? 'active-column' : ''}>
                    Events Attended
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>
                      Loading...
                    </td>
                  </tr>
                ) : leaderboard.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>
                      No data available
                    </td>
                  </tr>
                ) : (
                  leaderboard.map((entry, index) => (
                    <tr key={index}>
                      <td className={activeColumn === 'username' ? 'active-column' : ''}>{entry.username}</td>
                      <td className={activeColumn === 'year' ? 'active-column' : ''}>{getYearLabel(entry.year)}</td>
                      <td className={activeColumn === 'major' ? 'active-column' : ''}>{getMajorLabel(entry.major)}</td>
                      <td className={activeColumn === 'main_club' ? 'active-column' : ''}>{getClubLabel(entry.main_club)}</td>
                      <td className={activeColumn === 'num_events_attended' ? 'active-column' : ''}>{entry.num_events_attended}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <div className="pagination">
              <button 
                onClick={() => setPage(page - 1)} 
                disabled={page === 1}
                className="pagination-button"
              >
                &lt;
              </button>
              <span className="pagination-page">Page {page}</span>
              <button 
                onClick={() => setPage(page + 1)} 
                disabled={!hasNextPage}
                className="pagination-button"
              >
                &gt;
              </button>
            </div>
        </div>
        </div>
    );
}