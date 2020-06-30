import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useMemo } from "react";
import { Tooltip } from "react-tippy";
import { Alert } from "reactstrap";
import { If } from "@core/types";
import { useSshFormContext } from "./sshFormContext";

export interface ErrorsMarkProps {
    pattern?: string;
}

const ErrorsMark: React.FunctionComponent<ErrorsMarkProps> = props => {
    const formMethods = useSshFormContext();
    var regex = new RegExp(props.pattern || ".*", "gi");
    const errors = Object.keys(formMethods.errors).filter(p => regex.test(p) && formMethods.errors[p].message);
    const htmlContent = useMemo(() => <Alert color="danger">{errors.join(",")}</Alert>, [errors]);
    return <>
        <If condition={!!errors.length}>
            <div className="errorMark">
                <Tooltip position="bottom" html={htmlContent}>
                    <FontAwesomeIcon icon={faExclamationCircle} color="#dc3545" size="lg" />
                </Tooltip>
            </div>
        </If>
    </>;
};

export default ErrorsMark;