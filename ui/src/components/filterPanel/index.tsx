import BoolInput from "@core/Inputs/boolInput";
import SelectInput from "@core/Inputs/selectInput";
import { OptionType } from "@core/Inputs/types";
import UserName from "@shared/userName";
import React, { FC, useCallback, useMemo } from "react";
import { Col, Row } from "reactstrap";
import { User } from "src/models/user";
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
    users: User[];
}

const FilterPanel: FC<Props> = props => {
    const onChangeBool = (field: keyof Filter, value: boolean): void => props.onChange({ ...props.filter, [field]: value });
    const onChangeString = (field: keyof Filter, value: string): void => props.onChange({ ...props.filter, [field]: value });

    const usersAsOptions = useMemo(() => props.users?.map<OptionType>(u => ({ label: <UserName user={u} />, value: u.accountId })) || [], [props.users]);
    const filterUsersOptions = useCallback((opt: OptionType, rawInput: string) => {
        const user = props.users.find(u => u.accountId == opt.value);
        return user.displayName.toLowerCase().includes(rawInput.toLowerCase());
    }, [props.users]);

    const classes = useStyles();

    return <div className={classes.wrapper}>
        <Row>
            <Col xs={3} className={classes.value}>
                <BoolInput placeholder="Show 'To Do'" value={props.filter.showToDo} name="showToDo" onChange={onChangeBool} />
            </Col>
            <Col xs={3} className={classes.value}>
                <BoolInput placeholder="Show 'On Hold'" value={props.filter.showOnHold} name="showOnHold" onChange={onChangeBool} />
            </Col>
            <Col xs={3} className={classes.value}>
                <BoolInput placeholder="Show 'In Progress'" value={props.filter.showInProgress} name="showInProgress" onChange={onChangeBool} />
            </Col>
            <Col xs={3} className={classes.value}>
                <BoolInput placeholder={"Show 'QA & CodeReview'"} value={props.filter.showQACR} name="showQACR" onChange={onChangeBool} />
            </Col>
            <Col xs={3} className={classes.value}>
                <BoolInput placeholder="Show 'Done'" value={props.filter.showDone} name="showDone" onChange={onChangeBool} />
            </Col>
            <Col xs={3} className={classes.value}>
                <BoolInput placeholder="Show 'Deployed'" value={props.filter.showDeployed} name="showDeployed" onChange={onChangeBool} />
            </Col>
            <Col xs={3} className={classes.value}>
                <BoolInput placeholder="Show 'Canceled'" value={props.filter.showCanceled} name="showCanceled" onChange={onChangeBool} />
            </Col>
        </Row>
        <Row>
            <Col className={classes.value}>
                <SelectInput placeholder="Assignee" name="assignee" multi value={props.filter.assignee} onChange={onChangeString} options={usersAsOptions} filterOption={filterUsersOptions} />
            </Col>
        </Row>
    </div>;
};

export default FilterPanel;