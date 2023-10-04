import { NotificationFactory } from 'test/factories/notification-factory'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'

import { isLeft, isRight } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'

import { ReadNotificationUseCase } from './read-notification'

let notificationsRepository: InMemoryNotificationsRepository
let sut: ReadNotificationUseCase

describe('Read notification', () => {
  beforeEach(() => {
    notificationsRepository = new InMemoryNotificationsRepository()
    sut = new ReadNotificationUseCase(notificationsRepository)
  })

  it('should be able to read a notification', async () => {
    const notification = NotificationFactory.make()

    notificationsRepository.create(notification)

    const result = await sut.execute({
      recipientId: notification.recipientId.toString(),
      notificationId: notification.id.toString(),
    })

    expect(isRight(result)).toBe(true)
    expect(notificationsRepository.items[0].readAt).toEqual(expect.any(Date))
  })

  it('should not be able to read a notification from another recipient', async () => {
    const notification = NotificationFactory.make({
      recipientId: new UniqueEntityID('recipient-1'),
    })

    await notificationsRepository.create(notification)

    const result = await sut.execute({
      notificationId: notification.id.toString(),
      recipientId: 'recipient-2',
    })

    expect(isLeft(result)).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
