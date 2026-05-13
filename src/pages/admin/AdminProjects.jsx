import { useEffect, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout.jsx'
import { supabase, uploadImage, getImageUrl } from '../../lib/supabase'
import toast from 'react-hot-toast'
import { Plus, Trash2, X, Save, Image } from 'lucide-react'

function ProjectModal({ project, onClose, onSave }) {
  const isEdit = !!project?.id
  const [form, setForm] = useState({
    title: project?.title || '',
    description: project?.description || '',
    tech_stack: Array.isArray(project?.tech_stack) ? project.tech_stack.join(', ') : (project?.tech_stack || ''),
    github_url: project?.github_url || '',
    live_url: project?.live_url || '',
    image_path: project?.image_path || '',
  })
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  const handleImage = async (file) => {
    setUploading(true)
    try {
      const path = await uploadImage('projects', file)
      setForm(f => ({ ...f, image_path: path }))
      toast.success('Gambar diupload')
    } catch { toast.error('Gagal upload') }
    finally { setUploading(false) }
  }

  const handleSave = async () => {
    if (!form.title) return toast.error('Judul wajib diisi')
    setSaving(true)
    const payload = {
      ...form,
      tech_stack: form.tech_stack.split(',').map(s => s.trim()).filter(Boolean),
    }
    try {
      if (isEdit) await supabase.from('projects').update(payload).eq('id', project.id)
      else await supabase.from('projects').insert(payload)
      toast.success(isEdit ? 'Project diperbarui' : 'Project ditambahkan')
      onSave()
    } catch { toast.error('Terjadi kesalahan') }
    finally { setSaving(false) }
  }

  const inputClass = "w-full bg-black/30 border border-white/8 rounded-xl px-4 py-2.5 text-white text-sm font-mono focus:outline-none focus:border-emerald-500/40 transition-all"

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 overflow-auto" style={{ backdropFilter: 'blur(10px)' }}>
      <div className="w-full max-w-lg my-8 glass-card border border-emerald-500/20 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-bold text-white text-lg">{isEdit ? 'Edit Project' : 'Project Baru'}</h2>
          <button onClick={onClose}><X size={18} className="text-white/30 hover:text-white" /></button>
        </div>

        <div className="space-y-3 mb-5">
          <div>
            <label className="text-white/40 text-xs font-mono block mb-1">Judul *</label>
            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className={inputClass} placeholder="My Awesome Project" />
          </div>
          <div>
            <label className="text-white/40 text-xs font-mono block mb-1">Deskripsi</label>
            <textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className={inputClass + ' resize-none'} />
          </div>
          <div>
            <label className="text-white/40 text-xs font-mono block mb-1">Tech Stack (pisah koma)</label>
            <input value={form.tech_stack} onChange={e => setForm({ ...form, tech_stack: e.target.value })} className={inputClass} placeholder="React, Node.js, MySQL" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-white/40 text-xs font-mono block mb-1">GitHub URL</label>
              <input value={form.github_url} onChange={e => setForm({ ...form, github_url: e.target.value })} className={inputClass} placeholder="https://github.com/..." />
            </div>
            <div>
              <label className="text-white/40 text-xs font-mono block mb-1">Live URL</label>
              <input value={form.live_url} onChange={e => setForm({ ...form, live_url: e.target.value })} className={inputClass} placeholder="https://..." />
            </div>
          </div>
          <div>
            <label className="text-white/40 text-xs font-mono block mb-1">Thumbnail</label>
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

export default function AdminProjects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)

  const load = () => supabase.from('projects').select('*').order('created_at', { ascending: false }).then(({ data }) => { setProjects(data || []); setLoading(false) })
  useEffect(() => { load() }, [])

  const del = async (id) => {
    if (!confirm('Hapus project?')) return
    await supabase.from('projects').delete().eq('id', id)
    toast.success('Project dihapus'); load()
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display font-extrabold text-2xl text-white">Projects</h1>
            <p className="text-white/30 text-xs font-mono mt-1">{projects.length} project</p>
          </div>
          <button onClick={() => setModal('new')} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-black font-mono font-bold text-sm hover:bg-emerald-400 transition-colors">
            <Plus size={15} /> Project Baru
          </button>
        </div>

        {loading ? <div className="flex h-48 items-center justify-center"><div className="spinner" /></div> : (
          <div className="space-y-2">
            {projects.map(p => (
              <div key={p.id} className="glass-card p-4 flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-white font-display font-bold text-sm truncate">{p.title}</p>
                  <p className="text-white/30 text-xs font-mono truncate">{p.description}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => setModal(p)} className="px-3 py-1.5 rounded-lg text-xs font-mono border border-white/10 text-white/40 hover:text-white transition-all">Edit</button>
                  <button onClick={() => del(p.id)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-red-500/10 text-red-400/40 hover:text-red-400 transition-all"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {modal && <ProjectModal project={modal === 'new' ? null : modal} onClose={() => setModal(null)} onSave={() => { setModal(null); load() }} />}
    </AdminLayout>
  )
}
