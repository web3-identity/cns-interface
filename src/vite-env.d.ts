/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  readonly VITE_CoreSpaceRpcUrl: string;
  readonly VITE_MulticallContract: string;
  readonly VITE_ENS_REGISTRY: string;
  readonly VITE_REVERSE_REGISTRAR: string;
  readonly VITE_BASE_REGISTRAR: string;
  readonly VITE_STATIC_METADATA_SERVICE: string;
  readonly VITE_NAME_WRAPPER: string;
  readonly VITE_CFX_PRICE_ORACLE: string;
  readonly VITE_STABLE_ORACLE: string;
  readonly VITE_WEB3_CONTROLLER: string;
  readonly VITE_PUBLIC_RESOLVER: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

type OverWrite<T, U> = Omit<T, keyof U> & U;
type PartialOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
type PartialOmit<T, K extends keyof T> = Pick<T, K> & Partial<Omit<T, K>>;
type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
type XOR<T, U> = T | U extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U;
