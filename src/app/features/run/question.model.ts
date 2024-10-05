// src/app/features/run/question.model.ts

export interface Question {
  id: number;
  question: string;
  category_id: number;
  answers: Answer[];  // Certifique-se de que answers seja um array de respostas
}

export interface Answer {
  id: number;
  question_id: number;
  answer: string;
  is_correct: boolean;
}
