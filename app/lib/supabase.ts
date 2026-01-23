import { createClient } from '@supabase/supabase-js';

// Sizning Supabase ma'lumotlaringiz
const SUPABASE_URL = 'https://xhbokwqbxxqgyxfkljtl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhoYm9rd3FieHhxZ3l4ZmtsanRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxNDM3MjQsImV4cCI6MjA4NDcxOTcyNH0.GmRD3KAktubwU4zXPexqZCE2UXsu7TFVpMyIjJruMVk';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);