import errors from "../utils/errors";
import escapeJSON from "../utils/escapeJSON";
import DrawHistory from "./DrawHistory";
import Side from "./Side";
import Sides from "./Sides";

let DrawTool = {
    editable: false,
    container: {
        target: document.body,
        size: {
            width: 0,
            height: 0
        }
    },
    modeSetup: {
        NOMAL: -1,
        EMBROIDER: 1,
        LASER: 3,
        MASK_LASER: 4,
        TAP_RIBBON: 5, //Type1(white, black, red, blue )   ?Tape Editor
        TAP_RIBBON_2EDIT: 6, //Type2(black, red, blue, gold, silver) ?Ribbon Editor
        DRAW3D: 20
    },
    uploadImageState: [],
    gridStep: 10,
    grid: {
        color: 'rgba(150, 150, 150, 0.1)',
        strokeWidth: 1
    },
    border: {
        color: 'rgba(100,200,200,1)',
        strokeWidth: 1,
        backgroundColor: 'rgba(150, 150, 150, 0.1)',
        strokeDashArray: [0, 0],
    },
    newColorPicked: null,

    _callbacks: {} as any,

    sides: new Sides(),
    history: new DrawHistory(),
    _evented: true,

    __data: {} as any,
    modeSpecialDrawEnable: -1,
    is_embroidery: false,
    embroider_able: false,
    capacity_uploadingAllImage: 0,
    _originalJson: {},

    _designBorders: [] as any[],
    _embroideryPaths: [],
    is_choosing: false,

    is_nail: false,

    is_mobile: false,
    is_data: [],
    is_sp_product: false,
    is_area_embroider: false,
    fonts: null,
    rasterizedText: null,
    modeToolDraw: null,
    //func
    initialize(target: HTMLElement, size: any) {
        if (!(target instanceof HTMLElement)) {
            throw (new Error(JSON.stringify({ error: errors.HTMLElementUndefined })));
        }

        // let _target = window.hasOwnProperty('jQuery') && target instanceof jQuery ? target[0] : target;
        let _target = target;

        let _size = size || {};

        this.container = {
            target: _target,
            size: _size
        };

        this.container.target.textContent = '';
        this.container.target.style.position = 'relative';

        // this.sides = new Sides();

        this.history = new DrawHistory();
    },

    setLayerSetup(val = 0) {
        this.modeSpecialDrawEnable = val;
        if (this.modeSpecialDrawEnable < 1) {
            this.sides.selected._selected_path_index = -1;
            this.is_embroidery = false;
        } else {
            this.sides.selected._selected_path_index = this.modeSpecialDrawEnable;
            //if(this.modeSpecialDrawEnable==1) this.is_embroidery = true;
        }
        this.sides._collection.map((side: Side) => {
            side.setSelectableForDesign();
            return side
        });
        this.sides.selected.FabricCanvas.renderAll();
    },


    importJSON(json: String, initialZoom?: Number, proportions?: Number | 0.5) {
        this._originalJson = json;
        let oldSideSizes: any = {};

        // Array.prototype.forEach.call(this.sides._collection, (side: Side) => {
        //     if (side.layers.list.length)
        //         oldSideSizes[side.id] = side.getOccupiedAreaSize();
        // });

        if (this.sides._collection.length) {
            this.sides.empty();
            this.history.history = {};
        }
        let that = this

        let data = JSON.parse(escapeJSON(json));
        DrawTool.is_data = JSON.parse(escapeJSON(json));
        let promises = data.map((side: Side) => {
            let _side = this.sides.addSide(side.id);
            let imageUrl = side.imageUrl;

            if (imageUrl.indexOf('http') === 0)
                imageUrl += '?_';

            var border = { sideId: side.id, border: [side.border.cm, side.border.pixel] };
            this._designBorders.push(border);

            return _side.setImage(imageUrl, side.size.cm, proportions, side.border.cm);
        });

        var spProductObj = data.find((dt: any) => {
            return dt.id === '1';
        });

        if (spProductObj.border.cm.width === 120) {
            this.is_sp_product = true;
        } else {
            this.is_sp_product = false;
        }

        return new Promise<any>((resolve, reject) => {

            Promise.all(promises).then(values => {
                values.map((d: any, index) => {
                    let _side = that.sides.getSide(d.side.id);

                    _side.defaultWorkspaceSize = data[index].border.pixel;

                    // _side.setBorder(data[index].border);

                    if (initialZoom) {
                        _side.zoomToVal(initialZoom);
                    }
                    if ((DrawTool.modeToolDraw === DrawTool.modeSetup.TAP_RIBBON) || (DrawTool.modeToolDraw === DrawTool.modeSetup.TAP_RIBBON_2EDIT)) {
                        _side.zoomToVal(1.6);
                    }

                    setTimeout(() => {
                        if (this.__data[_side.id]) {
                            if (oldSideSizes[_side.id] && !this.is_choosing) {
                                _side.fromJSON(this.__data[_side.id], () => { }, false, oldSideSizes[_side.id]);
                                this.is_choosing = false;
                            }
                            else
                                _side.fromJSON(this.__data[_side.id]);
                        }

                        _side.FabricCanvas.renderAll.bind(_side.FabricCanvas);
                    });
                    return d
                });

                resolve(null);
            });
        });
    },


    trigger(event: String, data: Object) {

        if (!this._evented) {
            return false;
        }

        // if (event === 'history:update') {
        //     this.history.pushState(data.side.id);
        //     this.sides.getSide(data.side.id).layers.update();
        // }

        // if (typeof this._callbacks[event] !== 'undefined') {
        //     this._callbacks[event].forEach(cb => cb(JSON.stringify(data)));
        // }
    },
}

export default DrawTool;