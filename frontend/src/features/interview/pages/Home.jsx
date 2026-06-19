import React, { useState } from 'react'
import { useAuth } from '../../auth/hooks/useAuth'
import "../style/home.scss"

const Home = () => {
  const { user, handleLogout } = useAuth()
  const [selectedFileName, setSelectedFileName] = useState("")

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFileName(e.target.files[0].name)
    } else {
      setSelectedFileName("")
    }
  }

  return (
    <main className="home">
      {/* Top Navbar Header */}
      <header className="dashboard-header">
        <a href="/" className="brand-logo">
          <span>Jobnosis.</span>
        </a>
        <div className="user-nav">
          {user && (
            <span className="username-display">
              Welcome, {user.username || user.email}
            </span>
          )}
          <button className="logout-button" onClick={handleLogout}>
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="dashboard-container">
        {/* Welcome Section */}
        <section className="welcome-section">
          <h1>Generate <i>Interview</i> Report</h1>
          <p>Provide a job description and your profile credentials to get a customized AI interview roadmap.</p>
        </section>

        {/* Inputs Grid */}
        <div className="interview-grid">
          {/* Left card: Job Description */}
          <div className="panel-card">
            <h2>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
              Job <i>Description</i>
            </h2>
            <div className="input-field-group">
              <label htmlFor="jobDescription">Position Details</label>
              <textarea
                name="jobDescription"
                id="jobDescription"
                placeholder="Paste the target job description or requirements here..."
              ></textarea>
            </div>
          </div>

          {/* Right card: Profile / Resume */}
          <div className="panel-card">
            <h2>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
              Your <i>Profile</i>
            </h2>

            {/* Resume Upload Section */}
            <div className="input-field-group">
              <p>
                Resume <span className="highlight">(PDF format recommended for best matching results)</span>
              </p>
              <label className="file-drop-zone" htmlFor="resume">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <span className="upload-title">Choose your resume file</span>
                <span className="upload-subtitle">Click to browse your local files</span>
                {selectedFileName && (
                  <span className="filename-display">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {selectedFileName}
                  </span>
                )}
              </label>
              <input
                hidden
                type="file"
                name="resume"
                id="resume"
                accept=".pdf"
                onChange={handleFileChange}
              />
            </div>

            {/* Self Description Section */}
            <div className="input-field-group">
              <label htmlFor="selfDescription">Your Self Description</label>
              <textarea
                name="selfDescription"
                id="selfDescription"
                placeholder="Briefly describe your core skills, experiences, and background..."
              ></textarea>
            </div>
          </div>
        </div>

        {/* Generate Report Button */}
        <div className="submit-container">
          <button className="button primary-button generate-button">
            Generate Interview Report
          </button>
        </div>
      </div>
    </main>
  )
}

export default Home