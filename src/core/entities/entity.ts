import { randomUUID } from 'node:crypto'

export class Entity<Props> {
  private readonly _id: string

  protected readonly props: Props

  protected constructor(props: Props, id?: string) {
    this.props = props
    this._id = id ?? randomUUID()
  }

  get id() {
    return this._id
  }
}