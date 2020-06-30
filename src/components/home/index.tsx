import React from "react";
import { Props } from "./meta";
import { whyDidYouRender } from "@core/utils";
import useStyles from "./styles";

const Home: React.FunctionComponent<Props> = () => {
    const classes = useStyles();
    return <div className={classes.divClass}>
        Hello, world!
    </div>;
};
whyDidYouRender(Home);

export default Home;
