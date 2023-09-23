import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'

import { isRight } from '@/core/either'

import { AnswerQuestionUseCase } from './answer-question'

let answersRepository: InMemoryAnswersRepository
let sut: AnswerQuestionUseCase

describe('Answer question', () => {
  beforeEach(() => {
    answersRepository = new InMemoryAnswersRepository()
    sut = new AnswerQuestionUseCase(answersRepository)
  })

  it('should be able to answer a question', async () => {
    const result = await sut.execute({
      questionId: '1',
      instructorId: '1',
      content: 'Conteúdo da resposta',
    })

    expect(isRight(result)).toBe(true)
    expect(answersRepository.items[0]).toEqual(result.value?.answer)
  })
})
