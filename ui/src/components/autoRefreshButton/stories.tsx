import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import React from "react";
import AutoRefreshButton from ".";

const refresh = async (): Promise<void> => action("refresh")();
const setLoading = action("setLoading");

storiesOf("AutoRefreshButton", module)
    .add("default", () => <AutoRefreshButton
        refresh={refresh}
        setLoading={setLoading}
        interval={50000}
    />);
