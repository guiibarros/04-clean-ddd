import { WatchedList } from './watched-list'

class NumberWatchedList extends WatchedList<number> {
  compareItems(a: number, b: number) {
    return a === b
  }
}

describe('Watched list', () => {
  it('should be able to create watched list with initial items', () => {
    const list = new NumberWatchedList([1, 2, 3])

    expect(list.items).toEqual([1, 2, 3])
  })

  it('should be able to add new items to the list', () => {
    const list = new NumberWatchedList([1, 2, 3])

    list.add(4)
    list.add(5)

    expect(list.items).toHaveLength(5)
    expect(list.newItems).toEqual([4, 5])
  })

  it('should be able to delete items from the list', () => {
    const list = new NumberWatchedList([1, 2, 3])

    list.remove(2)

    expect(list.items).toHaveLength(2)
    expect(list.removedItems).toEqual([2])
  })

  it('should be able to add an item even if it was removed before', () => {
    const list = new NumberWatchedList([1, 2, 3])

    list.remove(2)
    list.add(2)

    expect(list.items).toHaveLength(3)

    expect(list.removedItems).toHaveLength(0)
    expect(list.newItems).toHaveLength(0)
  })

  it('should be able to remove an item even if it was added before', () => {
    const list = new NumberWatchedList([1, 2, 3])

    list.add(4)
    list.remove(4)

    expect(list.items).toHaveLength(3)

    expect(list.removedItems).toHaveLength(0)
    expect(list.newItems).toHaveLength(0)
  })

  it('should be able to update watched list items', () => {
    const list = new NumberWatchedList([1, 2, 3])

    list.update([2, 4, 6])

    expect(list.items).toHaveLength(3)

    expect(list.newItems).toEqual([4, 6])
    expect(list.removedItems).toEqual([1, 3])
  })
})
