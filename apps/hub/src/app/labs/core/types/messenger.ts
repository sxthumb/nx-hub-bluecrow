import { CommandType, MessageHandler, UIEventMessage } from './message';

export interface SubscriptionToken {
  unsubscribe(): void;
}

export interface IMessenger {
  publish<TCmd extends CommandType>(
    channelId: string,
    message: UIEventMessage<TCmd>
  ): void;

  register<TCmd extends CommandType>(
    channelId: string,
    command: TCmd,
    handler: MessageHandler<UIEventMessage<TCmd>>
  ): SubscriptionToken;

  hasSubscribers(channelId: string, command?: CommandType): boolean;

  unregisterAll(channelId: string): void;
}