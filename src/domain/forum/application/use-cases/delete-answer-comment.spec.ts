import { AnswerCommentFactory } from 'test/factories/answer-comment-factory'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'

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
    await expect(() =>
      sut.execute({
        answerCommentId: 'answer-1',
        authorId: 'author-1',
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should not be able to delete a answer comment from another author', async () => {
    const answerComment = AnswerCommentFactory.make({
      authorId: new UniqueEntityID('author-1'),
    })

    await answerCommentsRepository.create(answerComment)

    await expect(() =>
      sut.execute({
        answerCommentId: answerComment.id.toString(),
        authorId: 'author-2',
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
