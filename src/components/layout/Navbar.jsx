import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Terminal } from 'lucide-react'

const links = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Praktikum', href: '#praktikum' },
  { label: 'Certificates', href: '#certificates' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleClick = (href) => {
    setOpen(false)
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6, ease: 'easeOut' }}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-4xl"
      >
        <div
          className={`flex items-center justify-between px-5 py-3 rounded-2xl transition-all duration-300 ${
            scrolled
              ? 'bg-black/80 border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.08)]'
              : 'bg-black/40 border border-white/5'
          }`}
          style={{ backdropFilter: 'blur(20px)' }}
        >
          {/* Logo */}
          <a href="#home" onClick={() => handleClick('#home')} className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center group-hover:border-emerald-500 transition-colors">
              <Terminal size={14} className="text-emerald-400" />
            </div>
            <span className="font-display font-bold text-white text-sm tracking-wide">
              <span className="text-emerald-400">MS</span>
              <span className="text-white/40">.</span>dev
            </span>
          </a>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <button
                key={link.label}
                onClick={() => handleClick(link.href)}
                className="px-3 py-1.5 text-xs font-mono text-white/50 hover:text-emerald-400 transition-colors rounded-lg hover:bg-emerald-500/5"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden w-8 h-8 flex items-center justify-center text-white/60 hover:text-emerald-400"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-4 right-4 z-40 rounded-2xl overflow-hidden"
            style={{ backdropFilter: 'blur(20px)', background: 'rgba(0,0,0,0.9)', border: '1px solid rgba(16,185,129,0.2)' }}
          >
            {links.map((link, i) => (
              <motion.button
                key={link.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => handleClick(link.href)}
                className="w-full px-6 py-4 text-left text-sm font-mono text-white/60 hover:text-emerald-400 hover:bg-emerald-500/5 border-b border-white/5 last:border-0 transition-colors"
              >
                <span className="text-emerald-500/50 mr-2">0{i + 1}.</span> {link.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
