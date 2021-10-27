package com.daumsoft.taSolutionManager.restFullApi.domain;

import org.apache.ibatis.type.Alias;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper=false)
@Alias("demonService")
public class DemonService extends BaseDomain{

	private Integer demonServiceSeq;
	private Integer projectSeq;
	private Integer modelSeq;
	private String name;
	
	private String projectName;
	private String modelName;
	private String content;
}
