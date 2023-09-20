import { Entity } from './entity'
import { UniqueEntityID } from './unique-entity-id'

export interface CommentEntityProps {
  authorId: UniqueEntityID
  content: string
  createdAt: Date
  updatedAt?: Date
}

export abstract class CommentEntity<
  Props extends CommentEntityProps,
> extends Entity<Props> {
  get authorId() {
    return this.props.authorId
  }

  get content() {
    return this.props.content
  }

  set content(content: string) {
    this.props.content = content

    this.touch()
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  private touch() {
    this.props.updatedAt = new Date()
  }
}
