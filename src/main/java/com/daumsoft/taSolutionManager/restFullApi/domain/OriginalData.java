package com.daumsoft.taSolutionManager.restFullApi.domain;

import org.apache.ibatis.type.Alias;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper=false)
@Alias("originalData")
public class OriginalData extends BaseDomain{
	private Integer originalDataSeq;
	private String originalFileName;
	private String storedFileName;
	private String extension;
	private String path;
	private String description;
	private Long fileSize;
	
	private String parentPath;
}
