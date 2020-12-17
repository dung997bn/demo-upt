import fabric from 'fabric';

let extend = fabric.fabric.util.object.extend;
let filters = fabric.fabric.Image.filters as any;
let createClass = fabric.fabric.util.createClass;

filters.RemoveColor = createClass(filters.BaseFilter, {

    type: 'RemoveColor',

    initialize: function (options: any) {
        options = options || {};

        this.color = options.color || '#ffffff';

        this.distance = options.distance === undefined ? 1 : Number(options.distance);

    },

    applyTo: function (canvasEl: any) {
        var context = canvasEl.getContext('2d'),
            imageData = context.getImageData(0, 0, canvasEl.width, canvasEl.height),
            data = imageData.data,
            color = new fabric.fabric.Color(this.color),
            threshold = 60,
            distance = this.distance,
            limit = 255 - threshold,
            r, g, b;

        for (var i = 0, len = data.length; i < len; i += 4) {
            r = data[i];
            g = data[i + 1];
            b = data[i + 2];

            if (
                // Math.abs(r - color.getSource ._source[0]) < distance &&
                // Math.abs(g - color._source[1]) < distance &&
                // Math.abs(b - color._source[2]) < distance
                Math.abs(r - color.getSource()[0]) < distance &&
                Math.abs(g - color.getSource()[1]) < distance &&
                Math.abs(b - color.getSource()[2]) < distance
            ) {
                data[i + 3] = 0;
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

(fabric.fabric.Image.filters as any).RemoveColor.fromObject = function (object: any) {
    return new (fabric.fabric.Image.filters as any).RemoveColor(object);
}
