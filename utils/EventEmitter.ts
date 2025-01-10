export class EventEmitter<
  EventType extends string,
  EventsMap extends GenericEventsMap<EventType>,
> {
  listeners: Partial<{
    [Event in EventType]: Set<Listener<Event, EventsMap>>
  }> = {}
  addListener<Event extends EventType>(
    event: Event,
    listener: Listener<Event, EventsMap>,
  ) {
    if (!this.listeners[event]) {
      this.listeners[event] = new Set()
    }

    this.listeners[event]?.add(listener)
  }
  removeListener<Event extends EventType>(
    event: Event,
    listener: Listener<Event, EventsMap>,
  ) {
    this.listeners[event]?.delete(listener)
  }
  emit<Event extends EventType, L extends Listener<Event, EventsMap>>(
    event: Event,
    ...args: Parameters<L>
  ): void {
    this.listeners[event]?.forEach(listener => {
      listener(...args)
    })
  }
}

type GenericListener = (...args: any[]) => any

type GenericEventsMap<EventType extends string> = Record<
  EventType,
  GenericListener
>
export type Listener<
  Event extends string & keyof EventsMap,
  EventsMap extends GenericEventsMap<Event>,
> = EventsMap[Event]
