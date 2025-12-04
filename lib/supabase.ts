import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://zothmuoucxitdrhdmxdv.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvdGhtdW91Y3hpdGRyaGRteGR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4NjMwOTIsImV4cCI6MjA4MDQzOTA5Mn0.4IlQkRSVbNxZdvtYoaoTbRgCc5VhScYSVX1AqpK3nqU";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
