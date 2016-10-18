
declare module "mesh-remote-bus" {
  import { Bus } from 'mesh';

  import { IActor, Action } from "@tandem/common";

  interface IRemoteBusAdapter {
    send(data: any);
    addListener(listener: (data: any) => any);
  }

  class RemoteBus implements IActor {
    constructor(adapter: IRemoteBusAdapter, localBus: Bus);
    execute(action: Action): any;
  }

  namespace RemoteBus { }

  export = RemoteBus;
}


