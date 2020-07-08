import BoolInput from "@core/Inputs/boolInput";
import TextInput from "@core/Inputs/textInput";
import React, { FC } from "react";
import { Col, Row } from "reactstrap";
import { useStyles } from "./styles";

export interface Filter {
    showToDo: boolean;
    showOnHold: boolean;
    showInProgress: boolean;
    showQACR: boolean;
    showDone: boolean;
    showDeployed: boolean;
    showCanceled: boolean;
    assignee: string;
}

export type FilterOnChange = (newFilter: Filter) => void;

export interface Props {
    filter: Filter;
    onChange: FilterOnChange;
}

const FilterPanel: FC<Props> = props => {
    const onChangeBool = (field: keyof Filter) => (value: boolean) => props.onChange({ ...props.filter, [field]: value });
    const onChangeString = (field: keyof Filter) => (value: string) => props.onChange({ ...props.filter, [field]: value });

    const classes = useStyles();

    return <div className={classes.wrapper}>
        <Row>
            <Col xs={4} className={classes.value}>
                <BoolInput placeholder="Show 'To Do'" value={props.filter.showToDo} onChangeForHook={onChangeBool("showToDo")} />
            </Col>
            <Col xs={4} className={classes.value}>
                <BoolInput placeholder="Show 'On Hold'" value={props.filter.showOnHold} onChangeForHook={onChangeBool("showOnHold")} />
            </Col>
            <Col xs={4} className={classes.value}>
                <BoolInput placeholder="Show 'In Progress'" value={props.filter.showInProgress} onChangeForHook={onChangeBool("showInProgress")} />
            </Col>
            <Col xs={4} className={classes.value}>
                <BoolInput placeholder={"Show 'QA & CodeReview'"} value={props.filter.showQACR} onChangeForHook={onChangeBool("showQACR")} />
            </Col>
            <Col xs={4} className={classes.value}>
                <BoolInput placeholder="Show 'Done'" value={props.filter.showDone} onChangeForHook={onChangeBool("showDone")} />
            </Col>
            <Col xs={4} className={classes.value}>
                <BoolInput placeholder="Show 'Deployed'" value={props.filter.showDeployed} onChangeForHook={onChangeBool("showDeployed")} />
            </Col>
            <Col xs={4} className={classes.value}>
                <BoolInput placeholder="Show 'Canceled'" value={props.filter.showCanceled} onChangeForHook={onChangeBool("showCanceled")} />
            </Col>
        </Row>
        <Row>
            <Col xs={4} className={classes.value}>
                <TextInput placeholder="Assignee" value={props.filter.assignee} onChangeForHook={onChangeString("assignee")} />
            </Col>
        </Row>
    </div>;
};

export default FilterPanel;