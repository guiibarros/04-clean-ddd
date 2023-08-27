import { Answer } from '../entities/answer'
import { AnswerQuestionUseCase } from './answer-question'

const fakeAnswersRepository = {
  items: [] as Answer[],

  async create(answer: Answer) {
    this.items.push(answer)
  },
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
