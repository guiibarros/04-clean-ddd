import { faker } from '@faker-js/faker'
import { AnswerFactory } from 'test/factories/answer-factory'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'

import { isRight } from '@/core/either'

import { CommentOnAnswerUseCase } from './comment-on-answer'

let answersRepository: InMemoryAnswersRepository
let answerCommentsRepository: InMemoryAnswerCommentsRepository

let sut: CommentOnAnswerUseCase

describe('Comment on answer use case', () => {
  beforeEach(() => {
    answersRepository = new InMemoryAnswersRepository()
    answerCommentsRepository = new InMemoryAnswerCommentsRepository()

    sut = new CommentOnAnswerUseCase(
      answersRepository,
      answerCommentsRepository,
    )
  })

  it('should be able to comment on answer', async () => {
    const answer = AnswerFactory.make()
    await answersRepository.create(answer)

    const result = await sut.execute({
      answerId: answer.id.toString(),
      authorId: answer.authorId.toString(),
      content: faker.lorem.text(),
    })

    const success = isRight(result)
    expect(success).toBe(true)

    if (success) {
      expect(answerCommentsRepository.items[0]).toEqual(
        result.value.answerComment,
      )
    }
  })
})
