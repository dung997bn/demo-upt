import DrawTool from "./DrawTool";
import Items from "./Items";
import fabric from 'fabric'
import Layers from "./Layers";
import escapeJSON from "../utils/escapeJSON";
import clip from "../utils/clip";
import errors from "../utils/errors";
import Item from "./Item";
import colorPicker from "../utils/colorPicker";
class Side {
    id: string
    container: any
    canvas: HTMLCanvasElement
    padding: any
    isZoom: any
    currentPathPosision: any
    _selected_path_index: any
    _changeBorder: any
    border_special: any
    start_boder: any
    nameSide: any
    _panning: any
    is_empty: any
    number_embroider: any
    number_special_draw: any
    number_embroider_sp: any
    number_draw: any
    number_print_draw: any
    overlay: any
    _zoom_zone: any
    imageUrl: any
    overlayImage: any
    _selected_path_indexis_nail: any
    items: any

    center: any
    FabricCanvas: any

    FabricBorder: any
    layers: Layers
    border: any
    size: any
    bgOffset: any
    backdrop: any
    _pan_x0: any
    _pan_y0: any
    defaultWorkspaceSize: any
    cmSize: any
    bgProportions: any
    workspaceGrid: any
    _panningDown: boolean
    colorPicker: any
    grid: any
    workspaceRuler: any
    ruler: any

    constructor(id: string) {
        this.id = id;

        this.container = document.createElement('div');

        this.canvas = document.createElement('canvas');
        this.padding = 10;

        this.isZoom = false;

        this._selected_path_index = 1;

        this._changeBorder = false;

        this.currentPathPosision = null;
        this.border_special = null;
        this.start_boder = {};
        this.nameSide = '';

        this._panning = false;

        this.is_empty = true;
        this.number_embroider = 0;
        this.number_special_draw = 0;
        this.number_embroider_sp = {};
        this.number_draw = 0;
        this.number_print_draw = 0;

        this.overlay = false;

        this._zoom_zone = false;

        this.imageUrl = null;

        this.overlayImage = null;
        this._selected_path_index = -1;
        this._selected_path_indexis_nail = 1;

        this.container.width = DrawTool.container.size.width || DrawTool.container.target.clientWidth;
        this.container.height = DrawTool.container.size.height || DrawTool.container.target.clientHeight;
        this.container.style.position = 'absolute';
        this.container.style.top = '0';
        this.container.style.left = '0';

        this.canvas.width = DrawTool.container.size.width || DrawTool.container.target.clientWidth;
        this.canvas.height = DrawTool.container.size.height || DrawTool.container.target.clientHeight;

        this.container.appendChild(this.canvas);
        DrawTool.container.target.appendChild(this.container);
        this._initFabric();
        this._initEvents();

        this.items = new Items(this);

        this.layers = new Layers(this);

        this.workspaceGrid = null
        this._panningDown = false

        // this.currentBrush = 'PencilBrush';

        this.colorPicker = new colorPicker(this);

        return this;
    }

    updateSize(size: any) {

        this.size = size;

        this.cmSize = this._calculateSize();

        this.initGrid();
        this.initRuler();

        if (this.FabricBorder) {
            this.initWorkspaceGrid();
            this.initWorkspaceRuler();
        }

        return this;
    }

    /**
 *
 * @private
 */
    initGrid() {

        if (!this.cmSize) {
            throw (new Error(JSON.stringify({ error: errors.sideNoSize })));
            return false;
        }

        var state;

        if (this.grid) {
            state = this.grid.visible;
            this.grid.destroy();
            this.FabricCanvas.remove(this.grid);
        } else {
            state = false;
        }

        let cm = this.cmSize;

        let stepX = cm.width;
        let stepY = cm.height;

        this.grid = new fabric.fabric.Group(undefined, {
            excludeFromExport: true,
            hasControls: false,
            hoverCursor: 'default',
            selectable: false
        });

        this.FabricCanvas.add(this.grid);

        this.grid.sendToBack();

        this.grid.enable = function (val = true) {
            this.setVisible(val);
            this.canvas.renderAll();
        };

        this.grid.setVisible(state);
        this.FabricCanvas.renderAll();

    }

    /**
     *
     * @private
     */
    initRuler() {

        if (!this.cmSize) {
            throw (new Error(JSON.stringify({ error: errors.sideNoSize })));
            return false;
        }

        var state;

        if (this.ruler) {
            state = this.ruler.visible;
            this.ruler.destroy();
            this.FabricCanvas.remove(this.ruler);
        } else {
            state = false;
        }

        let cm = this.cmSize;

        let stepX = cm.width;
        let stepY = cm.height;

        this.ruler = new fabric.fabric.Group(undefined, {
            excludeFromExport: true,
            hasControls: false,
            hoverCursor: 'default',
            selectable: false
        });

        for (var x = stepX * 2; x <= this.FabricCanvas.width; x += stepX) {
            this.ruler.add(new fabric.fabric.Line([x, 0, x, stepY * 2], { stroke: 'rgba(0, 0, 0, 0.2)', selectable: false, hoverCursor: 'default' }));
        }

        for (var y = stepY * 2; y <= this.FabricCanvas.height; y += stepY) {
            this.ruler.add(new fabric.fabric.Line([0, y, stepX * 2, y], { stroke: 'rgba(0, 0, 0, 0.2)', selectable: false, hoverCursor: 'default' }));
        }

        this.FabricCanvas.add(this.ruler);

        this.ruler.enable = function (val = true) {
            this.setVisible(val);
            this.canvas.renderAll();
        };

        this.ruler.setVisible(state);
        this.FabricCanvas.renderAll();
    }


    // * Set side image
    // * @param {String} url
    // * @param size {Object} size
    // * @param size.width {Number} Width of image in centimeters
    // * @param size.height {Number} Height of image in centimeters
    // * @param proportions {Number}
    // * @param borderSize {Object}
    // * @return {Promise}
    setImage(url: string, size?: any, proportions: any = 1, borderSize?: any) {
        this.size = size;

        this.imageUrl = url;

        let center = this.FabricCanvas.getCenter();

        return new Promise((resolve, reject) => {

            this.FabricCanvas.setBackgroundColor('#ffffff');

            fabric.fabric.Image.fromURL(url, imgObj => {


                this.FabricCanvas.setBackgroundImage(imgObj, (img: any) => {
                    this.backdrop = this.FabricCanvas.backgroundImage;

                    this.backdrop.excludeFromExport = true;

                    let canvasAspectRatio = this.canvas.width / this.canvas.height;
                    let borderAspectRatio = borderSize.width / borderSize.height;

                    if (canvasAspectRatio < borderAspectRatio) {
                        let canvasProportions = this.FabricCanvas.width / this.size.width;
                        this.bgProportions = (this.FabricCanvas.width * proportions) / (borderSize.width * canvasProportions);

                        // this.backdrop.scaleToWidth(this.size.width * canvasProportions * this.bgProportions);
                        this.backdrop.scaleToWidth(this.FabricCanvas.width)
                    } else {
                        let canvasProportions = this.FabricCanvas.height / this.size.height;
                        this.bgProportions = (this.FabricCanvas.height * proportions) / (borderSize.height * canvasProportions);

                        // this.backdrop.scaleToHeight(this.size.height * canvasProportions * this.bgProportions);
                        this.backdrop.scaleToHeight(this.FabricCanvas.height)
                    }

                    this._setOffset(borderSize);

                    this.FabricCanvas.backgroundImage.top -= this.bgOffset.top;
                    this.FabricCanvas.backgroundImage.left -= this.bgOffset.left;

                    this.cmSize = this._calculateSize();

                    this.FabricCanvas.renderAll();

                    DrawTool.trigger('backdrop:loaded', { side: { id: this.id } });

                    DrawTool.history.pushState(this.id);
                    resolve({ side: { id: this.id } });
                }, {
                    top: center.top,
                    left: center.left,
                    originX: 'center',
                    originY: 'center',
                    opacity: 1,
                    crossOrigin: 'anonymous'

                });

                // imgObj.scaleToWidth(this.size.width* (this.FabricCanvas.height / this.size.height)* this.bgProportions);
                // imgObj.scaleToHeight(this.size.height* (this.FabricCanvas.height / this.size.height)* this.bgProportions);
                imgObj.scaleToWidth(this.FabricCanvas.width);
                imgObj.scaleToHeight(this.FabricCanvas.height);
                this.FabricCanvas.renderAll();
            })

        });
    }

    _setOffset(borderSize: any) {
        this.bgOffset = {
            left: 0,
            top: 0
        };

        this.bgOffset.left = (borderSize.left - ((this.size.width - borderSize.width) / 2)) * this.backdrop.scaleX;
        this.bgOffset.top = (borderSize.top - ((this.size.height - borderSize.height) / 2)) * this.backdrop.scaleY;

        return true;
    }

    _calculateSize() {
        this.cmSize = {
            width: ((this.backdrop.width * this.backdrop.scaleX) / this.size.width),
            height: ((this.backdrop.height * this.backdrop.scaleY) / this.size.height)
        };
        return this.cmSize;
    }

    zoomToVal(val: Number) {
        let center = this.FabricBorder.getCenterPoint();
        this.FabricCanvas.zoomToPoint(center, val);
        return this;
    }



    _initFabric() {

        this.FabricCanvas = new fabric.fabric.Canvas(this.canvas, {
            selection: false,
            enableRetinaScaling: true,
            preserveObjectStacking: true
        });

        // this.FabricCanvas.toJSON('objects.brush');

        this.FabricCanvas.wrapperEl.style.display = 'none';
        this.FabricCanvas.upperCanvasEl.style['-webkit-tap-highlight-color'] = 'rgba(0,0,0,0)';
        this.FabricCanvas.lowerCanvasEl.style['-webkit-tap-highlight-color'] = 'rgba(0,0,0,0)';
    }


    _initEvents() {
        this.FabricCanvas.on({
            'after:render': (e: any) => {
                DrawTool.trigger('after:render', {});
            },
            'object:added': (e: any) => {
                if (e.target.id !== "FabricBorder") {
                    this.is_empty = false;
                }
                if (!e.target.excludeFromExport) {
                    DrawTool.trigger('object:added', { side: { id: this.id }, item: e.target.toObject(['brush', 'editable', 'vertical', 'uuid']).uuid });
                }
            },
            'selection:cleared': (e: any) => {
                if (this.items.selected.item) {
                    this.items.selected.item.selected = false;
                }
                this.items.selected.item = null;
                DrawTool.trigger('selection:cleared', e);
            },
            'selection:created': (e: any) => {
                DrawTool.trigger('selection:created', e);
            },
            'object:selected': (e: any) => {
                if (e.target.id === 'FabricBorder') {
                    e.target.setCoords();
                    this.center = this.FabricBorder.getCenterPoint();
                }
                this.items.selected.item = e.target;
                this.items.selected.item.selected = true;
                DrawTool.trigger('object:selected', { side: { id: this.id }, isWorkSpaceBorder: e.target.id === 'FabricBorder' });
            },
            'object:modified': (e: any) => {
                this.checkEmpty()
                if (e.target.id === 'FabricBorder') {
                    e.target.setCoords();
                    this.center = this.FabricBorder.getCenterPoint();
                    this.initWorkspaceGrid();
                    this.initWorkspaceRuler();
                }
                DrawTool.trigger('object:modified', { side: { id: this.id }, isWorkSpaceBorder: e.target.id === 'FabricBorder', item: e.target.toObject(['brush', 'editable', 'vertical', 'uuid']).uuid });
                if (!e.target.excludeFromExport) {
                    DrawTool.trigger('history:update', { side: { id: this.id }, isWorkSpaceBorder: false });
                }

            },
            'object:removed': (e: any) => {
                this.checkEmpty()
                if (e.target && !e.target.excludeFromExport) {
                    DrawTool.trigger('object:removed', { side: { id: this.id }, item: e.target.toObject(['brush', 'editable', 'vertical', 'uuid']).uuid });
                    DrawTool.trigger('history:update', { side: { id: this.id } });
                }
            },
            'editing:exited': () => {
                DrawTool.trigger('editing:exited', { side: { id: this.id } });
            },
            'editing:entered': () => {
                DrawTool.trigger('editing:entered', { side: { id: this.id } });
            },
            'mouse:up': (e: any) => {
                this._panningDown = false;

                if (DrawTool.is_nail && this._zoom_zone) {
                    var touches = e.e.touches && e.e.touches.length ? e.e.touches : [e.e];
                    var evt = (e.e.changedTouches && e.e.changedTouches[0]) || touches[0];

                    let x = evt.layerX || evt.pageX || 0;
                    let y = evt.layerY || evt.pageY || 0;

                    if (DrawTool.is_mobile) {
                        y -= 65;
                        this._pan_y0 -= 65;
                    }

                    let centerX = (x + this._pan_x0) / 2;
                    let centerY = (y + this._pan_y0) / 2;

                    let min: any = {};
                    let minPathIndex = 0;
                    let minDistance = 1000000;
                    let zoom = this.FabricCanvas.getZoom();

                    this.FabricBorder._objects.map((o: any, index: number) => {
                        if (index !== 0) {
                            let aX = this.FabricBorder.oCoords.tl.x + (o.aCoords.tl.x + o.aCoords.tr.x) * zoom / 2;
                            let aY = this.FabricBorder.oCoords.tl.y + (o.aCoords.tl.y + o.aCoords.bl.y) * zoom / 2;
                            let currentDistance = Math.sqrt(Math.pow(aX - centerX, 2) + Math.pow(aY - centerY, 2));
                            if (currentDistance < minDistance) {
                                minDistance = currentDistance;
                                minPathIndex = index;
                                min = { x: aX, y: aY };
                            }
                        }
                    });

                    let pointMinX = Math.min(x, this._pan_x0);
                    let pointMinY = Math.min(y, this._pan_y0);
                    let pointMaxX = Math.max(x, this._pan_x0);
                    let pointMaxY = Math.max(y, this._pan_y0);

                    let minPath = this.FabricBorder._objects[minPathIndex];
                    let pathMinX = this.FabricBorder.oCoords.tl.x + minPath.aCoords.tl.x * zoom;
                    let pathMinY = this.FabricBorder.oCoords.tl.y + minPath.aCoords.tl.y * zoom;
                    let pathMaxX = this.FabricBorder.oCoords.tl.x + minPath.aCoords.tr.x * zoom;
                    let pathMaxY = this.FabricBorder.oCoords.tl.y + minPath.aCoords.bl.y * zoom;

                    if (pointMinX <= pathMinX &&
                        pointMinY <= pathMinY &&
                        pointMaxX >= pathMaxX &&
                        pointMaxY >= pathMaxY) {
                        this._selected_path_index = minPathIndex;
                        this.FabricCanvas.relativePan({ x: this.center.x - min.x, y: this.center.y - min.y });
                        this.FabricCanvas.renderAll();

                        let center = new fabric.fabric.Point(this.FabricCanvas.getWidth() / 2, this.FabricCanvas.getHeight() / 2);
                        this.FabricCanvas.zoomToPoint(center, 3);
                        this.FabricCanvas.renderAll();
                    }
                }
            },
            'mouse:down': (e: any) => {
                this._panningDown = true;

                var touches = e.e.touches && e.e.touches.length ? e.e.touches : [e.e];
                var evt = (e.e.changedTouches && e.e.changedTouches[0]) || touches[0];

                this._pan_x0 = evt.layerX || evt.pageX || 0;
                this._pan_y0 = evt.layerY || evt.pageY || 0;

                if (this.colorPicker.active) {
                    this.colorPicker.move(e);
                    DrawTool.trigger('colorpicker:update', this.colorPicker.color);
                }

            },
            'mouse:move': (e: any) => {

                //  DrawTool.trigger('mouse:move');

                if (!!(this._panning && this._panningDown && e && e.e)) {

                    var touches = e.e.touches && e.e.touches.length ? e.e.touches : [e.e];
                    var evt = (e.e.changedTouches && e.e.changedTouches[0]) || touches[0];

                    let x = evt.layerX || evt.pageX || 0;
                    let y = evt.layerY || evt.pageY || 0;

                    this.FabricCanvas.relativePan({ x: x - this._pan_x0, y: y - this._pan_y0 });
                    this._pan_x0 = x;
                    this._pan_y0 = y;
                }
                if (this.colorPicker.active) {
                    this.colorPicker.move(e);
                }
            },
            'object:moving': (e: any) => {
                if (DrawTool.is_embroidery) {
                    if (!!(e && e.e && e.target)) {
                        var angle = 0;
                        if (e.target.angle) angle = e.target.angle;
                        var left1 = this.FabricBorder._originalLeft;
                        var left2 = left1 + this.FabricBorder.width;
                        var widthDiv2 = e.target.width / 2 * e.target.scaleX * Math.abs(Math.cos(angle * Math.PI / 180)) +
                            e.target.height / 2 * e.target.scaleY * Math.abs(Math.sin(angle * Math.PI / 180));
                        if ((e.target.left + widthDiv2) > left2) {
                            e.target.left = left2 - widthDiv2;
                        }
                        else
                            if ((e.target.left - widthDiv2) < left1) {
                                e.target.left = left1 + widthDiv2;
                            }
                    }
                } else {
                    if (!!(e && e.e && e.target)) {
                        if (Math.abs(e.target.left - this.center.x) < 5) {
                            e.target.left = this.center.x;
                            e.target.actionMoveX = true;
                        }
                        else {
                            e.target.actionMoveX = false;
                        }

                        if (Math.abs(e.target.top - this.center.y) < 5) {
                            e.target.top = this.center.y;
                            e.target.actionMoveY = true;
                        }
                        else {
                            e.target.actionMoveY = false;
                        }
                    }
                }
            },
            'object:scaling': (e: any) => {
                if (!!e.e.touches && e.e.touches.length > 1) {
                    return false
                } else {
                    let obj = e.target;
                    if (DrawTool.is_embroidery) {
                        var angle = 0;
                        if (e.target.angle) angle = e.target.angle;
                        var left1 = this.FabricBorder._originalLeft;
                        var left2 = left1 + this.FabricBorder.width;
                        var widthDiv2 = e.target.width * e.target.scaleX * Math.abs(Math.cos(angle * Math.PI / 180)) + e.target.height / 2 * e.target.scaleY * Math.abs(Math.sin(angle * Math.PI / 180));
                        if (widthDiv2 > this.FabricBorder.width) {
                            widthDiv2 = this.FabricBorder.width / 2;
                            e.target.left = left2 - widthDiv2;
                            e.target.scaleToWidth(this.FabricBorder.width);
                        }
                        else {
                            widthDiv2 = widthDiv2 / 2;
                            if (e.target.left + widthDiv2 > left2) {
                                e.target.left = left2 - widthDiv2;
                            } else if (e.target.left - widthDiv2 < left1) {
                                e.target.left = left1 + widthDiv2;
                            }
                        }
                    }
                    if (obj.type.includes('path') || obj.type.includes('i-text') || obj.type.includes('curvedText')) {
                        return false;
                    }

                    let w = obj.width * obj.scaleX;
                    let h = obj.height * obj.scaleY;
                    let s = obj.strokeWidth;

                    obj.set({
                        'height': h,
                        'width': w,
                        'scaleX': 1,
                        'scaleY': 1
                    });
                }
            },
            'object:rotating': function objectRotate(e: any) {
                DrawTool.trigger('object:rotating');
            },
        });
    }

    saveBoder(start: any, special = null) {
        this.border_special = special;
        this.start_boder = start;
    }

    async setOverlayBorder(overlayImage: any, reset = false) {
        if (reset) {
            if (this.overlayImage !== null) {
                overlayImage = this.overlayImage;
            }
            else {
                return;
            }
        }
        else {
            this.overlayImage = overlayImage;
        }
        setTimeout(() => {
            let center = this.FabricCanvas.getCenter();
            this.FabricCanvas.setOverlayImage(overlayImage, () => {
                this.FabricCanvas.overlayImage.scaleX = this.backdrop.scaleX;
                this.FabricCanvas.overlayImage.scaleY = this.backdrop.scaleY;
                this.FabricCanvas.overlayImage.originX = 'center';
                this.FabricCanvas.overlayImage.originY = 'center';
                this.FabricCanvas.overlayImage.top = center.top - this.bgOffset.top;
                this.FabricCanvas.overlayImage.left = center.left - this.bgOffset.left;
                this.FabricCanvas.renderAll();
            });
            this.FabricCanvas.forEachObject((item: any) => {
                item.setClipTo(null);
            })
            this.FabricCanvas.renderAll();
        }, 500);
    }

    /**
  *
  * @private
  */
    initWorkspaceGrid() {

        if (!this.cmSize) {
            throw (new Error(JSON.stringify({ error: errors.sideNoSize })));
            return false;
        }

        var state;

        if (this.workspaceGrid) {
            state = this.workspaceGrid.visible;
            this.workspaceGrid.destroy();
            this.FabricCanvas.remove(this.workspaceGrid);
        } else {
            state = false;
        }

        let cm = this.cmSize;

        this.workspaceGrid = new fabric.fabric.Group(undefined, {
            excludeFromExport: true,
            hasControls: false,
            hoverCursor: 'default',
            selectable: false
        });

        for (var x = this.FabricBorder.left; x <= this.FabricBorder.left + this.FabricBorder.width; x += cm.width) {
            this.workspaceGrid.add(new fabric.fabric.Line([x, this.FabricBorder.top, x, this.FabricBorder.top + this.FabricBorder.height], { stroke: DrawTool.grid.color, strokeWidth: DrawTool.grid.strokeWidth, selectable: false, hoverCursor: 'default' }));
        }

        for (var y = this.FabricBorder.top; y <= this.FabricBorder.top + this.FabricBorder.height; y += cm.height) {
            this.workspaceGrid.add(new fabric.fabric.Line([this.FabricBorder.left, y, this.FabricBorder.left + this.FabricBorder.width, y], { stroke: DrawTool.grid.color, strokeWidth: DrawTool.grid.strokeWidth, selectable: false, hoverCursor: 'default' }));
        }

        this.FabricCanvas.add(this.workspaceGrid);

        this.grid.sendToBack();

        this.workspaceGrid.enable = function (val = true) {
            this.setVisible(val);
            this.canvas.renderAll();
        };

        this.workspaceGrid.setVisible(state);
        this.FabricCanvas.renderAll();

    }


    /**
     *
     * @private
     */
    initWorkspaceRuler() {
        if (!this.cmSize) {
            throw (new Error(JSON.stringify({ error: errors.sideNoSize })));
            return false;
        }

        var state;

        if (this.workspaceRuler) {
            state = this.workspaceRuler.visible;
            this.workspaceRuler.destroy();
            this.FabricCanvas.remove(this.workspaceRuler);
        } else {
            state = false;
        }

        let cm = this.cmSize;

        this.workspaceRuler = new fabric.fabric.Group(undefined, {
            excludeFromExport: true,
            hasControls: false,
            hoverCursor: 'default',
            selectable: false
        });

        for (var x = this.FabricBorder.left; x <= this.FabricBorder.left + this.FabricBorder.width; x += cm.width) {
            this.workspaceRuler.add(new fabric.fabric.Line([x, cm.height, x, cm.height * 2], { stroke: 'rgba(0, 0, 0, 0.2)', selectable: false, hoverCursor: 'default' }));
        }

        for (var y = this.FabricBorder.top; y <= this.FabricBorder.top + this.FabricBorder.height; y += cm.height) {
            this.workspaceRuler.add(new fabric.fabric.Line([cm.width, y, cm.width * 2, y], { stroke: 'rgba(0, 0, 0, 0.2)', selectable: false, hoverCursor: 'default' }));
        }

        this.workspaceRuler.add(new fabric.fabric.Line([this.FabricBorder.left, cm.height * 1.5, this.FabricBorder.left + this.FabricBorder.width, cm.height * 1.5], { stroke: 'rgba(0, 0, 0, 0.2)', selectable: false, hoverCursor: 'default' }));
        this.workspaceRuler.add(new fabric.fabric.Line([cm.width * 1.5, this.FabricBorder.top, cm.width * 1.5, this.FabricBorder.top + this.FabricBorder.height], { stroke: 'rgba(0, 0, 0, 0.2)', selectable: false, hoverCursor: 'default' }));


        this.FabricCanvas.add(this.workspaceRuler);

        this.workspaceRuler.enable = function (val = true) {
            this.setVisible(val);
            this.canvas.renderAll();
        };

        this.workspaceRuler.setVisible(state);
        this.FabricCanvas.renderAll();
    }



    setSelectableForDesign() {
        let that1 = this;
        if (this._panning) {
            this.items._collection.forEach((object: any) => object.selectable = false);
        } else {
            this.items._collection.forEach((object: any) => {
                if (DrawTool.is_embroidery) {
                    if (object.pathIndex) {
                        //|| DrawTool.is_area_embroider !== object.areaEmbroider 
                        if (object.pathIndex === -1) {
                            object.selectable = false;
                            object.evented = false;
                        }
                        else {
                            if (object.pathIndex === 1) {
                                if (!!!object.areaEmbroider) {
                                    let border = DrawTool.sides.selected.FabricBorder;
                                    let border_coords = that1.getValuefromHash(border.aCoords);
                                    if (that1.doPolygonsIntersect(border_coords, that1.getValuefromHash(object.aCoords)) && object.id !== "FabricBorder") {
                                        object.selectable = true;
                                        object.evented = true;
                                    }
                                    else {
                                        object.selectable = false;
                                        object.evented = false;
                                    }
                                }
                                else {
                                    if (DrawTool.is_area_embroider !== object.areaEmbroider) {
                                        object.selectable = false;
                                        object.evented = false;
                                    }
                                    else {
                                        object.selectable = true;
                                        object.evented = true;
                                    }
                                }
                            }
                            else {
                                object.selectable = false;
                                object.evented = false;
                            }
                        }
                    }
                    else {
                        object.selectable = false;
                        object.evented = false;
                    }
                } else {
                    if (DrawTool.modeSpecialDrawEnable > 1) {
                        if (object.pathIndex === DrawTool.modeSpecialDrawEnable) {
                            object.selectable = true;
                            object.evented = true;
                        }
                        else {
                            object.selectable = false;
                            object.evented = false;
                        }
                    }
                    else {
                        if (object.pathIndex > 0) {
                            object.selectable = false;
                            object.evented = false;
                        }
                        else {
                            object.selectable = true;
                            object.evented = true;
                        }
                    }
                }
            });
        }
    }

    _removeEvents() {
        this.FabricCanvas.off();
    }

    /**
 *
 * @param {String} json
 */
    fromJSON(json: String, callback?: any, firstOfHistory = false, sizeOldWorkArea: any = false) {
        let data = JSON.parse(escapeJSON(json));
        let filters = {} as any;
        let proportionsOnOld = 1;
        Array.prototype.forEach.call(data.canvas.objects, function (item) {
            if (typeof item.filters != 'undefined' && item.filters.length > 0) {
                filters[item.uuid] = item.filters;
                item.filters = [];
            }
        });

        this._removeEvents();

        this.items._collection = [];

        if (sizeOldWorkArea) {
            if (this.FabricBorder.width < this.FabricBorder.height) {
                proportionsOnOld = this.FabricBorder.width / sizeOldWorkArea.width;
            } else {
                proportionsOnOld = this.FabricBorder.height / sizeOldWorkArea.height;
            }
        }

        // let canvasData = JSON.stringify({ objects: data.canvas.objects });
        let canvasData = data.canvas.objects

        this.FabricCanvas.loadFromJSON(canvasData, () => {
            if (this.backdrop) {
                this.FabricCanvas.backgroundImage = this.backdrop;
            }
            this.setBorder(this.border);
            this.FabricBorder.sendToBack();
            this.FabricCanvas.renderAll.bind(this.FabricCanvas);
            this._initEvents();
            this.layers.update();

            if (firstOfHistory) {
                DrawTool.history.history[DrawTool.sides.selected.id].collection = [JSON.stringify(this.FabricCanvas)];
                DrawTool.history.history[DrawTool.sides.selected.id].currentIndex = 0;
            }
        }, (o: any, item: any) => {
            let scaleX = (this.getBorder().pixel.width / data.border.pixel.width);
            let scaleY = (this.getBorder().pixel.height / data.border.pixel.height);
            var valueScaleAction = scaleX;
            if (scaleX > scaleY) valueScaleAction = scaleY;
            scaleX = valueScaleAction * item.scaleX;
            scaleY = valueScaleAction * item.scaleY;
            if (valueScaleAction !== 0) {
                item.set({
                    left: (this.center.x + item.left * valueScaleAction),
                    top: (this.center.y + item.top * valueScaleAction),
                    scaleX: scaleX,
                    scaleY: scaleY,
                    'sizeImage': 0,
                    "useItemData": true,
                    clipTo: this.overlay ? "" : clip(this.FabricBorder),
                });
            }
            else {
                item.set({
                    left: this.center.x + ((item.left / data.factor.x) * ((this.getBorder().pixel.left || 1) / (this.defaultWorkspaceSize.left || 1))),
                    top: this.center.y + ((item.top / data.factor.y) * ((this.getBorder().pixel.top || 1) / (this.defaultWorkspaceSize.top || 1))),
                    scaleX: scaleX,
                    scaleY: scaleY,
                    'sizeImage': 0,
                    "useItemData": true,
                    clipTo: this.overlay ? "" : clip(this.FabricBorder),
                });
            }
            if (!item.pathIndex || item.pathIndex !== DrawTool.modeSetup.EMBROIDER) {
                this.items.setClipOtherBorder(item, this.FabricBorder, null);
            }
            if (item.lastBorder) {
                if (DrawTool.modeToolDraw === DrawTool.modeSetup.EMBROIDER) {
                    if (item.pathIndex === DrawTool.modeSetup.EMBROIDER) {
                        var dataBoder = JSON.parse(item.lastBorder);
                        dataBoder.isSetup = false;
                        item.lastBorder = JSON.stringify(dataBoder);
                    }
                    else {
                        this.items.setClipOtherBorder(item, this.FabricBorder);
                    }
                }
                else {
                    delete item.lastBorder;
                }
            }

            var ImageProcessingColorCheck = false;
            var checkChangeToCropPathProcessing = false;
            var colorCheck = ["rgba(0,0,0,1)", "rgba(255,0,0,1)", "rgba(0,0,255,1)", "rgba(255,255,255,1)"];
            if (DrawTool.modeToolDraw === DrawTool.modeSetup.TAP_RIBBON) {
                colorCheck.push("rgba(255,255,255,1)");
            }
            else if (DrawTool.modeToolDraw === DrawTool.modeSetup.TAP_RIBBON_2EDIT) {
                colorCheck.push("rgba(193,171,5,1)");
                colorCheck.push("rgba(192,192,192,1)");
            }

            if (item.uuid in filters) {
                Array.prototype.forEach.call(filters[item.uuid], (filter) => {
                    if (!colorCheck.includes(filter.color)) filter.color = "rgba(0,0,0,1)";
                    if (filter.type === "RemoveColor") {
                        let filterRemoveColor = new (fabric.fabric.Image.filters as any).RemoveColor({
                            color: filter.color,
                            distance: filter.distance
                        });
                        item.filters.push(filterRemoveColor);
                        item.applyFilters(this.FabricCanvas.renderAll.bind(this.FabricCanvas));
                    }
                    else if (filter.type === "ImageProcessingColor") {
                        ImageProcessingColorCheck = true;
                        let imageProcessingColor = new (fabric.fabric.Image.filters as any).ImageProcessingColor({
                            color: filter.color,
                            distance: filter.distance
                        });
                        item.filters.push(imageProcessingColor);
                        item.applyFilters(this.FabricCanvas.renderAll.bind(this.FabricCanvas));
                    }
                    else if (filter.type === "ImageChangeColorAll") {
                        ImageProcessingColorCheck = true;
                        let imageChangeColorAll = new (fabric.fabric.Image.filters as any).ImageChangeColorAll({
                            color: filter.color,
                            distance: filter.distance
                        });
                        item.filters.push(imageChangeColorAll);
                        item.applyFilters(this.FabricCanvas.renderAll.bind(this.FabricCanvas));
                    }
                    else if (filter.type === "ChangeToCropPathProcessing") {
                        checkChangeToCropPathProcessing = true;
                        let changeToCropPathProcessing = new (fabric.fabric.Image.filters as any).ChangeToCropPathProcessing({
                            color: filter.color,
                            distance: filter.distance
                        });
                        item.filters.push(changeToCropPathProcessing);
                        item.applyFilters(this.FabricCanvas.renderAll.bind(this.FabricCanvas));
                    }
                });
            }
            if ((DrawTool.modeToolDraw == DrawTool.modeSetup.TAP_RIBBON) || (DrawTool.modeToolDraw == DrawTool.modeSetup.TAP_RIBBON_2EDIT)) {
                if (!!item.type) {
                    if ((item.type === "image") && (!ImageProcessingColorCheck)) {
                        if (!!!item.filters) item.filters = [];
                        if (item.brush) {
                            item.filters = [];
                            var setColor = "rgba(0,0,0,1)";
                            if (item.color) {
                                if (colorCheck.includes(item.color)) setColor = item.color;
                            }
                            let imageChangeColorAll = new (fabric.fabric.Image.filters as any).ImageChangeColorAll({
                                color: setColor,
                                distance: 10
                            });
                            item.filters.push(imageChangeColorAll);
                            item.applyFilters(this.FabricCanvas.renderAll.bind(this.FabricCanvas));
                        }
                        else {
                            if ((item.filters.length == 0) || checkChangeToCropPathProcessing) {
                                let imageProcessingColor = new (fabric.fabric.Image.filters as any).ImageProcessingColor({
                                    color: "rgba(0,0,0,1)",
                                    distance: 10
                                });
                                item.filters.push(imageProcessingColor);
                                item.applyFilters(this.FabricCanvas.renderAll.bind(this.FabricCanvas));
                            }
                        }
                    }
                    else if (item.type === "path-group") {
                        var enableSelectPath = false;
                        if (!!item.paths) {
                            var countItemColor = 0;
                            item.paths.forEach(function (path: any) {
                                if (colorCheck.includes(path.fill)) {
                                    path.set('fill', path.fill);
                                    enableSelectPath = true;
                                }
                                else {
                                    path.set('fill', "rgba(0,0,0,1)");
                                }
                            });
                  
                        }
                    }
                    else if (item.type === "i-text") {
                        if (!!item.text) {
                            if (!colorCheck.includes(item.fill)) item.set('fill', "rgba(0,0,0,1)");
                        }
                    }
                }
            }

            this.items._collection.push(item);
            this.FabricCanvas.add(item)
            if (data.is_empty) {
                this.checkEmpty();
            } else {

                if ((!!this.border_special) && (this.border_special.length === 1)) {
                    delete data.number_embroider_sp.left;
                }
                this.is_empty = data.is_empty;
                this.number_embroider = data.number_embroider;
                this.number_special_draw = data.number_special_draw;
                this.number_draw = data.number_draw;
                this.number_embroider_sp = data.number_embroider_sp;
                this.number_print_draw = data.number_print_draw;
            }

            this.items.triggerCreated();
            this.FabricCanvas.renderAll()
            if (typeof callback === 'function')
                callback();
        });
        this.checkEmpty()
    }

    checkEmpty() {
        if (DrawTool.sides.selected) {
            let border = DrawTool.sides.selected.FabricBorder
            let count = 0
            let countEmbroider = 0;
            let countSpecialDraw = 0;
            var countPrintDraw = 0;
            var nameEmbroiderSide;
            let side = DrawTool.sides.selected;
            let border_coords = this.getValuefromHash(border.aCoords)
            side.FabricCanvas._objects.map((item: any) => {
                if (this.doPolygonsIntersect(border_coords, this.getValuefromHash(item.aCoords)) && item.id !== "FabricBorder") {
                    if (item.pathIndex === 1) {
                        countEmbroider++;
                    }
                    if (item.pathIndex === -1) {
                        countPrintDraw++;
                    }
                    else if (item.pathIndex > 2) countSpecialDraw++;
                    count++;
                }
                return item
            });
            if (count === 0) {
                side.is_empty = true;
            } else {
                side.is_empty = false;
            }

            side.number_embroider = countEmbroider;
            side.number_special_draw = countSpecialDraw;
            side.number_draw = count;

            if (!DrawTool.is_embroidery) {
                side.number_print_draw = countPrintDraw;
            }
            if (!side.number_embroider_sp) {
                side.number_embroider_sp = {};
            }
            if (side.border.name) {
                side.number_embroider_sp[side.border.name] = countEmbroider;
            }

            if (side.id === '3') {
                nameEmbroiderSide = 'handLeft';
                side.nameSide = 'handLeft'
            }
            if (side.id === '4') {
                nameEmbroiderSide = 'handRight';
                side.nameSide = 'handRight'
            }
            if (nameEmbroiderSide) {
                side.number_embroider_sp[nameEmbroiderSide] = countEmbroider;
            }
        }
    }

    getValuefromHash(hash: any) {
        var array_values = [];
        for (var key in hash) {
            array_values.push(hash[key]);
        }
        return array_values;
    }

    doPolygonsIntersect(a: any, b: any) {
        let polygons = [a, b];
        let minA, maxA, projected, i, i1, j, minB, maxB;
        for (i = 0; i < polygons.length; i++) {
            // for each polygon, look at each edge of the polygon, and determine if it separates
            // the two shapes
            let polygon = polygons[i];
            for (i1 = 0; i1 < polygon.length; i1++) {
                // grab 2 vertices to create an edge
                let i2 = (i1 + 1) % polygon.length;
                let p1 = polygon[i1];
                let p2 = polygon[i2];
                // find the line perpendicular to this edge
                let normal = { x: p2.y - p1.y, y: p1.x - p2.x };
                minA = maxA = undefined;
                // for each vertex in the first shape, project it onto the line perpendicular to the edge
                // and keep track of the min and max of these values
                for (j = 0; j < a.length; j++) {
                    projected = normal.x * a[j].x + normal.y * a[j].y;
                    if ((!minA) || projected < minA) {
                        minA = projected;
                    }
                    if ((!maxA) || projected > maxA) {
                        maxA = projected;
                    }
                }
                // for each vertex in the second shape, project it onto the line perpendicular to the edge
                // and keep track of the min and max of these values
                minB = maxB = undefined;
                for (j = 0; j < b.length; j++) {
                    projected = normal.x * b[j].x + normal.y * b[j].y;
                    if ((!minB) || projected < minB) {
                        minB = projected;
                    }
                    if ((!maxB) || projected > maxB) {
                        maxB = projected;
                    }
                }

                // if there is no overlap between the projects, the edge we are looking at separates the two
                // polygons, and we know there is no overlap
                if (maxA! < minB! || maxB! < minA!) {
                    console.log("polygons don't intersect!");
                    return false;
                }
            }
        }
        return true;
    }

    // toJSON() {
    //     DrawTool.is_data.map((side: Side) => {
    //         if (side.border_special) {
    //             let borderEmbroider1: any = { sideId: side.id, border: side.border_special, bd: side.border }
    //             DrawTool._embroideryPaths.push(borderEmbroider1);

    //         } else {
    //             var pathEmbroider = `M${side.border.cm.left} ${side.border.cm.top} h${side.border.cm.width} v${side.border.cm.height} h-${side.border.cm.width} Z`;
    //             if (DrawTool.embroider_able) {
    //                 side.border.paths = [pathEmbroider];
    //             }
    //             var borderEmbroider2 = { sideId: side.id, border: [{ cm: side.border.cm, paths: side.border.paths, pixel: side.border.pixel, name: "" }], bd: side.border };
    //             DrawTool._embroideryPaths.push(borderEmbroider2);
    //         }
    //     });

    //     let _formattedSide: any = {
    //         id: this.id,
    //         imageUrl: this.imageUrl,
    //         size: this.size,
    //         is_empty: this.is_empty,
    //         number_embroider: this.number_embroider,
    //         number_special_draw: this.number_special_draw,
    //         number_draw: this.number_draw,
    //         number_embroider_sp: this.number_embroider_sp,
    //         number_print_draw: this.number_print_draw,
    //         canvas: this.FabricCanvas.toObject(['brush', 'editable', 'vertical', 'color', 'typeSVG', 'pathIndex', 'fileContent', 'fileContentURL', 'typePaths', 'lastBorder', 'areaEmbroider', 'pathDLaser']),
    //         fonts: DrawTool.fonts,
    //         border_special: this.border_special,
    //     };

    //     var itemOrder = [];

    //     for (var i = 0; i < _formattedSide.canvas.objects.length; i++) {
    //         if (_formattedSide.canvas.objects[i].pathIndex) {
    //             if (_formattedSide.canvas.objects[i].pathIndex < 1) {
    //                 itemOrder.push(_formattedSide.canvas.objects[i]);
    //             }
    //         }
    //         else {
    //             itemOrder.push(_formattedSide.canvas.objects[i]);
    //         }
    //     }

    //     for (var i = 0; i < _formattedSide.canvas.objects.length; i++) {
    //         if ((_formattedSide.canvas.objects[i].pathIndex) && (_formattedSide.canvas.objects[i].pathIndex > 0)) {
    //             itemOrder.push(_formattedSide.canvas.objects[i]);
    //         }

    //     }
    //     _formattedSide.canvas.objects = itemOrder;

    //     _formattedSide.canvas.objects.forEach((item: any, i: any) => {
    //         item.left = item.left - this.center.x;
    //         item.top = item.top - this.center.y;
    //         item.clipTo = null;
    //         if (!item.type.includes('text') && !!item.fill) {
    //             item.fill = null
    //         }

    //         if (item.selected) {
    //             item.selectable = false;
    //         }

    //         if (item.type.includes('text') && DrawTool.rasterizedText) {
    //             if (DrawTool.rasterizedText![item.uuid]) {
    //                 let textObject = fabric.fabric.util.object.clone(item);
    //                 item.visible = false;

    //                 textObject.type = 'image';
    //                 textObject.fill = 'rgb(0,0,0)';
    //                 textObject.strokeWidth = 0;
    //                 textObject.crossOrigin = 'anonymous';
    //                 textObject.src = DrawTool.rasterizedText![item.uuid];
    //                 textObject.alignX = 'none';
    //                 textObject.alignY = 'none';
    //                 textObject.meetOrSlice = 'meet';
    //                 textObject.filters = [];
    //                 textObject.resizeFilters = [];
    //                 textObject.width = textObject.width * textObject.scaleX + textObject.width * textObject.scaleX * 0.1;
    //                 textObject.height = textObject.height * textObject.scaleY + textObject.height * textObject.scaleY * 0.1;
    //                 textObject.scaleX = 1;
    //                 textObject.scaleY = 1;
    //                 let cos = Math.cos(textObject.angle * Math.PI / 180);
    //                 let sin = Math.sin(textObject.angle * Math.PI / 180);

    //                 textObject.left += textObject.width * textObject.scaleX * 0.05 * cos;
    //                 textObject.top += textObject.width * textObject.scaleX * 0.05 * sin;

    //                 delete textObject['text'];
    //                 delete textObject['fontSize'];
    //                 delete textObject['fontWeight'];
    //                 delete textObject['fontFamily'];
    //                 delete textObject['fontStyle'];
    //                 delete textObject['lineHeight'];
    //                 delete textObject['textDecoration'];
    //                 delete textObject['textAlign'];
    //                 delete textObject['textBackgroundColor'];
    //                 delete textObject['charSpacing'];
    //                 delete textObject['editable'];
    //                 delete textObject['vertical'];
    //                 delete textObject['styles'];

    //                 textObject.pathIndex = item.pathIndex;
    //                 textObject.areaEmbroider = item.areaEmbroider
    //                 _formattedSide.canvas.objects[i] = textObject;
    //                 _formattedSide.canvas.objects.push(item);
    //             }
    //         }
    //         if (item.brush) item.pathIndex = -1;
    //     });

    //     _formattedSide.canvas.objects_print = [];
    //     _formattedSide.canvas.objects_embroidery = [];
    //     _formattedSide.canvas.objects_special_draw = [];
    //     _formattedSide.canvas.objects.forEach((item: any, i: any) => {
    //         if ((item.brush) || (item.pathIndex === -1)) {
    //             _formattedSide.canvas.objects_print.push(item);
    //         } else {

    //             if ((item.pathIndex) && (item.pathIndex == DrawTool.modeSetup.LASER)) {
    //                 _formattedSide.border = this.getBorder();
    //                 item.pathBorderLaser = {
    //                     size: this.size, border: _formattedSide.border.cm,
    //                     center: this.center, _pan_x0: this._pan_x0, _pan_y0: this._pan_y0,
    //                     borderPixel: _formattedSide.border.pixel
    //                 };
    //                 _formattedSide.canvas.objects_special_draw.push(item);
    //             }
    //             else if ((item.pathIndex) && (item.pathIndex == DrawTool.modeSetup.EMBROIDER)) {
    //                 _formattedSide.canvas.objects_embroidery.push(item);
    //             }
    //             else {
    //                 _formattedSide.canvas.objects_print.push(item);
    //             }
    //         }
    //     });

    //     if (this.backdrop) {
    //         _formattedSide.imageUrl = this.imageUrl
    //     }

    //     if (this.FabricBorder) {
    //         _formattedSide.border = this.getBorder();
    //         _formattedSide.factor = {
    //             x: this.getBorder().pixel.width / this.defaultWorkspaceSize.width,
    //             y: this.getBorder().pixel.height / this.defaultWorkspaceSize.height,
    //         }
    //     }

    //     _formattedSide.about = {
    //         appVersion: navigator.appVersion,
    //         userAgent: navigator.userAgent,
    //         language: navigator.language,
    //         languages: navigator.languages,
    //     };
    //     DrawTool._embroideryPaths.splice(4);
    //     let designSide = DrawTool._designBorders.find((b: any) => b.sideId === this.id);
    //     let designSideEmbroider = DrawTool._embroideryPaths.find((b: any) => b.sideId === this.id);
    //     if (typeof designSide !== 'undefined') {
    //         let paths = DrawTool.recs2paths(designSide.border);
    //         const pathOset = 1.1;
    //         var ptS = '';
    //         designSideEmbroider.border.forEach((el: any) => {
    //             if (el.paths && el.cm) {
    //                 ptS += el.paths + ' ';
    //             }
    //         });
    //         if ((DrawTool.modeToolDraw == DrawTool.modeSetup.EMBROIDER)) {
    //             var patN: any = {
    //                 paths: [ptS],
    //                 cm: designSideEmbroider.bd.cm,
    //                 pixel: designSideEmbroider.bd.pixel
    //             };
    //             if (designSideEmbroider.sideId !== '1') {
    //                 delete patN.paths;
    //             }
    //             _formattedSide.design_border = patN;
    //         }

    //     }
    //     return JSON.stringify(_formattedSide);
    // }

    getBorder() {
        let paddingTop = (this.FabricCanvas.height - (this.backdrop.height * this.backdrop.scaleY)) / 2;
        let paddingLeft = (this.FabricCanvas.width - (this.backdrop.width * this.backdrop.scaleX)) / 2;
        let border = {
            cm: {
                left: (this.FabricBorder.left + this.bgOffset.left - paddingLeft) / this.cmSize.width,
                top: (this.FabricBorder.top + this.bgOffset.top - paddingTop) / this.cmSize.height,
                width: (this.FabricBorder.width * this.FabricBorder.scaleX) / this.cmSize.width,
                height: (this.FabricBorder.height * this.FabricBorder.scaleY) / this.cmSize.height,
            },
            pixel: {
                left: this.FabricBorder.left + this.bgOffset.left - paddingLeft,
                top: this.FabricBorder.top + this.bgOffset.top - paddingTop,
                width: this.FabricBorder.width * this.FabricBorder.scaleX,
                height: this.FabricBorder.height * this.FabricBorder.scaleY,
            }
        };

        if (typeof this.border.paths !== 'undefined' && this.border.paths.length > 0)
            (border as any).paths = this.border.paths;

        return border
    }

    /**
 *
 * @param options {Object} options
 * @param options.width {Number} Width of border
 * @param options.height {Number} Height of border
 * @param options.top {Number} Top position
 * @param options.left {Number} Left position
 */
    setBorder(options: any, isReset = false) {

        if (!this.cmSize) {
            throw (new Error(JSON.stringify({ error: errors.sideNoSize })));
            return false;
        }

        if (!options) {
            return false;
        }

        if (this.FabricBorder) {
            this.FabricCanvas.remove(this.FabricBorder);
            this.FabricBorder.remove();
        }

        this.border = options;

        let paddingTop = (this.FabricCanvas.height - (this.backdrop.height * this.backdrop.scaleY)) / 2;
        let paddingLeft = (this.FabricCanvas.width - (this.backdrop.width * this.backdrop.scaleX)) / 2;

        if (typeof options.paths === 'object') {

            let pathCroup: any = [],
                scaleX = 1,
                scaleY = 1,
                left = 0,
                top = 0;

            let that = this;
            if (DrawTool.is_nail && options.paths.length === 1) {
                let originalPath = options.paths[0];
                let modifiPaths = [];
                let firstPath = `"M${options.cm.left} ${options.cm.top} h${0.01} v${0.01} h-${0.01} v-${0.01} M${options.cm.left + options.cm.width} ${options.cm.top + options.cm.height} h -${0.01} v -${0.01} h ${0.01} v ${0.01}"`;
                modifiPaths.push(firstPath);
                while (true) {
                    let paths = originalPath.replace("Z M", "Z,M").split(",");
                    modifiPaths.push(paths[0]);
                    if (paths.length > 1) {
                        originalPath = paths[1];
                    } else {
                        break;
                    }
                }
                options.paths = modifiPaths;
            }

            Array.prototype.forEach.call(options.paths, (item, i) => {
                let path = new fabric.fabric.Path(item);

                path.set({
                    top: (path.top! - top) * scaleY,
                    left: (path.left! - left) * scaleX,
                    strokeWidth: DrawTool.border.strokeWidth,
                    stroke: DrawTool.border.color,
                    fill: i !== 0 ? 'rgba(255,255,255,0.1)' : DrawTool.border.backgroundColor,
                    hasRotatingPoint: false,
                    lockRotation: true,
                    strokeDashArray: DrawTool.border.strokeDashArray,
                    scaleX: scaleX,
                    scaleY: scaleY
                });

                if (i === 0) {
                    path.scaleToWidth(options.cm.width * this.cmSize.width);
                    path.scaleToHeight(options.cm.height * this.cmSize.height);

                    top = path.top!;
                    left = path.left!;
                    scaleX = path.scaleX!;
                    scaleY = path.scaleY!;
                    path.set({
                        top: 0,
                        left: 0
                    });
                }

                pathCroup.push(path);
            });

            this.FabricBorder = new fabric.fabric.Group(pathCroup, {
                width: options.cm.width * this.cmSize.width,
                height: options.cm.height * this.cmSize.height,
                top: options.cm.top * this.cmSize.height + paddingTop - this.bgOffset.top,
                left: options.cm.left * this.cmSize.width + paddingLeft - this.bgOffset.left
            });
        } else {
            if (!isReset) {
                this.FabricBorder = new fabric.fabric.Rect({
                    width: options.cm.width * this.cmSize.width,
                    height: options.cm.height * this.cmSize.height,
                    top: options.cm.top * this.cmSize.height + paddingTop - this.bgOffset.top,
                    left: options.cm.left * this.cmSize.width + paddingLeft - this.bgOffset.left,
                    strokeWidth: DrawTool.border.strokeWidth,
                    stroke: DrawTool.border.color,
                    fill: DrawTool.border.backgroundColor,
                    hasRotatingPoint: false,
                    lockRotation: true,
                    strokeDashArray: DrawTool.border.strokeDashArray
                });
            } else {
                this.FabricBorder = new fabric.fabric.Rect({
                    width: options.cm.width * this.cmSize.width,
                    height: options.cm.height * this.cmSize.height,
                    top: options.cm.top,
                    left: options.cm.left,
                    strokeWidth: DrawTool.border.strokeWidth,
                    stroke: DrawTool.border.color,
                    fill: DrawTool.border.backgroundColor,
                    hasRotatingPoint: false,
                    lockRotation: true,
                    strokeDashArray: DrawTool.border.strokeDashArray
                });
            }
        }

        this.FabricBorder.setCoords();
        this.FabricBorder.id = 'FabricBorder';

        this.FabricBorder.excludeFromExport = true;
        this.FabricBorder.selectable = DrawTool.editable;
        this.FabricBorder.hoverCursor = 'default';
        for (var i = 0; i < this.items._collection.length; i++) {
            this.items._collection[i].set({
                clipTo: this.overlay ? "" : clip(this.FabricBorder)
            });
        }

        this.FabricCanvas.add(this.FabricBorder);
        this.center = this.FabricBorder.getCenterPoint();

        this.FabricCanvas.renderAll();
        return this;
    }

    isExistItem(item: any) {
        let exist = false;

        for (let i in this.layers.list) {
            if (this.layers.list[i].index === item.uuid) {
                exist = true;
                break;
            }
        }

        return exist;
    }

    createCoordinates(coordinates: any) {
        return {
            tl: {
                x: coordinates.tl.x,
                y: coordinates.tl.y
            },
            tr: {
                x: coordinates.tr.x,
                y: coordinates.tr.y
            },
            bl: {
                x: coordinates.bl.x,
                y: coordinates.bl.y
            },
            br: {
                x: coordinates.br.x,
                y: coordinates.br.y
            },
        };
    }


    getOccupiedAreaSize() {
        let occupiedAreaSize = {
            width: 0,
            height: 0
        };

        let maxOccupiedAreaCoordinates: any = false;

        Array.prototype.forEach.call(this.items._collection, (item: any) => {
            if (this.isExistItem(item) && item.intersectsWithObject(this.FabricBorder)) {
                let coordinatesOccupiedArea = this.createCoordinates(item.aCoords);

                if (coordinatesOccupiedArea.tl.x < this.FabricBorder.aCoords.tl.x) {
                    coordinatesOccupiedArea.tl.x = this.FabricBorder.aCoords.tl.x;
                    coordinatesOccupiedArea.bl.x = this.FabricBorder.aCoords.bl.x;
                }

                if (coordinatesOccupiedArea.tl.y < this.FabricBorder.aCoords.tl.y) {
                    coordinatesOccupiedArea.tl.y = this.FabricBorder.aCoords.tl.y;
                    coordinatesOccupiedArea.tr.y = this.FabricBorder.aCoords.tr.y;
                }

                if (coordinatesOccupiedArea.br.x > this.FabricBorder.aCoords.br.x) {
                    coordinatesOccupiedArea.br.x = this.FabricBorder.aCoords.br.x;
                    coordinatesOccupiedArea.tr.x = this.FabricBorder.aCoords.tr.x;
                }

                if (coordinatesOccupiedArea.br.y > this.FabricBorder.aCoords.br.y) {
                    coordinatesOccupiedArea.br.y = this.FabricBorder.aCoords.br.y;
                    coordinatesOccupiedArea.bl.y = this.FabricBorder.aCoords.bl.y;
                }

                if (!maxOccupiedAreaCoordinates) {
                    maxOccupiedAreaCoordinates = coordinatesOccupiedArea;
                } else {
                    if (coordinatesOccupiedArea.tl.x < maxOccupiedAreaCoordinates.tl.x) {
                        maxOccupiedAreaCoordinates.tl.x = coordinatesOccupiedArea.tl.x;
                        maxOccupiedAreaCoordinates.bl.x = coordinatesOccupiedArea.tl.x;
                    }

                    if (coordinatesOccupiedArea.tl.y < maxOccupiedAreaCoordinates.tl.y) {
                        maxOccupiedAreaCoordinates.tl.y = coordinatesOccupiedArea.tl.y;
                        maxOccupiedAreaCoordinates.tr.y = coordinatesOccupiedArea.tr.y;
                    }

                    if (coordinatesOccupiedArea.br.x > maxOccupiedAreaCoordinates.br.x) {
                        maxOccupiedAreaCoordinates.br.x = coordinatesOccupiedArea.br.x;
                        maxOccupiedAreaCoordinates.tr.x = coordinatesOccupiedArea.tr.x;
                    }

                    if (coordinatesOccupiedArea.br.y > maxOccupiedAreaCoordinates.br.y) {
                        maxOccupiedAreaCoordinates.br.y = coordinatesOccupiedArea.br.y;
                        maxOccupiedAreaCoordinates.bl.y = coordinatesOccupiedArea.br.y;
                    }
                }
            }
        });

        let workAreaCenter = this.FabricBorder.getCenterPoint();

        if (maxOccupiedAreaCoordinates) {
            occupiedAreaSize.width = Math.max(Math.abs(workAreaCenter.x - maxOccupiedAreaCoordinates.tl.x), Math.abs(workAreaCenter.x - maxOccupiedAreaCoordinates.tr.x)) * 2;
            occupiedAreaSize.height = Math.max(Math.abs(workAreaCenter.y - maxOccupiedAreaCoordinates.tl.y), Math.abs(workAreaCenter.y - maxOccupiedAreaCoordinates.bl.y)) * 2;
        }

        return occupiedAreaSize;
    }
}

export default Side