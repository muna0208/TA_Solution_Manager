package com.daumsoft.taSolutionManager.common.service;

import java.util.ArrayList;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import com.daumsoft.taSolutionManager.common.utils.EncryptionUtil;
import com.daumsoft.taSolutionManager.restFullApi.domain.User;
import com.daumsoft.taSolutionManager.restFullApi.service.UserRestService;

@Component
public class UserAuthenticationProvider implements AuthenticationProvider{

	@Autowired(required = false)
	private HttpServletRequest request;
	
	@Autowired
	private UserRestService userService;

/*
 * *** Redis Session clustering ****	
	@Autowired
	private UserRestDao userRestDao;
*/
	@Value("${isIntegration}")
	private boolean isIntegration;
	
	@Override
	public Authentication authenticate(Authentication authentication) throws AuthenticationException {
		String userId = authentication.getName();
		String userPw = (String) authentication.getCredentials();
		
		User user = new User();
		user.setUserId(userId);
        try {
			user.setUserPw(EncryptionUtil.encrypt(userPw));
		} catch (Exception e) {
			e.printStackTrace();
		}
        
//        if( isIntegration ) user = userRestDao.getUserInfo(user);
//		else				user = userService.getUserInfo(user);
        user = userService.getUserInfo(user);
        
        if( user == null ) throw new BadCredentialsException("Login Error !!");
        
        user.setUserPw(null);
        
        // 마지막 접속 업데이트
//        if( isIntegration ) userRestDao.updateLastAccessDate(user.getId());
//		else				userService.updateLastAccessDate(user.getId());
        userService.updateLastAccessDate(user.getId());
        
        // 유저정보 세션에 저장
        userService.createSession(request, user);
        
		ArrayList<SimpleGrantedAuthority> authorities = new ArrayList<>();
        if( "admin".equals(user.getUserAuth()) ) {
        	authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
        }else {
        	authorities.add(new SimpleGrantedAuthority("ROLE_USER"));	
		}
		
		return new UsernamePasswordAuthenticationToken(user.getId(), null, authorities);
	}

	@Override
	public boolean supports(Class<?> authentication) {
		return authentication.equals(UsernamePasswordAuthenticationToken.class);
	}
	

}
