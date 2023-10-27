import { AggregateRoot } from '../entities/aggregate-root'
import { UniqueEntityID } from '../entities/unique-entity-id'
import { DomainEvent } from './domain-event'

type DomainEventCallback<T extends DomainEvent> = (event: T) => void

export class DomainEvents {
  private constructor() {}

  private static handlersMap: Record<string, DomainEventCallback<any>[]> = {}

  private static markedAggregates: AggregateRoot<unknown>[] = []

  public static markAggregateForDispatch(aggregate: AggregateRoot<unknown>) {
    const aggregateFound = !!this.findMarkedAggregateById(aggregate.id)

    if (!aggregateFound) {
      this.markedAggregates.push(aggregate)
    }
  }

  private static dispatchAggregateEvents(aggregate: AggregateRoot<unknown>) {
    aggregate.domainEvents.forEach((event) => this.dispatch(event))
  }

  private static removeAggregateFromMarkedDispatchList(
    aggregate: AggregateRoot<unknown>,
  ) {
    const index = this.markedAggregates.findIndex((item) =>
      item.equals(aggregate),
    )

    this.markedAggregates.splice(index, 1)
  }

  private static findMarkedAggregateById(id: UniqueEntityID) {
    return this.markedAggregates.find((item) => item.id.equals(id))
  }

  public static dispatchEventsForAggregate(id: UniqueEntityID) {
    const aggregate = this.findMarkedAggregateById(id)

    if (aggregate) {
      this.dispatchAggregateEvents(aggregate)
      aggregate.clearEvents()
      this.removeAggregateFromMarkedDispatchList(aggregate)
    }
  }

  public static register<T extends DomainEvent>(
    eventName: string,
    callback: DomainEventCallback<T>,
  ) {
    const wasEventRegisteredBefore = eventName in this.handlersMap

    if (!wasEventRegisteredBefore) {
      this.handlersMap[eventName] = []
    }

    this.handlersMap[eventName].push(callback)
  }

  public static clearHandlers() {
    this.handlersMap = {}
  }

  public static clearMarkedAggregates() {
    this.markedAggregates = []
  }

  private static dispatch(event: DomainEvent) {
    const eventName = event.constructor.name

    const isEventRegistered = eventName in this.handlersMap

    if (isEventRegistered) {
      const handlers = this.handlersMap[eventName]

      for (const handler of handlers) {
        handler(event)
      }
    }
  }
}
