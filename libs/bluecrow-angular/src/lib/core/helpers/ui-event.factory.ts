import { CommandType, EventFromCommand, UIEventMessage, UIEventPayload, DOMNodeMetadata } from '../types';

/**
 * Builds a normalized UI event message from the command, payload, and DOM node tree.
 */
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