import { useForceRerender } from "@core/hooks";
import { Choose, For, Otherwise, When } from "@core/types";
import { TasksSvcContext } from "@services/servicesProvider";
import UserName from "@shared/userName";
import UserSelection from "@shared/userSelection";
import classnames from "classnames";
import React, { FC, useCallback, useContext } from "react";
import { Button, Row } from "reactstrap";
import { Issue } from "src/models/task";
import { User } from "src/models/user";
import useStyles from "./styles";

declare const issue: Issue;
declare const i: number;

export interface Props {
    issues: Issue[];
    users: User[];
}

const KeyLink: FC<Issue> = issue => <a href={issue.link}>
    {issue.issueKey}
</a>;

const IssueTable: FC<Props> = props => {
    const forceRerender = useForceRerender();
    const { createQASubtask, createCRSubtask } = useContext(TasksSvcContext);

    const _createQASubtask = useCallback(async (issue: Issue): Promise<void> => {
        if (issue.qa)
            return;
        const qa = await createQASubtask(issue);
        issue.qa = qa;
        forceRerender();
    }, [createQASubtask, forceRerender]);
    const _createCRSubtask = useCallback(async (issue: Issue): Promise<void> => {
        if (issue.cr)
            return;
        const cr = await createCRSubtask(issue);
        issue.cr = cr;
        forceRerender();
    }, [createCRSubtask, forceRerender]);
    const classes = useStyles(props);

    return <>
        <Row className={classes.headerRow}>
            <div className={classnames(classes.numOrder, classes.header)}>
                #
            </div>
            <div className={classnames(classes.key, classes.header)}>
                Key
            </div>
            <div className={classnames(classes.title, classes.header)}>
                Summary
            </div>
            <div className={classnames(classes.assignee, classes.header)}>
                Assignee
            </div>
            <div className={classnames(classes.status, classes.header)}>
                Status
            </div>
            <div className={classnames(classes.cr, classes.header)}>
                CR
            </div>
            <div className={classnames(classes.qa, classes.header)}>
                QA
            </div>
        </Row>
        <For each="issue" index="i" of={props.issues}>
            <Row key={issue.id} className={classes.tableRow}>
                <div className={classes.numOrder}>
                    {i + 1}
                </div>
                <div className={classes.key}>
                    <KeyLink {...issue} />
                </div>
                <div className={classnames(classes.title, classes.alignedToTheLeft)}>
                    {issue.summary}
                </div>
                <div className={classes.assignee}>
                    <UserName user={issue.assignee} />
                </div>
                <div className={classes.status}>
                    {issue.status}
                </div>
                <div className={classes.cr}>
                    <Choose>
                        <When condition={!!issue.cr}>
                            <KeyLink {...issue.cr} />
                            <div className={classes.subtaskAssignee}>
                                <UserSelection user={issue.cr.assignee} availableUsers={props.users} onChange={user => { issue.cr.assignee = user; forceRerender(); }} />
                            </div>
                            <div>
                                {issue.cr.status}
                            </div>
                        </When>
                        <Otherwise>
                            <Button onClick={() => _createCRSubtask(issue)}>Create CR</Button>
                        </Otherwise>
                    </Choose>
                </div>
                <div className={classes.qa}>
                    <Choose>
                        <When condition={!!issue.qa}>
                            <KeyLink {...issue.qa} />
                            <div className={classes.subtaskAssignee}>
                                <UserSelection user={issue.qa.assignee} availableUsers={props.users} onChange={user => { issue.qa.assignee = user; forceRerender(); }} />
                            </div>
                            <div>
                                {issue.qa.status}
                            </div>
                        </When>
                        <Otherwise>
                            <Button onClick={() => _createQASubtask(issue)}>Create QA</Button>
                        </Otherwise>
                    </Choose>
                </div>
            </Row>
        </For>
    </>;
};

export default IssueTable;