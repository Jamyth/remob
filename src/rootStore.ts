import { observable } from "mobx";

class RootStore {
    @observable
    loading = observable.map({});

    setLoading(show: boolean, identifier: string = "global") {
        this.loading.set(identifier, show);
    }
}

export const rootStore = new RootStore();
