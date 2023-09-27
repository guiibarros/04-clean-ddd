import { faker } from '@faker-js/faker'
import { QuestionFactory } from 'test/factories/question-factory'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'

import { isRight } from '@/core/either'

import { CommentOnQuestionUseCase } from './comment-on-question'

let questionsRepository: InMemoryQuestionsRepository
let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let questionCommentsRepository: InMemoryQuestionCommentsRepository

let sut: CommentOnQuestionUseCase

describe('Comment on question use case', () => {
  beforeEach(() => {
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    questionsRepository = new InMemoryQuestionsRepository(
      questionAttachmentsRepository,
    )
    questionCommentsRepository = new InMemoryQuestionCommentsRepository()

    sut = new CommentOnQuestionUseCase(
      questionsRepository,
      questionCommentsRepository,
    )
  })

  it('should be able to comment on question', async () => {
    const question = QuestionFactory.make()
    await questionsRepository.create(question)

    const result = await sut.execute({
      questionId: question.id.toString(),
      authorId: question.authorId.toString(),
      content: faker.lorem.text(),
    })

    const success = isRight(result)
    expect(success).toBe(true)

    if (success) {
      expect(questionCommentsRepository.items[0]).toEqual(
        result.value.questionComment,
      )
    }
  })
})
