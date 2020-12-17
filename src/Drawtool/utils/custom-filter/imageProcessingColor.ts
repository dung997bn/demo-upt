import fabric from 'fabric';

let extend = fabric.fabric.util.object.extend;
let filters = fabric.fabric.Image.filters as any;
let createClass = fabric.fabric.util.createClass;

filters.ImageProcessingColor = createClass(filters.BaseFilter, {

    type: 'ImageProcessingColor',
    arrayImage: [],
    arrayImageOutput: [],
    arrayImageMash: [],
    Histogram: [],
    Thr: 0,
    numberFillter: 0,
    width: 0,
    height: 0,

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

        this.ImageProcessing(canvasEl.width, canvasEl.height, data);
        var counter = 0;
        for (var i = 0, len = data.length; i < len; i += 4) {
            data[i] = color.getSource()[0];
            data[i + 1] = color.getSource()[1];
            data[i + 2] = color.getSource()[2];
            data[i + 3] = this.arrayImageOutput[counter];
            counter++;
        }
        context.putImageData(imageData, 0, 0);
    },
    ImageProcessing(width: any, height: any, imageData: any) {
        this.width = width;
        this.height = height;
        this.arrayImage = new Uint8Array(width * height);
        this.Histogram = new Uint32Array(256);
        this.arrayImageMash = new Uint8Array(width * height);
        var location = 0;
        var locationImage = 0;
        this.numberFillter = 0;
        // gray image
        for (var Y = 0; Y < height; Y++) {
            location = width * Y;
            locationImage = width * Y * 4;
            for (var X = 0; X < width; X++) {
                this.arrayImage[location] = (imageData[locationImage] + (imageData[locationImage + 1] << 1) + imageData[locationImage + 2]) >> 2;
                location++;
                locationImage += 4;
            }
        }
        this.GetHistGram();
        this.Thr = this.GetMinimumThreshold();
        if (this.CheckHistogram() > 2) {
            this.DoBinarizationMash();
            this.DoBinarization(this.Thr);
        }
        else {
            this.ProcessFilter()
        }

    },
    GetHistGram() {
        var location = 0;
        for (var Y = 0; Y < 256; Y++) this.Histogram[Y] = 0;
        for (var Y = 0; Y < this.height; Y++) {
            location = this.width * Y;
            for (var X = 0; X < this.width; X++) {
                this.Histogram[this.arrayImage[location]]++;
                location++;
            }
        }
    },
    CheckHistogram() {
        var Y = 0, Iter = 0, IterLow = 0;
        var J = 0;
        for (Y = 0; Y < 256; Y++) {
            if (this.Histogram[Y] > Iter) Iter = this.Histogram[Y];
            for (J = 0; J < Y; J++) {
                if ((this.Histogram[J] > IterLow) && (this.Histogram[J] < Iter)) IterLow = this.Histogram[J];
            }
        }
        var scaleHistogram = Iter / IterLow;
        return scaleHistogram;
    },
    GetMinimumThreshold() {
        var Y = 0, Iter = 0;
        var numberData = 0;

        for (Y = 0; Y < 256; Y++) {
            Iter = Iter + Y * this.Histogram[Y];
            numberData = numberData + this.Histogram[Y];
        }
        Iter = (Iter) / numberData / 2;

        return Iter;
    },
    DoBinarization(Threshold: any) {
        if (Threshold == -1) {
            //arrayImage  arrayImageOutput
            return Threshold;
        }
        var Width = this.width - 1, Height = this.height - 1;
        var loaction = 0;
        var diffValue = 0;
        var diffValueMash = 0;
        for (var Y = 0; Y < Height; Y++) {
            loaction = Y * this.width;
            for (var X = 1; X < Width; X++) {
                if (this.arrayImage[loaction] < Threshold) {
                    diffValue = 255;
                }
                else
                    diffValue = 0;
                diffValueMash = this.arrayImageMash[loaction];
                this.arrayImageOutput[loaction] = (diffValue & diffValueMash);
                loaction++;
            }
        }
    },
    DoBinarizationMash() {
        var Width = this.width - 1, Height = this.height - 1;
        var loaction = 0;
        var locationup = 0;
        var locationdown = 0;
        var difValue = 0;
        var caculator = 0;
        for (var Y = 1; Y < Height; Y++) {
            loaction = Y * this.width + 1;
            locationup = loaction - this.width;
            locationdown = loaction + this.width;
            for (var X = 1; X < Width; X++) {
                caculator = Math.abs(4 * this.arrayImage[loaction] - this.arrayImage[loaction + 1]
                    - this.arrayImage[loaction - 1] - this.arrayImage[locationup]
                    - this.arrayImage[locationdown]);

                if (caculator > 0) {
                    difValue = 255;
                }
                else
                    difValue = 0;
                this.arrayImageMash[loaction] = difValue;
                //arrayImageOutput[loaction] = (byte)difValue;
                loaction++;
                locationup = loaction - this.width;
                locationdown = loaction + this.width;
            }
        }
    },
    ProcessFilter() {
        // processing start and stop X,Y positions
        var startX = 1;
        var startY = 1;
        var stopX = this.width - 1;
        var stopY = this.height - 1;
        var g, max = 0;
        var loaction = 0;
        var locationup = 0;
        var locationdown = 0;
        // for each line
        for (var y = startY; y < stopY; y++) {
            // for each pixel

            loaction = y * this.width + 1;
            locationup = loaction - this.width;
            locationdown = loaction + this.width;
            for (var x = startX; x < stopX; x++) {
                g = Math.min(255,
                    Math.abs(this.arrayImage[locationup - 1] + this.arrayImage[locationup + 1]
                        - this.arrayImage[locationdown - 1] - this.arrayImage[locationdown + 1]
                        + 2 * (this.arrayImage[locationup] - this.arrayImage[locationdown]))
                    + Math.abs(this.arrayImage[locationup + 1] + this.arrayImage[locationdown + 1]
                        - this.arrayImage[locationup - 1] - this.arrayImage[locationdown - 1]
                        + 2 * (this.arrayImage[loaction] - this.arrayImage[loaction - 1])));

                if (g > max) max = g;
                this.arrayImageOutput[loaction] = g % 256;
                loaction++;
                locationup = loaction - this.width;
                locationdown = loaction + this.width;
            }
        }
    },

    toObject: function () {
        return extend(this.callSuper('toObject'), {
            color: this.color,
            distance: this.distance,
        });
    }
});

(fabric.fabric.Image.filters as any).ImageProcessingColor.fromObject = function (object: any) {
    return new (fabric.fabric.Image.filters as any).ImageProcessingColor(object);
}
