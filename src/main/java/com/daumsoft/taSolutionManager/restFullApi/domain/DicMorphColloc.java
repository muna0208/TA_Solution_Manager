package com.daumsoft.taSolutionManager.restFullApi.domain;

import org.apache.ibatis.type.Alias;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper=false)
@Alias("dicMorphColloc")
public class DicMorphColloc extends BaseDomain{

	private Integer collocSeq;
	private String input;
	private String isCombine;
	private String result;
	private String nerTag;
	
}
