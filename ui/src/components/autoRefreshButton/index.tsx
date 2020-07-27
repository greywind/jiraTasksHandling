import React, { FC, useEffect, useRef, useState } from "react";
import { Button } from "reactstrap";

interface Props {
    refresh: () => Promise<void>;
    setLoading: (value: boolean) => void;
    interval: number;
    className?: string;
}

const internalInterval = 1000;
function msToMinutesAndSeconds(ms: number): string {
    const d = new Date(ms);
    return `${d.getUTCMinutes()}:${("0" + d.getUTCSeconds()).slice(-2)}`;
}

const AutoRefreshButton: FC<Props> = props => {
    const { refresh, setLoading } = props;

    const [millisecondsLeft, setMillisecondsLeft] = useState(0);
    const millisecondsLeftRef = useRef(millisecondsLeft);
    millisecondsLeftRef.current = millisecondsLeft;

    useEffect(() => {
        if (millisecondsLeft > 0)
            return;
        (async () => {
            await refresh();
            setLoading(false);
        })();
    }, [millisecondsLeft, refresh, setLoading]);
    useEffect(() => {
        const reduceMillisecondsLeft = async (): Promise<void> => {
            setMillisecondsLeft(millisecondsLeftRef.current <= 0 ? props.interval : millisecondsLeftRef.current - internalInterval);
        };
        reduceMillisecondsLeft();
        const interval = setInterval(reduceMillisecondsLeft, internalInterval);
        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.interval]);

    return <Button
        className={props.className}
        onClick={async () => {
            setLoading(true);
            await refresh();
            setLoading(false);
            setMillisecondsLeft(props.interval);
        }}
    >
        {`Refresh now (${msToMinutesAndSeconds(millisecondsLeft)})`}
    </Button>;
};

export default AutoRefreshButton;