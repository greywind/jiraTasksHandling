import FilterPanel, { Filter } from "@components/filterPanel";
import IssueTable from "@components/issueTable";
import { whyDidYouRender } from "@core/utils";
import { TasksSvcContext } from "@services/servicesProvider";
import React, { useContext, useEffect, useState, useMemo } from "react";
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
        showCanceled: false,
        assignee: "",
    });

    const filteredIssues = useMemo(() => {
        let result = issues;
        if (!filter.showToDo)
            result = result.filter(i => i.status !== "To Do");
        if (!filter.showInProgress)
            result = result.filter(i => i.status !== "In Progress");
        if (!filter.showOnHold)
            result = result.filter(i => i.status !== "On Hold");
        if (!filter.showQACR)
            result = result.filter(i => i.status !== "QA & Code Review");
        if (!filter.showDone)
            result = result.filter(i => i.status !== "Done");
        if (!filter.showDeployed)
            result = result.filter(i => i.status !== "Deployed");
        if (!filter.showCanceled)
            result = result.filter(i => i.status !== "Canceled");
        if (filter.assignee) {
            const lowercasedAssignee = filter.assignee.toLowerCase();
            result = result.filter(i =>
                i.assignee.toLowerCase().includes(lowercasedAssignee) ||
                i.cr?.assignee?.toLowerCase().includes(lowercasedAssignee) ||
                i.qa?.assignee.toLowerCase().includes(lowercasedAssignee)
            );
        }
        return result;
    }, [filter, issues]);

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
        <IssueTable issues={filteredIssues} />
    </>;
};
whyDidYouRender(Home);

export default Home;
