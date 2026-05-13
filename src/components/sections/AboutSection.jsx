import { motion } from 'framer-motion'
import { Code2, Coffee, Zap, Users } from 'lucide-react'

const stats = [
  { icon: Code2, value: '10+', label: 'Projects' },
  { icon: Coffee, value: '∞', label: 'Kopi Diminum' },
  { icon: Zap, value: '4', label: 'Semester' },
  { icon: Users, value: '3', label: 'Kolaborasi' },
]

export default function AboutSection() {
  return (
    <section id="about" className="py-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card md:col-span-7 p-8"
          >
            <span className="emerald-tag">About Me</span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mt-4 mb-6">
              Tentang <span className="text-emerald-400">Saya</span>
            </h2>
            <div className="space-y-4 text-white/50 text-sm leading-relaxed">
              <p>
                Saya adalah mahasiswa Informatika di Universitas Andalas (UNAND), Padang, dengan minat mendalam 
                di bidang pengembangan web full-stack dan teknologi informasi.
              </p>
              <p>
                Saya menikmati proses membangun solusi digital — mulai dari merancang arsitektur backend yang efisien 
                hingga menciptakan antarmuka pengguna yang bersih dan intuitif. Setiap proyek adalah kesempatan 
                untuk belajar sesuatu yang baru.
              </p>
              <p>
                Di luar coding, saya aktif mengeksplorasi dunia open-source, mengikuti perkembangan teknologi terkini, 
                dan sesekali berbagi pengetahuan dengan sesama mahasiswa.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {['Problem Solving', 'Team Player', 'Fast Learner', 'Detail Oriented'].map(t => (
                <span key={t} className="emerald-tag">{t}</span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="md:col-span-5 grid grid-cols-2 gap-4"
          >
            {stats.map(({ icon: Icon, value, label }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 flex flex-col items-center justify-center text-center gap-2"
              >
                <Icon size={20} className="text-emerald-400" />
                <span className="font-display font-extrabold text-3xl text-white">{value}</span>
                <span className="text-white/30 text-xs font-mono">{label}</span>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  )
}
