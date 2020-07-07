import React, { useContext, useState, useEffect } from "react";
import { Props } from "./meta";
import { whyDidYouRender } from "@core/utils";
import useStyles from "./styles";
import { TasksSvcContext } from "@services/servicesProvider";
import { Issue } from "src/models/task";
import { Spinner } from "reactstrap";

const Home: React.FunctionComponent<Props> = () => {
    const classes = useStyles();
    const { getAllIssuesInTheCurrentSprint } = useContext(TasksSvcContext);
    const [tasks, setTasks] = useState<Issue[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            setTasks(await getAllIssuesInTheCurrentSprint());
            setLoading(false);
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (loading)
        return <Spinner className={classes.spinner} />;

    return <div className={classes.divClass}>
        Hello, world!
        {JSON.stringify(tasks)}
    </div>;
};
whyDidYouRender(Home);

export default Home;
