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
  Moon,
  Sun,
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
      <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform">
        <BookOpen className="w-4 h-4" />
      </span>
      <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
        NoteVault<span className="text-amber-500">.</span>
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

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('nv-theme') === 'dark'
  })

  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? 'dark' : 'light'
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('nv-theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

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
    <div className="min-h-screen flex flex-col bg-stone-50/70 dark:bg-zinc-950 text-stone-900 dark:text-zinc-100 transition-colors relative overflow-x-hidden selection:bg-indigo-100 dark:selection:bg-indigo-900/50">
      {/* Subtle colorful ambient mesh background glow */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-gradient-to-br from-indigo-200/35 via-purple-200/25 to-pink-200/20 dark:from-indigo-950/25 dark:via-purple-950/20 dark:to-pink-950/15 blur-3xl opacity-80" />
        <div className="absolute top-1/3 -left-32 w-96 h-96 rounded-full bg-gradient-to-tr from-amber-200/25 via-emerald-200/20 to-teal-200/20 dark:from-amber-950/20 dark:via-emerald-950/15 dark:to-teal-950/15 blur-3xl opacity-75" />
        <div className="absolute -bottom-32 right-1/4 w-96 h-96 rounded-full bg-gradient-to-tl from-sky-200/25 via-blue-200/20 to-indigo-200/25 dark:from-sky-950/20 dark:via-blue-950/15 dark:to-indigo-950/20 blur-3xl opacity-75" />
      </div>

      {/* Top Testing Persona Bar for Instant Role Switching */}
      <DemoPersonaBar />

      {/* Main Topbar Navigation */}
      <header className="sticky top-0 z-40 h-14 border-b border-indigo-100/70 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="lg:hidden p-1.5 rounded-lg text-stone-600 hover:bg-stone-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
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
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 dark:text-zinc-500" />
            <input
              type="text"
              placeholder="Search concepts, algorithms, class notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-1.5 text-xs bg-stone-100/80 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700/80 rounded-lg text-stone-900 dark:text-zinc-100 placeholder-stone-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white dark:focus:bg-zinc-800"
            />
            <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono px-1 py-0.2 bg-stone-200 dark:bg-zinc-700 rounded text-stone-500 dark:text-zinc-400">
              ↵
            </kbd>
          </div>
        </form>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <div className="h-4 w-[1px] bg-stone-200 dark:bg-zinc-800 mx-1" />

          {/* User Account Button */}
          <button
            type="button"
            onClick={() => setAccountModal(true)}
            className="flex items-center gap-2 p-1 pl-2 rounded-lg hover:bg-stone-100 dark:hover:bg-zinc-800 transition-colors text-left"
          >
            <div className="hidden sm:block text-right">
              <span className="text-xs font-semibold text-stone-900 dark:text-zinc-100 block leading-tight">
                {user?.name || 'Alex Morgan'}
              </span>
              <span className="text-[10px] text-stone-500 dark:text-zinc-400 font-mono uppercase">
                {user?.role || 'student'}
              </span>
            </div>
            <Avatar name={user?.name || 'Alex Morgan'} size="sm" />
            <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
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
          className={`fixed lg:sticky top-[calc(3.5rem+1.75rem)] h-[calc(100vh-3.5rem-1.75rem)] w-60 z-40 flex flex-col justify-between border-r border-stone-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-4 transition-transform duration-200 ${
            drawer ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="space-y-4">
            {/* Campus / Workspace Badge */}
            <div className="px-3 py-2 rounded-xl bg-gradient-to-r from-indigo-50/80 via-purple-50/50 to-pink-50/30 dark:from-indigo-950/40 dark:via-purple-950/30 dark:to-zinc-900 border border-indigo-200/80 dark:border-indigo-800/60 text-xs shadow-2xs">
              <span className="text-[10px] uppercase tracking-wider font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                Academic Campus
              </span>
              <span className="font-bold text-stone-900 dark:text-zinc-100 truncate block mt-0.5">
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
                        ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 font-semibold'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-zinc-800/60'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                  </div>
                  {badge && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300">
                      {badge}
                    </span>
                  )}
                  {count !== undefined && count > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-semibold bg-stone-200 dark:bg-zinc-700 text-stone-700 dark:text-zinc-300">
                      {count}
                    </span>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* Role Dedicated Links */}
            <div className="pt-3 border-t border-stone-100 dark:border-zinc-800 space-y-1">
              <span className="px-3 text-[10px] font-semibold tracking-wider uppercase text-stone-400 dark:text-zinc-500 block mb-1">
                Role Portals
              </span>

              {/* Upload Note Link (Visible to Moderators and Admin, or for testing) */}
              <NavLink
                to="/upload"
                onClick={() => setDrawer(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 font-semibold'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-zinc-800/60'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <Upload className="w-4 h-4" />
                  <span>Upload Notes</span>
                </div>
                {user?.role === 'moderator' && (
                  <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400">
                    {user?.isTrusted ? 'TRUSTED' : '2/5'}
                  </span>
                )}
              </NavLink>

              {/* Admin Console Link (Shown to admin or for quick inspection) */}
              <NavLink
                to="/admin"
                onClick={() => setDrawer(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-purple-50 text-purple-800 dark:bg-purple-950/40 dark:text-purple-300 font-semibold'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-zinc-800/60'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Admin Console</span>
                </div>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                  6 TABS
                </span>
              </NavLink>
            </div>
          </div>

          {/* Sidebar Footer: Reputation Status Pill */}
          <div className="pt-4 border-t border-stone-100 dark:border-zinc-800">
            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-50/70 via-white to-amber-50/40 dark:from-emerald-950/30 dark:via-zinc-900 dark:to-amber-950/20 border border-emerald-200/80 dark:border-emerald-800/60 text-xs shadow-2xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                  Trust Status
                </span>
                <TrustBadge
                  isTrusted={isTrusted}
                  cleanCount={user?.cleanUploadCount ?? (isTrusted ? 5 : 0)}
                  threshold={5}
                />
              </div>
              <p className="text-[11px] font-semibold text-emerald-800/90 dark:text-emerald-300/90 leading-tight">
                {isTrusted ? '✨ Full auto-publishing privileges enabled' : '🛡️ Submissions undergo peer verification'}
              </p>
            </div>
          </div>
        </aside>

        {/* Main Routed Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 max-w-7xl mx-auto w-full">
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
          <div className="p-4 rounded-xl bg-stone-50 dark:bg-zinc-800/60 border border-stone-200 dark:border-zinc-700 flex items-center gap-3">
            <Avatar name={user?.name || 'User'} size="lg" />
            <div>
              <p className="text-sm font-bold text-stone-900 dark:text-zinc-100">{user?.name}</p>
              <p className="text-stone-500 dark:text-zinc-400">{user?.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                  Role: {user?.role}
                </span>
                <span className="text-stone-400">·</span>
                <span className="text-stone-500 dark:text-zinc-400 text-[11px]">
                  {user?.university}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <span className="font-semibold text-stone-700 dark:text-zinc-300 block text-xs">
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

          <div className="pt-3 border-t border-stone-100 dark:border-zinc-800 flex justify-between">
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
