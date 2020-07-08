import FilterPanel, { Filter } from "@components/filterPanel";
import IssueTable from "@components/issueTable";
import { whyDidYouRender } from "@core/utils";
import { TasksSvcContext } from "@services/servicesProvider";
import React, { useContext, useEffect, useState } from "react";
import { Spinner } from "reactstrap";
import { Issue } from "src/models/task";
import { Props } from "./meta";
import useStyles from "./styles";

const Home: React.FunctionComponent<Props> = () => {
    const classes = useStyles();
    const { getAllIssuesInTheCurrentSprint } = useContext(TasksSvcContext);
    const [issues, setIssues] = useState<Issue[]>([]);
    const [loading, setLoading] = useState(true);

    const [filter, setFilter] = useState<Filter>({
        showToDo: false,
        showInProgress: false,
        showOnHold: false,
        showQACR: true,
        showDone: true,
        showDeployed: false,
        assignee: "",
    });

    useEffect(() => {
        (async () => {
            setIssues(await getAllIssuesInTheCurrentSprint());
            setLoading(false);
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (loading)
        return <Spinner className={classes.spinner} />;

    return <>
        <FilterPanel filter={filter} onChange={setFilter} />
        <IssueTable issues={issues} />
    </>;
};
whyDidYouRender(Home);

export default Home;
