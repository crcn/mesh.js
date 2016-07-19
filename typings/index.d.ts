

declare module "mesh" {

  class Chunk {
    public done:boolean;
    public value:any;
  }
  
  class Writable {
    write(value:any);
    abort(reason:any);
    close();
  }

  class Readable {
    read():Promise<Chunk>;
    close():void;
    then(resolve:Function, reject:Function):Promise<any>;
    readAll():Promise<Array<any>>;
    pipeTo(writable:Writable);
  }

  export class Response extends Readable {
    constructor(writer:(Writable) => void);
    static create(writer:(Writable) => void);
  }

  export class BufferedResponse extends Readable {
    constructor(error:any, values:any);
    static create(error:any, values:any);
  }

  export class EmptyResponse extends Readable {
    constructor();
    static create():EmptyResponse;
  }

  export class WrapResponse extends Response {
    constructor(value:any);
    static create(value:any):WrapResponse;
  }
  
  export abstract class Bus {
    execute(action);
  }

  export class ParallelBus extends Bus {
    static create(busses:Array<Bus>):ParallelBus;
  }

  export class SequenceBus extends Bus {
    static create(busses:Array<Bus>):SequenceBus;
  }

  export class AcceptBus extends Bus {
    static create(filter:Function, resolveBus:Bus, rejectBus:Bus):AcceptBus;
  }

  export class NoopBus extends Bus {
    static create():NoopBus;
  }

  export class WrapBus extends Bus {
    static create(
      value: ((action, next) => void) | ((action) => Promise<any>|Response|any) | Bus  
    ):WrapBus;
  }
}
