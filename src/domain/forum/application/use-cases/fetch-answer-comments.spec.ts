import { AnswerCommentFactory } from 'test/factories/answer-comment-factory'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { FetchAnswerCommentsUseCase } from './fetch-answer-comments'

let answerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: FetchAnswerCommentsUseCase

describe('Fetch answer comments', () => {
  beforeEach(() => {
    answerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new FetchAnswerCommentsUseCase(answerCommentsRepository)
  })

  it('should be able to fetch answer comments', async () => {
    await answerCommentsRepository.create(
      AnswerCommentFactory.make({
        answerId: new UniqueEntityID('answer-1'),
      }),
    )

    await answerCommentsRepository.create(
      AnswerCommentFactory.make({
        answerId: new UniqueEntityID('answer-1'),
      }),
    )

    await answerCommentsRepository.create(
      AnswerCommentFactory.make({
        answerId: new UniqueEntityID('answer-1'),
      }),
    )

    const result = await sut.execute({
      answerId: 'answer-1',
      page: 1,
    })

    expect(result.value?.answerComments).toHaveLength(3)
  })

  it('should be able to fetch paginated answer comments', async () => {
    for (let i = 1; i <= 22; i++) {
      await answerCommentsRepository.create(
        AnswerCommentFactory.make({
          answerId: new UniqueEntityID('answer-1'),
        }),
      )
    }

    const result = await sut.execute({
      answerId: 'answer-1',
      page: 2,
    })

    expect(result.value?.answerComments).toHaveLength(2)
  })
})
