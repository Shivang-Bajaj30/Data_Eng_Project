import React, { useState, useEffect } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  BookOpen,
  Home,
  Files,
  Layers,
  Sparkles,
  Bookmark,
  Upload,
  ShieldCheck,
  Menu,
  Search,
  ChevronDown,
  LogOut,
} from 'lucide-react'
import { useAuth } from '../lib/auth'
import { useWorkspace } from '../lib/workspace'
import { Avatar, Modal, Button, TrustBadge } from '../components/ui'
import { DemoPersonaBar } from '../features/auth/DemoPersonaBar'

export function Logo() {
  return (
    <Link className="flex items-center gap-2 font-bold tracking-tight text-base select-none group" to="/">
      <span className="w-8 h-8 rounded-xl bg-[#0d9488] text-white flex items-center justify-center shadow-md shadow-teal-500/30 group-hover:scale-105 transition-transform">
        <BookOpen className="w-4 h-4" />
      </span>
      <span className="text-base font-extrabold tracking-tight text-[#1c1917]">
        NoteVault<span style={{ color: 'var(--amber)' }}>.</span>
      </span>
    </Link>
  )
}

export default function AppLayout() {
  const { user, logout, switchPersona, isTrusted } = useAuth()
  const { saved } = useWorkspace()
  const [drawer, setDrawer] = useState(false)
  const [accountModal, setAccountModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    // Always light theme — remove any stale dark tokens
    document.documentElement.dataset.theme = 'light'
    document.documentElement.classList.remove('dark')
    localStorage.removeItem('nv-theme')
  }, [])

  const navLinks = [
    { to: '/home', label: 'Overview', icon: Home },
    { to: '/notes', label: 'Browse Notes', icon: Files },
    { to: '/classes', label: 'Courses', icon: Layers },
    { to: '/search', label: 'AI Search', icon: Sparkles, badge: 'AI' },
    { to: '/saved', label: 'Saved Bookshelf', icon: Bookmark, count: saved.length },
  ]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f5f2] text-[#1c1917] relative overflow-x-hidden" style={{ selection: 'var(--accent-soft)' }}>
      {/* Ambient teal+amber glow blobs */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-60" style={{ background: 'radial-gradient(circle, var(--accent-mid) 0%, transparent 70%)', filter: 'blur(48px)' }} />
        <div className="absolute top-1/3 -left-32 w-96 h-96 rounded-full opacity-50" style={{ background: 'radial-gradient(circle, var(--amber-mid) 0%, transparent 70%)', filter: 'blur(48px)' }} />
        <div className="absolute -bottom-32 right-1/4 w-80 h-80 rounded-full opacity-40" style={{ background: 'radial-gradient(circle, var(--swatch-sage) 0%, transparent 70%)', filter: 'blur(40px)' }} />
      </div>

      {/* Top Testing Persona Bar for Instant Role Switching */}
      <DemoPersonaBar />

      {/* Main Topbar Navigation */}
      <header className="sticky top-0 z-40 h-14 border-b border-[#e8e4df] bg-white/92 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between gap-4" style={{ backdropFilter: 'blur(14px) saturate(160%)' }}>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="lg:hidden p-1.5 rounded-lg text-[#78716c] hover:bg-[#f3f1ee]"
            aria-label="Toggle navigation menu"
            onClick={() => setDrawer(!drawer)}
          >
            <Menu className="w-5 h-5" />
          </button>
          <Logo />
        </div>

        {/* Global Search Input */}
        <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--muted-2)' }} />
            <input
              type="text"
              placeholder="Search concepts, algorithms, class notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%', paddingLeft: 36, paddingRight: 32, paddingTop: 7, paddingBottom: 7,
                fontSize: 12, background: 'var(--surface-2)', border: '1.5px solid var(--border)',
                borderRadius: 'var(--r)', color: 'var(--text)', outline: 'none',
              }}
              onFocus={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(13,148,136,.1)'; }}
              onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = ''; }}
            />
            <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono px-1 rounded" style={{ background: 'var(--surface)', border: '1px solid var(--border-2)', color: 'var(--muted-2)', fontSize: 10 }}>
              ↵
            </kbd>
          </div>
        </form>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <div className="h-4 w-[1px] mx-1" style={{ background: 'var(--border)' }} />
          {/* User Account Button */}
          <button
            type="button"
            onClick={() => setAccountModal(true)}
            className="flex items-center gap-2 p-1 pl-2 rounded-lg text-left transition-colors"
            style={{ transition: 'background .15s' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-2)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <div className="hidden sm:block text-right">
              <span className="text-xs font-semibold block leading-tight" style={{ color: 'var(--text)' }}>
                {user?.name || 'Alex Morgan'}
              </span>
              <span className="text-[10px] font-mono uppercase" style={{ color: 'var(--muted)', letterSpacing: '.05em' }}>
                {user?.role || 'student'}
              </span>
            </div>
            <Avatar name={user?.name || 'Alex Morgan'} size="sm" />
            <ChevronDown className="w-3.5 h-3.5" style={{ color: 'var(--muted-2)' }} />
          </button>
        </div>
      </header>

      {/* Main Layout Body */}
      <div className="flex-1 flex">
        {/* Mobile Drawer Overlay */}
        {drawer && (
          <div
            className="fixed inset-0 z-40 bg-stone-950/40 backdrop-blur-xs lg:hidden"
            onClick={() => setDrawer(false)}
          />
        )}

        {/* Left Sidebar */}
        <aside
          className={`fixed lg:sticky top-[calc(3.5rem+1.75rem)] h-[calc(100vh-3.5rem-1.75rem)] w-60 z-40 flex flex-col justify-between border-r px-3 py-4 transition-transform duration-200 ${
            drawer ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
          style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
        >
          <div className="space-y-4">
            {/* Campus / Workspace Badge */}
            <div className="px-3 py-2 rounded-xl text-xs" style={{ background: 'var(--accent-soft)', border: '1.5px solid var(--accent-mid)' }}>
              <span className="text-[10px] uppercase tracking-wider font-bold flex items-center gap-1.5" style={{ color: 'var(--accent-dark)' }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent)' }} />
                Academic Campus
              </span>
              <span className="font-bold truncate block mt-0.5" style={{ color: 'var(--text)' }}>
                {user?.university || 'Cornell University'}
              </span>
            </div>

            {/* Nav Links */}
            <nav className="space-y-1">
              {navLinks.map(({ to, label, icon: Icon, badge, count }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setDrawer(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      isActive
                        ? 'font-semibold'
                        : ''
                    }`
                  }
                  style={({ isActive }) => ({
                    color: isActive ? 'var(--accent-dark)' : 'var(--muted)',
                    background: isActive ? 'var(--accent-soft)' : 'transparent',
                  })}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                  </div>
                  {badge && (
                    <span className="px-1.5 rounded text-[9px] font-bold" style={{ background: 'var(--accent-mid)', color: 'var(--accent-dark)' }}>
                      {badge}
                    </span>
                  )}
                  {count !== undefined && count > 0 && (
                    <span className="px-1.5 rounded-full text-[10px] font-semibold" style={{ background: 'var(--surface-2)', color: 'var(--muted)' }}>
                      {count}
                    </span>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* Role Dedicated Links */}
            <div className="pt-3 border-t space-y-1" style={{ borderColor: 'var(--border)' }}>
              <span className="px-3 text-[10px] font-bold tracking-wider uppercase block mb-1" style={{ color: 'var(--muted-2)' }}>
                Role Portals
              </span>

              <NavLink
                to="/upload"
                onClick={() => setDrawer(false)}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors"
                style={({ isActive }) => ({
                  color: isActive ? 'var(--amber-dark)' : 'var(--muted)',
                  background: isActive ? 'var(--amber-soft)' : 'transparent',
                  fontWeight: isActive ? 600 : 500,
                })}
              >
                <div className="flex items-center gap-2.5">
                  <Upload className="w-4 h-4" />
                  <span>Upload Notes</span>
                </div>
                {user?.role === 'moderator' && (
                  <span className="text-[10px] font-mono" style={{ color: 'var(--amber)' }}>
                    {user?.isTrusted ? 'TRUSTED' : '2/5'}
                  </span>
                )}
              </NavLink>

              <NavLink
                to="/admin"
                onClick={() => setDrawer(false)}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors"
                style={({ isActive }) => ({
                  color: isActive ? 'var(--accent-dark)' : 'var(--muted)',
                  background: isActive ? 'var(--accent-soft)' : 'transparent',
                  fontWeight: isActive ? 600 : 500,
                })}
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Admin Console</span>
                </div>
                <span className="px-1.5 rounded text-[9px] font-mono" style={{ background: 'var(--accent-mid)', color: 'var(--accent-dark)' }}>
                  6 TABS
                </span>
              </NavLink>
            </div>
          </div>

          {/* Sidebar Footer: Reputation Status Pill */}
          <div className="pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
            <div className="p-3 rounded-xl text-xs" style={{ background: 'linear-gradient(135deg, var(--accent-soft), #fffdf0)', border: '1.5px solid var(--accent-mid)' }}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>
                  Trust Status
                </span>
                <TrustBadge
                  isTrusted={isTrusted}
                  cleanCount={user?.cleanUploadCount ?? (isTrusted ? 5 : 0)}
                  threshold={5}
                />
              </div>
              <p className="text-[11px] font-semibold leading-tight" style={{ color: 'var(--accent-dark)' }}>
                {isTrusted ? '✨ Full auto-publishing privileges enabled' : '🛡️ Submissions undergo peer verification'}
              </p>
            </div>
          </div>
        </aside>

        {/* Main Routed Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 max-w-7xl mx-auto w-full" style={{ background: 'transparent' }}>
          <Outlet />
        </main>
      </div>

      {/* Account Info Modal */}
      <Modal
        open={accountModal}
        onClose={() => setAccountModal(false)}
        title="Account Profile & Session"
        description="Active credentials and session management."
      >
        <div className="space-y-4 text-xs">
          <div className="p-4 rounded-xl flex items-center gap-3" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
            <Avatar name={user?.name || 'User'} size="lg" />
            <div>
              <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>{user?.name}</p>
              <p style={{ color: 'var(--muted)' }}>{user?.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 rounded text-[10px] font-mono uppercase" style={{ background: 'var(--accent-mid)', color: 'var(--accent-dark)' }}>
                  Role: {user?.role}
                </span>
                <span style={{ color: 'var(--muted-2)' }}>·</span>
                <span className="text-[11px]" style={{ color: 'var(--muted)' }}>
                  {user?.university}
                </span>
              </div>
            </div>
          </div>


          <div className="space-y-2">
            <span className="font-semibold block text-xs" style={{ color: 'var(--text-2)' }}>
              Quick-Switch Session Persona:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  switchPersona('student')
                  setAccountModal(false)
                }}
              >
                Student (Alex)
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  switchPersona('diego')
                  setAccountModal(false)
                }}
              >
                Diego (2/5 Mod)
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  switchPersona('aisha')
                  setAccountModal(false)
                }}
              >
                Aisha (Trusted Mod)
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  switchPersona('admin')
                  setAccountModal(false)
                }}
              >
                Admin (Sarah)
              </Button>
            </div>
          </div>

          <div className="pt-3 border-t flex justify-between" style={{ borderColor: 'var(--border)' }}>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                logout()
                setAccountModal(false)
                navigate('/login')
              }}
              leftIcon={<LogOut className="w-3.5 h-3.5" />}
            >
              Sign Out
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setAccountModal(false)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
