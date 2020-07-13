import { Choose, For, If, Otherwise, When } from "@core/types";
import tasksSvc from "@services/tasksSvc";
import classnames from "classnames";
import React, { FC, useCallback } from "react";
import { Button, Row } from "reactstrap";
import { Issue } from "src/models/task";
import useStyles from "./styles";
import { useForceRerender } from "@core/hooks";

declare const issue: Issue;
declare const i: number;

export interface Props {
    issues: Issue[];
}

const KeyLink: FC<Issue> = issue => <a href={issue.link}>
    {issue.issueKey}
</a>;

const IssueTable: FC<Props> = props => {
    const forceRerender = useForceRerender();

    const createQASubtask = useCallback(async (issue: Issue): Promise<void> => {
        if (issue.qa)
            return;
        const qa = await tasksSvc.createQASubtask(issue);
        issue.qa = qa;
        forceRerender();
    }, [forceRerender]);
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
                    {issue.assignee}
                </div>
                <div className={classes.status}>
                    {issue.status}
                </div>
                <div className={classes.cr}>
                    <If condition={!!issue.cr}>
                        <KeyLink {...issue.cr} />
                        <div>
                            {issue.cr.assignee}
                        </div>
                        <div>
                            {issue.cr.status}
                        </div>
                    </If>
                </div>
                <div className={classes.qa}>
                    <Choose>
                        <When condition={!!issue.qa}>
                            <KeyLink {...issue.qa} />
                            <div>
                                {issue.qa.assignee}
                            </div>
                            <div>
                                {issue.qa.status}
                            </div>
                        </When>
                        <Otherwise>
                            <Button onClick={() => createQASubtask(issue)}>Create QA</Button>
                        </Otherwise>
                    </Choose>
                </div>
            </Row>
        </For>
    </>;
};

export default IssueTable;