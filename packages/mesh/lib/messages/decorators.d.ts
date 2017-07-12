export declare const defineMessageMetadata: (name: string, value: any) => (messageClass: any) => any;
export declare const getMessageMetadata: (name: string, message: any) => any;
export declare const setMessageTarget: (family: string) => (messageClass: any) => any;
export declare const getMessageTarget: (message: any) => any;
export declare const getMessageVisitors: (message: any) => any;
export declare const addMessageVisitor: (...families: string[]) => (message: any) => void;
