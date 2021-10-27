package com.daumsoft.taSolutionManager.restFullApi.domain;

import org.apache.ibatis.type.Alias;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper=false)
@Alias("batchService")
public class BatchService extends BaseDomain{

	private Integer batchServiceSeq;
	private Integer projectSeq;
	private Integer modelSeq;
	private String name;
	private String executionCycle;
	private String batchState;
	private String inputFilePath;
	private String inputFileRule;
	private String outputFilePath;
	private String outputFileRule;
	
	private String projectName;
	private String modelName;
	
}
