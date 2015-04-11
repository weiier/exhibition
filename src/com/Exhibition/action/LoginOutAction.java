package com.Exhibition.action;
import java.util.Map;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;
import com.opensymphony.xwork2.ActionContext;
import com.opensymphony.xwork2.ActionSupport;
@Component
public class LoginOutAction extends ActionSupport{
	@Override
	public String execute(){
		Map<String, Object> session = ActionContext.getContext().getSession();
		System.out.println(session+"loginout~~~");
		session.remove("admin");
		session.remove("proxy");
		session.remove("visitor");
		session.clear();
		System.out.println(session+"loginout~~~");
		return "loginout";
	}
}
