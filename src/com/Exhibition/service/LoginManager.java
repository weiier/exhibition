package com.Exhibition.service;

import javax.annotation.Resource;

import org.springframework.stereotype.Component;

import com.Exhibition.dao.AdminDao;
import com.Exhibition.dao.ProxyDao;

@Component
public class LoginManager {
	private AdminDao adminDao;
	private ProxyDao proxyDao;
	public Object checkLoginers(String username,String password,String state){
			if(state.equals("0")) {
				return adminDao.checkAdmin(username, password);
			} else if(state.equals("1")) {
				return proxyDao.checkProxy(username, password);
			} else if(state.equals("2")) {
				return "visitor";
			}
			return null;
	}
	
	public AdminDao getAdminDao() {
		return adminDao;
	}
	@Resource
	public void setAdminDao(AdminDao adminDao) {
		this.adminDao = adminDao;
	}

	public ProxyDao getProxyDao() {
		return proxyDao;
	}
	@Resource
	public void setProxyDao(ProxyDao proxyDao) {
		this.proxyDao = proxyDao;
	}
	
}
