<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>消息</title>
	<meta name="viewport" content="user-scalable=no, width=device-width, initial-scale=1, maximum-scale=1">
     <meta http-equiv="pragma" content="no-cache">
    <meta http-equiv="cache-control" content="no-cache">
    <meta http-equiv="cache-control" content="no-store">
    <meta http-equiv="expires" content="0">
        <%
	        response.setHeader("Pragma","No-cache");          
	        response.setHeader("Cache-Control","no-cache");   
	        response.setHeader("Cache-Control", "no-store");   
	        response.setDateHeader("Expires",0);  
 		%>
    <link id="bs-css" href="css/bootstrap-cerulean.min.css" rel="stylesheet">

    <link href="css/charisma-app.css" rel="stylesheet">
    <!--<link href="bower_components/bootstrap/dist/css/bootstrap.min.css" rel="stylesheet">-->
    <link href='css/noty_theme_default.css' rel='stylesheet'>
	<link href="css/dataTables.bootstrap.css">
    <link href='css/animate.min.css' rel='stylesheet'>
	<link href='css/style.css' rel="stylesheet">
    <!-- The fav icon -->
    <link rel="shortcut icon" href="img/favicon.ico">

  </head>

  <body>
    <div class="navbar navbar-default" role="navigation">

        <div class="navbar-inner">
            <button type="button" class="navbar-toggle pull-left animated flip">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <a class="navbar-brand" href="#"> <img alt="Charisma Logo" src="img/logo20.png" class="hidden-xs"/>
                <span>展位管理平台</span></a>

            <!-- user dropdown starts -->
            <div class="btn-group pull-right theme-container animated tada">
                <button class="btn btn-default dropdown-toggle" data-toggle="dropdown">
                    <i class="glyphicon glyphicon-user"></i>
                    <span class="hidden-sm hidden-xs" id="login_proxy" uid="${sessionScope.proxy.proxy_id}"> ${sessionScope.proxy.show_name}</span>
                    <span class="caret"></span>
                </button>
                <ul class="dropdown-menu">
                    <li><a href="#">个人资料</a></li>
                    <li class="divider"></li>
                    <li><a href="loginOut">注销</a></li>
                </ul>
            </div>
     </div>
</div>
    <!-- topbar ends -->
	
	
    <div class="ch-container">
      <div class="row">
        
        <!-- left menu starts -->
        <div class="col-sm-2 col-lg-2">
        <div>
			<ul class="breadcrumb">
			<li>
				<a href="#">主页</a>
			</li>
			<li>
				<a href="#">消息查看</a>
			</li>
			</ul>
			</div>	
			
          <div class="sidebar-nav">
            <div class="nav-canvas">
              <div class="nav-sm nav nav-stacked">
              </div>
              <ul id = "leftMenu" class="nav nav-pills nav-stacked main-menu">
                <li >
                  <a href="pr_home.jsp"><i class="glyphicon glyphicon-home"></i><span>  展位管理</span></a>                
                </li>
				<li class="active">
					<a href="pr_message.jsp"><i class="glyphicon glyphicon-comment"></i><span>  消息查看</span></a>
				</li>
				<li>
					<a href="pr_doc.jsp"><i class="glyphicon glyphicon-folder-close"></i><span>  文档说明</span></a>
				</li>
              </ul>
            </div>
          </div>
        </div>
        <!--/span-->
        <!-- left menu ends -->

        <noscript>
          <div class="alert alert-block col-md-12">
            <h4 class="alert-heading">警告!</h4>
            <p>You need to have <a href="http://en.wikipedia.org/wiki/JavaScript" target="_blank">JavaScript</a>
              enabled to use this site.</p>
          </div>
        </noscript>
		
        <div id="content" class="col-lg-10 col-sm-10">
          <!-- content starts -->
		
		  <div class="row">
              <div>
                  <ul id="myTab" class="nav nav-tabs">
                      <!--<h2><i class="glyphicon glyphicon-user"></i> 消息通知</h2>-->
                      <li class="active">
                          <a href="#home" data-toggle="tab">
                              最新消息
                          </a>
                      </li>
                      <li ><a href="#ios" data-toggle="tab">申请记录</a></li>
                      <!--li><a href="#addProxy" id="btn-add" data-toggle="modal" class="btn btn-round btn-default" ><i class="glyphicon glyphicon-plus">新消息</i></a></li-->
                      <li><a href="#addMessage" id="btn-add" data-toggle="tab" ><i class="glyphicon glyphicon-plus">新申请</i></a></li>

                  </ul>
              </div>

              <div id="myTabContent" class="tab-content">
                        <div class="tab-pane fade in active" id="home">
                            <div class="box col-md-12">
                                <div class="box-inner">
                                    <div class="box-content">
                                        <table class="table table-striped table-bordered table-condensed" id="proxyTable">
                                            <!--<table class="table table-striped table-bordered bootstrap-datatable datatable responsive" id="proxyTable">-->
                                            <thead>
                                            <tr>
                                                <th>编号</th>
                                                <th>主题</th>
                                                <th>时间</th>
                                                <th>发件人</th>
                                                <th>操作</th>
                                            </tr>
                                            </thead>
                                            <tbody>

                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="tab-pane fade" id="ios">
                                <div class="box col-md-12">
                                    <div class="box-inner">

                                        <div class="box-content">
                                             <table class="table table-striped table-bordered table-condensed" id="selfTable">

                                <!--<table class="table table-striped table-bordered bootstrap-datatable datatable responsive" id="proxyTable">-->
                                                    <thead>
                                                    <tr>

                                                        <th>编号</th>
                                                        <th>主题</th>
                                                        <th>时间</th>
                                                        <th>状态</th>
                                                        <th>操作</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>

                                                    </tbody>
                                                </table>
                                        </div>
                                    </div>
                                </div>
                        </div>
                        <div class="tab-pane fade" id="addMessage">
                                <div class="box col-md-12">
                                    <div class="box-inner">
                                        <div class="box-content">
                                            <form role="form" id="info_form">
                                                <div class="form-group">
                                                    <label for="newtitle">主题</label>
                                                    <span class="field">
                                                         <textarea rows="1" id="newtitle"  class="form-control" required="true"></textarea>
                                                    </span>
                                                </div>
                                                <div class="form-group ">
                                                    <label for="newcontent">内容</label>
                                                    <span class="field">
                                                         <textarea  rows="15" id="newcontent"  class="form-control" required="true"></textarea>
                                                    </span>
                                                </div>
                                                <button type="submit" class="btn btn-success" id="subP" onclick="addapply()">  发送  </button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                        </div>
                    </div>


				</div>
				</div>
				</div>
    <!--/span-->

    </div><!--/row-->
    </div><!--/#content.col-md-0-->
		
 </div><!--/fluid-row-->
	
	<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"
         aria-hidden="true">
			<div class="modal-dialog modal-sm">
			
				<div class="modal-content">
					<div class="modal-body">
						<p>设置</p>
					</div>

					<div class="modal-footer">
						<a href="#" class="btn btn-default" data-dismiss="modal">关闭</a>
					</div>
				</div>
			</div>
	</div>	
	
	<div class="modal fade" id="showApply" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal">×</button>
						<h3>消息详情</h3>
					</div>
					<div class="modal-body" >


					 <form class="form-horizontal" role="form">

							<div class="form-group form-group-sm has-success">
								<label class="col-sm-2 control-label">发件人</label>
								<span class="field">
                                         <textarea cols="60" rows="1" id="send_id" class="longinput" disabled="disabled"></textarea>
                                </span>
							</div>
							<div class="form-group form-group-sm has-success">
								<label class="col-sm-2 control-label">发送时间</label>
								<span class="field">
                                         <textarea cols="60" rows="1" id="show_time" class="longinput" disabled="disabled"></textarea>
                                </span>
							</div>
							<div class="form-group form-group-sm has-success">
								<label class="col-sm-2 control-label">主题</label>
								<span class="field">
                                         <textarea cols="60" rows="2" id="show_title" class="longinput" disabled="disabled"></textarea>
                                </span>
							</div>
							<div class="form-group form-group-sm has-success">
								<label class="col-sm-2 control-label">内容</label>
								<span class="field">
                                         <textarea cols="60" rows="10" id="show_content" class="longinput" disabled="disabled"></textarea>
                                </span>
							</div>

					</form>

					</div>
					<div class="modal-footer">
					<a id="closeD" href="#" class="btn btn-default" data-dismiss="modal">关闭</a>
					</div>
				</div>
			</div>
	</div>



      <div class="modal fade" id="editselfApply" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
          <div class="modal-dialog">
              <div class="modal-content">
                  <div class="modal-header">
                      <button type="button" class="close" data-dismiss="modal">×</button>
                      <h3>修改申请</h3>
                  </div>
                  <div class="modal-body" >


                      <form class="form-horizontal" role="form">

                          <div class="form-group form-group-sm has-success">
                              <label class="col-sm-2 control-label">主题</label>
								<span class="field">
                                         <textarea cols="60" rows="2" id="edit_self_title" class="longinput" required="true"></textarea>
                                </span>
                          </div>

                          <div class="form-group form-group-sm has-success">
                              <label class="col-sm-2 control-label">申请内容</label>
								<span class="field">
                                         <textarea cols="60" rows="10" id="edit_self_content" class="longinput" required="true"></textarea>
                                </span>
                          </div>


                      </form>

                  </div>
                  <div class="modal-footer">
                      <a id="closeD" href="#" class="btn btn-default" data-dismiss="modal">关闭</a>
                      <button id="submit" class="btn btn-primary" type="submit">提交</button>
                  </div>
              </div>
          </div>
      </div>

      <div class="modal fade" id="showselfApply" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
          <div class="modal-dialog">
              <div class="modal-content">
                  <div class="modal-header">
                      <button type="button" class="close" data-dismiss="modal">×</button>
                      <h3>申请详情</h3>
                  </div>
                  <div class="modal-body" >


                      <form class="form-horizontal" role="form">

                          <div class="form-group form-group-sm has-success">
                              <label class="col-sm-2 control-label">主题</label>
								<span class="field">
                                         <textarea cols="60" rows="2" id="show_self_title" class="longinput" disabled="disabled"></textarea>
                                </span>
                          </div>
                          <div class="form-group form-group-sm has-success">
                              <label class="col-sm-2 control-label">发送时间</label>
								<span class="field">
                                         <textarea cols="60" rows="1" id="show_self_time" class="longinput" disabled="disabled"></textarea>
                                </span>
                          </div>

                          <div class="form-group form-group-sm has-success">
                              <label class="col-sm-2 control-label">申请内容</label>
								<span class="field">
                                         <textarea cols="60" rows="10" id="show_self_content" class="longinput" disabled="disabled"></textarea>
                                </span>
                          </div>
                          <div class="form-group form-group-sm has-success">
                              <label class="col-sm-2 control-label">回复内容</label>
								<span class="field">
                                         <textarea cols="60" rows="10" id="show_self_reply" class="longinput" disabled="disabled"></textarea>
                                </span>
                          </div>

                      </form>

                  </div>
                  <div class="modal-footer">
                      <a id="closeD" href="#" class="btn btn-default" data-dismiss="modal">关闭</a>

                  </div>
              </div>
          </div>
      </div>

   
	<!-- jQuery -->
    <script src="js/jquery.min.js"></script>

    <!-- The HTML5 shim, for IE6-8 support of HTML5 elements -->
    <!--[if lt IE 9]>
        <script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
        <![endif]-->
    <!-- external javascript -->

    <script src="js/bootstrap.min.js"></script>
	<script src='js/jquery.dataTables.min.js'></script>
	<script  src="js/dataTables.bootstrap.js"></script>

    <script src="js/charisma.js"></script>
    <script src="js/message_min.js"></script>

  </body>
</html>
