import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../core/supabase.service';  // Importar o SupabaseService

@Component({
  selector: 'app-config',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent {

  constructor(private supabaseService: SupabaseService, private router: Router) {}

  // Função para deslogar o usuário e redirecionar para a tela de login
  async logout(): Promise<void> {
    const { error } = await this.supabaseService.getSupabaseClient().auth.signOut();

    if (error) {
      console.error('Erro ao deslogar:', error);
    } else {
      // Limpar dados de sessão manualmente para evitar que o usuário continue logado ao voltar
      localStorage.clear();   // Limpa o localStorage
      sessionStorage.clear(); // Limpa o sessionStorage

      console.log('Usuário deslogado e dados de sessão limpos');
      this.router.navigate(['/login']);  // Redireciona para a tela de login
    }
  }

  // Função para voltar à tela anterior

  goToHome() {
    this.router.navigate(['/home']);
  }
}
