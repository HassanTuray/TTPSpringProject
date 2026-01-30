'use client';

import { createClient } from '@/lib/supabase/client';
import { useState, useEffect } from 'react';
import { getYearLabel, getClubLabel } from '@/lib/formatters';

export default function ViewProfile() {
  const [username, setUsername] = useState('User');
  const [major, setMajor] = useState('Major');
  const [year, setYear] = useState('Year');
  const [mainClub, setMainClub] = useState('Club');
  const [numEventsAttended, setNumEventsAttended] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editUsername, setEditUsername] = useState(username);
  const [editMajor, setEditMajor] = useState(major);
  const [editYear, setEditYear] = useState(year);
  const [editMainClub, setEditMainClub] = useState(mainClub);
  const supabase = createClient();

  useEffect(() => {
    const loadProfile = async () => {
      const data = await supabase.auth.getUser();
      const user = data.data.user;
      
      if (!user) {
        setUsername('Could not get user');
      }

      const id = user?.id;

      if (!id) {
        setUsername('No ID');
      }

      const profile_response = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", id)
      
      if (profile_response.error) {
        setUsername(profile_response.error.message);
        return;
      }

      const profile = profile_response.data?.[0];
      setUsername(profile.username);
      setMajor(profile.major);
      setYear(profile.year);
      setMainClub(profile.main_club);
      setNumEventsAttended(profile.num_events_attended);
    }

  loadProfile();
  }
  , [supabase]);
  

  const handleOpenModal = () => {
    setEditUsername(username);
    setEditMajor(major);
    setEditYear(year);
    setEditMainClub(mainClub);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveProfile = async () => {
    const id = supabase.auth.getUser();

    const response = await supabase
      .from("user_profiles")
      .update(
        {
          username: editUsername,
          setMajor: editMajor,
          year: editYear,
          main_club: editMainClub
        }
      )
      .eq("user_id", id);
  };

  return (
    <main className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <h1 className="profile-title">{username} Profile</h1>
          <button className="profile-edit-button" onClick={handleOpenModal}>
            Edit Profile
          </button>
        </div>

        <div className="profile-info-grid">
          <div className="profile-info-item">
            <div className="profile-info-label">Username</div>
            <div className="profile-info-value">{username}</div>
          </div>
          <div className="profile-info-item">
            <div className="profile-info-label">Year</div>
            <div className="profile-info-value">{getYearLabel(year)}</div>
          </div>
          <div className="profile-info-item">
            <div className="profile-info-label">Major</div>
            <div className="profile-info-value">{major}</div>
          </div>
          <div className="profile-info-item">
            <div className="profile-info-label">Main Club</div>
            <div className="profile-info-value">{getClubLabel(mainClub)}</div>
          </div>
          <div className="profile-info-item">
            <div className="profile-info-label">Events Attended</div>
            <div className="profile-info-value">{numEventsAttended}</div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Edit Profile</h2>
            </div>

            <div className="form-group">
              <label htmlFor="edit-username" className="form-label">Username</label>
              <input
                id="edit-username"
                type="text"
                className="form-input"
                value={editUsername}
                onChange={(e) => setEditUsername(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-year" className="form-label">Year</label>
              <select
                id="edit-year"
                className="form-select"
                value={editYear}
                onChange={(e) => setEditYear(e.target.value)}
              >
                <option value="freshman">Freshman</option>
                <option value="sophomore">Sophomore</option>
                <option value="junior">Junior</option>
                <option value="senior">Senior</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="edit-major" className="form-label">Major</label>
              <select
                id="edit-major"
                className="form-select"
                value={editMajor}
                onChange={(e) => setEditMajor(e.target.value)}
              >
                <option value="Computer Science">Computer Science</option>
                <option value="Electrical Engineering">Electrical Engineering</option>
                <option value="Computer Engineering">Computer Engineering</option>
                <option value="Information Science">Information Science</option>
                <option value="Math">Math</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Civil Engineering">Civil Engineering</option>
                <option value="Fire Protection Engineering">Fire Protection Engineering</option>
                <option value="Aerospace Engineering">Aerospace Engineering</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="edit-club" className="form-label">Main Club</label>
              <select
                id="edit-club"
                className="form-select"
                value={editMainClub}
                onChange={(e) => setEditMainClub(e.target.value)}
              >
                <option value="codeblack">CodeBlack</option>
                <option value="colorstack">ColorStack</option>
                <option value="black-engineers-society">Black Engineers Society</option>
              </select>
            </div>

            <div className="modal-footer">
              <button className="modal-button-primary" onClick={handleSaveProfile}>
                Save
              </button>
              <button className="modal-button-secondary" onClick={handleCloseModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}