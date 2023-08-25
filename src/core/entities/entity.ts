import { UniqueEntityID } from './unique-entity-id'

export class Entity<Props> {
  private readonly _id: UniqueEntityID

  protected readonly props: Props

  protected constructor(props: Props, id?: UniqueEntityID) {
    this.props = props
    this._id = id ?? new UniqueEntityID()
  }

  get id() {
    return this._id
  }
}
