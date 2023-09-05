import { QuestionFactory } from 'test/factories/question-factory'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { DeleteQuestionUseCase } from './delete-question'

let questionsRepository: InMemoryQuestionsRepository
let sut: DeleteQuestionUseCase

describe('Delete question', () => {
  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository()
    sut = new DeleteQuestionUseCase(questionsRepository)
  })

  it('should be able to delete a question', async () => {
    const newQuestion = QuestionFactory.make(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('question-1'),
    )

    await questionsRepository.create(newQuestion)

    await sut.execute({
      questionId: 'question-1',
      authorId: 'author-1',
    })

    expect(questionsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a non-existent question', async () => {
    await expect(() =>
      sut.execute({
        questionId: 'question-1',
        authorId: 'author-1',
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should not be able to delete a question from another author', async () => {
    const newQuestion = QuestionFactory.make(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('question-1'),
    )

    await questionsRepository.create(newQuestion)

    await expect(() =>
      sut.execute({
        questionId: 'question-1',
        authorId: 'author-2',
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
