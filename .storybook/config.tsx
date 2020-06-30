import { store } from "@core/redux";
import { actions as sharedStateActions } from "@core/sharedState/actions";
import { actions as sharedStateLocaleActions } from "@core/sharedState/locale/actions";
import "@core/sharedState/reducer";
import ThemeProvider from "@core/themeProvider";
import { optionsKnob, withKnobs } from "@storybook/addon-knobs";
import { INITIAL_VIEWPORTS } from "@storybook/addon-viewport";
import { DecoratorFunction } from "@storybook/addons";
import { addDecorator, addParameters, configure } from "@storybook/react";
import { StoryFnReactReturnType } from "@storybook/react/dist/client/preview/types";
import whyDidYouRender from "@welldone-software/why-did-you-render";
import React from "react";
import { Provider as ReduxProvider } from "react-redux";
import "src/custom.scss";

const req = require.context("../src", true, /[/\\]stories\.tsx$/);
function loadStories() {
    req.keys().forEach(filename => req(filename));
}

store.dispatch(sharedStateActions.update() as any);

const withTheme: DecoratorFunction<StoryFnReactReturnType> = storyFn =>
    <ThemeProvider>
        {storyFn()}
    </ThemeProvider>;

const withReduxProvider: DecoratorFunction<StoryFnReactReturnType> = storyFn =>
    <ReduxProvider store={store}>
        {storyFn()}
    </ReduxProvider>;

const locales = {
    "Hebrew": "he-IL",
    "English": "en-US",
    "Russian": "ru-RU",
    "Portuguese": "pt-PT",
};

const withLocaleSelector: DecoratorFunction<StoryFnReactReturnType> = storyFn => {
    const locale = optionsKnob("Locale", locales, "en-US", { display: "radio" });
    store.dispatch(sharedStateLocaleActions.setLocale(locale) as any);
    return storyFn();
}

addDecorator(withTheme);
addDecorator(withReduxProvider);
addDecorator(withKnobs);
addDecorator(withLocaleSelector);
addParameters({ viewport: { viewports: INITIAL_VIEWPORTS } });
configure(loadStories, module);

whyDidYouRender(React);