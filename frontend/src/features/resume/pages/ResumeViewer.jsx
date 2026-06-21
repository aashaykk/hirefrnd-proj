import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import { useResume } from '../hooks/useResume'
import { useAuth } from '../../auth/hooks/useAuth'
import { getResumePdfDownloadUrl } from '../services/resume.api'
import "../style/resume.scss"

const ResumeViewer = () => {
  const { resumeId } = useParams()
  const navigate = useNavigate()
  const { user, handleLogout } = useAuth()
  const { getResumeById, updateResume, getResumePdfBlob, loading } = useResume()

  const [localData, setLocalData] = useState(null)
  const [activeTab, setActiveTab] = useState("personal")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [pdfKey, setPdfKey] = useState(0)
  const [pdfUrl, setPdfUrl] = useState("")

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const response = await getResumeById({ resumeId })
        if (response && response.resume) {
          setLocalData(response.resume.resumeData)
        }
      } catch (err) {
        console.error("Failed to fetch resume:", err)
        setError("Failed to fetch resume details.")
      }
    }
    fetchResume()
  }, [resumeId])

  useEffect(() => {
    let url = ""
    const fetchPdf = async () => {
      try {
        const blob = await getResumePdfBlob({ resumeId })
        url = URL.createObjectURL(blob)
        setPdfUrl(url)
      } catch (err) {
        console.error("Failed to load PDF blob:", err)
      }
    }
    if (resumeId) {
      fetchPdf()
    }
    return () => {
      if (url) URL.revokeObjectURL(url)
    }
  }, [resumeId, pdfKey])

  const handlePersonalChange = (field, val) => {
    setLocalData(prev => ({
      ...prev,
      contact: {
        ...prev.contact,
        [field]: val
      }
    }))
  }

  const handleEducationChange = (field, val) => {
    setLocalData(prev => ({
      ...prev,
      education: {
        ...prev.education,
        [field]: val
      }
    }))
  }

  const handleProjectChange = (projIndex, field, val) => {
    setLocalData(prev => {
      const updatedProjects = [...prev.projects]
      updatedProjects[projIndex] = {
        ...updatedProjects[projIndex],
        [field]: val
      }
      return {
        ...prev,
        projects: updatedProjects
      }
    })
  }

  const handleProjectBulletChange = (projIndex, bulletIndex, val) => {
    setLocalData(prev => {
      const updatedProjects = [...prev.projects]
      const updatedBullets = [...updatedProjects[projIndex].bullets]
      updatedBullets[bulletIndex] = val
      updatedProjects[projIndex] = {
        ...updatedProjects[projIndex],
        bullets: updatedBullets
      }
      return {
        ...prev,
        projects: updatedProjects
      }
    })
  }

  const addProjectBullet = (projIndex) => {
    setLocalData(prev => {
      const updatedProjects = [...prev.projects]
      updatedProjects[projIndex] = {
        ...updatedProjects[projIndex],
        bullets: [...updatedProjects[projIndex].bullets, ""]
      }
      return {
        ...prev,
        projects: updatedProjects
      }
    })
  }

  const removeProjectBullet = (projIndex, bulletIndex) => {
    setLocalData(prev => {
      const updatedProjects = [...prev.projects]
      const updatedBullets = updatedProjects[projIndex].bullets.filter((_, idx) => idx !== bulletIndex)
      updatedProjects[projIndex] = {
        ...updatedProjects[projIndex],
        bullets: updatedBullets
      }
      return {
        ...prev,
        projects: updatedProjects
      }
    })
  }

  const handleProjectLinkChange = (projIndex, linkIndex, field, val) => {
    setLocalData(prev => {
      const updatedProjects = [...prev.projects]
      const updatedLinks = [...updatedProjects[projIndex].links]
      updatedLinks[linkIndex] = {
        ...updatedLinks[linkIndex],
        [field]: val
      }
      updatedProjects[projIndex] = {
        ...updatedProjects[projIndex],
        links: updatedLinks
      }
      return {
        ...prev,
        projects: updatedProjects
      }
    })
  }

  const addProjectLink = (projIndex) => {
    setLocalData(prev => {
      const updatedProjects = [...prev.projects]
      updatedProjects[projIndex] = {
        ...updatedProjects[projIndex],
        links: [...updatedProjects[projIndex].links, { label: "GitHub", url: "" }]
      }
      return {
        ...prev,
        projects: updatedProjects
      }
    })
  }

  const removeProjectLink = (projIndex, linkIndex) => {
    setLocalData(prev => {
      const updatedProjects = [...prev.projects]
      const updatedLinks = updatedProjects[projIndex].links.filter((_, idx) => idx !== linkIndex)
      updatedProjects[projIndex] = {
        ...updatedProjects[projIndex],
        links: updatedLinks
      }
      return {
        ...prev,
        projects: updatedProjects
      }
    })
  }

  const handleAdditionalChange = (field, val) => {
    setLocalData(prev => ({
      ...prev,
      additional: {
        ...prev.additional,
        [field]: val
      }
    }))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError("")
    setSuccess("")

    try {
      await updateResume({
        resumeId,
        resumeData: localData
      })
      setSuccess("Resume updated and PDF re-generated successfully!")
      // Increment pdfKey to force PDF iframe reload with fresh query param
      setPdfKey(prev => prev + 1)
      setTimeout(() => setSuccess(""), 4000)
    } catch (err) {
      console.error("Failed to update resume:", err)
      setError("Failed to save changes and update PDF.")
    } finally {
      setSaving(false)
    }
  }



  return (
    <main className="resume-page">
      {/* Top Navbar Header */}
      <header className="dashboard-header">
        <div className="logo-nav-group">
          <button className="brand-logo" onClick={() => navigate("/resumes")} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <span>Jobnosis.</span>
          </button>
          <nav className="header-navigation">
            <button className="nav-link" onClick={() => navigate("/")}>Interview Diagnosis</button>
            <button className="nav-link active" onClick={() => navigate("/resumes")}>Tailored Resumes</button>
          </nav>
        </div>
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

      {/* Split Viewer Container */}
      <div className="viewer-split-container">
        {/* Left pane: PDF Object/Iframe */}
        <div className="pdf-preview-pane">
          <div className="pane-header">
            <h3>Resume <i>Preview</i></h3>
            <a href={getResumePdfDownloadUrl(resumeId)} download className="button download-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download PDF
            </a>
          </div>
          <div className="pdf-frame-wrapper">
            <iframe
              src={pdfUrl}
              title="Resume PDF Preview"
              className="pdf-iframe"
            />
          </div>
        </div>

        {/* Right pane: Editor Fields */}
        <div className="fields-editor-pane">
          <div className="pane-header">
            <h3>Tailor <i>Details</i></h3>
            <button type="button" onClick={() => navigate("/resumes")} className="back-btn">
              Back to Dashboard
            </button>
          </div>

          {error && <div className="error-banner small">{error}</div>}
          {success && <div className="success-banner">{success}</div>}

          {localData ? (
            <form onSubmit={handleSave} className="editor-form">
              {/* Tab Selection */}
              <div className="editor-tabs">
                <button
                  type="button"
                  className={`tab-btn ${activeTab === 'personal' ? 'active' : ''}`}
                  onClick={() => setActiveTab('personal')}
                >
                  Personal & Edu
                </button>
                <button
                  type="button"
                  className={`tab-btn ${activeTab === 'projects' ? 'active' : ''}`}
                  onClick={() => setActiveTab('projects')}
                >
                  Projects ({localData.projects?.length || 0})
                </button>
                <button
                  type="button"
                  className={`tab-btn ${activeTab === 'additional' ? 'active' : ''}`}
                  onClick={() => setActiveTab('additional')}
                >
                  Additional & Skills
                </button>
              </div>

              {/* Tab Contents */}
              <div className="tab-content-area">
                {activeTab === 'personal' && (
                  <div className="tab-pane">
                    <div className="form-section">
                      <h4>Contact Details</h4>
                      <div className="form-group">
                        <label>Candidate Name</label>
                        <input
                          type="text"
                          value={localData.name}
                          onChange={(e) => setLocalData({ ...localData, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-grid">
                        <div className="form-group">
                          <label>Location (City, State)</label>
                          <input
                            type="text"
                            value={localData.contact.location}
                            onChange={(e) => handlePersonalChange('location', e.target.value)}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Phone Number</label>
                          <input
                            type="text"
                            value={localData.contact.phone}
                            onChange={(e) => handlePersonalChange('phone', e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Email Address</label>
                        <input
                          type="email"
                          value={localData.contact.email}
                          onChange={(e) => handlePersonalChange('email', e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-grid">
                        <div className="form-group">
                          <label>GitHub URL</label>
                          <input
                            type="text"
                            value={localData.contact.github}
                            onChange={(e) => handlePersonalChange('github', e.target.value)}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>LinkedIn URL</label>
                          <input
                            type="text"
                            value={localData.contact.linkedin}
                            onChange={(e) => handlePersonalChange('linkedin', e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="form-section">
                      <h4>Education Details</h4>
                      <div className="form-group">
                        <label>Institution Name</label>
                        <input
                          type="text"
                          value={localData.education.institution}
                          onChange={(e) => handleEducationChange('institution', e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-grid">
                        <div className="form-group">
                          <label>Institution Location</label>
                          <input
                            type="text"
                            value={localData.education.location}
                            onChange={(e) => handleEducationChange('location', e.target.value)}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Degree Name</label>
                          <input
                            type="text"
                            value={localData.education.degree}
                            onChange={(e) => handleEducationChange('degree', e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <div className="form-grid">
                        <div className="form-group">
                          <label>Major & Minor details</label>
                          <input
                            type="text"
                            value={localData.education.major}
                            onChange={(e) => handleEducationChange('major', e.target.value)}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>GPA</label>
                          <input
                            type="text"
                            value={localData.education.gpa}
                            onChange={(e) => handleEducationChange('gpa', e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Expected / Graduation Date</label>
                        <input
                          type="text"
                          value={localData.education.expectedDate}
                          onChange={(e) => handleEducationChange('expectedDate', e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Relevant Coursework (semicolon separated)</label>
                        <textarea
                          style={{ height: '80px', minHeight: '60px' }}
                          value={localData.education.relevantCoursework}
                          onChange={(e) => handleEducationChange('relevantCoursework', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'projects' && (
                  <div className="tab-pane">
                    {localData.projects?.map((proj, projIdx) => (
                      <div key={projIdx} className="form-section project-section-box">
                        <div className="project-header-box">
                          <h4>Project {projIdx + 1}: {proj.name || 'Unnamed'}</h4>
                        </div>

                        <div className="form-grid">
                          <div className="form-group">
                            <label>Project Title</label>
                            <input
                              type="text"
                              value={proj.name}
                              onChange={(e) => handleProjectChange(projIdx, 'name', e.target.value)}
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label>Date or Term</label>
                            <input
                              type="text"
                              value={proj.date}
                              onChange={(e) => handleProjectChange(projIdx, 'date', e.target.value)}
                              required
                            />
                          </div>
                        </div>

                        <div className="form-group">
                          <label>Subtitle / Role</label>
                          <input
                            type="text"
                            value={proj.subtitle}
                            onChange={(e) => handleProjectChange(projIdx, 'subtitle', e.target.value)}
                            required
                          />
                        </div>

                        {/* Project Links */}
                        <div className="form-sub-section">
                          <div className="sub-section-header">
                            <h5>Project Links</h5>
                            <button type="button" onClick={() => addProjectLink(projIdx)} className="add-sub-btn">
                              + Add Link
                            </button>
                          </div>
                          {proj.links?.map((link, linkIdx) => (
                            <div key={linkIdx} className="form-grid project-link-row">
                              <div className="form-group">
                                <label>Label</label>
                                <input
                                  type="text"
                                  value={link.label}
                                  onChange={(e) => handleProjectLinkChange(projIdx, linkIdx, 'label', e.target.value)}
                                  placeholder="e.g. GitHub or Live Demo"
                                  required
                                />
                              </div>
                              <div className="form-group">
                                <label>URL</label>
                                <input
                                  type="text"
                                  value={link.url}
                                  onChange={(e) => handleProjectLinkChange(projIdx, linkIdx, 'url', e.target.value)}
                                  placeholder="https://..."
                                  required
                                />
                              </div>
                              <button type="button" onClick={() => removeProjectLink(projIdx, linkIdx)} className="remove-row-btn" title="Remove Link">
                                &times;
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* Project Bullet Points */}
                        <div className="form-sub-section">
                          <div className="sub-section-header">
                            <h5>Bullet Points (HTML &lt;strong&gt; allowed for tech)</h5>
                            <button type="button" onClick={() => addProjectBullet(projIdx)} className="add-sub-btn">
                              + Add Bullet
                            </button>
                          </div>
                          {proj.bullets?.map((bullet, bulletIdx) => (
                            <div key={bulletIdx} className="bullet-edit-row">
                              <textarea
                                style={{ height: '70px', minHeight: '50px' }}
                                value={bullet}
                                onChange={(e) => handleProjectBulletChange(projIdx, bulletIdx, e.target.value)}
                                placeholder="Describe project achievement, bold technologies using <strong>Node.js</strong>"
                                required
                              />
                              <button type="button" onClick={() => removeProjectBullet(projIdx, bulletIdx)} className="remove-bullet-btn" title="Remove Bullet">
                                &times;
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'additional' && (
                  <div className="tab-pane">
                    <div className="form-section">
                      <h4>Skills & Extracurriculars</h4>
                      <div className="form-group">
                        <label>Technical Skills (comma-separated)</label>
                        <textarea
                          style={{ height: '110px', minHeight: '80px' }}
                          value={localData.additional.technicalSkills}
                          onChange={(e) => handleAdditionalChange('technicalSkills', e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Languages (semicolon separated)</label>
                        <input
                          type="text"
                          value={localData.additional.languages}
                          onChange={(e) => handleAdditionalChange('languages', e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Achievements (HTML &lt;strong&gt; tags allowed for numbers)</label>
                        <textarea
                          style={{ height: '100px', minHeight: '70px' }}
                          value={localData.additional.achievements}
                          onChange={(e) => handleAdditionalChange('achievements', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions Footer */}
              <div className="editor-footer">
                <button
                  type="submit"
                  disabled={saving}
                  className="button primary-button save-regenerate-btn"
                >
                  {saving ? (
                    <>
                      <div className="btn-spinner"></div>
                      Regenerating PDF...
                    </>
                  ) : (
                    "Save & Re-generate PDF"
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="editor-skeleton">
              <div className="skeleton-tab-header"></div>
              <div className="skeleton-field-block"></div>
              <div className="skeleton-field-block"></div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

export default ResumeViewer
