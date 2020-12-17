import { fabric } from 'fabric';

let extend = fabric.util.object.extend;
let filters = fabric.Image.filters as any;
let createClass = fabric.util.createClass;

filters.ChangeToCropPathProcessing = createClass(filters.BaseFilter, {

    type: 'ChangeToCropPathProcessing',

    initialize: function (options: any) {
        options = options || {};

        this.color = options.color || '#ffffff';

        this.distance = options.distance;

    },

    applyTo: function (canvasEl: any) {
        var context = canvasEl.getContext('2d');
        //    imageData = context.getImageData(0, 0, canvasEl.width, canvasEl.height),
        //    data = imageData.data;
        var width = canvasEl.width;
        var height = canvasEl.height;
        //	var lengPoint = Math.floor(data.length / 4);
        var xt = width - 1,
            yt = height - 1;
        context.beginPath();
        //"M0 0 L75 200 L225 200 Z"
        var pathS = "M";
        for (var i = 0; i < this.distance.length; i++) {
            if (this.distance[i].x < 0) this.distance[i].x = 0;
            else
                if (this.distance[i].x > xt) this.distance[i].x = xt;

            if (this.distance[i].y < 0) this.distance[i].y = 0;
            else
                if (this.distance[i].y > yt) this.distance[i].y = yt;
            //if(i==0)  pathS = pathS+  this.distance[i].x+" "+ this.distance[i].y +" ";
            //else  pathS = pathS+ "L"+  this.distance[i].x+" "+ this.distance[i].y +" ";
            if (i == 0) context.moveTo(this.distance[i].x, this.distance[i].y);
            else context.lineTo(this.distance[i].x, this.distance[i].y);
        }
        //pathS = pathS+ "L"+  this.distance[0].x+" "+ this.distance[0].y +"Z";
        context.lineTo(this.distance[0].x, this.distance[0].y);
        context.globalCompositeOperation = 'destination-in';
        //let p = new Path2D(pathS);
        context.closePath();
        context.fill();
        // reset
        context.globalCompositeOperation = 'source-over';


    },
    toObject: function () {
        return extend(this.callSuper('toObject'), {
            color: this.color,
            distance: this.distance,
        });
    }
});

(fabric.Image.filters as any).ChangeToCropPathProcessing.fromObject = function (object: any) {
    return new (fabric.Image.filters as any).ChangeToCropPathProcessing(object);
}
