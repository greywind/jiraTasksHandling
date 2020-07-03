import { useCarousel } from "@core/hooks";
import { For, If } from "@core/types";
import { whyDidYouRender } from "@core/utils";
import classnames from "classnames";
import React, { ReactNode, useEffect, useMemo } from "react";
import { createUseStyles } from "react-jss";
import { useSwipeable } from "react-swipeable";
import { Carousel, CarouselControl, CarouselItem } from "reactstrap";

declare let kid: ReactNode;
declare let i: number;

const jssValueToCssValue = (value: number | string): string =>
    typeof value === "string" ? value : `${value}px`;

export type CarouselWithPreviewPropsControls =
    | {
        size: string | number;
        gapToSide: string | number;
    }
    | {
        size: string | number;
        gapToSide: never;
    };

interface Props {
    height?: number;
    className?: string;
    controls?: boolean | CarouselWithPreviewPropsControls;
    sizeOfPreview?: number | string;
    gapBetweenItems?: number | string;
    interval?: number | string | boolean;
    activePageChanged?: (index: number) => void;
}
const useStyles = createUseStyles(
    {
        carouselItem: {
            height: (props: Props) => props.height,
            overflowX: "hidden",
        },
        mainItem: {
            position: "absolute",
            top: 0,
            bottom: 0,
            left: (props: Props) =>
                `calc(${jssValueToCssValue(props.sizeOfPreview)} + ${jssValueToCssValue(
                    props.gapBetweenItems
                )})`,
            right: (props: Props) =>
                `calc(${jssValueToCssValue(props.sizeOfPreview)} + ${jssValueToCssValue(
                    props.gapBetweenItems
                )})`,
        },
        prevItem: {
            position: "absolute",
            top: 0,
            bottom: 0,
            left: (props: Props) =>
                `calc(${jssValueToCssValue(
                    props.sizeOfPreview
                )} - 100% + 2*${jssValueToCssValue(
                    props.sizeOfPreview
                )} + 2*${jssValueToCssValue(props.gapBetweenItems)})`,
            right: (props: Props) =>
                `calc(100% - ${jssValueToCssValue(props.sizeOfPreview)})`,
        },
        nextItem: {
            position: "absolute",
            top: 0,
            bottom: 0,
            left: (props: Props) =>
                `calc(100% - ${jssValueToCssValue(props.sizeOfPreview)})`,
            right: (props: Props) =>
                `calc(${jssValueToCssValue(
                    props.sizeOfPreview
                )} - 100% + 2*${jssValueToCssValue(
                    props.sizeOfPreview
                )} + 2*${jssValueToCssValue(props.gapBetweenItems)})`,
        },
        carousel: {
            "& .carousel-control-next, & .carousel-control-prev": {
                width: (props: { controls: CarouselWithPreviewPropsControls }) => {
                    if (!props.controls?.gapToSide) return undefined;
                    const preparedSize =
                        typeof props.controls.size == "string"
                            ? props.controls.size
                            : `${props.controls.size}px`;
                    const preparedGap =
                        typeof props.controls.gapToSide == "string"
                            ? props.controls.gapToSide
                            : `${props.controls.gapToSide}px`;
                    return `calc(2 * ${preparedGap} + ${preparedSize})`;
                },
            },
            "& .carousel-control-next-icon, & .carousel-control-prev-icon": {
                width: (props: { controls: CarouselWithPreviewPropsControls }) =>
                    props.controls?.size ? props.controls.size : undefined,
                height: (props: { controls: CarouselWithPreviewPropsControls }) =>
                    props.controls?.size ? props.controls.size : undefined,
            },
        },
        container: {
            width: "100%",
        },
    },
    { name: "carouselWithPreview" }
);

const CarouselWithPreview: React.FunctionComponent<Props> = props => {
    const { activePageChanged } = props;
    const childrenArray = useMemo(() => React.Children.toArray(props.children), [
        props.children,
    ]);
    const { page, next, prev, animationStarted, animationEnded } = useCarousel(
        childrenArray.length
    );
    const classes = useStyles(props);
    const swipeHandlers = useSwipeable({
        onSwipedRight: prev,
        onSwipedLeft: next,
        trackMouse: true,
    });

    useEffect(() => {
        activePageChanged?.(page);
    }, [activePageChanged, page]);

    return (
        <div className={classes.container} {...swipeHandlers}>
            <Carousel
                className={classnames(classes.carousel, props.className)}
                next={next}
                previous={prev}
                activeIndex={page}
                onAnimationStart={animationStarted}
                onAnimationEnd={animationEnded}
                ride={props.controls ? undefined : "carousel"}
                interval={props.interval}
            >
                <For each="kid" index="i" of={childrenArray}>
                    <CarouselItem
                        key={i}
                        onAnimationStart={animationStarted}
                        onAnimationEnd={animationEnded}
                        className={classes.carouselItem}
                    >
                        <div className={classes.prevItem} onClick={prev}>
                            {childrenArray[i == 0 ? childrenArray.length - 1 : i - 1]}
                        </div>
                        <div className={classes.mainItem}>{kid}</div>
                        <div className={classes.nextItem} onClick={next}>
                            {childrenArray[i == childrenArray.length - 1 ? 0 : i + 1]}
                        </div>
                    </CarouselItem>
                </For>
                <If condition={!!props.controls}>
                    <CarouselControl
                        direction="prev"
                        directionText="Previous"
                        onClickHandler={prev}
                    />
                    <CarouselControl
                        direction="next"
                        directionText="Next"
                        onClickHandler={next}
                    />
                </If>
            </Carousel>
        </div>
    );
};
CarouselWithPreview.defaultProps = {
    height: 550,
    sizeOfPreview: "5%",
    gapBetweenItems: "2%",
};

whyDidYouRender(CarouselWithPreview);

export default CarouselWithPreview;
