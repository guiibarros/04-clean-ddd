import { AnswerFactory } from 'test/factories/answer-factory'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { FetchQuestionAnswersUseCase } from './fetch-question-answers'

let answersRepository: InMemoryAnswersRepository
let sut: FetchQuestionAnswersUseCase

describe('Fetch question answers', () => {
  beforeEach(() => {
    answersRepository = new InMemoryAnswersRepository()
    sut = new FetchQuestionAnswersUseCase(answersRepository)
  })

  it('should be able to fetch question answers', async () => {
    await answersRepository.create(
      AnswerFactory.make({
        questionId: new UniqueEntityID('question-1'),
      }),
    )

    await answersRepository.create(
      AnswerFactory.make({
        questionId: new UniqueEntityID('question-1'),
      }),
    )

    await answersRepository.create(
      AnswerFactory.make({
        questionId: new UniqueEntityID('question-1'),
      }),
    )

    const result = await sut.execute({
      questionId: 'question-1',
      page: 1,
    })

    expect(result.value?.answers).toHaveLength(3)
  })

  it('should be able to fetch paginated question answers', async () => {
    for (let i = 1; i <= 22; i++) {
      await answersRepository.create(
        AnswerFactory.make({ questionId: new UniqueEntityID('question-1') }),
      )
    }

    const result = await sut.execute({
      questionId: 'question-1',
      page: 2,
    })

    expect(result.value?.answers).toHaveLength(2)
  })
})
