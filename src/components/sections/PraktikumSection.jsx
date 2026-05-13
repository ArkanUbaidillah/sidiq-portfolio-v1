import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { BookOpen, ChevronRight, Clock, FlaskConical } from 'lucide-react'

export default function PraktikumSection() {
  const [courses, setCourses] = useState([])
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCourse, setSelectedCourse] = useState(null)

  useEffect(() => {
    const fetch = async () => {
      const [cRes, rRes] = await Promise.all([
        supabase.from('courses').select('*').order('created_at', { ascending: false }),
        supabase.from('lab_reports').select('*, courses(name, slug)').order('created_at', { ascending: false }),
      ])
      setCourses(cRes.data || [])
      setReports(rRes.data || [])
      if (cRes.data?.length) setSelectedCourse(cRes.data[0].id)
      setLoading(false)
    }
    fetch()
  }, [])

  const filtered = selectedCourse
    ? reports.filter(r => r.course_id === selectedCourse)
    : reports

  return (
    <section id="praktikum" className="py-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <span className="emerald-tag">Praktikum</span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mt-3">
            Laporan <span className="text-emerald-400">Mingguan</span>
          </h2>
          <p className="text-white/40 text-sm mt-2 font-mono">Dokumentasi praktikum per mata kuliah</p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center h-48"><div className="spinner" /></div>
        ) : (
          <>
            {/* Course tabs */}
            {courses.length > 0 && (
              <div className="flex gap-2 mb-6 flex-wrap">
                {courses.map(course => (
                  <button
                    key={course.id}
                    onClick={() => setSelectedCourse(course.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-mono transition-all ${
                      selectedCourse === course.id
                        ? 'bg-emerald-500 text-black font-bold'
                        : 'border border-white/10 text-white/40 hover:border-emerald-500/30 hover:text-emerald-400'
                    }`}
                  >
                    {course.name}
                  </button>
                ))}
              </div>
            )}

            {/* Reports grid */}
            {filtered.length === 0 ? (
              <div className="glass-card p-10 text-center text-white/30 font-mono text-sm">
                // Belum ada laporan
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((report, i) => (
                  <motion.div
                    key={report.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <Link
                      to={`/praktikum/${report.courses?.slug}/${report.slug}`}
                      className="glass-card p-5 flex flex-col gap-3 h-full block group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover:border-emerald-500/50 transition-colors">
                          <FlaskConical size={18} className="text-emerald-400" />
                        </div>
                        <ChevronRight size={16} className="text-white/20 group-hover:text-emerald-400 transition-colors mt-1" />
                      </div>

                      <div>
                        <p className="text-emerald-400/60 text-xs font-mono mb-1">{report.courses?.name}</p>
                        <h3 className="font-display font-bold text-white text-base leading-snug group-hover:text-emerald-50 transition-colors">
                          {report.title}
                        </h3>
                        {report.week_number && (
                          <p className="text-white/30 text-xs font-mono mt-1">Pertemuan {report.week_number}</p>
                        )}
                      </div>

                      <div className="flex items-center gap-1 text-white/20 text-xs font-mono mt-auto">
                        <Clock size={11} />
                        <span>{new Date(report.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
