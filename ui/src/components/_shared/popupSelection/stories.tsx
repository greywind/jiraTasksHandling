import { useState } from "@storybook/addons";
import { storiesOf } from "@storybook/react";
import React from "react";
import PopupSelection from ".";

const items = [
    { value: "one", label: "one label" },
    { value: "two", label: "two label" },
    { value: "three", label: "three label" },
    { value: "four", label: "four label" },
];

storiesOf("PopupSelection", module)
    .add("default", () => {
        const [value, setValue] = useState("one");
        return <div style={{ padding: 100 }}>
            <PopupSelection value={value} items={items} onChange={setValue} />
        </div>;
    });
