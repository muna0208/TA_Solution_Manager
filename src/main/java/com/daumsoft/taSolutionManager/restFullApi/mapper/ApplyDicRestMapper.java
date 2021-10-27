package com.daumsoft.taSolutionManager.restFullApi.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.daumsoft.taSolutionManager.restFullApi.domain.MonitDicApply;

@Mapper
public interface ApplyDicRestMapper {

	List<MonitDicApply> getApplyDicList();

}
