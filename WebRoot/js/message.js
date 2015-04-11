//global variable
var publicElement = (function () {
	this.ip = "10.103.241.247";
	this.port = "8888";
	this.login_id = null;
    return this;
})();

//get list of proxy
function getProxyList() {
	
	var  url = "http://"+publicElement.ip+":"+publicElement.port+"/vmap/apply!proxySelectAdmin?login_id="+publicElement.login_id+"&jsoncallback=?";
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
                if(result.apply[i].sign=="0")
                {
                   var temp = result.apply[i].title;
                   if(result.apply[i].title.length>20)
                         temp = result.apply[i].title.substr(0,20) + "...";
                    console.log(temp);
                    $tr = $("<tr><td>"+result.apply[i].apply_id+"</td><td><b><font color='red'>"+temp
                        +"</font></b></td><td>"+result.apply[i].last_modify_time+"</td><td>"+result.apply[i].create_id+"</td>"+"<td class='center'> <a class='btn btn-success btn-xs'> <i class='glyphicon glyphicon-zoom-in icon-white'></i> 查看</a> </td></tr>");


                }
                else{

                    var temp = result.apply[i].title;
                    if(result.apply[i].title.length>20)
                        temp = result.apply[i].title.substr(0,20) + "...";
                    $tr = $("<tr><td>"+result.apply[i].apply_id+"</td><td><b>"+ temp
                        +"</b></td><td>"+result.apply[i].last_modify_time+"</td><td>"+result.apply[i].create_id+"</td>"+"<td class='center'> <a class='btn btn-success btn-xs'> <i class='glyphicon glyphicon-zoom-in icon-white'></i> 查看</a> </td></tr>");

                }
			    $tr.attr("apply_id",result.apply[i].apply_id);
				$tr.on("click",function(e){
					var $target = $(e.target); 
					if($target.hasClass("btn-success")||$target.parent().hasClass("btn-success")){
						showApply($target.parents("tr").attr("apply_id"));
					}else if($target.hasClass("btn-primary")||$target.parent().hasClass("btn-primary")){
						deleteProxy($target.parents("tr").attr("apply_id"));
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

    var  url = "http://"+publicElement.ip+":"+publicElement.port+"/vmap/apply!proxySelectSelf?login_id="+publicElement.login_id+"&jsoncallback=?";
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
                var state = "已发送";
                if(result.apply[i].title.length>20)
                    temp = result.apply[i].title.substr(0,20) + "...";
                if(result.apply[i].state == "0")
                {
                    $tr = $("<tr><td>"+result.apply[i].apply_id+"</td><td><b>"+temp
                        +"</b></td><td>"+result.apply[i].last_modify_time+"</td><td>"+state+"</td>"+
                        "<td class='center'> <a class='btn btn-success btn-xs'> <i class='glyphicon glyphicon-zoom-in icon-white'></i> 查看</a> <a class='btn btn-info btn-xs'>"+
                        " <i class='glyphicon glyphicon-edit icon-white'></i> 修改</a></td></tr>");


                }
                if(result.apply[i].state == "1")
                {
                    state = "审核通过";
                    $tr = $("<tr><td>"+result.apply[i].apply_id+"</td><td><b><font color='green'>"+temp
                        +"</font></b></td><td>"+result.apply[i].last_modify_time+"</td><td><b><font color='green'>"+state+"</font></b></td>"+"<td class='center'> <a class='btn btn-success btn-xs'> <i class='glyphicon glyphicon-zoom-in icon-white'></i> 查看</a> </td></tr>");

                }
                if(result.apply[i].state == "2")
                {
                    state = "审核未通过";
                    $tr = $("<tr><td>"+result.apply[i].apply_id+"</td><td><b><font color='red'>"+temp
                        +"</font></b></td><td>"+result.apply[i].last_modify_time+"</td><td><b><font color='red'>"+state+"</font></b></td>"+
                        "<td class='center'> <a class='btn btn-success btn-xs'> <i class='glyphicon glyphicon-zoom-in icon-white'></i> 查看</a> </td></tr>");

                }
                $tr.attr("apply_id",result.apply[i].apply_id);
                $tr.on("click",function(e){
                    var $target = $(e.target);
                    if($target.hasClass("btn-success")||$target.parent().hasClass("btn-success")){
                        showselfApply($target.parents("tr").attr("apply_id"));
                    }else if($target.hasClass("btn-info")||$target.parent().hasClass("btn-info")) {
                        editapply($target.parents("tr").attr("apply_id"));
                    }
                });
                $tbody.append($tr);
            }
            $("#selfTable").dataTable
            (
                {

                    "order": [ 2, 'desc' ]
                }

            );
        }
    );

}

//show proxy
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
			$("#show_content").val(data.reply);
            updatesign(proxy);


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

function editapply(proxy) {


    var  url = "http://"+publicElement.ip+":"+publicElement.port+"/vmap/apply!find?apply_id="+proxy+"&jsoncallback=?";
    $.getJSON(
        url,
        function (result) {
            if (!result.success) {
                return;
            }
            $("#editselfApply").modal("show");
            var data = result.apply[0];

            $("#edit_self_time").val(data.last_modify_time);
            $("#edit_self_title").val(data.title);

            $("#edit_self_content").val(data.content);

        }
    );

    $("#submit").on("click",function(e) {
        subapply(proxy);
    });
}
function updatesign(id){
    var  url = "http://"+publicElement.ip+":"+publicElement.port+"/vmap/apply!updatesign?apply_id="+ id +"&jsoncallback=?";

    $.getJSON(
        url,
        function( result ) {

        }
    );
}

function subapply(proxy){

    var url = 'http://'+publicElement.ip+":"+publicElement.port+'/vmap/edit!edit_apply?jsonstr=';
    var data = {
        title : $("#edit_self_title").val(),
        content: $("#edit_self_content").val(),
        reply: "",
        sign: "0",
        state: "0",
        send_id: "admin",
        create_id: publicElement.login_id,
        apply_id : proxy
    };
    data = JSON.stringify(data);
    url += data+"&jsoncallback=?";
    console.log(url);
    $.post(url,function(data){
        //$("#closeD").trigger("click");
        //location.reload();

    },"json");

   // alert("修改成功");
    // clearProxy();
    //return false;
}

// add
function addapply() {

    if($("#newcontent").val()== "" || $("#newtitle").val()=="")
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
        send_id: "admin;",
        create_id: publicElement.login_id
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
   // clearProxy();
    return false;
}

//main entrance
$(document).ready(function(){
	publicElement.login_id = $("#login_proxy").attr("uid");
	getProxyList();
    getSelfList();
});