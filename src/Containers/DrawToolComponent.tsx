import { Component, ReactNode } from "react";
import DrawTool from "../Drawtool/draw-tool/DrawTool";

interface Props {
    colors:any
 }

interface State {
    node: ReactNode
};

class DrawToolComponent extends Component<Props, State>{
    state: State = {
        node: null
    };
    constructor(props: Props) {
        super(props)
    }

    componentDidMount() {
        DrawTool.initialize(this.state.node as HTMLElement, {});
    }

    render() {
        return (
            <div className="draw-tool" ref={(node) => { this.state.node = node; return node }} />
        );
    }

}

export default DrawToolComponent;