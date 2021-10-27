package com.daumsoft.taSolutionManager.restFullApi.domain;

import org.apache.ibatis.type.Alias;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper=false)
@Alias("preProcessedData")
public class PreProcessedData extends BaseDomain{

	private Integer preprocessedDataSeq;
	private Integer originalDataSeq;
	private Integer preprocessorSeq;
	private String name;
	private String fileName;
	private String extension;
	private String path;
	private String parameters;
	private String columns;
	private String labelInfo;
	private String amount;
	private String sample;
	private String state;
	private String startDatetime;
	private String endDatetime;
	private String celeryTaskId;
	private String description;
	
	private String task;
	private String diffDateTime;
	private String preprocessorName;
	private String originalDataName;
}
