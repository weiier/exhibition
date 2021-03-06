//global variable
var publicElement = (function () {
	this.ip = "10.103.241.247";
	this.port = "8888";
    return this;
})();

//get list of proxy
function getProxyList() {
	
	var  url = "http://"+publicElement.ip+":"+publicElement.port+"/vmap/proxy!all?jsoncallback=?";
    $.getJSON(
        url,
        function( result ) {
            if ( !result.success ) {
				$("#proxyTable").dataTable();
                return;
            }
			var $tbody = $("table tbody");
            for ( var i = 0; i < result.total; i++ ) {
				var $tr = $("<tr><td><a class='btn btn-primary btn-xs'><i class='glyphicon glyphicon-trash icon-white'></i> 删除</a></td><td>"+result.proxy[i].proxy_id
        +"</td><td>"+result.proxy[i].password+"</td><td>"+result.proxy[i].show_name+"</td><td>"+result.proxy[i].phone+"</td><td>"+result.proxy[i].con_per
        +"</td><td>"+result.proxy[i].contact+"</td>"+"<td><span class='label' style='background-color:#"+result.proxy[i].proxy_color+"'>"+result.proxy[i].proxy_color
        +"</span></td><td>"+result.proxy[i].time+"</td><td>"+result.proxy[i].other_info
+"</td><td class='center'> <a class='btn btn-success btn-xs'> <i class='glyphicon glyphicon-zoom-in icon-white'></i> 查看</a> <a class='btn btn-info btn-xs'>"+
" <i class='glyphicon glyphicon-edit icon-white'></i> 编辑</a></td></tr>");
				
				$tr.attr("proxy_id",result.proxy[i].proxy_id);
				$tr.on("click",function(e){
					var $target = $(e.target); 
					if($target.hasClass("btn-info")||$target.parent().hasClass("btn-info")){
						editProxy($target.parents("tr").attr("proxy_id"),"edit");
					}else if($target.hasClass("btn-success")||$target.parent().hasClass("btn-success")){
						showProxy($target.parents("tr").attr("proxy_id"));
					}else if($target.hasClass("btn-primary")||$target.parent().hasClass("btn-primary")){
						deleteProxy($target.parents("tr").attr("proxy_id"));
					}
				});
				$tbody.append($tr);
            }	
			$("#proxyTable").dataTable();
        }
    );
	
}
function clearProxy(){
	$("#proxy_id").val("");
	$("#proxy_name").val("");
	$("#password").val("");
	$("#address").val("");
	$("#phone").val("");
	$("#email").val("");
	$("#proxy_color").val("");
	$("#other_info").val("");
    $("#showname").val("");
	$("#con_per").val("");
	$("#contact").val("");
    $(".colorPicker-picker").removeAttr("style");
    $(".colorPicker-picker").val("");
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
			$("#show_name").val(data.proxy_name);
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

//delete proxy
function deleteProxy(proxy){
	var  url = "http://"+publicElement.ip+":"+publicElement.port+"/vmap/proxy!delete?proxy_id="+proxy+"&jsoncallback=?";
    $.getJSON(
        url,
        function( result ) {
            if ( !result.success ) {
                return;
            }
			alert("删除成功!");
			location.reload();
		}
    );
}

//edit proxy
function editProxy(proxy,state){
	if(state == "edit"){
		$("#addProxy h3").text("修改代理方");
		$("#subP").attr("state","edit");
		$("#proxy_id").attr("disabled","disabled");
	}
	
	var  url = "http://"+publicElement.ip+":"+publicElement.port+"/vmap/proxy!select?proxy_id="+proxy+"&jsoncallback=?";
    $.getJSON(
        url,
        function( result ) {
            if ( !result.success ) {
                return;
            }
			$("#btn-add").trigger("click");
			var data = result.proxy[0];
			$("#proxy_id").val(data.proxy_id);
			$("#proxy_name").val(data.proxy_name);
			$("#proxy_name").attr("uuid",data.proxy_id);
			$("#showname").val(data.show_name);
			$("#password").val(data.password);
			$("#contact").val(data.contact);
			$("#con_per").val(data.con_per);
			$("#address").val(data.address);
			$("#phone").val(data.phone);
			$("#email").val(data.email);
			$("#proxy_color").val(data.proxy_color);
            $(".colorPicker-picker").val(data.proxy_color);
			$(".colorPicker-picker").attr("style","background-color:#"+data.proxy_color);
			$("#other_info").val(data.other_info);
	    }
    );
}

// submit proxy changes
function submitProxy() {
    var url = 'http://'+publicElement.ip+":"+publicElement.port+'/vmap/edit!edit_proxy?jsonstr=';
    var data = {
		proxy_id:$("#proxy_name").attr("uuid"),
        proxy_name: $("#proxy_name").val(),
		show_name: $("#showname").val(),
        password: $("#password").val(),
        address: $("#address").val(),
        phone: $("#phone").val(),
        email: $("#email").val(),
		con_per: $("#con_per").val(),
		contact: $("#contact").val(),
        proxy_color:$("#proxy_color").val(),
        other_info:$("#other_info").val()
    };
    data = JSON.stringify(data);
    url += data+"&jsoncallback=?";
	console.log(url);
    $.post(url,function(data){
        $("#addProxy").modal("hide");
		location.reload();
		
    },"json");
   // return false;
}

$("#addProxy").on('hidden.bs.modal',function(){
		$("#addProxy h3").text("增加代理方");
		$("#proxy_color").removeAttr("style");
		$("#proxy_id").removeAttr("disabled");
		clearProxy();
});

// add proxy 
function addProxy() {
    var url = 'http://'+publicElement.ip+":"+publicElement.port+'/vmap/insert!insert_proxy?jsonstr=';
    var data = {
        proxy_id : $("#proxy_id").val(),
        proxy_name: $("#proxy_name").val(),
		show_name: $("#showname").val(),
        password: $("#password").val(),
        address: $("#address").val(),
        phone: $("#phone").val(),
        email: $("#email").val(),
		con_per: $("#con_per").val(),
		contact: $("#contact").val(),
        proxy_color:$("#proxy_color").val(),
        other_info:$("#other_info").val()
    };
    data = JSON.stringify(data);
    url += data+"&jsoncallback=?";
	console.log(url);
	 $.getJSON(
        url,
        function( result ) {
            if ( !result.success ) {
                alert(result.message);
            }
			else{
				clearProxy();
				$("#addProxy").modal("hide");
				location.reload();
			}	
	    }
    );
}


//proxy submit button submit 
    $("#subP").on("click",function(event) {
		if($("#info_form").get(0).checkValidity()){
			var $state = $("#subP");
			if($state.attr("state") == "edit"){
				submitProxy();
				$state.removeAttr("state");
                return false;
			}else{
				addProxy();
                return false;
			} 
		} 
    });
	
//main entrance
$(document).ready(function(){
    getProxyList();
    $('#proxy_color').colorPicker();
});