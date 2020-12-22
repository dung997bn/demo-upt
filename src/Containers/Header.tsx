import { Component, ReactNode } from "react";
import DrawTool from "../Drawtool/draw-tool/DrawTool";

interface Props {

}

interface State {
    node: ReactNode
};

class HeaderComponent extends Component<Props, State>{


    render() {
        return (
            <div className="app-header">
                <h1>Header</h1>
            </div>
        );
    }
}

export default HeaderComponent;