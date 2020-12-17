import { fabric } from 'fabric';

let extend = fabric.util.object.extend;
let filters = fabric.Image.filters as any;
let createClass = fabric.util.createClass;

filters.ImageChangeColorAll = createClass(filters.BaseFilter, {

    type: 'ImageChangeColorAll',
    initialize: function (options: any) {
        options = options || {};
        this.color = options.color || '#ffffff';
        this.distance = options.distance === undefined ? 1 : Number(options.distance);
    },

    applyTo: function (canvasEl: any) {
        var context = canvasEl.getContext('2d'),
            imageData = context.getImageData(0, 0, canvasEl.width, canvasEl.height),
            data = imageData.data,
            color = new fabric.Color(this.color),
            threshold = 60,
            distance = this.distance,
            limit = 255 - threshold,
            r, g, b;
        r = color.getSource()[0];
        g = color.getSource()[1];
        b = color.getSource()[2];
        for (var i = 0, len = data.length; i < len; i += 4) {

            if (data[i + 3] != 0) {
                data[i] = r;
                data[i + 1] = g;
                data[i + 2] = b;
            }
        }
        context.putImageData(imageData, 0, 0);
    },

    toObject: function () {
        return extend(this.callSuper('toObject'), {
            color: this.color,
            distance: this.distance,
        });
    }
});

(fabric.Image.filters as any).ImageChangeColorAll.fromObject = function (object: any) {
    return new (fabric.Image.filters as any).ImageChangeColorAll(object);
}
