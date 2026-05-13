import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { supabase, getImageUrl } from '../../lib/supabase'
import { ExternalLink, Github, Folder } from 'lucide-react'

export default function ProjectsSection() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('projects').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      setProjects(data || [])
      setLoading(false)
    })
  }, [])

  return (
    <section id="projects" className="py-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <span className="emerald-tag">Projects</span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mt-3">
            Apa yang saya <span className="text-emerald-400">bangun</span>
          </h2>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="spinner" />
          </div>
        ) : projects.length === 0 ? (
          <div className="glass-card p-10 text-center text-white/30 font-mono text-sm">
            // Belum ada project yang dipublikasikan
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-5 flex flex-col group"
              >
                {project.image_path && (
                  <div className="w-full h-40 rounded-xl overflow-hidden mb-4 bg-white/5">
                    <img
                      src={getImageUrl('projects', project.image_path)}
                      alt={project.title}
                      className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity"
                    />
                  </div>
                )}
                {!project.image_path && (
                  <div className="w-full h-32 rounded-xl mb-4 flex items-center justify-center bg-emerald-500/5 border border-emerald-500/10">
                    <Folder size={32} className="text-emerald-500/30" />
                  </div>
                )}

                <div className="flex-1">
                  <h3 className="font-display font-bold text-white text-lg mb-2">{project.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed mb-4">{project.description}</p>

                  {project.tech_stack && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {(Array.isArray(project.tech_stack) ? project.tech_stack : project.tech_stack.split(',')).map(t => (
                        <span key={t} className="emerald-tag text-xs">{t.trim()}</span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 mt-2">
                  {project.github_url && (
                    <a href={project.github_url} target="_blank" rel="noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono border border-white/10 text-white/40 hover:text-emerald-400 hover:border-emerald-500/30 transition-all">
                      <Github size={12} /> Code
                    </a>
                  )}
                  {project.live_url && (
                    <a href={project.live_url} target="_blank" rel="noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition-all">
                      <ExternalLink size={12} /> Live Demo
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
