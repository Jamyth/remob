import React from "react";
import type { ActionReturn } from "../type";

/**
 * Useful hook to extract a big setState action into smaller
 * e.g.
 * ```ts
 * // action
 * updateBigObject(data: Partial<{ name: string, age: number }>): void
 *
 * // usage
 * const updateName = useObjectKeyAction(action.updateBigObject, "name");
 * const updateAge = useObjectKeyAction(action.updateBigObject, "age");
 * ```
 */
export function useObjectKeyAction<T extends object, K extends keyof T>(
    actionCreator: (arg: T) => ActionReturn,
    key: K,
): (value: T[K]) => void {
    return React.useCallback((value: T[K]) => actionCreator({ [key]: value } as T), [actionCreator, key]);
}
