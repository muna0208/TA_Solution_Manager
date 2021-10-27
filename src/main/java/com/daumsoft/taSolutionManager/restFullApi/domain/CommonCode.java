package com.daumsoft.taSolutionManager.restFullApi.domain;

import org.apache.ibatis.type.Alias;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper=false)
@Alias("commonCode")
public class CommonCode extends BaseDomain{

	private String gropuCode;
	private String groupCodeName;
	
	private String comnCode;
	private String groupCode;
	private String comnCodeName;
	private String description;
	private Integer codeOrder;
	  	
	
	
}
