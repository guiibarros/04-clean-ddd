import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Answer, AnswerProps } from '@/domain/forum/enterprise/entities/answer'

export class AnswerFactory {
  private constructor() {}

  static make(override: Partial<AnswerProps> = {}, id?: UniqueEntityID) {
    return Answer.create(
      {
        authorId: new UniqueEntityID(),
        questionId: new UniqueEntityID(),
        content: faker.lorem.text(),
        ...override,
      },
      id,
    )
  }
}
