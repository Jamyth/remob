# React Hooks

## `useLoading(identifier?)`

For async task run in `action`, sometime we want to show a loading when the data is not ready yet, we can use `decorator` to wrap the action to tell `remob` to watch the execution of the action and return a boolean to show when the action is running.

We will talk more about `decorator` in [Decorators](./decorators.md)

```ts
// index.ts
import { Module, Loading, observable } from "remob";

class AsyncModule extends Module<"AsyncModule"> {
    @observable
    data: number[] | null = null;

    override async onEnter() {
        await this.fetchData();
    }

    @Loading("my-custom-load") // Remob will watch this action
    private async fetchData() {
        // async logic
    }
}

// ...
// ... register Module and export actions, etc.
// ...

// component.ts
import { useLoading, RemobUtil } from "remob";
import { useAsyncModuleState } from "./hooks";

export const Component = RemobUtil.observer("Component", () => {
    const data = useAsyncModuleState((state) => state.data);
    const loading = useLoading("my-custom-load");

    if (loading) {
        return <h1>Loading Data...</h1>;
    }

    return (
        <React.Fragment>
            {data?.map((_) => (
                <h1>{_}</h1>
            ))}
        </React.Fragment>
    );
});
```

## `useObjectKeyAction(setStateAction, objectKey)`

When dealing with object (e.g. form), it is quite troublesome if we create setState action for each field in the object.

First, let talk about how to design a good setState for objects.

```ts
// index.ts
interface Form {
    name: string;
    age: string;
    hobbies: string[];
}

class FormModule extends Module<"FormModule"> {
    @observable
    form: Form = {
        name: "",
        age: "",
        hobbies: [],
    };

    /// Bad
    setName(name: string) {
        this.form.name = name;
    }

    /// Bad
    setAge(age: string) {
        this.form.age = age;
    }

    /// Bad
    setHobbies(hobbies: string[]) {
        this.form.hobbies = hobbies;
    }

    /// Good
    setForm(form: Partial<Form>) {
        Object.assign(this.form, form);
    }
}

// component.ts
import { useObjectKeyAction } from "remob";
import { actions } from "../index";

export const Component = RemobUtil.observer("Component", () => {
    const { name, age } = useFormModuleState((state) => state.form);

    const updateName = useObjectKeyAction(actions.setForm, "name");
    const updateAge = useObjectKeyAction(actions.setForm, "age");

    return (
        <div>
            {/** BAD */}
            <input value={name} onChange={(e) => actions.setName(e.target.value)} />
            {/** BAD */}
            <input value={age} onChange={(e) => actions.setAge(e.target.value)} />
            {/** GOOD */}
            <input value={name} onChange={(e) => updateName(e.target.value)} />
            {/** GOOD */}
            <input value={age} onChange={(e) => updateAge(e.target.value)} />
        </div>
    );
});
```
