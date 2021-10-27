package com.daumsoft.taSolutionManager.restFullApi.domain;

import org.apache.ibatis.type.Alias;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper=false)
@Alias("preProcessor")
public class PreProcessor extends BaseDomain{

	private Integer preprocessorSeq;
	private String name;
	private String parameters;
	private String supportedExtension;
	private Integer useFlag;
	private String writer;
	private String description;
	private String applycation;

}
