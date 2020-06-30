export type SimpleHandler = () => void;

/* eslint-disable @typescript-eslint/no-explicit-any */
export declare function Choose(props: { children: any }): any;
export declare function When(props: { condition: boolean; children: any }): any;
export declare function Otherwise(props: { children: any }): any;
export declare function If(props: { condition: boolean; children: any }): any;
export declare function For<T>(props: { each: string; of: Iterable<T>; index?: string; children: any }): any;
export declare function With(props: { [id: string]: any; children: any }): any;
