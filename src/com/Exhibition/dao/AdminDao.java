package com.Exhibition.dao;
import com.Exhibition.model.Admin;

public interface AdminDao {
		public Admin checkAdmin(String name,String password);
}
