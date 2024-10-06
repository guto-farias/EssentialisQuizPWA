import { Injectable } from '@angular/core';
import { SupabaseService } from '../../core/supabase.service';
import { Category } from './category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private supabaseService: SupabaseService) {}

  async getCategoriesWithUserStats(): Promise<Category[]> {
    const supabase = this.supabaseService.getSupabaseClient();  // Obtenha o client

    const { data: categories, error } = await supabase
      .from('category')  // Use o client Supabase
      .select(`
        id,
        category
      `);

    if (error) {
      console.error('Erro ao buscar categorias:', error);
      return [];
    }

    // Defina o tipo correto para userStats
    const { data: userStats, error: userStatsError } = await supabase
      .from('user_category_stats')
      .select('category_id, total_questions, correct_answers');

    if (userStatsError) {
      console.error('Erro ao buscar estatísticas dos usuários:', userStatsError);
      return [];
    }

    // Mapeamento com tipos definidos
    const categoriesWithStats: Category[] = categories.map((category: { id: number; category: string }) => {
      const stats = userStats.find((stat: { category_id: number }) => stat.category_id === category.id);
      const accuracy = stats && stats.total_questions > 0
        ? (stats.correct_answers / stats.total_questions) * 100
        : 0;

      return {
        ...category,  // Retorna todas as propriedades da categoria
        accuracy,     // Adiciona a propriedade accuracy ao objeto retornado
      };
    });

    return categoriesWithStats;
  }
}
