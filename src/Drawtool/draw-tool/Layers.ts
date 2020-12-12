import DrawTool from './DrawTool';
import Side from './Side';

class Layers {
    side: Side
    list: any
    constructor(side: Side) {
        this.side = side;
        this.list = null;
        this.update();
    }

    update() {
        let layers: any = [];

        let opt = {
            quality: 0.5,
            enableRetinaScaling: false
        };

        this.side.FabricCanvas.forEachObject((obj: any) => {
            if (!obj.excludeFromExport) {
                let clipto = obj.getClipTo();
                obj.setClipTo(null);
                layers.push({ index: obj.uuid, preview: obj.toDataURL(opt) });
                obj.setClipTo(clipto);
            }
        });
        this.list = layers;

        return layers;
    }

    _getItemsByIndex(indexes: any) {
        let objects = this.side.FabricCanvas.getObjects().filter((obj: any) => indexes.includes(obj.uuid));
        return objects;
    }

    // bringToFront(...indexes:any) {
    //     let items = this._getItemsByIndex(indexes);
    //     let offset = this.side.FabricCanvas.getObjects().filter(o => o.excludeFromExport).length;
    //     let newIndexes = [];

    //     items.forEach(item => {
    //         item.bringToFront();
    //         newIndexes.push({ uuid: item.uuid, index: this.side.FabricCanvas.getObjects().findIndex(o => o.uuid === item.uuid) - offset });
    //     });
    //     DrawTool.trigger('object:indexUpdate', JSON.stringify({ side: { id: this.side.id }, items: newIndexes }));
    //     DrawTool.trigger('history:update', { side: { id: this.side.id } });
    // }

    // bringForward(...indexes) {
    //     let items = this._getItemsByIndex(indexes);
    //     let offset = this.side.FabricCanvas.getObjects().filter(o => o.excludeFromExport).length;
    //     let newIndexes = [];

    //     items.forEach(item => {
    //         item.bringForward()
    //         newIndexes.push({ uuid: item.uuid, index: this.side.FabricCanvas.getObjects().findIndex(o => o.uuid === item.uuid) - offset });
    //     });
    //     DrawTool.trigger('object:indexUpdate', JSON.stringify({ side: { id: this.side.id }, items: newIndexes }));
    //     DrawTool.trigger('history:update', { side: { id: this.side.id } });
    // }

    // sendBackwards(...indexes) {
    //     let items = this._getItemsByIndex(indexes);
    //     let offset = this.side.FabricCanvas.getObjects().filter(o => o.excludeFromExport).length;
    //     let newIndexes = [];

    //     items.forEach(item => {
    //         item.sendBackwards()
    //         newIndexes.push({ uuid: item.uuid, index: this.side.FabricCanvas.getObjects().findIndex(o => o.uuid === item.uuid) - offset });
    //     });
    //     DrawTool.trigger('object:indexUpdate', JSON.stringify({ side: { id: this.side.id }, items: newIndexes }));
    //     DrawTool.trigger('history:update', { side: { id: this.side.id } });
    // }

    // sendToBack(...indexes) {
    //     let items = this._getItemsByIndex(indexes);
    //     let offset = this.side.FabricCanvas.getObjects().filter(o => o.excludeFromExport).length;
    //     let newIndexes = [];

    //     items.forEach(item => {
    //         item.sendToBack()
    //         newIndexes.push({ uuid: item.uuid, index: this.side.FabricCanvas.getObjects().findIndex(o => o.uuid === item.uuid) - offset });
    //     });
    //     DrawTool.trigger('object:indexUpdate', JSON.stringify({ side: { id: this.side.id }, items: newIndexes }));
    //     DrawTool.trigger('history:update', { side: { id: this.side.id } });
    // }


    // moveToIndex(data) {
    //     let item = this._getItemsByIndex(data.uuid)[0];

    //     if (!item) return;

    //     let offset = this.side.FabricCanvas.getObjects().filter(o => o.excludeFromExport).length;

    //     let oldIndex = this.side.FabricCanvas.getObjects().findIndex(o => o.uuid === item.uuid) - offset;
    //     let diff = data.index - oldIndex;

    //     if (diff > 0) {
    //         for (let i = 0; i < diff; i++) {
    //             item.bringForward();
    //         }
    //     } else if (diff < 0) {
    //         for (let i = 0; i > diff; i--) {
    //             item.sendBackwards();
    //         }
    //     }

    //     DrawTool.trigger('history:update', { side: { id: this.side.id } });
    // }

    // toVCenter(...indexes) {
    //     let items = this._getItemsByIndex(indexes);

    //     items.forEach(item => item.set('top', this.side.FabricBorder.top + this.side.FabricBorder.height / 2));
    //     this.side.FabricCanvas.renderAll();
    // }

    // toHCenter(...indexes) {
    //     let items = this._getItemsByIndex(indexes);

    //     items.forEach(item => {
    //         item.set('left', this.side.FabricBorder.left + this.side.FabricBorder.width / 2);
    //         this.side.FabricCanvas.trigger('object:modified', { target: item });
    //     });
    //     this.side.FabricCanvas.renderAll();
    // }

    // toLeft(...indexes) {
    //     let items = this._getItemsByIndex(indexes);

    //     items.forEach(item => {
    //         item.set('left', this.side.FabricBorder.left + (item.width * item.scaleX) / 2);
    //         this.side.FabricCanvas.trigger('object:modified', { target: item });
    //     });
    //     this.side.FabricCanvas.renderAll();
    // }

    // toRight(...indexes) {
    //     let items = this._getItemsByIndex(indexes);

    //     items.forEach(item => {
    //         item.set('left', this.side.FabricBorder.left + this.side.FabricBorder.width - (item.width * item.scaleX) / 2);
    //         this.side.FabricCanvas.trigger('object:modified', { target: item });
    //     });
    //     this.side.FabricCanvas.renderAll();
    // }

    // toTop(...indexes) {
    //     let items = this._getItemsByIndex(indexes);

    //     items.forEach(item => {
    //         item.set('top', this.side.FabricBorder.top + (item.height * item.scaleY) / 2);
    //         this.side.FabricCanvas.trigger('object:modified', { target: item });
    //     });
    //     this.side.FabricCanvas.renderAll();
    // }

    // toBottom(...indexes) {
    //     let items = this._getItemsByIndex(indexes);

    //     items.forEach(item => {
    //         item.set('top', this.side.FabricBorder.top + this.side.FabricBorder.height - (item.height * item.scaleY) / 2);
    //         this.side.FabricCanvas.trigger('object:modified', { target: item });
    //     });
    //     this.side.FabricCanvas.renderAll();
    // }

}
export default Layers;
