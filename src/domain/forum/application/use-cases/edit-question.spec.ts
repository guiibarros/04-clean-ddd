import { QuestionFactory } from 'test/factories/question-factory'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { EditQuestionUseCase } from './edit-question'

let questionsRepository: InMemoryQuestionsRepository
let sut: EditQuestionUseCase

describe('Edit question', () => {
  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository()
    sut = new EditQuestionUseCase(questionsRepository)
  })

  it('should be able to edit a question', async () => {
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
      title: 'Updated question',
      content: 'Updated question content',
    })

    expect(questionsRepository.items.at(0)).toMatchObject({
      title: 'Updated question',
      content: 'Updated question content',
    })
  })

  it('should not be able to edit a non-existent question', async () => {
    await expect(() =>
      sut.execute({
        questionId: 'question-1',
        authorId: 'author-1',
        title: 'Updated question',
        content: 'Updated question content',
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should not be able to edit a question from another author', async () => {
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
        title: 'Updated question',
        content: 'Updated question content',
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
