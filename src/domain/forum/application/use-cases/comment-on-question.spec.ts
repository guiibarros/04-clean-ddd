import { faker } from '@faker-js/faker'
import { QuestionFactory } from 'test/factories/question-factory'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'

import { CommentOnQuestionUseCase } from './comment-on-question'

let questionsRepository: InMemoryQuestionsRepository
let questionCommentsRepository: InMemoryQuestionCommentsRepository

let sut: CommentOnQuestionUseCase

describe('Comment on question use case', () => {
  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository()
    questionCommentsRepository = new InMemoryQuestionCommentsRepository()

    sut = new CommentOnQuestionUseCase(
      questionsRepository,
      questionCommentsRepository,
    )
  })

  it('should be able to comment on question', async () => {
    const question = QuestionFactory.make()
    await questionsRepository.create(question)

    const { questionComment } = await sut.execute({
      questionId: question.id.toString(),
      authorId: question.authorId.toString(),
      content: faker.lorem.text(),
    })

    expect(questionComment.id).toBeTruthy()
    expect(questionCommentsRepository.items[0].content).toEqual(
      questionComment.content,
    )
  })
})
