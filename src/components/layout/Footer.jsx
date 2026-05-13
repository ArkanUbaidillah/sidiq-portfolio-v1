import { Github, Instagram, MessageCircle } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-white/5 mt-20">
      {/* Map */}
      <div className="relative h-48 overflow-hidden">
        <iframe
          title="Universitas Andalas Padang"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.157858673716!2d100.35797!3d-0.90917!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2fd4b9d3e5555555%3A0x1111111111111111!2sUniversitas%20Andalas!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid"
          width="100%"
          height="100%"
          style={{
            border: 0,
            filter: 'grayscale(1) invert(1) opacity(0.7)',
            display: 'block',
          }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none" />
      </div>

      {/* Footer content */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-display font-bold text-white text-lg">
              <span className="text-emerald-400">MS</span>.dev
            </p>
            <p className="text-white/30 text-xs font-mono mt-1">
              Universitas Andalas, Padang — Sumatera Barat
            </p>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/MSIDIQ472"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-lg border border-white/10 flex items-center justify-center text-white/40 hover:text-emerald-400 hover:border-emerald-500/40 transition-all"
            >
              <Github size={15} />
            </a>
            <a
              href="https://instagram.com/m.diqqq"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-lg border border-white/10 flex items-center justify-center text-white/40 hover:text-emerald-400 hover:border-emerald-500/40 transition-all"
            >
              <Instagram size={15} />
            </a>
            <a
              href="https://wa.me/6281261443582"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-lg border border-white/10 flex items-center justify-center text-white/40 hover:text-emerald-400 hover:border-emerald-500/40 transition-all"
            >
              <MessageCircle size={15} />
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-white/20 text-xs font-mono">
            © {new Date().getFullYear()} Muhamad Sidiq · 2411533011
          </p>
          <p className="text-white/20 text-xs font-mono">
            Built with <span className="text-emerald-400">React</span> + <span className="text-emerald-400">Supabase</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
