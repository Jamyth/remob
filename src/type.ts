import type { Module } from "./core/Module";
import type { Exception } from "./exception/Exception";

export interface TickIntervalDecoratorFlag {
    tickInterval?: number;
}

export interface ModuleLifecycleListener {
    onEnter(entryProps?: any): void;
    onDestroy(): void;
    onTick: (() => void) & TickIntervalDecoratorFlag;
}

export type ActionReturn = void | Promise<void>;

export interface ErrorListener {
    onError: ErrorHandler;
}

export type ActionHandler = (...args: any[]) => ActionReturn;
export type ErrorHandler = (exception: Exception) => ActionReturn;

export type ActionCreator<H> = H extends (...args: infer P) => ActionReturn ? (...args: P) => ActionReturn : never;
export type HandlerKeys<H> = { [K in keyof H]: H[K] extends ActionHandler ? K : never }[Exclude<
    keyof H,
    keyof ModuleLifecycleListener
>];
export type MutableActionCreators<H> = { [K in HandlerKeys<H>]: ActionCreator<H[K]> };
export type ActionCreators<H> = { readonly [K in keyof MutableActionCreators<H>]: MutableActionCreators<H>[K] };

type StoreKeys<H> = { [K in keyof H]: H[K] extends ActionHandler ? never : K }[Exclude<keyof H, keyof Module<any>>];
export type Store<H> = { readonly [K in StoreKeys<H>]: H[K] };
