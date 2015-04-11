<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE html>
<html lang="en">
  <head>
    <title>首页</title>
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
    <link href='css/noty_theme_default.css' rel='stylesheet'>
    <link href='css/animate.min.css' rel='stylesheet'>
	<link href='css/style.css' rel="stylesheet">
    <style type="text/css">
      @font-face{
      font-family: vmap;
	  src: url('VMapPublic.ttf');
      }
	  .label{
		color:#fff;
	  }
    </style>
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
                    <span class="hidden-sm hidden-xs" id="login_proxy" uid="${sessionScope.visitor}"> 游客</span>
                    <span class="caret"></span>
                </button>
                <ul class="dropdown-menu">
                    <li><a href="#">个人资料</a></li>
                    <li class="divider"></li>
                    <li><a href="loginOut" onclick="javascript:location.replace(this.href); event.returnvalue=false;">注销</a></li>
                </ul>
            </div>
     </div>
</div>

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
					<a href="#">展位查看</a>
				</li>
				</ul>
		  </div>
		  <div class="sidebar-nav">
            <div class="nav-canvas">
              <div class="nav-sm nav nav-stacked">
              </div>
              <ul id = "leftMenu" class="nav nav-pills nav-stacked main-menu">
                <li id = "view" class="accordion active">
                  <a href="#"><i class="glyphicon glyphicon-home"></i><span>  展位查看</span></a>
					<ul id="viewList" class="nav nav-pills nav-stacked">						
					</ul>
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
		
        <div id="content" class="col-lg-10 col-sm-10" style="height:700px;padding:0;">
          <!-- content starts -->
			
			<!-- map tool bar -->
				<div id="toolbar" class="btn-toolbar" role="toolbar">
					<div id="versionButton" class="btn-group">
					  <button id="versionTitle" type="button" class="btn btn-success">版本选择</button>
					  <button id="versionTri" type="button" class="btn btn-success dropdown-toggle" data-toggle="dropdown">
						<span class="caret"></span>
						<span class="sr-only"></span>
					  </button>
					  <ul id="versionList" class="dropdown-menu" role="menu">
					  </ul>
					</div>
					
                    <div class="btn-group" id="state_box">
					  <button  class="btn btn-defaul" style="background-color:#e6eece" disabled="disabled">未售</button>
					  <button  class="btn btn-info" disabled="disabled">签约</button>
					  <button  class="btn btn-primary" disabled="disabled">付款</button>
					</div>
				</div>
		<!-- put your map here -->
		  <div id="map_frame">
		  </div>
	      
		  <div id="cantainer" style="display:none"><img id="image"/></div>
		  
		  <div id="scale_box">
			<div class="btn-group-vertical">
              <a id="floorSwitch" class="btn btn-default" title="楼层选择">
				<i class="glyphicon glyphicon-sort"></i>
			  </a>
			  <a class="btn btn-default" id="zoomIn" href="#" title="放大">
				<i class="glyphicon glyphicon-zoom-in"></i>
			  </a>
			  <a class="btn btn-default" id="zoomOut" href="#" title="缩小">
				<i class="glyphicon glyphicon-zoom-out"></i>
			  </a>
			  <a class="btn btn-default" id="showFacilities" href="#" title="公共设施">
				<i class="glyphicon glyphicon-info-sign"></i>
			  </a>
			 
			</div>
		  </div>

        </div><!--/#content.col-md-0-->
    </div><!--/fluid-row-->
    </div>

 <footer>
		<div class="jumbotron" style="margin-top:25px">
		        <div class="container">		
					<div class="row">
						<div class="col-xs-12">
							<div class="submit">
								<p class="text-center"> <a>展位管理平台</a></p>
								<p class="text-center">Copyright&copy; 2014</p>
							</div>
						</div>
					</div>				
				</div>
		</div>
</footer>
	
	<!--modals-->
	  <div class="modal fade" id="floorModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal">×</button>
	    	  <h3 class="modal-title" id="myModalLabel">楼层选择</h3>
            </div>
            <div class="modal-body">
              <div id="floorSelectorList" class="list-group text-center">
	            
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
            </div>
          </div>
        </div>
      </div>

    <div class="modal fade" id="generalModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal">×</button>
						<h3>展位信息</h3>
					</div>					
						<div class="modal-body">	
                            <form class="form-horizontal" role="form">	
								<div class="form-group form-group-sm">
									<label class="col-sm-3 control-label"> 商铺编号</label>
									<div class="col-sm-3"><input type="text" class="form-control" id="general_num"></div>
                                    
                                    <label class="col-sm-2 control-label">面积</label>
									<div class="col-sm-3"><input type="text"  class="form-control" id="general_area"></div>
								</div>			
									
								<div class="form-group form-group-sm">
									<label class="col-sm-3 control-label"> 长度</label>
									<div class="col-sm-3"><input type="text" class="form-control" id="general_length"></div>
									
									<label class="col-sm-2 control-label"> 宽度</label>
									<div class="col-sm-3"><input type="text" class="form-control" id="general_width"></div>
								</div>
								
								<div class="form-group form-group-sm">
									<label class="col-sm-3 control-label">展位名称</label>
									<div class="col-sm-8"><input type="text" class="form-control" id="general_show_name"></div>
								</div>
								<div class="form-group form-group-sm">
									<label class="col-sm-3 control-label">开放时间</label>
									<div class="col-sm-8"><input type="text" class="form-control" id="general_time"></div>
								</div>
								<div class="form-group form-group-sm">
									<label class="col-sm-3 control-label">地址</label>
									<div class="col-sm-8"><input type="text" class="form-control" id="general_address"></div>
								</div>
								<div class="form-group form-group-sm">
									<label class="col-sm-3 control-label">代理方名称</label>
									<div class="col-sm-8"><input type="text" class="form-control" id="general_proxy_name"></div>
								</div>
								<div class="form-group form-group-sm">
									<label class="col-sm-3 control-label">关键字</label>
									<div class="col-sm-8"><input type="text" class="form-control" id="general_keyword"></div>
								</div> 
                            </form>
						</div>
						<div class="modal-footer">
						  <a  href="#" class="btn btn-default" data-dismiss="modal">关闭</a>
						</div>	
				</div>
			</div>
	</div>
</body>

	<!-- jQuery -->
    <script src="js/jquery.min.js"></script>

    <!-- The HTML5 shim, for IE6-8 support of HTML5 elements -->
    <!--[if lt IE 9]>
        <script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
        <![endif]-->
    <!-- external javascript -->

    <script src="js/bootstrap.min.js"></script>
    <!-- application script for Charisma demo -->
    <script src="js/charisma.js"></script>
	<script src="js/H.js"></script>
	<script src="js/pr_Vmap_min.js"></script>
    <script src="js/pr_home_min.js"></script>
	<script>
	</script>
</html>
