<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE html>
<html lang="en">
  <head>
    <title>操作文档</title>
    
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
                    <i class="glyphicon glyphicon-user"></i><span class="hidden-sm hidden-xs"> ${sessionScope.admin.username}</span>
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
				<a href="#">操作文档</a>
			</li>
			</ul>
		</div>	
          <div class="sidebar-nav">
            <div class="nav-canvas">
              <div class="nav-sm nav nav-stacked">
              </div>
              <ul id = "leftMenu" class="nav nav-pills nav-stacked main-menu">
                <li id = "view">
                  <a href="ad_home.jsp"><i class="glyphicon glyphicon-home"></i><span>  展位管理</span></a>                
                </li>
				<li>
					<a href="ad_apply.jsp"><i class="glyphicon glyphicon-comment"></i><span>  消息查看</span></a>
				</li>
				<li>
					<a href="ad_proxy.jsp"><i class="glyphicon glyphicon-th"></i><span>  人员管理</span></a>
				</li>
				<li class="active">
					<a href="ad_doc.jsp"><i class="glyphicon glyphicon-folder-close"></i><span>  文档说明</span></a>
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
				<div class="box col-md-12" style="margin-top:0px">
				<div class="box-inner">
				<div class="box-header well" data-original-title="">
					<h2><i class="glyphicon glyphicon-edit"></i> 操作文档</h2>
					<div class="box-icon">
						<a href="#" class="btn btn-minimize btn-round btn-default"><i class="glyphicon glyphicon-chevron-up"></i></a>
					</div>
				</div>
				<div class="box-content">		  
						<h1 class="text-center">展位管理系统操作文档</h1>
						<ul>
							<li>1.	左侧菜单栏</li>
								<ul>
								<li>1.1 展位查看：点击下方地址列表，可查看相应的展位平面图。版本默认为展位底图。</li>
								<li>1.2 消息查看：尚在建设中。</li>
								<li>1.3 人员管理：点击进入人员管理界面。其中，点击页面右上方“+”键添加代理方。 </;li>
								<li>1.4 文档说明：点击进入该文档页面。</li>
								</ul>
							<li>2.	上方按钮工具栏</li>
							以从左至右顺序依次说明各个按钮功能。<br>
							<ul>
								<li>2.1 版本切换按钮：默认版本为展位底图，点击下拉按钮可以切换至展位销售版或销售进度版，展位底图只有查看各个block功能。切换至展位销售版才可以对block进行其他操作。</li>
								<li>2.2 分配按钮：点击 <strong>分配</strong> 按钮，点击选择地图上想要分配的block块，再点击 <strong>完成</strong> 按钮，在弹出的代理人列表选择代理人，完成分配功能。</li>
								<li>2.3 出售按钮：点击 <strong>出售</strong> 按钮，点击地图上欲出售的block块，在弹出窗中点击出售，添加出售信息，或者修改已有公司的出售状态，点击提交完成操作。</li>
								<li>2.4 合并按钮：点击 <strong>合并</strong> 按钮，点击选择地图上想要合并的block块，再点击 <strong>完成</strong> 按钮，完成合并操作。</li>
								<li>2.5 拆分按钮：点击 <strong>拆分</strong> 按钮，点击图上欲拆分的block块，在弹出框中点击拆分，添加拆分信息，点击拆分完成操作。<mark>注：
								添加的拆分信息为新拆的block，原block剩下的部分按照原block信息，无需添加</mark></li>
								<li>2.6 涂色按钮：点击 <strong>涂色</strong> 按钮，点击地图上欲涂色的block块，在弹出窗中点击涂色，对该块完成涂色。<mark>注：涂色后的地图不可放大或缩小，会导致涂色效果消失，需重新涂色。<mark/></li>
								<li>2.7 添加按钮：点击 <strong>添加</strong> 按钮，在弹出页面添加block块详细信息，点击添加后在地图上点击合适位置放置图形，点击 <strong>完成</strong> 按钮，完成添加功能。</li>
								<li>2.8 删除按钮：点击 <strong>删除</strong> 按钮，点击地图上欲删除的block块，在弹出窗中点击删除，完成删除操作。</li>
								<li>2.9 修改按钮：点击 <strong>修改</strong> 按钮，在弹出页面修改block块详细信息，长宽的修改会使地图上block形状改变。点击修改完成操作。</li>
								
								<li>2.10 完成按钮：在分配、添加、合并中会用到。</li>
								<li>2.11 PDF按钮：点击 <strong>PDF</strong> 按钮，下载当前版本地图所对应的PDF文件</li>
								<li>2.12 Excel按钮：点击 <strong>Excel</strong> 按钮，下载当前版本地图对应的Excel文件。<mark>注：PDF和Excel的下载都使用的是浏览器内置下载，下载路径为浏览器默认下载路径。
								如使用迅雷等下载插件，则可能出现下载不成功情况</mark></li>
							</ul>
							
							<li>3.	右侧按钮工具栏</li>
							以从上至下顺序依次说明各个按钮功能。<br>
							<ul>
							<li>3.1 楼层切换：点击 楼层切换，会弹出该展会所有楼层，点击某一楼层可切换楼层。注：目前只有一层。</li>
							<li>3.2 放大：点击 放大 ，放大地图。</li>
							<li>3.3 缩小：点击 缩小 ，缩小地图。</li>
							</ul>
							<li>4.	浏览器兼容性</li>
							<mark>火狐浏览器不兼容，360浏览器兼容模式下不兼容。</mark>
						</ul> 
				</div>
				</div>
				</div>
		
		<div class="box col-md-12" style="margin-top:0px">
				<div class="box-inner">
				<div class="box-header well" data-original-title="">
					<h2><i class="glyphicon glyphicon-info-sign"></i> 版本更新</h2>
					<div class="box-icon">
						<a href="#" class="btn btn-minimize btn-round btn-default"><i class="glyphicon glyphicon-chevron-up"></i></a>
					</div>
				</div>
				<div class="box-content">		  
						<h1 class="text-center">版本1.2     &nbsp;  &nbsp; &nbsp;&nbsp;  2014/11/28</h1>
						<ul>
							<li>1.	修复及更新日志</li>
								<ul>
								<li>1.1 新增用户登录、注销功能功能。</li>
								<li>1.2 根据登录用户的角色，分配对地图不同的操作权限。</li>
								<li>1.3 消息查看、申请、审核功能：代理方查看消息或者提交申请，主办方查看申请或者审核代理方所提交的申请。</li>
								<li>1.4 修复了公共设施显示方面的bug。</li>
								</ul>			
						</ul> 
				</div>
				</div>
				</div>
		
		<div class="box col-md-12" style="margin-top:0px">
				<div class="box-inner">
				<div class="box-header well" data-original-title="">
					<h2><i class="glyphicon glyphicon-info-sign"></i> 版本更新</h2>
					<div class="box-icon">
						<a href="#" class="btn btn-minimize btn-round btn-default"><i class="glyphicon glyphicon-chevron-up"></i></a>
					</div>
				</div>
				<div class="box-content">		  
						<h1 class="text-center">版本1.1 &nbsp;  &nbsp; &nbsp;&nbsp;      2014/11/20</h1>
						<ul>
							<li>1.	修复及更新日志</li>
								<ul>
								<li>1.1 新增导出PDF、Excel功能。</li>
								<li>1.2 新增拆分block块功能。<mark>注：只能完整的横向分为两块或者纵向分为两块。</mark></li>
								<li>1.3 新增销售进度查看功能。</li>
								<li>1.4 重做了修改和添加功能。</li>
								<li>1.5 修复了工具按钮模式切换、添加或者修改block时长宽的校验，参考面积的计算、重做了调色板等。</li>
								</ul>
							<li>2.	未完成功能</li>
							<ul>
								<li>2.1 用户登录、注销：输入用户名或者密码，才能登录平台。</li>
								<li>2.2 权限分配：根据登录用户角色的不同，分配对地图操作的不同权限。</li>
								<li>2.3 消息查看、申请、审核：代理方查看消息或者提交申请，主办方查看申请或者审核代理方所提交的申请。</li>
							</ul>
							
							<li>3.	已完成功能</li>
							<ul>
							<li>3.1 展位图版本切换：目前有三个版本，底图、销售图及销售进度图。</li>
							<li>3.2 展位图基本功能：地图的显示、楼层切换、地图拖动及放大缩小等。</li>
							<li>3.3 展位图高级功能：显示block详情、分配代理方、出售block、合并、拆分、涂色、添加、删除、修改。</li>
							<li>3.4 导出文件：可导出展位图的PDF及展位数据报表。</li>
							<li>3.5 人员管理：对代理方的添加、删除、修改。</li>
							</ul>							
						</ul> 
				</div>
				</div>
				</div>
			</div><!--/row-->
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
	<script>
	</script>
  </body>
</html>
