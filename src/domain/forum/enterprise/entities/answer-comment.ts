import {
  CommentEntity,
  CommentEntityProps,
} from '@/core/entities/comment-entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface AnswerCommentProps extends CommentEntityProps {
  answerId: UniqueEntityID
}

export class AnswerComment extends CommentEntity<AnswerCommentProps> {
  get answerId() {
    return this.props.answerId
  }

  static create(props: AnswerCommentProps, id?: UniqueEntityID) {
    const answerComment = new AnswerComment(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return answerComment
  }
}
