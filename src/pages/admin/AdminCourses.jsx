import { useEffect, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout.jsx'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'
import { Plus, Trash2, X, Save } from 'lucide-react'

const toSlug = (str) => str.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')

function CourseModal({ course, onClose, onSave }) {
  const isEdit = !!course?.id
  const [form, setForm] = useState({ name: course?.name || '', slug: course?.slug || '', description: course?.description || '' })
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!form.name) return toast.error('Nama mata kuliah wajib diisi')
    if (!form.slug) form.slug = toSlug(form.name)
    setSaving(true)
    try {
      if (isEdit) await supabase.from('courses').update(form).eq('id', course.id)
      else await supabase.from('courses').insert(form)
      toast.success(isEdit ? 'Mata kuliah diperbarui' : 'Mata kuliah ditambahkan')
      onSave()
    } catch { toast.error('Terjadi kesalahan') }
    finally { setSaving(false) }
  }

  const inputClass = "w-full bg-black/30 border border-white/8 rounded-xl px-4 py-2.5 text-white text-sm font-mono focus:outline-none focus:border-emerald-500/40 transition-all"

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" style={{ backdropFilter: 'blur(10px)' }}>
      <div className="w-full max-w-md glass-card border border-emerald-500/20 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-bold text-white text-lg">{isEdit ? 'Edit Mata Kuliah' : 'Tambah Mata Kuliah'}</h2>
          <button onClick={onClose}><X size={18} className="text-white/30 hover:text-white" /></button>
        </div>
        <div className="space-y-3 mb-5">
          <div>
            <label className="text-white/40 text-xs font-mono block mb-1">Nama *</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value, slug: toSlug(e.target.value) })} className={inputClass} placeholder="Pemrograman Web" />
          </div>
          <div>
            <label className="text-white/40 text-xs font-mono block mb-1">Slug</label>
            <input value={form.slug} onChange={e => setForm({ ...form, slug: toSlug(e.target.value) })} className={inputClass} />
          </div>
          <div>
            <label className="text-white/40 text-xs font-mono block mb-1">Deskripsi</label>
            <textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className={inputClass + ' resize-none'} />
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

export default function AdminCourses() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)

  const load = () => supabase.from('courses').select('*').order('created_at', { ascending: false }).then(({ data }) => { setCourses(data || []); setLoading(false) })
  useEffect(() => { load() }, [])

  const del = async (id) => {
    if (!confirm('Hapus mata kuliah ini?')) return
    await supabase.from('courses').delete().eq('id', id)
    toast.success('Dihapus'); load()
  }

  return (
    <AdminLayout>
      <div className="max-w-3xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display font-extrabold text-2xl text-white">Mata Kuliah</h1>
            <p className="text-white/30 text-xs font-mono mt-1">{courses.length} mata kuliah</p>
          </div>
          <button onClick={() => setModal('new')} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-black font-mono font-bold text-sm hover:bg-emerald-400 transition-colors">
            <Plus size={15} /> Tambah
          </button>
        </div>

        {loading ? <div className="flex h-48 items-center justify-center"><div className="spinner" /></div> : (
          <div className="space-y-2">
            {courses.map(c => (
              <div key={c.id} className="glass-card p-4 flex items-center justify-between">
                <div>
                  <p className="text-white font-display font-bold text-sm">{c.name}</p>
                  <p className="text-white/30 text-xs font-mono">/praktikum/{c.slug}/...</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setModal(c)} className="px-3 py-1.5 rounded-lg text-xs font-mono border border-white/10 text-white/40 hover:text-white transition-all">Edit</button>
                  <button onClick={() => del(c.id)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-red-500/10 text-red-400/40 hover:text-red-400 transition-all"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {modal && <CourseModal course={modal === 'new' ? null : modal} onClose={() => setModal(null)} onSave={() => { setModal(null); load() }} />}
    </AdminLayout>
  )
}
