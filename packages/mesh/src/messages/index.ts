export interface IMessage {
  readonly type: string;
}

export class Message implements IMessage {
  constructor(readonly type: string) {
    
  }
}

export * from "./decorators";
export * from "./filters";