import { ReactNode, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { 
  LayoutDashboard, 
  Briefcase, 
  BookOpen, 
  Clock, 
  FileText, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  GraduationCap,
  Award,
  BarChart3,
  Flag
} from 'lucide-react'

interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Projects', href: '/projects', icon: Briefcase },
    { name: 'Learning', href: '/learning', icon: BookOpen },
    { name: 'Work History', href: '/work-history', icon: Clock },
    { name: 'Education', href: '/education', icon: GraduationCap },
    { name: 'Certifications', href: '/certifications', icon: Award },
    { name: 'Blog', href: '/blog', icon: FileText },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Feature Flags', href: '/feature-flags', icon: Flag },
    { name: 'Settings', href: '/settings', icon: Settings },
  ]

  const isActive = (path: string) => location.pathname === path

  const brand = (
    <Link
      to="/"
      className="flex flex-col items-center gap-2 px-2"
      onClick={() => setSidebarOpen(false)}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center shrink-0">
          <span className="text-white font-bold text-lg">WM</span>
        </div>
        <div className="text-left min-w-0">
          <div className="text-base font-bold gradient-text leading-tight truncate" style={{ fontFamily: 'Poppins, sans-serif' }}>
            William Malone
          </div>
          <div className="text-xs text-gray-400 font-medium tracking-wide uppercase">
            Admin
          </div>
        </div>
      </div>
    </Link>
  )

  const navList = (
    <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
      {navigation.map((item) => {
        const Icon = item.icon
        const active = isActive(item.href)
        return (
          <Link
            key={item.name}
            to={item.href}
            onClick={() => setSidebarOpen(false)}
            className={`admin-nav-link text-sm ${active ? 'admin-nav-link-active' : ''}`}
          >
            <Icon className="h-5 w-5 shrink-0" />
            <span>{item.name}</span>
          </Link>
        )
      })}
    </nav>
  )

  const userFooter = (
    <div className="border-t border-[var(--border-color)] p-3 space-y-2">
      <div className="flex items-center gap-3 rounded-lg bg-black/25 px-3 py-2 border border-[var(--border-color)]">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-sm font-bold text-[var(--primary-dark)] shrink-0">
          {user?.name?.charAt(0)?.toUpperCase() || '?'}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-100 truncate">{user?.name}</p>
          <p className="text-xs text-gray-500 truncate">{user?.email}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={logout}
        className="admin-nav-link w-full text-sm text-gray-400 hover:text-[var(--accent-cyan)]"
      >
        <LogOut className="h-5 w-5" />
        Sign out
      </button>
    </div>
  )

  return (
    <div
      className="min-h-screen relative"
      style={{
        background: 'linear-gradient(135deg, var(--primary-dark) 0%, var(--secondary-dark) 50%, #0f0f0f 100%)',
      }}
    >
      <div
        className="pointer-events-none fixed inset-0 opacity-80"
        style={{
          background:
            'radial-gradient(circle at 20% 20%, rgba(0, 212, 255, 0.08) 0%, transparent 45%), radial-gradient(circle at 85% 70%, rgba(0, 102, 255, 0.07) 0%, transparent 40%)',
        }}
      />

      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <button
          type="button"
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          aria-label="Close menu"
          onClick={() => setSidebarOpen(false)}
        />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col admin-sidebar z-10">
          <div className="flex items-start justify-between gap-2 p-4 border-b border-[var(--border-color)]">
            {brand}
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-lg text-cyan-400 hover:bg-cyan-500/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          {navList}
          {userFooter}
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col z-30">
        <div className="flex flex-col flex-1 admin-sidebar">
          <div className="p-4 border-b border-[var(--border-color)]">{brand}</div>
          {navList}
          {userFooter}
        </div>
      </div>

      <div className="lg:pl-64 relative z-10">
        <header className="admin-header sticky top-0 z-40 flex h-14 shrink-0 items-center gap-x-4 px-4 sm:px-6">
          <button
            type="button"
            className="-m-2 p-2 text-cyan-400 lg:hidden rounded-lg hover:bg-cyan-500/10 transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex flex-1 justify-end">
            <span className="text-sm text-gray-400">
              Signed in as <span className="text-gray-200 font-medium">{user?.name}</span>
            </span>
          </div>
        </header>

        <main className="py-8 sm:py-10">
          <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout
