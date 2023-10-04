import { QuestionAttachmentsFactory } from 'test/factories/question-attachments-factory'
import { QuestionFactory } from 'test/factories/question-factory'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'

import { isLeft } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { EditQuestionUseCase } from './edit-question'

let questionsRepository: InMemoryQuestionsRepository
let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: EditQuestionUseCase

describe('Edit question', () => {
  beforeEach(() => {
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    questionsRepository = new InMemoryQuestionsRepository(
      questionAttachmentsRepository,
    )

    sut = new EditQuestionUseCase(
      questionsRepository,
      questionAttachmentsRepository,
    )
  })

  it('should be able to edit a question', async () => {
    const question = QuestionFactory.make(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('question-1'),
    )

    await questionsRepository.create(question)

    questionAttachmentsRepository.items.push(
      QuestionAttachmentsFactory.make({
        questionId: question.id,
        attachmentId: new UniqueEntityID('1'),
      }),
      QuestionAttachmentsFactory.make({
        questionId: question.id,
        attachmentId: new UniqueEntityID('2'),
      }),
    )

    await sut.execute({
      questionId: 'question-1',
      authorId: 'author-1',
      title: 'Updated question',
      content: 'Updated question content',
      attachmentsIds: ['1', '3'],
    })

    expect(questionsRepository.items.at(0)).toMatchObject({
      title: 'Updated question',
      content: 'Updated question content',
    })

    expect(questionsRepository.items[0].attachments.items).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('3') }),
    ])
  })

  it('should not be able to edit a non-existent question', async () => {
    const result = await sut.execute({
      questionId: 'question-1',
      authorId: 'author-1',
      title: 'Updated question',
      content: 'Updated question content',
      attachmentsIds: [],
    })

    expect(isLeft(result)).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to edit a question from another author', async () => {
    const newQuestion = QuestionFactory.make(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('question-1'),
    )

    await questionsRepository.create(newQuestion)

    const result = await sut.execute({
      questionId: 'question-1',
      authorId: 'author-2',
      title: 'Updated question',
      content: 'Updated question content',
      attachmentsIds: [],
    })

    expect(isLeft(result)).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
