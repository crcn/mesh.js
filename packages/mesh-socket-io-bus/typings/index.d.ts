
declare module "mesh-socket-io-bus" {
  import { Bus } from 'mesh';

  interface SocketIOConnection {
    on(eventType:string, listener:Function);
    emit(eventType:string, ...args:Array<any>);
  }

  export default class SocketIOBus extends Bus {
    static create({ connection:SocketIOConnection }, publicBus:Bus):SocketIOBus;
  }
}

