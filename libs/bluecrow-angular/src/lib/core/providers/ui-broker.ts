import { isDevMode } from "@angular/core";
import { IMessenger, MessageHandler, CommandType, UIEventMessage, SubscriptionToken } from "../types";

export class UIBrokerMessenger implements IMessenger {
  private readonly channels = new Map<
    string,
    Map<CommandType, Set<MessageHandler<any>>>
  >();

  public publish<TCmd extends CommandType>(
    channelId: string,
    message: UIEventMessage<TCmd>
  ): void {
    const channelCommands = this.channels.get(channelId);
    if (!channelCommands) return;

    const handlers = channelCommands.get(message.command);
    if (!handlers || handlers.size === 0) return;

    for (const handler of handlers) {
      try {
        handler(message);
      } catch (error) {
        console.error(`[UIBroker] Erro ao processar handler no canal "${channelId}":`, error);
      }
    }
  }

  public register<TCmd extends CommandType>(
    channelId: string,
    command: TCmd,
    handler: MessageHandler<UIEventMessage<TCmd>>
  ): SubscriptionToken {
    if (!this.channels.has(channelId)) {
      this.channels.set(channelId, new Map());
    }

    if (isDevMode()) {
      // console.log(`[UIBroker] Registrando handler para comando "${command}" no canal "${channelId}".`);
    }

    const channelCommands = this.channels.get(channelId)!;
    if (!channelCommands.has(command)) {
      channelCommands.set(command, new Set());
    }

    const handlers = channelCommands.get(command)!;
    handlers.add(handler);

    if (isDevMode()) {
      // console.log(`[UIBroker] Handler registrado com sucesso para comando "${command}" no canal "${channelId}". Total de handlers: ${handlers.size}.`);
    }

    return {
      unsubscribe: () => {
        handlers.delete(handler);
        if (handlers.size === 0) {
          channelCommands.delete(command);
        }
        if (channelCommands.size === 0) {
          this.channels.delete(channelId);
        }
      }
    };
  }

  public hasSubscribers(channelId: string, command?: CommandType): boolean {
    const channelCommands = this.channels.get(channelId);
    if (!channelCommands) return false;

    if (command) {
      const handlers = channelCommands.get(command);
      return !!handlers && handlers.size > 0;
    }

    return Array.from(channelCommands.values()).some((set) => set.size > 0);
  }

  public unregisterAll(channelId: string): void {
    this.channels.delete(channelId);
  }
}

export const broker = new UIBrokerMessenger();