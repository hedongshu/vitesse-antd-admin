// import type { ComponentPublicInstance, FunctionalComponent } from 'vue';
declare global {
  export type Writable<T> = {
    -readonly [P in keyof T]: T[P];
  }

  namespace JSX {
    // tslint:disable no-empty-interface
    type IntrinsicElements = Record<string, any>
    type IntrinsicAttributes = Record<string, any>
  }
}

// declare module 'vue' {
//   export type JSXComponent<Props = any> =
//     | { new (): ComponentPublicInstance<Props> }
//     | FunctionalComponent<Props>;
// }

interface ImportMetaEnv extends ViteEnv {
  __: unknown
}

declare interface ViteEnv {
  VITE_APP_TITLE: string
  VUE_APP_API_BASE_URL: string

}

declare type Nullable<T> = T | null
declare type NonNullable<T> = T extends null | undefined ? never : T
declare type Recordable<T = any> = Record<string, T>
type ReadonlyRecordable<T> = Readonly<Record<string, T>>
type Indexable<T = any> = Record<string, T>
declare type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
}
declare type TimeoutHandle = ReturnType<typeof setTimeout>
declare type IntervalHandle = ReturnType<typeof setInterval>

declare interface ChangeEvent extends Event {
  target: HTMLInputElement
}
