import Home from "@components/home";
import Page1 from "@components/page1";
import Page2 from "@components/page2";
import { whyDidYouRender } from "@core/utils";
import { useNavigation } from "@services/useNavigation";
import classnames from "classnames";
import React, { Suspense, useCallback, useState } from "react";
import { Link, NavLink, Route, Switch } from "react-router-dom";
import Collapse from "reactstrap/lib/Collapse";
import Container from "reactstrap/lib/Container";
import Nav from "reactstrap/lib/Nav";
import Navbar from "reactstrap/lib/Navbar";
import NavbarBrand from "reactstrap/lib/NavbarBrand";
import NavbarToggler from "reactstrap/lib/NavbarToggler";
import { useHeaderStyles, useStyles } from "./styles";

const Header: React.FunctionComponent = () => {

    const { links, to } = useNavigation();
    const classes = useHeaderStyles();
    const [isOpen, setIsOpen] = useState(false);

    const invertCollapse = useCallback(() => setIsOpen(!isOpen), []);

    const logoClick = useCallback(() => to("home"), []);

    return <Navbar fixed="top" expand="sm" className={classes.container}>
        <Container>
            <NavbarBrand color="dark">
                <div onClick={logoClick} className={classnames(classes.navLink, classes.logo)}>
                    Logo
                </div>
            </NavbarBrand>
            <NavbarToggler onClick={invertCollapse} color="dark" />
            <Collapse isOpen={false} navbar>
                <Nav navbar color="dark">
                    <NavLink to={links.page1} className={classnames(classes.navLink)}>
                        Page1
                    </NavLink>
                    <NavLink to={links.page2.build("param")} className={classnames(classes.navLink)}>
                        Page2
                    </NavLink>
                </Nav>
            </Collapse>
        </Container>
    </Navbar>;
};

const Router: React.FunctionComponent = () => {
    const classes = useStyles();
    const { links } = useNavigation();
    return <>
        <Header />
        <Container className={classes.routerWrapper}>
            <Suspense fallback="Loading...">
                <Switch>
                    <Route path={links.home} component={Home} exact />
                    <Route path={links.page1} component={Page1} exact />
                    <Route path={links.page2.link} component={Page2} exact />
                </Switch>
            </Suspense>
        </Container>
    </>;
};

whyDidYouRender(Router);

export default Router;
