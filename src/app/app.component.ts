import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet} from '@angular/router';
import { SupabaseService } from './core/supabase.service';
import { ThemeService } from './theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],  // Garante que RouterOutlet esteja disponível para roteamento
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isAccessibilityEnabled = false;
  constructor(private router: Router, private supabaseService: SupabaseService, private themeService: ThemeService) {}

  ngOnInit(): void {
    console.log('AppComponent inicializado. Rota atual:', this.router.url);

    // Verifica se o usuário está autenticado antes de exibir a splash screen e redirecionar
    this.supabaseService.getSupabaseClient().auth.getSession().then(({ data }) => {
      const userLoggedIn = !!data.session?.user; // Verifica se há um usuário logado

      this.showSplashScreen(3000).then(() => {
        const splashScreen = document.getElementById('splash-screen');
        if (splashScreen) {
          splashScreen.style.opacity = '0'; // Efeito de fade-out
          setTimeout(() => {
            splashScreen.style.display = 'none';
            if (!userLoggedIn) {
              this.navigateToLogin(); // Navega para a tela de login se o usuário não estiver logado
            }
          }, 500); // Tempo para o fade-out da splash screen
        } else {
          if (!userLoggedIn) {
            this.navigateToLogin();
          }
        }
      });
    });
  }

  private showSplashScreen(duration: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(); // Resolva a promessa após o tempo de exibição desejado
      }, duration);
    });
  }

  private navigateToLogin(): void {
    // Verifica se a rota atual já é '/login' para evitar loops de redirecionamento
    if (this.router.url !== '/login' && this.router.url !== '/') {
      console.log('Redirecionando para login');
      this.router.navigate(['/login']);
    }
  }

  toggleAccessibilityTheme(): void {
    this.themeService.toggleAccessibilityTheme();
  }
}
