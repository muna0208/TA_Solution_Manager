package com.daumsoft.taSolutionManager.restFullApi.domain;

import org.apache.ibatis.type.Alias;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper=false)
@Alias("algorithm")
public class Algorithm extends BaseDomain{

	private Integer algorithmSeq;
	private String name;
	private String parameters;
	private String supportedExtension;
	private Integer useFlag;
	private String writer;
	private String description;
	private String applycation;
}
