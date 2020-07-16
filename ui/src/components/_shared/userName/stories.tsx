import { useState } from "@storybook/addons";
import { storiesOf } from "@storybook/react";
import React from "react";
import { User } from "src/models/user";
import UserName from ".";

const mockUser: User = {
    avatar: "https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/5bf2aefeda94df18b4d49402/933207d7-065e-447e-a424-ec699f189868/16",
    displayName: "Sergey Brezitskiy",
};

storiesOf("UserName", module)
    .add("default", () => {
        return <div style={{ margin: 100, width: 200, border: "1px grey" }}>
            <UserName user={mockUser} />
        </div>;
    })
    .add("without avatar", () => {
        return <div style={{ margin: 100, width: 200, border: "1px grey" }}>
            <UserName user={{ ...mockUser, avatar: "" }} />
        </div>;
    });
