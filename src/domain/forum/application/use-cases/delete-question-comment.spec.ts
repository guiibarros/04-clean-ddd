import { QuestionCommentFactory } from 'test/factories/question-comment-factory'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { DeleteQuestionCommentUseCase } from './delete-question-comment'

let questionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: DeleteQuestionCommentUseCase

describe('Delete question comment', () => {
  beforeEach(() => {
    questionCommentsRepository = new InMemoryQuestionCommentsRepository()
    sut = new DeleteQuestionCommentUseCase(questionCommentsRepository)
  })

  it('should be able to delete a question comment', async () => {
    const questionComment = QuestionCommentFactory.make()
    await questionCommentsRepository.create(questionComment)

    await sut.execute({
      questionCommentId: questionComment.id.toString(),
      authorId: questionComment.authorId.toString(),
    })

    expect(questionCommentsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a non-existent question comment', async () => {
    await expect(() =>
      sut.execute({
        questionCommentId: 'question-1',
        authorId: 'author-1',
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should not be able to delete a question comment from another author', async () => {
    const questionComment = QuestionCommentFactory.make({
      authorId: new UniqueEntityID('author-1'),
    })

    await questionCommentsRepository.create(questionComment)

    await expect(() =>
      sut.execute({
        questionCommentId: questionComment.id.toString(),
        authorId: 'author-2',
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
