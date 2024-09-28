import { SupabaseService } from '../../core/supabase.service';
import { Question } from './question.model';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  constructor(private supabase: SupabaseService) {}

  async getQuestionsForRun(categories: string[], limit: number): Promise<Question[]> {
    const supabase = this.supabase.getSupabaseClient();  // Obtenha o cliente Supabase

    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .in('category', categories)
      .limit(limit);

    if (error) {
      console.error('Erro ao buscar as perguntas:', error);
      throw new Error('Erro ao buscar as perguntas.');
    }

    console.log('Perguntas recebidas:', data);  // Log para verificar os dados retornados

    // Garante que o campo 'wrong_answers' seja um array
    return data.map((question: any) => {
      const parsedWrongAnswers = this.parseWrongAnswers(question.wrong_answers);
      console.log('Alternativas erradas parseadas:', parsedWrongAnswers);  // Log para verificar as alternativas erradas
      return {
        ...question,
        wrong_answers: parsedWrongAnswers
      };
    });
  }

  // Função para tratar e garantir que wrong_answers seja um array
  private parseWrongAnswers(wrongAnswers: any): string[] {
    // Se for uma string, tenta converter de JSON
    if (typeof wrongAnswers === 'string') {
      try {
        return JSON.parse(wrongAnswers);
      } catch (error) {
        console.error('Erro ao parsear wrong_answers:', error);
        return [];
      }
    }

    // Se já for um array, retorna como está
    return Array.isArray(wrongAnswers) ? wrongAnswers : [];
  }
}

