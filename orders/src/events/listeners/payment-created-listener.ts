import {
  Subjects,
  Listener,
  PaymentCreatedEvent,
  OrderStatus,
} from '@rallycoding/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/order';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId);

    if (!order) {
      throw new Error('Order not found');
    }

    order.set({
      status: OrderStatus.Complete,
    });
    await order.save();

    // NOTE: it would be best practice to emit a OrderUpdatedEvent just in case. In this app we know we dont need it but this should always be done to future proof the app and avoid out of sync data between services

    msg.ack();
  }
}
