package com.daumsoft.taSolutionManager.restFullApi.domain;

import org.apache.ibatis.type.Alias;

import lombok.Data;

@Data
@Alias("monitDicApply")
public class MonitDicApply {

	private Integer id;
	private String name;
	private String path;
	private String state;
	private String stateError;
	private Integer applyCnt;
	private String applyStartTime;
	private String applyEndTime;
	private String applyRunTime;
	
	
	private String morphDicIds;
	private String objectDicIds;
	private String delay;
		
	
}
