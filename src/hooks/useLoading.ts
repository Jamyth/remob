import { rootStore } from "../rootStore";

export function useLoading(identifier: string = "global") {
    return rootStore.loading.get(identifier);
}
