import { Injectable } from '@angular/core';
import { SupabaseService } from '../../core/supabase.service';

export interface Category {
  id: number;
  category: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private supabaseService: SupabaseService) {}

  // Método para obter todas as categorias da tabela Category
  async getAllCategories(): Promise<Category[]> {
    const { data, error } = await this.supabaseService.getSupabaseClient()
      .from('category')
      .select('*');

    if (error) {
      console.error('Erro ao buscar categorias:', error);
      return [];
    }

    return data as Category[];
  }

  // Método para obter estatísticas do usuário e associar com os dados das categorias
  async getUserStats(userId: string): Promise<any[]> {
    // Busca as estatísticas do usuário
    const { data: userStatsData, error: userStatsError } = await this.supabaseService.getSupabaseClient()
      .from('user_category_stats')
      .select('category_id, total_questions, correct_answers')
      .eq('user_id', userId);

    if (userStatsError) {
      console.error('Erro ao buscar estatísticas do usuário:', userStatsError);
      return [];
    }

    // Busca todas as categorias
    const categories = await this.getAllCategories();

    // Associa as estatísticas do usuário com os nomes das categorias
    return userStatsData.map(stat => {
      const category = categories.find(cat => cat.id === stat.category_id);
      return {
        correct_answers: stat.correct_answers,
        total_questions: stat.total_questions,
        categoryName: category ? category.category : 'NÃO ENCONTRADA',
        accuracy: stat.total_questions > 0 ? (stat.correct_answers / stat.total_questions) * 100 : 0
      };
    });
  }

  // Método para obter o melhor domínio com base nas estatísticas do usuário
  async getBestDomain(userId: string): Promise<string> {
    const userStats = await this.getUserStats(userId);
    let bestDomain = 'Sem domínio';
    let highestAccuracy = -1;

    userStats.forEach(stat => {
      if (stat.accuracy > highestAccuracy) {
        highestAccuracy = stat.accuracy;
        bestDomain = stat.categoryName;
      }
    });

    return bestDomain;
  }
}
