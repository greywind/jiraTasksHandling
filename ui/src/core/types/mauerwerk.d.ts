declare module "mauerwerk" {
    import React from "react";
    interface Props {
        data: any[];
        margin: number;
        keys: ((p: any) => any) | any;
        heights: ((p: any) => number) | number;
        columns: number;
        lockScroll: boolean;
    }
    export const Grid: React.ComponentType<Props>;
}