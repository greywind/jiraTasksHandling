import React, { PureComponent } from "react";

interface Props {
    children: React.ReactNode;
}
interface State {
    hasError: boolean;
}
export default class ErrorBoundary extends PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = { hasError: false };
    }

    public componentDidCatch(): void {
        this.setState({ hasError: true });
    }

    public render(): React.ReactNode {
        if (this.state.hasError) return <h1>Oops, some error occurred</h1>;
        return this.props.children;
    }
}
