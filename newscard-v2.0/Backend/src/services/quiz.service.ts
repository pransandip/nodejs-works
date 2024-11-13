import { prisma } from '../prisma/prisma.client';

const addQuestionAnswer = async (question: string, answer: string) => {
  try {
    // create Question
    const addedQuesAns = await prisma.quiz.create({
      data: { question, answer },
    });

    // If not saved
    if (!addedQuesAns) {
      throw new Error('some issue occurred, while adding question');
    }

    return addedQuesAns;
  } catch (err) {
    throw err;
  }
};

const checkAnswer = async (questionId: string, answer: string) => {
  try {
    const exists = await prisma.quiz.findFirst({
      where: { id: questionId },
    });

    if (!exists) {
      throw new Error(`Question with id: (${questionId}) does not exists`);
    }

    if (exists.answer !== answer) {
      throw new Error('Answer is wrong');
    }

    return exists;
  } catch (err) {
    throw err;
  }
};

const removeQuestion = async (questionId: string) => {
  try {
    const exists = await prisma.quiz.findFirst({
      where: { id: questionId },
    });

    if (!exists) {
      throw new Error(`Question with id: (${questionId}) does not exists`);
    }

    // delete question
    const result = await prisma.quiz.delete({ where: { id: questionId } });
    if (!result) throw new Error('Some error occurred while deleting question');

    return result;
  } catch (err) {
    throw err;
  }
};

const fetchQuestion = async (questionId: string) => {
  try {
    let questions: any;

    if (questionId) {
      questions = await prisma.quiz.findFirst({
        select: { id: true, question: true, createdAt: true },
        where: { id: questionId },
      });

      if (!questions) {
        throw new Error('No records found of question');
      }

      return questions;
    }

    questions = await prisma.quiz.findMany({
      select: { id: true, question: true, answer: true, createdAt: true },
      where: { id: questionId },
    });

    if (questions.length === 0) {
      throw new Error('No records found of question');
    }

    return questions;
  } catch (err) {
    throw err;
  }
};

export default {
  addQuestionAnswer,
  checkAnswer,
  removeQuestion,
  fetchQuestion,
};
