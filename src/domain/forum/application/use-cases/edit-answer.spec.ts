import { AnswerAttachmentsFactory } from 'test/factories/answer-attachments-factory'
import { AnswerFactory } from 'test/factories/answer-factory'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'

import { isLeft } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { EditAnswerUseCase } from './edit-answer'

let answersRepository: InMemoryAnswersRepository
let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository

let sut: EditAnswerUseCase

describe('Edit answer', () => {
  beforeEach(() => {
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    answersRepository = new InMemoryAnswersRepository(
      answerAttachmentsRepository,
    )

    sut = new EditAnswerUseCase(answersRepository, answerAttachmentsRepository)
  })

  it('should be able to edit a answer', async () => {
    const answer = AnswerFactory.make(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('answer-1'),
    )

    await answersRepository.create(answer)

    answerAttachmentsRepository.items.push(
      AnswerAttachmentsFactory.make({
        answerId: answer.id,
        attachmentId: new UniqueEntityID('1'),
      }),
      AnswerAttachmentsFactory.make({
        answerId: answer.id,
        attachmentId: new UniqueEntityID('2'),
      }),
    )

    await sut.execute({
      answerId: 'answer-1',
      authorId: 'author-1',
      content: 'Updated answer content',
      attachmentsIds: ['1', '3'],
    })

    expect(answersRepository.items.at(0)).toMatchObject({
      content: 'Updated answer content',
    })

    expect(answersRepository.items[0].attachments.items).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('3') }),
    ])
  })

  it('should not be able to edit a non-existent answer', async () => {
    const result = await sut.execute({
      answerId: 'answer-1',
      authorId: 'author-1',
      content: 'Updated answer content',
      attachmentsIds: [],
    })

    expect(isLeft(result)).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to edit a answer from another author', async () => {
    const newAnswer = AnswerFactory.make(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('answer-1'),
    )

    await answersRepository.create(newAnswer)

    const result = await sut.execute({
      answerId: 'answer-1',
      authorId: 'author-2',
      content: 'Updated answer content',
      attachmentsIds: [],
    })

    expect(isLeft(result)).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
