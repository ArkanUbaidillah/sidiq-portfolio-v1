import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase, getImageUrl } from '../../lib/supabase'
import { Award, X, ExternalLink } from 'lucide-react'

export default function CertificatesSection() {
  const [certs, setCerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    supabase.from('certificates').select('*').order('issued_date', { ascending: false }).then(({ data }) => {
      setCerts(data || [])
      setLoading(false)
    })
  }, [])

  return (
    <section id="certificates" className="py-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <span className="emerald-tag">Sertifikat</span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mt-3">
            Pencapaian & <span className="text-emerald-400">Sertifikasi</span>
          </h2>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center h-48"><div className="spinner" /></div>
        ) : certs.length === 0 ? (
          <div className="glass-card p-10 text-center text-white/30 font-mono text-sm">
            // Belum ada sertifikat
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {certs.map((cert, i) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                onClick={() => setSelected(cert)}
                className="glass-card p-5 cursor-pointer flex gap-4 group"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 group-hover:border-emerald-500/50 transition-colors">
                  <Award size={22} className="text-emerald-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-bold text-white text-sm leading-snug truncate">{cert.title}</h3>
                  <p className="text-emerald-400/60 text-xs font-mono mt-1">{cert.issuer}</p>
                  {cert.issued_date && (
                    <p className="text-white/30 text-xs mt-1">{new Date(cert.issued_date).getFullYear()}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            style={{ backdropFilter: 'blur(10px)' }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="glass-card neon-border max-w-lg w-full p-6 relative"
            >
              <button onClick={() => setSelected(null)} className="absolute top-4 right-4 text-white/40 hover:text-white">
                <X size={18} />
              </button>

              {selected.image_path && (
                <img
                  src={getImageUrl('certificates', selected.image_path)}
                  alt={selected.title}
                  className="w-full rounded-xl mb-4 border border-emerald-500/10"
                />
              )}

              <h3 className="font-display font-bold text-white text-xl mb-1">{selected.title}</h3>
              <p className="text-emerald-400/70 font-mono text-sm">{selected.issuer}</p>
              {selected.issued_date && (
                <p className="text-white/30 text-xs font-mono mt-1">
                  {new Date(selected.issued_date).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                </p>
              )}
              {selected.credential_url && (
                <a href={selected.credential_url} target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl text-sm font-mono bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition-all">
                  <ExternalLink size={14} /> Lihat Credential
                </a>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
