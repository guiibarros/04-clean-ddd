import { Answer } from '../entities/answer'
import { AnswersRepository } from '../repositories/answers-repository'

import { AnswerQuestionUseCase } from './answer-question'

const fakeAnswersRepository: AnswersRepository = {
  create: async (answer: Answer) => {}
}

test('Create an answer', async () => {
  const answerQuestion = new AnswerQuestionUseCase(fakeAnswersRepository)

  const { answer } = await answerQuestion.execute({
    instructorId: '1',
    questionId: '1',
    content: 'Nova resposta',
  })

  expect(answer.content).toEqual('Nova resposta')
})