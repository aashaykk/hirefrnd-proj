import React, { useState } from 'react'
import "../auth.form.scss"
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'

const Login = () => {
  const { loading, handleLogin } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    await handleLogin({ email, password })
    navigate('/')
  }

  if (loading) {
    return (
      <main className="auth-page" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
          <div className="brand-header" style={{ marginBottom: 0 }}>
            <span>Jobnosis</span>
          </div>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: '3px solid rgba(99, 102, 241, 0.1)',
            borderTopColor: '#6366f1',
            animation: 'spin 1s linear infinite'
          }}></div>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </main>
    )
  }

  return (
    <main className="auth-page">
      {/* Brand Header */}
      <div className="brand-header">
        <span>Jobnosis.</span>
      </div>

      {/* Main Form Card */}
      <div className="form-card">
        {/* Avatar badge at top */}
        <div className="avatar-badge">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>

        <h1>Ready for <i>Diagnosis</i>?</h1>
        <p className="subtitle">Sign in and connect with your matches.</p>

        <form onSubmit={handleSubmit}>
          {/* Email input group */}
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <div className="input-wrapper">
              <span className="input-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </span>
              <input
                onChange={(e) => { setEmail(e.target.value) }}
                type="email"
                id="email"
                name="email"
                value={email}
                required
                placeholder="Enter your email"
              />
            </div>
          </div>

          {/* Password input group */}
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <span className="input-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </span>
              <input
                onChange={(e) => { setPassword(e.target.value) }}
                type="password"
                id="password"
                name="password"
                value={password}
                required
                placeholder="Enter your password"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" className="button primary-button submit-button">
            Continue with Email
          </button>
        </form>

        {/* Footer Toggle Link */}
        <p className="footer-text">
          Don't have an account?
          <Link to="/register">Register</Link>
        </p>
      </div>
    </main>
  )
}

export default Login
