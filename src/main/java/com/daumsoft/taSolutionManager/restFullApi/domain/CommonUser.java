package com.daumsoft.taSolutionManager.restFullApi.domain;

import org.apache.ibatis.type.Alias;

import lombok.Data;

@Data
@Alias("commonUser")
public class CommonUser {
	private int id;
	private String userId;
	private String userName;
	private String email;
	private String userPw;
	private String lastAccessDate;
	private boolean useFlag;
	private String userAuth;
	private String registerDate;
	private String registerer;
	private String updateDate;
	private String updater;
	private String option;
	private String phoneNumber;
}
