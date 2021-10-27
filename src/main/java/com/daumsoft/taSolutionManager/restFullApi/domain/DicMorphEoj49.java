package com.daumsoft.taSolutionManager.restFullApi.domain;

import org.apache.ibatis.type.Alias;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper=false)
@Alias("dicMorphEoj49")
public class DicMorphEoj49 extends BaseDomain{

	private Integer eoj49Seq;
	private String eojeol;
	private String result;
	private String freq;
	
}
