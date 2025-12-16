// app/page.tsx
'use client'

import Link from 'next/link'
import './welcome.css';

export default function WelcomePage() {
  return (
    <>
      <div className="welcome-page">
        <header className="header">
          <div className="project-name">DreamPath Resume</div>
          <div className="auth-buttons">
            <Link href="/signup" className="btn btn-outline">Sign Up</Link>
            <Link href="/login" className="btn btn-primary">Login</Link>
          </div>
        </header>

        <main className="main-content">
          <div className="text-section">
            <h1 className="main-title">
              <span className="highlight">DreamPath</span>
              <br />
              <span>Resume</span>
            </h1>
            <p className="tagline">
              Your perfect resume is just a few clicks away! Stand out in the job market with
              professionally designed templates that highlight your skills and experience.
              Get hired faster with resumes that pass ATS scans and impress recruiters.
            </p>
            <p className="signup-prompt">
              To explore ATS-friendly and professional templates, sign up!
            </p>
            <div className="cta-buttons">
              <Link href="/signup" className="btn btn-primary">Create Your Resume</Link>
            </div>
          </div>

          <div className="image-section">
            <div className="resume-mockup">
              <img
                src="/images/welcompage image.jpg"
                alt="Welcome Page Preview"
                className="image-placeholder"
              />
            </div>
          </div>
        </main>

        <footer className="footer">
          <p>© {new Date().getFullYear()} DreamPath Resume. All rights reserved.</p>
          <p>Crafted with ❤️ to help you land your dream job</p>
        </footer>
      </div>
    </>
  )
}