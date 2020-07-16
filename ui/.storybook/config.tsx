import localeSvc, { AvailableLocales } from "@core/services/localeSvc";
import { optionsKnob, withKnobs } from "@storybook/addon-knobs";
import { INITIAL_VIEWPORTS } from "@storybook/addon-viewport";
import { DecoratorFunction } from "@storybook/addons";
import { addDecorator, addParameters, configure } from "@storybook/react";
import { StoryFnReactReturnType } from "@storybook/react/dist/client/preview/types";
import whyDidYouRender from "@welldone-software/why-did-you-render";
import React from "react";
import "src/theme/bootstrap.scss";

const req = require.context("../src", true, /[/\\]stories\.tsx$/);
function loadStories() {
    req.keys().forEach(filename => req(filename));
}

const locales: { [key: string]: AvailableLocales } = {
    English: "en",
    Russian: "ru",
};

const withLocaleSelector: DecoratorFunction<StoryFnReactReturnType> = storyFn => {
    const locale = optionsKnob<AvailableLocales>("Locale", locales, "en", {
        display: "radio"
    });
    localeSvc.setLocale(locale);
    return storyFn();
};

addDecorator(withKnobs);
addDecorator(withLocaleSelector);
addParameters({ viewport: { viewports: INITIAL_VIEWPORTS } });
configure(loadStories, module);

whyDidYouRender(React);
