package com.daumsoft.taSolutionManager.restFullApi.domain;

import org.apache.ibatis.type.Alias;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper=false)
@Alias("model")
public class Model extends BaseDomain{

	private Integer modelSeq;
	private Integer projectSeq;
	private Integer algorithmSeq;
	private Integer trainData;
	private Integer validationData;
	private Integer evaluationData;
	private Integer embeddingModel;
	private Integer pretrainedModel;
	private String name;
	private String path;
	private String fileName;
	private String parameters;
	private String trainResult;
	private String evaluationResult;
	private String trainState;
	private String trainErrMsg;
	private String trainStartDateTime;
	private String trainEndDateTime;
	private String evaluationState;
	private String evaluationErrMsg;
	private String evaluationStartDateTime;
	private String evaluationEndDateTime;
	private String celeryTaskId;
	
	
	private String trainDataName;
	private String validationDataName;
	private String evaluationDataName;
	private String algorithmName;
	private String projectName;
	private String embeddingModelName;
	private String embeddingProjectName;
	private String pretrainedModelName;
	private String pretrainedModelProjectName;
	private String trainDiffDateTime;
	private String evaluationDiffDateTime;
	
	private String target;
	private String option;
	private Integer domainFlag;
}
