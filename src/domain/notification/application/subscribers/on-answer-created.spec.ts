import { AnswerFactory } from 'test/factories/answer-factory'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'

import { OnAnswerCreated } from './on-answer-created'

let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let answersRepository: InMemoryAnswersRepository

describe('On answer created', () => {
  beforeEach(() => {
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    answersRepository = new InMemoryAnswersRepository(
      answerAttachmentsRepository,
    )
  })

  it('should send a notification when an answer is created', async () => {
    const _ = new OnAnswerCreated()

    const answer = AnswerFactory.make()

    await answersRepository.create(answer)
  })
})
