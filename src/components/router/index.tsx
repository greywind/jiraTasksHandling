import Home from "@components/home";
import { whyDidYouRender } from "@core/utils";
import { useNavigation } from "@services/useNavigation";
import React, { Suspense } from "react";
import { Route, Switch } from "react-router-dom";
import Container from "reactstrap/lib/Container";

const Router: React.FunctionComponent = () => {
    const { links } = useNavigation();
    return (
        <>
            <Container>
                <Suspense fallback="Loading...">
                    <Switch>
                        <Route path={links.home} component={Home} exact />
                    </Switch>
                </Suspense>
            </Container>
        </>
    );
};

whyDidYouRender(Router);

export default Router;
