import { useState } from 'react'
import { motion } from 'framer-motion'
import { sendContactEmail } from '../../lib/emailjs'
import toast from 'react-hot-toast'
import { Send, Github, Instagram, MessageCircle } from 'lucide-react'

export default function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return toast.error('Semua field wajib diisi')
    setLoading(true)
    try {
      await sendContactEmail(form)
      toast.success('Pesan terkirim! Terima kasih 🎉')
      setForm({ name: '', email: '', message: '' })
    } catch {
      toast.error('Gagal mengirim pesan. Coba lagi ya.')
    } finally {
      setLoading(false)
    }
  }

  const contacts = [
    { icon: MessageCircle, label: 'WhatsApp', value: '081261443582', href: 'https://wa.me/6281261443582' },
    { icon: Instagram, label: 'Instagram', value: '@m.diqqq', href: 'https://instagram.com/m.diqqq' },
    { icon: Github, label: 'GitHub', value: 'MSIDIQ472', href: 'https://github.com/MSIDIQ472' },
  ]

  const inputClass = "w-full bg-white/3 border border-white/8 rounded-xl px-4 py-3 text-white text-sm font-mono placeholder-white/20 focus:outline-none focus:border-emerald-500/50 focus:bg-emerald-500/5 transition-all"

  return (
    <section id="contact" className="py-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <span className="emerald-tag">Contact</span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mt-3">
            Hubungi <span className="text-emerald-400">Saya</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card p-6"
          >
            <h3 className="font-display font-bold text-white text-xl mb-5">Kirim Pesan</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Nama kamu"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className={inputClass}
              />
              <input
                type="email"
                placeholder="Email kamu"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className={inputClass}
              />
              <textarea
                rows={5}
                placeholder="Pesan kamu..."
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                className={inputClass + ' resize-none'}
              />
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 text-black font-mono font-bold text-sm hover:bg-emerald-400 disabled:opacity-50 transition-colors"
              >
                {loading ? <div className="spinner w-4 h-4 border-black/20 border-t-black" /> : <Send size={15} />}
                {loading ? 'Mengirim...' : 'Kirim Pesan'}
              </button>
            </div>
          </motion.div>

          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-4"
          >
            {contacts.map(({ icon: Icon, label, value, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="glass-card p-5 flex items-center gap-4 group"
              >
                <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover:border-emerald-500/50 transition-colors">
                  <Icon size={20} className="text-emerald-400" />
                </div>
                <div>
                  <p className="text-white/30 text-xs font-mono">{label}</p>
                  <p className="text-white font-mono text-sm font-medium">{value}</p>
                </div>
              </a>
            ))}

            <div className="glass-card p-5">
              <p className="text-white/30 text-xs font-mono mb-2">TikTok</p>
              <a
                href="https://tiktok.com/@diqsxx"
                target="_blank"
                rel="noreferrer"
                className="text-emerald-400 font-mono text-sm hover:underline"
              >
                @diqsxx
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
