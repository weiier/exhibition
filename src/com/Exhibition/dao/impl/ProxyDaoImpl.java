package com.Exhibition.dao.impl;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.orm.hibernate3.HibernateTemplate;
import org.springframework.stereotype.Component;
import com.Exhibition.dao.ProxyDao;
import com.Exhibition.model.Admin;
import com.Exhibition.model.Proxy;

@Component
public class ProxyDaoImpl  implements ProxyDao{
	private HibernateTemplate hibernateTemplate;

	@Override
	public Proxy checkProxy(String name, String password) {
		List<Proxy> proxys = hibernateTemplate.find("from Proxy p where p.proxy_id='"+name
				+"' and p.password='"+password+"'");
		if( proxys != null && proxys.size() >0 ){
			return proxys.get(0);
		}
		return null;
	}

	public HibernateTemplate getHibernateTemplate() {
		return hibernateTemplate;
	}
	@Resource
	public void setHibernateTemplate(HibernateTemplate hibernateTemplate) {
		this.hibernateTemplate = hibernateTemplate;
	}
	
}
