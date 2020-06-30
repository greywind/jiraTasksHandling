import { whyDidYouRender } from "@core/utils";
import { useNavigation } from "@services/useNavigation";
import React from "react";
import useLocale from "./locale";
import useStyles from "./styles";

interface QueryParams {
    param: string;
}

interface Props { }

const Page2: React.FunctionComponent<Props> = props => {
    const classes = useStyles(props);
    const l = useLocale();
    const { params } = useNavigation<QueryParams>();

    return <div className={classes.divClass}>
        parameter from route: {params.param}
    </div>;
};

whyDidYouRender(Page2);

export default Page2;
