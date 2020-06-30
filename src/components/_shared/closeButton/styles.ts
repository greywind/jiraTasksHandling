import { Props } from "./types";

const defaultSize = 20;
const styles = {
    closeButton: {
        width: (props: Props) => props.size || defaultSize,
        height: (props: Props) => props.size || defaultSize,
        stroke: "black",
    },
};
export default styles;