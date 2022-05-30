import React from "react";
import { RemobUtil, useLoading, useObjectKeyAction } from "remob";
import { useMainState } from "../hooks";
import { actions } from "../index";

const AccountComponent = RemobUtil.lazy(() => import("../../account"), "MainComponent");

export const Main = RemobUtil.observer("Main", () => {
    const isAppLoaded = useMainState((state) => state.isAppLoaded);
    const data = useMainState((state) => state.data);
    const loading = useLoading("table");

    const { companyName, address } = useMainState((state) => state.kycForm);

    const updateCompanyName = useObjectKeyAction(actions.updateKYCForm, "companyName");
    const updateAddress = useObjectKeyAction(actions.updateKYCForm, "address");

    React.useEffect(() => {
        console.info("hihihi");
    }, [loading]);

    return (
        <div>
            <h1>{!isAppLoaded ? "Loading" : "Main Module"}</h1>
            <div>Company Name</div>
            <input type="text" value={companyName} onChange={(e) => updateCompanyName(e.target.value)} />
            <div>Address</div>
            <input type="text" value={address} onChange={(e) => updateAddress(e.target.value)} />

            <button onClick={actions.loadMoreData}>Load Data</button>
            {
                <div>
                    {loading
                        ? "loading more data..."
                        : data?.list.map((_) => <h1 key={_}>{_}</h1>) ?? <span>No Data</span>}
                </div>
            }
            {/* <AccountComponent /> */}
        </div>
    );
});
