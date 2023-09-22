import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  AnswerComment,
  AnswerCommentProps,
} from '@/domain/forum/enterprise/entities/answer-comment'

export class AnswerCommentFactory {
  private constructor() {}

  static make(override: Partial<AnswerCommentProps> = {}, id?: UniqueEntityID) {
    return AnswerComment.create(
      {
        authorId: new UniqueEntityID(),
        answerId: new UniqueEntityID(),
        content: faker.lorem.text(),
        ...override,
      },
      id,
    )
  }
}
