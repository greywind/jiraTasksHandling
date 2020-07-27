import { unassignedUser } from "@services/tasksSvc";
import PopupSelection, { PopupSelectionItem } from "@shared/popupSelection";
import UserName from "@shared/userName";
import React, { FC, useCallback, useMemo } from "react";
import { User } from "src/models/user";

interface Props {
    user: User;
    availableUsers: User[];
    onChange: (value: User) => void;
}

const UserSelection: FC<Props> = props => {
    const { onChange } = props;
    const userItems = useMemo<PopupSelectionItem[]>(() => [
        { value: "unassigned", label: <UserName user={unassignedUser} /> },
        ...props.availableUsers.map<PopupSelectionItem>(u => ({ value: u.displayName, label: <UserName user={u} /> })),
    ], [props.availableUsers]);

    const onUsernameChanged = useCallback((value: string) => {
        const user = props.availableUsers.find(u => u.displayName == value);
        onChange(user || unassignedUser);
    }, [onChange, props.availableUsers]);

    return <PopupSelection
        value={props.user ? props.user.displayName : unassignedUser.displayName}
        items={userItems}
        onChange={onUsernameChanged}
    />;
};

export default UserSelection;