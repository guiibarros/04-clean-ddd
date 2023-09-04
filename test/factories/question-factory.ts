import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Question,
  QuestionProps,
} from '@/domain/forum/enterprise/entities/question'

export class QuestionFactory {
  private constructor() {}

  static make(override: Partial<QuestionProps> = {}) {
    return Question.create({
      authorId: new UniqueEntityID(),
      title: 'Example',
      content: 'Example content',
      ...override,
    })
  }
}
