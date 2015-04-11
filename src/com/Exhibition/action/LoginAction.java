package com.Exhibition.action;
import java.util.Map;
import javax.annotation.Resource;
import org.apache.struts2.interceptor.SessionAware;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import com.Exhibition.service.LoginManager;
import com.opensymphony.xwork2.ActionSupport;
@Component
@Scope("prototype")
public class LoginAction extends ActionSupport implements SessionAware{
	private String username;
	private String password;
	private String state;
	private LoginManager lm;
	private Map<String,Object> session;
	
	public String execute(){
		try {
			Object loginer = lm.checkLoginers(username, password, state);
			if(loginer != null){
				if (state.equals("0")) {
					session.clear();
					session.put("admin",loginer);
					return "admin";
				}else  if(state.equals("1")){
					session.clear();
					session.put("proxy",loginer);
					return "proxy";
				} else if(state.equals("2")){
					session.clear();
					session.put("visitor", loginer);
					return "visitor";
				}else {
					System.out.println("state error");
					return "fail";
				}
			}else {
				System.out.println("null~~~~");
				return "fail";
			} 
		} catch (Exception e) {
			return "fail";
		}
	}
	
	public LoginManager getLm() {
		return lm;
	}
	@Resource
	public void setLm(LoginManager lm) {
		this.lm = lm;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getState() {
		return state;
	}
	public void setState(String state) {
		this.state = state;
	}

	public Map<String, Object> getSession() {
		return session;
	}

	public void setSession(Map<String, Object> session) {
		this.session = session;
	}
	
}
