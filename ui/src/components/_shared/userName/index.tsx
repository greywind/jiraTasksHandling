import React, { FC } from "react";
import { User } from "src/models/user";
import { useStyles } from "./styles";

interface Props {
    user: User;
}

const UserName: FC<Props> = props => {
    const classes = useStyles();
    return <div className={classes.wrapper}>
        <img src={props.user.avatar} className={classes.image} />
        <div>
            {props.user.displayName}
        </div>
    </div>;
};

export default UserName;