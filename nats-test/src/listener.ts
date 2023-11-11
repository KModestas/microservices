import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import { TicketCreatedListener } from './events/ticket-created-listener';

console.clear();

// each client that connects to NATS must have a unique ID so that they can be identified.
const clientId = randomBytes(4).toString('hex')

// stan is the client naming covention in Nats
const stan = nats.connect('ticketing', clientId, {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log('Listener connected to NATS');

  stan.on('close', () => {
    console.log('NATS connection closed!');
    process.exit();
  });

  new TicketCreatedListener(stan).listen();
});

// if this process dies we wants nats server to know about it so that it doesn't send us messages (if we had another instance running, messages will be sent there instead)
process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());
