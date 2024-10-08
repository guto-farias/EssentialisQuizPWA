import { Component, OnInit } from '@angular/core';
import { SupabaseService } from '../../core/supabase.service';
import { UserService } from './user.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-domain',
  standalone: true,  // Se for standalone, adicione true
  imports: [CommonModule],  // Adicione CommonModule
  templateUrl: './domain.component.html',
  styleUrls: ['./domain.component.css']
})
export class DomainComponent implements OnInit {
  userName: string = '';
  userId: string = '';
  bestDomain: string = 'Sem domínio';
  userStats: any[] = []; // Estatísticas do usuário por categoria

  constructor(private supabaseService: SupabaseService, private userService: UserService, private router: Router) {}

  async ngOnInit(): Promise<void> {
    // Obter o usuário logado
    const { data: sessionData, error: sessionError } = await this.supabaseService.getSupabaseClient().auth.getSession();

    if (sessionError || !sessionData?.session?.user) {
      console.error('Erro ao obter sessão ou usuário não autenticado:', sessionError);
      return;
    }

    this.userId = sessionData.session.user.id;
    this.userName = sessionData.session.user.email || 'Usuário'; // ou outro campo que represente o nome

    // Chamar getUserStats passando o userId para obter as estatísticas do usuário logado
    this.userStats = await this.userService.getUserStats(this.userId);
    console.log('Estatísticas do usuário:', this.userStats);

    // Obter o melhor domínio com base nas estatísticas
    this.bestDomain = await this.userService.getBestDomain(this.userId);
    console.log('Melhor domínio do usuário:', this.bestDomain);
  }

  async loadUserData(): Promise<void> {
    const { data: sessionData, error } = await this.supabaseService.getSupabaseClient().auth.getSession();
    if (error || !sessionData?.session?.user) {
      console.error('Erro ao obter dados do usuário:', error);
      return;
    }
    this.userName = sessionData.session.user.email || 'Usuário Anônimo';; // ou use user_metadata se estiver disponível
    this.bestDomain = await this.userService.getBestDomain(sessionData.session.user.id);
  }

  async loadUserStats(): Promise<void> {
    this.userStats = await this.userService.getUserStats(this.userId);
    console.log('Estatísticas do usuário carregadas:', this.userStats);
  }

  // ---------------- LINKS ----------------
  goToHome() {
    this.router.navigate(['/home']);
  }

  goToConfig() {
    this.router.navigate(['/config']);
  }

  goToDomain() {
    this.router.navigate(['/domain']);
  }
}
