import { Injectable } from '@angular/core';
import { SupabaseService } from '../../core/supabase.service';  // Supabase centralizado
import { Category } from './category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(private supabaseService: SupabaseService) { }

  // Método para buscar categorias fixas e desempenho do usuário
  async getCategoriesWithUserStats(): Promise<Category[]> {
    const supabase = this.supabaseService.getSupabaseClient();

    // Obter a sessão e o user_id
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !sessionData?.session?.user) {
      console.error('Erro ao buscar a sessão ou usuário não autenticado:', sessionError?.message);
      return [];
    }

    const userId = sessionData.session.user.id;
    console.log('Usuário ID:', userId);  // Verifica se o ID do usuário está correto

    // Buscar as categorias fixas
    const { data: categories, error: categoryError } = await supabase
      .from('categories')
      .select('id, name');

    if (categoryError || !categories) {
      console.error('Erro ao buscar categorias fixas:', categoryError?.message);
      return [];
    }

    console.log('Categorias carregadas:', categories);  // Verifica se as categorias foram carregadas

    // Buscar as estatísticas do usuário para cada categoria
    const { data: userStats, error: userStatsError } = await supabase
      .from('user_category_stats')
      .select('category_id, total_questions, correct_answers')
      .eq('user_id', userId);

    if (userStatsError || !userStats) {
      console.error('Erro ao buscar desempenho do usuário:', userStatsError?.message);
      return [];
    }

    console.log('Estatísticas do usuário carregadas:', userStats);  // Verifica se as estatísticas foram carregadas

    // Combinar categorias fixas com as estatísticas do usuário
    const categoriesWithStats: Category[] = categories.map((category: any) => {
      const stats = userStats.find((stat: any) => stat.category_id === category.id) || { total_questions: 0, correct_answers: 0 };
      const accuracy = stats.total_questions > 0
        ? (stats.correct_answers / stats.total_questions) * 100
        : 0;

      return {
        name: category.name,
        accuracy: parseFloat(accuracy.toFixed(2))  // Formatar para 2 casas decimais
      };
    });

    console.log('Categorias com estatísticas:', categoriesWithStats);  // Verifica o resultado final
    return categoriesWithStats;
  }


}
