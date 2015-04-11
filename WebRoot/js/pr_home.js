//global variable
var publicElement = (function () {
	this.ip = "10.103.241.247";
	this.port = "8888";
    this.unitList = null;
    this.unitId = null;
    this.version = null;
    this.floorId = null;
    this.map = null;
    this.$infoDiv = null;
    this.edit = false;
    this.getHistoryListCallback = null;
    this.editState = null;
    this.changePoints = null;
    this.editUnitId = null;
    this.menuList = null;
    this.idList = [];
    this.mergeridList = null;
    this.boothData = null;
    this.boothObj = null;
    this.boothJson = null;
    this.login_id = null;
    return this;
})();

//get list of unit of menubar
function getUnitList() {
    var  url = "http://"+publicElement.ip+":"+publicElement.port+"/vmap/unit!search?client=824&vkey=FFE58998-B203-B44E-A95B-8CA2D6CBCD65&jsoncallback=?";
    $.getJSON(
        url,
        function( result ) {
            if ( !result.success ) {
                return;
            }
            $("#viewList").empty();
            publicElement.unitList = result.rows;
            for ( var i = 0; i < result.total; i++ ) {
                var $element = $("<li><a href='#'><span>"+result.rows[i].name+"</span></a></li>");
                $element.attr("unitId",result.rows[i].unit_id);
                $element.addClass("accordion");
                $("#viewList").append($element);
            }
        }
    );
}

//get version list of an unit
function getVersionList(unitId) {
    var url = "http://"+publicElement.ip+":"+publicElement.port+"/vmap/unit!version?client=824&vkey=FFE58998-B203-B44E-A95B-8CA2D6CBCD65&unit="+unitId+"&jsoncallback=?"; 
    var $versionTable = $("#versionList");
    var $versionTri = $("#versionTri");
    var $versionButton = $("#versionButton");
    var $versionTitle = $("#versionTitle");
    $versionTable.empty();
    $.getJSON(
        url,
        function(result) {
            if ( !result.success || result.total === 0 ) {
                $versionTri.addClass("disabled");
                $versionTitle.html("无可用版本");
                return false;
            }
            $versionButton.show();
            $versionTri.removeClass("disabled");
            for ( var i = 0; i < result.total; i++ ) {
                var $li = $('<li><a href="#">'+result.rows[i].version+'</a></li>');
                if ( i === 0 ) {
                    $li.addClass("active");
                }
                $li.attr("version",result.rows[i].version);
                $li.attr("vid",result.rows[i].id);
                $li.attr("available",result.rows[i].isAvailable);
                $versionTable.append($li);
                
                if( result.rows[i].isAvailable == 1) {
                    $li = $('<li><a href="#">销售进度图</a></li>');
                    $li.attr("version",result.rows[i].version);
                    $li.attr("vid",result.rows[i].id);
                    $li.attr("available",2);
                    $versionTable.append($li);
                }
            }
            $("#editMenuList").hide();
            $("#add_box").hide();
            $("#state_box").hide();
            if(result.rows[0].isAvailable == 1){
                $("#editMenuList").show();
                $("#add_box").show();
            }

            $versionTitle.html(result.rows[0].version);
            publicElement.version = result.rows[0].id;
            if ( getHistoryListCallback ) {
                getHistoryListCallback();
            }
        }
    );
}

//fill floor selector
function fillFloorSelector(unitId) {
    var url = "http://"+publicElement.ip+":"+publicElement.port+"/vmap/floor!search?client=824&vkey=FFE58998-B203-B44E-A95B-8CA2D6CBCD65&place="+unitId+"&jsoncallback=?";
    var $floorSelectorList = $("#floorSelectorList");
    $floorSelectorList.empty();
    $.getJSON(
        url,
        function(result) {
            if ( !result.success ) {
                return false;
            }
            for ( var i = 0; i < result.total; i++ ) {
                var d = result.rows[i];
                var $li = $('<a href="#" class="list-group-item" id="'+d.floor_id+'">'+d.floor_chn+'</a>');
                if ( i == 0 ) {
                    $li.addClass("active");
                }
                $floorSelectorList.append($li);
            }
            publicElement.floorId = result.rows[0].floor_id;
            $("#toolbar").show();
            $("#scale_box").show();
            publicElement.map.showMap = null;
            refreshMap();
        }
    );
}

//get history result
function getHistory() {
    var url = "http://"+publicElement.ip+":"+publicElement.port+"/vmap/change!all?client=824&vkey=FFE58998-B203-B44E-A95B-8CA2D6CBCD65&parent="+publicElement.unitId+"&version="+publicElement.version+"&jsoncallback=?";
    $.getJSON(
        url,
        function(result) {
            if ( !result.success ) {
                return;
            }
            var $historyModal = $("#historyModalBody");
            $historyModal.empty();
            var state=["delete","insert","modify"];
            var i = 0;
            var $a;
            for ( i in result.rows ) {
                $a = $("<a class='list-group-item'>"+result.rows[i].name+"<span class='badge'>"+state[result.rows[i].action]+"</span></a>");
                $a.attr("unitId",result.rows[i].unit_id);
                $a.attr("parentId",result.rows[i].parent);
                $a.attr("floorId",result.rows[i].floor_id);
                $a.attr("versionId",publicElement.version);
                $historyModal.append($a);
            }
            $('#historyModal').modal("show");
        }
    );
}

//get proxy result
function getProxy(){
    var url = "http://"+publicElement.ip+":"+publicElement.port+"/vmap/proxy!all?jsoncallback=?";
    $.getJSON(
        url,
        function(result) {
            if( !result.success ){
                return;
            }
            var $proxyModal = $("#proxyModalBody");
            $proxyModal.empty();
            var i = 0;
            var $a;
            for( i in result.proxy ){
                $a = $("<a class='list-group-item'>"+result.proxy[i].show_name+"<span class='badge' style='background-color:#"
                       +result.proxy[i].proxy_color+"'>"+result.proxy[i].proxy_color+"</span></a>");
                $a.attr("proxyid",result.proxy[i].proxy_id);
                $a.attr("version",publicElement.version);
                $proxyModal.append($a);
            }
            $("#proxyModal").modal("show");
        }
    );
}

//bind event of buttons and menu
function bindEvent() {

    //bind map event
    var map = publicElement.map;
    
    $("#floorSwitch").on("click",function(){
        $("#floorModal").modal("show");
    });
    $("#showFacilities").click(map.toggleFacilities);
	$("#zoomIn").click(map.zoomIn);
	$("#zoomOut").click(map.zoomOut);
    
    $("#downloadPDF").click(publicElement.map.downloadPDF);
    
    $("#profile").click( function(){
        showProxy(publicElement.login_id);
    })
    $("#downloadExc").click(function(){   
  
        var url = "http://"+publicElement.ip+":"+publicElement.port+"/vmap/download!targetfile?jsonstr="
        var data = {
            unit_id : publicElement.unitId,
            floor_id : publicElement.floorId,
            version : publicElement.version,
            proxy_id : publicElement.login_id
        }
        data = JSON.stringify(data);
        url += data+"&jsoncallback=?"; 
        $.getJSON(
            url,function(data){
                if( !data.success ){
                    alert(data.success);
                    return;
                }
                location.href = "http://"+publicElement.ip+":"+publicElement.port+"/vmap/"+publicElement.login_id+".xls";
            }
        );
    });
    //bind event of viewlist
    $("#viewList").on("click","li",function(e){
        var $target = $(e.target);
        if ( $target.prop("tagName") === "UL" ) {
        } else {
            while( $target.prop("tagName") !== "LI" ) {
                $target = $target.parent();
            }
            $("#viewList > .active").removeClass("active");
            $target.addClass("active");
            publicElement.unitId = $target.attr("unitId");
            publicElement.getHistoryListCallback = function() {
                fillFloorSelector($target.attr("unitId"));
            }
            getVersionList($target.attr("unitId"));
        }
        return;
    });
    
    //bind event of floorSelectorList selector
    $("#floorSelectorList").on("click","a",function(e){
        var $target = $(e.target);
        if ( $target.prop("tagName") === "UL" ) {
        } else {
            while( $target.prop("tagName") !== "A" ) {
                $target = $target.parent();
            }
            $("#floorSelectorList > .active").removeClass("active");
            $target.addClass("active");
            publicElement.floorId = $target.attr("id");
            publicElement.map.showMap = null;
            refreshMap();
            $("#floorModal").modal("hide");
        }
    });
    
    //bind event of version selector
    $("body").on("click","#versionList",function(e){
        resetState();
        var $target = $(e.target);
        if ( $target.prop("tagName") === "UL" ) {
        } else {
            while( $target.prop("tagName") !== "LI" ) {
                $target = $target.parent();
            }
            $("#versionList > .active").removeClass("active");
            $target.addClass("active");
            publicElement.version = $target.attr("vid");
            var $versionTitle = $("#versionTitle");
            $versionTitle.html($target.text());
            $("#editMenuList").hide();
            $("#add_box").hide();
            $("#state_box").hide();
            if($target.attr("available") == 1){
               $("#editMenuList").show();
                $("#add_box").show();
            }
            publicElement.map.showMap = null;
            if( $target.attr("available") == 2){
                $("#state_box").show();
                publicElement.map.madeMap(publicElement.unitId,publicElement.floorId,publicElement.version);
            }else{
                refreshMap();
            }
        }
    });
    
    //bind event for edit menu list
    $("#editMenuList").on("click","button",function(e){
        if(publicElement.version != null){        
            var buttonState = null;
            if(publicElement.editState === "ass"){
                refreshMap();
                publicElement.idList = [];
                publicElement.map.bindClick("detail");
            }

            if( $(e.target).attr("id") == undefined){
                buttonState = $(e.target).parent().attr("id").slice(0,-1);
            }else{
                buttonState = $(e.target).attr("id").slice(0,-1);
            }

            if(publicElement.editState != null && publicElement.editState != buttonState){
                $("#" +publicElement.editState+ "A").removeClass("active");
            }   
            publicElement.editState = buttonState;
            console.log(publicElement.editState);
            publicElement.map.removeLayer();
            
            if ( publicElement.$infoDiv ) {
                $infoDiv.remove();
                publicElement.$infoDiv = null;
            }

            // bind event of menu buttons
            if ( $(e.target).attr("id") == "addA" || $(e.target).parent().attr("id") == "addA" ) { 
                $("#addA").addClass("active");
                $("#detailModal").modal("show");    
                $("#detailModal .modal-header h3").text("添加展位");
                $("#subA").text("添加");
                $("#operation_info").show();
                return false;
            }
            if ( $(e.target).attr("id") == "deleteA" || $(e.target).parent().attr("id") == "deleteA") {
                $("#deleteA").addClass("active");
                return false;
            }
            if( $(e.target).attr("id") == "assA" || $(e.target).parent().attr("id") == "assA") {
                $("#assA").addClass("active");
                publicElement.map.bindClick("draw");
                return false;
            }
            if( $(e.target).attr("id") == "saleA" || $(e.target).parent().attr("id") == "saleA") {
                $("#saleA").addClass("active");
                return false;
            }
            if( $(e.target).attr("id") == "fillA" || $(e.target).parent().attr("id") == "fillA") {
                $("#fillA").addClass("active");
                return false;
            }
            if( $(e.target).attr("id") == "mergerA" || $(e.target).parent().attr("id") == "mergerA") {
                $("#mergerA").addClass("active");
                publicElement.map.layerMerger();
                return false;
            }
            if( $(e.target).attr("id") == "splitA" || $(e.target).parent().attr("id") == "splitA") {
                $("#splitA").addClass("active");
                return false;
            }
            if( $(e.target).attr("id") == "modifyA" || $(e.target).parent().attr("id") == "modifyA") {
                $("#modifyA").addClass("active");
                return false;
            }
        }
    });
    
    //bind event for add_box
    $("#add_box").on("click","button",function(e){
        if( $(e.target).attr("id") == "done" ){
            if(publicElement.editState === "add"){
                map.saveAdd();
                addSubmit();
            }
            if(publicElement.editState === "merger"){
                publicElement.map.mergerBooths();
                mergerSubmit();  
            }
            if(publicElement.editState === "ass"){
                getProxy();
            }
        }
        
    });
      
    //reset state when click view menu
    $("#view").on("click",function(e){
        resetState();
        if(publicElement.editState === "ass"){
                refreshMap();
        }
        publicElement.map.removeLayer();
       // return false;
    });
  
    //bind event of search button
    $("body").on("click","#searchButton",function(e){
        var url = "http://"+publicElement.ip+":"+publicElement.port+"/vmap/unit!query?client=824&vkey=FFE58998-B203-B44E-A95B-8CA2D6CBCD65&unit=B3084952-7667-4485-B9DA-A7FDF4E151E2&key=";
        url += $(e.target).parents('div').find('input').val()+"&jsoncallback=?";
        e.preventDefault();
        $.getJSON(
            url,
            function(result) {
                if ( !result.success ) {
                    return false;
                }
                var $searchModal = $("#searchModalBody");
                $searchModal.empty();
                var i = 0;
                var $a;
                for ( i in result.rows ) {
                    $a = $("<a class='list-group-item'>"+result.rows[i].name+"</a>");
                    $a.attr("unitId",result.rows[i].unit_id);
                    $a.attr("parentId",result.rows[i].parent_id);
                    $a.attr("floorId",result.rows[i].floor_id);
                    $a.attr("versionId",result.rows[i].version_id);
                    $searchModal.append($a);
                }
                $('#searchModal').modal("show");
            }
        );
    });
    
    //bind event of search result
    $("#searchModalBody").on("click",'a',function(e) {
        var target = e.target;
        var uId = $(target).attr("unitId");
        var parentId = $(target).attr("parentId");
        var floorId = $(target).attr("floorId");
        var version = $(target).attr("versionId");
        $("#closeSearchModal").trigger("click");
        publicElement.unitId = parentId;
        publicElement.floorId = floorId;
        publicElement.version = version;
        publicElement.map.showMap = function() {
            if ( publicElement.$infoDiv ) {
                publicElement.$infoDiv.remove();
                publicElement.$infoDiv = null;
            }
            
            var obj = publicElement.map.search(uId);
            if ( null === obj ) {
                return;
            }
            var $dom = $(map.mapDiv);
            var $infoDiv = $('<div><div>'+obj.unitName+'</div><a>详细~~</a></div>');
            $infoDiv.attr("id","infoDiv");
            $infoDiv.css({'left':obj.x-50,
                          'top':obj.y-45
                         });
            $dom.append($infoDiv);
            publicElement.$infoDiv = $infoDiv;
            $infoDiv.children('a').on("click",function() {
                showDetail(obj.unitId);
                publicElement.$infoDiv = null;
                $infoDiv.remove();
                publicElement.map.showMap = null;
            })
        }
        refreshMap();
        
    });
    
    //bind event of history result
    $("#historyModalBody").on("click","a",function(e){
        var target = e.target;
        var uId = $(target).attr("unitId");
        var parentId = $(target).attr("parentId");
        var floorId = $(target).attr("floorId");
        var version = $(target).attr("versionId");
        $("#closeHistoryModal").trigger("click");
        publicElement.unitId = parentId;
        publicElement.floorId = floorId;
        publicElement.version = version;
        publicElement.map.showMap = function() {
            if ( publicElement.$infoDiv ) {                
                publicElement.$infoDiv.remove();
                publicElement.$infoDiv = null;
            }
            var obj = publicElement.map.search(uId);
            if ( null === obj ) {
                return;
            }
            var $dom = $(map.mapDiv);
            var $infoDiv = $('<div><div>'+obj.unitName+'</div><a>详细**</a></div>');
            $infoDiv.attr("id","infoDiv");
            $infoDiv.css({'left':obj.x-50,
                          'top':obj.y-45
                         });
            $dom.append($infoDiv);
            publicElement.$infoDiv = $infoDiv;
            $infoDiv.children('a').on("click",function() {
                showDetail(obj.unitId);
                publicElement.$infoDiv = null;
                $infoDiv.remove();
                publicElement.map.showMap = null;
            })
        }
        refreshMap();
    });

    //bind event of proxy result
     $("#proxyModalBody").on("click","a",function(e){
        var target = e.target;
        var proxyid = $(target).attr("proxyid") ? $(target).attr("proxyid") : $(target).parent().attr("proxyid");
        var idlist = "";
        for (var i = 0 ; i < publicElement.idList.length; i++ ){
            idlist += publicElement.idList[i]+"*";
        }
        var versionid = $(target).attr("version") ? $(target).attr("version") : $(target).parent().attr("version");
        publicElement.idList = [];
        var url = "http://"+publicElement.ip+":"+publicElement.port+"/vmap/upda!update_proxy?client=824&vkey=FFE58998-B203-B44E-A95B-8CA2D6CBCD65&jsonstr=";
        var data = {
            unit_id : idlist,
            proxy_id : proxyid,
            version : versionid
        } 
        data = JSON.stringify(data);
        url += data+"&jsoncallback=?";
        console.log(url);
        $.post(url,function(result){
            $("#proxyModal").modal("hide");
            alert("代理分配成功");
            resetState();
            refreshMap();
            publicElement.map.bindClick("detail");
        },"json");
     });
    
    // various data submit 
    $("#subA").on("click",function(event) {
        if($("#block_form").get(0).checkValidity()){
			if ( publicElement.editState === "add" ) {
                addData();
                return false;
            };

            if ( publicElement.editState === "modify" ) {
                modifySubmit();
                return false;
            }
            if ( publicElement.editState === "split" ) {
                splitSubmit();
                return false;
            }
		}   
    });

    //company submit button submit 
    $("#subB").on("click",function(event) {
        if ( publicElement.editState === "sale" ) {
            addCompanySubmit();
            return false;
        };
    });
    
    $("#companysTableBody").on("click","button",function(e){
        var $tr = $(e.target).parents("tr");
        var url = "http://"+publicElement.ip+":"+publicElement.port+"/vmap/upda!update_company?client=824&vkey=FFE58998-B203-B44E-A95B-8CA2D6CBCD65&jsonstr=";
        var data = {
            company_id : $(e.target).attr("companyid"),
            unit_id : $("#show_name").attr("unitid"),
            version : publicElement.version,
            mark : $tr.find("input[type=radio]:checked").val()
        }
        data = JSON.stringify(data);
        url += data+"&jsoncallback=?";
        console.log(url);
        $.post(url,function(data){
            alert("修改公司状态成功");
            resetState();
        },"json");
        $("#companyModal").modal("hide");

        return false;
    })
    
    //fill color button
    $("#subC").on("click",function(){
        var block = "#"+$("#block_color").val();
        var font = "#"+$("#font_color").val() == "#FFFFFF" ? "black" : "#"+$("#font_color").val();
        var rotate = $("#rotate input:checked").val();
        var index = $("#block_color").attr("index");
        if ( block.length > 7){
            block = block.slice(1);
        }
        if( font.length > 7) {
            font = font.slice(1);
        }
        console.log(block+font);
        publicElement.map.drawBooth(index,block,rotate,font);
        resetState();
        $("#colorModal").modal("hide");
    });
    
      //clear modals
    $("#colorModal").on('hidden.bs.modal',function(){
        $("#block_color").val("");
        $("#font_color").val("");
        $("#block_color").removeAttr("index");
        $(".colorPicker-picker").removeAttr("style");
        $(".colorPicker-picker").val("");
    });
    $("#companyModal").on("hidden.bs.modal",function(){
        $("#companyModal .modal-body input[type!=radio]").val("");
    })
    $("#detailModal").on("hidden.bs.modal",function(){
        $("#detailModal .modal-body input[type!=radio]").val("");
        $("#block_width").attr("max","60");
        $("#block_length").attr("max","60");
        $("#block_length").removeAttr("disabled");
        $("#block_width").removeAttr("disabled");
    })
    
    //calculate refArea
    $("#block_width").on("blur",function(){
        if($("#block_width").val() != "" && $("#block_length").val() != "") {
            $("#block_refArea").val($("#block_width").val() * $("#block_length").val());   
            if(publicElement.editState == "modify") {
                if( $("#startP input[type=radio]:checked").val() == "left"){             
                    $("#block_width").attr("max",parseInt(publicElement.boothObj.width) - parseInt(publicElement.boothObj.min_x));
                } else {
                    $("#block_width").attr("max",parseInt(publicElement.boothObj.max_x));
                }
            } else if ( publicElement.editState == "split" ) {
                 if( $("#block_width").val() != publicElement.boothJson.block_width){
                     $("#block_length").attr("disabled","disabled");
                     $("#block_width").attr("max",publicElement.boothJson.block_width - 1);
                 }
            }
        }
    })
    
     $("#block_length").on("blur",function(){
        if($("#block_width").val() != "" && $("#block_length").val() != "") {
            $("#block_refArea").val($("#block_width").val() * $("#block_length").val());   
            if(publicElement.editState == "modify") {
                if( $("#startP input[type=radio]:checked").val() == "left"){             
                    $("#block_length").attr("max",parseInt(publicElement.boothObj.height) - parseInt(publicElement.boothObj.min_y));
                } else {
                    $("#block_length").attr("max",parseInt(publicElement.boothObj.max_y));
                }
            } else if ( publicElement.editState == "split" ) {
                 if( $("#block_length").val() != publicElement.boothJson.block_length){
                     $("#block_length").attr("max",publicElement.boothJson.block_length - 1);
                     $("#block_width").attr("disabled","disabled");
                 }
            }
        }
    })
}

//submit company
function addCompanySubmit() {
    var url = 'http://'+publicElement.ip+":"+publicElement.port+'/vmap/insert!insert_company?jsonstr=';
    var data = {
        company_name_ch: $("#company_name_ch").val(),
        company_name_en: $("#company_name_en").val(),
        show_name: $("#show_name").val(),
        phone: $("#phone").val(),
        con_per: $("#con_per").val(),
        contact: $("#contact").val(),
        email: $("#email").val(),
        company_color: $("#company_color").val(),
        address_ch: $("#address_ch").val(),
        address_en:$("#address_en").val(),
        other_info: $("#other_info").val(),
        alt_con: $("#alt_con").val()
    }
    
    data = JSON.stringify(data);
    url += data+"&jsoncallback=?";
    $.post(url,function(data){
        if( data.success ){
            var addurl = "http://"+publicElement.ip+":"+publicElement.port+"/vmap/upda!update_company?client=824&vkey=FFE58998-B203-B44E-A95B-8CA2D6CBCD65&jsonstr=";
            var adddata = {
                company_id : data.company_id,
                unit_id : $("#show_name").attr("unitid"),
                version : publicElement.version,
                mark : $("#state input:checked").val()
            }
            adddata = JSON.stringify(adddata);
            addurl += adddata+"&jsoncallback=?";
            console.log(addurl);
            $.post(addurl,function(data){
                alert("添加公司信息成功");
            },"json");
            resetState();
            $("#companyModal").modal("hide");
        }
        
    },"json");
    return false;
}

// submit add result
function addData() {
    var data = { 
        name: "展位",
        show_name: $("#block_show_name").val(),
        address: $("#block_address").val(),
        website: "",
        phone: "",
        email: "",
        open_time: $("#block_time").val(),
        logo: "",
        description: "",
        keyword: $("#block_keyword").val(),
        alias: "",
        detail: "",
        //unit_id:$("#block_num").attr("unit_id"),
        parent_id: publicElement.unitId,
        booth_num: $("#block_num").val(),
        floor_id : publicElement.floorId,
        type : $("#block_type").val(),
        block_length : $("#block_length").val(),
        block_width : $("#block_width").val(),
        block_area : $("#block_area").val(),
        version : publicElement.version,
        proxy_id : $("#block_proxy_id").val(),
        reco_company_id : "",
        rese_company_id : "",
        sign_company_id : "",
        pay_company_id : "",
        block_state : "" ,
        start : $("#startP input[type=radio]:checked").val()
    }
    publicElement.boothData = data;
    publicElement.map.layerAdd();
    $(publicElement.map.mapDiv).on ("click","#canvasAdd",function(e) {
        publicElement.map.createFrame(e.offsetX,e.offsetY,parseFloat(data.block_width),parseFloat(data.block_length),data.start);
    });
    $("#detailModal").modal("hide");
}

// submit addBooth result
function addSubmit() {
    var url = 'http://'+publicElement.ip+":"+publicElement.port+'/vmap/upda!all?client=824&vkey=FFE58998-B203-B44E-A95B-8CA2D6CBCD65&jsonstr=';
    var data = JSON.stringify(publicElement.boothData);
    data = data.slice(0,-1);
    data = data+','+publicElement.changePoints+"}";
    url += data+"&jsoncallback=?";
    console.log(url);
    $.post(url,function(data){
        alert("添加成功");
        resetState();
        publicElement.map.removeLayer();
        refreshMap();
        publicElement.boothData = null;
    },"json");
    return false;
}

//submit modify result
function modifySubmit() {
    var url = 'http://'+publicElement.ip+":"+publicElement.port+'/vmap/upda!units?client=824&vkey=FFE58998-B203-B44E-A95B-8CA2D6CBCD65&jsonstr=';
    var data = {
        name: "展位",
        show_name: $("#block_show_name").val(),
        address: $("#block_address").val(),
        website: "",
        phone: "",
        email: "",
        open_time: $("#block_time").val(),
        logo: "",
        description: "",
        keyword: $("#block_keyword").val(),
        alias: "",
        detail: "",
        unit_id:$("#block_num").attr("unit_id"),
        parent_id: publicElement.unitId,
        booth_num: $("#block_num").val(),
        floor_id : publicElement.floorId,
        type : $("#block_type").val(),
        block_length : $("#block_length").val(),
        block_width : $("#block_width").val(),
        block_area : $("#block_area").val(),
        version : publicElement.version,
        proxy_id : $("#block_proxy_id").val(),
        reco_company_id : "",
        rese_company_id : "",
        sign_company_id : "",
        pay_company_id : "",
        block_state : ""
    };
    data = JSON.stringify(data);
    data = data.slice(0,-1);
    
    var bmax_x;
    var bmax_y;
    var bmin_y;
    var bmin_x;
    var frameStr = "";
    if( $("#startP input[type=radio]:checked").val() == "left"){
        bmin_x = parseFloat(publicElement.boothObj.min_x);
        bmin_y = parseFloat(publicElement.boothObj.min_y);
        bmax_x = bmin_x + parseFloat($("#block_length").val());
        bmax_y = bmin_y + parseFloat($("#block_width").val());       
    } else {
        bmax_x = parseFloat(publicElement.boothObj.max_x);
        bmax_y = parseFloat(publicElement.boothObj.max_y);
        bmin_x = bmax_x - parseFloat($("#block_length").val());
        bmin_y = bmax_y - parseFloat($("#block_width").val());
    }
    
    frameStr += "'max_x':'"+bmax_x+"','min_x':'"+bmin_x+"','max_y':'"+bmax_y+"','min_y':'"+bmin_y
        +"','coord_x':'"+ (bmax_x + bmin_x)/2 +"','coord_y':'"+ (bmax_y + bmin_y)/2+"','frame':'";
    frameStr += bmax_x+","+bmax_y+";" + bmax_x+","+bmin_y+";" + bmin_x+","+bmin_y+";" + bmin_x+","+bmax_y+";" + bmax_x+","+bmax_y+";";
    
    data = data+','+frameStr+ "'}";
    url += data+"&jsoncallback=?";
    console.log(url);

    $.post(url,function(data){
        $("#detailModal").modal("hide");
        resetState();
        refreshMap();
        alert("修改成功");
    },"json");
    return false;
}

//submit split result
function splitSubmit() {
    if ( (publicElement.boothObj.max_y - publicElement.boothObj.min_y == $("#block_width").val()) &&
             (publicElement.boothObj.max_x - publicElement.boothObj.min_x == $("#block_length").val()) ) {
            console.log("数字没改变");
            return false;
    }
    var updateUrl = 'http://'+publicElement.ip+":"+publicElement.port+'/vmap/upda!units?client=824&vkey=FFE58998-B203-B44E-A95B-8CA2D6CBCD65&jsonstr=';
    var addUrl = 'http://'+publicElement.ip+":"+publicElement.port+'/vmap/upda!all?client=824&vkey=FFE58998-B203-B44E-A95B-8CA2D6CBCD65&jsonstr=';
    var data = {               
        website: "",
        phone: "",
        email: "",
        logo: "",
        description: "",
        alias: "",
        detail: "",
        parent_id: publicElement.unitId,
        floor_id : publicElement.floorId,
        version : publicElement.version,
        reco_company_id : "",
        rese_company_id : "",
        sign_company_id : "",
        pay_company_id : "",
        block_state : ""
    };
    var modify_data = { 
        address: publicElement.boothJson.address,
        unit_id: $("#block_num").attr("unit_id"),
        name: "展位",
        show_name: publicElement.boothJson.show_name,
        open_time: publicElement.boothJson.opening_time,
        booth_num: publicElement.boothJson.booth_num,
        proxy_id : publicElement.boothJson.proxy_id,
        keyword: publicElement.boothJson.keyword,
        type : publicElement.boothJson.type,
       }
    var add_data = {
            keyword: $("#block_keyword").val(),
            open_time: $("#block_time").val(),
            address: $("#block_address").val(),
            name: "展位",
            show_name: $("#block_show_name").val(),
            booth_num: $("#block_num").val(),
            proxy_id : $("#block_proxy_id").val(),
            type : $("#block_type").val(),
            block_length : $("#block_length").val(),
            block_width : $("#block_width").val(),
            block_area : $("#block_area").val(),
        }
    data = JSON.stringify(data);
    add_data = JSON.stringify(add_data);
    modify_data = JSON.stringify(modify_data);
    data = data.slice(0,-1);
    add_data = add_data.slice(1,-1);
    modify_data = modify_data.slice(1,-1);
    var addmax_x;
    var addmax_y;
    var addmin_y;
    var addmin_x;
    var frameAdd = "";
    if( $("#startP input[type=radio]:checked").val() == "left"){
        addmin_x = parseFloat(publicElement.boothObj.min_x);
        addmin_y = parseFloat(publicElement.boothObj.min_y);
        addmax_x = addmin_x + parseFloat($("#block_length").val());
        addmax_y = addmin_y + parseFloat($("#block_width").val());       
    } else {    
        addmax_x = parseFloat(publicElement.boothObj.max_x);
        addmax_y = parseFloat(publicElement.boothObj.max_y);
        addmin_x = addmax_x - parseFloat($("#block_length").val());
        addmin_y = addmax_y - parseFloat($("#block_width").val());
    }
    frameAdd += "'max_x':'"+addmax_x+"','min_x':'"+addmin_x+"','max_y':'"+addmax_y+"','min_y':'"+addmin_y
        +"','coord_x':'"+ (addmax_x + addmin_x)/2 +"','coord_y':'"+ (addmax_y + addmin_y)/2+"','frame':'";
    frameAdd += addmax_x+","+addmax_y+";" + addmax_x+","+addmin_y+";" + addmin_x+","+addmin_y+";" + addmin_x+","
        +addmax_y+";" + addmax_x+","+addmax_y+";";
    
    var block_length; 
    var block_width;
    var modimax_x;
    var modimax_y;
    var modimin_y;
    var modimin_x;
    var frameModi = "";
    if( $("#startP input[type=radio]:checked").val() == "left"){
        modimax_x = publicElement.boothObj.max_x;
        modimax_y = publicElement.boothObj.max_y;        
        if ( ((publicElement.boothObj.max_y*1000 - publicElement.boothObj.min_y*1000)/1000==$("#block_width").val()) &&
             ((publicElement.boothObj.max_x*1000 - publicElement.boothObj.min_x*1000)/1000!=$("#block_length").val()) ){
            console.log("纵向分隔");
            modimin_x = publicElement.boothObj.min_x + parseFloat($("#block_length").val());
            modimin_y = publicElement.boothObj.min_y;
            block_width = publicElement.boothJson.block_width;
            block_length = publicElement.boothJson.block_length - $("#block_length").val();
        }
        if ( ((publicElement.boothObj.max_y*1000 - publicElement.boothObj.min_y*1000)/1000!=$("#block_width").val()) &&
             ((publicElement.boothObj.max_x*1000 - publicElement.boothObj.min_x*1000)/1000==$("#block_length").val()) ){
            console.log("横向分隔");
            modimin_y = publicElement.boothObj.min_y + parseFloat($("#block_width").val());
            modimin_x = publicElement.boothObj.min_x;
            block_length = publicElement.boothJson.block_length;
            block_width = publicElement.boothJson.block_width - $("#block_width").val();
        }
        if ( (publicElement.boothObj.max_y - publicElement.boothObj.min_y != $("#block_width").val()) &&
             (publicElement.boothObj.max_x - publicElement.boothObj.min_x != $("#block_length").val()) ){
            console.log("切出一块");
            console.log(publicElement.boothObj.max_y - publicElement.boothObj.min_y);
            console.log(publicElement.boothObj.max_x - publicElement.boothObj.min_x);
            console.log($("#block_width").val());
            console.log($("#block_length").val());
            modimin_y = publicElement.boothObj.min_y;
            modimin_x = publicElement.boothObj.min_x;
            block_length = publicElement.boothJson.block_length;
            block_width = publicElement.boothJson.block_width;
        }
    } else {  
        modimin_x = publicElement.boothObj.min_x;
        modimin_y = publicElement.boothObj.min_y;
        if ( ((publicElement.boothObj.max_y*1000 - publicElement.boothObj.min_y*1000)/1000==$("#block_width").val())&&
             ((publicElement.boothObj.max_x*1000 - publicElement.boothObj.min_x*1000)/1000!=$("#block_length").val()) ){
            console.log("纵向分隔");
            modimax_x = publicElement.boothObj.max_x - parseFloat($("#block_length").val());
            modimax_y = publicElement.boothObj.max_y;
            block_width = publicElement.boothJson.block_width;
            block_length = publicElement.boothJson.block_length - $("#block_length").val();
        } 
        if( ((publicElement.boothObj.max_y*1000 - publicElement.boothObj.min_y*1000)/1000!=$("#block_width").val())&&                                     ((publicElement.boothObj.max_x*1000 - publicElement.boothObj.min_x*1000)/1000==$("#block_length").val()) ){
            console.log("横向分隔");
            modimax_y = publicElement.boothObj.max_y - parseFloat($("#block_width").val());
            modimax_x = publicElement.boothObj.max_x;
            block_length = publicElement.boothJson.block_length;
            block_width = publicElement.boothJson.block_width - $("#block_width").val();
        }
        if ( (publicElement.boothObj.max_y - publicElement.boothObj.min_y != $("#block_width").val()) &&
             (publicElement.boothObj.max_x - publicElement.boothObj.min_x != $("#block_length").val()) ){
            console.log("切出一块");
            modimax_x = publicElement.boothObj.max_x;
            modimax_y = publicElement.boothObj.max_y;
            block_length = publicElement.boothJson.block_length;
            block_width = publicElement.boothJson.block_width;
        }
    }
    
    frameModi += "'max_x':'"+modimax_x+"','min_x':'"+modimin_x+"','max_y':'"+modimax_y+"','min_y':'"+modimin_y
                +"','block_length':'"+block_length+"','block_width':'"+block_width+"','block_area':'"+(block_length * block_width)
                +"','coord_x':'"+ (modimax_x + modimin_x)/2 +"','coord_y':'"+ (modimax_y + modimin_y)/2+"','frame':'";
        
    if ( (publicElement.boothObj.max_y - publicElement.boothObj.min_y == $("#block_width").val()) ||
         (publicElement.boothObj.max_x - publicElement.boothObj.min_x == $("#block_length").val()) ){
        frameModi += modimax_x+","+modimax_y+";" + modimax_x+","+modimin_y+";" + modimin_x+","+modimin_y+";" + modimin_x+","
            +modimax_y+";" + modimax_x+","+modimax_y+";";
    } else {
            return false;
    }
    
    addUrl += data+','+add_data+','+frameAdd+ "'}"+"&jsoncallback=?";
    updateUrl += data+','+modify_data+','+frameModi+ "'}"+"&jsoncallback=?";
    console.log(addUrl);
    console.log(updateUrl);

    $.post(addUrl,function(data){
        $("#detailModal").modal("hide");
        resetState();
        refreshMap();
    },"json");
    $.post(updateUrl,function(data){
        
    },"json");
    
    return false;
}

//submit deletion
function deleteSubmit(unitId) {
    var url = 'http://'+publicElement.ip+":"+publicElement.port+'/vmap/upda!delete?client=824&vkey=FFE58998-B203-B44E-A95B-8CA2D6CBCD65&jsonstr=';
    var data = {
        unit_id : unitId+"*",
        parent_id : publicElement.unitId,
        version : publicElement.version
    }
    data = JSON.stringify(data);
    url += data+"&jsoncallback=?";
    $.post(url,function(data){
        alert("删除成功!");
        resetState();
        refreshMap();
    },"json");
    return false;
}

//submit merger
function mergerSubmit() {
    var firstid = publicElement.mergeridList.split("*")[0];
    var detailurl = "http://"+publicElement.ip+":"+publicElement.port+"/vmap/change!unit?client=824&vkey=FFE58998-B203-B44E-A95B-8CA2D6CBCD65&unit="+firstid+"&version="+publicElement.version+"&jsoncallback=?";
    $.getJSON(detailurl,
              function( data ) {
                  if ( !!!data.success ) {
                          return;
                  }
            var mergerurl = 'http://'+publicElement.ip+":"+publicElement.port+'/vmap/upda!emerger?client=824&vkey=FFE58998-B203-B44E-A95B-8CA2D6CBCD65&jsonstr=';      
            var mergerdata = { 
                delete_id : publicElement.mergeridList,
                parent_id : publicElement.unitId,
                version : publicElement.version,
                name: "展位",
                show_name: data.rows[0].show_name,
                address: data.rows[0].address,
                website: "",
                phone: "",
                email: "",
                open_time: data.rows[0].opening_time,
                logo: "",
                description: "",
                keyword: data.rows[0].keyword,
                alias: "",
                detail: "",
                parent_id: publicElement.unitId,
                booth_num: data.rows[0].booth_num,
                floor_id : publicElement.floorId,
                type : data.rows[0].type,
                block_length :"",
                block_width : "",
                block_area : "",
                version : publicElement.version,
                proxy_id : data.rows[0].proxy_id,
                reco_company_id : "",
                rese_company_id : "",
                sign_company_id : "",
                pay_company_id : "",
                block_state : data.rows[0].block_state                
            }
            mergerdata = JSON.stringify(mergerdata);
            mergerdata = mergerdata.slice(0,-1);
            mergerdata = mergerdata+','+publicElement.changePoints+"}";
            mergerurl += mergerdata+"&jsoncallback=?";
            console.log(mergerurl);
            $.post(mergerurl,function(data){
                alert("合并成功");
                resetState();
                publicElement.map.removeLayer();
                refreshMap();
            },"json");
              
    });
        
    return false;
}

function resetState() {
    if(publicElement.editState != null){
        $("#" +publicElement.editState+ "A").removeClass("active");
        if(publicElement.editState === "ass"){
                publicElement.idList = [];
                publicElement.map.bindClick("detail");
        }
    }
    publicElement.editState = null;
}

function refreshMap() {  
    if ( publicElement.$infoDiv ) {
                publicElement.$infoDiv.remove();
                publicElement.$infoDiv = null;
    }
    
    if ( !publicElement.map ) {
        mapInit();
    }
    publicElement.map.changefloor(publicElement.unitId,publicElement.floorId,publicElement.version);
}

function mapInit() {
    publicElement.login_id = $("#login_proxy").attr("uid");
    publicElement.map = new Vmap("map_frame");	
    var map = publicElement.map;
    
    map.bindClick("detail");
    if ( publicElement.login_id != "visitor" ){
    	$('#block_color').colorPicker();
        $('#font_color').colorPicker();
    }
    
    //sava unitid
    map.saveUUID = function (obj) {
        if( publicElement.idList.length == 0){
            publicElement.idList.push(obj.unitId);
        } else {
            if (publicElement.idList.indexOf(obj.unitId) < 0){
                publicElement.idList.push(obj.unitId);
            }
        }
        console.log(publicElement.idList);
    }
    
    //get merger units
    map.mergerClicks = function (obj) {
        publicElement.mergeridList = obj.idlist;
        publicElement.changePoints = obj.data;
    }
    
    //click the map when in show model
    map.showBooth = function (obj) {
        var $dom = $(map.mapDiv);
        if ( publicElement.$infoDiv ) {
            publicElement.$infoDiv.remove();
            publicElement.$infoDiv = null;
        }
        
        
        if( publicElement.login_id == obj.proxy_id ) {
            if( publicElement.editState == "delete"){
                var $infoDiv = $('<div><div>'+obj.unitName+'</div><a>删除</a></div>');
                $infoDiv.attr("id","infoDiv");
                $infoDiv.css({'left':obj.x-50,
                              'top':obj.y-45
                             });
                $dom.append($infoDiv);
                publicElement.$infoDiv = $infoDiv;
                $infoDiv.children('a').on("click",function() {
                    deleteSubmit(obj.unitId);
                    publicElement.$infoDiv = null;
                    $infoDiv.remove();
                })
            } else if( publicElement.editState == "sale"){
                var $infoDiv = $('<div><div>'+obj.unitName+'</div><a>出售</a></div>');
                $infoDiv.attr("id","infoDiv");
                $infoDiv.css({'left':obj.x-50,
                              'top':obj.y-45
                             });
                $dom.append($infoDiv);
                publicElement.$infoDiv = $infoDiv;
                $infoDiv.children('a').on("click",function() {
                    showCompanyDetail(obj.unitId);
                    $("#show_name").attr("unitid",obj.unitId);
                    publicElement.$infoDiv = null;
                    $infoDiv.remove();
                })
            }  else if( publicElement.editState == "fill"){
                var $infoDiv = $('<div><div>'+obj.unitName+'</div><a>涂色</a></div>');
                $infoDiv.attr("id","infoDiv");
                $infoDiv.css({'left':obj.x-50,
                              'top':obj.y-45
                             });
                $dom.append($infoDiv);
                publicElement.$infoDiv = $infoDiv;
                $infoDiv.children('a').on("click",function() {
                   $("#block_color").attr("index",obj.unitIndex);
                   $("#colorModal").modal("show");
                   publicElement.$infoDiv = null;
                   $infoDiv.remove();
                })
            } else if( publicElement.editState == "modify"){
                var $infoDiv = $('<div><div>'+obj.unitName+'</div><a>修改</a></div>');
                $infoDiv.attr("id","infoDiv");
                $infoDiv.css({'left':obj.x-50,
                              'top':obj.y-45
                             });
                $dom.append($infoDiv);
                publicElement.$infoDiv = $infoDiv;
                $infoDiv.children('a').on("click",function() {
                   showModifyDetail(obj.unitId);
                   publicElement.boothObj = obj;
                   publicElement.$infoDiv = null;
                   $infoDiv.remove();
                })
            } else if( publicElement.editState == "split"){
                var $infoDiv = $('<div><div>'+obj.unitName+'</div><a>拆分</a></div>');
                $infoDiv.attr("id","infoDiv");
                $infoDiv.css({'left':obj.x-50,
                              'top':obj.y-45
                             });
                $dom.append($infoDiv);
                publicElement.$infoDiv = $infoDiv;
                $infoDiv.children('a').on("click",function() {
                   showModifyDetail(obj.unitId);
                   publicElement.boothObj = obj;
                    console.log(publicElement.boothObj);
                   publicElement.$infoDiv = null;
                   $infoDiv.remove();
                })
            } else if( publicElement.editState == null){
                var $infoDiv = $('<div><div>'+obj.unitName+'</div><a>详细信息</a></div>');
                $infoDiv.attr("id","infoDiv");
                $infoDiv.css({'left':obj.x-50,
                              'top':obj.y-45
                             });
                $dom.append($infoDiv);
                publicElement.$infoDiv = $infoDiv;
                $infoDiv.children('a').on("click",function() {
                    showDetail(obj.unitId);
                    publicElement.$infoDiv = null;
                    $infoDiv.remove();
                })
            }
        } else {
                var $infoDiv = $('<div><div>'+obj.unitName+'</div><a>展位信息</a></div>');
                $infoDiv.attr("id","infoDiv");
                $infoDiv.css({'left':obj.x-50,
                              'top':obj.y-45
                             });
                $dom.append($infoDiv);
                publicElement.$infoDiv = $infoDiv;
                $infoDiv.children('a').on("click",function() {
                    showGeneral(obj.unitId);
                    publicElement.$infoDiv = null;
                    $infoDiv.remove();
                })
        }
        
        
        
    }
    
    map.showFacility = function(obj) {
        alert(obj.facilityName);
    }
    
    map.saveBooth = function(points) {
        publicElement.changePoints = points;
    };
    
    map.zoom = function() {
        if ( publicElement.$infoDiv ) {
            publicElement.$infoDiv.remove();
            publicElement.$infoDiv = null;
        }
    }

}

//show details will modify of an unit
function showModifyDetail(uId) {
    var url = "http://"+publicElement.ip+":"+publicElement.port+"/vmap/change!unit?client=824&vkey=FFE58998-B203-B44E-A95B-8CA2D6CBCD65&unit="+uId+"&version="+publicElement.version+"&jsoncallback=?";
    $.getJSON(url,
              function( data ) {
                  if ( !!!data.success ) {
                      return;
                  }
                  var d = data.rows[0];
                  $("#block_length").val(d.block_length);
                  $("#block_width").val(d.block_width)
                  $("#block_area").val(d.block_area);
                  $("#block_num").val(d.booth_num);
                  $("#block_num").attr("unit_id",uId);
                  $("#block_show_name").val(d.show_name);
                  $("#block_time").val(d.opening_time);
                  $("#block_type").val(d.type);
                  $("#block_address").val(d.address);
                  $("#block_keyword").val(d.keyword);
                  $("#block_proxy_id").val(d.proxy_id);
                  if( publicElement.editState == "modify") {
                    $("#detailModal .modal-header h3").text("修改展位");
                    $("#subA").text("修改");
                  } else {  
                    publicElement.boothJson = data.rows[0];
                    $("#detailModal .modal-header h3").text("拆分展位");
                    $("#subA").text("拆分");
                   // console.log(publicElement.boothJson);

                  }
                  $("#operation_info").hide();
                  $("#block_refArea").val(d.block_length * d.block_width);
                  $("#detailModal").modal("show");
              });
}

//show general 
function showGeneral(uId) {
    var url = "http://"+publicElement.ip+":"+publicElement.port+"/vmap/change!unit?client=824&vkey=FFE58998-B203-B44E-A95B-8CA2D6CBCD65&unit="+uId+"&version="+publicElement.version+"&jsoncallback=?";
    $.getJSON(url,
              function( data ) {
                  if ( !!!data.success ) {
                      return;
                  }
                  var d = data.rows[0];
                  $("#general_length").val(d.block_length);
                  $("#general_width").val(d.block_width)
                  $("#general_area").val(d.block_area);
                  $("#general_num").val(d.booth_num);
                  $("#general_show_name").val(d.show_name);
                  $("#general_time").val(d.opening_time);
                  $("#general_address").val(d.address);
                  $("#general_keyword").val(d.keyword);
                  $("#general_proxy_name").val(d.proxy_name);
                  $("#generalModal").modal("show");
              });
}

//show proxy
function showProxy(proxy){
	var  url = "http://"+publicElement.ip+":"+publicElement.port+"/vmap/proxy!select?proxy_id="+proxy+"&jsoncallback=?";
    $.getJSON(
        url,
        function( result ) {
            if ( !result.success ) {
                return;
            }
			$("#showProxy").modal("show");
			var data = result.proxy[0];
			$("#show_id").val(data.proxy_id);
			$("#show_proxyname").val(data.proxy_name);
			$("#show_password").val(data.password);
			$("#show_showname").val(data.show_name);
			$("#show_contact").val(data.contact);
			$("#show_con_per").val(data.con_per);
			$("#show_address").val(data.address);
			$("#show_phone").val(data.phone);
			$("#show_email").val(data.email);
			$("#show_color").val(data.proxy_color);
			$("#show_color").attr("style","background-color:#"+data.proxy_color);
			$("#show_info").val(data.other_info);
	    }
    );
}
//main entrance
$(document).ready(function(){
    mapInit();
    //$(".active").removeClass("active");
    $("#view > a").trigger("click");
    getUnitList(); 
    bindEvent();
});