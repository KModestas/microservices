import nats, { Stan } from 'node-nats-streaming';

class NatsWrapper {
  // client will be undefined until connect() is called
  private _client?: Stan;

  get client() {
    if (!this._client) {
      // if we try to access client before invoking connect()
      throw new Error('Cannot access NATS client before connecting');
    }

    return this._client;
  }

  connect(clusterId: string, clientId: string, url: string) {
    this._client = nats.connect(clusterId, clientId, { url });

    // wrap in promise to allow: await connect()
    return new Promise<void>((resolve, reject) => {
      this.client.on('connect', () => {
        console.log('Connected to NATS');
        resolve();
      });
      this.client.on('error', (err) => {
        reject(err);
      });
    });
  }
}

// export singleton instance (no need to worry about circular depedencies)
export const natsWrapper = new NatsWrapper();
