import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'

import { AnswerQuestionUseCase } from './answer-question'

let answersRepository: InMemoryAnswersRepository
let sut: AnswerQuestionUseCase

describe('Answer question', () => {
  beforeEach(() => {
    answersRepository = new InMemoryAnswersRepository()
    sut = new AnswerQuestionUseCase(answersRepository)
  })

  it('should be able to answer a question', async () => {
    const { answer } = await sut.execute({
      questionId: '1',
      instructorId: '1',
      content: 'Conteúdo da resposta',
    })

    expect(answer.id).toBeTruthy()
    expect(answersRepository.items[0].id).toEqual(answer.id)
  })
})
