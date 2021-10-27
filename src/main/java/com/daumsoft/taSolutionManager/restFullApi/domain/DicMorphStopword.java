package com.daumsoft.taSolutionManager.restFullApi.domain;

import org.apache.ibatis.type.Alias;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper=false)
@Alias("dicMorphStopword")
public class DicMorphStopword extends BaseDomain{

	private Integer stopwordSeq;
	private String word;
	
}
