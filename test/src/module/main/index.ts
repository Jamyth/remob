import { Module, register, observable, Loading } from "remob";
import { Main } from "./Main";

interface KYCForm {
    companyName: string;
    address: string;
}

class MainModule extends Module<"MainModule"> {
    @observable
    isAppLoaded: boolean = false;
    @observable
    data: { list: number[] } | null = null;
    @observable
    kycForm: KYCForm = { companyName: "", address: "" };

    override async onEnter() {
        try {
            await this.sleep();
        } catch (error) {
            // Silence
        } finally {
            this.isAppLoaded = true;
        }
    }

    updateKYCForm(form: Partial<KYCForm>) {
        Object.assign(this.kycForm, form);
    }

    async loadMoreData() {
        await this.fetchData();
    }

    @Loading("table")
    private async fetchData() {
        await this.sleep();
        this.data = {
            list: Array.from({ length: 10 }, (_, i) => i + 1),
        };
    }

    private sleep() {
        return new Promise<void>((res) => setTimeout(res, 5000));
    }
}

export const mainStore = new MainModule("MainModule");
const mainModule = register(mainStore);
export const actions = mainModule.getActions();
export const mainContext = mainModule.getContext();
export const MainComponent = mainModule.attachLifecycle(Main);
