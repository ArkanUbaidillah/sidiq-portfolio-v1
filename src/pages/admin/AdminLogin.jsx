import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import toast from 'react-hot-toast'
import { Lock, Terminal } from 'lucide-react'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await signIn(email, password)
      toast.success('Welcome back, Admin!')
      navigate('/admin')
    } catch (err) {
      toast.error('Email atau password salah')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black grid-bg flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 items-center justify-center mb-4">
            <Terminal size={24} className="text-emerald-400" />
          </div>
          <h1 className="font-display font-extrabold text-2xl text-white">Admin Panel</h1>
          <p className="text-white/30 text-xs font-mono mt-1">Muhamad Sidiq Portfolio CMS</p>
        </div>

        <div className="glass-card neon-border p-6">
          <div className="space-y-4">
            <div>
              <label className="text-white/40 text-xs font-mono block mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@email.com"
                className="w-full bg-white/3 border border-white/8 rounded-xl px-4 py-3 text-white text-sm font-mono placeholder-white/20 focus:outline-none focus:border-emerald-500/50 transition-all"
                onKeyDown={e => e.key === 'Enter' && handleLogin(e)}
              />
            </div>
            <div>
              <label className="text-white/40 text-xs font-mono block mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/3 border border-white/8 rounded-xl px-4 py-3 text-white text-sm font-mono placeholder-white/20 focus:outline-none focus:border-emerald-500/50 transition-all"
                onKeyDown={e => e.key === 'Enter' && handleLogin(e)}
              />
            </div>
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500 text-black font-mono font-bold text-sm hover:bg-emerald-400 disabled:opacity-50 transition-colors mt-2"
            >
              {loading ? <div className="spinner w-4 h-4" style={{ borderColor: 'rgba(0,0,0,0.2)', borderTopColor: '#000' }} /> : <Lock size={15} />}
              {loading ? 'Masuk...' : 'Masuk'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
