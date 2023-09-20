import {
  CommentEntity,
  CommentEntityProps,
} from '@/core/entities/comment-entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface QuestionCommentProps extends CommentEntityProps {
  questionId: UniqueEntityID
}

export class QuestionComment extends CommentEntity<QuestionCommentProps> {
  get questionId() {
    return this.props.questionId
  }

  static create(props: QuestionCommentProps, id?: UniqueEntityID) {
    const questionComment = new QuestionComment(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return questionComment
  }
}
