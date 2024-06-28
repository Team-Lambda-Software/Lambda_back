import { HttpException } from "@nestjs/common"
import amqp, { ChannelWrapper } from "amqp-connection-manager"
import { Channel, ConfirmChannel, ConsumeMessage } from "amqplib"
import { IEventHandler } from "src/common/Application/event-handler/event-handler.interface"
import { IEventSubscriber } from "src/common/Application/event-handler/subscriber.interface"
import { DomainEvent } from "src/common/Domain/domain-event/domain-event"



export class RabbitEventBus implements IEventHandler{

    public static instance?: IEventHandler = undefined
    
    private constructor (){
        
    }

    public static getInstance(): IEventHandler {
        return this.instance = new RabbitEventBus()
    }

    async publish ( events: DomainEvent[] ): Promise<void>
    {
        try {
            const connection = amqp.connect([process.env.RABBITMQ_URL]);
            
            for (const event of events) {
                console.log('Publishing event:', event.eventName);
                const channelWrapper = connection.createChannel({
                    setup: (channel: Channel) => {
                      return channel.assertQueue(event.eventName, { durable: true });
                    },
                  });
                await channelWrapper.sendToQueue(
                    event.eventName,
                    Buffer.from(JSON.stringify(event)),
                    {
                        persistent: false,
                    },
                    );
              
            }
          } catch (error) {
            throw new HttpException(
              error.message,
              500,
            );
          }
    }
    
    async subscribe ( eventName: string, callback: ( event: DomainEvent ) => Promise<void> ): Promise<IEventSubscriber>
    {
        const connection = amqp.connect([process.env.RABBITMQ_URL]);
        const channel = connection.createChannel();
        await channel.assertQueue(eventName, { durable: true });
        await channel.consume(eventName, async (message) => {
            if (message) {
                const event = JSON.parse(message.content.toString());
                await callback(event);
                channel.ack(message);
            }
        },
        {
            noAck: false,
        });
        
        return {
            unsubscribe: async () => {
                
            }
        }
    }

}