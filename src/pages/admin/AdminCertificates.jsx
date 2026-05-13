import { useEffect, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout.jsx'
import { supabase, uploadImage } from '../../lib/supabase'
import toast from 'react-hot-toast'
import { Plus, Trash2, X, Save } from 'lucide-react'

function CertModal({ cert, onClose, onSave }) {
  const isEdit = !!cert?.id
  const [form, setForm] = useState({
    title: cert?.title || '',
    issuer: cert?.issuer || '',
    issued_date: cert?.issued_date || '',
    credential_url: cert?.credential_url || '',
    image_path: cert?.image_path || '',
  })
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  const handleImage = async (file) => {
    setUploading(true)
    try {
      const path = await uploadImage('certificates', file)
      setForm(f => ({ ...f, image_path: path }))
      toast.success('Gambar diupload')
    } catch { toast.error('Gagal upload') }
    finally { setUploading(false) }
  }

  const handleSave = async () => {
    if (!form.title || !form.issuer) return toast.error('Judul dan Penerbit wajib diisi')
    setSaving(true)
    try {
      if (isEdit) await supabase.from('certificates').update(form).eq('id', cert.id)
      else await supabase.from('certificates').insert(form)
      toast.success('Tersimpan')
      onSave()
    } catch { toast.error('Terjadi kesalahan') }
    finally { setSaving(false) }
  }

  const inputClass = "w-full bg-black/30 border border-white/8 rounded-xl px-4 py-2.5 text-white text-sm font-mono focus:outline-none focus:border-emerald-500/40 transition-all"

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" style={{ backdropFilter: 'blur(10px)' }}>
      <div className="w-full max-w-md glass-card border border-emerald-500/20 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-bold text-white text-lg">{isEdit ? 'Edit Sertifikat' : 'Tambah Sertifikat'}</h2>
          <button onClick={onClose}><X size={18} className="text-white/30" /></button>
        </div>
        <div className="space-y-3 mb-5">
          <div>
            <label className="text-white/40 text-xs font-mono block mb-1">Judul *</label>
            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className={inputClass} placeholder="Web Development Fundamentals" />
          </div>
          <div>
            <label className="text-white/40 text-xs font-mono block mb-1">Penerbit *</label>
            <input value={form.issuer} onChange={e => setForm({ ...form, issuer: e.target.value })} className={inputClass} placeholder="Dicoding, Coursera, dll" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-white/40 text-xs font-mono block mb-1">Tanggal Terbit</label>
              <input type="date" value={form.issued_date} onChange={e => setForm({ ...form, issued_date: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-white/40 text-xs font-mono block mb-1">URL Credential</label>
              <input value={form.credential_url} onChange={e => setForm({ ...form, credential_url: e.target.value })} className={inputClass} placeholder="https://..." />
            </div>
          </div>
          <div>
            <label className="text-white/40 text-xs font-mono block mb-1">Foto Sertifikat</label>
            <input type="file" accept="image/*" onChange={e => e.target.files[0] && handleImage(e.target.files[0])}
              className="w-full text-xs text-white/40 font-mono file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border file:border-emerald-500/30 file:text-emerald-400 file:text-xs file:bg-emerald-500/10 file:cursor-pointer" />
            {uploading && <p className="text-emerald-400/60 text-xs font-mono mt-1">Uploading...</p>}
            {form.image_path && <p className="text-emerald-400/60 text-xs font-mono mt-1">✓ {form.image_path}</p>}
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-black font-mono font-bold text-sm hover:bg-emerald-400 disabled:opacity-50 transition-colors">
            <Save size={14} /> {saving ? 'Menyimpan...' : 'Simpan'}
          </button>
          <button onClick={onClose} className="px-4 py-2 rounded-xl border border-white/10 text-white/40 font-mono text-sm">Batal</button>
        </div>
      </div>
    </div>
  )
}

export default function AdminCertificates() {
  const [certs, setCerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)

  const load = () => supabase.from('certificates').select('*').order('issued_date', { ascending: false }).then(({ data }) => { setCerts(data || []); setLoading(false) })
  useEffect(() => { load() }, [])

  const del = async (id) => {
    if (!confirm('Hapus sertifikat?')) return
    await supabase.from('certificates').delete().eq('id', id)
    toast.success('Dihapus'); load()
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display font-extrabold text-2xl text-white">Sertifikat</h1>
            <p className="text-white/30 text-xs font-mono mt-1">{certs.length} sertifikat</p>
          </div>
          <button onClick={() => setModal('new')} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-black font-mono font-bold text-sm hover:bg-emerald-400 transition-colors">
            <Plus size={15} /> Tambah
          </button>
        </div>

        {loading ? <div className="flex h-48 items-center justify-center"><div className="spinner" /></div> : (
          <div className="space-y-2">
            {certs.map(c => (
              <div key={c.id} className="glass-card p-4 flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-white font-display font-bold text-sm truncate">{c.title}</p>
                  <p className="text-emerald-400/60 text-xs font-mono">{c.issuer} · {c.issued_date ? new Date(c.issued_date).getFullYear() : '—'}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => setModal(c)} className="px-3 py-1.5 rounded-lg text-xs font-mono border border-white/10 text-white/40 hover:text-white transition-all">Edit</button>
                  <button onClick={() => del(c.id)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-red-500/10 text-red-400/40 hover:text-red-400 transition-all"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {modal && <CertModal cert={modal === 'new' ? null : modal} onClose={() => setModal(null)} onSave={() => { setModal(null); load() }} />}
    </AdminLayout>
  )
}
