// src/app/core/auth.service.ts
import { Injectable } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private static supabase: SupabaseClient; // Torna o SupabaseClient uma propriedade estática

  constructor() {
    if (!AuthService.supabase) { // Verifica se o cliente já foi criado
      AuthService.supabase = createClient(environment.supabaseUrl, environment.supabaseAnonKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: true,
          detectSessionInUrl: true,
        }
      });

      // Iniciar o processo manual de renovação de token
      this.startTokenRefresh();
    }
  }

  private get supabase(): SupabaseClient {
    return AuthService.supabase; // Garante que todas as instâncias usem o mesmo cliente
  }

  startTokenRefresh() {
    setInterval(async () => {
      const { data, error } = await this.supabase.auth.getSession();

      if (error || !data.session) {
        console.error('Nenhuma sessão ativa encontrada. Redirecionando para o login.');
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
        data: { userName: userName }
      }
    });

    if (error) {
      return { error };
    }

    return { data };
  }

  async signIn(email: string, password: string) {
    return await this.supabase.auth.signInWithPassword({ email, password });
  }

  async signOut() {
    return await this.supabase.auth.signOut();
  }

   // Método para solicitar a redefinição de senha
   //async resetPassword(email: string) {
   // const { error } = await this.supabase.auth.resetPasswordForEmail(email);
  //return { error };
  //}
}
