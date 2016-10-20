
declare module "mesh-remote-bus" {
  import { Bus } from 'mesh';


  interface IRemoteBusAdapter {
    send(data: any);
    addListener(listener: (data: any) => any);
  }

  class RemoteBus extends Bus {
    constructor(adapter: IRemoteBusAdapter, localBus: Bus, serializer?);
  }

  namespace RemoteBus { }

  export = RemoteBus;
}


