package com.daumsoft.taSolutionManager.restFullApi.domain;

import org.apache.ibatis.type.Alias;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper=false)
@Alias("monitServer")
public class MonitServer extends BaseDomain{

	private Integer serverSeq;
	private String ip;
	private Integer port;
	private String serviceName;
	private String state;
	private String connectId;
	private String modulePath;
	private String commandRun;
	private String commandState;
	private String commandKill;
	
}
