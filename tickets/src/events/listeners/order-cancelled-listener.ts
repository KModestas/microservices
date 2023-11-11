import { Listener, OrderCancelledEvent, Subjects } from '@rallycoding/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';

// 1. user cancels order via orderService api
// 2. orderCancelled event is published
// 3. ticketService is listening for this event (this file)
// 4. ticketService removes orderId to reflect the update in its DB
// 5. ticketService is responsible for publishing the update event since it's resposnible for updating its own resource (tickets)
// 6. other services interested in that event will be able to react to it

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id);

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    // set orderId as unefinded instead of null because apparently optional ?. values dont work so well with null in TS
    ticket.set({ orderId: undefined });
    await ticket.save();

    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      orderId: ticket.orderId,
      userId: ticket.userId,
      price: ticket.price,
      title: ticket.title,
      version: ticket.version,
    });

    msg.ack();
  }
}
