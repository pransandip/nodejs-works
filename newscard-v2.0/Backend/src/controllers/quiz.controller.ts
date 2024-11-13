import { Request, Response } from 'express';
import quizService from '../services/quiz.service';

export const addQuestionAnswer = async (req: Request, res: Response) => {
  try {
    const { question, answer }: { question: string; answer: string } = req.body;
    if (!question || !answer) throw new Error('please provide all the fields');

    const ques = await quizService.addQuestionAnswer(question, answer);

    return res.status(201).json({
      success: '1',
      message: 'Successfully Added Question',
      data: ques,
    });
  } catch (err) {
    console.log((err as Error).message);
    res.status(200).json({ success: '0', message: (err as Error).message });
  }
};

export const checkAnswer = async (req: Request, res: Response) => {
  try {
    const { questionId, answer }: { questionId: string; answer: string } =
      req.body;
    if (!questionId || !answer) {
      throw new Error('please provide all the fields');
    }

    const checked = await quizService.checkAnswer(questionId, answer);

    return res.status(201).json({
      success: '1',
      message: 'Answer is correct',
      data: checked,
    });
  } catch (err) {
    console.log((err as Error).message);
    res.status(200).json({ success: '0', message: (err as Error).message });
  }
};

export const removeQuestion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) throw new Error('please provide the id first');

    const ques = await quizService.removeQuestion(id);

    return res.status(201).json({
      success: '1',
      message: 'Question Successfully removed',
      data: ques,
    });
  } catch (err) {
    console.log((err as Error).message);
    res.status(200).json({ success: '0', message: (err as Error).message });
  }
};

export const fetchQuestion = async (req: Request, res: Response) => {
  try {
    const { questionId } = req.body;

    const ques = await quizService.fetchQuestion(questionId);

    return res.status(201).json({
      success: '1',
      message: 'Question Fetched Successfully',
      data: ques,
    });
  } catch (err) {
    console.log((err as Error).message);
    res.status(200).json({ success: '0', message: (err as Error).message });
  }
};
