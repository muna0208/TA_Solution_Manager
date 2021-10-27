package com.daumsoft.taSolutionManager.restFullApi.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.daumsoft.taSolutionManager.restFullApi.domain.DemonService;

@Mapper
public interface DemonRestMapper {

	List<DemonService> getDemonList(String userId);

	DemonService getDemon(Integer demonServiceSeq);

	int duplicateCheckDemonName(String string);

	void insertDemon(DemonService demon);

	void updateDemon(DemonService demon);

}
