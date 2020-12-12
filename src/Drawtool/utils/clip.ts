export default function (border: any, offset = true) {

    if (typeof border._objects !== 'undefined' && border._objects.length > 0 && border._objects[0].type === 'path') {
        var generate = function () {
            return `
          if(!!this.lastBorder){
              var dataBoder=JSON.parse(this.lastBorder);
              if(dataBoder.isPath){
                    var border = dataBoder.border;
                    var offsetY = dataBoder.offsetY;
                    var offsetX = dataBoder.offsetX;
        
                    this.setCoords();
                    ctx.save();
                    var m = this.calcTransformMatrix();
                    var iM = fabric.util.invertTransform(m);
                    ctx.transform.apply(ctx, iM);
                    ctx.beginPath();
                    for(var i=0;i<dataBoder.allBorder.length;i++){
                      let path = dataBoder.allBorder[i];
                      var valueX=offsetX - dataBoder.minX * border.scaleX + (dataBoder.drawToolBorder.strokeWidth / 2) * border.scaleX;
                      var valueY=offsetY - dataBoder.minY * border.scaleY + (dataBoder.drawToolBorder.strokeWidth / 2) * border.scaleY;
                      DrawTool.drawPathOnCtx.call(
                        path,
                        ctx,
                        valueX,
                        valueY,
                        border.scaleX,
                        border.scaleY
                      );
  
                    }
        
                    ctx.closePath();
                    ctx.restore();
              }
              else
              {
                  this.setCoords();
                  var clipRect = dataBoder.border;
                  var offsetY = dataBoder.offsetY;
                  var offsetX = dataBoder.offsetX;
                  ctx.save();
                  var m = this.calcTransformMatrix();
                  var iM = fabric.util.invertTransform(m);
                  ctx.transform.apply(ctx, iM);
                  ctx.beginPath();
          
                  ctx.rect(
                    offsetX,
                    offsetY,
                    clipRect.width - clipRect.strokeWidth,
                    clipRect.height - clipRect.strokeWidth
                  );
                  ctx.closePath();
                  ctx.restore();
              }
          }
          else
          {
            if((!!DrawTool.sides.selected.FabricBorder._objects)&&(DrawTool.sides.selected.FabricBorder._objects.length>0)){
              var border = fabric.util.object.clone(DrawTool.sides.selected.FabricBorder._objects[0]);
              var offset = ${JSON.stringify(offset)};
              if(offset){
                var offsetY = DrawTool.sides.selected.FabricBorder.top;
                var offsetX = DrawTool.sides.selected.FabricBorder.left;
              } else {
                var offsetY = 0;
                var offsetX = 0;
              }
  
              this.setCoords();
              ctx.save();
              var m = this.calcTransformMatrix();
              var iM = fabric.util.invertTransform(m);
              ctx.transform.apply(ctx, iM);
              ctx.beginPath();
  
              Array.prototype.forEach.call(DrawTool.sides.selected.FabricBorder._objects, function(path, i) {
                DrawTool.drawPathOnCtx.call(
                  path,
                  ctx,
                  offsetX - border.minX * border.scaleX + (DrawTool.border.strokeWidth / 2) * border.scaleX,
                  offsetY - border.minY * border.scaleY + (DrawTool.border.strokeWidth / 2) * border.scaleY,
                  border.scaleX,
                  border.scaleY
                );
              });
  
              ctx.closePath();
              ctx.restore();
            }
            else
            {
  
              this.setCoords();
                var offsetY = DrawTool.sides.selected.FabricBorder.top;
                var offsetX = DrawTool.sides.selected.FabricBorder.left;
                ctx.save();
                var m = this.calcTransformMatrix();
                var iM = fabric.util.invertTransform(m);
                ctx.transform.apply(ctx, iM);
                ctx.beginPath();
        
                ctx.rect(
                  offsetX,
                  offsetY,
                  DrawTool.sides.selected.FabricBorder.width - DrawTool.sides.selected.FabricBorder.strokeWidth,
                  DrawTool.sides.selected.FabricBorder.height - DrawTool.sides.selected.FabricBorder.strokeWidth
                );
                ctx.closePath();
                ctx.restore();
  
            }
          }
          `;
        }
    } else {
        var rect = Object.assign({}, {
            left: border.left,
            top: border.top,
            width: border.width,
            height: border.height,
            strokeWidth: border.strokeWidth,
        });

        var generate = function () {
            return `
          if(!!this.lastBorder){
            var dataBoder=JSON.parse(this.lastBorder);
            if(dataBoder.isPath){
                    var border = dataBoder.border;
                    var offsetY = dataBoder.offsetY;
                    var offsetX = dataBoder.offsetX;
        
                    this.setCoords();
                    ctx.save();
                    var m = this.calcTransformMatrix();
                    var iM = fabric.util.invertTransform(m);
                    ctx.transform.apply(ctx, iM);
                    ctx.beginPath();
                    for(var i=0;i<dataBoder.allBorder.length;i++){
                      let path = dataBoder.allBorder[i];
                      var valueX=offsetX - dataBoder.minX * border.scaleX + (dataBoder.drawToolBorder.strokeWidth / 2) * border.scaleX;
                      var valueY=offsetY - dataBoder.minY * border.scaleY + (dataBoder.drawToolBorder.strokeWidth / 2) * border.scaleY;
                      DrawTool.drawPathOnCtx.call(
                        path,
                        ctx,
                        valueX,
                        valueY,
                        border.scaleX,
                        border.scaleY
                      );
                    }
        
                    ctx.closePath();
                    ctx.restore();
            }
            else
            {
              this.setCoords();
              var clipRect = dataBoder.border;
              var offsetY = dataBoder.offsetY;
              var offsetX = dataBoder.offsetX;
              ctx.save();
              var m = this.calcTransformMatrix();
              var iM = fabric.util.invertTransform(m);
              ctx.transform.apply(ctx, iM);
              ctx.beginPath();
      
              ctx.rect(
                offsetX,
                offsetY,
                clipRect.width - clipRect.strokeWidth,
                clipRect.height - clipRect.strokeWidth
              );
              ctx.closePath();
              ctx.restore();
            }
          }
          else
          {
             this.setCoords();
              var clipRect = ${JSON.stringify(rect)};
              var offset = ${JSON.stringify(offset)};
      
              if(offset){
                var offsetY = clipRect.top;
                var offsetX = clipRect.left;
              } else {
                var offsetY = 0;
                var offsetX = 0;
              }
              ctx.save();
              var m = this.calcTransformMatrix();
              var iM = fabric.util.invertTransform(m);
              ctx.transform.apply(ctx, iM);
              ctx.beginPath();
      
              ctx.rect(
                offsetX,
                offsetY,
                clipRect.width - clipRect.strokeWidth,
                clipRect.height - clipRect.strokeWidth
              );
              ctx.closePath();
              ctx.restore();
          }
  
          `
        }
    }
    return new Function('ctx', generate());
};
