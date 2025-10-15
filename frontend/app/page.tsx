// app/page.tsx
'use client'

import Link from 'next/link'

export default function WelcomePage() {
  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .welcome-page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.2rem 2rem;
          background: white;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .project-name {
          font-size: 1.8rem;
          font-weight: 800;
          background: linear-gradient(90deg, #2563eb, #4f46e5);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .auth-buttons {
          display: flex;
          gap: 1rem;
        }

        .btn {
          padding: 0.6rem 1.2rem;
          border-radius: 0.5rem;
          font-weight: 600;
          text-decoration: none;
          display: inline-block;
          transition: all 0.2s;
        }

        .btn-outline {
          background: white;
          color: #2563eb;
          border: 2px solid #2563eb;
        }

        .btn-outline:hover {
          background: #eff6ff;
        }

        .btn-primary {
          background: #2563eb;
          color: white;
          border: 2px solid #2563eb;
        }

        .btn-primary:hover {
          background: #1d4ed8;
        }

        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 3rem 2rem;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
          gap: 3rem;
        }

        .text-section {
          text-align: center;
        }

        .main-title {
          font-size: 2.8rem;
          font-weight: 800;
          margin-bottom: 1.5rem;
          line-height: 1.2;
        }

        .highlight {
          background: linear-gradient(90deg, #2563eb, #4f46e5);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          display: block;
        }

        .tagline {
          font-size: 1.2rem;
          color: #4b5563;
          max-width: 700px;
          margin: 0 auto 1.5rem;
          line-height: 1.6;
        }

        .signup-prompt {
          font-size: 1.1rem;
          color: #2563eb;
          font-weight: 600;
          margin: 1rem auto;
          max-width: 600px;
          line-height: 1.5;
        }

        .cta-buttons {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          align-items: center;
        }

        .image-section {
          display: flex;
          justify-content: center;
        }

        .resume-mockup {
          background: white;
          border-radius: 1.2rem;
          box-shadow: 0 12px 30px rgba(0,0,0,0.18);
          padding: 1.2rem;
          width: auto;
          max-width: 100%;
          border: 1px solid #e2e8f0;
          position: relative;
          overflow: hidden;
          display: inline-block;
        }

        .image-placeholder {
          width: 100%;
          height: auto;
          max-height: 400px;
          object-fit: contain;
          border-radius: 0.8rem;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .footer {
          text-align: center;
          padding: 2rem;
          background: #1f2937;
          color: #d1d5db;
          margin-top: auto;
        }

        .footer p {
          margin: 0.3rem 0;
        }

        @media (min-width: 768px) {
          .main-content {
            flex-direction: row;
            align-items: flex-start;
            gap: 2rem;
          }

          .text-section {
            text-align: left;
            flex: 1;
            max-width: 500px;
          }

          .image-section {
            flex: 1;
            display: flex;
            justify-content: center;
          }

          .main-title {
            font-size: 3.2rem;
          }

          .tagline, .signup-prompt {
            text-align: left;
            margin-left: 0;
          }

          .cta-buttons {
            align-items: flex-start;
          }

          .resume-mockup {
            width: 100%;
            max-width: 450px;
          }
        }
      `}</style>

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