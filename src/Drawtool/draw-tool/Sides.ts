import Side from "./Side";

class Sides {
  _collection = [] as Side[]
  selected: any = null
  constructor() {
    this._collection = [];
    this.selected = null;
  }

  addSide(id: any) {
    let newSide = new Side(id);
    this._collection.push(newSide);
    return newSide;
  }

  getSide(id: any) {
    return this._collection.find((side) => side.id === id) as Side;
  }

  removeSide(id: any) {
    let side = this._collection.find((side) => side.id === id);
    let index = this._collection.findIndex((side: Side) => side.id === id);

    if (!side) return false;

    side.FabricCanvas.clear();
    side.FabricCanvas = undefined;
    side.canvas.parentNode!.removeChild(side.canvas);

    this.selected = null;

    this._collection.splice(index, 1);

    return true;
  }

  select(id: any) {

    this.selected = this._collection.find((side) => side.id === id);

    if (!this.selected) {
      return false;
    }

    this._collection.forEach((side) => side.FabricCanvas.wrapperEl.style.display = 'none');
    this.selected.FabricCanvas.wrapperEl.style.display = 'block';

    return this.selected;

  }

  empty() {

    let collection = this._collection.map(side => side.id);

    collection.forEach(id => {
      this.removeSide(id);
    });

    return this._collection;
  }
}

export default Sides