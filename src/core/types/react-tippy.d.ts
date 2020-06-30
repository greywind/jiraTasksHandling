declare module "react-tippy" {
    import React from "react";
    interface Props {
        position: "top" | "bottom" | "left" | "right";
        html?: React.ReactNode;
        title?: string;
    }
    export const Tooltip: React.ComponentType<Props>;
}