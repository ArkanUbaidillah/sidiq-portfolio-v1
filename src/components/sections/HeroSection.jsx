import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Github,
  Instagram,
  MessageCircle,
  MapPin,
  GraduationCap,
} from "lucide-react";

const TYPEWRITER_TEXTS = [
  "Muhamad Sidiq — 2411533011",
  "Informatics Student @ UNAND",
  "Web Developer & Tech Enthusiast",
];

function useTypewriter(texts, speed = 70, pause = 2000) {
  const [displayText, setDisplayText] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = texts[textIndex];
    let timeout;

    if (!deleting && charIndex < current.length) {
      timeout = setTimeout(() => setCharIndex((c) => c + 1), speed);
    } else if (!deleting && charIndex === current.length) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && charIndex > 0) {
      timeout = setTimeout(() => setCharIndex((c) => c - 1), speed / 2);
    } else if (deleting && charIndex === 0) {
      setDeleting(false);
      setTextIndex((i) => (i + 1) % texts.length);
    }

    setDisplayText(current.slice(0, charIndex));
    return () => clearTimeout(timeout);
  }, [charIndex, deleting, textIndex, texts, speed, pause]);

  return displayText;
}

const SKILLS = [
  "React.js",
  "Node.js",
  "Python",
  "MySQL",
  "Git",
  "Laravel",
  "Tailwind",
  "Linux",
];

export default function HeroSection() {
  const typed = useTypewriter(TYPEWRITER_TEXTS);

  return (
    <section
      id="home"
      className="min-h-screen pt-24 pb-16 px-4 sm:px-6 relative overflow-hidden"
    >
      {/* Background grid */}
      <div className="absolute inset-0 grid-bg opacity-60 pointer-events-none" />
      {/* Radial glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-6xl mx-auto">
        {/* Main Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4">
          {/* === HERO MAIN CARD === */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="glass-card md:col-span-8 p-8 relative overflow-hidden"
          >
            <div
              className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 70%)",
                transform: "translate(30%, -30%)",
              }}
            />

            <span className="emerald-tag mb-5 inline-block">
              &lt; Available for Collaboration /&gt;
            </span>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4">
              Hi, I'm <span className="glow-text">Sidiq</span>
              <span className="text-white/20">.</span>
            </h1>

            <div className="font-mono text-emerald-400/80 text-sm sm:text-base min-h-[1.5rem] mb-6 typewriter-cursor">
              {typed}
            </div>

            <p className="text-white/50 text-sm leading-relaxed max-w-md mb-8">
              Mahasiswa Informatika UNAND yang antusias dalam pengembangan web
              full-stack, data, dan teknologi open source. Selalu belajar,
              selalu berkembang.
            </p>

            <div className="flex flex-wrap gap-3">
              <a
                href="https://github.com/MSIDIQ472"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-mono font-medium bg-emerald-500 text-black hover:bg-emerald-400 transition-colors"
              >
                <Github size={15} /> GitHub
              </a>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .querySelector("#contact")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-mono font-medium border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 transition-colors"
              >
                <MessageCircle size={15} /> Hubungi Saya
              </a>
            </div>
          </motion.div>

          {/* === PROFILE PHOTO CARD === */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="glass-card md:col-span-4 p-6 flex flex-col items-center justify-center gap-4"
          >
            {/* Photo slot */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full profile-glow overflow-hidden bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center">
                {/* Placeholder - ganti dengan <img src="foto.jpg" /> setelah foto tersedia */}
                <link rel="icon" type="image/jpeg" href="/sidiq.jpeg" />
              </div>
              {/* Online indicator */}
              <div className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-black shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            </div>

            <div className="text-center">
              <p className="font-display font-bold text-white text-lg">
                Muhamad Sidiq
              </p>
              <p className="text-emerald-400/70 text-xs font-mono mt-1">
                2411533011
              </p>
              <div className="flex items-center justify-center gap-1 mt-2 text-white/30 text-xs">
                <MapPin size={11} />
                <span>Padang, Sumatera Barat</span>
              </div>
            </div>

            <div className="flex gap-3">
              <a
                href="https://instagram.com/m.diqqq"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-white/40 hover:text-emerald-400 hover:border-emerald-500/40 transition-all"
              >
                <Instagram size={14} />
              </a>
              <a
                href="https://wa.me/6281261443582"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-white/40 hover:text-emerald-400 hover:border-emerald-500/40 transition-all"
              >
                <MessageCircle size={14} />
              </a>
              <a
                href="https://github.com/MSIDIQ472"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-white/40 hover:text-emerald-400 hover:border-emerald-500/40 transition-all"
              >
                <Github size={14} />
              </a>
            </div>
          </motion.div>

          {/* === STATUS CARD === */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="glass-card md:col-span-4 p-5"
          >
            <div className="flex items-center gap-2 mb-3">
              <GraduationCap size={16} className="text-emerald-400" />
              <span className="text-white/50 text-xs font-mono uppercase tracking-widest">
                Status
              </span>
            </div>
            <p className="font-display font-bold text-white text-lg leading-tight">
              Informatika
            </p>
            <p className="text-emerald-400/70 text-xs font-mono">
              Universitas Andalas
            </p>
            <div className="mt-4 w-full bg-white/5 rounded-full h-1.5">
              <div
                className="h-1.5 rounded-full bg-emerald-500"
                style={{ width: "35%" }}
              />
            </div>
            <p className="text-white/30 text-xs font-mono mt-1">
              Semester 4 · 35%
            </p>
          </motion.div>

          {/* === SKILLS CARD === */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.5 }}
            className="glass-card md:col-span-8 p-5"
          >
            <p className="text-white/30 text-xs font-mono uppercase tracking-widest mb-4">
              Tech Stack
            </p>
            <div className="flex flex-wrap gap-2">
              {SKILLS.map((skill, i) => (
                <motion.span
                  key={skill}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.06 }}
                  className="emerald-tag"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
