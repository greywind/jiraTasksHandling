import configSvc from "./services/configSvc";
import ErrorBoundary from "@shared/errorBoundary";
import "@core/locale.common";
import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { v1 as uuid } from "uuid";
import "whatwg-fetch";
import Logger from "./log";
import { getAppVersion } from "./utils";
import wget from "./wget";
import localeSvc from "@core/services/localeSvc";
import "src/theme/bootstrap.scss";
import theme from "./jssTheme";
import { ThemeProvider } from "react-jss";
import { Container } from "reactstrap";
import ServicesProvider from "@services/servicesProvider";

declare let __DEV__: boolean;

interface EntryPointInitOptions {
  noStartupLogging?: boolean;
  customContainerClass?: string;
}

interface EntryPointRoute {
  redirectFrom?: string;
  to?: string;
  path?: string;
  name?: string;
  component?: React.FunctionComponent<unknown>;
  exact?: boolean;
}

export async function init(
  app: string,
  routes?: EntryPointRoute[],
  opt?: EntryPointInitOptions
): Promise<void> {
  await configSvc.init();
  opt = opt || {};
  routes = routes || [];
  const rayId = uuid();
  wget.rayId = rayId;
  Logger.setRayId(rayId);
  Logger.setReactApp(app);
  let startMetrica;
  if (!opt.noStartupLogging) {
    startMetrica = Logger.startLastingMetrica("start");
    // eslint-disable-next-line no-console
    console.log(`${app} ${getAppVersion()}`);
  }

  function logError(message: string, error: Error): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (error && (error as any).skipLoggingIfNotCatched) return;
    if (message && message.startsWith("Failed to register a ServiceWorker"))
      Logger.warning(message, { exception: error });
    else {
      Logger.error(message, {}, error);
    }
  }

  window.addEventListener("error", (errorEvent) => {
    // ignore errors from react source in DEV mode. To avoid duplicate errors
    // SEE: https://github.com/facebook/react/issues/10474
    if (errorEvent.filename.indexOf("react-dom.development.js") >= 0) {
      return true;
    }
    logError(errorEvent.message, errorEvent.error);
  });
  window.addEventListener("unhandledrejection", (event) => {
    logError(event.reason.message, event.reason);
  });
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      try {
        navigator.serviceWorker.register("/service-worker.js");
      } catch (e) {
        Logger.warning("failed to register service worker", { exception: e });
      }
    });
  }

  ReactDOM.render(
    <ErrorBoundary>
      <Suspense
        fallback={<div> {`${localeSvc.get("common").loading}...`} </div>}
      >
        <ThemeProvider theme={theme.current}>
          <ServicesProvider>
            <BrowserRouter>
              <>
                <ToastContainer />
                <Container fluid>
                  <Switch>
                    {routes
                      .filter((p) => !p.redirectFrom)
                      .map(({ path, name, component, exact }) => (
                        <Route
                          key={path}
                          {...{ path, name, component, exact }}
                        />
                      ))}
                    {routes
                      .filter((p) => !!p.redirectFrom)
                      .map(({ redirectFrom, to }) => (
                        <Redirect key={redirectFrom} to={to} />
                      ))}
                  </Switch>
                </Container>
              </>
            </BrowserRouter>
          </ServicesProvider>
        </ThemeProvider>
      </Suspense>
    </ErrorBoundary>,
    document.getElementById("root")
  );

  if (!opt.noStartupLogging) startMetrica.end();
}
