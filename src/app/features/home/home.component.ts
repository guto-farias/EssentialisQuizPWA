import { Component, OnInit } from '@angular/core';
import { CategoryService } from './category.service';
import { Category } from './category.model';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../core/supabase.service';  // Adicionar import do SupabaseService
import { Router } from '@angular/router';  // Certifique-se de importar o Router

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
  selectedCategories: string[] = [];  // Certifique-se de inicializar este array

  constructor(
    private categoryService: CategoryService,
    private supabaseService: SupabaseService,  // Injetar o serviço do Supabase
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadUserName();  // Carregar o nome do usuário
    this.loadCategories();  // Carregar as categorias e calcular a melhor categoria
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
    console.log('Categories with user stats loaded:', this.categories);

    // Calcular a melhor categoria (com maior accuracy)
    this.calculateBestCategory();
  }

  calculateBestCategory(): void {
    if (this.categories.length === 0) {
      this.userBest = 'Sem domínio';
      return;
    }

    // Encontrar a categoria com a melhor acurácia
    let maxAccuracy = -1;
    let bestCategories: string[] = [];

    this.categories.forEach(category => {
      if (category.accuracy > maxAccuracy) {
        maxAccuracy = category.accuracy;
        bestCategories = [category.name];
      } else if (category.accuracy === maxAccuracy) {
        bestCategories.push(category.name);
      }
    });

    // Se houver mais de uma categoria com a melhor acurácia ou nenhuma performance clara
    if (bestCategories.length === 1) {
      this.userBest = bestCategories[0];
    } else {
      this.userBest = 'Sem domínio';
    }
  }

  // Função para selecionar ou desselecionar categorias
  toggleCategorySelection(categoryName: string): void {
    const index = this.selectedCategories.indexOf(categoryName);
    if (index === -1) {
      this.selectedCategories.push(categoryName);  // Se não está na lista, adiciona
    } else {
      this.selectedCategories.splice(index, 1);  // Se já está, remove
    }
    console.log('Selected categories:', this.selectedCategories);
  }

  // Função para iniciar o quiz com as categorias selecionadas
  startQuiz(): void {
    if (this.selectedCategories.length === 0) {
      alert('Por favor, selecione pelo menos uma categoria para jogar.');
    } else {
      // Remover espaços em branco e caracteres indesejados
      const cleanedCategories = this.selectedCategories.map(cat => cat.trim());
      console.log('Iniciando quiz com as categorias:', cleanedCategories);
      this.router.navigate(['/run'], { queryParams: { categories: cleanedCategories.join(',') } });
    }
  }
}
