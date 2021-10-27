package com.daumsoft.taSolutionManager.restFullApi.domain;

import org.apache.ibatis.type.Alias;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper=false)
@Alias("user")
public class User {
	
	private Integer id;
	private String userId;
	private String userName;
	private String userPw;
	private String email;
	private String lastAccessDate;
	private boolean useFlag;
	private String userAuth;
	private String registerDate;
	private String registerer;
	private String updateDate;
	private String updater;
	
	private String option;
	
}
