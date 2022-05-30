import { rootStore } from "../rootStore";
import type { ModuleLifecycleListener, Store } from "../type";

export abstract class Module<ModuleName extends string> implements ModuleLifecycleListener {
    private readonly moduleName: ModuleName;

    constructor(moduleName: ModuleName) {
        this.moduleName = moduleName;
    }

    get name() {
        return this.moduleName;
    }

    get rootState(): Store<typeof rootStore> {
        return rootStore;
    }

    onEnter() {
        /**
         * Lifecycle Method
         */
    }

    onDestroy() {
        /**
         * Lifecycle Method
         */
    }

    onTick() {
        /**
         * Lifecycle Method
         */
    }
}
