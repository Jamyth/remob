import React from "react";
import { ErrorUtil } from "../util/ErrorUtil";
import { SpecifiedExceptionType } from "../exception/SpecifiedExceptionType";
import type { Exception } from "../exception/Exception";

interface Props {
    render: (exception: Exception) => React.ReactElement | null;
    children?: React.ReactNode;
}

interface State {
    exception: Exception | null;
}

export class ErrorBoundary extends React.PureComponent<Props, State> {
    static defaultProps: Pick<Props, "render"> = { render: () => null };

    constructor(props: Props) {
        super(props);
        this.state = {
            exception: null,
        };
    }

    override componentDidCatch(error: Error) {
        const exception = ErrorUtil.captureError(error, SpecifiedExceptionType.ERROR_BOUNDARY);
        this.setState({ exception });
    }

    render() {
        return this.state.exception ? this.props.render(this.state.exception) : this.props.children || null;
    }
}
