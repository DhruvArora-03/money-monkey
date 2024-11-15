import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import AsyncStorage from '@react-native-async-storage/async-storage'

const supabaseUrl = 'https://ubnxqdptqsvkgdxiitlh.supabase.co'
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVibnhxZHB0cXN2a2dkeGlpdGxoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE0NTQxMTksImV4cCI6MjA0NzAzMDExOX0.LsVk73N0AQzA_Kb_2vtTNjz5lA4A_nPJWwkMU4ySurI'

const createClient = () =>
  createSupabaseClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  })

export { createClient }
