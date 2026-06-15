import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ============================================================
// SUPABASE CONFIG
// supabase.com → New Project → Settings → API → copy these
// ============================================================
const SUPABASE_URL = 'https://mscmanlpyenhyczlanbr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zY21hbmxweWVuaHljemxhbmJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0MjMzODYsImV4cCI6MjA5Njk5OTM4Nn0.oxWz06Eyyqf9tsRdGglOa0OCuLwSNVrjZzOzum7iHd8';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// ── Get current user with full_name ──
export const getUserProfile = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  return {
    id: user.id,
    email: user.email,
    full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
  };
};

// ── Sign Up ──
export const signUp = async (email, password, fullName) => {
  const { data, error } = await supabase.auth.signUp({
    email: email.trim().toLowerCase(),
    password,
    options: { data: { full_name: fullName.trim() } },
  });
  if (error) throw error;
  return data;
};

// ── Sign In ──
export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });
  if (error) throw error;
  return data;
};

// ── Sign Out ──
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// ── Auth state listener ──
export const onAuthChange = (callback) => {
  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(session);
  });
};

// ── Save health data to Supabase ──
export const saveHealthData = async (userId, data) => {
  const { error } = await supabase
    .from('health_data')
    .upsert({ user_id: userId, ...data, updated_at: new Date().toISOString() });
  if (error) console.log('Save error:', error);
};

// ── Load health data from Supabase ──
export const loadHealthData = async (userId) => {
  const { data, error } = await supabase
    .from('health_data')
    .select('*')
    .eq('user_id', userId)
    .single();
  if (error) return null;
  return data;
};
