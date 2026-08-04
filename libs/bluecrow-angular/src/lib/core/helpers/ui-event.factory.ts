import { CommandType, EventFromCommand, UIEventMessage, UIEventPayload, DOMNodeMetadata } from '../types';

export function createUIEventMessage<TCmd extends CommandType>(
  command: TCmd,
  payload: UIEventPayload<EventFromCommand<TCmd>>,
  nodeTree: DOMNodeMetadata[] = []
): UIEventMessage<TCmd> {
  const eventName = command.replace(/^on::?/, '') as EventFromCommand<TCmd>;

  return {
    command,
    eventName,
    nodeTree,
    payload,
    timestamp: Date.now()
  };
}