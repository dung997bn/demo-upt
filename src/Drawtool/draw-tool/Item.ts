import Side from "./Side";

class Item {
    side: any = null
    item: any = null
    constructor(side: Side) {
        this.side = side
        this.item = null
    }

    toJSON() {
        return JSON.stringify(this.toObject());
    }

    toObject() {

        if (!this.item) return false;

        let data: any = {
            type: this.item.type,
            top: (this.item.top - this.side.FabricBorder.top) / this.side.cmSize.height,
            left: (this.item.left - this.side.FabricBorder.left) / this.side.cmSize.width,
            width: this.item.width / this.side.cmSize.width,
            height: this.item.height / this.side.cmSize.height,
            angle: this.item.angle,
            scale: this.item.scaleX,
            opacity: this.item.opacity
        }

        if (this.item.type === 'path') {
            data.fill = this.item.fill;
        }

        if (this.item.type === 'path-group') {
            data.typeSVG = this.item.typeSVG;
            data.fill = this.item.fill;
        }

        if (this.item.type === 'i-text') {
            data.fontFamily = this.item.fontFamily;
            data.fontStyle = this.item.fontStyle;
            data.fontWeight = this.item.fontWeight;
            data.fontSize = this.item.fontSize;
            data.textAlign = this.item.textAlign;
            data.fill = this.item.fill;
        }

        if (this.item.brush) {
            data.type = 'brush';
            data.fill = this.item.color;
        }

        return data;
    }
}

export default Item