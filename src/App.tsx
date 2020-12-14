import React, { Component } from 'react';
import './App.css';
import DrawToolComponent from './Containers/DrawToolComponent';
import DrawTool from './Drawtool/draw-tool/DrawTool';

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
    let dataObj: any
    this.loadToolBar = this.loadToolBar.bind(this)

    dataObj =
    {
      Product:
      {
        id: "IT401",
        full_prin: 0,
        title: "オックスフォードボタンダウンショートスリーブシャツ",
        embroider_able: 0,
        special_draw: 0,
        category_id: 38,
        price: 2800,
        size: "S~XL",
        material: "綿100％",
        color_total: "全3色",
        sale_price: 1800,
        tool_price: 3600,
        item_code_nominal: "1268-01"
      },
      colors:
        [
          {
            ProductColor:
              { id: "ITSU5895", title: "OX ホワイト", value: "#ffffff", is_main: 1 }
            ,
            sides:
              [
                {
                  ProductColorSide:
                  {
                    id: "9637",
                    name: "1",
                    title: "表",
                    image_url: "https://s3-ap-northeast-1.amazonaws.com/storage.up-t.jp/Products/fullsize/1268-01-440 l.png",
                    print_price: 800,
                    content:
                    {
                      id: "1",
                      imageUrl: "https://s3-ap-northeast-1.amazonaws.com/storage.up-t.jp/Products/fullsize/1268-01-440 l.png",
                      size: {
                        cm: { width: 1000, height: 1000 },
                        pixel: { width: 1000, height: 1000 }
                      },
                      canvas:
                      {
                        objects: [],
                        background: "#ffffff",
                        backgroundImage:
                        {
                          type: "image",
                          originX: "center",
                          originY: "center",
                          left: 0,
                          top: 0,
                          width: 1000,
                          height: 1000,
                          fill: "rgb(0,0,0)",
                          stroke: null,
                          strokeWidth: 0,
                          strokeDashArray: null,
                          strokeLineCap: "butt",
                          strokeLineJoin: "miter",
                          strokeMiterLimit: 10,
                          scaleX: 0.73,
                          scaleY: 0.73,
                          angle: 0,
                          flipX: false,
                          flipY: false,
                          opacity: 0.5,
                          shadow: null,
                          visible: true,
                          clipTo: null,
                          backgroundColor: "",
                          fillRule: "nonzero",
                          globalCompositeOperation: "source-over",
                          transformMatrix: null,
                          skewX: 0,
                          skewY: 0,
                          uuid: "7d55846954a24821a426b83a858bd5b9",
                          src: "https://s3-ap-northeast-1.amazonaws.com/storage.up-t.jp/Products/fullsize/1268-01-440 l.png",
                          filters: [],
                          resizeFilters: [],
                          crossOrigin: "anonymous",
                          alignX: "none",
                          alignY: "none",
                          meetOrSlice: "meet"
                        }
                      },
                      border:
                      {
                        cm: { left: 585, top: 414, width: 81, height: 69 },
                        pixel: { left: 585, top: 414, width: 81, height: 69 }
                      }
                    },
                    content_over_flow: null,
                    overlay_image: null,
                    is_main: 1
                  }
                },
                {
                  ProductColorSide:
                  {
                    id: "9638",
                    name: "2",
                    title: "裏",
                    image_url: "https://s3-ap-northeast-1.amazonaws.com/storage.up-t.jp/Products/fullsize/1268-01-440-back l.png",
                    print_price: 1000,
                    content:
                    {
                      id: "2",
                      imageUrl: "https://s3-ap-northeast-1.amazonaws.com/storage.up-t.jp/Products/fullsize/1268-01-440-back l.png",
                      size:
                      {
                        cm: { width: 1000, height: 1000 },
                        pixel: { width: 1000, height: 1000 }
                      },
                      canvas:
                      {
                        objects: [],
                        background: "#ffffff",
                        backgroundImage:
                        {
                          type: "image",
                          originX: "center",
                          originY: "center",
                          left: 0,
                          top: 0,
                          width: 1000,
                          height: 1000,
                          fill: "rgb(0,0,0)",
                          stroke: null,
                          strokeWidth: 0,
                          strokeDashArray: null,
                          strokeLineCap: "butt",
                          strokeLineJoin: "miter",
                          strokeMiterLimit: 10,
                          scaleX: 0.73,
                          scaleY: 0.73,
                          angle: 0,
                          flipX: false,
                          flipY: false,
                          opacity: 0.5,
                          shadow: null,
                          visible: true,
                          clipTo: null,
                          backgroundColor: "",
                          fillRule: "nonzero",
                          globalCompositeOperation: "source-over",
                          transformMatrix: null,
                          skewX: 0,
                          skewY: 0,
                          uuid: "7d55846954a24821a426b83a858bd5b9",
                          src: "https://s3-ap-northeast-1.amazonaws.com/storage.up-t.jp/Products/fullsize/1268-01-440-back l.png",
                          filters: [],
                          resizeFilters: [],
                          crossOrigin: "anonymous",
                          alignX: "none",
                          alignY: "none",
                          meetOrSlice: "meet"
                        }
                      },
                      border:
                      {
                        cm: { left: 356, top: 221, width: 295, height: 407 },
                        pixel: { left: 356, top: 221, width: 295, height: 407 }
                      }
                    },
                    content_over_flow: null,
                    overlay_image: null,
                    is_main: 0
                  }
                },
              ]
          }
        ]
    }

    this.state.dataObj = dataObj.colors
  }

  componentDidMount() {
    this.loadProduct()
  }

  loadToolBar() {
    return <h1>ToolBar</h1>
  }


  loadProduct() {
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


    DrawTool.importJSON(JSON.stringify(data)).then(() => {
      DrawTool.sides.select(color.sides[0].ProductColorSide.content.id);
      // store.dispatch(product_action.setLoadingData(false));

      // for (var i = 0; i < data.length; i++) {
      //   if (data[i].border_special) {
      //     DrawTool.sides.selected.saveBoder(data[i].border, data[i].border_special);
      //   }
      // }
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
