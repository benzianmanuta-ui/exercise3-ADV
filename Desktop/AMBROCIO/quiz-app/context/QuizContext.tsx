import { questions as defaultQuestions } from '@/questions';
import React, { createContext, ReactNode, useContext, useState } from 'react';

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizContextType {
  questions: QuizQuestion[];
  quizTime: number;
  setQuizTime: (time: number) => void;
  addQuestion: (question: QuizQuestion) => void;
  updateQuestion: (id: number, question: QuizQuestion) => void;
  deleteQuestion: (id: number) => void;
  setQuestions: (questions: QuizQuestion[]) => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export function QuizProvider({ children }: { children: ReactNode }) {
  const [questions, setQuestions] = useState<QuizQuestion[]>(defaultQuestions);
  const [quizTime, setQuizTime] = useState(300); // 5 minutes default

  const addQuestion = (question: QuizQuestion) => {
    const newId = Math.max(...questions.map(q => q.id), 0) + 1;
    setQuestions([...questions, { ...question, id: newId }]);
  };

  const updateQuestion = (id: number, updatedQuestion: QuizQuestion) => {
    setQuestions(questions.map(q => q.id === id ? updatedQuestion : q));
  };

  const deleteQuestion = (id: number) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  return (
    <QuizContext.Provider value={{ questions, quizTime, setQuizTime, addQuestion, updateQuestion, deleteQuestion, setQuestions }}>
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
}
