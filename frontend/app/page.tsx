// app/page.tsx
'use client'

import Link from 'next/link'
import './landing.css'
import { ArrowRight, Briefcase, User, Sparkles, Zap, ShieldCheck, Trophy } from 'lucide-react'

export default function WelcomePage() {
  return (
    <div className="landing-container">
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>

      <nav className="nav">
        <div className="logo">
          <Sparkles className="w-8 h-8 text-indigo-500" />
          DreamPath
        </div>
        <div className="nav-links">
          <Link href="/templates" className="nav-link">Templates</Link>
          <Link href="/ai-counsellor" className="nav-link">AI Guide</Link>
          <Link href="/login" className="nav-link">Login</Link>
          <Link href="/signup" className="btn-premium btn-main" style={{ padding: '10px 24px', fontSize: '1rem' }}>
            Build My Resume
          </Link>
        </div>
      </nav>

      <main className="hero">
        <div className="hero-badge animate-up">
          <Sparkles className="w-4 h-4 inline mr-2" />
          The Ultimate AI Resume Architect
        </div>

        <h1 className="hero-title animate-up delay-1">
          Build Your <span>Dream Career</span> <br /> with AI Precision.
        </h1>

        <p className="hero-description animate-up delay-2">
          Create professional, ATS-optimized resumes in minutes. Powered by advanced AI
          to craft your content and an expert AI Guide to navigate your professional journey.
        </p>

        <div className="hero-actions animate-up delay-3">
          <Link href="/signup" className="btn-premium btn-main">
            Start Building Now <ArrowRight className="w-5 h-5" />
          </Link>
          <Link href="/ai-counsellor" className="btn-premium btn-secondary">
            Chat with AI Guide
          </Link>
        </div>


      </main>

      <section className="features-section">
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '3rem', color: 'var(--text-main)' }}>Smart Resume Preparation</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem' }}>AI-driven tools to get you noticed by top employers.</p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon"><Zap /></div>
            <h3>AI Content Generation</h3>
            <p>Let our AI write compelling professional summaries and bullet points tailored to your industry.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><ShieldCheck /></div>
            <h3>ATS Optimization</h3>
            <p>Ensure your resume passes through automated filters with intelligently placed keywords and formatting.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><Trophy /></div>
            <h3>Expert AI Guide</h3>
            <p>Receive personalized advice, interview tips, and career roadmaps from your dedicated AI counsellor.</p>
          </div>
        </div>
      </section>

      <section className="role-section" style={{ minHeight: 'auto', paddingBottom: '100px' }}>
        <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-[3rem] p-12 lg:p-20 max-w-5xl mx-auto">
          <h2 style={{ fontSize: '3rem', color: 'var(--text-main)', marginBottom: '1.5rem' }}>Ready to build your best resume?</h2>
          <p style={{ color: '#94a3b8', fontSize: '1.25rem', marginBottom: '3rem', maxWidth: '700px', marginInline: 'auto' }}>
            Join thousands of successful professionals using DreamPath. Create, refine, and perfect your professional identity with the help of AI.
          </p>
          <Link href="/signup" className="btn-premium btn-main" style={{ display: 'inline-flex', padding: '20px 48px', fontSize: '1.25rem' }}>
            Get Started <ArrowRight className="w-6 h-6 ml-2" />
          </Link>
        </div>
      </section>

      <footer style={{ padding: '80px 5%', borderTop: '1px solid var(--glass-border)', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>© 2024 DreamPath. Built with ❤️ for the future of work.</p>
      </footer>
    </div>
  )
}
