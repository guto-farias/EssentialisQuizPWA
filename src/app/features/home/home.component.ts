import { Component, OnInit } from '@angular/core';
import { CategoryService } from './category.service';
import { Category } from './category.model';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../core/supabase.service';  // Adicionar import do SupabaseService
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  userName: string = '';
  userBest: string = 'Sem domínio';
  categories: Category[] = [];
  selectedCategories: number[] = [];  // Certifique-se de inicializar este array
  userStats: any[] = [];  // Adicionar array para armazenar as stats do usuário

  constructor(
    private categoryService: CategoryService,
    private supabaseService: SupabaseService,  // Injetar o serviço do Supabase
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadUserName();  // Carregar o nome do usuário
    this.loadCategories();  // Carregar as categorias
    this.loadUserStats();  // Carregar as estatísticas do usuário para cálculo de acurácia
  }

  async loadUserName(): Promise<void> {
    const supabase = this.supabaseService.getSupabaseClient();

    // Obtenha a sessão e o user_id
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !sessionData?.session?.user) {
      console.error('Erro ao buscar a sessão ou usuário não autenticado:', sessionError?.message);
      return;
    }

    const user = sessionData.session.user;
    console.log('Usuário logado ID:', user.id);  // Verifique se o user_id corresponde ao da tabela
    this.userName = user.user_metadata?.['userName'] || user.email;
  }

  async loadCategories(): Promise<void> {
    this.categories = await this.categoryService.getCategoriesWithUserStats();
    console.log('Categorias carregadas:', this.categories);  // Log para verificar as categorias carregadas

    if (this.categories.length === 0) {
        console.log('Nenhuma categoria carregada');
    } else {
        this.calculateBestCategory();
    }
}

  async loadUserStats(): Promise<void> {
    const supabase = this.supabaseService.getSupabaseClient();
    const { data, error } = await supabase
      .from('user_category_stats')
      .select('*');

    if (error) {
      console.error('Erro ao buscar estatísticas do usuário:', error);
      return;
    }

    this.userStats = data;
    this.calculateBestCategory();
  }

  calculateBestCategory(): void {
    if (this.userStats.length === 0) {
      this.userBest = 'Sem domínio';
      return;
    }

    let maxAccuracy = -1;
    let bestCategories: string[] = [];

    this.userStats.forEach(stat => {
      const accuracy = (stat.correct_answers / stat.total_questions) * 100;
      if (accuracy > maxAccuracy) {
        maxAccuracy = accuracy;
        const category = this.categories.find(c => c.id === stat.category_id);
        if (category) {
          bestCategories = [category.category];  // Corrigido para usar o nome da categoria
        }
      } else if (accuracy === maxAccuracy) {
        const category = this.categories.find(c => c.id === stat.category_id);
        if (category) {
          bestCategories.push(category.category);
        }
      }
    });

    if (bestCategories.length === 1) {
      this.userBest = bestCategories[0];
    } else {
      this.userBest = 'Sem domínio';
    }
  }

  // Função para selecionar ou desselecionar categorias
  toggleCategorySelection(categoryId: number): void {
    const index = this.selectedCategories.indexOf(categoryId);
    if (index === -1) {
      this.selectedCategories.push(categoryId);  // Agora armazena o ID em vez do nome
    } else {
      this.selectedCategories.splice(index, 1);  // Remove o ID se já estiver selecionado
    }
    console.log('Selected categories:', this.selectedCategories);  // Agora deve mostrar IDs, não nomes
  }

  // Ao iniciar o quiz
  startQuiz(): void {
    if (this.selectedCategories.length === 0) {
      alert('Por favor, selecione pelo menos uma categoria para jogar.');
    } else {
      const selectedCategoryIds = this.selectedCategories;  // Agora são os IDs
      console.log('Iniciando quiz com os IDs das categorias:', selectedCategoryIds);
      this.router.navigate(['/run'], { queryParams: { categories: selectedCategoryIds.join(',') } });
    }
  }
}
