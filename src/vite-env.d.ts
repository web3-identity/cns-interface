/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  readonly VITE_CoreSpaceRpcUrl: string;
  readonly VITE_RegisterUnit: '年' | '小时';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
  readonly MODE: 'web2-dev' | 'web3-dev' | 'web2-prod' | 'web3-prod';
}

type OverWrite<T, U> = Omit<T, keyof U> & U;
type PartialOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
type PartialOmit<T, K extends keyof T> = Pick<T, K> & Partial<Omit<T, K>>;
type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
type XOR<T, U> = T | U extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U;

declare module 'react-virtualized' {
  export type ListRowProps = { index: number; style: any; key: string };
}

declare module 'react-virtualized/dist/es/List' {
  const List: React.FC<any>;
  export default List;
}

declare module 'react-virtualized/dist/es/WindowScroller' {
  const WindowScroller: React.FC<{ scrollElement: Element; children: (props: any) => any }>;
  export default WindowScroller;
}

declare module 'react-virtualized/dist/es/WindowScroller/utils/dimensions' {
  export function getDimensions(props: any): any;
}

declare module 'react-virtualized/dist/es/AutoSizer' {
  const AutoSizer: React.FC<{ disableHeight: boolean; children: (props: any) => any }>;
  export default AutoSizer;
}

declare module 'cellar-js-sdk' {
  export const CellarEnv = { PRO: '', PRE: '', DEV: '' } as { PRO: string; PRE: string; DEV: string };
  export class Cellar {
    constructor(params: { appId: string; env: string }) {}
    request: (parms: any) => any;
  }
}
