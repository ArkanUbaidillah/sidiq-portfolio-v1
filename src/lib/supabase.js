import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://lywtqshnljboimwyljeb.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5d3Rxc2hubGpib2ltd3lsamViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1NjM3NjgsImV4cCI6MjA5NDEzOTc2OH0.jZepYZ2UH5ewpHj0CS-JavAhpqSnIbbRh8tYScvH4f4'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Storage helper
export const getImageUrl = (bucket, path) => {
  if (!path) return null
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}

export const uploadImage = async (bucket, file, folder = '') => {
  const ext = file.name.split('.').pop()
  const fileName = `${folder}${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const { data, error } = await supabase.storage.from(bucket).upload(fileName, file)
  if (error) throw error
  return data.path
}
