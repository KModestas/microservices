import { Listener, OrderCreatedEvent, Subjects } from '@rallycoding/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { expirationQueue } from '../../queues/expiration-queue';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const expiresAt = new Date(data.expiresAt).getTime()
    const currentTime = new Date().getTime();

    const delay = expiresAt - currentTime
    console.log('Waiting this many milliseconds to process the job:', delay);

    // add job to Bull that is processed by the queue after the delay
    await expirationQueue.add(
      {
        orderId: data.id,
      },
      {
        delay,
      }
    );

    msg.ack();
  }
}
