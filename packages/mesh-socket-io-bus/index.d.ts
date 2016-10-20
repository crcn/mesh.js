
declare module "mesh-socket-io-bus" {
  import { Bus } from 'mesh';

  interface SocketIOOptions {
    channel?: string;
    connection?: SocketIOConnection;
  }

  interface SocketIOConnection {
    on(eventType:string, listener:Function);
    emit(eventType:string, ...args:Array<any>);
  }

  class SocketIOBus extends Bus {
    constructor(options: SocketIOOptions, publicBus: Bus, serializer?);
    static create({ connection:SocketIOConnection }, publicBus:Bus):SocketIOBus;
  }

  namespace SocketIOBus {
  }

  export = SocketIOBus;
}

