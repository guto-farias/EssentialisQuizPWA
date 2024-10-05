import { SupabaseService } from '../../core/supabase.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  constructor(private supabaseService: SupabaseService) {}

  async getQuestionsForRun(selectedCategories: number[], limit: number) {
    const supabase = this.supabaseService.getSupabaseClient();

    const { data, error } = await supabase
      .from('question')
      .select(`
        id,
        question,
        category_id,
        answers (
          id,
          question_id,
          answer,
          is_correct
        )
      `)
      .in('category_id', selectedCategories)
      .limit(limit);

    if (error) {
      console.error('Erro ao buscar perguntas:', error);
      return [];
    }

    if (!data) {
      console.error('Nenhuma pergunta encontrada');
      return [];
    }

    //console.log('Dados brutos recebidos do Supabase:', data);

    // Verifica se há respostas disponíveis para cada pergunta
    return data.map(q => ({
      id: q.id,
      question: q.question,
      category_id: q.category_id,
      answers: q.answers ? q.answers.map(a => ({
        id: a.id,
        question_id: a.question_id,
        answer: a.answer,
        is_correct: a.is_correct
      })) : []  // Certifica-se de que 'answers' não seja nulo
    }));
  }
}
