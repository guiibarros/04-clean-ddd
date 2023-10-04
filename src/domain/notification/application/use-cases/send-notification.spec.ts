import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'

import { isRight } from '@/core/either'

import { SendNotificationUseCase } from './send-notification'

let notificationsRepository: InMemoryNotificationsRepository
let sut: SendNotificationUseCase

describe('Send notification', () => {
  beforeEach(() => {
    notificationsRepository = new InMemoryNotificationsRepository()
    sut = new SendNotificationUseCase(notificationsRepository)
  })

  it('should be able to send a notification', async () => {
    const result = await sut.execute({
      recipientId: '1',
      title: 'Nova notificação',
      content: 'Conteúdo da notificação',
    })

    expect(isRight(result)).toBe(true)
    expect(notificationsRepository.items[0]).toEqual(result.value?.notification)
  })
})
