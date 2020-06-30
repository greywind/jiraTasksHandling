import Router from "@components/router";
import { init } from "@core/entryPoint";

const routes = [
    { path: "/", component: Router },
];

init("App: jiraTasksHandling", routes);

if (module.hot) {
    module.hot.accept();
}
