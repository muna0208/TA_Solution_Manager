package com.daumsoft.taSolutionManager.restFullApi.domain;

import lombok.Data;

@Data
public class BaseDomain {
	
	private String userId;
	private Integer deleteFlag;
	private String createDatetime;

}
