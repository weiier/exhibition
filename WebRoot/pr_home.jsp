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
    <link href='css/colorPicker.css' rel='stylesheet'>
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
                    <span class="hidden-sm hidden-xs" id="login_proxy" uid="${sessionScope.proxy.proxy_id}"> ${sessionScope.proxy.show_name}</span>
                    <span class="caret"></span>
                </button>
                <ul class="dropdown-menu">
                    <li><a href="#" id="profile">个人资料</a></li>
                    <li class="divider"></li>
                    <li><a href="loginOut" >注销</a>
                    </li>
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
				<li>
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
					
					
					<div class="btn-group" id="editMenuList">
					  <!--  
					  <button  id="assA" class="btn btn-info">
					  分配</button>  -->
					  <button id="saleA" class="btn btn-info">
					  出售</button>
					  <button id="mergerA" class="btn btn-info">
					  合并</button>
					  <button id="splitA" class="btn btn-info">
					  拆分</button>
					  <button id="fillA" class="btn btn-info">
					  涂色</button>
					
					  <button id="addA" class="btn btn-info">
					  添加</button>
					  <button id="deleteA" class="btn btn-info">
					  删除</button>
					  <button id="modifyA" class="btn btn-info">
						修改</button>
					</div>
					
					
					<div class="btn-group" id="add_box">
					  <button id="done" type="button" class="btn btn-info">
					  完成</button>
					</div>
					
					<div class="btn-group">
					  <button id="downloadPDF" type="button" class="btn btn-primary">
					  PDF</button>
					  <button id="downloadExc" type="button" class="btn btn-primary">
					  Excel</button>
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
	  
      <div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">       
		 <div class="modal-body">	
			<ul class="nav nav-pills" id="myTab">
				<li class="active"><a href="#detail" data-toggle="pill">详细信息</a></li>
				<li><a href="#reco" data-toggle="pill">推荐公司</a></li>
				<li><a href="#rese" data-toggle="pill">预留公司</a></li>
				<li><a href="#sign" data-toggle="pill">签约公司</a></li>
				<li><a href="#pay" data-toggle="pill">付款公司</a></li>
			</ul>
			<!-- Tab panes -->
			<div class="tab-content">
			  <div class="tab-pane fade in active" id="detail">
				<span>&nbsp;</span>
				<form  class="form-horizontal" role="form">	
					<div class="form-group form-group-sm">
						<label class="col-sm-3 control-label">展位名称</label>
						<div class="col-sm-8"><input type="text" class="form-control" id="unit_show_name"></div>
					</div>
					<div class="form-group form-group-sm">
						<label class="col-sm-3 control-label">长度</label>
						<div class="col-sm-8"><input type="text" class="form-control" id="unit_length"></div>
					</div>
					<div class="form-group form-group-sm">
						<label class="col-sm-3 control-label">宽度</label>
						<div class="col-sm-8"><input type="text" class="form-control" id="unit_width"></div>
					</div>
					<div class="form-group form-group-sm">
						<label class="col-sm-3 control-label">面积</label>
						<div class="col-sm-8"><input type="text" class="form-control" id="unit_area"></div>
					</div>
					<div class="form-group form-group-sm">
						<label class="col-sm-3 control-label">商铺编号</label>
						<div class="col-sm-8"><input type="text" class="form-control" id="unit_num"></div>
					</div>
					<div class="form-group form-group-sm">
						<label class="col-sm-3 control-label">开放时间</label>
						<div class="col-sm-8"><input type="text" class="form-control" id="unit_time"></div>
					</div>
					<div class="form-group form-group-sm">
						<label class="col-sm-3 control-label">类型</label>
						<div class="col-sm-8"><input type="text" class="form-control" id="unit_type"></div>
					</div>
					<div class="form-group form-group-sm">
						<label class="col-sm-3 control-label">地址</label>
						<div class="col-sm-8"><input type="text" class="form-control" id="unit_address"></div>
					</div>
					<div class="form-group form-group-sm">
						<label class="col-sm-3 control-label">代理方姓名</label>
						<div class="col-sm-8"><input type="text" class="form-control" id="unit_proxy_name"></div>
					</div>
					<div class="form-group form-group-sm">
						<label class="col-sm-3 control-label">代理方颜色</label>
						<div class="col-sm-8"><input type="text" class="form-control" id="unit_proxy_color"></div>
					</div>
					<div class="form-group form-group-sm">
						<label class="col-sm-3 control-label">关键字</label>
						<div class="col-sm-8"><input type="text" class="form-control" id="unit_keyword"></div>
					</div>
				</form>
				
			  </div>
			  <div class="tab-pane fade" id="reco">
				  <table class="table table-striped table-bordered table-condensed" id="recoTable">
				  <thead>
					<tr>
						<th>中文名称</th>
						<th>英文名称</th>
						<th>公司电话</th>
						<th>联系人</th>
						<th>联系电话</th>
						<th>备注信息</th>
					</tr>
					</thead>
					<tbody id="recoTableBody">  
					</tbody>
					</table>
			  </div>
			  <div class="tab-pane fade" id="rese">
				  <table class="table table-striped table-bordered table-condensed" id="reseTable">
					  <thead>
						<tr>
							<th>中文名称</th>
							<th>英文名称</th>
							<th>公司电话</th>
							<th>联系人</th>
							<th>联系电话</th>
							<th>备注信息</th>
						</tr>
						</thead>
						<tbody id="reseTableBody">  
						</tbody>
						</table>
				</div>
			  <div class="tab-pane fade" id="sign">
				<table class="table table-striped table-bordered table-condensed" id="signTable">
				  <thead>
					<tr>
						<th>中文名称</th>
						<th>英文名称</th>
						<th>公司电话</th>
						<th>联系人</th>
						<th>联系电话</th>
						<th>备注信息</th>
					</tr>
					</thead>
					<tbody id="signTableBody">  
					</tbody>
					</table>
			  </div> 
			  <div class="tab-pane fade" id="pay">
				<table class="table table-striped table-bordered table-condensed" id="payTable">
				  <thead>
					<tr>
						<th>中文名称</th>
						<th>英文名称</th>
						<th>公司电话</th>
						<th>联系人</th>
						<th>联系电话</th>
						<th>备注信息</th>
					</tr>
					</thead>
					<tbody id="payTableBody">  
					</tbody>
				</table>
			  </div>
			</div>
		 </div>
	
            <div class="modal-footer">
              <a id="closeD" href="#" class="btn btn-default" data-dismiss="modal">关闭</a>
            </div>
          </div>
        </div>
      </div>
	  
	  <div class="modal fade" id="companyModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content"> 
            <div class="modal-body">
				<ul class="nav nav-pills" id="myTab">
					<li class="active"><a href="#companyDetail" data-toggle="pill">详细信息</a></li>
					<li><a href="#companys" data-toggle="pill">已有公司</a></li>
				</ul>
				<!-- Tab panes -->
			<div class="tab-content">
				 <div class="tab-pane fade in active" id="companyDetail">
					  <form  class="form-horizontal" role="form">	
						<div class="form-group form-group-sm">
							<label class="col-sm-3 control-label">中文名称</label>
							<div class="col-sm-8"><input type="text" class="form-control" id="company_name_ch"></div>
						</div>		
						<div class="form-group form-group-sm">
							<label class="col-sm-3 control-label">英文名称</label>
							<div class="col-sm-8"><input type="text" class="form-control" id="company_name_en"></div>
						</div>					
						<div class="form-group form-group-sm">
							<label class="col-sm-3 control-label">公司简称</label>
							<div class="col-sm-8"><input type="text" class="form-control" id="show_name"></div>
						</div>	
						<div class="form-group form-group-sm">
							<label class="col-sm-3 control-label">公司电话</label>
							<div class="col-sm-8"><input type="text" class="form-control" id="phone"></div>
						</div>	
						<div class="form-group form-group-sm">
							<label class="col-sm-3 control-label">公司联系人</label>
							<div class="col-sm-8"><input type="text" class="form-control" id="con_per"></div>
						</div>	
						<div class="form-group form-group-sm">
							<label class="col-sm-3 control-label">联系人手机</label>
							<div class="col-sm-8"><input type="text" class="form-control" id="contact"></div>
						</div>	
						<div class="form-group form-group-sm">
							<label class="col-sm-3 control-label">邮箱地址</label>
							<div class="col-sm-8"><input type="text" class="form-control" id="email"></div>
						</div>	
						<div class="form-group form-group-sm">
							<label class="col-sm-3 control-label">填充颜色</label>
							<div class="col-sm-8"><input type="text" class="form-control" id="company_color"></div>
						</div>	
						<div class="form-group form-group-sm">
							<label class="col-sm-3 control-label">中文地址</label>
							<div class="col-sm-8"><input type="text" class="form-control" id="address_ch"></div>
						</div>	
						<div class="form-group form-group-sm">
							<label class="col-sm-3 control-label">英文地址</label>
							<div class="col-sm-8"><input type="text" class="form-control" id="address_en"></div>
						</div>	
						<div class="form-group form-group-sm">
							<label class="col-sm-3 control-label">备注信息</label>
							<div class="col-sm-8"><input type="text" class="form-control" id="other_info"></div>
						</div>	
						<div class="form-group form-group-sm">
							<label class="col-sm-3 control-label">备用联系方式</label>
							<div class="col-sm-8"><input type="text" class="form-control" id="alt_con"></div>
						</div>	
						<div class="form-group form-group-sm">
							<label class="col-sm-3 control-label">售出类型</label>
							<div class="col-sm-8" id="state">
								<label class="radio-inline">
								  <input type="radio" name="radio" value="reco_company_id" checked> 推荐
								</label>
								<label class="radio-inline">
								  <input type="radio" name="radio" value="rese_company_id"> 预留
								</label>
								<label class="radio-inline">
								  <input type="radio" name="radio" value="sign_company_id"> 签约
								</label>
								<label class="radio-inline">
								  <input type="radio" name="radio" value="pay_company_id"> 付款
								</label>
							</div>
						</div>
						 <div class="form-group form-group-sm">
							<div class="col-sm-offset-5 col-sm-6">
							  <a id="subB" href="#" class="btn btn-primary" data-dismiss="modal">提交</a>
							</div>
						  </div>
					   </form> 
					</div>
					<div class="tab-pane fade" id="companys">
						<table class="table table-striped table-bordered table-condensed" id="companysTable" align="center">
						   <thead>
							<tr>
								<th>公司简称</th>
								<th>英文名称</th>
								<th>状态</th>
								<th>修改状态</th>
								<th>操作</th>
							</tr>
							</thead>
							<tbody id="companysTableBody">  
							</tbody>
						</table>
					</div>
			 </div>
            </div>
            <div class="modal-footer">
              <a href="#" class="btn btn-default" data-dismiss="modal">关闭</a>
            </div>
          </div>
        </div>
      </div>
	  
      <div class="modal fade" id="searchModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
              <h4 class="modal-title" id="myModalLabel">搜索结果</h4>
            </div>
            <div class="modal-body">
              <div id="searchModalBody" class="list-group">
              </div>
            </div>
            <div class="modal-footer">
              <button id="closeSearchModal" type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
            </div>
          </div>
        </div>
      </div>
	
	 <div class="modal fade" id="proxyModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
              <h4 class="modal-title" id="myModalLabel">分配代理</h4>
            </div>
            <div class="modal-body">			
				<div class="panel panel-success">
				  <div class="panel-heading">已选择的展位编号</div>
				  <div class="panel-body">112</div>
				</div>
			
				<div class="panel panel-info">
				  <div class="panel-heading">可选择的代理方</div>
					<div id="proxyModalBody" class="list-group">
					</div>  
				</div>         
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
            </div>
          </div>
       </div>
     </div>
	 
      <div class="modal fade" id="historyModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
              <h4 class="modal-title" id="myModalLabel">编辑历史</h4>
            </div>
            <div class="modal-body">
              <div id="historyModalBody" class="list-group">
              </div>
            </div>
            <div class="modal-footer">
              <button id="closeHistoryModal" type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
            </div>
          </div>
        </div>
	  </div>
		
	 <div class="modal fade" id="colorModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal">×</button>
						<h3>展位涂色</h3>
					</div>
					
						<div class="modal-body">					
							<form  class="form-horizontal" role="form">	
								<div class="form-group form-group-sm">
									<label class="col-sm-3 control-label">填充颜色</label>
									<div class="col-sm-8"><input type="text" class="form-control" id="block_color"></div>
								</div>
								
								<div class="form-group form-group-sm">
									<label class="col-sm-3 control-label">字体颜色</label>
									<div class="col-sm-8"><input type="text" class="form-control" id="font_color"></div>
								</div>
								
								<div class="form-group form-group-sm">
									<label class="col-sm-3 control-label">文字方向</label>
									<div class="col-sm-8" id="rotate">
										<label class="radio-inline">
										  <input type="radio" name="radio" value="1" checked> 横向
										</label>
										<label class="radio-inline">
										  <input type="radio" name="radio" value="0"> 纵向
										</label>
									</div>
								</div>
							</form>  
						</div>
						<div class="modal-footer">
							<button id="subC" class="btn btn-primary">涂色</button>
						</div>					
				</div>
			</div>
	</div>
	
	<div class="modal fade" id="detailModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal">×</button>
						<h3></h3>
					</div>					
					<form  id="block_form" class="form-horizontal" role="form">	
						<div class="modal-body">	
								<div class="form-group form-group-sm">
									<label class="col-sm-3 control-label"><span class="formStar"> * </span>商铺编号</label>
									<div class="col-sm-8"><input type="text" class="form-control" id="block_num" required></div>
								</div>			
								<div class="form-group form-group-sm">
									<label class="col-sm-3 control-label">起点位置</label>
									<div class="col-sm-8" id="startP">
										<label class="radio-inline">
										  <input type="radio" name="start" value="left" checked> 左上角
										</label>
										<label class="radio-inline">
										  <input type="radio" name="start" value="right"> 右下角
										</label>
									</div>
								</div>		
								<div class="form-group form-group-sm">
									<label class="col-sm-3 control-label"><span class="formStar"> * </span>长度</label>
									<div class="col-sm-3"><input type="number" min="1" class="form-control" id="block_length" required></div>
									
									<label class="col-sm-2 control-label"><span class="formStar"> * </span>宽度</label>
									<div class="col-sm-3"><input type="number" min="1" class="form-control" id="block_width" required></div>
								</div>

								<div class="form-group form-group-sm">
									<label class="col-sm-3 control-label"><span class="formStar"> * </span>面积</label>
									<div class="col-sm-3"><input type="number" min="0" max="1000" class="form-control" id="block_area" required></div>
									
									<label class="col-sm-2 control-label">参考面积</label>
									<div class="col-sm-3"><input type="number" class="form-control" id="block_refArea" disabled></div>
								</div>
								
								<div class="form-group form-group-sm">
									<label class="col-sm-3 control-label">展位名称</label>
									<div class="col-sm-8"><input type="text" class="form-control" id="block_show_name"></div>
								</div>
								<div class="form-group form-group-sm">
									<label class="col-sm-3 control-label">开放时间</label>
									<div class="col-sm-8"><input type="text" class="form-control" id="block_time"></div>
								</div>
								<div class="form-group form-group-sm">
									<label class="col-sm-3 control-label">类型</label>
									<div class="col-sm-8"><input type="text" class="form-control" id="block_type"></div>
								</div>
								<div class="form-group form-group-sm">
									<label class="col-sm-3 control-label">地址</label>
									<div class="col-sm-8"><input type="text" class="form-control" id="block_address"></div>
								</div>
								<div class="form-group form-group-sm">
									<label class="col-sm-3 control-label">代理方编号</label>
									<div class="col-sm-8"><input type="text" class="form-control" id="block_proxy_id"></div>
								</div>
								<div class="form-group form-group-sm">
									<label class="col-sm-3 control-label">关键字</label>
									<div class="col-sm-8"><input type="text" class="form-control" id="block_keyword"></div>
								</div> 
								<div class="alert alert-success" role="alert" id="operation_info">请点击添加按钮并在地图上点击合适的位置</div>
						</div>
						<div class="modal-footer">
						  <a  href="#" class="btn btn-default" data-dismiss="modal">关闭</a>
						  <button id="subA" type="submit" class="btn btn-primary"></button>	
						</div>	
					</form> 
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
      
      <div class="modal fade" id="showProxy" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal">×</button>
						<h3>个人资料</h3>
					</div>
					<div class="modal-body" >
					 <form class="form-horizontal" role="form">
							<div class="form-group form-group-sm has-success">
								<label class="col-sm-3 control-label">代理编号</label>
								<div class="col-sm-8"><input type="text" class="form-control" id="show_id"></div>
							</div>
							<div class="form-group form-group-sm has-success">
								<label class="col-sm-3 control-label">公司全称</label>
								<div class="col-sm-8"><input type="text" class="form-control" id="show_proxyname"></div>
							</div>
							<div class="form-group form-group-sm has-success">
								<label class="col-sm-3 control-label">公司简称</label>
								<div class="col-sm-8"><input type="text" class="form-control" id="show_showname"></div>
							</div>
							<div class="form-group form-group-sm has-success">
								<label class="col-sm-3 control-label">登录密码</label>
								<div class="col-sm-8"><input type="text" class="form-control" id="show_password"></div>
							</div>
							<div class="form-group form-group-sm has-success">
								<label class="col-sm-3 control-label">公司电话</label>
								<div class="col-sm-8"><input type="text" class="form-control" id="show_phone"></div>
							</div>
							<div class="form-group form-group-sm has-success">
								<label class="col-sm-3 control-label">公司负责人</label>
								<div class="col-sm-8"><input type="text" class="form-control" id="show_con_per"></div>
							</div>
							<div class="form-group form-group-sm has-success">
								<label class="col-sm-3 control-label">负责人电话</label>
								<div class="col-sm-8"><input type="text" class="form-control" id="show_contact"></div>
							</div>
							<div class="form-group form-group-sm has-success">
								<label class="col-sm-3 control-label">电子邮箱</label>
								<div class="col-sm-8"><input type="text" class="form-control" id="show_email"></div>
							</div>
							<div class="form-group form-group-sm has-success">
								<label class="col-sm-3 control-label">联系地址</label>
								<div class="col-sm-8"><input type="text" class="form-control" id="show_address"></div>
							</div>
							<div class="form-group form-group-sm has-success">
								<label class="col-sm-3 control-label">填充颜色</label>
								<div class="col-sm-8"><input type="text" class="form-control" id="show_color"></div>
							</div>
							<div class="form-group form-group-sm has-success">
								<label class="col-sm-3 control-label">备注信息</label>
								<div class="col-sm-8"><input type="text" class="form-control" id="show_info"></div>
							</div>
					</form>
					</div>
					<div class="modal-footer">
					<a id="closeD" href="#" class="btn btn-default" data-dismiss="modal">关闭</a>
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
	<script src="js/jquery.colorPicker.js"></script>
	<script type="text/javascript" src="js/jspdf.js"></script>
	<script type="text/javascript" src="js/adler32cs.js"></script>
	<script type="text/javascript" src="js/FileSaver.js"></script>
	<script type="text/javascript" src="js/BlobBuilder.js"></script>
	<script type="text/javascript" src="js/jspdf.plugin.addimage.js"></script>
	<script>
	</script>
</html>
