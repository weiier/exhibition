function Vmap(Divid){
	//global
	ip = "10.103.241.247";
	port = "8888";
	//This
    var This = this;
	//存放data.rows
    var buildings;
    //存放data.F
    var frame;
    
    //原始数组
    var Booths;
    var Fonts;
    var Facilities;
    var Frame;
    var maxWidth;
    var maxHeight;
    
    var clickX = []; 
    var clickY = [];
    var mergerBooth = {};
    //扩大倍数
    var ZOOM;
    
    //缩放数组
    var zoom_Booths;
    var zoom_Facilities;
    var zoom_Frame;
    var zoom_Font;
    var zoom_maxWidth;
    var zoom_maxHeight;
    
    var zoom_clickX = [];
    var zoom_clickY = [];
    //保存Facilities
    var ret = [];
     
    //mapDiv的偏移
    var offsetX = 0;
    var offsetY = 0;

    //use to caculate the new position
    var startX = 0;
    var startY = 0;

    //标志位
    var isDragging = false;
    var isPinch = false;
    var showFacilities = false;
    var isState = false;
    
    //画图标志位 
    var isLine = false;
    var isPoint = false;
    var isArea = false;
    var isLineSaved = true;
    var isPointSaved = true;
    var isAreaSaved = true;
     
    var isModify = false;
    
    var isMerger = false;
    //修改中记录点击商铺
	var preClick = -1;
    var clickBooth = {};
    
    //合并中记录点击的商铺
    var preClicks = [];

    //zoom level
    var scale = 1;
    var cssScale = 1;
    var transmark = 0;

    //默认单位缩放
    var defaultZoomScale = 0.05;

    //默认最大最小缩放
    var defaultMaxScale = 2.5;
    var defaultMinScale = 0.4;
    
    //pinch时指间距
    var originDistance = undefined;

    //pinch动作类型
    var zoomAction = null;
    
	var dom = document.getElementById(Divid);
	//搭建dom结构
    dom.style.width = "100%";
    dom.style.height = "90%";
    dom.style.border = "5px solid rgb(38, 147, 233)";
	dom.style.position = "relative";
	dom.style.overflow = "hidden";
    dom.style.background = "white";

	//创建div
    var mapDiv = document.createElement("div");
    //mapDiv.style.width = "auto";
    //mapDiv.style.height = "auto";
    mapDiv.style.position = "absolute";
    mapDiv.style.left = "0";
    mapDiv.style.top = "0";
    mapDiv.id = "map_wrap";
    dom.appendChild(mapDiv);
    
    //创建基图canvas
    var myCanvas = document.createElement("canvas");
    myCanvas.id = "myCanvas";
    myCanvas.height = "1500";
    myCanvas.width = "1400";
    myCanvas.style.position="absolute";
    myCanvas.style.border = "1px solid blue";
	myCanvas.style.left = 0;
    myCanvas.style.top = 0;
    myCanvas.style.zIndex = 1;
    mapDiv.appendChild(myCanvas);
    var context = myCanvas.getContext("2d");
   
    //创建增加canvas
    var canvasAdd;
	var addContext;
   
    //创建修改canvas
    var canvasModify;
	var modifyContext;
   
    //创建合并canvas
    var canvasMerger;
    var mergerContext;
    
	function madeMap(unit_id,floorid,version){
		$.getJSON("http://"+ip+":"+port+"/vmap/unit!around?client=824&vkey=FFE58998-B203-B44E-A95B-8CA2D6CBCD65&unit="+unit_id+"&floor="+floorid
                  +"&version="+version+"&jsoncallback=?",function(data){   
                      reAppend();
                      offsetX = offsetY = 0;
                      mapDiv.style.left = 0;
                      mapDiv.style.top = 0;
                      showFacilities=false;
                      cssScale = 1;            
                      buildings = data.rows;
                      frame = data.F;
                      formatData(buildings,frame);
                      ZOOM = dom.clientWidth/maxWidth;
                      ZOOM = Math.round(ZOOM*10)/10;
                      zoomData(Booths,Facilities,Frame,Fonts,ZOOM);
                      zoom_maxWidth = maxWidth*ZOOM+50;
                      zoom_maxHeight = maxHeight*ZOOM+50;
                      myCanvas.height = zoom_maxHeight;
                      myCanvas.width = zoom_maxWidth;
                      context.fillStyle = "white";
                      context.fillRect(0,0,myCanvas.width,myCanvas.height);
                      selectFonts();
                      drawFrame();
                      drawBoothsState();
                      isState = true;
                      removeFacilities();
                      bindEvent();
                      if ( This.showMap ) {
                          This.showMap();
                      }
			      });
	}
    
    function changefloor(unit_id,floorid,version){
        $.getJSON("http://"+ip+":"+port+"/vmap/unit!around?client=824&vkey=FFE58998-B203-B44E-A95B-8CA2D6CBCD65&unit="+unit_id+"&floor="+floorid
                  +"&version="+version+"&jsoncallback=?",function(data){ 
                      reAppend();
                      offsetX = offsetY = 0;
                      mapDiv.style.left = 0;
                      mapDiv.style.top = 0;
                      showFacilities=false;
                      cssScale = 1;
                      buildings = data.rows;
                      frame = data.F;
                      formatData(buildings,frame);
                      ZOOM = dom.clientWidth/maxWidth;
                      ZOOM = Math.round(ZOOM*10)/10;
                      zoomData(Booths,Facilities,Frame,Fonts,ZOOM);
                      zoom_maxWidth = maxWidth*ZOOM+50;
                      zoom_maxHeight = maxHeight*ZOOM+50;
                      myCanvas.height = zoom_maxHeight;
                      myCanvas.width = zoom_maxWidth;
                      context.fillStyle = "white";
                      context.fillRect(0,0,myCanvas.width,myCanvas.height);
                      selectFonts();
                      drawFrame();
                      drawAllBooths();
                      isState = false;
                      removeFacilities();
                      bindEvent();
                      if ( This.showMap ) {
                          This.showMap();
                      }
                  });
    }
    
    // create layer add
    function layerAdd(){
        if(canvasAdd==undefined){
            canvasAdd = document.createElement("canvas");
            canvasAdd.id = "canvasAdd";
            canvasAdd.height = myCanvas.height;
            canvasAdd.width = myCanvas.width;
            canvasAdd.style.position="absolute";
            canvasAdd.style.zIndex = 2;
            canvasAdd.style.left = 0;
            canvasAdd.style.top = 0;        
            myCanvas.style.opacity = 0.5;
            mapDiv.appendChild(canvasAdd);
            addContext = canvasAdd.getContext("2d");
        }
    }
    
    function createFrame(e_x,e_y,width,length,state) { 
        clickX = [];
        clickY = [];
        zoom_clickX = [];
        zoom_clickY = [];
        var rate = ZOOM*cssScale;
        addContext.clearRect(0,0,canvasAdd.width,canvasAdd.height);
        if (state == "left") { 
            clickX.push((e_x/rate).toFixed(3));
            clickY.push((e_y/rate).toFixed(3));         
            clickX.push((e_x/rate + length).toFixed(3));
            clickY.push((e_y/rate).toFixed(3));         
            clickX.push((e_x/rate + length).toFixed(3));
            clickY.push((e_y/rate + width).toFixed(3));        
            clickX.push((e_x/rate).toFixed(3));
            clickY.push((e_y/rate + width).toFixed(3));
            
            zoom_clickX.push(e_x);
            zoom_clickY.push(e_y);         
            zoom_clickX.push(e_x + length*rate);
            zoom_clickY.push(e_y);         
            zoom_clickX.push(e_x + length*rate);
            zoom_clickY.push(e_y + width*rate);            
            zoom_clickX.push(e_x);
            zoom_clickY.push(e_y + width*rate);
        } else {
            clickX.push((e_x/rate).toFixed(3));
            clickY.push((e_y/rate).toFixed(3));          
            clickX.push((e_x/rate - length).toFixed(3));
            clickY.push((e_y/rate).toFixed(3));            
            clickX.push((e_x/rate - length).toFixed(3));
            clickY.push((e_y/rate - width).toFixed(3));            
            clickX.push((e_x/rate).toFixed(3));
            clickY.push((e_y/rate - width).toFixed(3));
            
            zoom_clickX.push(e_x);
            zoom_clickY.push(e_y);            
            zoom_clickX.push(e_x - length*rate);
            zoom_clickY.push(e_y);            
            zoom_clickX.push(e_x - length*rate);
            zoom_clickY.push(e_y - width*rate);            
            zoom_clickX.push(e_x);
            zoom_clickY.push(e_y - width*rate);
        }        
        drawModify(zoom_clickX,zoom_clickY,addContext);
    }
     
    function drawAdd(x,y,Context){
        Context.strokeStyle = "#df4b26";
        Context.lineJoin = "round";
        Context.lineWidth = 5;
        Context.beginPath();
        Context.moveTo(x - 2,y);
        Context.lineTo(x,y);
        Context.closePath();
        Context.stroke();       
    }
    
    function redrawAdd(){
        addContext.strokeStyle = "#df4b26";
        addContext.lineJoin = "round";
        addContext.lineWidth = 2;
        for(var i=0;i<zoom_clickX.length;i++){
            if(i==0){
              addContext.beginPath();
              addContext.moveTo(zoom_clickX[i],zoom_clickY[i]); 
            }else{
              addContext.lineTo(zoom_clickX[i],zoom_clickY[i]);
            }
        }
        
        if(!isAreaSaved&&!isArea){          
             addContext.closePath();
        }
        addContext.stroke();
    }
     
    function zoomAddData(clickx,clicky,z){
      zoom_clickX = [];
      zoom_clickY = [];
      for(var i=0; i < clickx.length;i++){
        zoom_clickX.push(clickx[i]*z);
        zoom_clickY.push(clicky[i]*z);
      }
    }     
    
    function drawPoint(){
        if(checkAddSaved()){
            isPoint = true;
            isLine = false;
            isArea = false;
            isPointSaved = false;
        }
    }
    
    function drawLine(){
        if(checkAddSaved()){
            isLine = true;
            isPoint = false;
            isArea = false;
            isLineSaved = false;
        }
    }
     
    function drawArea(){
        if(checkAddSaved()){
            isArea = true;
            isLine = false;
            isPoint = false;
            isAreaSaved = false;

        }
    }
    
    function checkAddSaved(){
       if(isAreaSaved&&isLineSaved&&isPointSaved){
           return true;
       } else {
            console.log("finish or save previous add");
           return false;
       }
        
    }
     
    function drawFinished(){
        addContext.strokeStyle = "#df4b26";
        addContext.lineJoin = "round";
        addContext.lineWidth = 2;
        if(isPoint){
            isPoint = false;
        }
        if(isLine){
            for(var i=0;i<zoom_clickX.length;i++){
                if(i==0){
                  addContext.beginPath();
                  addContext.moveTo(zoom_clickX[i],zoom_clickY[i]); 
                }else{
                  addContext.lineTo(zoom_clickX[i],zoom_clickY[i]);
                }
            }

             addContext.stroke();
             isLine = false;	
        }
        
        if(isArea){
            for(var i=0;i<zoom_clickX.length;i++){
                if(i==0){
                  addContext.beginPath();
                  addContext.moveTo(zoom_clickX[i],zoom_clickY[i]); 
                }else{
                  addContext.lineTo(zoom_clickX[i],zoom_clickY[i]);
                }
            }
             addContext.closePath();
             addContext.stroke();
             isArea = false;
        }
    }
     
    function saveAdd(){
        var data = stringData();
        if ( This.saveBooth ) {
            This.saveBooth(data);
        }
        clickX = [];
        clickY = [];
        zoom_clickX = [];
        zoom_clickY = [];
    }
     
    //remove all layer
    function removeLayer(){
        if(canvasAdd!=undefined){
            mapDiv.removeChild(canvasAdd);
            isLine = false;
            isPoint = false;
            isArea = false;
            isLineSaved = true;
            isPointSaved = true;
            isAreaSaved = true;
            clickX = [];
            clickY = [];
            zoom_clickX = [];
            zoom_clickY = [];
            myCanvas.style.opacity = 1.0;
            canvasAdd = undefined;
        }
        
        if(canvasModify!=undefined){
            mapDiv.removeChild(canvasModify);   
            isModify = false;
            clickX = [];
            clickY = [];
            zoom_clickX = [];
            zoom_clickY = [];
            myCanvas.style.opacity = 1.0;
            canvasModify = undefined;
        }
        
        if(canvasMerger!=undefined){
            mapDiv.removeChild(canvasMerger);   
            isMerger = false;
            preClicks = [];
            clickX = [];
            clickY = [];
            zoom_clickX = [];
            zoom_clickY = [];
            myCanvas.style.opacity = 1.0;
            canvasMerger = undefined;
        }
    }
     
    //create layer modify 
    function layerModify(){
        if(canvasModify==undefined){
            canvasModify = document.createElement("canvas");
            canvasModify.id = "canvasModify";
            canvasModify.height = myCanvas.height;
            canvasModify.width = myCanvas.width;
            canvasModify.style.position="absolute";
            canvasModify.style.zIndex = 3;
            canvasModify.style.left = 0;
            canvasModify.style.top = 0;
            myCanvas.style.opacity = 0.5;
            mapDiv.appendChild(canvasModify);
            modifyContext = canvasModify.getContext("2d");

        }
    }
    
    $('#map_wrap').on("click","#canvasModify",function(e){
        // e.preventDefault();
        reAppend();
	    
        if(!isModify){
            preClick = getClickBooth(e.offsetX,e.offsetY);
            if(preClick!=-1){
                console.log(preClick);
                console.log(zoom_Booths[preClick]);
                clickX = [];
                clickY = [];
                zoom_clickX = [];
                zoom_clickY = [];
                clickBooth = {};
                if(!zoom_Booths[preClick]){
                    return ;
                }

                for(var j=0;j<zoom_Booths[preClick].paths.length-1;j++){   
                    clickX.push(Booths[preClick].paths[j][0]);
                    clickY.push(Booths[preClick].paths[j][1]);
                    zoom_clickX.push(zoom_Booths[preClick].paths[j][0]);
                    zoom_clickY.push(zoom_Booths[preClick].paths[j][1]);
                }
                clickBooth.posX = Booths[preClick].Pos_x;
                clickBooth.posY = Booths[preClick].Pos_y;
                clickBooth.Display = Booths[preClick].Display;
                
                drawModify(zoom_clickX,zoom_clickY,modifyContext);
            }
        }else{
            var mouseX = e.offsetX;
            var mouseY = e.offsetY;
            var newClick = getMinDistance(mouseX,mouseY);
            zoom_clickX[newClick] = mouseX;
            zoom_clickY[newClick] = mouseY;
            clickX[newClick] = mouseX/(ZOOM*cssScale);
            clickY[newClick] = mouseY/(ZOOM*cssScale);
            drawModify(zoom_clickX,zoom_clickY,modifyContext);
        }
        if ( This.modifyClick && ( !isModify ) ) {
            This.modifyClick({
                unitId : zoom_Booths[preClick].unitid,
                unitName : zoom_Booths[preClick].Display,
                x : e.offsetX,
                y : e.offsetY});
        }
        return false;
    }); 
     
    function startModify(){
        if(preClick!=-1){
            isModify = true;
        }
    }
    
    function saveModify(){
        if(isModify){
            var data = stringData();
            if(This.modifyBooth){
                This.modifyBooth(data);
            }
            isModify = false;
            clickX = [];
            clickY = [];
            zoom_clickX = [];
            zoom_clickY = [];
        }
    }
     
    function drawModify(zx,zy,Context){
        if(Context == modifyContext){
            Context.clearRect(0,0,canvasModify.width,canvasModify.height);
        }
        
        for(var j=0;j<zx.length;j++){              
            drawAdd(zx[j],zy[j],Context);
        }
        Context.strokeStyle = "#df4b26";
        Context.lineJoin = "round";
        Context.lineWidth = 2;
        Context.beginPath();
        for(var k=0;k<zx.length;k++){
            if(k==0){
              Context.moveTo(zx[k],zy[k]); 
            }else{
              Context.lineTo(zx[k],zy[k]);
            }
        }
        Context.globalAlpha = 0.5;
        Context.fillStyle = "#d2e9f7";
        Context.fill();
        Context.closePath();
        Context.stroke();

        Context.font="15px Georgia";
        Context.textAlign = "left";
        Context.fillStyle = "#000000";
        //Context.fillText(clickBooth.Display,clickBooth.posX*ZOOM*cssScale-15,clickBooth.posY*ZOOM*cssScale);		
    }
    
    
    function layerMerger(){
         if(canvasMerger==undefined){
            canvasMerger = document.createElement("canvas");
            canvasMerger.id = "canvasMerger";
            canvasMerger.height = myCanvas.height;
            canvasMerger.width = myCanvas.width;
            canvasMerger.style.position="absolute";
            canvasMerger.style.zIndex = 3;
            canvasMerger.style.left = 0;
            canvasMerger.style.top = 0;
            myCanvas.style.opacity = 0.5;
            mapDiv.appendChild(canvasMerger);
            mergerContext = canvasMerger.getContext("2d");

        }
    }
    
    
    $('#map_wrap').on("click","#canvasMerger",function(e){
        // e.preventDefault();
        //reAppend();
        preClick = getClickBooth(e.offsetX,e.offsetY);
        if ( publicElement.login_id == Booths[preClick].proxy_id ){
            console.log(publicElement.login_id);
            if(preClick!=-1 && !isMerger){
                if( preClicks.indexOf(preClick) < 0 ) {
                    preClicks.push(preClick);
                    drawMergerClick(preClick);
                }
            }
        }
        
        return false;
    }); 
    
    function drawMergerClick(index){
        zoom_clickX = [];
        zoom_clickY = [];
        clickBooth = {};
        if(!zoom_Booths[index]){
            return ;
        }

        for(var j=0;j<zoom_Booths[index].paths.length-1;j++){   
            zoom_clickX.push(zoom_Booths[index].paths[j][0]);
            zoom_clickY.push(zoom_Booths[index].paths[j][1]);
        }
        clickBooth.posX = Booths[index].Pos_x;
        clickBooth.posY = Booths[index].Pos_y;
        clickBooth.Display = Booths[index].Display;

        drawModify(zoom_clickX,zoom_clickY,mergerContext);
    }
    
    function mergerBooths(){
        clickX = [];
        clickY = [];
        clickBooth = {};
        //isMerger = true;
        getMinAndMax(preClicks);
        
        clickX.push(mergerBooth.maxx);
        clickY.push(mergerBooth.maxy);
     
        clickX.push(mergerBooth.maxx);
        clickY.push(mergerBooth.miny);
        
        clickX.push(mergerBooth.minx);
        clickY.push(mergerBooth.miny);
        
        clickX.push(mergerBooth.minx);
        clickY.push(mergerBooth.maxy);
        //zoomAddData(clickX,clickY,ZOOM*scale);
        //mergerContext.clearRect(0,0,canvasMerger.width,canvasMerger.height);
        drawModify(zoom_clickX,zoom_clickY,mergerContext);
        
        if ( This.mergerClicks ) {
            var clickBooths = "";
            var dataStr = stringData();
            for(var i = 0; i < preClicks.length; i++) {
                clickBooths += Booths[preClicks[i]].unitid+"*";
            }
            console.log(clickBooths);
            This.mergerClicks({
                idlist : clickBooths,
                data : dataStr
            });
        }
    }
    
    function getMinAndMax(index){
        mergerBooth.maxx = 0;
        mergerBooth.maxy = 0;
        mergerBooth.minx = 999999;
        mergerBooth.miny = 999999;
        for( var i=0;i<index.length;i++){
            if(mergerBooth.maxx < Booths[index[i]].maxX){
                mergerBooth.maxx = Booths[index[i]].maxX;
            }
            if(mergerBooth.maxy < Booths[index[i]].maxY){
                mergerBooth.maxy = Booths[index[i]].maxY;
            }
            if(mergerBooth.minx > Booths[index[i]].minX){
                mergerBooth.minx = Booths[index[i]].minX;
            }
            if(mergerBooth.miny > Booths[index[i]].minY){
                mergerBooth.miny = Booths[index[i]].minY;
            }
        }
    }
    
    function getMinDistance(mx,my){
        var minDistance = 9999999;
        var flag = -1;
        for(var i = 0 ;i < zoom_clickX.length; i++){
            x = mx - zoom_clickX[i];
            y = my - zoom_clickY[i];
            if(x*x+y*y <= minDistance){
                minDistance = x*x + y*y;
                flag = i;
            }
        }
        return flag;
    }
    
    function stringData(){
        var max_x = 0;
        var max_y = 0;
        var min_x = 9999999;
        var min_y = 9999999;
        var coord_x =0;
        var coord_y =0;
        var dataStr = "";
        var pathStr = "";
        for (var i = 0 ;i < clickX.length; i++){
            if(clickX[i] >= max_x){
                max_x = parseFloat(clickX[i]);
            }
            if(clickY[i] >= max_y){
                max_y = parseFloat(clickY[i]);
            }
            if(clickX[i] <= min_x){
                min_x = parseFloat(clickX[i]);
            }
            if(clickY[i] <= min_y){
                min_y = parseFloat(clickY[i]);
            }
            pathStr+=clickX[i]+","+clickY[i]+";";
        }
        coord_x = (max_x + min_x)/2;
        coord_y = (max_y + min_y)/2;
  
        pathStr += clickX[0]+","+clickY[0]+";";
        dataStr += "'max_x':'"+max_x+"','min_x':'"+min_x+"','max_y':'"+max_y+"','min_y':'"+min_y
        +"','coord_x':'"+coord_x+"','coord_y':'"+coord_y+"','frame':'"+pathStr+"'";

        return dataStr;
    } 
     
    //得到字体高度 参数eg：style = "font-family: " + family + "; font-size: " + size + ";";
    function determineFontHeight(fontStyle) {
      var body = document.getElementsByTagName("body")[0];
      var dummy = document.createElement("div");
      var dummyText = document.createTextNode("M");
      dummy.appendChild(dummyText);
      dummy.setAttribute("style", fontStyle);
      body.appendChild(dummy);
      var result = dummy.offsetHeight;
      body.removeChild(dummy);
      return result;
    };
     
    function selectFonts(){
        for(var i=0;i<zoom_Font.length;i++){
            zoom_Font[i].show = 1;
            var flag = true; 
            for(var j=i+1;j<zoom_Font.length;j++){
                var p_1 = zoom_Font[i].paths;
                var p_2 = zoom_Font[j].paths;
                
                for(var k=0;k<p_1.length;k++){
                    // p_2 的 一三两点为最大最小点
                    if(p_1[k][0] >= p_2[0][0]&&p_1[k][0] <= p_2[2][0]&&p_1[k][1]>=p_2[0][1]&&p_1[k][1]<=p_2[2][1]){
						flag = false;
						zoom_Font[i].show = 0;
					}
                }
                if(!flag) break;
            }
        }
    }
	
    function drawFrame(){
        if(!zoom_Frame[0]){
            return;
        }
        context.beginPath();
        for(var j=0;j<zoom_Frame[0].paths.length;j++){
			if(j==0){
				context.moveTo(zoom_Frame[0].paths[j][0],zoom_Frame[0].paths[j][1]);
			}else{
				context.lineTo(zoom_Frame[0].paths[j][0],zoom_Frame[0].paths[j][1]);
			}
		}
		context.lineWidth = 1.5;
		context.stroke();
    }
    
    function drawAllBooths(){
        for(var i=0;i<zoom_Booths.length;i++){
            if(Booths[i].proxy_id == publicElement.login_id ){
                drawBooth(i,Booths[i].proxy_color);
            }else{
                drawBooth(i);
            }
        }
    }
    
    function drawBoothsState() {
        for(var i=0;i<zoom_Booths.length;i++){
            if(Booths[i].block_state == 0){
                drawBooth(i,"#e6eece");
            } else if(Booths[i].block_state == 1){
                drawBooth(i,"#428bca");
                context.font="10px Helvetica,Arial,sans-serif";
                context.textAlign = "left";
                context.textBaseline = "top";
                context.fillStyle = "#000000";
                context.fillText(Booths[i].company_show_name,zoom_Booths[i].Pos_x,zoom_Booths[i].Pos_y);
            }  else if(Booths[i].block_state == 2){
                drawBooth(i,"#5bc0de");
            }           
        }
    }
    
    function drawBooth(i,color,rotate,fontColor){	
		if(!zoom_Booths[i]){
			return ;
		}
        var nums = [];     
		context.beginPath();
        for(var j=0;j<zoom_Booths[i].paths.length;j++){
            if(j==0){
                context.moveTo(zoom_Booths[i].paths[j][0],zoom_Booths[i].paths[j][1]);
            }else{
                context.lineTo(zoom_Booths[i].paths[j][0],zoom_Booths[i].paths[j][1]);
            }
        }
        
       /* if(zoom_Font[i].show == 1){
            context.globalAlpha = 0.5;
        }else{
            context.globalAlpha = 1.0;
        }*/
		context.fillStyle = color ? color : "#e6eece";
		context.fill();
		context.lineWidth = 1.0;
		context.stroke();
        
        context.font="10px Helvetica,Arial,sans-serif";
        context.textAlign = "left";
        context.textBaseline = "top";
        context.fillStyle = "#000000";
        if((cssScale >= 1) && (zoom_Font[i].show == 1)){
            if( typeof Booths[i].booth_num != "string" ){
                nums = Booths[i].booth_num;
                if(nums[0] !=="*"){
                    context.fillText(nums[0],zoom_Booths[i].minX,zoom_Booths[i].minY);
                    context.fillText(Booths[i].block_area+"m²",zoom_Booths[i].minX,zoom_Booths[i].minY+12);
                }
                if(nums[1] !=="*"){
                	if( zoom_Booths[i].maxY - zoom_Booths[i].minY > 36){
                		context.fillText(nums[1],zoom_Booths[i].minX,zoom_Booths[i].maxY-12);
                	}
                }
                if(nums[0] ==="*" && nums[1] != "*"){
                    context.fillText(Booths[i].block_area+"m²",zoom_Booths[i].minX,zoom_Booths[i].maxY-24);
                }
            }else{
                context.fillText(Booths[i].booth_num,zoom_Booths[i].minX,zoom_Booths[i].minY);

            }
            
        }   
        context.font="10px Helvetica,Arial,sans-serif";
        //context.textAlign = "left";
        //context.textBaseline = "top";
        context.fillStyle = fontColor ? fontColor : "#000000";
        
        if(rotate == 1){
            context.fillText(zoom_Booths[i].Display,zoom_Booths[i].Pos_x-zoom_Font[i].length/2,zoom_Booths[i].Pos_y-10);
        } else if(rotate == 0){
            context.save();
            context.rotate( Math.PI * 1/2);
            context.fillText(zoom_Booths[i].Display,zoom_Booths[i].Pos_y-zoom_Font[i].length/2,-zoom_Booths[i].Pos_x-10);
            context.restore();
        } else {
            /*if(zoom_Font[i].show==1){

                 context.beginPath();
                context.moveTo(zoom_Font[i].paths[0][0],zoom_Font[i].paths[0][1]);
                context.lineTo(zoom_Font[i].paths[1][0],zoom_Font[i].paths[1][1]);
                context.lineTo(zoom_Font[i].paths[2][0],zoom_Font[i].paths[2][1]);
                context.lineTo(zoom_Font[i].paths[3][0],zoom_Font[i].paths[3][1]);
                context.closePath();  
                context.lineWidth = 1.0;
                context.stroke();
                context.fillText(zoom_Font[i].display,zoom_Font[i].Pos_x,zoom_Font[i].Pos_y);	
            } */	
        }
	}  
    
    //展示或删除公共设施
	function toggleFacilities(){
		if(showFacilities){
			removeFacilities();
			showFacilities=false;
		}else{
			drawFacilities();
			showFacilities=true;
		}
	}
    
    //添加facilities
	function drawFacilities(){
		for(var i=0;i<zoom_Facilities.length;i++){
			var iElement = document.createElement('i');
			iElement.className="facilities_icon";
			iElement.style.left=zoom_Facilities[i].minX+'px';
			iElement.style.top=zoom_Facilities[i].minY+'px';
			iElement.style.fontWeight="normal";
			iElement.style.fontFamily="vmap";
			iElement.style.fontSize=20+cssScale*5+"px";
            iElement.style.padding=0;
            iElement.style.margin=0;
            iElement.style.zIndex=10;
			iElement.style.lineHeight="100%";
            iElement.style.cursor="default";
            iElement.style.userSelect="none";
            iElement.style.fontStyle="normal";
            iElement.style.position = "absolute";
            iElement.style.color = "blue";
			iElement.innerHTML=zoom_Facilities[i].display;
			iElement.i=i;
		
            iElement.onclick=function(){
			  /*if(preClick>=0){
                  drawBooth(preClick);
                  preClick=-1;
                  document.getElementById('tip').style.display="none";
			  }*/
			  if( This.showFacility ) {
                This.showFacility ({
                    facilityName : zoom_Facilities[this.i].name,
                    x : zoom_Facilities[this.i].Pos_x,
                    y : zoom_Facilities[this.i].Pos_y
                })
              }
			 }
            
			document.getElementById('map_wrap').appendChild(iElement);
		}
	}
    
    //删除facilities
	function removeFacilities(){
		//getElementByClassName的兼容问题
		if(document.getElementsByClassName){
			ret=document.getElementById('map_wrap').getElementsByClassName('facilities_icon');
		}else{
			var nodes=document.getElementsByTagName('i');
			for(var i=0;i<nodes.length;i++){
				if(nodes[i].className=='facilities_icon'){
					ret.push(nodes[i]);
				}
			}
		}
		var l=ret.length;
		for(var i=0;i<l;i++){
			document.getElementById('map_wrap').removeChild(ret[0]);
		}
		
	}
    
      //点击，获得商铺
	function selectBooth(e){
		reAppend();	
		if(e.offsetX==undefined){
			e.offsetX=e.layerX;    
			e.offsetY=e.layerY;
            console.log("e.offset doesn't work layerX:"+e.layerX+"layerY:"+e.layerY);
		}else{
            console.log("e.offset  works X:"+e.offsetX+"Y:"+e.offsetY);
        }
		var i=getClickBooth(e.offsetX,e.offsetY);
        if(i!=-1){
            if (This.showBooth  ) {
                This.showBooth({
                    unitIndex : i,
                    paths : Booths[i].paths.length,
                    max_x : Booths[i].maxX,
                    max_y : Booths[i].maxY,
                    min_x : Booths[i].minX,
                    min_y : Booths[i].minY,
                    width : maxWidth,
                    height : maxHeight,
                    coord_x : Booths[i].Pos_x,
                    coord_y : Booths[i].Pos_y,
                    unitId : Booths[i].unitid,
                    unitName : Booths[i].Display,
                    booth_num : Booths[i].booth_num,
                    proxy_id : Booths[i].proxy_id,
                    x : e.offsetX,
                    y : e.offsetY});
            }
            console.log(Booths[i]);
            //return zoom_Booths[i];
        }
	}
    
    function redrawBooth(e){
        reAppend();
		
		if(e.offsetX==undefined){
			e.offsetX=e.layerX;
			e.offsetY=e.layerY;
            console.log("e.offset doesn't work");
		}
		var i=getClickBooth(e.offsetX,e.offsetY);
        if(i!=-1){	
            if (This.saveUUID ){
                This.saveUUID({
                    unitId : zoom_Booths[i].unitid,
                    unitName : zoom_Booths[i].Display});
            }
            drawBooth(i,'gray');
            return zoom_Booths[i];
        }
    }
    
    function bindClickEvent(type){
       if(type == "detail"){
            $("#myCanvas").unbind("click");
            $("#myCanvas").bind("click",function(e){
                selectBooth(e);
            });
        }else if(type == "draw"){
            $("#myCanvas").unbind("click");
            $("#myCanvas").bind("click",function(e){
                redrawBooth(e);
            });
        }
    }
    
    //得到点击的商铺
	function getClickBooth(x,y){
		var dot={x:x,y:y};
		//以该点为交叉点创建2条垂直交叉的线，并以该点分割成4个线段
		var lines={};
		lines.left={one:{x:0,y:y},two:dot};
		lines.right={one:dot,two:{x:zoom_maxWidth,y:y}};
		lines.top={one:dot,two:{x:x,y:0}};
		lines.bottom={one:dot,two:{x:x,y:zoom_maxHeight}};
		//碰撞检测 找相交的线==4  先确定点在min、max确定的矩形框范围内，但由于图形不一定是矩形，所以要判断四条线段均与图形相交，该点才处于图形之内。
		
		for(var i =0 ;i<zoom_Booths.length;i++){
			
			if(zoom_Booths[i].minX<x && zoom_Booths[i].maxX>x && zoom_Booths[i].minY<y && zoom_Booths[i].maxY>y){
				//循环路径上的每个点
				var tmp_dot=[];
				var crossFlag=[0,0,0,0];
				for(var j =0 ;j<zoom_Booths[i].paths.length;j++){
					
					var newLine={one:{x:tmp_dot[0],y:tmp_dot[1]},two:{x:zoom_Booths[i].paths[j][0],y:zoom_Booths[i].paths[j][1]}};
					tmp_dot=zoom_Booths[i].paths[j];
                    
					if(intersect(lines.left,newLine)){
						crossFlag[0]++;
						//continue;
					}
					if(intersect(lines.right,newLine)){
						crossFlag[1]++;
						//continue;
					}
					if(intersect(lines.top,newLine)){
						crossFlag[2]++;
						//continue;
					}
					if(intersect(lines.bottom,newLine)){
						crossFlag[3]++;
						//continue;
					}
					
				}
                //取余，点在外会与图形相交两次
				if(crossFlag[0]%2 && crossFlag[1]%2 && crossFlag[2]%2 && crossFlag[3]%2){
					return i;
				}
			}
			
		}
		return -1;
	}
    
    function multiply(p1,p2,p0){
		return ((p1.x-p0.x)*(p2.y-p0.y)-(p2.x-p0.x)*(p1.y-p0.y));    
	}
	//确定两条线段是否相交，向量叉乘
	function intersect(u,v){
		return ((Math.max(u.one.x,u.two.x)>=Math.min(v.one.x,v.two.x))&&
				(Math.max(v.one.x,v.two.x)>=Math.min(u.one.x,u.two.x))&&
				(Math.max(u.one.y,u.two.y)>=Math.min(v.one.y,v.two.y))&&
				(Math.max(v.one.y,v.two.y)>=Math.min(u.one.y,u.two.y))&&
				(multiply(v.one,u.two,u.one)*multiply(u.two,v.two,u.one)>=0)&&
				(multiply(u.one,v.two,v.one)*multiply(v.two,u.two,v.one)>=0));
	}

    
    function draw(){
        if ( This.zoom ) {
            This.zoom();
        }
        
        context.clearRect(0,0,myCanvas.width,myCanvas.height);
        zoomData(Booths,Facilities,Frame,Fonts,ZOOM*scale);
        
        zoom_maxWidth = maxWidth*ZOOM*scale+50;
        zoom_maxHeight = maxHeight*ZOOM*scale+50;
        
        myCanvas.height = zoom_maxHeight;
        myCanvas.width = zoom_maxWidth;
        context.fillStyle = "white";
        context.fillRect(0,0,myCanvas.width,myCanvas.height);
        selectFonts();
        drawFrame();
        if ( isState ) {
        	drawBoothsState();
        } else {
        	drawAllBooths(); 
        }
        removeFacilities();
        showFacilities=false;
        
        if(canvasAdd!=undefined){
            addContext.clearRect(0,0,canvasAdd.width,canvasAdd.height);
            zoomAddData(clickX,clickY,ZOOM*scale);
            canvasAdd.width = zoom_maxWidth;
            canvasAdd.height = zoom_maxHeight;
            drawModify(zoom_clickX,zoom_clickY,addContext);
        }
        
        if(canvasModify!=undefined){
            zoomAddData(clickX,clickY,ZOOM*scale);
            canvasModify.width = zoom_maxWidth;
            canvasModify.height = zoom_maxHeight;
            drawModify(zoom_clickX,zoom_clickY,modifyContext);
        }
        
        if(canvasMerger!=undefined){
            canvasMerger.width = zoom_maxWidth;
            canvasMerger.height = zoom_maxHeight;
            if( !isMerger ){
                for (var i=0; i<preClicks.length;i++){
                    drawMergerClick(preClicks[i]);
                }
            } else{
               zoomAddData(clickX,clickY,ZOOM*scale);
               drawModify(zoom_clickX,zoom_clickY,mergerContext);
            }
        }
    }
    
    function moveStart(event){
        isDragging = true;
        startX = event.gesture.deltaX;
        startY = event.gesture.deltaY;
        
        return false;
    }
    
    function moving(event){
        event.gesture.preventDefault();
        if(isDragging){
            var dx = event.gesture.deltaX - startX;
            var dy = event.gesture.deltaY - startY;
            startX = event.gesture.deltaX;
            startY = event.gesture.deltaY;
            offsetX += dx;
            offsetY += dy;
            move();
        }
        //return false;
    }
    
    function moveEnd(event){
        if(isDragging){
            isDragging = false;
        }
        return false;
        
    }
    
    function move(){
        reAppend();
        if(offsetX<-myCanvas.width+200){
            mapDiv.style.left = -myCanvas.width+200 + "px";
        }else if(offsetX>dom.clientWidth-200){
            mapDiv.style.left = dom.clientWidth-200 + "px";
        }else{
            mapDiv.style.left = offsetX + "px";
        }
        
        if(offsetY<-myCanvas.height+200){
            mapDiv.style.top = -myCanvas.height+200 + "px";
        } else if(offsetY>dom.clientHeight-200){
            mapDiv.style.top = dom.clientHeight-200 + "px"
        } else{
            mapDiv.style.top = offsetY + "px";
        }
        //alert(mapDiv.style.left+";"+mapDiv.style.top);
    }
    
    //zoom  and keep the pinch center stay where it was
    function zoomToPoint( point ) {
        if ( point == null ) {
            return;
        }
        var left = parseFloat(mapDiv.style.left);
        var top =  parseFloat(mapDiv.style.top);
        var midLeft = point.x -left;
        var midTop = point.y - top;
        midLeft /= cssScale;
        midTop /= cssScale;
        if ( point.action == -1 && cssScale <= defaultMinScale ) {
            return;
        }
        if ( point.action == 1 && cssScale >= defaultMaxScale ) {
            return;
        }
        if ( point.action == 1 ) {
            cssScale += defaultZoomScale;
        } else {
            cssScale -= defaultZoomScale;
        }

        midLeft *= cssScale;
        midTop *= cssScale;
        
        offsetX = point.x - midLeft;
        offsetY =  point.y - midTop;
        
        move();
        
        //scale=cssScale;           
        
        mapDiv.style.transform = "scale("+cssScale+")";
        mapDiv.style.mozTransform = "scale("+cssScale+")";
        mapDiv.style.webkitTransform = "scale("+cssScale+")";
        mapDiv.style.oTransform = "scale("+cssScale+")";
        
        //mapDiv.style.transformOrigin=point.mid_x +" "+point.mid_y;
        //draw();
        
    }
    
     function zoomIn(){
         if(cssScale >= defaultMaxScale){
            return;
         }
         cssScale +=defaultZoomScale;
         scale = cssScale;
         draw();
     }
     
      function zoomOut(){
         if(cssScale <= defaultMinScale){
            return;
         }
         cssScale -=defaultZoomScale;
         scale = cssScale;
         draw();
     }
     
    //get distance from hammer gestures
    function getDistance( touches ) {
        var p1 = touches[0];
        var p2 = touches[1];
        x = p1.pageX - p2.pageX;
        y = p2.pageY - p2.pageY;
        var result = Math.sqrt( x*x + y*y );
        return result;
    }
    
    function pinchStart(event){
        isPinch = true;
        var gesture = event.gesture;
        event.gesture.preventDefault();
        if ( originDistance === undefined ) { 
            originDistance = getDistance( gesture.touches );
        }
        // console.log(mapDiv.offsetLeft+";"+mapDiv.offsetTop+";"+event.gesture.center.pageX+";"+event.gesture.center.pageY);
        var currentDistance = getDistance( gesture.touches );
        if ( currentDistance+3 < originDistance ) {
            zoomAction = { x : event.gesture.center.pageX - mapDiv.offsetLeft,
                           y : event.gesture.center.pageY - mapDiv.offsetTop,
                           action : -1,
                           mid_x :  event.gesture.center.pageX,
                           mid_y :  event.gesture.center.pageY 
                         };
            originDistance = currentDistance;
            if ( 0 === transmark && cssScale - defaultZoomScale > defaultMinScale ) {
                scale = 1;
                draw();
                transmark = 1;
            }
            zoomToPoint(zoomAction);
        } else if ( currentDistance > originDistance+3 ) {
            zoomAction = { x : event.gesture.center.pageX - mapDiv.offsetLeft,
                           y : event.gesture.center.pageY - mapDiv.offsetTop,
                           action : 1,
                           mid_x :  event.gesture.center.pageX,
                           mid_y :  event.gesture.center.pageY 
                         };
            originDistance = currentDistance;
            if ( 0 === transmark && cssScale + defaultZoomScale < defaultMaxScale ) {
                scale = 1;
                draw();
                transmark = 1;
            }
            zoomToPoint(zoomAction);
        }
        
        return false;
    }
    
    function pinchEnd(event) {
        if(isPinch){
            isPinch = false;
            transmark = 0;            
            mapDiv.style.transform = "scale("+1+")";
            mapDiv.style.mozTransform = "scale("+1+")";
            mapDiv.style.webkitTransform = "scale("+1+")";
            mapDiv.style.oTransform = "scale("+1+")";
            scale = cssScale; 
            draw();
            //move();
            
            originDistance = undefined;
            zoomAction = null;
        }
        return false;
    }
    
    function bindEvent(){
        
        var hammer = new Hammer(mapDiv);
        hammer.on("dragstart",moveStart);
        hammer.on("drag",moving);
        hammer.on("dragend",moveEnd);
        hammer.on("pinch",pinchStart);
        hammer.on("release",pinchEnd);
    }
    
    function reAppend() {
		var $mapDiv = $(mapDiv).detach();
		$(dom).append($mapDiv);
	}
    
    function search(key) {
        for(var i = 0; i < zoom_Booths.length; i++){
            if(zoom_Booths[i].unitid==key){
                return {
                    unitId : zoom_Booths[i].unitid,
                    unitName : zoom_Booths[i].Display,
                    x : zoom_Booths[i].Pos_x,
                    y : zoom_Booths[i].Pos_y,
                };
            }
        }
        return null;
    }
     
    function downPDF(){
        var data = myCanvas.toDataURL("image/jpeg");
        var img = document.getElementById("image");
        img.src = data;		

        var PDFcanvas = document.createElement('canvas');
		document.body.appendChild(PDFcanvas);
		PDFcanvas.width = img.height;
		PDFcanvas.height = img.width;
        PDFcanvas.style.display = "none";
		var ctx = PDFcanvas.getContext('2d');
		ctx.rotate( Math.PI * 1/2);
		ctx.drawImage(img, 0, -img.height);
		
		var imgdata = PDFcanvas.toDataURL('image/jpeg').slice('data:image/jpeg;base64,'.length);
		// Convert the data to binary form
		imgdata = atob(imgdata);
        
        var doc = new jsPDF();
        doc.addImage(imgdata, 'jpeg', 10, 30, 190, 250);
        doc.save('img.pdf');
        document.body.removeChild(PDFcanvas);
    }
    
    this.mapDiv = mapDiv;
    
    this.madeMap = madeMap;
    this.changefloor = changefloor;
    this.toggleFacilities = toggleFacilities;
    this.zoomIn = zoomIn;
    this.zoomOut = zoomOut;
    this.bindClick = bindClickEvent;
    this.drawBooth = drawBooth;
    this.downloadPDF = downPDF;
    
    this.layerAdd = layerAdd;    
    this.drawPoint = drawPoint;
    this.drawLine = drawLine;
    this.drawArea = drawArea;
    this.drawFinished = drawFinished;
    this.saveAdd = saveAdd;
    this.createFrame = createFrame;
    
    this.layerModify = layerModify;
    this.startModify = startModify; 
    this.saveModify = saveModify;
    
    this.layerMerger = layerMerger;
    this.mergerBooths = mergerBooths;
    
    this.removeLayer = removeLayer;
    
    this.search = search;
     
    this.saveBooth = null;
    this.modifyBooth = null;
    this.showBooth = null;
    this.showMap = null;
    this.zoom = null;
    this.showFacility = null;
    this.mergerClicks = null;
    
    function formatData(b,f){
        Booths = [];
        Facilities = [];
        Frame = [];
        Fonts = [];
        maxWidth = maxHeight = 0;
        
        //formatF
        var fpath = f[0].frame.split(";");
        var frame = {};
        var framePaths = [];
        for(var n=0;n<fpath.length-1;n++){
            var fp = fpath[n].split(",");
            maxWidth = Math.max(fp[0],maxWidth);
            maxHeight = Math.max(fp[1],maxHeight);
            framePaths.push(fp);
        }
        frame.paths = framePaths;
        frame.id = f[0].floor_id;
        frame.chn = f[0].floor_chn;
        frame.name = f[0].name;
        frame.alias = f[0].floor_alias;
        frame.brief = f[0].floor_brief;
        Frame.push(frame);
        
        //format b
        for(var i=0;i<b.length;i++){
            var paths = b[i].frame.split(";");
            
            //booths and fonts
            if(b[i].type_id<3000){
                var font = {};
                var booth = {};
                var bPaths = [];
                for(var j=0;j<paths.length-1;j++){
                    var path = paths[j].split(",")
                    bPaths.push(path);
                }
                booth.paths = bPaths;
                booth.Display = b[i].name;
                booth.Pos_x = b[i].coord_x;
				booth.Pos_y = b[i].coord_y;
                booth.unitid = b[i].unit_id;
				booth.maxX = b[i].max_x;
				booth.maxY = b[i].max_y;
				booth.minX = b[i].min_x;
				booth.minY = b[i].min_y;
                booth.block_length = b[i].block_length;
                booth.block_width = b[i].block_width;
                booth.block_area = b[i].block_area;
                booth.booth_num = (b[i].booth_num.indexOf(";") > 0) ? b[i].booth_num.split(";") : b[i].booth_num;                
                booth.proxy_color = "#"+b[i].proxy_color;
				booth.block_state = b[i].block_state;
                booth.company_show_name = b[i].company_show_name;
                booth.proxy_id = b[i].proxy_id;
                Booths.push(booth);
                
                if( typeof booth.booth_num == "string"){
                    font.display = booth.booth_num;
                    font.length = context.measureText(booth.booth_num).width+8;
                    font.Pos_x = booth.minX;
				    font.Pos_y = booth.minY;
                } else { 
                    if ( booth.booth_num[0] != "*") {
                        font.display = booth.booth_num[0];
                        font.length = context.measureText(booth.booth_num[0]).width+8;
                        font.Pos_x = booth.minX;
				        font.Pos_y = booth.minY;
                    } else {
                        font.display = booth.booth_num[1];
                        font.length = context.measureText(booth.booth_num[1]).width+8; 
                        font.Pos_x = booth.minX;
				        font.Pos_y = booth.maxY;
                    }
                }
				font.show = 1;
				Fonts.push(font);
            }else{
                
                var facility = {};
				facility.name = b[i].name;
				facility.display = b[i].font;
				facility.Pos_x = b[i].coord_x;
				facility.Pos_y = b[i].coord_y;
				facility.minX = b[i].min_x;
				facility.minY = b[i].min_y;
				Facilities.push(facility);
            }
            
        }
        
    }
    
    function zoomData(b,fac,fra,fon,z){
        zoom_Booths = [];
        zoom_Facilities = [];
        zoom_Frame = [];
        zoom_Font = [];
        
        for(var i=0;i<b.length;i++){
            var zoom_booth = [];
            var b_paths = [];
            for(var j=0;j<b[i].paths.length;j++){
				var b_path = [];
				b_path[0] = b[i].paths[j][0]*z;
				b_path[1] = b[i].paths[j][1]*z;
				b_paths.push(b_path);
			}
            zoom_booth.paths = b_paths;
            zoom_booth.Display = b[i].Display;
            zoom_booth.unitid = b[i].unitid;
            zoom_booth.maxX = b[i].maxX * z;
			zoom_booth.maxY = b[i].maxY * z;
			zoom_booth.minX = b[i].minX * z;
			zoom_booth.minY = b[i].minY * z;
            zoom_booth.Pos_x = b[i].Pos_x * z;
			zoom_booth.Pos_y = b[i].Pos_y * z;
			zoom_Booths.push(zoom_booth);
        }
        
        for(var k=0;k<fac.length;k++){
            var zoom_f = {};
			zoom_f.name = fac[k].name;
			zoom_f.display = fac[k].display;
			zoom_f.Pos_x = fac[k].Pos_x*z;
			zoom_f.Pos_y = fac[k].Pos_y*z;
			zoom_f.minX = fac[k].minX*z;
			zoom_f.minY = fac[k].minY*z;
			zoom_Facilities.push(zoom_f);
        }
        
        for(var l=0;l<fon.length;l++){
            var zoom_font = {};
            zoom_font.display = fon[l].display;
            zoom_font.length = fon[l].length;
            zoom_font.Pos_x = fon[l].Pos_x*z;
            zoom_font.Pos_y = fon[l].Pos_y*z;
            zoom_font.show = 1;
            zoom_font.paths = [[zoom_font.Pos_x,zoom_font.Pos_y],[zoom_font.Pos_x,zoom_font.Pos_y+15],
				               [zoom_font.Pos_x+zoom_font.length,zoom_font.Pos_y+15],[zoom_font.Pos_x+zoom_font.length,zoom_font.Pos_y]];
            zoom_Font.push(zoom_font);
        }
        
        for(var m=0;m<fra.length;m++){
            var zoom_fra = {};
			var f_paths = [];
			for(var n=0;n<fra[m].paths.length;n++){
				var f_path = [];
				f_path[0] = fra[m].paths[n][0]*z;
				f_path[1] = fra[m].paths[n][1]*z;
				f_paths.push(f_path);
			}
			zoom_fra.paths = f_paths;
			zoom_fra.id = fra[m].id;
			zoom_fra.chn = fra[m].chn;
			zoom_fra.name = fra[m].name;
			zoom_fra.alias = fra[m].alias;
			zoom_fra.brief = fra[m].brief;
			zoom_Frame.push(zoom_fra);
		}
    } 
}