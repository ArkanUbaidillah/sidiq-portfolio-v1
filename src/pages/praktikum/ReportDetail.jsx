import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase, getImageUrl } from '../../lib/supabase'
import { ArrowLeft, Clock, BookOpen, FlaskConical } from 'lucide-react'

// Block renderer
function BlockRenderer({ block }) {
  if (block.type === 'text') {
    return (
      <div
        className="prose-dark my-4"
        dangerouslySetInnerHTML={{ __html: block.content.replace(/\n/g, '<br/>') }}
      />
    )
  }
  if (block.type === 'image') {
    return (
      <div className="my-6">
        <img
          src={getImageUrl('lab-reports', block.path)}
          alt={block.caption || ''}
          className="w-full rounded-xl border border-emerald-500/20 max-h-[600px] object-contain bg-black/50"
        />
        {block.caption && (
          <p className="text-center text-white/30 text-xs font-mono mt-2">{block.caption}</p>
        )}
      </div>
    )
  }
  if (block.type === 'heading') {
    return <h2 className="font-display font-bold text-2xl text-emerald-400 mt-8 mb-3">{block.content}</h2>
  }
  return null
}

export default function ReportDetail() {
  const { courseSlug, reportSlug } = useParams()
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await supabase
        .from('lab_reports')
        .select('*, courses(name, slug)')
        .eq('slug', reportSlug)
        .single()

      if (error || !data) {
        setNotFound(true)
      } else {
        setReport(data)
      }
      setLoading(false)
    }
    fetch()
  }, [reportSlug])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="spinner" />
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
        <p className="text-white/30 font-mono text-sm">// 404 — Laporan tidak ditemukan</p>
        <Link to="/" className="emerald-tag hover:border-emerald-500 transition-colors">← Kembali ke Home</Link>
      </div>
    )
  }

  const blocks = report.blocks || []

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="border-b border-white/5 sticky top-0 z-50" style={{ backdropFilter: 'blur(20px)', background: 'rgba(0,0,0,0.9)' }}>
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link to="/" className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-white/40 hover:text-emerald-400 hover:border-emerald-500/30 transition-all">
            <ArrowLeft size={15} />
          </Link>
          <div>
            <p className="text-emerald-400/60 text-xs font-mono">{report.courses?.name}</p>
            <p className="text-white font-display font-bold text-sm truncate">{report.title}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Meta */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="emerald-tag flex items-center gap-1">
                <FlaskConical size={11} /> {report.courses?.name}
              </span>
              {report.week_number && (
                <span className="emerald-tag">Pertemuan {report.week_number}</span>
              )}
            </div>

            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white leading-tight mb-4">
              {report.title}
            </h1>

            <div className="flex items-center gap-1 text-white/30 text-xs font-mono">
              <Clock size={11} />
              <span>
                {new Date(report.created_at).toLocaleDateString('id-ID', {
                  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                })}
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-emerald-500/20 mb-8" />

          {/* Blocks */}
          <div className="space-y-2">
            {blocks.length === 0 ? (
              <p className="text-white/20 font-mono text-sm">// Konten kosong</p>
            ) : (
              blocks.map((block, i) => (
                <BlockRenderer key={i} block={block} />
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
