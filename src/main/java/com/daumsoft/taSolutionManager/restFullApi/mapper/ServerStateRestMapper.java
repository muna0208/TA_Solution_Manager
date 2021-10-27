package com.daumsoft.taSolutionManager.restFullApi.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.daumsoft.taSolutionManager.restFullApi.domain.MonitServer;

@Mapper
public interface ServerStateRestMapper {

	List<MonitServer> getServerStateList();

	MonitServer getServerState(Integer serverSeq);

	int duplicateCheckServer(MonitServer monitServer);

	void insertServer(MonitServer monitServer);

	void updateServer(MonitServer monitServer);

	void deleteServer(Integer serverSeq);

}
