import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AdminLayout from '../../components/admin/AdminLayout.jsx'
import { supabase } from '../../lib/supabase'
import { FlaskConical, Folder, Award, BookOpen } from 'lucide-react'

export default function AdminDashboard() {
  const [counts, setCounts] = useState({ reports: 0, projects: 0, certs: 0, courses: 0 })

  useEffect(() => {
    const fetch = async () => {
      const [r, p, c, co] = await Promise.all([
        supabase.from('lab_reports').select('id', { count: 'exact', head: true }),
        supabase.from('projects').select('id', { count: 'exact', head: true }),
        supabase.from('certificates').select('id', { count: 'exact', head: true }),
        supabase.from('courses').select('id', { count: 'exact', head: true }),
      ])
      setCounts({ reports: r.count || 0, projects: p.count || 0, certs: c.count || 0, courses: co.count || 0 })
    }
    fetch()
  }, [])

  const cards = [
    { to: '/admin/reports', icon: FlaskConical, label: 'Laporan Praktikum', count: counts.reports, color: 'emerald' },
    { to: '/admin/courses', icon: BookOpen, label: 'Mata Kuliah', count: counts.courses, color: 'emerald' },
    { to: '/admin/projects', icon: Folder, label: 'Projects', count: counts.projects, color: 'emerald' },
    { to: '/admin/certificates', icon: Award, label: 'Sertifikat', count: counts.certs, color: 'emerald' },
  ]

  return (
    <AdminLayout>
      <div className="max-w-4xl">
        <h1 className="font-display font-extrabold text-2xl text-white mb-2">Dashboard</h1>
        <p className="text-white/30 text-xs font-mono mb-8">Muhamad Sidiq Portfolio CMS</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {cards.map(({ to, icon: Icon, label, count }) => (
            <Link key={to} to={to} className="glass-card p-5 flex flex-col gap-3 hover:border-emerald-500/30 transition-colors">
              <Icon size={20} className="text-emerald-400" />
              <div>
                <p className="font-display font-extrabold text-3xl text-white">{count}</p>
                <p className="text-white/30 text-xs font-mono mt-0.5">{label}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 glass-card p-6">
          <p className="text-emerald-400 font-mono text-sm mb-2">$ system.status</p>
          <p className="text-white/40 text-xs font-mono">→ Semua sistem berjalan normal</p>
          <p className="text-white/40 text-xs font-mono">→ Supabase: Connected</p>
          <p className="text-white/40 text-xs font-mono">→ EmailJS: Ready</p>
        </div>
      </div>
    </AdminLayout>
  )
}
