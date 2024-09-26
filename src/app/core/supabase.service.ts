// src/app/supabase.service.ts
import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabaseUrl = 'https://eidfduvvhiksoqlsqtfg.supabase.co'; // Substitua pelo seu URL do Supabase
  private supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpZGZkdXZ2aGlrc29xbHNxdGZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjczMDg5NTYsImV4cCI6MjA0Mjg4NDk1Nn0.tKPdQj7DDtwW1uHoTiWXNbS9sOVOlMfhrbZwahD_g0M'; // Substitua pela sua chave anon do Supabase
  public supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(this.supabaseUrl, this.supabaseKey);
  }
}
