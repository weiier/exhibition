package com.Exhibition.dao.impl;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.orm.hibernate3.HibernateTemplate;
import org.springframework.stereotype.Component;

import com.Exhibition.dao.AdminDao;
import com.Exhibition.model.Admin;

@Component("adminDao")
public class AdminDaoImpl  implements AdminDao{
	private HibernateTemplate hibernateTemplate;
	@Override
	public Admin checkAdmin(String name, String password) {
		List<Admin> admins = hibernateTemplate.find("from Admin a where a.username='"+name
				+"' and a.password='"+password+"'");
		if(admins.size() > 0 && admins != null) {
				return admins.get(0);
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
