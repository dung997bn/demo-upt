import { Component, ReactNode } from "react";
import DrawTool from "../Drawtool/draw-tool/DrawTool";
import Scrollbar from 'react-smooth-scrollbar'
interface Props {

}

interface State {

};

class ToolBarComponent extends Component<Props, State>{
    constructor(props: Props) {
        super(props)
        this.showDesign = this.showDesign.bind(this)
        this.applyDesign = this.applyDesign.bind(this)
    }
    showDesign() {

    }
    applyDesign() {

    }
    render() {
        return (
            <div className="toolbar-container">
                <div className="toolbar">
                    <Scrollbar>
                        <h1>ToolBar</h1>
                        <button onClick={() => this.showDesign()}>Show Design</button>
                        <button onClick={() => this.applyDesign()}>Apply Design</button>
                    </Scrollbar>
                </div>
            </div>
        );
    }
}

export default ToolBarComponent;