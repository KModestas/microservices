import { Message, Stan } from 'node-nats-streaming';
import { Subjects } from './subjects';

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Listener<T extends Event> {
  // abstract properties specify properties that should be defined by sub classes but dont exist themselved
  // use the generic type passed in to assign subject and data properties. e.g. TicketCreatedEvent.subject
  abstract subject: T['subject'];
  abstract onMessage(data: T['data'], msg: Message): void;
  abstract queueGroupName: string;
  private client: Stan;
  protected ackWait = 5 * 1000;

  constructor(client: Stan) {
    this.client = client;
  }

  // options are set by chaining methods
  subscriptionOptions() {
    return this.client
      .subscriptionOptions()
      // when this starts up, resend all events from the beginning of time (this will only ever run once if have setDurableName which we do. Then the durable subscription will be created and it will always pull from there)
      .setDeliverAllAvailable()
      // when durable name is set, Nats will keep track of all events that have been processed by this subscription and can will resend ones that have not been processed
      .setDurableName(this.queueGroupName)
      // by default all messages are ack'd as soon as they are sent. If an error occurs, the message is lost
      // we want to manually call ack(), if it times out, Nats will resend the message.
      .setManualAckMode(true)
      .setAckWait(this.ackWait)
  }

  listen() {
    const subscription = this.client.subscribe(
      // subject = channel name
      this.subject,
      // NOTE: if queue group name is not set then if all clients of a subscription go down, the durable subscription will be removed (and all events erased). 
      this.queueGroupName,
      this.subscriptionOptions()
    );

    subscription.on('message', (msg: Message) => {
      console.log(`Message received: ${this.subject} / ${this.queueGroupName}`);

      const parsedData = this.parseMessage(msg);
      this.onMessage(parsedData, msg);
    });
  }

  parseMessage(msg: Message) {
    const data = msg.getData();
    return typeof data === 'string'
      ? JSON.parse(data)
      // type buffer: (not used)
      : JSON.parse(data.toString('utf8'));
  }
}
