import React, { Component, Fragment } from 'react';
import './App.css';
import DrawToolComponent from './Containers/DrawToolComponent';
import DrawTool from './Drawtool/draw-tool/DrawTool';
import { dataDesign, dataObj, stickerCategories, detailDesign } from './data/datadb'
interface Props { }

interface State {
  dataObj: any
};

class App extends Component<Props, State> {
  state: State = {
    dataObj: {}
  };

  constructor(props: Props) {

    super(props)

    this.loadToolBar = this.loadToolBar.bind(this)
    this.showDesign = this.showDesign.bind(this)
    this.applyDesign = this.applyDesign.bind(this)
    this.state.dataObj = dataObj.colors
  }

  componentDidMount() {
    this.loadProduct()
  }

  loadToolBar() {
    return <Fragment>
      <h1>ToolBar</h1>
      <button onClick={() => this.showDesign()}>Show Design</button>
      <button onClick={() => this.applyDesign()}>Apply Design</button>
    </Fragment>
  }

  applyDesign() {
    console.log(detailDesign);
    let canvasData = detailDesign.canvas

    var sizePayload = DrawTool.capacity_uploadingAllImage;
    for (var i = 0; i < canvasData.objects.length; i++) {
      if (canvasData.objects[i].type == "image") {
        var infoImage = canvasData.objects[i];
        var xhr = new XMLHttpRequest();
        xhr.open("HEAD", infoImage.src!, true); // Notice "HEAD" instead of "GET",
        xhr.onreadystatechange = function () {
          if (this.readyState == this.DONE) {
            var fileSizeGet = parseInt(this.getResponseHeader("Content-Length")!);
            if (fileSizeGet < 0) fileSizeGet = 0;
            if (!isNaN(fileSizeGet)) {
              sizePayload += fileSizeGet;
            }
          }
        };
        xhr.send();
      }
    }
    setTimeout(() => {
      if (sizePayload > 31457280) {
        // swal("お知らせ", "トータルで30mb以上のファイルをアップロードできません。", "warning");
        canvasData.objects = canvasData.objects.filter(item => (item.type != "image"));
        canvasData.objects_print = canvasData.objects_print.filter(item => (item.type != "image"));
      }
      {
        var jsonCompress = JSON.parse(DrawTool.sides.selected.toJSON());
        let old_work_area = {
          size: DrawTool.sides.selected.getOccupiedAreaSize(),
          factor: {
            x: DrawTool.sides.selected.getBorder().pixel.width,
            y: DrawTool.sides.selected.getBorder().pixel.height
          },
          defaultWorkspace: DrawTool.sides.selected.defaultWorkspaceSize,
          oldBorder: DrawTool.sides.selected.FabricBorder,
        }
        let old_work_area1 = JSON.parse(JSON.stringify(old_work_area));

        var dataActionValue = 0;
        for (var i = 0; i < DrawTool.sides.selected.items._collection.length; i++) {
          let itemImage = DrawTool.sides.selected.items._collection[i];
          if (itemImage.type && itemImage.sizeImage) {
            if (itemImage.type == "image") {
              dataActionValue += itemImage.sizeImage;
            }
          }
        }

        // store.dispatch(actions.updateCapacityUploading(0 - dataActionValue));
        for (var i = 0; i < canvasData.objects.length; i++) {
          if (DrawTool.embroider_able) {
            jsonCompress.canvas.objects.push(canvasData.objects[i]);
          }
          else {
            if (canvasData.objects[i].pathIndex) {
              if (canvasData.objects[i].pathIndex != 1)
                jsonCompress.canvas.objects.push(canvasData.objects[i]);
            }
            else
              jsonCompress.canvas.objects.push(canvasData.objects[i]);
          }

        }
        if (DrawTool.embroider_able) {
          if ((canvasData.objects_embroidery) && (canvasData.objects_embroidery.length)) {
            for (var i = 0; i < canvasData.objects_embroidery.length; i++) {
              if ((canvasData.objects[i].pathIndex) && (canvasData.objects[i].pathIndex == 1))
                jsonCompress.canvas.objects_embroidery.push(canvasData.objects_embroidery[i]);
            }
          }
        }
        else
          if (DrawTool.modeToolDraw == DrawTool.modeSetup.LASER) {
            if ((canvasData.objects_special_draw) && (canvasData.objects_special_draw.length)) {
              for (var i = 0; i < canvasData.objects_special_draw.length; i++) {
                if ((canvasData.objects[i].pathIndex) && (canvasData.objects[i].pathIndex == DrawTool.modeSetup.LASER))
                  jsonCompress.canvas.objects_special_draw.push(canvasData.objects_special_draw[i]);
              }
            }
          }

        if ((canvasData.objects_print) && (canvasData.objects_print.length)) {
          for (var i = 0; i < canvasData.objects_print.length; i++) {
            jsonCompress.canvas.objects_print.push(canvasData.objects_print[i]);
          }
        }

        for (var i = 0; i < jsonCompress.canvas.objects.length; i++) {
          if (jsonCompress.canvas.objects[i].type == "image") {
            jsonCompress.canvas.objects[i].width *= jsonCompress.canvas.objects[i].scaleX;
            jsonCompress.canvas.objects[i].height *= jsonCompress.canvas.objects[i].scaleY;
            jsonCompress.canvas.objects[i].scaleX = 1;
            jsonCompress.canvas.objects[i].scaleY = 1;
          }
        }

        for (var i = 0; i < jsonCompress.canvas.objects_print.length; i++) {
          if (jsonCompress.canvas.objects_print[i].type == "image") {
            jsonCompress.canvas.objects_print[i].width *= jsonCompress.canvas.objects_print[i].scaleX;
            jsonCompress.canvas.objects_print[i].height *= jsonCompress.canvas.objects_print[i].scaleY;
            jsonCompress.canvas.objects_print[i].scaleX = 1;
            jsonCompress.canvas.objects_print[i].scaleY = 1;
          }
        }
        DrawTool.sides.selected.addItemLayer(JSON.stringify(jsonCompress), old_work_area1);

        setTimeout(() => {
          DrawTool.sides.selected.setOverlayBorder("", true);

          for (var i = 0; i < DrawTool.sides.selected.items._collection.length; i++) {
            if (DrawTool.sides.selected.items._collection[i].type == "image") {
              var infoImage = DrawTool.sides.selected.items._collection[i];
              var xhr = new XMLHttpRequest();
              xhr.open("HEAD", infoImage.src, true); // Notice "HEAD" instead of "GET",
              xhr.onreadystatechange = function () {
                if (this.readyState == this.DONE) {

                  var fileSizeGet = parseInt(this.getResponseHeader("Content-Length")!);
                  if (fileSizeGet < 0) fileSizeGet = 0;
                  if (!isNaN(fileSizeGet)) {
                    DrawTool.sides.selected.items._collection.forEach((element: any) => {
                      if (element.src == this.responseURL) {
                        element.sizeImage = fileSizeGet;
                      }
                    });
                    // store.dispatch(actions.updateCapacityUploading(fileSizeGet));
                  }
                }
              };
              xhr.send();
            }
          }

          if (DrawTool.embroider_able) {
            // store.dispatch(actions.unselectItem())
            DrawTool.sides.selected.FabricCanvas.deactivateAll();
            DrawTool.sides.selected.FabricCanvas.renderAll();
            DrawTool.sides.select(DrawTool.sides.selected.id);
            DrawTool.sides.selected.panning = false;
            DrawTool.sides.selected.drawingMode(false);
            DrawTool.setEmbroidery(DrawTool.is_embroidery);
          }
        }, 500);
      }
    }, 500);

  }

  showDesign() {
    console.log(dataDesign);

    if (dataDesign.product.colors.length) {

      if (dataDesign.category_id === 62) {
        DrawTool.is_nail = true;
      }
      else {
        DrawTool.is_nail = false;
      }
      if (!dataDesign.product.Product.embroider_able)
        dataDesign.product.Product.embroider_able = 0;
      if (1 === dataDesign.product.Product.embroider_able)
        DrawTool.embroider_able = true;
      else
        DrawTool.embroider_able = false;
      if ((!!dataDesign.product.Product.special_draw) && (dataDesign.product.Product.special_draw >= DrawTool.modeSetup.LASER)) {
        DrawTool.modeToolDraw = dataDesign.product.Product.special_draw;
      }
      else {
        if (DrawTool.embroider_able)
          DrawTool.modeToolDraw = DrawTool.modeSetup.EMBROIDER;
        else
          DrawTool.modeToolDraw = -1;
      }

      const color = dataDesign.product.colors.find((c: any) => {
        return c.ProductColor.id === dataDesign.selected_color_id;
      });
      console.log(color);

      const data = color.sides.map((side: any) => {
        return JSON.parse(side.ProductColorSide.content);
      });

      let overlayImages = "";
      if (color.sides.length === 1) {
        overlayImages = color.sides.map((side: any) => {
          if (side.ProductColorSide.overlay_image) {
            return side.ProductColorSide.overlay_image;
          }
        });
      }
      let currentCategory = dataDesign.category_id;


      DrawTool.importJSON(JSON.stringify(data)).then(() => {
        for (var i = 0; i < data.length; i++) {
          if (data[i].border_special) {
            DrawTool.sides.selected.saveBoder(data[i].border, data[i].border_special);
          }
        }
        DrawTool.sides._collection.forEach((side, index) => {
          // store.dispatch(actions.updateProcessBar(0.8))
          if (dataDesign.sides[side.id]) {
            console.log(JSON.parse(dataDesign.sides[side.id]));

            //console.log("delete fun tion by cuongLV11  LOAD_PRODUCT_WITH_DESIGN");
            //DrawTool.updateEmbroideryBorder(JSON.parse(action.payload.sides[side.id]).embroiderySaveBorder);
            setTimeout(() => {
              if (dataDesign.sides[side.id].startsWith('http')) {

                side.items.addImage(`${dataDesign.sides[side.id]}?_`);
                if (data.length === 1 && overlayImages.length > 0 && overlayImages[index] && !DrawTool.is_nail) {
                  DrawTool.sides.selected.overlay = true
                  DrawTool.sides.selected.setOverlayBorder(overlayImages[index]);
                  DrawTool.sides.selected.FabricCanvas._objects.map((item: any) => {
                    if (item.id != "FabricBorder") {
                      item.clipTo = null
                    }
                  })
                  DrawTool.sides.selected.FabricCanvas.renderAll();
                }
                // store.dispatch(actions.updateProcessBar(0.99));
                // store.dispatch(product_action.setLoadingData(false));
                // store.dispatch(actions.setLoadingProcess(false));
                // store.dispatch(actions.setLoading(false));
                DrawTool.setLayerSetup(-1);
              } else {
                side.fromJSON(dataDesign.sides[side.id], () => {
                  // store.dispatch(product_action.setLoadingData(false));
                  if (data.length === 1 && overlayImages.length > 0 && overlayImages[index] && !DrawTool.is_nail) {
                    DrawTool.sides.selected.overlay = true
                    DrawTool.sides.selected.FabricCanvas._objects.map((item: any) => {
                      if (item.id != "FabricBorder") {
                        item.clipTo = null
                      }
                      DrawTool.sides.selected.setOverlayBorder(overlayImages[index]);
                    })
                    DrawTool.sides.selected.FabricCanvas.renderAll();
                  }

                  setTimeout(() => {
                    // store.dispatch(actions.updateLayers({
                    //   layers: DrawTool.sides.selected.layers.update().reverse(),
                    //   side: DrawTool.sides.selected.id,
                    // }));
                    // store.dispatch(actions.setActiveTool('pointer'));
                    // store.dispatch(actions.updateProcessBar(0.99));
                    // store.dispatch(actions.setLoadingProcess(false));
                    // store.dispatch(actions.setLoading(false));
                    DrawTool.setLayerSetup(-1);
                  }, 2000);
                }, true);
              }
            }, 1000)
          }
        });
        DrawTool.trigger('product:load', {});

        setTimeout(() => {
          if (DrawTool.modeSetup.LASER == DrawTool.modeToolDraw) {
            // store.dispatch(actions.updateBorder());
          }
        }, 3500);
        setTimeout(() => {


          DrawTool.sides._collection.forEach(function (side) {
            console.log(side.items._collection);
            for (var i = 0; i < side.items._collection.length; i++) {
              if (side.items._collection[i].type == "image") {
                var infoImage = side.items._collection[i];
                var xhr = new XMLHttpRequest();
                xhr.open("HEAD", infoImage.src, true); // Notice "HEAD" instead of "GET",
                xhr.onreadystatechange = function () {
                  if (this.readyState == this.DONE) {
                    //console.log("get alll info .................................... checkk allcd  ");
                    //console.log(this);
                    var fileSizeGet = parseInt(this.getResponseHeader("Content-Length")!);
                    var dataurl = this.responseURL;
                    if (fileSizeGet < 0) fileSizeGet = 0;
                    //console.log("APPLY_TEMPLATE ..........................");
                    //console.log(fileSizeGet);
                    //console.log(fileSizeGet);
                    if (!isNaN(fileSizeGet)) {
                      DrawTool.sides._collection.forEach(function (sideIn) {
                        sideIn.items._collection.forEach((element: any) => {
                          if (element.src == dataurl) {
                            element.sizeImage = fileSizeGet;
                          }
                        });
                      });
                      // store.dispatch(actions.updateCapacityUploading(fileSizeGet));
                      // console.log(DrawTool.sides.selected.items._collection);
                      //console.log(linkUp);
                    }
                  }
                };
                xhr.send();
              }
            }

          });
        }, 2100);
      });

      DrawTool.sides.select(
        JSON.parse(JSON.parse(JSON.stringify(color.sides[0].ProductColorSide.content))).id
      );
    }
  }


  loadProduct() {
    // console.log(dataDesign);

    DrawTool._embroideryPaths = [];
    // if (action.payload.Product && action.payload.colors.length) {
    //   if (action.payload.Product.category_id === 62) {
    //     DrawTool.is_nail = true;
    //     // DrawTool.is_ribbon = false;
    //   }
    //   //  else if(action.payload.Product.category_id === 80){
    //   //   DrawTool.is_ribbon = true;
    //   // }
    //   else {
    //     DrawTool.is_nail = false;
    //     // DrawTool.is_ribbon = false;
    //   }



    let color = this.state.dataObj[0]

    // console.log(action.payload);
    // if (!action.payload.Product.embroider_able)
    //   action.payload.Product.embroider_able = 0;
    // if (1 == action.payload.Product.embroider_able)
    //   DrawTool.embroider_able = true;
    // else
    //   DrawTool.embroider_able = false;


    // if ((action.payload.Product.special_draw) && (action.payload.Product.special_draw >= DrawTool.modeSetup.LASER)) {
    //   DrawTool.modeToolDraw = action.payload.Product.special_draw;
    // }
    // else {
    //   if (DrawTool.embroider_able)
    //     DrawTool.modeToolDraw = DrawTool.modeSetup.EMBROIDER;
    //   else {
    //     if (DrawTool.embroider_able)
    //       DrawTool.modeToolDraw = DrawTool.modeSetup.EMBROIDER;
    //     else
    //       DrawTool.modeToolDraw = -1;
    //   }
    // }

    const data = color.sides.map((side: any) => {

      let content = side.ProductColorSide.content

      return content;//JSON.parse(JSON.parse(escapeJSON(side.ProductColorSide.content)));
    });

    // console.log(data);


    // store.dispatch(actions.updateProcessBar(0.7))
    let overlayImages = "";
    if (color.sides.length === 1) {
      overlayImages = color.sides.map((side: any) => {
        if (side.ProductColorSide.overlay_image) {
          return side.ProductColorSide.overlay_image;
        }
      });
    }

    console.log(data);

    DrawTool.importJSON(JSON.stringify(data)).then(() => {
      DrawTool.sides.select(color.sides[1].ProductColorSide.content.id);
      // store.dispatch(product_action.setLoadingData(false));

      for (var i = 0; i < data.length; i++) {
        if (data[i].border_special) {
          DrawTool.sides.selected.saveBoder(data[i].border, data[i].border_special);
        }
      }
      // if (data.length === 1 && overlayImages.length > 0 && overlayImages[0] && !DrawTool.is_nail) {
      //   DrawTool.sides.selected.overlay = true
      //   DrawTool.sides.selected.setOverlayBorder(overlayImages[0]);
      //   DrawTool.sides.selected.FabricCanvas._objects.map((item: any) => {
      //     if (item.id != "FabricBorder") {
      //       item.clipTo = null
      //     }
      //   });
      //   DrawTool.sides.selected.FabricCanvas.renderAll();
      // }
      DrawTool.sides.selected.FabricCanvas.renderAll();
      // store.dispatch(actions.updateProcessBar(0.99))
      setTimeout(() => {

        // store.dispatch(actions.resetDefaultParas(false));
        DrawTool.sides.selected.setSelectableForDesign();
        // store.dispatch(product_action.setLoadingData(false));
        // store.dispatch(actions.setLoading(false));
        // store.dispatch(actions.updateProcessBar(100));
        // store.dispatch(actions.setLoadingProcess(false));
        DrawTool.setLayerSetup(-1);
        // if (DrawTool.modeSetup.LASER == DrawTool.modeToolDraw) {
        //   store.dispatch(actions.updateBorder());
        // }
      }, 2000)
      DrawTool.trigger('product:load', {});
    });
  }


  render() {
    return (
      <div className="App" >
        <div className="app-container">

          <div className="app-container-inner">
            <div className="toolbar">
              {this.loadToolBar()}
            </div>
            <DrawToolComponent colors={this.state.dataObj}></DrawToolComponent>
          </div>
        </div>

      </div >
    );
  }

}

export default App;
