package com.Exhibition.util;
import java.io.IOException;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

public class SecurityFilter implements Filter{
	@Override
	public void destroy() {
		// TODO Auto-generated method stub
		
	}
	@Override
	public void doFilter(ServletRequest request, ServletResponse response,
			FilterChain chain) throws IOException, ServletException {
			HttpServletRequest req = (HttpServletRequest)request;
			HttpServletResponse res = (HttpServletResponse) response;
			HttpSession session = req.getSession();
			String path = req.getServletPath();
			System.out.println(path);
			System.out.println(session.getAttribute("admin"));
			System.out.println(session.getAttribute("proxy"));
			System.out.println(session.getAttribute("visitor"));
		if(!"/index.html".equals(path)&&!"/login.html".equals(path)&&!"/index.jsp".equals(path)){
				if(session.getAttribute("admin") != null){
					//页面加前缀或者后缀_proxy,根据path是否包含，判断是否继续或者跳转
					if( path.contains("ad_")) {
						chain.doFilter(request, response);
					}else {
						res.sendRedirect("index.jsp");
					}
				}else if ( session.getAttribute("proxy") != null ){
					if( path.contains("pr_")) {
						chain.doFilter(request, response);
					}else {
						res.sendRedirect("index.jsp");
					}
				}else if ( session.getAttribute("visitor") != null ){
					if( path.contains("vi_")) {
						chain.doFilter(request, response);
					}else {
						res.sendRedirect("index.jsp");
					}
				}else {
					res.sendRedirect("index.jsp");
				}
				
			}else{
				chain.doFilter(request, response);
			}
	}
	
	@Override
	public void init(FilterConfig arg0) throws ServletException {
		// TODO Auto-generated method stub
		
	}

}
