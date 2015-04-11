package com.Exhibition.model;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
@Entity
@Table(name="tb_proxy")
public class Proxy {
	private String proxy_id;
	private String show_name;
	private String proxy_name;
	private String password;
	private String email;
	private String phone;
	private String address;
	private String proxy_color;
	private String contact;
	private String con_per;
	private String other_info;
	@Id
	public String getProxy_id() {
		return proxy_id;
	}
	public void setProxy_id(String proxy_id) {
		this.proxy_id = proxy_id;
	}
	public String getShow_name() {
		return show_name;
	}
	public void setShow_name(String show_name) {
		this.show_name = show_name;
	}
	public String getProxy_name() {
		return proxy_name;
	}
	public void setProxy_name(String proxy_name) {
		this.proxy_name = proxy_name;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getPhone() {
		return phone;
	}
	public void setPhone(String phone) {
		this.phone = phone;
	}
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	public String getProxy_color() {
		return proxy_color;
	}
	public void setProxy_color(String proxy_color) {
		this.proxy_color = proxy_color;
	}
	public String getContact() {
		return contact;
	}
	public void setContact(String contact) {
		this.contact = contact;
	}
	public String getCon_per() {
		return con_per;
	}
	public void setCon_per(String con_per) {
		this.con_per = con_per;
	}
	public String getOther_info() {
		return other_info;
	}
	public void setOther_info(String other_info) {
		this.other_info = other_info;
	}
	
}
