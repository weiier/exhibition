//global variable
var publicElement = (function () {
	this.ip = "123.57.46.160";
	this.port = "8080";
    return this;
})();

function getProxy() {

    var  url = "http://"+publicElement.ip+":"+publicElement.port+"/vmap/proxy!all?jsoncallback=?";
    $.getJSON(
        url,
        function( result ) {
            if ( !result.success ) {

                return;
            }
            for ( var i = 0; i < result.total; i++ ) {
                var addselect = "<option value='"+result.proxy[i].proxy_id+"'>"+ result.proxy[i].show_name + "</option>";


                $("#select1").append(addselect);

            }

        }
    );

}

//get list of proxy
function getProxyList() {
	
	var  url = "http://"+publicElement.ip+":"+publicElement.port+"/vmap/apply!adminSelectNew?jsoncallback=?";
    $.getJSON(
        url,
        function( result ) {
            if ( !result.success ) {
				$("#proxyTable").dataTable();
                return;
            }
			var $tbody = $("#proxyTable tbody");
            for ( var i = 0; i < result.total; i++ ) {

                var $tr = null;


                    var temp = result.apply[i].title;
                    if(result.apply[i].title.length>20)
                        temp = result.apply[i].title.substr(0,20) + "...";
                    $tr = $("<tr><td>"+result.apply[i].apply_id+"</td><td><b>"+ temp
                        +"</b></td><td>"+result.apply[i].last_modify_time+"</td><td>"+result.apply[i].create_id+"</td>"+ "<td class='center'> <a class='btn btn-success btn-xs'> <i class='glyphicon glyphicon-zoom-in icon-white'></i> 查看</a> <a class='btn btn-info btn-xs'>"+
                        " <i class='glyphicon glyphicon-edit icon-white'></i> 回复</a></td></tr>");
			    $tr.attr("apply_id",result.apply[i].apply_id);
				$tr.on("click",function(e){
					var $target = $(e.target); 
					if($target.hasClass("btn-success")||$target.parent().hasClass("btn-success")){
						showApply($target.parents("tr").attr("apply_id"));
					}else if($target.hasClass("btn-info")||$target.parent().hasClass("btn-info")) {
                        editapply($target.parents("tr").attr("apply_id"),1);
                    }
				});
				$tbody.append($tr);
            }	
			$("#proxyTable").dataTable(
                {

                    "order": [ 2, 'desc' ]
                }

            );
        }
    );
	
}

function getSelfList() {
    var  url = "http://"+publicElement.ip+":"+publicElement.port+"/vmap/apply!adminSelectOld?jsoncallback=?";
    $.getJSON(
        url,
        function( result ) {
            if ( !result.success ) {
                $("#selfTable").dataTable();
                return;
            }
            var $tbody = $("#selfTable tbody");
            for ( var i = 0; i < result.total; i++ ) {

                var $tr = null;
                var temp = result.apply[i].title;
                if(result.apply[i].title.length>20)
                    temp = result.apply[i].title.substr(0,20) + "...";
                if(result.apply[i].state == "1")
                {
                    state = "审核通过";
                    $tr = $("<tr><td>"+result.apply[i].apply_id+"</td><td><b><font color='green'>"+temp
                        +"</font></b></td><td>"+result.apply[i].create_id+"</td>" +
                        "<td>"+result.apply[i].last_modify_time+"</td><td><b><font color='green'>"+state+"</font></b></td>"+"<td class='center'> <a class='btn btn-success btn-xs'> <i class='glyphicon glyphicon-zoom-in icon-white'></i> 查看</a> <a class='btn btn-info btn-xs'>"+
                        " <i class='glyphicon glyphicon-edit icon-white'></i> 修改</a></td></tr>");
                }
                if(result.apply[i].state == "2")
                {
                    state = "审核未通过";
                    $tr = $("<tr><td>"+result.apply[i].apply_id+"</td><td><b><font color='red'>"+temp
                        +"</font></b></td><td>"+result.apply[i].create_id+"</td><td>"+result.apply[i].last_modify_time+"</td><td><b><font color='red'>"+state+"</font></b></td>"+
                        "<td class='center'> <a class='btn btn-success btn-xs'> <i class='glyphicon glyphicon-zoom-in icon-white'></i> 查看</a> <a class='btn btn-info btn-xs'>"+
                        " <i class='glyphicon glyphicon-edit icon-white'></i> 修改</a></td></tr>");
                }
                $tr.attr("apply_id",result.apply[i].apply_id);
                $tr.on("click",function(e){
                    var $target = $(e.target);
                    if($target.hasClass("btn-success")||$target.parent().hasClass("btn-success")){
                        showApply($target.parents("tr").attr("apply_id"));
                    }
                    else if($target.hasClass("btn-info")||$target.parent().hasClass("btn-info")) {
                        editapply($target.parents("tr").attr("apply_id"),2);
                    }
                });
                $tbody.append($tr);
            }
            $("#selfTable").dataTable(
                {

                    "order": [ 2, 'desc' ]
                }

            );
        }
    );


}


function getInformList() {

    var  url = "http://"+publicElement.ip+":"+publicElement.port+"/vmap/apply!adminSelectInform?jsoncallback=?";
    $.getJSON(
        url,
        function( result ) {
            if ( !result.success ) {
                $("#informTable").dataTable();
                return;
            }
            var $tbody = $("#informTable tbody");
            for ( var i = 0; i < result.total; i++ ) {

                var $tr = null;


                var temp = result.apply[i].title;
                if(result.apply[i].title.length>20)
                    temp = result.apply[i].title.substr(0,20) + "...";
                $tr = $("<tr><td>"+result.apply[i].apply_id+"</td><td><b>"+ temp
                    +"</b></td><td>"+result.apply[i].last_modify_time+"</td><td>"+result.apply[i].send_id+"</td>"+ "<td class='center'> <a class='btn btn-success btn-xs'> <i class='glyphicon glyphicon-zoom-in icon-white'></i> 查看</a> </td></tr>");
                /*<a class='btn btn-info btn-xs'>"+
                 " <i class='glyphicon glyphicon-edit icon-white'></i> 修改</a>*/
                $tr.attr("apply_id",result.apply[i].apply_id);
                $tr.on("click",function(e){
                    var $target = $(e.target);
                    if($target.hasClass("btn-success")||$target.parent().hasClass("btn-success")){
                        showApply($target.parents("tr").attr("apply_id"));
                    }else if($target.hasClass("btn-info")||$target.parent().hasClass("btn-info")) {
                        editapply($target.parents("tr").attr("apply_id"),1);
                    }
                });
                $tbody.append($tr);
            }
            $("#informTable").dataTable(
                {

                    "order": [ 2, 'desc' ]
                }

            );
        }
    );

}

function showApply(proxy){
    var  url = "http://"+publicElement.ip+":"+publicElement.port+"/vmap/apply!find?apply_id="+proxy+"&jsoncallback=?";
    $.getJSON(
        url,
        function( result ) {
            if ( !result.success ) {
                return;
            }
			$("#showApply").modal("show");
			var data = result.apply[0];

			$("#show_id").val(data.apply_id);
            $("#send_id").val(data.create_id);
            $("#show_time").val(data.last_modify_time);
            $("#show_title").val(data.title);
			$("#show_content").val(data.content);


	    }
    );
}

function showselfApply(proxy) {
    $("#edit").text("关闭");
    var  url = "http://"+publicElement.ip+":"+publicElement.port+"/vmap/apply!find?apply_id="+proxy+"&jsoncallback=?";
    $.getJSON(
        url,
        function (result) {
            if (!result.success) {
                return;
            }
            $("#showselfApply").modal("show");
            var data = result.apply[0];

            $("#show_self_time").val(data.last_modify_time);
            $("#show_self_title").val(data.title);
            $("#show_self_reply").val(data.reply);
            $("#show_self_content").val(data.content);

        }
    );
}

function editapply(proxy,state) {

    if(state == 2)
    {
        $("#editselfApply h3").text("修改回复");
    }
    if(state == 1)
    {
        $("#editselfApply h3").text("回复申请");
    }
    var  url = "http://"+publicElement.ip+":"+publicElement.port+"/vmap/apply!find?apply_id="+proxy+"&jsoncallback=?";
    $.getJSON(
        url,
        function (result) {
            if (!result.success) {
                return;
            }
            $("#editselfApply").modal("show");
            var data = result.apply[0];
            $("#edit_self_create").val(data.create_id);
            $("#edit_self_time").val(data.last_modify_time);
            $("#edit_self_title").val(data.title);
            $("#edit_self_reply").val(data.reply);
            $("#edit_self_content").val(data.content);

        }
    );

    $("#submit").on("click",function(e) {
       subapply(proxy);
    });
}
function subapply(proxy){

    var url = 'http://'+publicElement.ip+":"+publicElement.port+'/vmap/edit!edit_apply?jsonstr=';
    var data = {
        title : $("#edit_self_title").val(),
        content: $("#edit_self_content").val(),
        reply: $("#edit_self_reply").val(),
        sign: "0",
        state: $("#selectstate input:checked").val(),
        send_id: "admin",
        create_id: $("#edit_self_create").val(),
        apply_id : proxy
    };
    data = JSON.stringify(data);
    url += data+"&jsoncallback=?";
    console.log(url);
    $.post(url,function(data){
        //$("#closeD").trigger("click");
        location.reload();

    },"json");

   // alert("修改成功");
    // clearProxy();
    //return false;
}

function addapply() {

    var sendproxy ="";
    $("#select2 option").each(function () {
        var txt = $(this).text() + ";"; //获取单个text
        var val = $(this).val() + ";"; //获取单个value
        sendproxy += val;

    });

    if($("#newcontent").val()== "" || $("#newtitle").val()=="" || sendproxy == "")
    {
        alert("请正确填写");
        return false;
    }


    var url = 'http://'+publicElement.ip+":"+publicElement.port+'/vmap/insert!insert_apply?jsonstr=';
    var data = {
        title : $("#newtitle").val(),
        content: $("#newcontent").val(),
        reply: "",
        sign: "0",
        state: "0",
        send_id: sendproxy,
        create_id: "admin"
    };
    data = JSON.stringify(data);
    url += data+"&jsoncallback=?";
    console.log(url);
    $.post(url,function(data){
        //$("#closeD").trigger("click");
       location.reload();

    },"json");
    //return false;
    alert("发送成功");
   // clearProxy();*/
    return false;
}


$("#select1").on("click",function(){

    var $options = $("#select1 option:selected");

    $options.appendTo("#select2");
});

$("#select2").on("click",function(){

    var $options = $("option:selected",this);

    $options.appendTo("#select1");
});

//main entrance
$(document).ready(function(){
    getProxyList();
    getProxy();
    getSelfList();
    getInformList();
});