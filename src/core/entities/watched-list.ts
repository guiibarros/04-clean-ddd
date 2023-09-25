export abstract class WatchedList<T> {
  private _currentItems: T[]
  private readonly _initial: readonly T[]
  private _new: T[]
  private _removed: T[]

  public get initialItems() {
    return this._initial
  }

  public get items() {
    return this._currentItems
  }

  private set items(items: T[]) {
    this._currentItems = items
  }

  public get newItems() {
    return this._new
  }

  private set newItems(items: T[]) {
    this._new = items
  }

  public get removedItems() {
    return this._removed
  }

  private set removedItems(items: T[]) {
    this._removed = items
  }

  constructor(initialItems?: T[]) {
    this._currentItems = initialItems || []
    this._initial = initialItems ? ([...initialItems] as const) : []
    this._new = []
    this._removed = []
  }

  protected abstract compareItems(a: T, b: T): boolean

  private isCurrentItem(item: T) {
    return this.items.some((currentItem) =>
      this.compareItems(item, currentItem),
    )
  }

  private isNewItem(item: T) {
    return this.newItems.some((newItem) => this.compareItems(item, newItem))
  }

  private isRemovedItem(item: T) {
    return this.removedItems.some((removedItem) =>
      this.compareItems(item, removedItem),
    )
  }

  private wasAddedInitially(item: T) {
    return this.initialItems.some((initialItem) =>
      this.compareItems(item, initialItem),
    )
  }

  private removeFromNew(item: T) {
    this.newItems = this.newItems.filter(
      (newItem) => !this.compareItems(item, newItem),
    )
  }

  private removeFromCurrent(item: T) {
    this.items = this.items.filter(
      (currentItem) => !this.compareItems(item, currentItem),
    )
  }

  private removeFromRemoved(item: T) {
    this.removedItems = this.removedItems.filter(
      (removedItem) => !this.compareItems(item, removedItem),
    )
  }

  public exists(item: T) {
    return this.isCurrentItem(item)
  }

  public add(item: T) {
    if (this.isRemovedItem(item)) {
      this.removeFromRemoved(item)
    }

    if (!this.isNewItem(item) && !this.wasAddedInitially(item)) {
      this.newItems.push(item)
    }

    if (!this.isCurrentItem(item)) {
      this.items.push(item)
    }
  }

  public remove(item: T) {
    this.removeFromCurrent(item)

    if (this.isNewItem(item)) {
      this.removeFromNew(item)

      return
    }

    if (!this.isRemovedItem(item)) {
      this.removedItems.push(item)
    }
  }

  public update(items: T[]) {
    const newItems = items.filter(
      (a) => !this.items.some((b) => this.compareItems(a, b)),
    )

    const removedItems = this.items.filter(
      (a) => !items.some((b) => this.compareItems(a, b)),
    )

    this.items = items
    this.newItems = newItems
    this.removedItems = removedItems
  }
}
