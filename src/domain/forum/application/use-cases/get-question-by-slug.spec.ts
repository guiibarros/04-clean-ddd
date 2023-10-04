import { QuestionFactory } from 'test/factories/question-factory'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'

import { isLeft, isRight } from '@/core/either'

import { Slug } from '../../enterprise/entities/value-objects/slug'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { GetQuestionBySlugUseCase } from './get-question-by-slug'

let questionsRepository: InMemoryQuestionsRepository
let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: GetQuestionBySlugUseCase

describe('Get question by slug', () => {
  beforeEach(() => {
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    questionsRepository = new InMemoryQuestionsRepository(
      questionAttachmentsRepository,
    )

    sut = new GetQuestionBySlugUseCase(questionsRepository)
  })

  it('should be able to get a question by slug', async () => {
    const question = QuestionFactory.make({
      slug: Slug.create('example-question'),
    })

    await questionsRepository.create(question)

    const result = await sut.execute({
      slug: 'example-question',
    })

    const success = isRight(result)
    expect(success).toBe(true)

    if (success) {
      expect(result.value.question).toEqual(question)
    }
  })

  it('should not be able to get a non-existent question by slug', async () => {
    const result = await sut.execute({
      slug: 'example-question',
    })

    expect(isLeft(result)).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
