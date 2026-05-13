import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import toast from 'react-hot-toast'
import { LayoutDashboard, FlaskConical, Folder, Award, BookOpen, LogOut, Terminal } from 'lucide-react'

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { to: '/admin/reports', icon: FlaskConical, label: 'Laporan' },
  { to: '/admin/courses', icon: BookOpen, label: 'Mata Kuliah' },
  { to: '/admin/projects', icon: Folder, label: 'Projects' },
  { to: '/admin/certificates', icon: Award, label: 'Sertifikat' },
]

export default function AdminLayout({ children }) {
  const { signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    await signOut()
    toast.success('Logout berhasil')
    navigate('/sidiq-admin')
  }

  return (
    <div className="min-h-screen bg-black flex">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 border-r border-white/5 flex flex-col py-6 px-3 sticky top-0 h-screen">
        <div className="flex items-center gap-2 px-3 mb-8">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center">
            <Terminal size={14} className="text-emerald-400" />
          </div>
          <span className="font-display font-bold text-white text-sm">
            <span className="text-emerald-400">MS</span>.admin
          </span>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map(({ to, icon: Icon, label, exact }) => {
            const active = exact ? location.pathname === to : location.pathname.startsWith(to)
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-mono transition-all ${
                  active
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'text-white/30 hover:text-white/70 hover:bg-white/3'
                }`}
              >
                <Icon size={15} />
                {label}
              </Link>
            )
          })}
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-mono text-white/30 hover:text-red-400 hover:bg-red-500/5 transition-all"
        >
          <LogOut size={15} /> Logout
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 p-6 overflow-auto">
        {children}
      </main>
    </div>
  )
}
