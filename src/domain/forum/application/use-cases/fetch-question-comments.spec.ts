import { QuestionCommentFactory } from 'test/factories/question-comment-factory'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { FetchQuestionCommentsUseCase } from './fetch-question-comments'

let questionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: FetchQuestionCommentsUseCase

describe('Fetch question comments', () => {
  beforeEach(() => {
    questionCommentsRepository = new InMemoryQuestionCommentsRepository()
    sut = new FetchQuestionCommentsUseCase(questionCommentsRepository)
  })

  it('should be able to fetch question comments', async () => {
    await questionCommentsRepository.create(
      QuestionCommentFactory.make({
        questionId: new UniqueEntityID('question-1'),
      }),
    )

    await questionCommentsRepository.create(
      QuestionCommentFactory.make({
        questionId: new UniqueEntityID('question-1'),
      }),
    )

    await questionCommentsRepository.create(
      QuestionCommentFactory.make({
        questionId: new UniqueEntityID('question-1'),
      }),
    )

    const { questionComments } = await sut.execute({
      questionId: 'question-1',
      page: 1,
    })

    expect(questionComments).toHaveLength(3)
  })

  it('should be able to fetch paginated question comments', async () => {
    for (let i = 1; i <= 22; i++) {
      await questionCommentsRepository.create(
        QuestionCommentFactory.make({
          questionId: new UniqueEntityID('question-1'),
        }),
      )
    }

    const { questionComments } = await sut.execute({
      questionId: 'question-1',
      page: 2,
    })

    expect(questionComments).toHaveLength(2)
  })
})
