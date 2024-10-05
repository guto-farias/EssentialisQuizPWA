import { Component, OnInit } from '@angular/core';
import { QuestionService } from './question.service';  // Importe o QuestionService
import { Router } from '@angular/router';
import { Question } from './question.model';
import { Answer } from './question.model';
import { ActivatedRoute } from '@angular/router';  // Importa o ActivatedRoute
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-run',
  standalone: true,  // Se for standalone, adicione true
  imports: [CommonModule],  // Adicione CommonModule
  templateUrl: './run.component.html',
  styleUrls: ['./run.component.scss']
})
export class RunComponent implements OnInit {
  questions: Question[] = [];
  currentQuestionIndex: number = 0;
  currentQuestion: Question | null = null;
  selectedAnswer: string | null = null;
  correctAnswers: number = 0;
  totalQuestions: number = 0;

  selectedCategories: string[] = [];

  constructor(
    private questionService: QuestionService,  // Injete o QuestionService
    private router: Router,
    private route: ActivatedRoute  // Injetando ActivatedRoute aqui
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: any) => {
      const categories = params['categories'];
      this.selectedCategories = categories ? categories.split(',').map(Number) : [];
      console.log('Categorias selecionadas (depois da conversão):', this.selectedCategories);

      if (this.selectedCategories.length > 0) {
        this.loadQuestions(this.selectedCategories);  // Agora passa os IDs numéricos
      }
    });
  }

  // Carregar perguntas com base nas categorias selecionadas
  async loadQuestions(selectedCategories: string[]): Promise<void> {
    const numericCategories = selectedCategories.map(Number); // Converte os IDs das categorias para números
    this.questions = await this.questionService.getQuestionsForRun(numericCategories, 5);
    //console.log('Perguntas recebidas:', this.questions);  // Verifique as perguntas recebidas
    /*this.questions.forEach((question, index) => {
      console.log(`Pergunta ${index + 1}:`, question);
      console.log(`Alternativas para a pergunta ${index + 1}:`, question.answers);
    });*/
    this.totalQuestions = this.questions.length;
    this.currentQuestion = this.questions[this.currentQuestionIndex];
  }



  // Lógica da próxima questão
  nextQuestion(): void {
    if (this.selectedAnswer === this.currentQuestion?.answers.find(a => a.is_correct)?.answer) {
      this.correctAnswers++;
    }

    this.currentQuestionIndex++;

    if (this.currentQuestionIndex < this.questions.length) {
      this.currentQuestion = this.questions[this.currentQuestionIndex];
      console.log('Nova questão carregada:', this.currentQuestion);  // Log para verificar a nova questão
      this.selectedAnswer = null;
    } else {
      this.endRun();
    }
  }

  getShuffledAnswers(): string[] {
    if (!this.currentQuestion || !this.currentQuestion.answers || this.currentQuestion.answers.length === 0) {
      console.log('Nenhuma resposta disponível ou estrutura de dados incorreta:', this.currentQuestion);
      return [];
    }

    const correctAnswer = this.currentQuestion.answers.find((a: Answer) => a.is_correct)?.answer || '';
    const wrongAnswers = this.currentQuestion.answers
      .filter((a: Answer) => !a.is_correct)
      .map((a: Answer) => a.answer);

    console.log('Resposta correta:', correctAnswer);
    console.log('Respostas erradas:', wrongAnswers);

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
}
