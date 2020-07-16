import { For } from "@core/types";
import classnames from "classnames";
import React, { FC, ReactNode, useRef, useState } from "react";
import { useOnClickOutside } from "use-hooks";
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

    const styleProps: StyleProps = { showPopup };

    if (styleProps.showPopup && labelRef.current) {
        const rect = labelRef.current.getBoundingClientRect();
        styleProps.left = rect.left;
        styleProps.width = rect.width;
        styleProps.top = rect.top;
    }

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