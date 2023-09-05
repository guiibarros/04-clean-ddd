import { QuestionFactory } from 'test/factories/question-factory'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'

import { Slug } from '../../enterprise/entities/value-objects/slug'
import { GetQuestionBySlugUseCase } from './get-question-by-slug'

let questionsRepository: InMemoryQuestionsRepository
let sut: GetQuestionBySlugUseCase

describe('Get question by slug', () => {
  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository()
    sut = new GetQuestionBySlugUseCase(questionsRepository)
  })

  it('should be able to get a question by slug', async () => {
    const newQuestion = QuestionFactory.make({
      slug: Slug.create('example-question'),
    })

    await questionsRepository.create(newQuestion)

    const { question } = await sut.execute({
      slug: 'example-question',
    })

    expect(question.id).toBeTruthy()
    expect(question.title).toEqual(newQuestion.title)
  })

  it('should not be able to get a non-existent question by slug', async () => {
    await expect(() =>
      sut.execute({
        slug: 'example-question',
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
