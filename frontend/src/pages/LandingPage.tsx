import { Link, useNavigate } from 'react-router-dom'
import { BookOpen, ShieldCheck, Sparkles, ArrowRight, Users, TrendingUp, Zap, BookMarked, Search, BarChart3 } from 'lucide-react'
import { useAuth } from '../lib/auth'

export default function LandingPage() {
  const { switchPersona } = useAuth()
  const navigate = useNavigate()

  const launch = (persona: 'student' | 'diego' | 'aisha' | 'admin', path: string) => {
    switchPersona(persona)
    navigate(path)
  }

  return (
    <div className="min-h-screen bg-[#f7f5f2] text-[#1c1917]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* ── Sticky Nav ── */}
      <div className="landing">
        <nav className="landing-nav">
          <span className="logo">
            <span className="logo-icon"><BookOpen size={17} /></span>
            NoteVault<span className="logo-dot">.</span>
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 28, fontSize: 12 }}>
            <a href="#pillars" className="landing-nav" style={{ color: 'var(--muted)', fontWeight: 500, transition: 'color .15s' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}>
              How it Works
            </a>
            <Link to="/notes" style={{ color: 'var(--muted)', fontWeight: 500 }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}>
              Browse Catalog
            </Link>
            <Link to="/login" style={{ color: 'var(--muted)', fontWeight: 500 }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}>
              Sign In
            </Link>
            <Link to="/signup" className="btn btn-primary" style={{ minHeight: 36, padding: '7px 16px', fontSize: 12 }}>
              Get Started <ArrowRight size={13} />
            </Link>
          </div>
        </nav>

        {/* ── Hero ── */}
        <section className="landing-hero">
          <div className="landing-copy" style={{ animation: 'page-in .4s cubic-bezier(.16,1,.3,1)' }}>
            <span className="badge amber" style={{ fontSize: 9, letterSpacing: '.08em', padding: '5px 10px' }}>
              <ShieldCheck size={11} />
              Reputation-Moderated Academic Platform
            </span>

            <h1 style={{ fontSize: 'clamp(44px,4.8vw,68px)', lineHeight: 1.09, letterSpacing: '-3.5px', margin: '22px 0 20px' }}>
              Study smarter.{' '}<br />
              Trust <span className="hl" style={{ color: 'var(--accent)' }}>every</span>{' '}
              <span className="hl-amber" style={{ color: 'var(--amber)' }}>page</span>.
            </h1>

            <p style={{ fontSize: 14, lineHeight: 1.85, color: 'var(--muted)', maxWidth: 480 }}>
              NoteVault is the peer-moderated notes platform where contributors earn publishing trust at{' '}
              <strong style={{ color: 'var(--accent)' }}>5 clean approvals</strong>, and AI turns dense study material
              into instant recall flashcards.
            </p>

            {/* CTA buttons */}
            <div className="button-row" style={{ marginTop: 26 }}>
              <Link to="/signup" className="btn btn-primary" style={{ minHeight: 42, fontSize: 12, padding: '10px 22px' }}>
                Start Exploring Free <ArrowRight size={14} />
              </Link>
              <Link to="/notes" className="btn btn-secondary" style={{ minHeight: 42, fontSize: 12 }}>
                Browse Catalog
              </Link>
            </div>

            {/* Social proof */}
            <div className="landing-proof">
              <Users size={12} style={{ color: 'var(--success)' }} />
              <strong style={{ color: 'var(--text-2)' }}>2,400+</strong> students
              <span className="sep" />
              <TrendingUp size={12} style={{ color: 'var(--success)' }} />
              <strong style={{ color: 'var(--text-2)' }}>12,000+</strong> downloads
              <span className="sep" />
              <Zap size={12} style={{ color: 'var(--success)' }} />
              <strong style={{ color: 'var(--text-2)' }}>98%</strong> accuracy rate
            </div>

            {/* Demo launchers */}
            <div style={{ paddingTop: 22, borderTop: '1px solid var(--border)', marginTop: 20 }}>
              <span style={{ display: 'block', fontSize: 9, fontWeight: 700, color: 'var(--muted-2)', textTransform: 'uppercase', letterSpacing: '.12em', marginBottom: 10 }}>
                1-click Demo Personas:
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                {[
                  { label: '🎓 Student (Alex)', color: 'var(--swatch-teal)', border: 'var(--accent-mid)', text: 'var(--accent-dark)', fn: () => launch('student', '/home') },
                  { label: '⏳ Unproven Mod (Diego)', color: 'var(--swatch-amber)', border: 'var(--amber-mid)', text: 'var(--amber-dark)', fn: () => launch('diego', '/upload') },
                  { label: '🛡️ Trusted Mod (Aisha)', color: 'var(--success-soft)', border: '#a7f3d0', text: 'var(--success)', fn: () => launch('aisha', '/upload') },
                  { label: '⚡ Admin Console', color: '#f3f0ff', border: '#ddd6fe', text: '#5b21b6', fn: () => launch('admin', '/admin') },
                ].map(p => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={p.fn}
                    style={{
                      padding: '6px 12px', borderRadius: 7, fontSize: 11, fontWeight: 600, cursor: 'pointer',
                      background: p.color, border: `1.5px solid ${p.border}`, color: p.text,
                      transition: 'transform .15s, box-shadow .15s',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(0,0,0,.1)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = ''; }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Hero card visual */}
          <div style={{ animation: 'fade-in .5s ease .15s both', position: 'relative' }}>
            {/* Glow halo */}
            <div style={{
              position: 'absolute', inset: -20, borderRadius: 28,
              background: 'radial-gradient(ellipse at 60% 40%, var(--accent-mid) 0%, transparent 70%)',
              filter: 'blur(30px)', opacity: .7, pointerEvents: 'none',
            }} />

            <div className="hero-workspace" style={{ position: 'relative' }}>
              {/* Window chrome */}
              <div className="mini-top">
                <span className="mini-dots">
                  <i /><i /><i />
                </span>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 8 }}>cs201_trees.pdf — NoteVault</span>
                <span className="badge success" style={{ fontSize: 8, padding: '2px 6px' }}>
                  <ShieldCheck size={9} /> Trusted
                </span>
              </div>

              <div className="mini-body">
                <div className="mini-sidebar">
                  <span className="mini-logo"><BookOpen size={16} /></span>
                  <BookMarked size={13} />
                  <Search size={13} />
                  <BarChart3 size={13} />
                </div>

                <div className="mini-content">
                  <div className="eyebrow">CS 201 · Data Structures</div>
                  <h2>Data Structures &amp;<br />Algorithmic Complexity</h2>

                  <div className="mini-search">
                    <Search size={10} />
                    <span>Search notes…</span>
                    <kbd>⌘K</kbd>
                  </div>

                  <div className="mini-notes">
                    <div className="mini-note" style={{ background: 'var(--swatch-teal)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <Sparkles size={9} style={{ color: 'var(--accent)' }} />
                        <small>AI SUMMARY</small>
                      </div>
                      <strong>AVL Trees &amp; O(log n) invariants</strong>
                      <div className="mini-lines" />
                      <span>
                        <span className="badge success" style={{ fontSize: 7, padding: '1px 5px' }}>Verified</span>
                        <span style={{ color: 'var(--muted-2)' }}>342 DLs</span>
                      </span>
                    </div>
                    <div className="mini-note" style={{ background: 'var(--swatch-amber)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <BookOpen size={9} style={{ color: 'var(--amber)' }} />
                        <small>NOTES</small>
                      </div>
                      <strong>Dijkstra Graph Traversal</strong>
                      <div className="mini-lines" />
                      <span>
                        <span className="badge amber" style={{ fontSize: 7, padding: '1px 5px' }}>PDF</span>
                        <span style={{ color: 'var(--muted-2)' }}>28 pages</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mini-footer">
                <ShieldCheck size={9} style={{ color: 'var(--accent)' }} />
                Moderated by Aisha · Trusted Contributor
              </div>
            </div>

            {/* Floating live-update chip */}
            <div style={{
              position: 'absolute', bottom: -16, right: 14,
              background: '#fff', border: '1.5px solid var(--border)', borderRadius: 10,
              padding: '10px 12px', boxShadow: '0 4px 14px rgba(0,0,0,.1)',
              fontSize: 10, display: 'flex', alignItems: 'center', gap: 8, minWidth: 150,
              animation: 'float 4s ease-in-out infinite',
            }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--success)', flexShrink: 0 }} />
              <div>
                <strong style={{ fontSize: 10, display: 'block', color: 'var(--text)' }}>Aisha published CS201</strong>
                <span style={{ color: 'var(--muted-2)', fontSize: 9 }}>2 min ago · Auto-published ✓</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Three Pillars ── */}
        <section id="pillars" className="landing-features">
          <div className="feature-intro">
            <div>
              <div className="eyebrow">Platform Architecture</div>
              <h2>Three pillars of<br />trusted knowledge.</h2>
              <p style={{ fontSize: 11, marginTop: 10, maxWidth: 200 }}>
                Quality, accountability, and observability built into every layer.
              </p>
            </div>
          </div>

          {[
            {
              icon: <BookOpen size={18} />,
              title: 'Student Discovery & AI Recall',
              body: 'Filter by department and keyword. Read AI-generated summaries, flip recall flashcards, and download clean study PDFs.',
              color: 'var(--accent)',
            },
            {
              icon: <ShieldCheck size={18} />,
              title: 'Reputation-Based Moderation',
              body: 'New mods start unproven — manual review queue. Reach 5 approved uploads to flip to Trusted for instant auto-publishing. Valid reports reset trust to 0.',
              color: 'var(--amber)',
            },
            {
              icon: <BarChart3 size={18} />,
              title: 'Kafka Streams & Observability',
              body: 'Admins monitor review queues, report resolutions, and a real-time event pipeline with full JSON inspection of note-events and audit-stream topics.',
              color: '#7c3aed',
            },
          ].map(f => (
            <article key={f.title}>
              <div className="feature-icon" style={{ background: `${f.color}14`, color: f.color, borderColor: `${f.color}30` }}>
                {f.icon}
              </div>
              <h3>{f.title}</h3>
              <p>{f.body}</p>
            </article>
          ))}
        </section>

        {/* ── Footer ── */}
        <footer className="landing-footer">
          <span className="logo" style={{ fontSize: 16 }}>
            <span className="logo-icon" style={{ width: 26, height: 26, borderRadius: 7 }}><BookOpen size={14} /></span>
            NoteVault<span className="logo-dot">.</span>
          </span>
          <span>Built for collaborative academic excellence.</span>
          <Link to="/notes">Catalog</Link>
          <Link to="/upload">Moderator Portal</Link>
          <Link to="/admin">Admin Console</Link>
          <a href="#pillars">
            <ArrowRight size={12} /> Back to top
          </a>
        </footer>
      </div>
    </div>
  )
}
