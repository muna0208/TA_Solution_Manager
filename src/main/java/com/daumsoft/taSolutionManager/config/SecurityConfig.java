package com.daumsoft.taSolutionManager.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

import com.daumsoft.taSolutionManager.common.service.UserAuthenticationProvider;

@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter{
	
	@Autowired
	private UserAuthenticationProvider authenticationProvider;
	
	@Override
	protected void configure(HttpSecurity http) throws Exception{
		
		http.csrf().disable(); // rest 통신에서 post 허용
		
		http.authorizeRequests()
		.antMatchers("/userManage").hasAnyRole("ADMIN")
		.antMatchers("/css/**", "/fonts/**", "/images/**", "/gentelella/**", "/js/**", "/login/**").permitAll()
		.antMatchers("/userManage").hasAnyRole("ADMIN")
//	    .antMatchers("/user*").hasAnyRole("ADMIN")
//	    .antMatchers("/**").hasAnyRole("USER", "ADMIN") // 내부적으로 접두어 "ROLE_"가 붙는다.
        .anyRequest().authenticated();
		
//		http.csrf().disable(); // rest 통신에서 post 허용
		
		http.formLogin()
			.loginPage("/login")  // default
			.loginProcessingUrl("/authenticate")
			.failureUrl("/login?error=accountError")
			.defaultSuccessUrl("/preprocessorManage")
            .usernameParameter("userId")
            .passwordParameter("userPw")
            .permitAll();

		http.logout()
            .logoutUrl("/logout") // default
            .logoutSuccessUrl("/login")  // 로그아웃 성공시 페이지
            .invalidateHttpSession(true) // session invalidate
            .deleteCookies("JSESSIONID") // cookie
            .permitAll();
	}
	
	@Override
	protected void configure(AuthenticationManagerBuilder auth) {
		auth.authenticationProvider(authenticationProvider);
	}

}
