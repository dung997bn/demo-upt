import Item from "./Item";
import Side from "./Side";

class Items {
    side: any = null
    _collection = []
    selected: any = null
    constructor(side: Side) {
        this.side = side;
        this._collection = [];

        this.selected = new Item(this.side);
    }
}

export default Items