import { AnswerFactory } from 'test/factories/answer-factory'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { EditAnswerUseCase } from './edit-answer'

let answersRepository: InMemoryAnswersRepository
let sut: EditAnswerUseCase

describe('Edit answer', () => {
  beforeEach(() => {
    answersRepository = new InMemoryAnswersRepository()
    sut = new EditAnswerUseCase(answersRepository)
  })

  it('should be able to edit a answer', async () => {
    const newAnswer = AnswerFactory.make(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('answer-1'),
    )

    await answersRepository.create(newAnswer)

    await sut.execute({
      answerId: 'answer-1',
      authorId: 'author-1',
      content: 'Updated answer content',
    })

    expect(answersRepository.items.at(0)).toMatchObject({
      content: 'Updated answer content',
    })
  })

  it('should not be able to edit a non-existent answer', async () => {
    await expect(() =>
      sut.execute({
        answerId: 'answer-1',
        authorId: 'author-1',
        content: 'Updated answer content',
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should not be able to edit a answer from another author', async () => {
    const newAnswer = AnswerFactory.make(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('answer-1'),
    )

    await answersRepository.create(newAnswer)

    await expect(() =>
      sut.execute({
        answerId: 'answer-1',
        authorId: 'author-2',
        content: 'Updated answer content',
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
