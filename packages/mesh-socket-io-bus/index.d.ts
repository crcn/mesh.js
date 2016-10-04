
declare module "mesh-socket-io-bus" {
  import { Bus } from 'mesh';

  interface SocketIOOptions {
    channel?: string;
    client?: any;
  }

  interface SocketIOConnection {
    on(eventType:string, listener:Function);
    emit(eventType:string, ...args:Array<any>);
  }

  class SocketIOBus extends Bus {
    constructor(options?: SocketIOOptions);
    static create({ connection:SocketIOConnection }, publicBus:Bus):SocketIOBus;
  }

  namespace SocketIOBus {
  }

  export = SocketIOBus;
}

