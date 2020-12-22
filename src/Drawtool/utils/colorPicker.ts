import { fabric } from 'fabric';
import Side from '../draw-tool/Side';

class colorPicker {
    side: any
    _active: boolean
    _color: any
    cursor: any
    constructor(side: Side) {

        var that = this;

        this.side = side;

        this._active = false;

        this._color = '#000000';

        this.cursor = new fabric.Circle({
            left: 0,
            top: 0,
            radius: 20,
            strokeWidth: 3,
            stroke: '#ffffff',
            originX: 'center',
            originY: 'center',
            selectable: false,
            // excludeFromExport: true,
            evented: false,
            // shadow: new fabric.Shadow('2px 2px 10px rgba(0,0,0,0.2)'),
            lockUniScaling: true
        });

        return this;
    }

    set active(value) {
        this._active = value;
        if (value !== undefined && !value) {
            this.side.FabricCanvas.remove(this.cursor);
            this.side.items._collection.forEach((object: any) => object.selectable = !value);
            this.side.FabricCanvas.hoverCursor = 'all-scroll';
        } else if (value === true) {
            this.side.items._collection.forEach((object: any) => object.selectable = !value);
            this.side.FabricCanvas.hoverCursor = 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAAbFBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB0Iv+qAAAAJHRSTlMAz7bnBNm547yTjhD+697Hw7KJfcumoJJ2XCkYCvDBVElEMiHmZ6DLAAAAiElEQVQY023ORw6EMBQDUBMI6Y3ept//jqNILEKCl0//W8Zb9yjCxGgL7kd86DNX9wJIlWEXoc114Hdatygbmpqct6WS+waHdbvchjhE117lDROFJEiVymkAmEMapSs0diYixZUCVuAwqe6+YzJ+mCXRH6/CAeCb7ZVGAY3HNfNjQ+DIsjDK9z+4kgU9DvokHAAAAABJRU5ErkJggg=="), auto';
            // this.side.items.selected.deactivate();
        }
    }

    get active() {
        return this._active;
    }

    set color(color) {
        if (color !== undefined && color) {
            this._color = color;
            this.cursor.setFill(color);
        }
    }

    get color() {
        return this._color;
    }

    move(e: any) {
        // let pointer = this.side.FabricCanvas.getPointer(e.e);

        let absoluteOffset = e.e.target.getBoundingClientRect();
        let coord = {
            x: e.e.layerX || e.e.touches[0].clientX - absoluteOffset.left,
            y: e.e.layerY || e.e.touches[0].clientY - absoluteOffset.top
        };

        this.color = this.getColor(coord.x * window.devicePixelRatio, coord.y * window.devicePixelRatio);

        // this.side.FabricCanvas.remove(this.cursor);
        // this.side.FabricCanvas.add(this.cursor);
        // this.cursor.bringToFront();
        //
        // if(e.e.layerX < 50 || e.e.layerY < 50){
        //   this.cursor.top = pointer.y + 30;
        //   this.cursor.left = pointer.x + 30;
        // } else {
        //   this.cursor.top = pointer.y - 30;
        //   this.cursor.left = pointer.x - 30;
        // }
        //
        // this.side.FabricCanvas.renderAll()
    }

    getColor(x: any, y: any) {

        let px = this.side.FabricCanvas.contextContainer.getImageData(x, y, 1, 1).data;

        return '#' + new fabric.Color('rgb(' + px[0] + ', ' + px[1] + ', ' + px[2] + ')').toHex();
    }

};

export default colorPicker;
