import { AnswerAttachmentsFactory } from 'test/factories/answer-attachments-factory'
import { AnswerFactory } from 'test/factories/answer-factory'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'

import { isLeft } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { DeleteAnswerUseCase } from './delete-answer'

let answersRepository: InMemoryAnswersRepository
let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository

let sut: DeleteAnswerUseCase

describe('Delete answer', () => {
  beforeEach(() => {
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    answersRepository = new InMemoryAnswersRepository(
      answerAttachmentsRepository,
    )

    sut = new DeleteAnswerUseCase(answersRepository)
  })

  it('should be able to delete a answer', async () => {
    const answer = AnswerFactory.make(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('answer-1'),
    )

    await answersRepository.create(answer)

    answerAttachmentsRepository.items.push(
      AnswerAttachmentsFactory.make({
        answerId: new UniqueEntityID('answer-1'),
      }),
      AnswerAttachmentsFactory.make({
        answerId: new UniqueEntityID('answer-1'),
      }),
    )

    await sut.execute({
      answerId: 'answer-1',
      authorId: 'author-1',
    })

    expect(answersRepository.items).toHaveLength(0)
    expect(answerAttachmentsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a non-existent answer', async () => {
    const result = await sut.execute({
      answerId: 'answer-1',
      authorId: 'author-1',
    })

    expect(isLeft(result)).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to delete a answer from another author', async () => {
    const answer = AnswerFactory.make(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('answer-1'),
    )

    await answersRepository.create(answer)

    const result = await sut.execute({
      answerId: 'answer-1',
      authorId: 'author-2',
    })

    expect(isLeft(result)).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
