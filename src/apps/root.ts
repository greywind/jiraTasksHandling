import Router from "@components/router";
import { init } from "@core/entryPoint";

const routes = [
    { path: "/", component: Router },
];

init("jiraTasksHandling", routes);

if (module.hot) {
    module.hot.accept();
}
