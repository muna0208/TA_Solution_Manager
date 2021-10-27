package com.daumsoft.taSolutionManager.restFullApi.domain;

import org.apache.ibatis.type.Alias;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper=false)
@Alias("dicMorphNm")
public class DicMorphNm extends BaseDomain{

	private Integer nmSeq;
	private String word;
	private String tag;
	private String addInfo1;
	private String addInfo2;
	
	private String tagName;
	
	
}
