import { useEffect, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout.jsx'
import { supabase, uploadImage } from '../../lib/supabase'
import toast from 'react-hot-toast'
import { Plus, Trash2, Image, Type, Heading, Save, X, Eye, ChevronDown, ChevronUp } from 'lucide-react'
import { Link } from 'react-router-dom'

// Slug generator
const toSlug = (str) =>
  str.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-')

// ───── Block Editor ─────
function BlockEditor({ blocks, setBlocks }) {
  const add = (type) => setBlocks(b => [...b, { type, content: '', path: '', caption: '' }])
  const remove = (i) => setBlocks(b => b.filter((_, idx) => idx !== i))
  const update = (i, field, val) =>
    setBlocks(b => b.map((block, idx) => idx === i ? { ...block, [field]: val } : block))
  const move = (i, dir) => {
    const copy = [...blocks]
    const j = i + dir
    if (j < 0 || j >= copy.length) return
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
    setBlocks(copy)
  }

  const handleImageUpload = async (i, file) => {
    const toastId = toast.loading('Upload gambar...')
    try {
      const path = await uploadImage('lab-reports', file, 'blocks/')
      update(i, 'path', path)
      toast.success('Gambar berhasil diupload', { id: toastId })
    } catch {
      toast.error('Gagal upload gambar', { id: toastId })
    }
  }

  return (
    <div className="space-y-3">
      {blocks.map((block, i) => (
        <div key={i} className="glass-card p-4 border border-white/8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono text-emerald-400/70 uppercase">
              [{block.type}] Block {i + 1}
            </span>
            <div className="flex items-center gap-1">
              <button onClick={() => move(i, -1)} className="w-7 h-7 flex items-center justify-center text-white/30 hover:text-white rounded-lg hover:bg-white/5">
                <ChevronUp size={14} />
              </button>
              <button onClick={() => move(i, 1)} className="w-7 h-7 flex items-center justify-center text-white/30 hover:text-white rounded-lg hover:bg-white/5">
                <ChevronDown size={14} />
              </button>
              <button onClick={() => remove(i)} className="w-7 h-7 flex items-center justify-center text-red-400/50 hover:text-red-400 rounded-lg hover:bg-red-500/5">
                <X size={14} />
              </button>
            </div>
          </div>

          {block.type === 'text' && (
            <textarea
              rows={4}
              placeholder="Tulis konten teks..."
              value={block.content}
              onChange={e => update(i, 'content', e.target.value)}
              className="w-full bg-black/30 border border-white/8 rounded-lg px-3 py-2 text-white/80 text-sm font-mono resize-y focus:outline-none focus:border-emerald-500/40 transition-all"
            />
          )}

          {block.type === 'heading' && (
            <input
              type="text"
              placeholder="Judul / sub-judul..."
              value={block.content}
              onChange={e => update(i, 'content', e.target.value)}
              className="w-full bg-black/30 border border-white/8 rounded-lg px-3 py-2 text-white font-display font-bold text-lg focus:outline-none focus:border-emerald-500/40 transition-all"
            />
          )}

          {block.type === 'image' && (
            <div className="space-y-2">
              <input
                type="file"
                accept="image/*"
                onChange={e => e.target.files[0] && handleImageUpload(i, e.target.files[0])}
                className="w-full text-xs text-white/40 font-mono file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border file:border-emerald-500/30 file:text-emerald-400 file:text-xs file:bg-emerald-500/10 file:cursor-pointer hover:file:bg-emerald-500/20 transition-all"
              />
              {block.path && (
                <p className="text-emerald-400/60 text-xs font-mono">✓ {block.path}</p>
              )}
              <input
                type="text"
                placeholder="Caption (opsional)"
                value={block.caption}
                onChange={e => update(i, 'caption', e.target.value)}
                className="w-full bg-black/30 border border-white/8 rounded-lg px-3 py-2 text-white/60 text-xs font-mono focus:outline-none focus:border-emerald-500/40 transition-all"
              />
            </div>
          )}
        </div>
      ))}

      {/* Add block buttons */}
      <div className="flex flex-wrap gap-2 pt-2">
        <button
          onClick={() => add('text')}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono border border-white/10 text-white/40 hover:text-white hover:border-white/20 transition-all"
        >
          <Type size={13} /> Add Text
        </button>
        <button
          onClick={() => add('heading')}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono border border-white/10 text-white/40 hover:text-white hover:border-white/20 transition-all"
        >
          <Heading size={13} /> Add Heading
        </button>
        <button
          onClick={() => add('image')}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono border border-emerald-500/30 text-emerald-400/70 hover:text-emerald-400 hover:border-emerald-500 transition-all"
        >
          <Image size={13} /> Upload Image
        </button>
      </div>
    </div>
  )
}

// ───── Report Form Modal ─────
function ReportModal({ report, courses, onClose, onSave }) {
  const isEdit = !!report?.id
  const [form, setForm] = useState({
    title: report?.title || '',
    slug: report?.slug || '',
    course_id: report?.course_id || courses[0]?.id || '',
    week_number: report?.week_number || '',
    blocks: report?.blocks || [],
  })
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!form.title || !form.course_id) return toast.error('Judul dan Mata Kuliah wajib diisi')
    if (!form.slug) form.slug = toSlug(form.title)
    setSaving(true)
    try {
      if (isEdit) {
        await supabase.from('lab_reports').update({ ...form }).eq('id', report.id)
      } else {
        await supabase.from('lab_reports').insert({ ...form })
      }
      toast.success(isEdit ? 'Laporan diperbarui' : 'Laporan dibuat')
      onSave()
    } catch (err) {
      toast.error('Terjadi kesalahan')
    } finally {
      setSaving(false)
    }
  }

  const inputClass = "w-full bg-black/30 border border-white/8 rounded-xl px-4 py-2.5 text-white text-sm font-mono focus:outline-none focus:border-emerald-500/40 transition-all"

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-start justify-center p-4 overflow-auto" style={{ backdropFilter: 'blur(10px)' }}>
      <div className="w-full max-w-2xl my-8">
        <div className="glass-card border border-emerald-500/20 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-bold text-white text-xl">
              {isEdit ? 'Edit Laporan' : 'Laporan Baru'}
            </h2>
            <button onClick={onClose} className="text-white/30 hover:text-white">
              <X size={18} />
            </button>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label className="text-white/40 text-xs font-mono block mb-1.5">Judul Laporan *</label>
              <input
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value, slug: toSlug(e.target.value) })}
                placeholder="Judul laporan praktikum"
                className={inputClass}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-white/40 text-xs font-mono block mb-1.5">Slug (URL)</label>
                <input
                  value={form.slug}
                  onChange={e => setForm({ ...form, slug: toSlug(e.target.value) })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-white/40 text-xs font-mono block mb-1.5">Pertemuan ke-</label>
                <input
                  type="number"
                  value={form.week_number}
                  onChange={e => setForm({ ...form, week_number: e.target.value })}
                  placeholder="1"
                  className={inputClass}
                />
              </div>
            </div>
            <div>
              <label className="text-white/40 text-xs font-mono block mb-1.5">Mata Kuliah *</label>
              <select
                value={form.course_id}
                onChange={e => setForm({ ...form, course_id: e.target.value })}
                className={inputClass + ' bg-black/50'}
              >
                {courses.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-6">
            <label className="text-white/40 text-xs font-mono block mb-3">Konten (Blocks)</label>
            <BlockEditor
              blocks={form.blocks}
              setBlocks={blocks => setForm(f => ({ ...f, blocks }))}
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-black font-mono font-bold text-sm hover:bg-emerald-400 disabled:opacity-50 transition-colors"
            >
              <Save size={15} />
              {saving ? 'Menyimpan...' : 'Simpan'}
            </button>
            <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-white/10 text-white/40 font-mono text-sm hover:text-white transition-colors">
              Batal
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ───── Main Page ─────
export default function AdminReports() {
  const [reports, setReports] = useState([])
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null) // null | 'new' | report object

  const loadData = async () => {
    const [rRes, cRes] = await Promise.all([
      supabase.from('lab_reports').select('*, courses(name, slug)').order('created_at', { ascending: false }),
      supabase.from('courses').select('*'),
    ])
    setReports(rRes.data || [])
    setCourses(cRes.data || [])
    setLoading(false)
  }

  useEffect(() => { loadData() }, [])

  const handleDelete = async (id) => {
    if (!confirm('Hapus laporan ini?')) return
    await supabase.from('lab_reports').delete().eq('id', id)
    toast.success('Laporan dihapus')
    loadData()
  }

  return (
    <AdminLayout>
      <div className="max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display font-extrabold text-2xl text-white">Laporan Praktikum</h1>
            <p className="text-white/30 text-xs font-mono mt-1">{reports.length} laporan total</p>
          </div>
          <button
            onClick={() => setModal('new')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-black font-mono font-bold text-sm hover:bg-emerald-400 transition-colors"
          >
            <Plus size={15} /> Laporan Baru
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-48"><div className="spinner" /></div>
        ) : reports.length === 0 ? (
          <div className="glass-card p-12 text-center text-white/20 font-mono text-sm">
            // Belum ada laporan. Klik "Laporan Baru" untuk memulai.
          </div>
        ) : (
          <div className="space-y-2">
            {reports.map(report => (
              <div key={report.id} className="glass-card p-4 flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-emerald-400/50 text-xs font-mono">{report.courses?.name}</span>
                    {report.week_number && (
                      <span className="text-white/20 text-xs font-mono">· Pertemuan {report.week_number}</span>
                    )}
                  </div>
                  <p className="text-white font-display font-bold text-sm truncate">{report.title}</p>
                  <p className="text-white/20 text-xs font-mono">{report.blocks?.length || 0} blocks</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    to={`/praktikum/${report.courses?.slug}/${report.slug}`}
                    target="_blank"
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/10 text-white/30 hover:text-emerald-400 hover:border-emerald-500/30 transition-all"
                  >
                    <Eye size={14} />
                  </Link>
                  <button
                    onClick={() => setModal(report)}
                    className="px-3 py-1.5 rounded-lg text-xs font-mono border border-white/10 text-white/40 hover:text-white hover:border-white/20 transition-all"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(report.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-red-500/10 text-red-400/40 hover:text-red-400 hover:border-red-500/30 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modal && (
        <ReportModal
          report={modal === 'new' ? null : modal}
          courses={courses}
          onClose={() => setModal(null)}
          onSave={() => { setModal(null); loadData() }}
        />
      )}
    </AdminLayout>
  )
}
