import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../core/supabase.service';  // Importar o SupabaseService
import { ThemeService } from '../../theme.service';

@Component({
  selector: 'app-config',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent {

  constructor(private supabaseService: SupabaseService, private router: Router, private themeService: ThemeService) {}

  // Função para deslogar o usuário e redirecionar para a tela de login
  async logout(): Promise<void> {
    try {
      // Aguarde até que o logout do Supabase esteja completamente finalizado
      const { error } = await this.supabaseService.getSupabaseClient().auth.signOut();

      if (error) {
        console.error('Erro ao deslogar:', error);
      } else {
        // Forçar a remoção manual de tokens específicos do Supabase no localStorage
        localStorage.removeItem('supabase.auth.token');
        sessionStorage.removeItem('supabase.auth.token');

        // Garantir um pequeno atraso para o Supabase processar completamente o logout
        setTimeout(() => {
          localStorage.clear();   // Limpa todos os dados armazenados no localStorage
          sessionStorage.clear(); // Limpa todos os dados armazenados no sessionStorage
          console.log('Usuário deslogado e dados de sessão limpos');
          this.router.navigate(['/login']);  // Redireciona para a tela de login
        }, 500); // 500ms de atraso para garantir que o Supabase processe
      }
    } catch (err) {
      console.error('Erro inesperado ao deslogar:', err);
    }
  }


  // Função para voltar à tela anterior

  goToHome() {
    this.router.navigate(['/home']);
  }

  goToDomain() {
    this.router.navigate(['/domain']);
  }

  goToAbout() {
    this.router.navigate(['/about']);
  }

  toggleAccessibilityTheme(): void {
    this.themeService.toggleAccessibilityTheme();
  }
}
