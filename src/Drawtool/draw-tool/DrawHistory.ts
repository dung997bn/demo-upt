// import DrawTool from './DrawTool';

import DrawTool from "./DrawTool";

class DrawHistory {
    history: any = {}
    constructor() {
        this.history = {};
    }

    resetHistory() {
        this.history = {};
    }

    pushState(id: string) {

        if (typeof this.history[id] === 'undefined') {
            this.history[id] = {
                collection: [],
                currentIndex: 0
            };
        }

        let side = DrawTool.sides.getSide(id);
        let state = JSON.stringify(side.FabricCanvas.toObject(['brush', 'editable', 'vertical', 'color', 'typeSVG', 'pathIndex', 'fileContent', 'fileContentURL', 'typePaths', 'lastBorder']));
        this.history[id].collection = this.history[id].collection.slice(0, this.history[id].currentIndex + 1);
        this.history[id].collection.push(state);
        this.history[id].currentIndex = this.history[id].collection.length - 1;
    }

    // undo(id) {
    //     let side = DrawTool.sides.getSide(id);

    //     if (!this.history[id].collection.length) {
    //         this.history[id].currentIndex = 0;
    //         return false;
    //     }

    //     if (this.history[id].currentIndex <= 0) {
    //         this.history[id].currentIndex = 0;
    //         return false;
    //     }

    //     let state = this.history[id].collection[this.history[id].currentIndex - 1];
    //     this.history[id].currentIndex -= 1;

    //     side.loadFromJSON(state, side);

    //     DrawTool.trigger('history:undo', { currentIndex: this.history[id].currentIndex, next: this.history[id].currentIndex > 0 });
    //     side.setSelectableForDesign();
    // }

    // redo(id) {

    //     let side = DrawTool.sides.getSide(id);

    //     if (!this.history[id].collection.length) {
    //         return false;
    //     }

    //     if (this.history[id].currentIndex >= this.history[id].collection.length - 1) {
    //         return false;
    //     }

    //     let state = this.history[id].collection[this.history[id].currentIndex + 1];
    //     this.history[id].currentIndex += 1;

    //     side.loadFromJSON(state, side);

    //     DrawTool.trigger('history:redo', { currentIndex: this.history[id].currentIndex, next: this.history[id].currentIndex < this.history[id].collection.length - 1 });
    //     side.setSelectableForDesign();
    // }

}

export default DrawHistory;
