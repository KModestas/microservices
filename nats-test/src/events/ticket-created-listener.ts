import { Message } from 'node-nats-streaming';
import { Listener } from './base-listener';
import { TicketCreatedEvent } from './ticket-created-event';
import { Subjects } from './subjects';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  // readonly prevents the property from ever being changed e.g. you cant do this.subject = 'foo'
  readonly subject = Subjects.TicketCreated;
  queueGroupName = 'payments-service';

  onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    console.log('Event data!', data);

    // process the message....
    console.log(data.id);
    console.log(data.title);
    console.log(data.price);

    // acknowledge the message
    msg.ack();
  }
}
