
declare module "mesh-socket-io-bus" {
  import { Bus } from 'mesh';

  interface RemoteBusAdapter {
    addListener(eventType:string, listener:Function);
    send(eventType:string, ...args:Array<any>);
  }

  class RemoteBus extends Bus {
    static create(adapter:RemoteBusAdapter, publicBus:Bus):RemoteBus;
  }

  namespace RemoteBusAdapter {
  }

  export = RemoteBusAdapter;
}

