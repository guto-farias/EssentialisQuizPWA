// src/app/features/run/question.model.ts

export interface Question {
  id: string;  // Certifique-se de que está usando o tipo certo
  category: string;  // Nome da categoria, caso você deseje exibi-lo
  question_text: string;
  correct_answer: string;
  wrong_answers: string[];  // Array de respostas erradas
}
