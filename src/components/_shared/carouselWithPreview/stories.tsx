import { storiesOf } from "@storybook/react";
import React from "react";
import CarouselWithPreview from ".";

const images = [
    "//placehold.it/800x400?text=1",
    "//placehold.it/800x400/555?text=2",
    "//placehold.it/800x400/333?text=3",
    "//placehold.it/800x400/777?text=4",
];
const children = images.map(i => <div key={i} style={{ height: "100%", background: `url(${i}) center no-repeat / cover` }} />);
storiesOf("CarouselWithPreview", module)
    .add("default", () =>
        <CarouselWithPreview>
            {children}
        </CarouselWithPreview>
    )
    .add("with controls", () =>
        <CarouselWithPreview controls>
            {children}
        </CarouselWithPreview>)
    .add("with configured controls", () =>
        <CarouselWithPreview controls={{ size: 30, gapToSide: 20 }}>
            {children}
        </CarouselWithPreview>)
    .add("with changed height", () =>
        <CarouselWithPreview height={40}>
            {children}
        </CarouselWithPreview>)
    .add("without gaps between slides", () =>
        <CarouselWithPreview gapBetweenItems={0}>
            {children}
        </CarouselWithPreview>)
    .add("with small preview", () =>
        <CarouselWithPreview sizeOfPreview="5%">
            {children}
        </CarouselWithPreview>);
