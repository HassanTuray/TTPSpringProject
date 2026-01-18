'use client';

import { useState, useEffect } from 'react';

export default function ViewProfile() {
  const [username, setUsername] = useState('Alex Johnson');
  const [major, setMajor] = useState('Computer Science');
  const [year, setYear] = useState('junior');
  const [mainClub, setMainClub] = useState('codeblack');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editUsername, setEditUsername] = useState(username);
  const [editMajor, setEditMajor] = useState(major);
  const [editYear, setEditYear] = useState(year);
  const [editMainClub, setEditMainClub] = useState(mainClub);

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

  const handleSaveProfile = () => {
    setUsername(editUsername);
    setMajor(editMajor);
    setYear(editYear);
    setMainClub(editMainClub);
    localStorage.setItem('username', editUsername);
    setIsModalOpen(false);
  };

  const getYearLabel = (yearValue: string) => {
    const yearMap: { [key: string]: string } = {
      freshman: 'Freshman',
      sophomore: 'Sophomore',
      junior: 'Junior',
      senior: 'Senior',
    };
    return yearMap[yearValue] || yearValue;
  };

  const getClubLabel = (clubValue: string) => {
    const clubMap: { [key: string]: string } = {
      codeblack: 'CodeBlack',
      colorstack: 'ColorStack',
      'black-engineers-society': 'Black Engineers Society',
    };
    return clubMap[clubValue] || clubValue;
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