import { If } from "@core/types";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

interface Props {
    text?: string;
    size?: number;
    className?: string;
}

const Loader: React.FunctionComponent<Props> = ({ text, size, className }) => {
    const style = React.useMemo(() => ({ fontSize: size }), [size]);
    return <>
        <FontAwesomeIcon className={className} icon={faSpinner} pulse style={style} />
        <If condition={!!text}>
            &nbsp;
            <span>{text}</span>
        </If>
    </>;
};
Loader.defaultProps = {
    size: 30,
};

export default Loader;