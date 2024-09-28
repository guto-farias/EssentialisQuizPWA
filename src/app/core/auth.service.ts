// src/app/core/auth.service.ts
import { Injectable } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,  // Atualiza o token automaticamente
        persistSession: true,    // Mantém a sessão no armazenamento local
        detectSessionInUrl: true, // Detecta a sessão na URL (se necessário)
      }
    });

      // Iniciar o processo manual de renovação de token
      this.startTokenRefresh();
  }

  startTokenRefresh() {
    setInterval(async () => {
      const { data, error } = await this.supabase.auth.getSession();

      if (error || !data.session) {
        console.error('Nenhuma sessão ativa encontrada. Redirecionando para o login.');
        // Redirecionar o usuário para o login ou lidar com a sessão ausente
        return;
      }

      // Se houver sessão, tente renovar o token
      const { error: refreshError } = await this.supabase.auth.refreshSession();
      if (refreshError) {
        console.error('Erro ao renovar o token:', refreshError);
      }
    }, 600000); // Atualizar o token a cada 10 minutos (600.000 ms) ou conforme necessário
  }


  // Registro de um novo usuário
  async signUp(email: string, password: string, userName: string) {
    const { data, error } = await this.supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: { userName: userName }// Armazena o nome de usuário nos metadados no momento do cadastro
        //emailRedirectTo: null  // Desativa qualquer redirecionamento de e-mail
      }
    });

    if (error) {
      return { error };
    }

    return { data }; // Agora, não precisamos mais chamar updateUser
  }

  async signIn(email: string, password: string) {
    return await this.supabase.auth.signInWithPassword({ email, password });
  }

  async signOut() {
    return await this.supabase.auth.signOut();
  }
}
