import React from "react";
import { whyDidYouRender } from "@core/utils";
import useLocale from "./locale";
import useStyles from "./styles";

interface Props { }

const Page1: React.FunctionComponent<Props> = props => {
    const classes = useStyles(props);
    const l = useLocale();

    return <div className={classes.divClass}>
        {l.propName}
    </div>;
};

whyDidYouRender(Page1);

export default Page1;
