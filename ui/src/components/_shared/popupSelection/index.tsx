import { For } from "@core/types";
import classnames from "classnames";
import React, { FC, ReactNode, useEffect, useRef, useState } from "react";
import { useOnClickOutside, useWindowSize } from "use-hooks";
import useStyles, { StyleProps } from "./styles";

declare const item: PopupSelectionItem;

export interface PopupSelectionItem {
    value: string;
    label: ReactNode;
}
interface Props {
    value: string;
    items: PopupSelectionItem[];
    onChange: (value: string) => void;
}

const PopupSelection: FC<Props> = props => {
    const [showPopup, setShowPopup] = useState(false);
    const labelRef = useRef<HTMLDivElement>();
    const popupRef = useRef<HTMLDivElement>();

    const [styleProps, setStyleProps] = useState<StyleProps>({ showPopup });
    const ws = useWindowSize();

    useEffect(() => {
        if (!popupRef.current || !labelRef.current || !showPopup) {
            setStyleProps({ showPopup: false });
            return;
        }
        const labelRect = labelRef.current.getBoundingClientRect();
        popupRef.current.style.display = "flex";
        const popupRect = popupRef.current.getBoundingClientRect();
        popupRef.current.style.display = "";
        const _styleProps: StyleProps = {
            showPopup: true,
            left: labelRect.left,
            width: labelRect.width,
            top: Math.min(labelRect.top, ws.height - popupRect.height - 20),
        };
        setStyleProps(_styleProps);
    }, [showPopup, ws.height]);
    const classes = useStyles(styleProps);
    useOnClickOutside(popupRef, () => setShowPopup(false));

    return <>
        <div ref={labelRef} onClick={() => setShowPopup(true)} className={classes.value}>
            {props.items.find(it => it.value == props.value)?.label}
        </div>
        <div ref={popupRef} className={classes.popup}>
            <For each="item" of={props.items}>
                <div
                    key={item.value}
                    className={classnames(classes.item, { [classes.selected]: item.value == props.value })}
                    onClick={() => {
                        props.onChange(item.value);
                        setShowPopup(false);
                    }}
                >
                    {item.label}
                </div>
            </For>
        </div>
    </>;
};

export default PopupSelection;