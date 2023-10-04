import { AnswerCommentFactory } from 'test/factories/answer-comment-factory'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'

import { isLeft } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { DeleteAnswerCommentUseCase } from './delete-answer-comment'

let answerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: DeleteAnswerCommentUseCase

describe('Delete answer comment', () => {
  beforeEach(() => {
    answerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new DeleteAnswerCommentUseCase(answerCommentsRepository)
  })

  it('should be able to delete a answer comment', async () => {
    const answerComment = AnswerCommentFactory.make()
    await answerCommentsRepository.create(answerComment)

    await sut.execute({
      answerCommentId: answerComment.id.toString(),
      authorId: answerComment.authorId.toString(),
    })

    expect(answerCommentsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a non-existent answer comment', async () => {
    const result = await sut.execute({
      answerCommentId: 'answer-1',
      authorId: 'author-1',
    })

    expect(isLeft(result)).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to delete a answer comment from another author', async () => {
    const answerComment = AnswerCommentFactory.make({
      authorId: new UniqueEntityID('author-1'),
    })

    await answerCommentsRepository.create(answerComment)

    const result = await sut.execute({
      answerCommentId: answerComment.id.toString(),
      authorId: 'author-2',
    })

    expect(isLeft(result)).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
