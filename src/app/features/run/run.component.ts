import { Component, OnInit } from '@angular/core';
import { QuestionService } from './question.service';  // Importe o QuestionService
import { Router } from '@angular/router';
import { Question } from './question.model';
import { Answer } from './question.model';
import { SupabaseService } from '../../core/supabase.service';  // Importe o SupabaseService
import { ActivatedRoute } from '@angular/router';  // Importa o ActivatedRoute
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-run',
  standalone: true,  // Se for standalone, adicione true
  imports: [CommonModule],  // Adicione CommonModule
  templateUrl: './run.component.html',
  styleUrls: ['./run.component.css']
})
export class RunComponent implements OnInit {
  questions: Question[] = [];
  allQuestions: Question[] = [];
  currentQuestionIndex: number = 0;
  currentQuestion: Question | null = null;
  selectedAnswer: string | null = null;
  correctAnswers: number = 0;
  totalQuestions: number = 0;

  selectedCategories: string[] = [];
  userId: string | null = null; // Armazenar o userId

  constructor(
    private questionService: QuestionService,  // Injete o QuestionService
    private supabaseService: SupabaseService,  // Injete o SupabaseService
    private router: Router,
    private route: ActivatedRoute  // Injetando ActivatedRoute aqui
  ) {}

  async ngOnInit(): Promise<void> {
    // Obter o usuário logado
    const { data: sessionData, error: sessionError } = await this.supabaseService.getSupabaseClient().auth.getSession();

    if (sessionError || !sessionData?.session?.user) {
      console.error('Erro ao obter sessão ou usuário não autenticado:', sessionError);
      return;
    }

    this.userId = sessionData.session.user.id;
    console.log('Usuário logado:', this.userId);

    this.route.queryParams.subscribe((params: any) => {
      const categories = params['categories'];
      this.selectedCategories = categories ? categories.split(',').map(Number) : [];
      //console.log('Categorias selecionadas (depois da conversão):', this.selectedCategories);

      if (this.selectedCategories.length > 0) {
        this.loadQuestions(this.selectedCategories);  // Agora passa os IDs numéricos
      }
    });
  }


  // Carregar perguntas com base nas categorias selecionadas
  async loadQuestions(selectedCategories: string[]): Promise<void> {
    const numericCategories = selectedCategories.map(Number);
    console.log('CATEGORIAS recebidas:', numericCategories); // Converte os IDs das categorias para números
    this.allQuestions = await this.questionService.getQuestionsForRun(numericCategories, numericCategories.length*10);
    console.log('Perguntas recebidas:', this.allQuestions);  // Verifique as perguntas recebidas
    this.questions = this.shuffleArray(this.allQuestions).slice(0, Math.min(15, this.allQuestions.length));
    console.log('Perguntas TRATADAS:', this.questions);
    this.totalQuestions = this.questions.length;
    this.currentQuestion = this.questions[this.currentQuestionIndex];
  }

  // Função utilitária para embaralhar um array usando o algoritmo de Fisher-Yates
private shuffleArray(array: any[]): any[] {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

  // Função para atualizar as estatísticas de usuário e categoria
  async updateUserCategoryStats(categoryId: number, isCorrect: boolean): Promise<void> {
    const supabase = this.supabaseService.getSupabaseClient();

    // Verificar se já existe um registro para o usuário e categoria
    let { data: stats, error } = await supabase
      .from('user_category_stats')
      .select('*')
      .eq('user_id', this.userId)
      .eq('category_id', categoryId)
      .single();  // Garantimos que só queremos um registro

    if (error && error.code !== 'PGRST116') {  // Verifica se não é um erro de "registro não encontrado"
      console.error('Erro ao buscar estatísticas do usuário:', error);
      return;
    }

    console.log('Dados existentes encontrados para user_category_stats:', stats);

    if (stats) {
      // Se o registro já existir, atualizamos
      const updatedStats = {
        total_questions: stats.total_questions + 1,
        correct_answers: isCorrect ? stats.correct_answers + 1 : stats.correct_answers,
      };

      const { error: updateError, data: updatedData } = await supabase
        .from('user_category_stats')
        .update(updatedStats)
        .eq('id', stats.id)
        .select('*');  // Força a retornar os dados atualizados

      if (updateError) {
        console.error('Erro ao atualizar estatísticas do usuário:', updateError);
      } else {
        console.log('Estatísticas atualizadas com sucesso:', updatedData);
      }
    } else {
      // Se o registro não existir, criamos um novo
      const newStats = {
        user_id: this.userId,
        category_id: categoryId,
        total_questions: 1,
        correct_answers: isCorrect ? 1 : 0,
      };

      const { error: insertError, data: insertedData } = await supabase
        .from('user_category_stats')
        .insert(newStats);

      if (insertError) {
        console.error('Erro ao inserir novas estatísticas do usuário:', insertError);
      } else {
        console.log('Novas estatísticas inseridas com sucesso:', insertedData);
      }
    }
  }


  // Lógica da próxima questão
  async nextQuestion(): Promise<void> {
    const isCorrect = this.selectedAnswer === this.currentQuestion?.answers.find(a => a.is_correct)?.answer;

    if (isCorrect) {
      this.correctAnswers++;
    }

    // Atualizar as estatísticas de usuário para a categoria da questão atual
    await this.updateUserCategoryStats(this.currentQuestion?.category_id || 0, isCorrect);

    this.currentQuestionIndex++;

    if (this.currentQuestionIndex < this.questions.length) {
      this.currentQuestion = this.questions[this.currentQuestionIndex];
      //console.log('Nova questão carregada:', this.currentQuestion);  // Log para verificar a nova questão
      this.selectedAnswer = null;
    } else {
      this.endRun();
    }
  }

  getShuffledAnswers(): string[] {
    if (!this.currentQuestion || !this.currentQuestion.answers || this.currentQuestion.answers.length === 0) {
      //console.error('Nenhuma resposta disponível ou estrutura de dados incorreta:', this.currentQuestion);
      return [];
    }

    const correctAnswer = this.currentQuestion.answers.find((a: Answer) => a.is_correct)?.answer || '';
    const wrongAnswers = this.currentQuestion.answers
      .filter((a: Answer) => !a.is_correct)
      .map((a: Answer) => a.answer);

    //console.log('Resposta correta:', correctAnswer);
    //console.log('Respostas erradas:', wrongAnswers);

    if (!correctAnswer || wrongAnswers.length === 0) {
      console.error('Erro: Respostas não encontradas corretamente.');
      return [];
    }

    // Embaralha e retorna as respostas
    const sAnswers = [correctAnswer, ...wrongAnswers]
    return sAnswers;
  }

  // Finalizar a run
  endRun(): void {
    alert(`Você acertou ${this.correctAnswers} de ${this.totalQuestions} questões.`);
    this.router.navigate(['/home']);
  }

  goToHome() {
    this.router.navigate(['/home']);
  }

  goToConfig() {
    this.router.navigate(['/config']);
  }
}
