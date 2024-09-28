import { Component, OnInit } from '@angular/core';
import { QuestionService } from './question.service';  // Importe o QuestionService
import { Router } from '@angular/router';
import { Question } from './question.model';
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
    // Obter as categorias passadas como queryParams
    this.route.queryParams.subscribe((params: any) => {
      const categories = params['categories'];
      this.selectedCategories = categories ? categories.split(',') : [];
      console.log('Categorias recebidas:', this.selectedCategories);

      if (this.selectedCategories.length > 0) {
        this.loadQuestions(this.selectedCategories);  // Passe o parâmetro correto aqui
      }
    });
  }

  // Carregar perguntas com base nas categorias selecionadas
  async loadQuestions(selectedCategories: string[]): Promise<void> {
    this.questions = await this.questionService.getQuestionsForRun(selectedCategories, 5);
    console.log('Perguntas recebidas nessa merda:', this.questions); // Verifica o formato dos dados
    this.totalQuestions = this.questions.length;
    this.currentQuestion = this.questions[this.currentQuestionIndex];

    if (this.currentQuestion) {
      console.log('Alternativas erradas:', this.currentQuestion.wrong_answers);
    }
  }

  // Lógica da próxima questão
  nextQuestion(): void {
    if (this.selectedAnswer === this.currentQuestion?.correct_answer) {
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
    if (!this.currentQuestion) {
      return [];
    }

    // Log para verificar as alternativas antes de embaralhar
    console.log('Respostas antes de embaralhar:', {
      correct: this.currentQuestion.correct_answer,
      wrong: this.currentQuestion.wrong_answers,
    });

    // Combina a resposta correta e as erradas, que agora sempre serão um array
    const allAnswers = [this.currentQuestion.correct_answer, ...this.currentQuestion.wrong_answers];

    // Embaralha as respostas
    const shuffledAnswers = allAnswers.sort(() => Math.random() - 0.5);

    console.log('Respostas embaralhadas:', shuffledAnswers);  // Log para verificar as respostas embaralhadas

    return shuffledAnswers;
  }


  // Finalizar a run
  endRun(): void {
    alert(`Você acertou ${this.correctAnswers} de ${this.totalQuestions} questões.`);
    this.router.navigate(['/home']);
  }
}
