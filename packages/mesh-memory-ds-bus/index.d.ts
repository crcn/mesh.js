declare module "mesh-memory-ds-bus" {
  import { Bus } from 'mesh';

  

  class MemoryDsBus extends Bus {
    static create():MemoryDsBus;
  }

  namespace MemoryDsBus {
  }

  export = MemoryDsBus;
}

