import FilterPanel, { Filter } from "@components/filterPanel";
import IssueTable from "@components/issueTable";
import { whyDidYouRender } from "@core/utils";
import { TasksSvcContext } from "@services/servicesProvider";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { Spinner } from "reactstrap";
import { Issue } from "src/models/task";
import { User } from "src/models/user";
import { Props } from "./meta";
import useStyles from "./styles";

const Home: React.FunctionComponent<Props> = () => {
    const classes = useStyles();
    const { getAllIssuesInTheCurrentSprint, getAllUsers } = useContext(TasksSvcContext);
    const [issues, setIssues] = useState<Issue[]>([]);
    const [users, setUsers] = useState<User[]>([]);
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
        const refreshIssues = async (): Promise<void> => {
            setIssues(await getAllIssuesInTheCurrentSprint());
            setLoading(false);
        };
        const interval = setInterval(refreshIssues, 5 * 60 * 1000);
        refreshIssues();
        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        (async () => {
            setUsers(await getAllUsers());
        })();
    }, [getAllUsers]);

    if (loading)
        return <Spinner className={classes.spinner} />;

    return <>
        <FilterPanel filter={filter} onChange={setFilter} />
        <IssueTable issues={filteredIssues} users={users} />
    </>;
};
whyDidYouRender(Home);

export default Home;
