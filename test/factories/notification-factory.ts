import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Notification,
  NotificationProps,
} from '@/domain/notification/enterprise/entities/notification'

export class NotificationFactory {
  private constructor() {}

  static make(override: Partial<NotificationProps> = {}, id?: UniqueEntityID) {
    return Notification.create(
      {
        recipientId: new UniqueEntityID(),
        title: faker.lorem.sentence(4),
        content: faker.lorem.sentence(10),
        ...override,
      },
      id,
    )
  }
}
